import express from 'express';
import { getPaymentModes } from '../controllers/paymentModeController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(verifyToken, getPaymentModes);

export default router;
