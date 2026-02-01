import Employee from '../models/Employee.js';
import User from '../models/User.js';
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
  const { store, isActive } = req.query;

  const query = {};

  if (store) {
    query.store = store;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const employees = await Employee.find(query)
    .populate('user', 'username email role isActive')
    .populate('store', 'name code')
    .sort({ createdAt: -1 });

  res.json(ApiResponse.success(employees));
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
  const { name, email, role, storeId, position, department, hireDate, salary, password } = req.body;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Create User account
    const user = await User.create([{
      username: name,
      email,
      password: password || 'Welcome@123', // Default or custom password
      role: role || 'CASHIER',
      store: storeId,
    }], { session });

    // 3. Create Employee profile
    const employee = await Employee.create([{
      user: user[0]._id,
      employeeId: `EMP${Date.now().toString().slice(-6)}`, // Generate simple ID
      position: position || (role === 'CASHIER' ? 'Cashier' : role || 'Staff'),
      department: department || 'Operations',
      hireDate: hireDate || new Date(),
      salary: salary || 0,
      store: storeId,
      isActive: true
    }], { session });

    await session.commitTransaction();

    const populatedEmployee = await Employee.findById(employee[0]._id)
      .populate('user', 'username email role isActive')
      .populate('store', 'name code');

    res.status(201).json(ApiResponse.created(populatedEmployee, 'Employee created successfully'));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
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
