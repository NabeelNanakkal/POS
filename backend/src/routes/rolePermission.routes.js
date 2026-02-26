import express from 'express';
import {
  getMyPermissions,
  getPermissionsByRole,
  updatePermissionsByRole,
} from '../controllers/rolePermission.controller.js';
import { requireStoreAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Must be before /:role to avoid "my-permissions" matching the param
router.get('/my-permissions', getMyPermissions);

router.get('/:role', requireStoreAdmin, getPermissionsByRole);
router.put('/:role', requireStoreAdmin, updatePermissionsByRole);

export default router;
