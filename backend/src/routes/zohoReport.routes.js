import express from 'express';
import { authorize } from '../middleware/rbac.middleware.js';
import {
  getSyncStatus,
  triggerSync,
  getSummary,
  getSales,
  getPurchases,
  getPayments,
} from '../controllers/zohoReport.controller.js';

const router = express.Router();

const canView   = authorize('STORE_ADMIN', 'SUPER_ADMIN', 'MANAGER', 'ACCOUNTANT');
const adminOnly = authorize('STORE_ADMIN', 'SUPER_ADMIN');

router.get('/sync-status', adminOnly, getSyncStatus);
router.post('/sync',       adminOnly, triggerSync);
router.get('/summary',     canView,   getSummary);
router.get('/sales',       canView,   getSales);
router.get('/purchases',   canView,   getPurchases);
router.get('/payments',    canView,   getPayments);

export default router;
