import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  type ConfirmationResult,
} from 'firebase/auth';
import { firebaseEnabled, getFirebaseAuth } from '../lib/firebase';
import { api, setToken } from '../lib/api';

export interface AppUser {
  uid: string;
  name?: string;
  phone?: string;
  email?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  firebaseEnabled: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  emailAuth: (email: string, password: string, isSignup: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = 'nayanaa_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  // Persist + sync to backend after any successful login.
  async function establish(appUser: AppUser, token: string) {
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(appUser));
    setUser(appUser);
    try {
      await api.syncUser({ name: appUser.name, phone: appUser.phone, email: appUser.email });
    } catch {
      /* non-fatal — profile sync can retry later */
    }
  }

  useEffect(() => {
    if (firebaseEnabled) {
      const auth = getFirebaseAuth()!;
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const token = await fbUser.getIdToken();
          const appUser: AppUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '',
            name: fbUser.displayName || '',
          };
          await establish(appUser, token);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem(USER_KEY);
        }
        setLoading(false);
      });
      return () => unsub();
    }
    // Dev mode: restore from localStorage.
    const saved = localStorage.getItem(USER_KEY);
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  async function sendOtp(phone: string) {
    const normalized = phone.startsWith('+') ? phone : `+91${phone}`;
    if (!firebaseEnabled) {
      setPendingPhone(normalized);
      return;
    }
    const auth = getFirebaseAuth()!;
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    const result = await signInWithPhoneNumber(auth, normalized, verifier);
    setConfirmation(result);
  }

  async function verifyOtp(code: string) {
    if (!firebaseEnabled) {
      const uid = `dev:phone:${pendingPhone}`;
      await establish({ uid, phone: pendingPhone }, uid);
      return;
    }
    if (!confirmation) throw new Error('Please request an OTP first');
    await confirmation.confirm(code); // onAuthStateChanged handles the rest
  }

  async function emailAuth(email: string, password: string, isSignup: boolean) {
    if (!firebaseEnabled) {
      const uid = `dev:email:${email}`;
      await establish({ uid, email }, uid);
      return;
    }
    const auth = getFirebaseAuth()!;
    if (isSignup) await createUserWithEmailAndPassword(auth, email, password);
    else await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handles establish()
  }

  async function logout() {
    if (firebaseEnabled) await signOut(getFirebaseAuth()!);
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, firebaseEnabled, sendOtp, verifyOtp, emailAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
