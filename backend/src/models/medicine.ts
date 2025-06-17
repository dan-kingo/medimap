// src/models/Medicine.ts
import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    strength: { type: String }, // e.g., "500mg"
    type: { type: String, enum: ['Tablet', 'Syrup', 'Injection'] },
    description: { type: String },
    requiresPrescription: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);
