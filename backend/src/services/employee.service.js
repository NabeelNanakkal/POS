import mongoose from 'mongoose';
import Employee from '../models/employee.model.js';
import User from '../models/user.model.js';
import Store from '../models/store.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const getEmployees = async (query, user) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { store, isActive } = query;

  const filter = {};

  if (user.role === 'STORE_ADMIN') {
    if (store && store !== 'All') {
      filter.store = store;
    } else {
      const ownedStores = await Store.find({ owner: user._id }).distinct('_id');
      filter.store = { $in: ownedStores };
    }
  } else if (user.role !== 'SUPER_ADMIN') {
    filter.store = store || user.storeId || user.store;
  } else if (store && store !== 'All') {
    filter.store = store;
  }

  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('user', 'username email role isActive')
      .populate('store', 'name code')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Employee.countDocuments(filter),
  ]);

  return { employees, pagination: buildPagination(page, limit, total) };
};

export const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id)
    .populate('user', 'username email role isActive')
    .populate('store', 'name code address');
  if (!employee) throw ApiError.notFound('Employee not found');
  return employee;
};

export const createEmployee = async (data) => {
  const { name, username, email, role, storeId, store, position, department, hireDate, salary, password, employeeId } = data;

  const userName = name || username;
  const userStore = storeId || store;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.conflict('Email already registered');

  const user = await User.create({
    username: userName,
    email,
    password: password || '1234',
    role: role || 'CASHIER',
    store: userStore,
    isActive: true,
  });

  const empId = employeeId || `EMP${Date.now().toString().slice(-6)}`;

  const employee = await Employee.create({
    user: user._id,
    employeeId: empId,
    position: position || (role === 'CASHIER' ? 'Cashier' : role || 'Staff'),
    department: department || 'Operations',
    hireDate: hireDate || new Date(),
    salary: salary || 0,
    store: userStore,
    isActive: true,
  });

  return Employee.findById(employee._id)
    .populate('user', 'username email role isActive')
    .populate('store', 'name code');
};

export const updateEmployee = async (id, data) => {
  const { name, email, role, storeId, position, department, salary, isActive } = data;

  const employee = await Employee.findById(id);
  if (!employee) throw ApiError.notFound('Employee not found');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (name || email || role || storeId || isActive !== undefined) {
      await User.findByIdAndUpdate(
        employee.user,
        {
          ...(name && { username: name }),
          ...(email && { email }),
          ...(role && { role }),
          ...(storeId && { store: storeId }),
          ...(isActive !== undefined && { isActive }),
        },
        { session }
      );
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        ...(position && { position }),
        ...(department && { department }),
        ...(salary !== undefined && { salary }),
        ...(storeId && { store: storeId }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true, session }
    )
      .populate('user', 'username email role isActive')
      .populate('store', 'name code');

    await session.commitTransaction();
    return updatedEmployee;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deleteEmployee = async (id) => {
  const employee = await Employee.findById(id);
  if (!employee) throw ApiError.notFound('Employee not found');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await User.findByIdAndDelete(employee.user, { session });
    await Employee.findByIdAndDelete(id, { session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const bulkCreateEmployees = async (employees) => {
  if (!Array.isArray(employees) || employees.length === 0) {
    throw ApiError.badRequest('Invalid or empty employees list');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdIds = [];

    for (const empData of employees) {
      const { name, email, role, storeId, password } = empData;
      const existingUser = await User.findOne({ email });
      if (existingUser) continue;

      const user = await User.create(
        [{ username: name, email, password: password || 'Welcome@123', role: role || 'CASHIER', store: storeId }],
        { session }
      );

      const employee = await Employee.create(
        [
          {
            user: user[0]._id,
            employeeId: `EMP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
            position: role === 'CASHIER' ? 'Cashier' : role || 'Staff',
            department: 'Operations',
            hireDate: new Date(),
            salary: 0,
            store: storeId,
            isActive: true,
          },
        ],
        { session }
      );

      createdIds.push(employee[0]._id);
    }

    await session.commitTransaction();

    return Employee.find({ _id: { $in: createdIds } })
      .populate('user', 'username email role isActive')
      .populate('store', 'name code');
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const resetEmployeePassword = async (id, password) => {
  if (!password) throw ApiError.badRequest('New password is required');

  const employee = await Employee.findById(id);
  if (!employee) throw ApiError.notFound('Employee not found');

  const user = await User.findById(employee.user);
  if (!user) throw ApiError.notFound('Associated user not found');

  user.password = password;
  await user.save();
};
