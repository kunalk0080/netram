import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOtp, verifyOtp, emailAuth, firebaseEnabled } = useAuth();

  const from = (location.state as { from?: string })?.from || '/account';
  const [tab, setTab] = useState<'mobile' | 'email'>('mobile');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // mobile
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  async function run(fn: () => Promise<void>, after?: () => void) {
    setError('');
    setBusy(true);
    try {
      await fn();
      after?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const done = () => navigate(from, { replace: true });

  return (
    <div className="container-page flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold">{t('auth.title')}</h1>
        <p className="mt-1 text-sm text-subtle">{t('auth.subtitle')}</p>

        {/* Tabs */}
        <div className="mt-6 flex rounded-full border border-line p-1">
          {(['mobile', 'email'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => { setTab(tabKey); setError(''); }}
              className={`flex-1 rounded-full py-2 text-sm transition ${
                tab === tabKey ? 'bg-ink text-white' : 'text-subtle'
              }`}
            >
              {t(tabKey === 'mobile' ? 'auth.tabMobile' : 'auth.tabEmail')}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {tab === 'mobile' ? (
            !otpSent ? (
              <>
                <div>
                  <label className="label">{t('auth.phoneLabel')}</label>
                  <input
                    className="input" inputMode="numeric" placeholder={t('auth.phonePlaceholder')}
                    value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
                <button
                  className="btn-primary w-full" disabled={busy || phone.length < 10}
                  onClick={() => run(() => sendOtp(phone), () => setOtpSent(true))}
                >
                  {t('auth.sendOtp')}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-success">{t('auth.otpSent')}</p>
                <div>
                  <label className="label">{t('auth.otpLabel')}</label>
                  <input
                    className="input" inputMode="numeric" placeholder={t('auth.otpPlaceholder')}
                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>
                <button
                  className="btn-primary w-full" disabled={busy || (firebaseEnabled && otp.length < 6)}
                  onClick={() => run(() => verifyOtp(otp), done)}
                >
                  {t('auth.verify')}
                </button>
              </>
            )
          ) : (
            <>
              <div>
                <label className="label">{t('auth.emailLabel')}</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">{t('auth.passwordLabel')}</label>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button
                className="btn-primary w-full" disabled={busy || !email || (firebaseEnabled && password.length < 6)}
                onClick={() => run(() => emailAuth(email, password, isSignup), done)}
              >
                {t(isSignup ? 'auth.signupEmail' : 'auth.loginEmail')}
              </button>
              <button className="btn-ghost mx-auto block text-sm" onClick={() => setIsSignup((v) => !v)}>
                {t(isSignup ? 'auth.toggleLogin' : 'auth.toggleSignup')}
              </button>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {!firebaseEnabled && (
            <p className="rounded-xl bg-mist px-3 py-2 text-xs text-subtle">{t('auth.devNote')}</p>
          )}
        </div>

        {/* reCAPTCHA target for Firebase phone auth */}
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
