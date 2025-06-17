import { Request, Response } from 'express';
import { sendOtp, verifyOtp } from '../utils/otp.js';
import { generateToken } from '../utils/jwt.js';
import User from '../models/user.js';

export const requestOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) { res.status(400).json({ message: 'Phone is required' });
return
}
  try {
    await sendOtp(phone);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtpAndLogin = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  if (!verifyOtp(phone, otp)) {
     res.status(400).json({ message: 'Invalid OTP' });
     return
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone, isVerified: true }); // optional: capture name/email later
  } else {
    user.isVerified = true;
    await user.save();
  } 

  const token = generateToken(user._id.toString(), user.role);
  res.status(200).json({ message: 'Login successful', token, user });
};
