import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { inr } from '../lib/format';
import type { Address } from '../lib/types';

type Method = 'upi' | 'card' | 'cod';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();

  const [address, setAddress] = useState<Address | null>(null);
  const [method, setMethod] = useState<Method>('upi');
  const [coupon] = useState(() => sessionStorage.getItem('netram_coupon') || '');
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Resolve a delivery address (selected → default → redirect).
  useEffect(() => {
    const stored = sessionStorage.getItem('netram_address');
    if (stored) {
      setAddress(JSON.parse(stored));
      return;
    }
    api.getAddresses().then((list) => {
      const def = list.find((a) => a.isDefault) || list[0];
      if (def) setAddress(def);
      else navigate('/address', { replace: true });
    });
  }, [navigate]);

  // Recompute discount from the saved coupon.
  useEffect(() => {
    if (coupon && subtotal > 0) {
      api.validateCoupon(coupon, subtotal).then((r) => setDiscount(r.discount)).catch(() => setDiscount(0));
    }
  }, [coupon, subtotal]);

  if (items.length === 0) {
    return <div className="container-page py-28 text-center text-subtle">{t('cart.empty')}</div>;
  }

  const total = Math.max(0, subtotal - discount);

  async function placeOrder() {
    if (!address) return;
    setError('');
    setProcessing(true);
    try {
      // Simulated payment delay for UPI/Card.
      if (method !== 'cod') await new Promise((r) => setTimeout(r, 1400));
      const order = await api.createOrder({
        items: items.map((i) => ({ productId: i.product._id, qty: i.qty })),
        address,
        paymentMethod: method,
        couponCode: coupon || undefined,
      });
      clear();
      sessionStorage.removeItem('netram_coupon');
      sessionStorage.removeItem('netram_address');
      navigate(`/order/${order._id}`, { state: { order }, replace: true });
    } catch (err) {
      setError((err as Error).message);
      setProcessing(false);
    }
  }

  const methods: { key: Method; label: string; desc: string; icon: string }[] = [
    { key: 'upi', label: t('checkout.upi'), desc: t('checkout.upiDesc'), icon: '📱' },
    { key: 'card', label: t('checkout.card'), desc: t('checkout.cardDesc'), icon: '💳' },
    { key: 'cod', label: t('checkout.cod'), desc: t('checkout.codDesc'), icon: '💵' },
  ];

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t('checkout.title')}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Address */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t('checkout.deliverTo')}</h2>
              <button className="btn-ghost text-sm" onClick={() => navigate('/address')}>{t('checkout.change')}</button>
            </div>
            {address && (
              <div className="mt-2 text-sm text-subtle">
                <p className="font-medium text-ink">{address.fullName}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} — {address.pincode}</p>
                <p>📞 {address.phone}</p>
              </div>
            )}
          </div>

          {/* Payment methods */}
          <div className="card p-5">
            <h2 className="mb-4 font-semibold">{t('checkout.payment')}</h2>
            <div className="space-y-3">
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                    method === m.key ? 'border-accent ring-2 ring-accent/20' : 'border-line hover:border-ink'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="flex-1">
                    <span className="block font-medium">{m.label}</span>
                    <span className="block text-sm text-subtle">{m.desc}</span>
                  </span>
                  <span className={`h-5 w-5 rounded-full border-2 ${method === m.key ? 'border-accent bg-accent' : 'border-line'}`} />
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-subtle">{t('checkout.simulated')}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="card h-fit p-5">
          <h2 className="mb-3 font-semibold">{t('checkout.orderSummary')}</h2>
          <p className="mb-3 text-sm text-subtle">{t('checkout.items', { count: items.length })}</p>
          <Row label={t('cart.subtotal')} value={inr(subtotal)} />
          {discount > 0 && <Row label={t('cart.discount')} value={`− ${inr(discount)}`} good />}
          <Row label={t('cart.delivery')} value={t('common.free')} good />
          <div className="my-3 border-t border-line" />
          <Row label={t('cart.total')} value={inr(total)} bold />
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <button className="btn-primary mt-5 w-full" onClick={placeOrder} disabled={processing}>
            {processing ? t('checkout.processing') : t('checkout.placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, good }: { label: string; value: string; bold?: boolean; good?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? 'text-lg font-semibold' : 'text-sm'}`}>
      <span className={bold ? '' : 'text-subtle'}>{label}</span>
      <span className={good ? 'text-success' : ''}>{value}</span>
    </div>
  );
}
