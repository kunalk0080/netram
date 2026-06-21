import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { products } from './products.data.js';

export const coupons = [
  { code: 'NETRAM10', type: 'percent', value: 10, minOrder: 0, description: '10% off your order' },
  { code: 'FLAT200', type: 'flat', value: 200, minOrder: 999, description: '₹200 off on orders above ₹999' },
  { code: 'GRAM50', type: 'flat', value: 50, minOrder: 0, description: '₹50 off — village welcome offer' },
];

// Seed only when the catalogue is empty. Returns true if it seeded.
export async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return false;
  await Product.insertMany(products);
  await Coupon.deleteMany({});
  await Coupon.insertMany(coupons);
  return true;
}

// Force a clean reseed (used by `npm run seed`).
export async function reseed() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  await Coupon.deleteMany({});
  await Coupon.insertMany(coupons);
}
