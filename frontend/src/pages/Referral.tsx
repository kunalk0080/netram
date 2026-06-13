import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HOSPITAL_URL = 'https://srisaieyehospital.com/';

export default function Referral() {
  const { t } = useTranslation();
  const services = [t('referral.service1'), t('referral.service2'), t('referral.service3'), t('referral.service4')];
  const steps = [t('referral.step1'), t('referral.step2'), t('referral.step3'), t('referral.step4')];

  return (
    <div>
      <section className="bg-mist">
        <div className="container-page py-16 md:py-20">
          <span className="text-sm font-medium uppercase tracking-wide text-accent">{t('footer.hospital')}</span>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('referral.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-subtle">{t('referral.subtitle')}</p>
          <a href={HOSPITAL_URL} target="_blank" rel="noreferrer" className="btn-primary mt-7">
            {t('referral.visit')} ↗
          </a>
        </div>
      </section>

      <section className="container-page py-14">
        <p className="max-w-3xl text-lg leading-relaxed text-ink">{t('referral.intro')}</p>

        <h2 className="mt-12 text-xl font-semibold">{t('referral.services')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s} className="card p-5">
              <span className="text-2xl">🏥</span>
              <p className="mt-3 font-medium">{s}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-xl font-semibold">{t('referral.howTitle')}</h2>
        <ol className="mt-5 space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="pt-1 text-subtle">{s}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-3xl bg-ink px-8 py-12 text-center text-white">
          <h3 className="text-2xl font-semibold">{t('checkup.title')}</h3>
          <Link to="/checkup" className="btn mt-6 bg-white px-6 py-3 text-ink hover:bg-mist">
            {t('home.heroCheckup')}
          </Link>
        </div>
      </section>
    </div>
  );
}
