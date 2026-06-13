import { Router } from 'express';
import CustomRequest from '../models/CustomRequest.js';

const router = Router();

// POST /api/custom-requests  { name, phone, description, budget }
router.post('/', async (req, res) => {
  try {
    const { name, phone, description, budget } = req.body;
    if (!name || !phone || !description) {
      return res.status(400).json({ error: 'Name, phone and description are required' });
    }
    const request = await CustomRequest.create({ name, phone, description, budget: budget || 0 });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
