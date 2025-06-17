// src/controllers/orderController.ts
import { Request, Response } from 'express';
import Order from '../models/order.js'

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // Assumes auth middleware sets req.user
    const {
      items,
      deliveryType,
      address,
      location, // { type: 'Point', coordinates: [lng, lat] }
      paymentMethod
    } = req.body;

    const prescriptionUrl = req.file ? `/uploads/prescriptions/${req.file.filename}` : null;

    const order = await Order.create({
      user: userId,
      items,
      deliveryType,
      address,
      location,
      status: 'Placed',
      paymentMethod: paymentMethod || 'COD',
      prescriptionUrl,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
