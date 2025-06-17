import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt.js';
import { resendOtpToUser, sendOtpToUser, verifyUserOtp } from '../utils/otp.js';

export const requestOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone is required' });

  try {
    await sendOtpToUser(phone);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
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


