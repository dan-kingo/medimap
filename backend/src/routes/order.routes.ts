// src/routes/orderRoutes.ts
import express from 'express';

import { upload } from '../utils/upload';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { placeOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  upload.single('prescription'),
  placeOrder
);

export default router;
