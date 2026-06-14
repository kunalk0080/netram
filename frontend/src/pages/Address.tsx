import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { Address } from '../lib/types';

const EMPTY: Address = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export default function AddressPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function load() {
    api.getAddresses().then((list) => {
      setAddresses(list);
      setShowForm(list.length === 0);
    }).catch(() => {});
  }
  useEffect(load, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const list = await api.addAddress(form);
      setAddresses(list);
      setForm(EMPTY);
      setShowForm(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function selectAndContinue(addr: Address) {
    sessionStorage.setItem('netram_address', JSON.stringify(addr));
    navigate('/checkout');
  }

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t('address.title')}</h1>

      {addresses.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="text-sm font-semibold text-subtle">{t('address.saved')}</h2>
          {addresses.map((a) => (
            <div key={a._id} className="card flex items-start justify-between gap-4 p-5">
              <div>
                <p className="font-medium">
                  {a.fullName} {a.isDefault && <span className="ml-2 rounded-full bg-mist px-2 py-0.5 text-xs text-subtle">{t('address.default')}</span>}
                </p>
                <p className="mt-1 text-sm text-subtle">
                  {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} — {a.pincode}
                </p>
                <p className="text-sm text-subtle">📞 {a.phone}</p>
              </div>
              <button className="btn-primary !px-4 !py-2 text-sm shrink-0" onClick={() => selectAndContinue(a)}>
                {t('address.useThis')}
              </button>
            </div>
          ))}
          {!showForm && (
            <button className="btn-ghost text-sm" onClick={() => setShowForm(true)}>+ {t('address.add')}</button>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={save} className="card mt-6 space-y-4 p-6">
          <h2 className="font-semibold">{t('address.add')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('address.fullName')} value={form.fullName} onChange={set('fullName')} required />
            <Field label={t('address.phone')} value={form.phone} onChange={set('phone')} required />
          </div>
          <Field label={t('address.line1')} value={form.line1} onChange={set('line1')} required />
          <Field label={t('address.line2')} value={form.line2 || ''} onChange={set('line2')} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t('address.city')} value={form.city} onChange={set('city')} required />
            <Field label={t('address.state')} value={form.state} onChange={set('state')} required />
            <Field label={t('address.pincode')} value={form.pincode} onChange={set('pincode')} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{t('address.save')}</button>
        </form>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, required,
}: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value} onChange={onChange} required={required} />
    </div>
  );
}
