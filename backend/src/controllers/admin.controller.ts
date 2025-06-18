// src/controllers/adminAuth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin';

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) 
        {
             res.status(401).json({ message: 'Invalid credentials' });
                return;
        }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) 
        {
             res.status(401).json({ message: 'Invalid credentials' });
                return;
        }

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
