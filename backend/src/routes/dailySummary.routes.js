import express from 'express';
import { authorize } from '../middleware/rbac.middleware.js';
import {
  getSummary,
  saveDailySummary,
  getStoresList,
  getSettings,
  updateSettings,
} from '../controllers/dailySummary.controller.js';

const router = express.Router();

const canView   = authorize('STORE_ADMIN', 'SUPER_ADMIN', 'MANAGER', 'ACCOUNTANT');
const adminOnly = authorize('STORE_ADMIN', 'SUPER_ADMIN');

// NOTE: named sub-routes MUST come before any dynamic /:param routes
router.get('/stores',                adminOnly, getStoresList);
router.get('/notification-settings', adminOnly, getSettings);
router.put('/notification-settings', adminOnly, updateSettings);

router.get('/',       canView,   getSummary);
router.post('/save',  adminOnly, saveDailySummary);

export default router;
