import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.query, { ...req.user.toObject(), storeId: req.storeId });
  res.json(ApiResponse.success(stats, 'Dashboard stats fetched successfully'));
});

export const getActivityCounts = asyncHandler(async (req, res) => {
  const data = await dashboardService.getActivityCounts(req.query);
  res.json(ApiResponse.success(data, 'Activity counts fetched successfully'));
});

export const getEmployeeStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getEmployeeStats(req.query, { ...req.user.toObject(), storeId: req.storeId });
  res.json(ApiResponse.success(stats));
});
