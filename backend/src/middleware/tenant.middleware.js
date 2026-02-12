import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Tenant isolation middleware
 * Automatically filters queries by store for non-super-admin users
 * Injects store field into create operations
 */
export const tenantFilter = asyncHandler(async (req, res, next) => {
  // Skip for super admins - they don't have a store
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    req.storeId = null;
    return next();
  }

  // Allow STORE_ADMIN to proceed even without a store (for creating their first store)
  if (req.user && req.user.role === 'STORE_ADMIN') {
    req.storeId = req.user.store ? (req.user.store._id || req.user.store) : null;
    return next();
  }

  // All other users must have a store
  if (!req.user || !req.user.store) {
    throw ApiError.forbidden('User must be associated with a store');
  }

  // Attach store ID to request for easy access
  req.storeId = req.user.store._id || req.user.store;
  
  next();
});

/**
 * Middleware to inject store into request body for create operations
 */
export const injectStore = asyncHandler(async (req, res, next) => {
  // Skip for super admins
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // Inject store into body if not already present
  if (req.storeId && !req.body.store) {
    req.body.store = req.storeId;
  }

  next();
});

/**
 * Middleware to ensure query filters by store
 * Use this for routes that need automatic store filtering
 */
export const requireStoreContext = asyncHandler(async (req, res, next) => {
  if (!req.storeId && req.user.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('Store context is required for this operation');
  }
  next();
});
