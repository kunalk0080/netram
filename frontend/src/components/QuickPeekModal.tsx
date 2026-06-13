import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Product } from '../lib/types';
import { inr, discountPct } from '../lib/format';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function QuickPeekModal({ product, onClose }: Props) {
  const { t } = useTranslation();
  const { add } = useCart();
  if (!product) return null;
  const pct = discountPct(product.price, product.mrp);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card animate-fade-up grid w-full max-w-3xl overflow-hidden md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-square bg-mist">
          <ProductImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col p-6">
          <button onClick={onClose} className="ml-auto text-2xl leading-none text-subtle hover:text-ink" aria-label="Close">
            ×
          </button>
          <p className="text-xs uppercase tracking-wide text-subtle">{product.brand}</p>
          <h3 className="mt-1 text-xl font-semibold">{product.name}</h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-semibold">{inr(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-subtle line-through">{inr(product.mrp)}</span>
                <span className="text-sm font-medium text-success">{pct}% {t('common.off')}</span>
              </>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-subtle">{product.description}</p>
          <div className="mt-auto flex gap-3 pt-6">
            <button className="btn-primary flex-1" onClick={() => { add(product); onClose(); }}>
              {t('common.addToCart')}
            </button>
            <Link to={`/product/${product._id}`} onClick={onClose} className="btn-secondary">
              {t('common.continue')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
