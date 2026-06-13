import mongoose from 'mongoose';

const checkupBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true }, // village / town
    preferredDate: { type: String, default: '' },
    status: { type: String, enum: ['requested', 'scheduled', 'done'], default: 'requested' },
  },
  { timestamps: true }
);

export default mongoose.model('CheckupBooking', checkupBookingSchema);
