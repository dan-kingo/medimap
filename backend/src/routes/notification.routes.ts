// src/routes/notificationRoutes.ts
import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware';
import { getMyNotifications, getUnreadCount, markAllAsRead, markAsRead } from '../controllers/notification.controller';

const router = express.Router();

router.get('/', authenticateUser, getMyNotifications);
router.get('/all', authenticateUser, markAllAsRead); // Assuming this is for all notifications
router.patch('/:id/read', authenticateUser, markAsRead);
router.get('/unread/count', authenticateUser, getUnreadCount);

export default router;
