import CashSession from '../models/cashSession.model.js';
import CashTransaction from '../models/cashTransaction.model.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const getTodayDate = () => new Date().toISOString().split('T')[0];

// ── Get active (OPEN) session ─────────────────────────────────────────────────
export const getActiveSession = async (storeId, counter = 'MAIN') => {
  return CashSession.findOne({ store: storeId, counter, status: 'OPEN' })
    .populate('openedBy', 'name username');
};

// ── Open a new session ────────────────────────────────────────────────────────
export const openSession = async ({ storeId, counter, openingBalance, userId }) => {
  const date = getTodayDate();

  const existing = await CashSession.findOne({ store: storeId, counter, status: 'OPEN' });
  if (existing) {
    throw new ApiError(400, `Counter "${counter}" already has an open session. Please close it first.`);
  }

  // Prevent second session on the same day for the same counter
  const todaySession = await CashSession.findOne({ store: storeId, counter, date });
  if (todaySession) {
    throw new ApiError(400, `A session already exists for today (${date}) on counter "${counter}". Cannot open another.`);
  }

  const session = await CashSession.create({
    date,
    counter,
    store: storeId,
    openedBy: userId,
    openingBalance,
    expectedBalance: openingBalance,
    status: 'OPEN',
    openedAt: new Date(),
  });

  logger.info(`Cash session opened [${session._id}] | Store: ${storeId} | Counter: ${counter} | Opening: ${openingBalance}`);
  return session.populate('openedBy', 'name username');
};

// ── Add a cash transaction ────────────────────────────────────────────────────
export const addTransaction = async ({ sessionId, storeId, type, amount, reference, description, userId }) => {
  const session = await CashSession.findOne({ _id: sessionId, store: storeId, status: 'OPEN' });
  if (!session) throw new ApiError(404, 'No active cash session found');

  const tx = await CashTransaction.create({
    session: sessionId,
    store: storeId,
    type,
    amount,
    reference,
    description,
    createdBy: userId,
  });

  // Adjust expected balance
  const delta = (type === 'SALE' || type === 'CASH_IN') ? amount : -amount;
  await CashSession.findByIdAndUpdate(sessionId, { $inc: { expectedBalance: delta } });

  return tx;
};

// ── Get full summary (session + per-type totals + transactions) ───────────────
export const getSessionSummary = async (sessionId, storeId) => {
  const session = await CashSession.findOne({ _id: sessionId, store: storeId })
    .populate('openedBy', 'name username')
    .populate('closedBy', 'name username');

  if (!session) throw new ApiError(404, 'Cash session not found');

  const transactions = await CashTransaction.find({ session: sessionId })
    .populate('createdBy', 'name username')
    .sort({ createdAt: -1 });

  const totals = { SALE: 0, REFUND: 0, CASH_IN: 0, CASH_OUT: 0 };
  transactions.forEach(tx => { totals[tx.type] += tx.amount; });

  return {
    session,
    transactions,
    totals: {
      openingBalance: session.openingBalance,
      cashSales: totals.SALE,
      cashIn: totals.CASH_IN,
      cashRefunds: totals.REFUND,
      cashOut: totals.CASH_OUT,
      expectedBalance: session.expectedBalance,
    },
  };
};

// ── Close a session ───────────────────────────────────────────────────────────
export const closeSession = async ({ sessionId, storeId, closingBalance, userId, notes }) => {
  const session = await CashSession.findOne({ _id: sessionId, store: storeId, status: 'OPEN' });
  if (!session) throw new ApiError(404, 'Active cash session not found');

  const difference = closingBalance - session.expectedBalance;

  const closed = await CashSession.findByIdAndUpdate(
    sessionId,
    {
      status: 'CLOSED',
      closingBalance,
      difference,
      closedBy: userId,
      closedAt: new Date(),
      ...(notes && { notes }),
    },
    { new: true }
  )
    .populate('openedBy', 'name username')
    .populate('closedBy', 'name username');

  logger.info(`Cash session closed [${sessionId}] | Expected: ${session.expectedBalance} | Actual: ${closingBalance} | Diff: ${difference}`);
  return closed;
};

// ── List sessions (filterable) ────────────────────────────────────────────────
export const getSessions = async ({ storeId, startDate, endDate, status, counter, page = 1, limit = 20 }) => {
  const query = { store: storeId };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }
  if (status) query.status = status;
  if (counter) query.counter = counter;

  const [sessions, total] = await Promise.all([
    CashSession.find(query)
      .populate('openedBy', 'name username')
      .populate('closedBy', 'name username')
      .sort({ date: -1, openedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    CashSession.countDocuments(query),
  ]);

  return { sessions, total, page: Number(page), pages: Math.ceil(total / limit) };
};

// ── Auto-record cash sale from order (fire-and-forget, non-blocking) ──────────
export const recordCashSale = async ({ storeId, amount, reference, userId }) => {
  try {
    const session = await getActiveSession(storeId);
    if (!session) return; // No open session — skip silently
    await addTransaction({ sessionId: session._id, storeId, type: 'SALE', amount, reference, description: `Cash sale — Order ${reference}`, userId });
  } catch (err) {
    logger.error(`Cash session auto-record (SALE) failed [${reference}]: ${err.message}`);
  }
};

// ── Auto-record cash refund from order (fire-and-forget, non-blocking) ────────
export const recordCashRefund = async ({ storeId, amount, reference, userId }) => {
  try {
    const session = await getActiveSession(storeId);
    if (!session) return;
    await addTransaction({ sessionId: session._id, storeId, type: 'REFUND', amount, reference, description: `Cash refund — Order ${reference}`, userId });
  } catch (err) {
    logger.error(`Cash session auto-record (REFUND) failed [${reference}]: ${err.message}`);
  }
};
