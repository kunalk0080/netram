import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export default function BookCheckup() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', location: '', preferredDate: '' });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.bookCheckup(form);
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (done) {
    return (
      <div className="container-page flex justify-center py-24">
        <div className="card max-w-md p-10 text-center">
          <div className="text-4xl">👁️</div>
          <p className="mt-4 text-lg">{t('checkup.success')}</p>
          <button className="btn-secondary mt-6" onClick={() => { setForm({ name: '', phone: '', location: '', preferredDate: '' }); setDone(false); }}>
            {t('checkup.another')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-xl py-14">
      <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-medium text-success">{t('common.free')}</span>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t('checkup.title')}</h1>
      <p className="mt-2 text-subtle">{t('checkup.subtitle')}</p>

      <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="label">{t('checkup.name')}</label>
          <input className="input" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label">{t('checkup.phone')}</label>
          <input className="input" inputMode="numeric" value={form.phone} onChange={set('phone')} required />
        </div>
        <div>
          <label className="label">{t('checkup.location')}</label>
          <input className="input" value={form.location} onChange={set('location')} required />
        </div>
        <div>
          <label className="label">{t('checkup.date')}</label>
          <input className="input" type="date" value={form.preferredDate} onChange={set('preferredDate')} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? t('common.submitting') : t('checkup.submit')}
        </button>
      </form>

      <div className="mt-6 rounded-2xl bg-mist p-5 text-sm text-subtle">
        {t('checkup.referralNote')}{' '}
        <Link to="/referral" className="font-medium text-accent hover:underline">{t('footer.hospital')} →</Link>
      </div>
    </div>
  );
}
