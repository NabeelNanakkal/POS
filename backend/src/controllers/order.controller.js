import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as orderService from '../services/order.service.js';

export const getOrders = asyncHandler(async (req, res) => {
  const data = await orderService.getOrders(req.query);
  res.json(ApiResponse.success(data));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.json(ApiResponse.success(order));
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user._id);
  res.status(201).json(ApiResponse.created(order, 'Order created successfully'));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.json(ApiResponse.success(order, 'Order status updated successfully'));
});

export const refundOrder = asyncHandler(async (req, res) => {
  const order = await orderService.refundOrder(req.params.id);
  res.json(ApiResponse.success(order, 'Order refunded successfully'));
});

export const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await orderService.getOrderStats(req.query);
  res.json(ApiResponse.success(stats));
});

export const getTopSellingItems = asyncHandler(async (req, res) => {
  const products = await orderService.getTopSellingItems(req.query.store);
  res.json(ApiResponse.success(products));
});
