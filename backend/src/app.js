import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/products.js';
import couponRoutes from './routes/coupons.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import customRequestRoutes from './routes/customRequests.js';
import checkupRoutes from './routes/checkups.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());

// ---- API ----
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'netram-api' }));

app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/checkups', checkupRoutes);

// Unmatched API routes → JSON 404
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ---- Frontend (single-deployment mode) ----
// When the React build exists, serve it from this same server so one deploy
// serves both the site and the API. In local dev the Vite server handles the
// UI instead, and this block is simply skipped.
const clientDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
} else {
  app.get('/', (_req, res) =>
    res.json({ service: 'netram-api', note: 'Frontend build not found — API only. Run `npm run build` in frontend/.' })
  );
}

export default app;
