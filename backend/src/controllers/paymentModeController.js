import PaymentMode from '../models/PaymentMode.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all payment modes
 * @route   GET /api/payment-modes
 * @access  Private
 */
export const getPaymentModes = asyncHandler(async (req, res) => {
  const paymentModes = await PaymentMode.find({ isActive: true });
  res.json(ApiResponse.success(paymentModes));
});
