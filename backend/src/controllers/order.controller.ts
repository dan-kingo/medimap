// src/controllers/orderController.ts
import { Request, Response } from 'express';
import Order from '../models/order.js'
import { notifyUserOrderStatus } from '../utils/notification.js';
import User from '../models/user.js';

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

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // Assumes auth middleware sets req.user
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.medicine', 'name strength type')
      .populate('items.pharmacy', 'name address phone');

    if (!order) {
       res.status(404).json({ error: 'Order not found' });
       return
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) { res.status(404).json({ error: 'Order not found' });

    return }

    order.status = status;
    await order.save();

    const user = await User.findById(order.user);
    if (user?.phone) {
      await notifyUserOrderStatus(order._id.toString(), status, user.phone);
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};