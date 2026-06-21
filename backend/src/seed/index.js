import 'dotenv/config';
import mongoose from 'mongoose';
import { products } from './products.data.js';
import { coupons, reseed } from './seed.js';

async function run() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/netram';
  await mongoose.connect(MONGO_URI);
  console.log('[seed] Connected to MongoDB');

  await reseed();
  console.log(`[seed] Inserted ${products.length} products + ${coupons.length} coupons`);

  await mongoose.disconnect();
  console.log('[seed] Done');
}

run().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
