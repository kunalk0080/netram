import { Router } from 'express';
import Coupon from '../models/Coupon.js';

const router = Router();

// POST /api/coupons/validate  { code, subtotal }
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });
    if (!coupon) return res.status(404).json({ valid: false, error: 'Invalid coupon code' });

    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        valid: false,
        error: `Add items worth ₹${coupon.minOrder - subtotal} more to use this coupon`,
      });
    }

    const discount =
      coupon.type === 'percent'
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;

    res.json({ valid: true, code: coupon.code, discount, description: coupon.description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
