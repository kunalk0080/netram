import { Router } from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';

const router = Router();
router.use(verifyFirebaseToken);

async function getUser(req) {
  let user = await User.findOne({ firebaseUid: req.user.uid });
  if (!user) user = await User.create({ firebaseUid: req.user.uid, email: req.user.email || '' });
  return user;
}

// POST /api/orders  { items:[{productId, qty}], address, paymentMethod, couponCode }
router.post('/', async (req, res) => {
  try {
    const user = await getUser(req);
    const { items = [], address, paymentMethod, couponCode } = req.body;

    if (!items.length) return res.status(400).json({ error: 'Cart is empty' });
    if (!address) return res.status(400).json({ error: 'Delivery address is required' });
    if (!['upi', 'card', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Re-price from the database so totals can't be tampered client-side.
    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } });
    const priceMap = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const p = priceMap.get(String(item.productId));
      if (!p) continue;
      const qty = Math.max(1, Number(item.qty) || 1);
      subtotal += p.price * qty;
      orderItems.push({ productId: p._id, name: p.name, price: p.price, qty, image: p.images[0] || '' });
    }
    if (!orderItems.length) return res.status(400).json({ error: 'No valid products in cart' });

    // Validate coupon server-side.
    let discount = 0;
    let appliedCode = '';
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), active: true });
      if (coupon && subtotal >= coupon.minOrder) {
        discount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
        appliedCode = coupon.code;
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Simulated payment: UPI/Card succeed instantly; COD is pending.
    const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'paid';

    const order = await Order.create({
      userId: user._id,
      items: orderItems,
      address,
      paymentMethod,
      paymentStatus,
      couponCode: appliedCode,
      subtotal,
      discount,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — current user's orders
router.get('/', async (req, res) => {
  const user = await getUser(req);
  const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
