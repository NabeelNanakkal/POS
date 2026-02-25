import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as orderService from '../services/order.service.js';
import { syncOrderToZoho } from '../services/zoho.service.js';
import { recordCashSale, recordCashRefund } from '../services/cashSession.service.js';

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

  const storeId = req.storeId || order.store?._id || order.store;
  if (storeId && order.status === 'COMPLETED') {
    // Fire-and-forget: sync to Zoho Books
    syncOrderToZoho(order, storeId);

    // Fire-and-forget: record cash payment in active cash session
    const cashAmount = order.payments
      ?.filter(p => p.method?.toUpperCase() === 'CASH')
      .reduce((sum, p) => sum + p.amount, 0) || 0;
    if (cashAmount > 0) {
      recordCashSale({ storeId, amount: cashAmount, reference: order.orderNumber, userId: req.user._id });
    }
  }
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.json(ApiResponse.success(order, 'Order status updated successfully'));

  const storeId = req.storeId || order.store?._id || order.store;
  if (storeId && order.status === 'COMPLETED') {
    syncOrderToZoho(order, storeId);
  }
});

export const refundOrder = asyncHandler(async (req, res) => {
  const order = await orderService.refundOrder(req.params.id);
  res.json(ApiResponse.success(order, 'Order refunded successfully'));

  // Fire-and-forget: record cash refund in active cash session
  const storeId = req.storeId || order.store?._id || order.store;
  if (storeId) {
    const cashAmount = order.payments
      ?.filter(p => p.method?.toUpperCase() === 'CASH')
      .reduce((sum, p) => sum + p.amount, 0) || 0;
    if (cashAmount > 0) {
      recordCashRefund({ storeId, amount: cashAmount, reference: order.orderNumber, userId: req.user._id });
    }
  }
});

export const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await orderService.getOrderStats(req.query);
  res.json(ApiResponse.success(stats));
});

export const getTopSellingItems = asyncHandler(async (req, res) => {
  const products = await orderService.getTopSellingItems(req.query.store);
  res.json(ApiResponse.success(products));
});
