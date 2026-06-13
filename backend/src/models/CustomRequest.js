import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, default: 0 },
    status: { type: String, enum: ['new', 'sourcing', 'fulfilled'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('CustomRequest', customRequestSchema);
