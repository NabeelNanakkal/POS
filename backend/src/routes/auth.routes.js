import express from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  changePassword,
  getMe,
  setupAdmin,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  changePasswordValidator,
} from '../validators/auth.validator.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', refreshTokenValidator, validate, refreshAccessToken);
// Setup default admin - rate limited but public
router.post('/setup-admin', authLimiter, setupAdmin);

// Protected routes
router.post('/logout', verifyToken, logout);
router.post('/change-password', verifyToken, changePasswordValidator, validate, changePassword);
router.get('/me', verifyToken, getMe);

export default router;
