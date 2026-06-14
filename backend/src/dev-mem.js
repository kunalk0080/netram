// Run the API with a throwaway in-memory MongoDB (auto-seeded).
// Great for local demos without MongoDB Atlas. Run: npm run dev:mem
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import { products } from './seed/products.data.js';

const PORT = process.env.PORT || 4000;
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());
console.log('[dev-mem] In-memory MongoDB started');

await Product.insertMany(products);
await Coupon.insertMany([
  { code: 'NETRAM10', type: 'percent', value: 10, minOrder: 0, description: '10% off your order' },
  { code: 'FLAT200', type: 'flat', value: 200, minOrder: 999, description: '₹200 off above ₹999' },
  { code: 'GRAM50', type: 'flat', value: 50, minOrder: 0, description: '₹50 village welcome offer' },
]);
console.log(`[dev-mem] Seeded ${products.length} products + 3 coupons`);

const { default: app } = await import('./app.js');
app.listen(PORT, () => console.log(`[dev-mem] Netram API on http://localhost:${PORT}`));

const stop = async () => { await mongoose.disconnect(); await mongod.stop(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
