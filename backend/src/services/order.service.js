import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Customer from '../models/customer.model.js';
import Shift from '../models/shift.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const getOrders = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { status, store, startDate, endDate } = query;

  const filter = {};
  if (status) filter.status = status;
  if (store) filter.store = store;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('customer', 'name phone email')
      .populate('cashier', 'username email')
      .populate('store', 'name code')
      .populate('items.product', 'name sku')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Order.countDocuments(filter),
  ]);

  return { orders, pagination: buildPagination(page, limit, total) };
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate('customer', 'name phone email loyaltyPoints')
    .populate('cashier', 'username email')
    .populate('store', 'name code address')
    .populate('items.product', 'name sku barcode');
  if (!order) throw ApiError.notFound('Order not found');
  return order;
};

export const createOrder = async (data, userId) => {
  const { customer, items, discount, discountDetails, payments, store, notes } = data;

  let subtotal = 0;
  let totalTax = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw ApiError.notFound(`Product ${item.product} not found`);
    if (!product.isActive) throw ApiError.badRequest(`Product ${product.name} is not active`);
    if (product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    const itemPrice = item.price || product.price;
    const itemDiscount = item.discount || 0;
    const itemTax = (itemPrice * item.quantity - itemDiscount) * (product.taxRate / 100);
    const itemSubtotal = itemPrice * item.quantity - itemDiscount + itemTax;

    orderItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      price: itemPrice,
      originalPrice: item.originalPrice || product.price,
      isPriceOverridden: item.isPriceOverridden || false,
      discount: itemDiscount,
      tax: itemTax,
      subtotal: itemSubtotal,
    });

    subtotal += itemPrice * item.quantity;
    totalTax += itemTax;
    product.stock = Math.max(0, product.stock - item.quantity);
    await product.save();
  }

  const total = subtotal - (discount || 0) + totalTax;

  const order = await Order.create({
    customer,
    items: orderItems,
    subtotal,
    tax: totalTax,
    discount: discount || 0,
    total,
    status: 'COMPLETED',
    payments: (payments || []).map((p) => ({
      method: p.method.toUpperCase() === 'DIGITAL' ? 'DIGITAL' : p.method.toUpperCase(),
      amount: p.amount,
    })),
    paymentStatus: 'PAID',
    cashier: userId,
    store,
    discountDetails,
    notes,
  });

  if (customer) {
    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalSpent: total },
      lastVisit: new Date(),
      lastPurchaseAmount: total,
    });
  }

  await Shift.findOneAndUpdate(
    { user: userId, status: 'OPEN' },
    { $inc: { totalSales: total, itemsSold: orderItems.reduce((sum, item) => sum + item.quantity, 0) } }
  );

  return Order.findById(order._id)
    .populate('customer', 'name phone')
    .populate('cashier', 'username')
    .populate('store', 'name code');
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findById(id);
  if (!order) throw ApiError.notFound('Order not found');

  if (order.status === 'PENDING' && status === 'COMPLETED') {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.committed = Math.max(0, (product.committed || 0) - item.quantity);
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }
    order.paymentStatus = 'PAID';
  } else if (order.status === 'PENDING' && status === 'CANCELLED') {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.committed = Math.max(0, (product.committed || 0) - item.quantity);
        await product.save();
      }
    }
  }

  order.status = status;
  await order.save();
  return Order.findById(order._id).populate('customer cashier store');
};

export const refundOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw ApiError.notFound('Order not found');
  if (order.status === 'REFUNDED') throw ApiError.badRequest('Order is already refunded');

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  order.status = 'REFUNDED';
  order.paymentStatus = 'REFUNDED';
  await order.save();

  if (order.customer) {
    await Customer.findByIdAndUpdate(order.customer, { $inc: { totalSpent: -order.total } });
  }

  return order;
};

export const getOrderStats = async (query) => {
  const { startDate, endDate, store } = query;

  const matchQuery = {};
  if (startDate || endDate) {
    matchQuery.createdAt = {};
    if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
    if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
  }
  if (store) matchQuery.store = store;

  const stats = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
      },
    },
  ]);

  return stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
};

export const getTopSellingItems = async (storeId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const matchQuery = { createdAt: { $gte: sevenDaysAgo }, status: 'COMPLETED' };
  if (storeId) matchQuery.store = new mongoose.Types.ObjectId(storeId);

  return Order.aggregate([
    { $match: matchQuery },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);
};
