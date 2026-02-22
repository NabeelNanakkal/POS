import User from '../models/user.model.js';
import Store from '../models/store.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const createStoreAdmin = async (data) => {
  const { username, email, password } = data;

  if (!password || !/^\d+$/.test(password)) {
    throw ApiError.badRequest('Password must contain only numbers (PIN format)');
  }
  if (password.length < 4) throw ApiError.badRequest('Password must be at least 4 digits');

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) throw ApiError.conflict('Email already registered');
    if (existingUser.username === username) throw ApiError.conflict('Username already taken');
  }

  const storeAdmin = await User.create({ username, email, password, role: 'STORE_ADMIN', isActive: true });

  return {
    id: storeAdmin._id,
    username: storeAdmin.username,
    email: storeAdmin.email,
    role: storeAdmin.role,
    isActive: storeAdmin.isActive,
  };
};

export const getStoreAdmins = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isActive } = query;

  const filter = { role: 'STORE_ADMIN' };
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [storeAdmins, total] = await Promise.all([
    User.find(filter).select('-password').populate('store', 'name code').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  const adminsWithStoreCount = await Promise.all(
    storeAdmins.map(async (admin) => {
      const storeCount = await Store.countDocuments({ owner: admin._id });
      return { ...admin.toObject(), storeCount };
    })
  );

  return { storeAdmins: adminsWithStoreCount, pagination: buildPagination(page, limit, total) };
};

export const getStoreAdminById = async (id) => {
  const storeAdmin = await User.findOne({ _id: id, role: 'STORE_ADMIN' })
    .select('-password')
    .populate('store', 'name code currency');
  if (!storeAdmin) throw ApiError.notFound('Store admin not found');

  const stores = await Store.find({ owner: storeAdmin._id });
  return { ...storeAdmin.toObject(), stores };
};

export const updateStoreAdmin = async (id, data) => {
  const { username, email, isActive } = data;

  const storeAdmin = await User.findOne({ _id: id, role: 'STORE_ADMIN' });
  if (!storeAdmin) throw ApiError.notFound('Store admin not found');

  if (username && username !== storeAdmin.username) {
    const existing = await User.findOne({ username });
    if (existing) throw ApiError.conflict('Username already taken');
    storeAdmin.username = username;
  }

  if (email && email !== storeAdmin.email) {
    const existing = await User.findOne({ email });
    if (existing) throw ApiError.conflict('Email already registered');
    storeAdmin.email = email;
  }

  if (isActive !== undefined) storeAdmin.isActive = isActive;

  await storeAdmin.save();

  return {
    id: storeAdmin._id,
    username: storeAdmin.username,
    email: storeAdmin.email,
    role: storeAdmin.role,
    isActive: storeAdmin.isActive,
  };
};

export const deactivateStoreAdmin = async (id) => {
  const storeAdmin = await User.findOne({ _id: id, role: 'STORE_ADMIN' });
  if (!storeAdmin) throw ApiError.notFound('Store admin not found');
  storeAdmin.isActive = false;
  await storeAdmin.save();
};

export const getAllStores = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isActive } = query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [stores, total] = await Promise.all([
    Store.find(filter)
      .populate('owner', 'username email')
      .populate('manager', 'username email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Store.countDocuments(filter),
  ]);

  return { stores, pagination: buildPagination(page, limit, total) };
};

export const getSuperAdminStats = async () => {
  const [totalStoreAdmins, activeStoreAdmins, totalStores, activeStores] = await Promise.all([
    User.countDocuments({ role: 'STORE_ADMIN' }),
    User.countDocuments({ role: 'STORE_ADMIN', isActive: true }),
    Store.countDocuments(),
    Store.countDocuments({ isActive: true }),
  ]);

  return { totalStoreAdmins, activeStoreAdmins, totalStores, activeStores };
};
