import Store from '../models/Store.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Country from '../models/Country.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all stores
 * @route   GET /api/stores
 * @access  Private
 */
/**
 * @desc    Get all stores
 * @route   GET /api/stores
 * @access  Private
 */
export const getStores = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isActive } = req.query;
  
  const query = {};
  
  // Super admins see all stores (handled in super admin routes)
  // Store admins see only their own stores
  if (req.user.role === 'STORE_ADMIN') {
    query.owner = req.user._id;
  } else if (req.user.role !== 'SUPER_ADMIN') {
    // Other users see stores they're associated with
    if (req.storeId) {
      query._id = req.storeId;
    }
  }

  // Search by name, code, or address
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build employee query to match store query
  const employeeStoreQuery = {};
  if (req.user.role === 'STORE_ADMIN') {
    // Get all stores owned by this store admin
    const ownedStores = await Store.find({ owner: req.user._id }).distinct('_id');
    employeeStoreQuery.store = { $in: ownedStores };
  } else if (req.user.role !== 'SUPER_ADMIN' && req.storeId) {
    employeeStoreQuery.store = req.storeId;
  }

  const [stores, total, activeStores, totalStaff, currentMonthStores, lastMonthStores] = await Promise.all([
    Store.find(query)
      .populate('owner', 'username email')
      .populate('manager', 'username email')
      .populate('country', 'country flag iso2 iso3 currency')
      .populate('allowedPaymentModes')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 }),
    Store.countDocuments(query),
    Store.countDocuments({ ...query, isActive: true }),
    Employee.countDocuments(employeeStoreQuery),
    Store.countDocuments({ 
      ...query,
      createdAt: { 
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
      } 
    }),
    Store.countDocuments({ 
      ...query,
      createdAt: { 
        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      } 
    })
  ]);

  const growthTrend = lastMonthStores === 0 ? 100 : Math.round(((currentMonthStores - lastMonthStores) / lastMonthStores) * 100);

  res.json(ApiResponse.success({
    stores,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
    stats: {
      totalStores: total,
      activeStores,
      totalStaff,
      growth: {
        value: 14.2,
        trend: growthTrend
      }
    }
  }));
});

/**
 * @desc    Get store by ID
 * @route   GET /api/stores/:id
 * @access  Private
 */
export const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id)
    .populate('manager', 'username email role')
    .populate('country', 'country flag iso2 iso3 currency')
    .populate('allowedPaymentModes');

  if (!store) {
    throw ApiError.notFound('Store not found');
  }

  // Ownership check (Skip for Admins)
  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && store.manager?._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to view this store');
  }

  res.json(ApiResponse.success(store));
});

/**
 * @desc    Create new store
 * @route   POST /api/stores
 * @access  Private (Admin)
 */
export const createStore = asyncHandler(async (req, res) => {
  // Set owner to current user (store admin creating their store)
  req.body.owner = req.user._id;
  
  // If manager not provided, assign current user
  if (!req.body.manager) {
    req.body.manager = req.user._id;
  }
  
  // If country is provided, fetch and populate currency
  if (req.body.country) {
    const country = await Country.findById(req.body.country);
    if (country) {
      req.body.currency = {
        code: country.currency.code,
        symbol: country.currency.symbol,
        name: country.currency.name
      };
    }
  }
  
  const store = await Store.create(req.body);
  
  // Update user's store reference
  await User.findByIdAndUpdate(req.user._id, { store: store._id });

  res.status(201).json(ApiResponse.created(store, 'Store created successfully'));
});

/**
 * @desc    Update store
 * @route   PUT /api/stores/:id
 * @access  Private (Admin)
 */
export const updateStore = asyncHandler(async (req, res) => {
  let store = await Store.findById(req.params.id);

  if (!store) {
    throw ApiError.notFound('Store not found');
  }

  // Ownership check (Skip for Admins)
  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && store.manager.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to update this store');
  }

  store = await Store.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('manager', 'username email')
   .populate('allowedPaymentModes');

  res.json(ApiResponse.success(store, 'Store updated successfully'));
});

/**
 * @desc    Delete store
 * @route   DELETE /api/stores/:id
 * @access  Private (Super Admin/Admin)
 */
export const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    throw ApiError.notFound('Store not found');
  }

  // Ownership check (Skip for Admins)
  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && store.manager.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to delete this store');
  }

  await store.deleteOne();

  res.json(ApiResponse.success(null, 'Store deleted successfully'));
});

/**
 * @desc    Toggle store status
 * @route   PATCH /api/stores/:id/status
 * @access  Private (Admin)
 */
export const toggleStoreStatus = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    throw ApiError.notFound('Store not found');
  }

  // Ownership check
  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && store.manager.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to update this store');
  }

  store.isActive = req.body.isActive;
  await store.save();

  res.json(ApiResponse.success(store, 'Store status updated successfully'));
});

/**
 * @desc    Bulk create stores
 * @route   POST /api/stores/bulk
 * @access  Private (Admin)
 */
export const bulkCreateStores = asyncHandler(async (req, res) => {
  const storesData = Array.isArray(req.body) ? req.body : [req.body];
  
  // Assign current user as manager for all stores if not provided
  const enrichedStoresData = storesData.map(store => ({
    ...store,
    manager: store.manager || req.user._id
  }));

  const stores = await Store.insertMany(enrichedStoresData);

  res.status(201).json(ApiResponse.created(stores, `${stores.length} stores imported successfully`));
});
