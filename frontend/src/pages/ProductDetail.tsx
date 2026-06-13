import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { Product } from '../lib/types';
import { inr, discountPct } from '../lib/format';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.product(id).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="container-page py-32 text-center text-subtle">{t('common.loading')}</p>;
  if (!product) return <p className="container-page py-32 text-center text-subtle">404</p>;

  const pct = discountPct(product.price, product.mrp);

  function handleAdd() {
    if (!product) return;
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="container-page py-10">
      <Link to="/shop" className="text-sm text-subtle hover:text-ink">← {t('product.back')}</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-mist">
          <ProductImage src={product.images[0]} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-subtle">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{inr(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-subtle line-through">{inr(product.mrp)}</span>
                <span className="font-medium text-success">{pct}% {t('common.off')}</span>
              </>
            )}
          </div>
          {product.mrp > product.price && (
            <p className="mt-1 text-sm text-success">{t('product.save', { amount: (product.mrp - product.price).toLocaleString('en-IN') })}</p>
          )}

          <p className="mt-5 leading-relaxed text-subtle">{product.description}</p>

          {/* Specs */}
          <div className="mt-6 rounded-2xl border border-line p-5">
            <h3 className="mb-3 text-sm font-semibold">{t('product.specs')}</h3>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <Spec label={t('product.shape')} value={product.frameShape} />
              <Spec label={t('product.color')} value={product.color} />
              <Spec label={t('product.material')} value={product.material} />
              <Spec label={t('product.type')} value={t(`catalogue.${product.category}`)} />
            </dl>
          </div>

          {/* Qty + add */}
          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-line">
              <button className="px-4 py-2.5 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="w-8 text-center">{qty}</span>
              <button className="px-4 py-2.5 text-lg" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn-primary flex-1" onClick={handleAdd}>
              {added ? t('common.added') : t('common.addToCart')}
            </button>
          </div>
          <span className="mt-3 inline-block text-sm text-success">● {t('product.inStock')}</span>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-subtle">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}
