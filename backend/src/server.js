import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nayanaa';

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[db] Connected to MongoDB');
    app.listen(PORT, () => console.log(`[server] Nayanaa API on http://localhost:${PORT}`));
  } catch (err) {
    console.error('[db] Connection error:', err.message);
    process.exit(1);
  }
}

start();
