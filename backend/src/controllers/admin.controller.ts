// src/controllers/adminAuth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.js';
import User  from '../models/user.js';
import Pharmacy from '../models/pharmacy.js';

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

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// 2. Get pending pharmacy applications
export const getPendingPharmacies = async (_req: Request, res: Response) => {
  const pending = await Pharmacy.find({ status: 'pending' });
  res.json(pending);
};

// 3. Approve pharmacy
export const approvePharmacy = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Pharmacy.findByIdAndUpdate(id, { status: 'approved', isActive: true });
  res.json({ message: 'Pharmacy approved successfully' });
};

// 4. Reject pharmacy
export const rejectPharmacy = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Pharmacy.findByIdAndUpdate(id, { status: 'rejected', isActive: false });
  res.json({ message: 'Pharmacy rejected' });
};

// 5. Toggle active status
export const togglePharmacyActiveStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pharmacy = await Pharmacy.findById(id);
  if (!pharmacy) 
    { res.status(404).json({ message: 'Pharmacy not found' });
      return;
    }

  pharmacy.isActive = !pharmacy.isActive;
  await pharmacy.save();
  res.json({ message: `Pharmacy ${pharmacy.isActive ? 'activated' : 'deactivated'}` });
};