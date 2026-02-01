import Store from '../models/Store.js';
import User from '../models/User.js';
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
  
  // If not Super Admin or Admin or Manager, show only own stores
  if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'INVENTORY_MANAGER'].includes(req.user.role)) {
    query.manager = req.user._id;
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

  const [stores, total, activeStores, totalStaff, currentMonthStores, lastMonthStores] = await Promise.all([
    Store.find(query)
      .populate('manager', 'username email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 }),
    Store.countDocuments(query),
    Store.countDocuments({ ...query, isActive: true }),
    User.countDocuments({ role: { $in: ['MANAGER', 'CASHIER', 'INVENTORY_MANAGER'] } }),
    Store.countDocuments({ 
      createdAt: { 
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
      } 
    }),
    Store.countDocuments({ 
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
        value: 14.2, // Placeholder for overall growth target or similar
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
  const store = await Store.findById(req.params.id).populate('manager', 'username email role');

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
  // If manager not provided, assign current user
  if (!req.body.manager) {
    req.body.manager = req.user._id;
  }
  
  const store = await Store.create(req.body);

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
  ).populate('manager', 'username email');

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
