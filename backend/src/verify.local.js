// End-to-end API check against an in-memory MongoDB — no external infra needed.
// Run: node src/verify.local.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import { products } from './seed/products.data.js';

let pass = 0;
let fail = 0;
function check(label, cond) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.error(`  ✗ ${label}`);
  }
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  await mongoose.connect(process.env.MONGO_URI);

  // Seed
  await Product.insertMany(products);
  await Coupon.insertMany([
    { code: 'NETRAM10', type: 'percent', value: 10, minOrder: 0 },
    { code: 'FLAT200', type: 'flat', value: 200, minOrder: 999 },
  ]);

  const { default: app } = await import('./app.js');
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const j = (r) => r.json();

  console.log('\nNetram API verification\n');

  // Health
  const health = await fetch(`${base}/api/health`).then(j);
  check('health endpoint ok', health.ok === true);

  // Products list
  const list = await fetch(`${base}/api/products`).then(j);
  check(`products list returns ${products.length} items`, list.length === products.length);

  // Search
  const search = await fetch(`${base}/api/products?search=Ray-Ban`).then(j);
  check('text search "Ray-Ban" returns results', search.length > 0 && search.every((p) => p.brand === 'Ray-Ban'));

  // Filter
  const sun = await fetch(`${base}/api/products?category=sunglasses`).then(j);
  check('filter category=sunglasses works', sun.length > 0 && sun.every((p) => p.category === 'sunglasses'));

  // Product detail
  const detail = await fetch(`${base}/api/products/${list[0]._id}`).then(j);
  check('product detail by id', detail._id === list[0]._id);

  // Coupon validate
  const coupon = await fetch(`${base}/api/coupons/validate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'NETRAM10', subtotal: 1000 }),
  }).then(j);
  check('coupon NETRAM10 gives 10% (100 off 1000)', coupon.valid && coupon.discount === 100);

  const badCoupon = await fetch(`${base}/api/coupons/validate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'FLAT200', subtotal: 500 }),
  });
  check('FLAT200 rejected below min order', badCoupon.status === 400);

  // Auth required
  const noAuth = await fetch(`${base}/api/orders`);
  check('orders require auth (401 without token)', noAuth.status === 401);

  // Custom request (public)
  const cr = await fetch(`${base}/api/custom-requests`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Ramesh', phone: '9999999999', description: 'Round gold frame like in photo' }),
  });
  check('custom request created (201)', cr.status === 201);

  // Checkup booking (public)
  const cb = await fetch(`${base}/api/checkups`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Sita', phone: '8888888888', location: 'Danapur', preferredDate: '2026-06-20' }),
  });
  check('checkup booking created (201)', cb.status === 201);

  // Full order flow (dev-mode auth: bearer = uid)
  const token = 'dev-user-123';
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'x-dev-phone': '7777777777' };

  await fetch(`${base}/api/users/sync`, { method: 'POST', headers: auth, body: JSON.stringify({ name: 'Test User' }) });
  const addr = await fetch(`${base}/api/users/addresses`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ fullName: 'Test User', phone: '7777777777', line1: 'Main Rd', city: 'Patna', state: 'Bihar', pincode: '800001' }),
  }).then(j);
  check('address added & defaulted', Array.isArray(addr) && addr[0].isDefault === true);

  const order = await fetch(`${base}/api/orders`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({
      items: [{ productId: list[0]._id, qty: 2 }],
      address: addr[0],
      paymentMethod: 'upi',
      couponCode: 'NETRAM10',
    }),
  }).then(j);
  const expectedSubtotal = list[0].price * 2;
  check('order subtotal repriced server-side', order.subtotal === expectedSubtotal);
  check('order applied coupon discount', order.discount === Math.round(expectedSubtotal * 0.1));
  check('order total = subtotal - discount', order.total === order.subtotal - order.discount);
  check('UPI order marked paid', order.paymentStatus === 'paid');

  const codOrder = await fetch(`${base}/api/orders`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ items: [{ productId: list[1]._id, qty: 1 }], address: addr[0], paymentMethod: 'cod' }),
  }).then(j);
  check('COD order marked pending', codOrder.paymentStatus === 'pending');

  const myOrders = await fetch(`${base}/api/orders`, { headers: auth }).then(j);
  check('user has 2 orders', myOrders.length === 2);

  server.close();
  await mongoose.disconnect();
  await mongod.stop();

  console.log(`\nResult: ${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
