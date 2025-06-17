import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt.js';
import { resendOtpToUser, sendOtpToUser, verifyUserOtp } from '../utils/otp.js';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

export const requestOtp = async (req: Request, res: Response) => {
  const { phone, name, email, location } = req.body;

  if (!phone) {
     res.status(400).json({ message: 'Phone is required' });
     return
  }

  try {
    await sendOtpToUser({ phone, name, email, location });
    res.status(200).json({ message: 'OTP sent' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to send OTP' });
  }
};

export const verifyOtpAndLogin = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  try {
    const user = await verifyUserOtp(phone, otp);
    const token = generateToken(user._id.toString(), user.role);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone is required' });

  try {
    await resendOtpToUser(phone);
    res.status(200).json({ message: 'OTP resent' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const setPassword = async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!req.user?.userId) {
     res.status(401).json({ message: 'Unauthorized' });
     return
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
     res.status(404).json({ message: 'User not found' });
     return
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  res.status(200).json({ message: 'Password set successfully' });
};


export const loginWithPassword = async (req: Request, res: Response) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user || !user.password) {
     res.status(400).json({ message: 'User not found or password not set' });
     return
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
     res.status(401).json({ message: 'Invalid credentials' });
     return
  }

  const token = generateToken(user._id.toString(), user.role);
  res.status(200).json({ message: 'Login successful', token, user });
};
export const logout = (_req: Request, res: Response) => {
  // Invalidate the token on the client side
  res.status(200).json({ message: 'Logged out successfully' });
};