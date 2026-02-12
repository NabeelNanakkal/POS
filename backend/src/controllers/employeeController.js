import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Store from '../models/Store.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private (Manager, Admin)
 */
export const getEmployees = asyncHandler(async (req, res) => {
  const { store, isActive, page = 1, limit = 10 } = req.query;

  const query = {};

  // For non-super-admins, filter by their store
  if (req.user.role === 'STORE_ADMIN') {
    if (store && store !== 'All') {
      // Use specific store filter from query
      query.store = store;
    } else {
      // Fetch all stores owned by this admin
      const ownedStores = await Store.find({ owner: req.user._id }).distinct('_id');
      query.store = { $in: ownedStores };
    }
  } else if (req.user.role !== 'SUPER_ADMIN') {
    // Other roles (MANAGER, CASHIER) filter by their assigned store
    query.store = store || req.storeId || req.user.store;
  } else if (store && store !== 'All') {
    // Super admin can filter by specific store if provided
    query.store = store;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [employees, total] = await Promise.all([
    Employee.find(query)
      .populate('user', 'username email role isActive')
      .populate('store', 'name code')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Employee.countDocuments(query)
  ]);

  res.json(ApiResponse.success({
    employees,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  }));
});

/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Private (Manager, Admin)
 */
export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate('user', 'username email role isActive')
    .populate('store', 'name code address');

  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  res.json(ApiResponse.success(employee));
});

/**
 * @desc    Create new employee (with User account)
 * @route   POST /api/employees
 * @access  Private (Admin)
 */
export const createEmployee = asyncHandler(async (req, res) => {
  console.log('=== CREATE EMPLOYEE REQUEST ===');
  console.log('Request body:', req.body);
  
  const { name, email, role, storeId, position, department, hireDate, salary, password, username, employeeId, store } = req.body;

  // Support both 'name' and 'username' fields
  const userName = name || username;
  // Support both 'storeId' and 'store' fields
  const userStore = storeId || store;
  
  console.log('Parsed fields:', { userName, email, role, userStore, position });

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('User already exists:', email);
    throw ApiError.conflict('Email already registered');
  }

  try {
    console.log('Creating user with:', { userName, email, password: '****', role, userStore });
    
    // 2. Create User account (without transaction)
    const user = await User.create({
      username: userName,
      email,
      password: password || '1234', // Default numeric password
      role: role || 'CASHIER',
      store: userStore,
      isActive: true
    });

    console.log('User created:', user._id);

    // 3. Create Employee profile
    const empId = employeeId || `EMP${Date.now().toString().slice(-6)}`;
    console.log('Creating employee with ID:', empId);
    
    const employee = await Employee.create({
      user: user._id,
      employeeId: empId,
      position: position || (role === 'CASHIER' ? 'Cashier' : role || 'Staff'),
      department: department || 'Operations',
      hireDate: hireDate || new Date(),
      salary: salary || 0,
      store: userStore,
      isActive: true
    });

    console.log('Employee created:', employee._id);

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('user', 'username email role isActive')
      .populate('store', 'name code');

    console.log('Employee creation successful');
    res.status(201).json(ApiResponse.created(populatedEmployee, 'Employee created successfully'));
  } catch (error) {
    console.error('Employee creation error:', error.message);
    console.error('Error stack:', error.stack);
    
    // If employee creation failed but user was created, we should clean up
    // However, without transactions, we'll just throw the error
    // The user can be manually deleted if needed
    throw error;
  }
});

/**
 * @desc    Update employee
 * @route   PUT /api/employees/:id
 * @access  Private (Admin)
 */
export const updateEmployee = asyncHandler(async (req, res) => {
  const { name, email, role, storeId, position, department, salary, isActive } = req.body;
  
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update User
    if (name || email || role || storeId || isActive !== undefined) {
      await User.findByIdAndUpdate(employee.user, {
        ...(name && { username: name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(storeId && { store: storeId }),
        ...(isActive !== undefined && { isActive })
      }, { session });
    }

    // Update Employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        ...(position && { position }),
        ...(department && { department }),
        ...(salary !== undefined && { salary }),
        ...(storeId && { store: storeId }),
        ...(isActive !== undefined && { isActive })
      },
      { new: true, runValidators: true, session }
    )
      .populate('user', 'username email role isActive')
      .populate('store', 'name code');

    await session.commitTransaction();
    res.json(ApiResponse.success(updatedEmployee, 'Employee updated successfully'));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Private (Admin)
 */
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete User
    await User.findByIdAndDelete(employee.user, { session });
    
    // Delete Employee
    await Employee.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    res.json(ApiResponse.success(null, 'Employee deleted successfully'));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Bulk create employees
 * @route   POST /api/employees/bulk
 * @access  Private (Admin)
 */
export const bulkCreateEmployees = asyncHandler(async (req, res) => {
  const { employees } = req.body;

  if (!Array.isArray(employees) || employees.length === 0) {
    throw ApiError.badRequest('Invalid or empty employees list');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdEmployees = [];

    for (const empData of employees) {
      const { name, email, role, storeId, password } = empData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) continue; // Skip existing users

      // Create User account
      const user = await User.create([{
        username: name,
        email,
        password: password || 'Welcome@123',
        role: role || 'CASHIER',
        store: storeId,
      }], { session });

      // Create Employee profile
      const employee = await Employee.create([{
        user: user[0]._id,
        employeeId: `EMP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
        position: role === 'CASHIER' ? 'Cashier' : role || 'Staff',
        department: 'Operations',
        hireDate: new Date(),
        salary: 0,
        store: storeId,
        isActive: true
      }], { session });

      createdEmployees.push(employee[0]._id);
    }

    await session.commitTransaction();

    const populatedEmployees = await Employee.find({ _id: { $in: createdEmployees } })
      .populate('user', 'username email role isActive')
      .populate('store', 'name code');

    res.status(201).json(ApiResponse.created(populatedEmployees, `${populatedEmployees.length} employees imported successfully`));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Reset employee password
 * @route   PUT /api/employees/:id/reset-password
 * @access  Private (Admin)
 */
export const resetEmployeePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    throw ApiError.badRequest('New password is required');
  }

  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  const user = await User.findById(employee.user);
  if (!user) {
    throw ApiError.notFound('Associated user not found');
  }

  user.password = password;
  await user.save();

  res.json(ApiResponse.success(null, 'Password reset successfully'));
});
