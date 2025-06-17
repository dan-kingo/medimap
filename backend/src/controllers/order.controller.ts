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

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const orders = await Order.find({ user: userId })
      .populate('items.medicine', 'name strength type') // include medicine info
      .populate('items.pharmacy', 'name address')        // include pharmacy info
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};