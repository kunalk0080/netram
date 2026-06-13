import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { inr } from '../lib/format';
import ProductImage from '../components/ProductImage';

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, subtotal, setQty, remove } = useCart();
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);

  async function applyCoupon() {
    setCouponError('');
    setApplying(true);
    try {
      const res = await api.validateCoupon(code, subtotal);
      setCoupon({ code: res.code, discount: res.discount });
    } catch (err) {
      setCoupon(null);
      setCouponError((err as Error).message);
    } finally {
      setApplying(false);
    }
  }

  function checkout() {
    // Persist applied coupon for the checkout step.
    sessionStorage.setItem('nayanaa_coupon', coupon ? coupon.code : '');
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-28 text-center">
        <h1 className="text-2xl font-semibold">{t('cart.title')}</h1>
        <p className="mt-3 text-subtle">{t('cart.empty')}</p>
        <Link to="/shop" className="btn-primary mt-6">{t('cart.emptyCta')}</Link>
      </div>
    );
  }

  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t('cart.title')}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, qty }) => (
            <div key={product._id} className="card flex gap-4 p-4">
              <Link to={`/product/${product._id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-mist">
                <ProductImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-subtle">{product.brand}</p>
                    <Link to={`/product/${product._id}`} className="font-medium hover:text-accent">{product.name}</Link>
                  </div>
                  <span className="font-semibold">{inr(product.price * qty)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-line text-sm">
                    <button className="px-3 py-1.5" onClick={() => setQty(product._id, qty - 1)}>−</button>
                    <span className="w-6 text-center">{qty}</span>
                    <button className="px-3 py-1.5" onClick={() => setQty(product._id, qty + 1)}>+</button>
                  </div>
                  <button onClick={() => remove(product._id)} className="text-sm text-subtle hover:text-ink">
                    {t('cart.remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-5">
          {/* Coupon */}
          <div className="card p-5">
            <h3 className="mb-3 font-semibold">{t('cart.offers')}</h3>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder={t('cart.couponPlaceholder')}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <button className="btn-secondary !px-4" onClick={applyCoupon} disabled={applying || !code}>
                {t('cart.apply')}
              </button>
            </div>
            {coupon && <p className="mt-2 text-sm text-success">{t('cart.applied', { code: coupon.code })}</p>}
            {couponError && <p className="mt-2 text-sm text-red-500">{couponError}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-subtle">
              <span className="rounded border border-dashed border-line px-2 py-1">NAYANAA10</span>
              <span className="rounded border border-dashed border-line px-2 py-1">FLAT200</span>
              <span className="rounded border border-dashed border-line px-2 py-1">GRAM50</span>
            </div>
          </div>

          {/* Totals */}
          <div className="card p-5">
            <Row label={t('cart.subtotal')} value={inr(subtotal)} />
            {discount > 0 && <Row label={t('cart.discount')} value={`− ${inr(discount)}`} good />}
            <Row label={t('cart.delivery')} value={t('common.free')} good />
            <div className="my-3 border-t border-line" />
            <Row label={t('cart.total')} value={inr(total)} bold />
            <button className="btn-primary mt-5 w-full" onClick={checkout}>
              {t('cart.checkout')}
            </button>
          </div>
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
