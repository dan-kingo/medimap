// routes/home.routes.ts
import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { getNearbyPharmacies } from '../controllers/home.controller.js';
import validate from '../middlewares/validationMiddleware.js';
import { nearbyPharmaciesQuerySchema } from '../validations/home.schema.js';

const router = express.Router();

router.get('/', authenticateUser, getNearbyPharmacies);

export default router;
