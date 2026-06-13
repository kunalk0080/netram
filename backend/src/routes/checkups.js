import { Router } from 'express';
import CheckupBooking from '../models/CheckupBooking.js';

const router = Router();

// POST /api/checkups  { name, phone, location, preferredDate }
router.post('/', async (req, res) => {
  try {
    const { name, phone, location, preferredDate } = req.body;
    if (!name || !phone || !location) {
      return res.status(400).json({ error: 'Name, phone and location are required' });
    }
    const booking = await CheckupBooking.create({ name, phone, location, preferredDate });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
