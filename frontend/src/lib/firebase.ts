import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase is optional: when no API key is configured the app runs in a
// built-in "dev auth" mode so the full flow works without credentials.
export const firebaseEnabled = Boolean(config.apiKey);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;

export function getFirebaseAuth(): Auth | undefined {
  if (!firebaseEnabled) return undefined;
  if (!app) {
    app = initializeApp(config);
    authInstance = getAuth(app);
  }
  return authInstance;
}
