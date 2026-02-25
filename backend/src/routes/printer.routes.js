import express from 'express';
import {
  getPrinters,
  getPrinterById,
  createPrinter,
  updatePrinter,
  deletePrinter,
  getPrintConfig,
  updatePrintConfig,
} from '../controllers/printer.controller.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Print config (single document per store) — place before /:id to avoid conflict
router.get('/config', getPrintConfig);
router.put('/config', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), updatePrintConfig);

// Printer CRUD
router.get('/', getPrinters);
router.get('/:id', getPrinterById);
router.post('/', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), createPrinter);
router.put('/:id', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), updatePrinter);
router.delete('/:id', authorize('STORE_ADMIN', 'SUPER_ADMIN'), deletePrinter);

export default router;
