import admin from 'firebase-admin';

let initialized = false;
let firebaseEnabled = false;

function initFirebase() {
  if (initialized) return;
  initialized = true;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw && raw.trim()) {
    try {
      const serviceAccount = JSON.parse(raw);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      firebaseEnabled = true;
      console.log('[auth] Firebase Admin initialized — verifying real ID tokens');
    } catch (err) {
      console.error('[auth] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  } else {
    console.warn('[auth] FIREBASE_SERVICE_ACCOUNT_JSON not set — running in DEV mode (tokens trusted as-is)');
  }
}

/**
 * Verifies a Firebase ID token from the Authorization: Bearer <token> header.
 * Attaches req.user = { uid, email, phone }.
 *
 * Dev fallback: when no service account is configured, the bearer token is
 * treated as the uid directly so the full flow can be exercised without
 * Firebase credentials.
 */
export default async function verifyFirebaseToken(req, res, next) {
  initFirebase();
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization bearer token' });
  }

  if (!firebaseEnabled) {
    // Dev mode: trust the token string as the uid.
    req.user = { uid: token, email: req.headers['x-dev-email'] || '', phone: req.headers['x-dev-phone'] || '' };
    return next();
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email || '', phone: decoded.phone_number || '' };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
