import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { Order } from '../lib/types';
import { inr } from '../lib/format';

export default function Account() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page max-w-3xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t('account.title')}</h1>
          <p className="mt-1 text-subtle">{user?.phone || user?.email}</p>
        </div>
        <button className="btn-secondary !px-4 !py-2 text-sm" onClick={logout}>{t('nav.logout')}</button>
      </div>

      <h2 className="mt-10 text-xl font-semibold">{t('account.orders')}</h2>

      {loading ? (
        <p className="py-10 text-subtle">{t('common.loading')}</p>
      ) : orders.length === 0 ? (
        <div className="card mt-4 p-10 text-center">
          <p className="text-subtle">{t('account.noOrders')}</p>
          <Link to="/shop" className="btn-primary mt-5">{t('account.shop')}</Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-medium">#{o._id.slice(-8).toUpperCase()}</span>
                <span className="text-sm text-subtle">
                  {t('account.orderOn')} {new Date(o.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-sm">
                    <span>{it.name}</span>
                    <span className="text-subtle">× {it.qty}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span className={o.paymentStatus === 'paid' ? 'text-success' : 'text-subtle'}>
                  {o.paymentMethod === 'cod' ? t('success.cod') : t('success.paid')}
                </span>
                <span className="font-semibold">{inr(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
