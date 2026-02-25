import express from 'express';
import {
  getActiveSession,
  openSession,
  addCashMovement,
  getSessionSummary,
  closeSession,
  getSessions,
} from '../controllers/cashSession.controller.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Active session for current store/counter
router.get('/active', getActiveSession);

// Open a new session (cashier or above)
router.post('/open', openSession);

// Add manual cash-in / cash-out movement
router.post('/movement', addCashMovement);

// Session list (managers and above)
router.get('/', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), getSessions);

// Session detail + transactions
router.get('/:id/summary', getSessionSummary);

// Close session
router.patch('/:id/close', closeSession);

export default router;
