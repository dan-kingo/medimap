// src/utils/notifications.ts

import { sendSms } from "./twilo.js";
import Order from "../models/order.js"

export const notifyUserOrderStatus = async (orderId: string, newStatus: string, userPhone: string) => {
  const statusMessages: Record<string, string> = {
    Placed: 'Your order has been confirmed.',
    Accepted: 'Your order has been accepted by the pharmacy.',
    'Out for Delivery': 'Your order is out for delivery.',
    Delivered: 'Your order has been delivered.',
  };

  const message = statusMessages[newStatus];
  if (!message) return;

  try {
    // Send SMS
    await sendSms(userPhone, message);

    // Save notification in DB
    await Order.findByIdAndUpdate(orderId, {
      $push: {
        notifications: { type: 'status', message, sentAt: new Date() },
      },
    });
  } catch (err) {
    console.error('Notification error:', err);
  }
};
