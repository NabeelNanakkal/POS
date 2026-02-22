import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as shiftService from '../services/shift.service.js';

export const openShift = asyncHandler(async (req, res) => {
  const shift = await shiftService.openShift(req.user._id, req.user.store, req.body);
  res.status(201).json(ApiResponse.created(shift, 'Shift opened successfully'));
});

export const closeShift = asyncHandler(async (req, res) => {
  const shift = await shiftService.closeShift(req.user._id, req.body);
  res.json(ApiResponse.success(shift, 'Shift closed successfully'));
});

export const getCurrentShift = asyncHandler(async (req, res) => {
  const shift = await shiftService.getCurrentShift(req.user._id);
  if (!shift) return res.json(ApiResponse.success(null, 'No active shift found'));
  res.json(ApiResponse.success(shift, 'Current shift retrieved successfully'));
});

export const getStoreShifts = asyncHandler(async (req, res) => {
  const data = await shiftService.getStoreShifts(req.query, req.user);
  res.json(ApiResponse.success(data, 'Store shifts retrieved successfully'));
});

export const startBreak = asyncHandler(async (req, res) => {
  const shift = await shiftService.startBreak(req.user._id, req.body);
  res.json(ApiResponse.success(shift, 'Break started successfully'));
});

export const endBreak = asyncHandler(async (req, res) => {
  const shift = await shiftService.endBreak(req.user._id);
  res.json(ApiResponse.success(shift, 'Break ended successfully'));
});
