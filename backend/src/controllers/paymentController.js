import Payment from '../models/Payment.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all payments
 * @route   GET /api/payments
 * @access  Private (Manager, Admin)
 */
export const getPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, method, startDate, endDate } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (method) {
    query.method = method;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('order', 'orderNumber total status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Payment.countDocuments(query),
  ]);

  res.json(
    ApiResponse.success({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  );
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('order', 'orderNumber total customer cashier');

  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  res.json(ApiResponse.success(payment));
});

/**
 * @desc    Create payment
 * @route   POST /api/payments
 * @access  Private
 */
export const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);

  const populatedPayment = await Payment.findById(payment._id).populate('order', 'orderNumber total');

  res.status(201).json(ApiResponse.created(populatedPayment, 'Payment processed successfully'));
});

/**
 * @desc    Get payment statistics
 * @route   GET /api/payments/stats
 * @access  Private (Manager, Admin)
 */
export const getPaymentStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchQuery = { status: 'COMPLETED' };

  if (startDate || endDate) {
    matchQuery.createdAt = {};
    if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
    if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
  }

  const stats = await Payment.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$method',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  res.json(ApiResponse.success(stats));
});
