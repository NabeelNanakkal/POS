import mongoose from 'mongoose';
import Order from '../models/Order.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get sales report with filters
 * @route   GET /api/reports/sales
 * @access  Private (Manager, Admin)
 */
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, storeId, period } = req.query;

  // Build match query
  const matchQuery = {
    status: { $in: ['COMPLETED', 'REFUNDED'] } // Include refunded for net calculation? or exclude? Usually reports show net.
  };

  // Date Filter
  let start, end;
  const now = new Date();

  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else if (period) {
    switch (period) {
        case 'today':
            start = new Date();
            start.setHours(0,0,0,0);
            end = new Date();
            end.setHours(23,59,59,999);
            break;
        case 'this-week':
            start = new Date();
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start or keep Sunday
            start.setDate(diff);
            start.setHours(0,0,0,0);
            end = new Date();
            break;
        case 'this-month':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date();
            break;
        case 'this-year':
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date();
            break;
        default:
            // Default last 7 days
            start = new Date();
            start.setDate(start.getDate() - 7);
            end = new Date();
    }
  }

  if (start && end) {
    matchQuery.createdAt = { $gte: start, $lte: end };
  }

  // Store Filter
  if (storeId && storeId !== 'all') {
    matchQuery.store = new mongoose.Types.ObjectId(storeId);
  }

  // 1. KPI Stats
  const kpiStats = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$total", 0] } },
        totalRefunds: { $sum: { $cond: [{ $eq: ["$status", "REFUNDED"] }, "$total", 0] } },
        totalTransactions: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } },
        avgTicket: { $avg: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$total", null] } }
      }
    }
  ]);

  const stats = kpiStats[0] || { totalRevenue: 0, totalRefunds: 0, totalTransactions: 0, avgTicket: 0 };
  const netProfit = stats.totalRevenue - stats.totalRefunds; // Simplified

  // 2. Revenue Trends (Daily)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const dailyTrends = await Order.aggregate([
    { $match: { ...matchQuery, status: 'COMPLETED' } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone } },
        revenue: { $sum: "$total" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // 3. Payment Methods (Grouping by method in payments array)
  const paymentMethods = await Order.aggregate([
    { $match: { ...matchQuery, status: 'COMPLETED' } },
    { $unwind: "$payments" },
    {
      $group: {
        _id: "$payments.method",
        count: { $sum: 1 },
        total: { $sum: "$payments.amount" }
      }
    }
  ]);

  // 4. Recent Transactions with Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const totalRecent = await Order.countDocuments(matchQuery);
    const recentTransactions = await Order.find(matchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('orderNumber createdAt items subtotal tax discount discountDetails total payments status customer')
    .populate('customer', 'name');

  res.json(ApiResponse.success({
    kpi: {
        totalRevenue: Math.round(stats.totalRevenue),
        transactions: stats.totalTransactions,
        avgTicket: Math.round(stats.avgTicket || 0),
        netProfit: Math.round(netProfit)
    },
    trends: dailyTrends,
    payments: paymentMethods,
    recent: {
        data: recentTransactions.map(t => ({
            orderId: t.orderNumber,
            createdAt: t.createdAt,
            items: t.items,
            isPriceAdjusted: t.items.some(item => item.isPriceOverridden),
            subtotal: t.subtotal,
            tax: t.tax,
            discount: t.discount,
            discountDetails: t.discountDetails,
            total: t.total,
            paymentModes: t.payments.map(p => ({ name: p.method, amount: p.amount })),
            status: t.status,
            customer: t.customer ? { name: t.customer.name } : null
        })),
        pagination: {
            total: totalRecent,
            page,
            limit,
            totalPages: Math.ceil(totalRecent / limit)
        }
    }
  }));
});
