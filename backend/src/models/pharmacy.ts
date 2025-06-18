import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: undefined,
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
    deliveryAvailable: { type: Boolean, default: false },
    rating: { type: Number, default: 4 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Only create geo index if coordinates exist
pharmacySchema.index({ location: "2dsphere" }, { sparse: true });

export default mongoose.model("Pharmacy", pharmacySchema);
