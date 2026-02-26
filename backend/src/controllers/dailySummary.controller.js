import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Store from '../models/store.model.js';
import {
  computeSummary,
  saveSummary,
  getNotificationSettings,
  upsertNotificationSettings,
} from '../services/dailySummary.service.js';

const todayIST = () => {
  // Return today's date as YYYY-MM-DD in IST
  const now = new Date();
  // IST = UTC + 5:30 = +330 minutes
  const ist = new Date(now.getTime() + 330 * 60 * 1000);
  return ist.toISOString().split('T')[0];
};

// ── GET /daily-summary?date=YYYY-MM-DD&storeId= ───────────────────────────────
export const getSummary = asyncHandler(async (req, res) => {
  const storeId = req.storeId || req.query.storeId;
  if (!storeId) throw new ApiError(400, 'Store context is required');

  const date  = req.query.date || todayIST();
  const [data, store] = await Promise.all([
    computeSummary(storeId, date),
    Store.findById(storeId).select('name code').lean(),
  ]);

  res.json(ApiResponse.success({
    ...data,
    storeName: store?.name || '',
    storeCode: store?.code || '',
  }));
});

// ── POST /daily-summary/save?date=YYYY-MM-DD&storeId= ────────────────────────
export const saveDailySummary = asyncHandler(async (req, res) => {
  const storeId = req.storeId || req.query.storeId;
  if (!storeId) throw new ApiError(400, 'Store context is required');

  const date  = req.query.date || todayIST();
  const [data, store] = await Promise.all([
    saveSummary(storeId, date),
    Store.findById(storeId).select('name code').lean(),
  ]);

  res.json(ApiResponse.success({
    ...data,
    storeName: store?.name || '',
    storeCode: store?.code || '',
    message: 'Summary saved successfully',
  }));
});

// ── GET /daily-summary/stores (multi-store dropdown for SUPER_ADMIN) ──────────
export const getStoresList = asyncHandler(async (req, res) => {
  const stores = await Store.find({ isActive: true })
    .select('name code _id')
    .sort({ name: 1 })
    .lean();
  res.json(ApiResponse.success(stores));
});

// ── GET /daily-summary/notification-settings ──────────────────────────────────
export const getSettings = asyncHandler(async (req, res) => {
  if (!req.storeId) throw new ApiError(400, 'Store context is required');
  const data = await getNotificationSettings(req.storeId);
  res.json(ApiResponse.success(data));
});

// ── PUT /daily-summary/notification-settings ──────────────────────────────────
export const updateSettings = asyncHandler(async (req, res) => {
  if (!req.storeId) throw new ApiError(400, 'Store context is required');
  const data = await upsertNotificationSettings(req.storeId, req.body, req.user._id);
  res.json(ApiResponse.success(data));
});
