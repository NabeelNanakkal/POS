import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as paymentModeService from '../services/payment-mode.service.js';

export const getPaymentModes = asyncHandler(async (req, res) => {
  const paymentModes = await paymentModeService.getPaymentModes(req.storeId);
  res.json(ApiResponse.success(paymentModes));
});
