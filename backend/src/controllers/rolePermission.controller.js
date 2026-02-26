import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { CONFIGURABLE_ROLES } from '../models/role-permission.model.js';
import {
  getOrCreatePermissions,
  updatePermissions,
  permissionsArrayToObject,
} from '../services/rolePermission.service.js';

// GET /role-permissions/my-permissions
export const getMyPermissions = asyncHandler(async (req, res) => {
  const { role, store } = req.user;

  if (['SUPER_ADMIN', 'STORE_ADMIN'].includes(role)) {
    return res.json(ApiResponse.success(null, 'Admin has full access — no restrictions'));
  }

  const storeId = store?._id || store;
  if (!storeId) throw ApiError.badRequest('User has no store assigned');

  const doc = await getOrCreatePermissions(storeId, role);
  const permissionsObj = permissionsArrayToObject(doc.permissions);

  res.json(ApiResponse.success(permissionsObj));
});

// GET /role-permissions/:role  (STORE_ADMIN only)
export const getPermissionsByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;

  if (!CONFIGURABLE_ROLES.includes(role)) {
    throw ApiError.badRequest(`Invalid role. Must be one of: ${CONFIGURABLE_ROLES.join(', ')}`);
  }

  const storeId = req.storeId;
  const doc = await getOrCreatePermissions(storeId, role);

  res.json(ApiResponse.success({ role, permissions: doc.permissions }));
});

// PUT /role-permissions/:role  (STORE_ADMIN only)
export const updatePermissionsByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const { permissions } = req.body;

  if (!CONFIGURABLE_ROLES.includes(role)) {
    throw ApiError.badRequest(`Invalid role. Must be one of: ${CONFIGURABLE_ROLES.join(', ')}`);
  }

  if (!Array.isArray(permissions)) {
    throw ApiError.badRequest('permissions must be an array');
  }

  const storeId = req.storeId;
  const doc = await updatePermissions(storeId, role, permissions, req.user._id);

  res.json(ApiResponse.success({ role, permissions: doc.permissions }, 'Permissions updated successfully'));
});
