import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as superAdminService from '../services/super-admin.service.js';

export const createStoreAdmin = asyncHandler(async (req, res) => {
  const data = await superAdminService.createStoreAdmin(req.body);
  res.status(201).json(ApiResponse.created(data, 'Store admin created successfully'));
});

export const getStoreAdmins = asyncHandler(async (req, res) => {
  const data = await superAdminService.getStoreAdmins(req.query);
  res.json(ApiResponse.success(data));
});

export const getStoreAdminById = asyncHandler(async (req, res) => {
  const data = await superAdminService.getStoreAdminById(req.params.id);
  res.json(ApiResponse.success(data));
});

export const updateStoreAdmin = asyncHandler(async (req, res) => {
  const data = await superAdminService.updateStoreAdmin(req.params.id, req.body);
  res.json(ApiResponse.success(data, 'Store admin updated successfully'));
});

export const deactivateStoreAdmin = asyncHandler(async (req, res) => {
  await superAdminService.deactivateStoreAdmin(req.params.id);
  res.json(ApiResponse.success(null, 'Store admin deactivated successfully. All associated store users will be unable to login.'));
});

export const getAllStores = asyncHandler(async (req, res) => {
  const data = await superAdminService.getAllStores(req.query);
  res.json(ApiResponse.success(data));
});

export const getSuperAdminStats = asyncHandler(async (req, res) => {
  const stats = await superAdminService.getSuperAdminStats();
  res.json(ApiResponse.success(stats));
});
