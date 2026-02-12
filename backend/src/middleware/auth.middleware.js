import jwt from 'jsonwebtoken';
import { config } from '../config/constants.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Store from '../models/Store.js';

/**
 * Verify JWT access token and attach user to request
 */
export const verifyToken = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('User account is deactivated');
    }

    // Check if store admin is active (for non-super-admins)
    if (user.role !== 'SUPER_ADMIN' && user.store) {
      const store = await Store.findById(user.store).populate('owner', 'isActive');
      
      if (store && store.owner && !store.owner.isActive) {
        throw ApiError.forbidden('Your store administrator account has been deactivated. Please contact support.');
      }
    }

    // Attach user to request
    req.user = user;
    
    // Attach storeId for non-super-admins
    if (user.role !== 'SUPER_ADMIN' && user.store) {
      req.storeId = user.store._id || user.store;
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expired');
    }
    throw error;
  }
});

/**
 * Optional authentication - doesn't throw error if no token
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
    }
  }
  
  next();
});
