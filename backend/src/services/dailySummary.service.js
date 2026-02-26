import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import CashTransaction from '../models/cashTransaction.model.js';
import DailySummary from '../models/dailySummary.model.js';
import NotificationSettings from '../models/notificationSettings.model.js';
import { ZohoPurchase } from '../models/zohoReport.model.js';
import Store from '../models/store.model.js';
import logger from '../utils/logger.js';

// ── Date helpers ──────────────────────────────────────────────────────────────

/**
 * Returns [start, end] UTC Date objects for a given YYYY-MM-DD date in IST (UTC+5:30).
 * IST midnight = UTC 18:30:00 of previous calendar day.
 */
const getISTRange = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  // IST 00:00:00 → UTC year/month/(day-1) 18:30:00
  const start = new Date(Date.UTC(year, month - 1, day - 1, 18, 30, 0, 0));
  // IST 23:59:59.999 → UTC year/month/day 18:29:59.999
  const end   = new Date(Date.UTC(year, month - 1, day, 18, 29, 59, 999));
  return { start, end };
};

/** For Zoho purchase dates stored as YYYY-MM-DD midnight UTC */
const getUTCDateRange = (dateStr) => ({
  start: new Date(`${dateStr}T00:00:00.000Z`),
  end:   new Date(`${dateStr}T23:59:59.999Z`),
});

// ── Core computation ──────────────────────────────────────────────────────────

/**
 * Compute a live daily summary for a given store + date.
 * Nothing is persisted — purely aggregated on demand.
 */
