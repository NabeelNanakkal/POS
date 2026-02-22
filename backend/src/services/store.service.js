import Store from '../models/store.model.js';
import User from '../models/user.model.js';
import Employee from '../models/employee.model.js';
import Country from '../models/country.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const getStores = async (query, user) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isActive } = query;

  const filter = {};

  if (user.role === 'STORE_ADMIN') {
    filter.owner = user._id;
  } else if (user.role !== 'SUPER_ADMIN') {
    if (user.storeId) filter._id = user.storeId;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const employeeStoreQuery = {};
  if (user.role === 'STORE_ADMIN') {
    const ownedStores = await Store.find({ owner: user._id }).distinct('_id');
    employeeStoreQuery.store = { $in: ownedStores };
  } else if (user.role !== 'SUPER_ADMIN' && user.storeId) {
    employeeStoreQuery.store = user.storeId;
  }

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [stores, total, activeStores, totalStaff, currentMonthStores, lastMonthStores] = await Promise.all([
    Store.find(filter)
      .populate('owner', 'username email')
      .populate('manager', 'username email')
      .populate('country', 'country flag iso2 iso3 currency')
      .populate('allowedPaymentModes')
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 }),
    Store.countDocuments(filter),
    Store.countDocuments({ ...filter, isActive: true }),
    Employee.countDocuments(employeeStoreQuery),
    Store.countDocuments({ ...filter, createdAt: { $gte: thisMonthStart } }),
    Store.countDocuments({ ...filter, createdAt: { $gte: lastMonthStart, $lt: thisMonthStart } }),
  ]);

  const growthTrend =
    lastMonthStores === 0
      ? 100
      : Math.round(((currentMonthStores - lastMonthStores) / lastMonthStores) * 100);

  return {
    stores,
    pagination: buildPagination(page, limit, total),
    stats: {
      totalStores: total,
      activeStores,
      totalStaff,
      growth: { value: 14.2, trend: growthTrend },
    },
  };
};

export const getStoreById = async (id, user) => {
  const store = await Store.findById(id)
    .populate('manager', 'username email role')
    .populate('country', 'country flag iso2 iso3 currency')
    .populate('allowedPaymentModes');

  if (!store) throw ApiError.notFound('Store not found');

  if (
    user.role !== 'SUPER_ADMIN' &&
    user.role !== 'ADMIN' &&
    store.manager?._id.toString() !== user._id.toString()
  ) {
    throw ApiError.forbidden('You do not have permission to view this store');
  }

  return store;
};

export const createStore = async (data, userId) => {
  data.owner = userId;
  if (!data.manager) data.manager = userId;

  if (data.country) {
    const country = await Country.findById(data.country);
    if (country) {
      data.currency = { code: country.currency.code, symbol: country.currency.symbol, name: country.currency.name };
    }
  }

  const store = await Store.create(data);
  await User.findByIdAndUpdate(userId, { store: store._id });
  return store;
};

export const updateStore = async (id, data, user) => {
  const store = await Store.findById(id);
  if (!store) throw ApiError.notFound('Store not found');

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && store.manager.toString() !== user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to update this store');
  }

  return Store.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('manager', 'username email')
    .populate('allowedPaymentModes');
};

export const deleteStore = async (id, user) => {
  const store = await Store.findById(id);
  if (!store) throw ApiError.notFound('Store not found');

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && store.manager.toString() !== user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to delete this store');
  }

  await store.deleteOne();
  return store;
};

export const toggleStoreStatus = async (id, isActive, user) => {
  const store = await Store.findById(id);
  if (!store) throw ApiError.notFound('Store not found');

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && store.manager.toString() !== user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to update this store');
  }

  store.isActive = isActive;
  await store.save();
  return store;
};

export const bulkCreateStores = async (storesData, managerId) => {
  const enriched = storesData.map((s) => ({ ...s, manager: s.manager || managerId }));
  return Store.insertMany(enriched);
};
