import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Payment from '../models/Payment.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all orders with pagination and filters
 * @route   GET /api/orders
 * @access  Private
 */
export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, store, startDate, endDate } = req.query;

  const query = {};

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by store
  if (store) {
    query.store = store;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('customer', 'name phone email')
      .populate('cashier', 'username email')
      .populate('store', 'name code')
      .populate('items.product', 'name sku')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Order.countDocuments(query),
  ]);

  res.json(
    ApiResponse.success({
      orders,
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
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name phone email loyaltyPoints')
    .populate('cashier', 'username email')
    .populate('store', 'name code address')
    .populate('items.product', 'name sku barcode');

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  res.json(ApiResponse.success(order));
});

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { customer, items, discount, paymentMethod, store, notes } = req.body;

  // Validate and calculate order totals
  let subtotal = 0;
  let totalTax = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw ApiError.notFound(`Product ${item.product} not found`);
    }

    if (!product.isActive) {
      throw ApiError.badRequest(`Product ${product.name} is not active`);
    }

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
      discount: itemDiscount,
      tax: itemTax,
      subtotal: itemSubtotal,
    });

    subtotal += itemPrice * item.quantity;
    totalTax += itemTax;

    // Increment committed stock, do NOT deduct on-hand stock yet
    product.committed = (product.committed || 0) + item.quantity;
    await product.save();
  }

  const total = subtotal - (discount || 0) + totalTax;

  // Create order
  const order = await Order.create({
    customer,
    items: orderItems,
    subtotal,
    tax: totalTax,
    discount: discount || 0,
    total,
    status: 'PENDING',
    paymentMethod,
    paymentStatus: 'PENDING',
    cashier: req.user._id,
    store: store || req.user.store,
    notes,
  });

  // Update customer if provided
  if (customer) {
    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalSpent: total },
      lastVisit: new Date(),
      lastPurchaseAmount: total,
    });
  }

  // Populate order before sending response
  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'name phone')
    .populate('cashier', 'username')
    .populate('store', 'name code');

  res.status(201).json(ApiResponse.created(populatedOrder, 'Order created successfully'));
});

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private (Manager, Admin)
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Handle status transitions
  if (order.status === 'PENDING' && status === 'COMPLETED') {
    // 1. Move from Committed to Sold (Stock deduction)
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        // Decrease committed
        product.committed = Math.max(0, (product.committed || 0) - item.quantity);
        // Decrease actual stock
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }
    order.paymentStatus = 'PAID';
  } else if (order.status === 'PENDING' && status === 'CANCELLED') {
    // 2. Release Committed stock back to Available
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        // Decrease committed only
        product.committed = Math.max(0, (product.committed || 0) - item.quantity);
        await product.save();
      }
    }
  }

  order.status = status;
  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('customer cashier store');
    
  res.json(ApiResponse.success(populatedOrder, 'Order status updated successfully'));
});

/**
 * @desc    Process refund
 * @route   POST /api/orders/:id/refund
 * @access  Private (Manager, Admin)
 */
export const refundOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (order.status === 'REFUNDED') {
    throw ApiError.badRequest('Order is already refunded');
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  // Update order status
  order.status = 'REFUNDED';
  order.paymentStatus = 'REFUNDED';
  await order.save();

  // Update customer total spent
  if (order.customer) {
    await Customer.findByIdAndUpdate(order.customer, {
      $inc: { totalSpent: -order.total },
    });
  }

  res.json(ApiResponse.success(order, 'Order refunded successfully'));
});

/**
 * @desc    Get order statistics
 * @route   GET /api/orders/stats
 * @access  Private (Manager, Admin)
 */
export const getOrderStats = asyncHandler(async (req, res) => {
  const { startDate, endDate, store } = req.query;

  const matchQuery = {};

  if (startDate || endDate) {
    matchQuery.createdAt = {};
    if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
    if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
  }

  if (store) {
    matchQuery.store = store;
  }

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

  res.json(ApiResponse.success(stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 }));
});
