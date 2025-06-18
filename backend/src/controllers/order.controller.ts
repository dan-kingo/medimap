// src/controllers/orderController.ts
import { Request, Response } from 'express';
import Order from '../models/order.js'
import { createNotification, notifyUserOrderStatus } from '../utils/notification.js';
import User from '../models/user.js';

export const placeOrder = async (req: Request, res: Response) => {
  try {
const userId = req.user?.userId; // Assumes auth middleware sets req.user
if (!userId) {
  res.status(401).json({ error: 'Unauthorized: userId missing' });
  return;
}
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

await createNotification({
  userId,
  message: 'Your order has been placed successfully.'
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

      if (user?._id) {
      await createNotification({
        userId: user._id.toString(),
        message: `Your order status has been updated to "${status}".`,
      });
    }
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};


export const getIncomingOrders = async (req: Request, res: Response) => {
  try {
    const pharmacyId = req.user?.userId;

    const orders = await Order.find({ 'items.pharmacy': pharmacyId })
      .populate('user', 'name address')
      .populate('items.medicine', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Fetching orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatuses = async (req: Request, res: Response) => {
  try {
    const { orderId, status, rejectionReason } = req.body;
    const pharmacyId = req.user?.userId;

    const order = await Order.findById(orderId);

    if (!order) {
       res.status(404).json({ error: 'Order not found' });
       return
    }

    const belongsToPharmacy = order.items.some((item) =>
      item.pharmacy.toString() === pharmacyId
    );

    if (!belongsToPharmacy) {
       res.status(403).json({ error: 'Unauthorized access' });
       return
    }

    order.status = status;

    if (status === 'Cancelled' && rejectionReason) {
      order.notifications.push({
        type: 'Rejection',
        message: rejectionReason,
        sentAt: new Date(),
      });
    }

    await order.save();

    res.status(200).json({ message: `Order ${status}`, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};
