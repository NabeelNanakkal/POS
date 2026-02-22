import express from 'express';
import { getSalesReport } from '../controllers/report.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Reports require Manager, Admin, or Super Admin role
router.get('/sales', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN', 'ACCOUNTANT'), getSalesReport);

export default router;
