import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import Employee from '../models/Employee.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { config } from '../config/constants.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public (or Admin only, depending on your requirements)
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, role, store } = req.body;

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

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role: role || 'CASHIER',
    store,
  });

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
    deviceInfo: {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    },
  });

  res.status(201).json(
    ApiResponse.created(
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      'User registered successfully'
    )
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact administrator.');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Load Employee details if exists
  const employee = await Employee.findOne({ user: user._id });

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
    deviceInfo: {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    },
  });

  res.json(
    ApiResponse.success(
      {
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
      },
      'Login successful'
    )
  );
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  // Find refresh token in database
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    user: decoded.id,
    isRevoked: false,
  });

  if (!storedToken) {
    throw ApiError.unauthorized('Refresh token not found or has been revoked');
  }

  // Check if token is expired
  if (storedToken.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token has expired');
  }

  // Get user
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or inactive');
  }

  // Generate new access token
  const newAccessToken = user.generateAccessToken();

  res.json(
    ApiResponse.success(
      {
        accessToken: newAccessToken,
      },
      'Token refreshed successfully'
    )
  );
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Revoke the refresh token
    await RefreshToken.updateOne(
      { token: refreshToken, user: req.user._id },
      { isRevoked: true }
    );
  }

  res.json(ApiResponse.success(null, 'Logout successful'));
});

/**
 * @desc    Change password
 * @route   POST /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Revoke all refresh tokens for security
  await RefreshToken.updateMany(
    { user: user._id },
    { isRevoked: true }
  );

  res.json(ApiResponse.success(null, 'Password changed successfully. Please login again.'));
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('store', 'name code');
  const employee = await Employee.findOne({ user: req.user._id });

  const userData = user.toObject();
  if (employee) {
    userData.employeeId = employee.employeeId;
  }

  res.json(ApiResponse.success(userData, 'User profile retrieved successfully'));
});

/**
 * @desc    Setup or reset default admin
 * @route   POST /api/auth/setup-admin
 * @access  Public
 */
export const setupAdmin = asyncHandler(async (req, res) => {
  const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME } = process.env;

  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD || !DEFAULT_ADMIN_USERNAME) {
    throw ApiError.internal('Default admin credentials not successfully configured in server environment');
  }

  // Check if admin exists by email
  let admin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (admin) {
    // Reset password if exists
    admin.password = DEFAULT_ADMIN_PASSWORD;
    admin.username = DEFAULT_ADMIN_USERNAME;
    admin.role = 'ADMIN'; // Ensure role is ADMIN
    admin.isActive = true;
    await admin.save();

    res.json(ApiResponse.success(null, 'Default admin account reset successfully'));
  } else {
    // Create new admin
    admin = await User.create({
      username: DEFAULT_ADMIN_USERNAME,
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      role: 'ADMIN',
      isActive: true,
    });

    res.status(201).json(ApiResponse.created(null, 'Default admin account created successfully'));
  }
});
