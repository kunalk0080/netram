import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: { type: Number, default: 1 },
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    address: { type: Object, required: true },
    paymentMethod: { type: String, enum: ['upi', 'card', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'pending' },
    couponCode: { type: String, default: '' },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'confirmed', 'cancelled'], default: 'placed' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
