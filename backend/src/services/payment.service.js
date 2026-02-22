import Payment from '../models/payment.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const getPayments = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { status, method, startDate, endDate } = query;

  const filter = {};
  if (status) filter.status = status;
  if (method) filter.method = method;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('order', 'orderNumber total status')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Payment.countDocuments(filter),
  ]);

  return { payments, pagination: buildPagination(page, limit, total) };
};

export const getPaymentById = async (id) => {
  const payment = await Payment.findById(id).populate('order', 'orderNumber total customer cashier');
  if (!payment) throw ApiError.notFound('Payment not found');
  return payment;
};

export const createPayment = async (data) => {
  const payment = await Payment.create(data);
  return Payment.findById(payment._id).populate('order', 'orderNumber total');
};

export const getPaymentStats = async (query) => {
  const { startDate, endDate } = query;

  const matchQuery = { status: 'COMPLETED' };
  if (startDate || endDate) {
    matchQuery.createdAt = {};
    if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
    if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
  }

  return Payment.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$method', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
};
