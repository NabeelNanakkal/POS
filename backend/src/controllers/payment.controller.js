import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as paymentService from '../services/payment.service.js';

export const getPayments = asyncHandler(async (req, res) => {
  const data = await paymentService.getPayments(req.query);
  res.json(ApiResponse.success(data));
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  res.json(ApiResponse.success(payment));
});

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPayment(req.body);
  res.status(201).json(ApiResponse.created(payment, 'Payment processed successfully'));
});

export const getPaymentStats = asyncHandler(async (req, res) => {
  const stats = await paymentService.getPaymentStats(req.query);
  res.json(ApiResponse.success(stats));
});
