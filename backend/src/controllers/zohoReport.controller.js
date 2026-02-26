import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { ZohoSale, ZohoPurchase, ZohoPayment } from '../models/zohoReport.model.js';
import { syncStoreData, getLastSyncStatus } from '../services/zohoReportSync.service.js';
import Integration from '../models/integration.model.js';

// ── Helpers ───────────────────────────────────────────────────────────────────
const toOid = (id) => {
  if (!id) throw new ApiError(400, 'Store context is required');
  return new mongoose.Types.ObjectId(id);
};

const buildDateMatch = (startDate, endDate) => {
  if (!startDate && !endDate) return {};
  const d = {};
  if (startDate) d.$gte = new Date(startDate);
  if (endDate)   d.$lte = new Date(`${endDate}T23:59:59.999Z`);
  return { date: d };
};

// ── GET /zoho-reports/sync-status ─────────────────────────────────────────────
export const getSyncStatus = asyncHandler(async (req, res) => {
  const data = await getLastSyncStatus(req.storeId);
  res.json(ApiResponse.success(data));
});

// ── POST /zoho-reports/sync ───────────────────────────────────────────────────
export const triggerSync = asyncHandler(async (req, res) => {
  const integration = await Integration.findOne({
    store: req.storeId, provider: 'zoho_books', isActive: true,
  });
  if (!integration) throw new ApiError(400, 'Zoho Books is not connected for this store');

  const full = req.query.full === 'true';

  // Fire-and-forget — client gets immediate response
  syncStoreData(req.storeId, { full });

  res.json(ApiResponse.success({ message: full ? 'Full sync started' : 'Incremental sync started' }));
});

// ── GET /zoho-reports/summary ─────────────────────────────────────────────────
export const getSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const storeFilter = { store: toOid(req.storeId) };
  const dateFilter  = buildDateMatch(startDate, endDate);
  const baseMatch   = { ...storeFilter, ...dateFilter, status: { $nin: ['void'] } };

  const [salesAgg, purchasesAgg] = await Promise.all([
    ZohoSale.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id:           null,
          totalSales:    { $sum: '$total' },
          totalPaid:     { $sum: { $subtract: ['$total', '$balance'] } },
          totalUnpaid:   { $sum: '$balance' },
          totalTax:      { $sum: '$totalTax' },
          totalDiscount: { $sum: '$discount' },
          totalRefunds:  { $sum: { $cond: [{ $eq: ['$status', 'void'] }, '$total', 0] } },
          count:         { $sum: 1 },
        },
      },
    ]),
    ZohoPurchase.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id:            null,
          totalPurchases: { $sum: '$total' },
          totalPaid:      { $sum: { $subtract: ['$total', '$balance'] } },
          totalUnpaid:    { $sum: '$balance' },
          count:          { $sum: 1 },
        },
      },
    ]),
  ]);

  const sales     = salesAgg[0]     ? { ...salesAgg[0],     _id: undefined } : {};
  const purchases = purchasesAgg[0] ? { ...purchasesAgg[0], _id: undefined } : {};

  res.json(ApiResponse.success({
    sales,
    purchases,
    profit: (sales.totalSales || 0) - (purchases.totalPurchases || 0),
  }));
});

// ── GET /zoho-reports/sales ───────────────────────────────────────────────────
export const getSales = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, page = 1, limit = 50 } = req.query;

  const storeFilter  = { store: toOid(req.storeId) };
  const dateFilter   = buildDateMatch(startDate, endDate);
  const statusFilter = status ? { status } : { status: { $ne: 'void' } };
  const match        = { ...storeFilter, ...dateFilter, ...statusFilter };

  const skip = (Number(page) - 1) * Number(limit);

  const [docs, totalsAgg, total] = await Promise.all([
    ZohoSale.find(match).sort({ date: -1 }).skip(skip).limit(Number(limit)).lean(),
    ZohoSale.aggregate([
      { $match: match },
      {
        $group: {
          _id:           null,
          totalSales:    { $sum: '$total' },
          totalPaid:     { $sum: { $subtract: ['$total', '$balance'] } },
          totalUnpaid:   { $sum: '$balance' },
          totalTax:      { $sum: '$totalTax' },
          totalDiscount: { $sum: '$discount' },
          count:         { $sum: 1 },
        },
      },
    ]),
    ZohoSale.countDocuments(match),
  ]);

  const totals = totalsAgg[0] ? { ...totalsAgg[0], _id: undefined } : {};

  res.json(ApiResponse.success({
    invoices: docs,
    totals,
    total,
    page:  Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  }));
});

// ── GET /zoho-reports/purchases ───────────────────────────────────────────────
export const getPurchases = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, page = 1, limit = 50 } = req.query;

  const storeFilter  = { store: toOid(req.storeId) };
  const dateFilter   = buildDateMatch(startDate, endDate);
  const statusFilter = status ? { status } : { status: { $ne: 'void' } };
  const match        = { ...storeFilter, ...dateFilter, ...statusFilter };

  const skip = (Number(page) - 1) * Number(limit);

  const [docs, totalsAgg, total] = await Promise.all([
    ZohoPurchase.find(match).sort({ date: -1 }).skip(skip).limit(Number(limit)).lean(),
    ZohoPurchase.aggregate([
      { $match: match },
      {
        $group: {
          _id:            null,
          totalPurchases: { $sum: '$total' },
          totalPaid:      { $sum: { $subtract: ['$total', '$balance'] } },
          totalUnpaid:    { $sum: '$balance' },
          totalTax:       { $sum: '$totalTax' },
          count:          { $sum: 1 },
        },
      },
    ]),
    ZohoPurchase.countDocuments(match),
  ]);

  const totals = totalsAgg[0] ? { ...totalsAgg[0], _id: undefined } : {};

  res.json(ApiResponse.success({
    bills: docs,
    totals,
    total,
    page:  Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  }));
});

// ── GET /zoho-reports/payments ────────────────────────────────────────────────
export const getPayments = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const storeFilter = { store: toOid(req.storeId) };
  const dateFilter  = buildDateMatch(startDate, endDate);
  const match       = { ...storeFilter, ...dateFilter };

  const [breakdown, recent, totalAmount] = await Promise.all([
    ZohoPayment.aggregate([
      { $match: match },
      {
        $group: {
          _id:   '$paymentMode',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]),
    ZohoPayment.find(match).sort({ date: -1 }).limit(50).lean(),
    ZohoPayment.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  const summary = totalAmount[0] ? { total: totalAmount[0].total, count: totalAmount[0].count } : { total: 0, count: 0 };

  res.json(ApiResponse.success({ breakdown, recent, summary }));
});
