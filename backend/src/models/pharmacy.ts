// src/models/Pharmacy.ts
import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' }, // [lng, lat]
    },
    deliveryAvailable: { type: Boolean, default: false },
    rating: { type: Number, default: 4 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // linked account
  },
  { timestamps: true }
);

export default mongoose.model('Pharmacy', pharmacySchema);
