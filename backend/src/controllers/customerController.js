import Customer from '../models/Customer.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all customers with pagination and search
 * @route   GET /api/customers
 * @access  Private
 */
export const getCustomers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const query = { store: req.user.store }; // Filter by user's store

  // Search by name, email, or phone
  if (search) {
    const searchRegex = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: searchRegex, $options: 'i' } },
      { email: { $regex: searchRegex, $options: 'i' } },
      { phone: { $regex: searchRegex, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [customers, total] = await Promise.all([
    Customer.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Customer.countDocuments(query),
  ]);

  res.json(
    ApiResponse.success({
      customers,
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
 * @desc    Get customer by ID
 * @route   GET /api/customers/:id
 * @access  Private
 */
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, store: req.user.store });

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  res.json(ApiResponse.success(customer));
});

/**
 * @desc    Create new customer
 * @route   POST /api/customers
 * @access  Private
 */
export const createCustomer = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  
  // Check if phone exists in this store
  const existingCustomer = await Customer.findOne({ phone, store: req.user.store });
  if (existingCustomer) {
      throw ApiError.conflict('Customer with this phone number already exists in this store');
  }

  const customer = await Customer.create({
      ...req.body,
      store: req.user.store
  });

  res.status(201).json(ApiResponse.created(customer, 'Customer created successfully'));
});

/**
 * @desc    Update customer
 * @route   PUT /api/customers/:id
 * @access  Private
 */
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  res.json(ApiResponse.success(customer, 'Customer updated successfully'));
});

/**
 * @desc    Delete customer
 * @route   DELETE /api/customers/:id
 * @access  Private (Admin)
 */
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  res.json(ApiResponse.success(null, 'Customer deleted successfully'));
});

/**
 * @desc    Update customer loyalty points
 * @route   PATCH /api/customers/:id/loyalty
 * @access  Private
 */
export const updateLoyaltyPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { $inc: { loyaltyPoints: points } },
    { new: true }
  );

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  res.json(ApiResponse.success(customer, 'Loyalty points updated successfully'));
});

/**
 * @desc    Update customer purchase history
 * @route   PATCH /api/customers/:id/purchase
 * @access  Private
 */
export const updatePurchaseHistory = asyncHandler(async (req, res) => {
  const { purchaseAmount } = req.body;

  if (!purchaseAmount || purchaseAmount <= 0) {
    throw ApiError.badRequest('Valid purchase amount is required');
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      lastPurchaseAmount: purchaseAmount,
      lastPurchaseDate: new Date(),
      $inc: { totalSpent: purchaseAmount }
    },
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  res.json(ApiResponse.success(customer, 'Purchase history updated successfully'));
});
