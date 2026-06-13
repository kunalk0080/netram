export interface Product {
  _id: string;
  name: string;
  brand: 'Lenskart' | 'Titan' | 'Ray-Ban';
  category: 'eyeglasses' | 'sunglasses';
  gender: 'men' | 'women' | 'kids' | 'unisex';
  price: number;
  mrp: number;
  images: string[];
  color: string;
  frameShape: string;
  material: string;
  description: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Address {
  _id?: string;
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  _id: string;
  items: { productId: string; name: string; price: number; qty: number; image: string }[];
  address: Address;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  couponCode?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface CouponResult {
  valid: boolean;
  code: string;
  discount: number;
  description?: string;
  error?: string;
}
