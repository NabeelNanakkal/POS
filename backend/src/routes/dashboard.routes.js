import express from 'express';
import { getDashboardStats, getActivityCounts, getEmployeeStats } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All dashboard routes need authentication
router.use(verifyToken);

router.get('/stats', authorize('STORE_ADMIN', 'MANAGER', 'CASHIER'), getDashboardStats);
router.get('/activity', authorize('STORE_ADMIN', 'MANAGER', 'CASHIER'), getActivityCounts);
router.get('/employee-stats', authorize('STORE_ADMIN', 'MANAGER'), getEmployeeStats);

export default router;
