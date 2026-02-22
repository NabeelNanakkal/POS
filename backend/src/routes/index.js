import express from 'express';
import authRoutes from './auth.routes.js';
import superAdminRoutes from './super-admin.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import customerRoutes from './customer.routes.js';
import orderRoutes from './order.routes.js';
import storeRoutes from './store.routes.js';
import employeeRoutes from './employee.routes.js';
import inventoryRoutes from './inventory.routes.js';
import paymentRoutes from './payment.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import shiftRoutes from './shift.routes.js';
import discountRoutes from './discount.routes.js';
import paymentModeRoutes from './payment-mode.routes.js';
import countryRoutes from './country.routes.js';
import reportRoutes from './report.routes.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { tenantFilter, injectStore } from '../middleware/tenant.middleware.js';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'POS API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);

// Super admin routes (no tenant filtering)
router.use('/super-admin', superAdminRoutes);

// Apply tenant filtering to all store-specific routes
router.use('/dashboard', verifyToken, tenantFilter, dashboardRoutes);
router.use('/products', verifyToken, tenantFilter, injectStore, productRoutes);
router.use('/categories', verifyToken, tenantFilter, injectStore, categoryRoutes);
router.use('/customers', verifyToken, tenantFilter, injectStore, customerRoutes);
router.use('/orders', verifyToken, tenantFilter, injectStore, orderRoutes);
router.use('/stores', verifyToken, tenantFilter, storeRoutes);
router.use('/employees', verifyToken, tenantFilter, injectStore, employeeRoutes);
router.use('/inventory', verifyToken, tenantFilter, injectStore, inventoryRoutes);
router.use('/payments', verifyToken, tenantFilter, injectStore, paymentRoutes);
router.use('/shifts', verifyToken, tenantFilter, injectStore, shiftRoutes);
router.use('/discounts', verifyToken, tenantFilter, injectStore, discountRoutes);
router.use('/payment-modes', verifyToken, tenantFilter, injectStore, paymentModeRoutes);
router.use('/countries', countryRoutes); // No tenant filtering for countries
router.use('/reports', verifyToken, tenantFilter, reportRoutes);

export default router;
