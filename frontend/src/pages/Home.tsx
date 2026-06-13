import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import QuickPeekModal from '../components/QuickPeekModal';

export default function Home() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [peek, setPeek] = useState<Product | null>(null);

  useEffect(() => {
    api.products({ featured: '1' }).then(setFeatured).catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-mist">
        <div className="container-page grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-fade-up">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-5 max-w-md text-lg text-subtle">{t('home.heroSubtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">{t('home.heroShop')}</Link>
              <Link to="/checkup" className="btn-secondary">{t('home.heroCheckup')}</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-mist shadow-lift">
              <img
                src="/hero-eye-exam.jpg"
                alt={t('home.heroCheckup')}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container-page grid gap-6 py-16 md:grid-cols-3">
        <ValueCard emoji="👁️" title={t('home.valueChecks')} desc={t('home.valueChecksDesc')} />
        <ValueCard emoji="💸" title={t('home.valuePrice')} desc={t('home.valuePriceDesc')} />
        <ValueCard emoji="🏥" title={t('home.valueCare')} desc={t('home.valueCareDesc')} />
      </section>

      {/* Featured */}
      <section className="container-page py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('home.featured')}</h2>
            <p className="mt-1 text-subtle">{t('home.featuredSub')}</p>
          </div>
          <Link to="/shop" className="btn-ghost shrink-0">{t('common.viewAll')} →</Link>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} onPeek={setPeek} />
          ))}
        </div>
      </section>

      {/* Custom request CTA */}
      <section className="container-page py-16">
        <div className="rounded-3xl bg-ink px-8 py-14 text-center text-white sm:px-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">{t('home.ctaText')}</p>
          <Link
            to="/custom"
            className="btn mt-7 bg-white px-6 py-3 text-ink hover:bg-mist"
          >
            {t('home.ctaButton')}
          </Link>
        </div>
      </section>

      <QuickPeekModal product={peek} onClose={() => setPeek(null)} />
    </div>
  );
}

function ValueCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="card p-7">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-subtle">{desc}</p>
    </div>
  );
}
