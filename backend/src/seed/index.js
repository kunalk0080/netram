import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { products } from './products.data.js';

const coupons = [
  { code: 'NAYANAA10', type: 'percent', value: 10, minOrder: 0, description: '10% off your order' },
  { code: 'FLAT200', type: 'flat', value: 200, minOrder: 999, description: '₹200 off on orders above ₹999' },
  { code: 'GRAM50', type: 'flat', value: 50, minOrder: 0, description: '₹50 off — village welcome offer' },
];

async function run() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nayanaa';
  await mongoose.connect(MONGO_URI);
  console.log('[seed] Connected to MongoDB');

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`[seed] Inserted ${products.length} products`);

  await Coupon.deleteMany({});
  await Coupon.insertMany(coupons);
  console.log(`[seed] Inserted ${coupons.length} coupons`);

  await mongoose.disconnect();
  console.log('[seed] Done');
}

run().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
