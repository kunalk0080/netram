import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Product } from '../lib/types';
import { inr, discountPct } from '../lib/format';
import ProductImage from './ProductImage';

interface Props {
  product: Product;
  onPeek?: (product: Product) => void;
}

export default function ProductCard({ product, onPeek }: Props) {
  const { t } = useTranslation();
  const pct = discountPct(product.price, product.mrp);

  return (
    <div className="card group overflow-hidden hover:shadow-lift">
      <div className="relative">
        <Link to={`/product/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-mist">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {pct > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white">
            {pct}% {t('common.off')}
          </span>
        )}
        {onPeek && (
          <button
            onClick={() => onPeek(product)}
            className="absolute right-3 top-3 rounded-full bg-canvas/90 px-3 py-1.5 text-xs font-medium text-ink opacity-0 shadow-soft backdrop-blur transition group-hover:opacity-100"
          >
            {t('product.peek')}
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-subtle">{product.brand}</p>
        <Link to={`/product/${product._id}`} className="mt-1 block font-medium leading-snug hover:text-accent">
          {product.name}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold">{inr(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-subtle line-through">{inr(product.mrp)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
