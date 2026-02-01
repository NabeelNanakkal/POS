import express from 'express';
import {
  getInventory,
  getInventoryById,
  adjustInventory,
  transferInventory,
  getLowStockAlerts,
} from '../controllers/inventoryController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Alerts route (before /:id to avoid conflict)
router.get('/alerts', getLowStockAlerts);

// Inventory routes
router.get('/', getInventory);
router.get('/:id', getInventoryById);
router.post('/adjust', authorize('INVENTORY_MANAGER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'), adjustInventory);
router.post('/transfer', authorize('INVENTORY_MANAGER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'), transferInventory);

export default router;
