import { Router } from 'express';
import User from '../models/User.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';

const router = Router();
router.use(verifyFirebaseToken);

async function getOrCreateUser(req) {
  let user = await User.findOne({ firebaseUid: req.user.uid });
  if (!user) {
    user = await User.create({
      firebaseUid: req.user.uid,
      email: req.user.email || '',
      phone: req.user.phone || '',
    });
  }
  return user;
}

// POST /api/users/sync — upsert user from Firebase token + optional profile fields
router.post('/sync', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const update = {
      firebaseUid: req.user.uid,
      ...(name !== undefined ? { name } : {}),
      ...(phone || req.user.phone ? { phone: phone || req.user.phone } : {}),
      ...(email || req.user.email ? { email: email || req.user.email } : {}),
    };
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/me
router.get('/me', async (req, res) => {
  const user = await getOrCreateUser(req);
  res.json(user);
});

// GET /api/users/addresses
router.get('/addresses', async (req, res) => {
  const user = await getOrCreateUser(req);
  res.json(user.addresses);
});

// POST /api/users/addresses
router.post('/addresses', async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    const address = req.body;
    if (address.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((a) => (a.isDefault = false));
      address.isDefault = true;
    }
    user.addresses.push(address);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/users/addresses/:addressId — set as default
router.put('/addresses/:addressId', async (req, res) => {
  const user = await getOrCreateUser(req);
  const addr = user.addresses.id(req.params.addressId);
  if (!addr) return res.status(404).json({ error: 'Address not found' });
  user.addresses.forEach((a) => (a.isDefault = false));
  addr.isDefault = true;
  await user.save();
  res.json(user.addresses);
});

// DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', async (req, res) => {
  const user = await getOrCreateUser(req);
  const addr = user.addresses.id(req.params.addressId);
  if (!addr) return res.status(404).json({ error: 'Address not found' });
  addr.deleteOne();
  await user.save();
  res.json(user.addresses);
});

export default router;
