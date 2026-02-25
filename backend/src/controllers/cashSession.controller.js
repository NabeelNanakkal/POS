import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as cashSessionService from '../services/cashSession.service.js';

// GET /cash-sessions/active?counter=MAIN
export const getActiveSession = asyncHandler(async (req, res) => {
  const { counter = 'MAIN' } = req.query;
  const session = await cashSessionService.getActiveSession(req.storeId, counter);
  res.json(ApiResponse.success(session));
});

// POST /cash-sessions/open
export const openSession = asyncHandler(async (req, res) => {
  const { openingBalance, counter = 'MAIN' } = req.body;
  const session = await cashSessionService.openSession({
    storeId: req.storeId,
    counter,
    openingBalance: parseFloat(openingBalance),
    userId: req.user._id,
  });
  res.status(201).json(ApiResponse.created(session, 'Cash session opened successfully'));
});

// POST /cash-sessions/movement  (CASH_IN or CASH_OUT)
export const addCashMovement = asyncHandler(async (req, res) => {
  const { sessionId, type, amount, description } = req.body;
  if (!['CASH_IN', 'CASH_OUT'].includes(type)) {
    return res.status(400).json(ApiResponse.error('Type must be CASH_IN or CASH_OUT'));
  }
  const tx = await cashSessionService.addTransaction({
    sessionId,
    storeId: req.storeId,
    type,
    amount: parseFloat(amount),
    description,
    userId: req.user._id,
  });
  res.status(201).json(ApiResponse.created(tx, 'Cash movement recorded'));
});

// GET /cash-sessions/:id/summary
export const getSessionSummary = asyncHandler(async (req, res) => {
  const data = await cashSessionService.getSessionSummary(req.params.id, req.storeId);
  res.json(ApiResponse.success(data));
});

// PATCH /cash-sessions/:id/close
export const closeSession = asyncHandler(async (req, res) => {
  const { closingBalance, notes } = req.body;
  const session = await cashSessionService.closeSession({
    sessionId: req.params.id,
    storeId: req.storeId,
    closingBalance: parseFloat(closingBalance),
    userId: req.user._id,
    notes,
  });
  res.json(ApiResponse.success(session, 'Cash session closed successfully'));
});

// GET /cash-sessions
export const getSessions = asyncHandler(async (req, res) => {
  const data = await cashSessionService.getSessions({ storeId: req.storeId, ...req.query });
  res.json(ApiResponse.success(data));
});
