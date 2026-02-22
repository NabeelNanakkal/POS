import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const deviceInfo = { userAgent: req.headers['user-agent'], ip: req.ip };
  const data = await authService.register(req.body, deviceInfo);
  res.status(201).json(ApiResponse.created(data, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const deviceInfo = { userAgent: req.headers['user-agent'], ip: req.ip };
  const data = await authService.login(email, password, deviceInfo);
  res.json(ApiResponse.success(data, 'Login successful'));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const data = await authService.refreshAccessToken(req.body.refreshToken);
  res.json(ApiResponse.success(data, 'Token refreshed successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id, req.body.refreshToken);
  res.json(ApiResponse.success(null, 'Logout successful'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  res.json(ApiResponse.success(null, 'Password changed successfully. Please login again.'));
});

export const getMe = asyncHandler(async (req, res) => {
  const userData = await authService.getMe(req.user._id);
  res.json(ApiResponse.success(userData, 'User profile retrieved successfully'));
});

export const setupAdmin = asyncHandler(async (req, res) => {
  const result = await authService.setupAdmin();
  if (result.created) {
    res.status(201).json(ApiResponse.created(null, 'Default super admin account created successfully'));
  } else {
    res.json(ApiResponse.success(null, 'Default super admin account reset successfully'));
  }
});
