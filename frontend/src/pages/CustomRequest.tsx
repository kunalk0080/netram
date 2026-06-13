import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export default function CustomRequest() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', description: '', budget: '' });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.customRequest({
        name: form.name,
        phone: form.phone,
        description: form.description,
        budget: form.budget ? Number(form.budget) : undefined,
      });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (done) {
    return (
      <div className="container-page flex justify-center py-24">
        <div className="card max-w-md p-10 text-center">
          <div className="text-4xl">📦</div>
          <p className="mt-4 text-lg">{t('custom.success')}</p>
          <button className="btn-secondary mt-6" onClick={() => { setForm({ name: '', phone: '', description: '', budget: '' }); setDone(false); }}>
            {t('custom.another')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-xl py-14">
      <h1 className="text-3xl font-semibold tracking-tight">{t('custom.title')}</h1>
      <p className="mt-2 text-subtle">{t('custom.subtitle')}</p>

      <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="label">{t('custom.name')}</label>
          <input className="input" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label">{t('custom.phone')}</label>
          <input className="input" inputMode="numeric" value={form.phone} onChange={set('phone')} required />
        </div>
        <div>
          <label className="label">{t('custom.description')}</label>
          <textarea className="input min-h-28" placeholder={t('custom.descriptionPlaceholder')} value={form.description} onChange={set('description')} required />
        </div>
        <div>
          <label className="label">{t('custom.budget')}</label>
          <input className="input" inputMode="numeric" value={form.budget} onChange={set('budget')} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? t('common.submitting') : t('custom.submit')}
        </button>
      </form>
    </div>
  );
}
