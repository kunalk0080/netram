import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const { count } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/shop', label: t('nav.shop') },
    { to: '/checkup', label: t('nav.checkup') },
    { to: '/custom', label: t('nav.custom') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition hover:text-ink ${isActive ? 'text-ink font-medium' : 'text-subtle'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-canvas/80 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          {t('brand')}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <NavLink to="/cart" className="relative p-2 text-ink" aria-label={t('nav.cart')}>
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </NavLink>
          <NavLink to={user ? '/account' : '/login'} className="hidden btn-secondary !px-4 !py-2 text-sm sm:inline-flex">
            {user ? t('nav.account') : t('nav.login')}
          </NavLink>
          <button className="p-2 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <MenuIcon />
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-canvas md:hidden">
          <div className="container-page flex flex-col py-3">
            {[...links, { to: user ? '/account' : '/login', label: user ? t('nav.account') : t('nav.login') }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-ink"
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 7h15l-1.5 9.5a2 2 0 0 1-2 1.7H9.5a2 2 0 0 1-2-1.7L6 4H3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
