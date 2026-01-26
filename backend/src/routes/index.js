import express from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import customerRoutes from './customer.routes.js';
import orderRoutes from './order.routes.js';
import storeRoutes from './store.routes.js';
import employeeRoutes from './employee.routes.js';
import inventoryRoutes from './inventory.routes.js';
import paymentRoutes from './payment.routes.js';
import dashboardRoutes from './dashboard.routes.js';

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
router.use('/dashboard', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/stores', storeRoutes);
router.use('/employees', employeeRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/payments', paymentRoutes);

export default router;
