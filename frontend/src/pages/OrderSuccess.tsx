import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Order } from '../lib/types';
import { inr } from '../lib/format';

export default function OrderSuccess() {
  const { t } = useTranslation();
  const { id } = useParams();
  const order = (useLocation().state as { order?: Order })?.order;

  return (
    <div className="container-page flex justify-center py-20">
      <div className="card w-full max-w-lg p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-3xl text-success">
          ✓
        </div>
        <h1 className="mt-5 text-2xl font-semibold">{t('success.title')}</h1>
        <p className="mt-2 text-subtle">{t('success.subtitle')}</p>

        <div className="mt-6 rounded-2xl bg-mist p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-subtle">{t('success.orderId')}</span>
            <span className="font-mono font-medium">{id?.slice(-8).toUpperCase()}</span>
          </div>
          {order && (
            <>
              <div className="mt-2 flex justify-between">
                <span className="text-subtle">{t('cart.total')}</span>
                <span className="font-semibold">{inr(order.total)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-subtle">{t('checkout.payment')}</span>
                <span className="font-medium">
                  {order.paymentMethod === 'cod' ? t('success.cod') : t('success.paid')}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/shop" className="btn-secondary">{t('success.continue')}</Link>
          <Link to="/account" className="btn-primary">{t('success.viewOrders')}</Link>
        </div>
      </div>
    </div>
  );
}
