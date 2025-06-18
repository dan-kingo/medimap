// src/routes/orderRoutes.ts
import express from 'express';

import { upload } from '../utils/upload';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { getIncomingOrders, getMyOrders, getOrderById, placeOrder, updateOrderStatus, updateOrderStatuses } from '../controllers/order.controller.js';
import validate from '../middlewares/validationMiddleware.js';
import { placeOrderBodySchema, updateOrderStatusSchema } from '../validations/order.schema.js';

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  upload.single('prescription'),
  validate(placeOrderBodySchema),
  placeOrder
);

router.get('/my', authenticateUser,  getMyOrders); 
export default router;
router.get('/:id', authenticateUser, getOrderById); 
router.patch(
  '/:id/status',
  authenticateUser,
  validate(updateOrderStatusSchema),
updateOrderStatus)

router.get('/', authenticateUser, getIncomingOrders);
router.post('/status', authenticateUser, validate(updateOrderStatusSchema), updateOrderStatuses);
