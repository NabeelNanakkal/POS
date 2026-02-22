import express from 'express';
import {
  openShift,
  closeShift,
  getCurrentShift,
  getStoreShifts,
  startBreak,
  endBreak
} from '../controllers/shift.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// User specific routes
router.post('/open', openShift);
router.post('/close', closeShift);
router.get('/current', getCurrentShift);
router.post('/break/start', startBreak);
router.post('/break/end', endBreak);

// Reporting routes (restricted to Manager/Admin)
router.get('/store', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), getStoreShifts);

export default router;
