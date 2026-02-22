import express from 'express';
import { getAuthUrl, handleCallback, getStatus, disconnectZoho } from '../controllers/zoho.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Public — Zoho redirects back here with auth code (no token needed)
router.get('/callback', handleCallback);

// Protected — must be authenticated store admin
router.get('/auth-url', verifyToken, authorize('STORE_ADMIN', 'SUPER_ADMIN'), getAuthUrl);
router.get('/status', verifyToken, authorize('STORE_ADMIN', 'MANAGER', 'SUPER_ADMIN'), getStatus);
router.delete('/disconnect', verifyToken, authorize('STORE_ADMIN', 'SUPER_ADMIN'), disconnectZoho);

export default router;
