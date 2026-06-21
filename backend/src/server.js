import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { seedIfEmpty } from './seed/seed.js';

const PORT = process.env.PORT || 4000;

async function start() {
  let uri = process.env.MONGO_URI;
  let memServer = null;

  try {
    // No database configured? Spin up an ephemeral in-memory MongoDB so the
    // app runs with zero setup. Data resets on every restart — set MONGO_URI
    // (e.g. MongoDB Atlas) later for real persistence.
    if (!uri) {
      console.warn('[db] MONGO_URI not set — using an ephemeral in-memory database (data resets on restart).');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memServer = await MongoMemoryServer.create();
      uri = memServer.getUri();
    }

    await mongoose.connect(uri);
    console.log('[db] Connected to MongoDB');

    if (memServer) {
      const seeded = await seedIfEmpty();
      if (seeded) console.log('[db] In-memory database seeded with products + coupons');
    }

    app.listen(PORT, () => console.log(`[server] Netram running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('[startup] error:', err.message);
    process.exit(1);
  }
}

start();
