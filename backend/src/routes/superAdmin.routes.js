import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireSuperAdmin } from '../middleware/rbac.middleware.js';
import {
  createStoreAdmin,
  getStoreAdmins,
  getStoreAdminById,
  updateStoreAdmin,
  deactivateStoreAdmin,
  getAllStores,
  getSuperAdminStats,
} from '../controllers/superAdminController.js';

const router = express.Router();

// All routes require super admin authentication
router.use(verifyToken);
router.use(requireSuperAdmin);

// Store admin management
router.post('/store-admins', createStoreAdmin);
router.get('/store-admins', getStoreAdmins);
router.get('/store-admins/:id', getStoreAdminById);
router.put('/store-admins/:id', updateStoreAdmin);
router.delete('/store-admins/:id', deactivateStoreAdmin);

// Store viewing (read-only)
router.get('/stores', getAllStores);

// Stats
router.get('/stats', getSuperAdminStats);

export default router;
