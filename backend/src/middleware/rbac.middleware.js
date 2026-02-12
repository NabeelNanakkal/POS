import ApiError from '../utils/ApiError.js';

/**
 * Role-based access control middleware
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden('You do not have permission to access this resource');
    }

    next();
  };
};

/**
 * Check if user owns the resource or is admin
 * @param {string} resourceUserIdField - Field name in req.params that contains the user ID
 */
export const authorizeOwnerOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const resourceUserId = req.params[resourceUserIdField];
    const isOwner = req.user._id.toString() === resourceUserId;
    const isAdmin = ['SUPER_ADMIN', 'STORE_ADMIN'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      throw ApiError.forbidden('You do not have permission to access this resource');
    }

    next();
  };
};

/**
 * Require super admin role
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('Super admin access required');
  }

  next();
};

/**
 * Require store admin role or higher
 */
export const requireStoreAdmin = (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  if (!['SUPER_ADMIN', 'STORE_ADMIN'].includes(req.user.role)) {
    throw ApiError.forbidden('Store admin access required');
  }

  next();
};

/**
 * Check if user belongs to the same store or is admin
 */
export const authorizeSameStoreOrAdmin = (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  const isAdmin = ['SUPER_ADMIN', 'STORE_ADMIN'].includes(req.user.role);
  
  if (isAdmin) {
    return next();
  }

  // For store-specific checks, implement based on your business logic
  // This is a placeholder that can be customized
  next();
};
