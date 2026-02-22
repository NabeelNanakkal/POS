import express from 'express';
import { getPaymentModes } from '../controllers/payment-mode.controller.js';

const router = express.Router();

router.get('/', getPaymentModes);

export default router;
