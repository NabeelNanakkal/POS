import express from 'express';
import { verifyToken as protect } from '../middleware/auth.middleware.js';
import {
  startShift,
  endShift,
  getCurrentShift,
  addCashMovement,
  getShiftHistory
} from '../controllers/shiftController.js';

const router = express.Router();

router.use(protect); // All shift routes require authentication

router.post('/start', startShift);
router.post('/end', endShift);
router.get('/current', getCurrentShift);
router.get('/history', getShiftHistory);
router.post('/movement', addCashMovement);

export default router;
