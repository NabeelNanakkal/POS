// Country routes
import express from 'express';
import { getAllCountries, getCountryById, getCountryByCode } from '../controllers/country.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all countries
router.get('/', getAllCountries);

// Get country by ID
router.get('/:id', getCountryById);

// Get country by ISO code
router.get('/code/:code', getCountryByCode);

export default router;
