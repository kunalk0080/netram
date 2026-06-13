import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-24 border-t border-line bg-mist">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <img src="/favicon.svg" alt="" className="h-6 w-6" />
            {t('brand')}
          </div>
          <p className="mt-3 max-w-xs text-sm text-subtle">{t('footer.tagline')}</p>
        </div>
        <FooterCol title={t('footer.shop')}>
          <Link to="/shop" className="hover:text-ink">{t('nav.shop')}</Link>
          <Link to="/custom" className="hover:text-ink">{t('nav.custom')}</Link>
        </FooterCol>
        <FooterCol title={t('footer.care')}>
          <Link to="/checkup" className="hover:text-ink">{t('nav.checkup')}</Link>
          <Link to="/referral" className="hover:text-ink">{t('footer.hospital')}</Link>
        </FooterCol>
        <FooterCol title={t('footer.company')}>
          <a href="https://srisaieyehospital.com/" target="_blank" rel="noreferrer" className="hover:text-ink">
            Sri Sai Eye Hospital
          </a>
        </FooterCol>
      </div>
      <div className="container-page border-t border-line py-6 text-sm text-subtle">
        © 2026 {t('footer.rights')}
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-ink">{title}</h4>
      <div className="flex flex-col gap-2 text-sm text-subtle">{children}</div>
    </div>
  );
}
