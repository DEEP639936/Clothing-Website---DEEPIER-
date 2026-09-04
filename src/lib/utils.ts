import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Coupon, Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function discountPct(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;

export function cartTotals(
  subtotal: number,
  coupon: Coupon | null
): { discount: number; shipping: number; total: number } {
  const discount = coupon
    ? coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value
    : 0;
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  return { discount, shipping, total: Math.max(0, subtotal - discount + shipping) };
}

export function relatedProducts(all: Product[], product: Product, n = 4): Product[] {
  const same = all.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection)
  );
  const others = all.filter((p) => p.id !== product.id && !same.includes(p));
  return [...same, ...others].slice(0, n);
}

export function searchProducts(all: Product[], q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  const tokens = term.split(/\s+/);
  return all
    .map((p) => {
      const haystack = [
        p.name,
        p.category,
        p.collection,
        p.gender,
        p.shortDescription,
        p.fit,
        p.embroidery,
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (haystack.includes(t)) score += 2;
        if (p.name.toLowerCase().includes(t)) score += 3;
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export function orderNumber(): string {
  return "DP" + Date.now().toString().slice(-8);
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
