import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import { getPaginationParams } from '../utils/pagination.js';

export const getSalesReport = async (query) => {
  const { startDate, endDate, storeId, period } = query;

  const matchQuery = { status: { $in: ['COMPLETED', 'REFUNDED'] } };

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
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-week': {
        start = new Date();
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        end = new Date();
        break;
      }
      case 'this-month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date();
        break;
      case 'this-year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date();
        break;
      default:
        start = new Date();
        start.setDate(start.getDate() - 7);
        end = new Date();
    }
  }

  if (start && end) matchQuery.createdAt = { $gte: start, $lte: end };
  if (storeId && storeId !== 'all') matchQuery.store = new mongoose.Types.ObjectId(storeId);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const [kpiStats, dailyTrends, paymentMethods] = await Promise.all([
    Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$total', 0] } },
          totalRefunds: { $sum: { $cond: [{ $eq: ['$status', 'REFUNDED'] }, '$total', 0] } },
          totalTransactions: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
          avgTicket: { $avg: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$total', null] } },
        },
      },
    ]),
    Order.aggregate([
      { $match: { ...matchQuery, status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone } },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { ...matchQuery, status: 'COMPLETED' } },
      { $unwind: '$payments' },
      { $group: { _id: '$payments.method', count: { $sum: 1 }, total: { $sum: '$payments.amount' } } },
    ]),
  ]);

  const { page, limit, skip } = getPaginationParams(query);
  const totalRecent = await Order.countDocuments(matchQuery);
  const recentTransactions = await Order.find(matchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('orderNumber createdAt items subtotal tax discount discountDetails total payments status customer')
    .populate('customer', 'name');

  const stats = kpiStats[0] || { totalRevenue: 0, totalRefunds: 0, totalTransactions: 0, avgTicket: 0 };

  return {
    kpi: {
      totalRevenue: Math.round(stats.totalRevenue),
      transactions: stats.totalTransactions,
      avgTicket: Math.round(stats.avgTicket || 0),
      netProfit: Math.round(stats.totalRevenue - stats.totalRefunds),
    },
    trends: dailyTrends,
    payments: paymentMethods,
    recent: {
      data: recentTransactions.map((t) => ({
        orderId: t.orderNumber,
        createdAt: t.createdAt,
        items: t.items,
        isPriceAdjusted: t.items.some((item) => item.isPriceOverridden),
        subtotal: t.subtotal,
        tax: t.tax,
        discount: t.discount,
        discountDetails: t.discountDetails,
        total: t.total,
        paymentModes: t.payments.map((p) => ({ name: p.method, amount: p.amount })),
        status: t.status,
        customer: t.customer ? { name: t.customer.name } : null,
      })),
      pagination: { total: totalRecent, page, limit, totalPages: Math.ceil(totalRecent / limit) },
    },
  };
};
