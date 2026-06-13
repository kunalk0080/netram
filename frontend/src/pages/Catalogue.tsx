import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import QuickPeekModal from '../components/QuickPeekModal';

const PRICE_BUCKETS = [
  { key: '', tk: 'priceAll' },
  { key: '0-1000', tk: 'priceUnder' },
  { key: '1000-3000', tk: 'priceMid1' },
  { key: '3000-6000', tk: 'priceMid2' },
  { key: '6000-', tk: 'priceOver' },
] as const;

export default function Catalogue() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [peek, setPeek] = useState<Product | null>(null);
  const [search, setSearch] = useState(params.get('search') || '');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const category = params.get('category') || '';
  const brand = params.get('brand') || '';
  const gender = params.get('gender') || '';
  const price = params.get('price') || '';
  const sort = params.get('sort') || '';

  const query = useMemo(() => {
    const q: Record<string, string> = {};
    if (params.get('search')) q.search = params.get('search')!;
    if (category) q.category = category;
    if (brand) q.brand = brand;
    if (gender) q.gender = gender;
    if (sort) q.sort = sort;
    if (price) {
      const [min, max] = price.split('-');
      if (min) q.minPrice = min;
      if (max) q.maxPrice = max;
    }
    return q;
  }, [params, category, brand, gender, sort, price]);

  useEffect(() => {
    setLoading(true);
    api.products(query).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [query]);

  // Live search: kicks in from the 3rd character (debounced); clears when emptied.
  useEffect(() => {
    const term = search.trim();
    if (term.length > 0 && term.length < 3) return; // wait until the 3rd key
    const handle = setTimeout(() => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (term.length >= 3) next.set('search', term);
          else next.delete('search');
          return next;
        },
        { replace: true }
      );
    }, 350);
    return () => clearTimeout(handle);
  }, [search, setParams]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    update('search', search.trim());
  }

  // Active filters → removable pills
  const activePills = [
    category && { key: 'category', label: t(`catalogue.${category}`) },
    brand && { key: 'brand', label: brand },
    gender && { key: 'gender', label: t(`catalogue.${gender}`) },
    price && { key: 'price', label: t(`catalogue.${PRICE_BUCKETS.find((b) => b.key === price)?.tk ?? 'priceAll'}`) },
    params.get('search') && { key: 'search', label: `"${params.get('search')}"` },
  ].filter(Boolean) as { key: string; label: string }[];

  function clearPill(key: string) {
    if (key === 'search') setSearch('');
    update(key, '');
  }

  const panel = (
    <FilterPanel
      category={category}
      brand={brand}
      gender={gender}
      price={price}
      onChange={update}
    />
  );

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t('catalogue.title')}</h1>
      <p className="mt-1 text-subtle">{t('catalogue.subtitle', { count: products.length })}</p>

      {/* Search */}
      <form onSubmit={submitSearch} className="relative mt-6 max-w-xl">
        <SearchIcon />
        <input
          className="input rounded-full pl-11 pr-28"
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !px-5 !py-2 text-sm" aria-label={t('common.search')}>
          🔍
        </button>
      </form>

      {/* Toolbar: filters button (mobile) + sort */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="btn-secondary !px-4 !py-2 text-sm lg:invisible"
        >
          <FilterIcon /> {t('catalogue.filters')}
          {activePills.length > 0 && (
            <span className="ml-1 rounded-full bg-accent px-1.5 text-xs text-white">{activePills.length}</span>
          )}
        </button>

        <label className="flex items-center gap-2 text-sm text-subtle">
          <span className="hidden sm:inline">{t('catalogue.sortBy')}</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => update('sort', e.target.value)}
              className="appearance-none rounded-full border border-line bg-canvas py-2 pl-4 pr-9 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">{t('catalogue.sortNew')}</option>
              <option value="price-asc">{t('catalogue.sortPriceAsc')}</option>
              <option value="price-desc">{t('catalogue.sortPriceDesc')}</option>
            </select>
            <ChevronIcon />
          </div>
        </label>
      </div>

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activePills.map((p) => (
            <button
              key={p.key}
              onClick={() => clearPill(p.key)}
              className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm text-ink transition hover:bg-line"
            >
              {p.label} <span className="text-subtle">×</span>
            </button>
          ))}
          <button onClick={() => { setSearch(''); setParams({}, { replace: true }); }} className="btn-ghost text-sm">
            {t('catalogue.clear')}
          </button>
        </div>
      )}

      {/* Sidebar + grid */}
      <div className="mt-8 lg:grid lg:grid-cols-[230px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{panel}</div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-subtle">{t('catalogue.empty')}</p>
              <Link to="/custom" className="btn-primary mt-5">{t('catalogue.emptyCta')}</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onPeek={setPeek} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="ml-auto h-full w-80 max-w-[85%] animate-fade-up overflow-y-auto bg-canvas p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('catalogue.filters')}</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-2xl leading-none text-subtle">×</button>
            </div>
            {panel}
            <button onClick={() => setDrawerOpen(false)} className="btn-primary mt-8 w-full">
              {t('catalogue.showResults', { count: products.length })}
            </button>
          </div>
        </div>
      )}

      <QuickPeekModal product={peek} onClose={() => setPeek(null)} />
    </div>
  );
}

interface PanelProps {
  category: string;
  brand: string;
  gender: string;
  price: string;
  onChange: (key: string, value: string) => void;
}

function FilterPanel({ category, brand, gender, price, onChange }: PanelProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-7">
      <FilterGroup label={t('catalogue.category')}>
        <Option active={!category} onClick={() => onChange('category', '')}>{t('catalogue.all')}</Option>
        <Option active={category === 'eyeglasses'} onClick={() => onChange('category', 'eyeglasses')}>{t('catalogue.eyeglasses')}</Option>
        <Option active={category === 'sunglasses'} onClick={() => onChange('category', 'sunglasses')}>{t('catalogue.sunglasses')}</Option>
      </FilterGroup>

      <FilterGroup label={t('catalogue.brand')}>
        <Option active={!brand} onClick={() => onChange('brand', '')}>{t('catalogue.all')}</Option>
        {['Lenskart', 'Titan', 'Ray-Ban'].map((b) => (
          <Option key={b} active={brand === b} onClick={() => onChange('brand', b)}>{b}</Option>
        ))}
      </FilterGroup>

      <FilterGroup label={t('catalogue.gender')}>
        <Option active={!gender} onClick={() => onChange('gender', '')}>{t('catalogue.all')}</Option>
        {['men', 'women', 'kids', 'unisex'].map((g) => (
          <Option key={g} active={gender === g} onClick={() => onChange('gender', g)}>{t(`catalogue.${g}`)}</Option>
        ))}
      </FilterGroup>

      <FilterGroup label={t('catalogue.price')}>
        {PRICE_BUCKETS.map((b) => (
          <Option key={b.key} active={price === b.key} onClick={() => onChange('price', b.key)}>{t(`catalogue.${b.tk}`)}</Option>
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-sm font-semibold text-ink">{label}</h3>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
        active ? 'bg-mist font-medium text-ink' : 'text-subtle hover:bg-mist/60 hover:text-ink'
      }`}
    >
      {children}
      {active && <CheckIcon />}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] animate-pulse bg-mist" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-mist" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-mist" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-mist" />
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-accent">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