export const computeSummary = async (storeId, date) => {
  const storeOid = new mongoose.Types.ObjectId(storeId);
  const { start, end } = getISTRange(date);
  const zohoRange      = getUTCDateRange(date);

  const [salesAgg, refundAgg, paymentBreakdown, expensesAgg, purchaseAgg] = await Promise.all([

    // Completed orders: total revenue + order count
    Order.aggregate([
      { $match: { store: storeOid, status: 'COMPLETED', createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),

    // Refunded orders
    Order.aggregate([
      { $match: { store: storeOid, status: 'REFUNDED', createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),

    // Payment method breakdown from completed orders (unwind multi-payment orders)
    Order.aggregate([
      { $match: { store: storeOid, status: 'COMPLETED', createdAt: { $gte: start, $lte: end } } },
      { $unwind: { path: '$payments', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$payments.method', amount: { $sum: '$payments.amount' } } },
      { $sort: { amount: -1 } },
    ]),

    // Expenses: CASH_OUT transactions from cash management
    CashTransaction.aggregate([
      { $match: { store: storeOid, type: 'CASH_OUT', createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),

    // Purchases from synced Zoho data (fail silently if not set up)
    ZohoPurchase.aggregate([
      {
        $match: {
          store:  storeOid,
          date:   { $gte: zohoRange.start, $lte: zohoRange.end },
          status: { $ne: 'void' },
        },
      },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]).catch(() => []),
  ]);

  const totalSales    = salesAgg[0]?.total    || 0;
  const totalOrders   = salesAgg[0]?.count    || 0;
  const refundAmount  = refundAgg[0]?.total   || 0;
  const refundCount   = refundAgg[0]?.count   || 0;
  const totalExpense  = expensesAgg[0]?.total || 0;
  const totalPurchase = purchaseAgg[0]?.total || 0;

  const cashSales    = paymentBreakdown
    .filter((p) => p._id === 'CASH')
    .reduce((a, p) => a + p.amount, 0);

  const digitalSales = paymentBreakdown
    .filter((p) => p._id !== 'CASH')
    .reduce((a, p) => a + p.amount, 0);

  // Net Profit = Sales − Refunds − Purchases − Expenses
  const netProfit = totalSales - refundAmount - totalPurchase - totalExpense;

  return {
    date,
    totalSales,
    totalOrders,
    cashSales,
    digitalSales,
    refundAmount,
    refundCount,
    totalPurchase,
    totalExpense,
    netProfit,
    paymentBreakdown: paymentBreakdown.map((p) => ({ method: p._id, amount: p.amount })),
  };
};

/**
 * Compute and persist a snapshot to daily_summaries collection.
 * Called by cron or manual "save" action.
 */
export const saveSummary = async (storeId, date) => {
  const data     = await computeSummary(storeId, date);
  const storeOid = new mongoose.Types.ObjectId(storeId);

  await DailySummary.findOneAndUpdate(
    { store: storeOid, date },
    { ...data, store: storeOid, generatedAt: new Date() },
    { upsert: true, new: true },
  );

  return data;
};

// ── Notification Settings ─────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  ownerName: '', whatsappNumber: '', isEnabled: false,
  reportTime: '22:00', timezone: 'Asia/Kolkata',
};

export const getNotificationSettings = async (storeId) => {
  const storeOid = new mongoose.Types.ObjectId(storeId);
  const doc = await NotificationSettings.findOne({ store: storeOid }).lean();
  return doc || DEFAULT_SETTINGS;
};

export const upsertNotificationSettings = async (storeId, data, userId) => {
  const storeOid = new mongoose.Types.ObjectId(storeId);
  const allowed  = ['ownerName', 'whatsappNumber', 'isEnabled', 'reportTime', 'timezone'];
  const payload  = Object.fromEntries(
    Object.entries(data).filter(([k]) => allowed.includes(k)),
  );
  return NotificationSettings.findOneAndUpdate(
    { store: storeOid },
    { ...payload, store: storeOid, updatedBy: userId },
    { upsert: true, new: true },
  );
};

// ── Future: WhatsApp message formatter ────────────────────────────────────────
// Ready for Meta WhatsApp Business API / Twilio / Interakt / WATI integration.
// Call formatWhatsAppMessage() to build the template body before sending.

const fmtINR = (n) =>
  `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)}`;

/**
 * @param {{ storeName: string, data: object }[]} summaries
 * @param {string} date YYYY-MM-DD
 * @returns {string} WhatsApp-ready message body
 */
export const formatWhatsAppMessage = (summaries, date) => {
  const dateLabel = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const lines = [`📊 Daily Store Report — ${dateLabel}`, ''];

  for (const { storeName, data } of summaries) {
    lines.push(`🏪 *${storeName}*`);
    lines.push(`  Sales: ${fmtINR(data.totalSales)}  (${data.totalOrders} orders)`);
    lines.push(`  Cash: ${fmtINR(data.cashSales)}  |  UPI/Card: ${fmtINR(data.digitalSales)}`);
    if (data.refundAmount > 0) lines.push(`  Refunds: ${fmtINR(data.refundAmount)}`);
    lines.push(`  Purchases: ${fmtINR(data.totalPurchase)}`);
    if (data.totalExpense > 0) lines.push(`  Expenses: ${fmtINR(data.totalExpense)}`);
    lines.push(`  *Net Profit: ${fmtINR(data.netProfit)}*`);
    lines.push('');
  }

  if (summaries.length > 1) {
    const totalSales  = summaries.reduce((a, s) => a + (s.data.totalSales  || 0), 0);
    const totalProfit = summaries.reduce((a, s) => a + (s.data.netProfit   || 0), 0);
    lines.push(`💰 *Combined Sales: ${fmtINR(totalSales)}*`);
    lines.push(`📈 *Combined Profit: ${fmtINR(totalProfit)}*`);
  }

  return lines.join('\n');
};

// ── Future: Scheduled cron entry point ───────────────────────────────────────
/**
 * Called by a daily cron at reportTime for each store.
 * Computes, saves, and sends WhatsApp message.
 * Integrate with your chosen WhatsApp provider here.
 *
 * @param {string} storeId
 * @param {string} date   YYYY-MM-DD
 */
export const runScheduledReport = async (storeId, date) => {
  try {
    const settings = await getNotificationSettings(storeId);
    if (!settings.isEnabled || !settings.whatsappNumber) return;

    const store = await Store.findById(storeId).select('name').lean();
    const data  = await saveSummary(storeId, date);
    const msg   = formatWhatsAppMessage([{ storeName: store?.name || 'Store', data }], date);

    // TODO: replace with actual WhatsApp API call
    // await whatsappClient.sendMessage(settings.whatsappNumber, msg);
    logger.info(`[DailySummary] Scheduled report prepared for ${store?.name} on ${date}`);
    logger.debug(msg);
  } catch (err) {
    logger.error(`[DailySummary] Scheduled report failed for store ${storeId}: ${err.message}`);
  }
};
