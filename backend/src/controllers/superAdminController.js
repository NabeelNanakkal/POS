import User from '../models/User.js';
import Store from '../models/Store.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create a new store admin
 * @route   POST /api/super-admin/store-admins
 * @access  Super Admin
 */
export const createStoreAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate password is numeric only
  if (!password || !/^\d+$/.test(password)) {
    throw ApiError.badRequest('Password must contain only numbers (PIN format)');
  }

  // Validate password length (optional: minimum 4 digits)
  if (password.length < 4) {
    throw ApiError.badRequest('Password must be at least 4 digits');
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw ApiError.conflict('Email already registered');
    }
    if (existingUser.username === username) {
      throw ApiError.conflict('Username already taken');
    }
  }

  // Create store admin (without store initially)
  const storeAdmin = await User.create({
    username,
    email,
    password,
    role: 'STORE_ADMIN',
    isActive: true,
  });

  res.status(201).json(
    ApiResponse.created(
      {
        id: storeAdmin._id,
        username: storeAdmin.username,
        email: storeAdmin.email,
        role: storeAdmin.role,
        isActive: storeAdmin.isActive,
      },
      'Store admin created successfully'
    )
  );
});

/**
 * @desc    Get all store admins
 * @route   GET /api/super-admin/store-admins
 * @access  Super Admin
 */
export const getStoreAdmins = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isActive } = req.query;

  const query = { role: 'STORE_ADMIN' };

  // Search by username or email
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [storeAdmins, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .populate('store', 'name code')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  // Get store count for each admin
  const adminsWithStoreCount = await Promise.all(
    storeAdmins.map(async (admin) => {
      const storeCount = await Store.countDocuments({ owner: admin._id });
      return {
        ...admin.toObject(),
        storeCount,
      };
    })
  );

  res.json(
    ApiResponse.success({
      storeAdmins: adminsWithStoreCount,
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
 * @desc    Get store admin by ID
 * @route   GET /api/super-admin/store-admins/:id
 * @access  Super Admin
 */
export const getStoreAdminById = asyncHandler(async (req, res) => {
  const storeAdmin = await User.findOne({
    _id: req.params.id,
    role: 'STORE_ADMIN'
  })
    .select('-password')
    .populate('store', 'name code currency');

  if (!storeAdmin) {
    throw ApiError.notFound('Store admin not found');
  }

  // Get stores owned by this admin
  const stores = await Store.find({ owner: storeAdmin._id });

  res.json(
    ApiResponse.success({
      ...storeAdmin.toObject(),
      stores,
    })
  );
});

/**
 * @desc    Update store admin
 * @route   PUT /api/super-admin/store-admins/:id
 * @access  Super Admin
 */
export const updateStoreAdmin = asyncHandler(async (req, res) => {
  const { username, email, isActive } = req.body;

  const storeAdmin = await User.findOne({
    _id: req.params.id,
    role: 'STORE_ADMIN'
  });

  if (!storeAdmin) {
    throw ApiError.notFound('Store admin not found');
  }

  // Check for duplicate username/email
  if (username && username !== storeAdmin.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw ApiError.conflict('Username already taken');
    }
    storeAdmin.username = username;
  }

  if (email && email !== storeAdmin.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }
    storeAdmin.email = email;
  }

  if (isActive !== undefined) {
    storeAdmin.isActive = isActive;
  }

  await storeAdmin.save();

  res.json(
    ApiResponse.success(
      {
        id: storeAdmin._id,
        username: storeAdmin.username,
        email: storeAdmin.email,
        role: storeAdmin.role,
        isActive: storeAdmin.isActive,
      },
      'Store admin updated successfully'
    )
  );
});

/**
 * @desc    Deactivate store admin
 * @route   DELETE /api/super-admin/store-admins/:id
 * @access  Super Admin
 * @note    When a store admin is deactivated, all users associated with their stores
 *          will be prevented from logging in and making API requests. The auth middleware
 *          checks the store owner's active status on every request.
 */
export const deactivateStoreAdmin = asyncHandler(async (req, res) => {
  const storeAdmin = await User.findOne({
    _id: req.params.id,
    role: 'STORE_ADMIN'
  });

  if (!storeAdmin) {
    throw ApiError.notFound('Store admin not found');
  }

  storeAdmin.isActive = false;
  await storeAdmin.save();

  res.json(ApiResponse.success(null, 'Store admin deactivated successfully. All associated store users will be unable to login.'));
});

/**
 * @desc    Get all stores (across all store admins)
 * @route   GET /api/super-admin/stores
 * @access  Super Admin
 */
export const getAllStores = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isActive } = req.query;

  const query = {};

  // Search by name or code
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [stores, total] = await Promise.all([
    Store.find(query)
      .populate('owner', 'username email')
      .populate('manager', 'username email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Store.countDocuments(query),
  ]);

  res.json(
    ApiResponse.success({
      stores,
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
 * @desc    Get super admin dashboard stats
 * @route   GET /api/super-admin/stats
 * @access  Super Admin
 */
export const getSuperAdminStats = asyncHandler(async (req, res) => {
  const [totalStoreAdmins, activeStoreAdmins, totalStores, activeStores] = await Promise.all([
    User.countDocuments({ role: 'STORE_ADMIN' }),
    User.countDocuments({ role: 'STORE_ADMIN', isActive: true }),
    Store.countDocuments(),
    Store.countDocuments({ isActive: true }),
  ]);

  res.json(
    ApiResponse.success({
      totalStoreAdmins,
      activeStoreAdmins,
      totalStores,
      activeStores,
    })
  );
});
