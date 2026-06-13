import express from 'express';
import cors from 'cors';

import productRoutes from './routes/products.js';
import couponRoutes from './routes/coupons.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import customRequestRoutes from './routes/customRequests.js';
import checkupRoutes from './routes/checkups.js';

const app = express();

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'nayanaa-api' }));

app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/checkups', checkupRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

export default app;
