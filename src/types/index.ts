export type Gender = "men" | "women";
export type CategorySlug =
  | "t-shirts"
  | "oversized-t-shirts"
  | "shirts"
  | "hoodies"
  | "sweatshirts"
  | "jackets";
export type Badge = "NEW" | "BESTSELLER" | "LIMITED" | "SALE";
export type FitType = "Regular" | "Oversized" | "Relaxed" | "Slim";

export interface ColorOption {
  name: string;
  hex: string;
  /** image index into product images for the color way */
  imageIndex?: number;
}

export interface ProductImage {
  src: string;
  alt: string;
  kind: "front" | "back" | "detail" | "lifestyle" | "model";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  gender: Gender;
  category: CategorySlug;
  collection: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  badges: Badge[];
  colors: ColorOption[];
  sizes: { label: string; inStock: boolean }[];
  images: ProductImage[];
  fabric: string;
  fit: FitType;
  embroidery: string;
  care: string[];
  bestSellerRank?: number;
  newArrived?: boolean;
  lowStock?: boolean;
  soldOut?: boolean;
}

export interface Category {
  slug: string;
  label: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
  addedAt: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | "ORDER PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT FOR DELIVERY"
  | "DELIVERED";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  color: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  estimatedDelivery: string;
  address: Address;
  timeline: { status: OrderStatus; date: string; done: boolean }[];
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  text: string;
  product: string;
  date: string;
  verified: boolean;
}

export interface JournalArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  body: string[];
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  label: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
}
