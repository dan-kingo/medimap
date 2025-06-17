// src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: false },
    location: { type: String },
    password: { type: String }, // optional for password-based login
    role: { type: String, enum: ['user', 'pharmacy', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
