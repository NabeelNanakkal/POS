import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Store from '../models/store.model.js';
import RefreshToken from '../models/refresh-token.model.js';
import Employee from '../models/employee.model.js';
import ApiError from '../utils/ApiError.js';
import { config } from '../config/constants.js';

export const register = async (userData, deviceInfo) => {
  const { username, email, password, role, store } = userData;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) throw ApiError.conflict('Email already registered');
    if (existingUser.username === username) throw ApiError.conflict('Username already taken');
  }

  const user = await User.create({ username, email, password, role: role || 'CASHIER', store });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt, deviceInfo });

  return {
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const login = async (email, password, deviceInfo) => {
  const user = await User.findOne({ email }).select('+password').populate('store', 'name code currency');
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact administrator.');
  }

  if (user.role !== 'SUPER_ADMIN' && user.store) {
    const store = await Store.findById(user.store).populate('owner', 'isActive');
    if (store && store.owner && !store.owner.isActive) {
      throw ApiError.forbidden('Your store administrator account has been deactivated. Please contact support.');
    }
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw ApiError.unauthorized('Invalid email or password');

  user.lastLogin = new Date();
  await user.save();

  const employee = await Employee.findOne({ user: user._id });
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt, deviceInfo });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      store: user.store,
      employeeId: employee ? employee.employeeId : null,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw ApiError.badRequest('Refresh token is required');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken, user: decoded.id, isRevoked: false });
  if (!storedToken) throw ApiError.unauthorized('Refresh token not found or has been revoked');
  if (storedToken.expiresAt < new Date()) throw ApiError.unauthorized('Refresh token has expired');

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('User not found or inactive');

  return { accessToken: user.generateAccessToken() };
};

export const logout = async (userId, refreshToken) => {
  if (refreshToken) {
    await RefreshToken.updateOne({ token: refreshToken, user: userId }, { isRevoked: true });
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) throw ApiError.unauthorized('Current password is incorrect');

  user.password = newPassword;
  await user.save();
  await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });
};

export const getMe = async (userId) => {
  const user = await User.findById(userId).populate('store', 'name code currency');
  const employee = await Employee.findOne({ user: userId });
  const userData = user.toObject();
  if (employee) userData.employeeId = employee.employeeId;
  return userData;
};

export const setupAdmin = async () => {
  const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME } = process.env;

  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD || !DEFAULT_ADMIN_USERNAME) {
    throw ApiError.internal('Default admin credentials not configured in server environment');
  }
  if (!/^\d+$/.test(DEFAULT_ADMIN_PASSWORD)) {
    throw ApiError.internal('Super admin password must contain only numbers (PIN format). Please update DEFAULT_ADMIN_PASSWORD in .env file');
  }
  if (DEFAULT_ADMIN_PASSWORD.length < 4) {
    throw ApiError.internal('Super admin password must be at least 4 digits. Please update DEFAULT_ADMIN_PASSWORD in .env file');
  }

  let admin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (admin) {
    admin.password = DEFAULT_ADMIN_PASSWORD;
    admin.username = DEFAULT_ADMIN_USERNAME;
    admin.role = 'SUPER_ADMIN';
    admin.isActive = true;
    await admin.save();
    return { created: false };
  }

  await User.create({
    username: DEFAULT_ADMIN_USERNAME,
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
    role: 'SUPER_ADMIN',
    isActive: true,
  });
  return { created: true };
};
