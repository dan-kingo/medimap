// src/routes/orderRoutes.ts
import express from 'express';

import { upload } from '../utils/upload';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { getMyOrders, placeOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  upload.single('prescription'),
  placeOrder
);

router.get('/my', authenticateUser, getMyOrders); 
export default router;
