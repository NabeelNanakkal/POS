import Shift from '../models/Shift.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Open a new shift
 * @route   POST /api/shifts/open
 * @access  Private
 */
export const openShift = asyncHandler(async (req, res) => {
  const { openingBalance, notes } = req.body;

  if (openingBalance === undefined || openingBalance === null) {
    throw ApiError.badRequest('Opening balance is required');
  }

  // Check if user already has an open shift
  const existingShift = await Shift.findOne({
    user: req.user._id,
    status: 'OPEN'
  });

  if (existingShift) {
    throw ApiError.conflict('You already have an open shift. Please close it before opening a new one.');
  }

  const shift = await Shift.create({
    user: req.user._id,
    store: req.user.store,
    openingBalance,
    notes,
    status: 'OPEN',
    startTime: new Date()
  });

  res.status(201).json(ApiResponse.created(shift, 'Shift opened successfully'));
});

/**
 * @desc    Close an existing shift
 * @route   POST /api/shifts/close
 * @access  Private
 */
export const closeShift = asyncHandler(async (req, res) => {
  const { closingBalance, notes, totalSales, itemsSold } = req.body;

  // Closing balance can be calculated automatically if not provided

  // Find the open shift for this user
  const shift = await Shift.findOne({
    user: req.user._id,
    status: 'OPEN'
  });

  if (!shift) {
    throw ApiError.notFound('No open shift found for this user');
  }

  shift.status = 'CLOSED';
  shift.endTime = new Date();
  shift.closingBalance = closingBalance !== undefined ? closingBalance : (shift.openingBalance + shift.totalSales);
  if (totalSales !== undefined) shift.totalSales = totalSales;
  if (itemsSold !== undefined) shift.itemsSold = itemsSold;
  if (notes) shift.notes = (shift.notes ? shift.notes + '\n' : '') + notes;

  await shift.save();

  res.json(ApiResponse.success(shift, 'Shift closed successfully'));
});

/**
 * @desc    Get current open shift for the logged-in user
 * @route   GET /api/shifts/current
 * @access  Private
 */
export const getCurrentShift = asyncHandler(async (req, res) => {
  const shift = await Shift.findOne({
    user: req.user._id,
    status: 'OPEN'
  });

  if (!shift) {
    return res.json(ApiResponse.success(null, 'No active shift found'));
  }

  res.json(ApiResponse.success(shift, 'Current shift retrieved successfully'));
});

/**
 * @desc    Get all shifts for a store (Manager/Admin only)
 * @route   GET /api/shifts/store
 * @access  Private (Manager/Admin)
 */
export const getStoreShifts = asyncHandler(async (req, res) => {
  const { 
    storeId,
    search = '',
    status = 'ALL',
    startDate,
    endDate,
    sortBy = 'startTime',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = req.query;
  
  const targetStoreId = storeId || req.user.store;

  if (!targetStoreId) {
    throw ApiError.badRequest('Store ID is required');
  }

  // Managers can only see their own store
  if (req.user.role === 'MANAGER' && targetStoreId.toString() !== req.user.store?.toString()) {
    throw ApiError.forbidden('You can only access shifts for your own store');
  }

  // Build query filters
  const query = { store: targetStoreId };

  // Status filter
  if (status && status !== 'ALL') {
    query.status = status;
  }

  // Date range filter
  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) {
      query.startTime.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      query.startTime.$lte = end;
    }
  }

  // Build sort object
  const sortObj = {};
  sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query with search
  let shiftsQuery = Shift.find(query)
    .populate('user', 'username email')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  // If search is provided, filter after population
  let shifts = await shiftsQuery;
  
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    shifts = shifts.filter(shift => 
      shift.user?.username?.toLowerCase().includes(searchLower) ||
      shift.user?.email?.toLowerCase().includes(searchLower)
    );
  }

  // Get total count for pagination
  const total = await Shift.countDocuments(query);

  res.json(ApiResponse.success({
    shifts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  }, 'Store shifts retrieved successfully'));
});

/**
 * @desc    Start a break
 * @route   POST /api/shifts/break/start
 * @access  Private
 */
export const startBreak = asyncHandler(async (req, res) => {
  const { type, note } = req.body;

  const shift = await Shift.findOne({
    user: req.user._id,
    status: 'OPEN'
  });

  if (!shift) {
    throw ApiError.notFound('No active shift found to start a break');
  }

  // Check if there's already an ongoing break
  const activeBreak = shift.breaks.find(b => !b.endTime);
  if (activeBreak) {
    throw ApiError.badRequest('You already have an active break');
  }

  shift.breaks.push({
    startTime: new Date(),
    type: type || 'OTHER',
    note
  });

  await shift.save();

  res.json(ApiResponse.success(shift, 'Break started successfully'));
});

/**
 * @desc    End a break
 * @route   POST /api/shifts/break/end
 * @access  Private
 */
export const endBreak = asyncHandler(async (req, res) => {
  const shift = await Shift.findOne({
    user: req.user._id,
    status: 'OPEN'
  });

  if (!shift) {
    throw ApiError.notFound('No active shift found');
  }

  const activeBreakIdx = shift.breaks.findIndex(b => !b.endTime);
  if (activeBreakIdx === -1) {
    throw ApiError.badRequest('No active break found to end');
  }

  shift.breaks[activeBreakIdx].endTime = new Date();
  await shift.save();

  res.json(ApiResponse.success(shift, 'Break ended successfully'));
});
