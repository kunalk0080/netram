import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, enum: ['Lenskart', 'Titan', 'Ray-Ban'], required: true },
    category: { type: String, enum: ['eyeglasses', 'sunglasses'], required: true },
    gender: { type: String, enum: ['men', 'women', 'kids', 'unisex'], default: 'unisex' },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    images: { type: [String], default: [] },
    color: { type: String, default: '' },
    frameShape: { type: String, default: '' },
    material: { type: String, default: '' },
    description: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index powers the search query
productSchema.index({ name: 'text', brand: 'text', description: 'text', frameShape: 'text' });

export default mongoose.model('Product', productSchema);
