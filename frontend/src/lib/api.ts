import type { Address, CouponResult, Order, Product } from './types';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'nayanaa_token';

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  // Products
  products: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },
  product: (id: string) => request<Product>(`/products/${id}`),

  // Coupons
  validateCoupon: (code: string, subtotal: number) =>
    request<CouponResult>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),

  // User
  syncUser: (profile: { name?: string; phone?: string; email?: string }) =>
    request('/users/sync', { method: 'POST', body: JSON.stringify(profile) }),
  getAddresses: () => request<Address[]>('/users/addresses'),
  addAddress: (address: Address) =>
    request<Address[]>('/users/addresses', { method: 'POST', body: JSON.stringify(address) }),
  setDefaultAddress: (id: string) =>
    request<Address[]>(`/users/addresses/${id}`, { method: 'PUT' }),
  deleteAddress: (id: string) =>
    request<Address[]>(`/users/addresses/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (payload: {
    items: { productId: string; qty: number }[];
    address: Address;
    paymentMethod: string;
    couponCode?: string;
  }) => request<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrders: () => request<Order[]>('/orders'),

  // Public forms
  customRequest: (payload: { name: string; phone: string; description: string; budget?: number }) =>
    request('/custom-requests', { method: 'POST', body: JSON.stringify(payload) }),
  bookCheckup: (payload: { name: string; phone: string; location: string; preferredDate?: string }) =>
    request('/checkups', { method: 'POST', body: JSON.stringify(payload) }),
};
