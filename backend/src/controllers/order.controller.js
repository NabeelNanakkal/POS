import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as orderService from '../services/order.service.js';
import { syncOrderToZoho } from '../services/zoho.service.js';

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
  // Fire-and-forget: sync to Zoho Books if order is completed
  // Use req.storeId first; fall back to order.store (handling populated document)
  const storeId = req.storeId || order.store?._id || order.store;
  if (storeId && order.status === 'COMPLETED') syncOrderToZoho(order, storeId);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.json(ApiResponse.success(order, 'Order status updated successfully'));
  // Fire-and-forget: sync when status changes to COMPLETED
  const storeId = req.storeId || order.store?._id || order.store;
  if (storeId && order.status === 'COMPLETED') syncOrderToZoho(order, storeId);
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
