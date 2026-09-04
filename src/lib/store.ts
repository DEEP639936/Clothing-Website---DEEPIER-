"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useRef, useState } from "react";
import type { Address, CartItem, Order, User } from "@/types";

/* ------------------------------- Cart ------------------------------- */

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "key" | "addedAt">) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  applyCoupon: (code: string | null) => void;
  setOpen: (open: boolean) => void;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isOpen: false,
      addItem: (item) => {
        const key = `${item.productId}__${item.size}__${item.color}`;
        set((s) => {
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, qty: Math.min(i.qty + item.qty, 10) } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...s.items, { ...item, key, addedAt: Date.now() }],
            isOpen: true,
          };
        });
      },
      removeItem: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      updateQty: (key, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 10) } : i)),
        })),
      clear: () => set({ items: [], couponCode: null }),
      applyCoupon: (code) => set({ couponCode: code }),
      setOpen: (open) => set({ isOpen: open }),
      count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
    }),
    {
      name: "deepier-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, couponCode: s.couponCode }),
    }
  )
);

/* ----------------------------- Wishlist ----------------------------- */

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set((s) => ({ ids: has ? s.ids.filter((x) => x !== id) : [id, ...s.ids] }));
        return !has;
      },
      has: (id) => get().ids.includes(id),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "deepier-wishlist", storage: createJSONStorage(() => localStorage) }
  )
);

/* ------------------------------- Auth ------------------------------- */

interface AuthState {
  user: User | null;
  addresses: Address[];
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  addAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateProfile: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      addAddress: (a) =>
        set((s) => ({
          addresses: [...s.addresses.map((x) => ({ ...x, isDefault: false })), { ...a, isDefault: true }],
        })),
      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      setDefaultAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
    }),
    { name: "deepier-auth", storage: createJSONStorage(() => localStorage) }
  )
);

/* ------------------------------ Orders ------------------------------ */

interface OrdersState {
  orders: Order[];
  addOrder: (o: Order) => void;
  advanceOrder: (id: string) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      advanceOrder: (id) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id) return o;
            const idx = o.timeline.findIndex((t) => !t.done);
            if (idx === -1) return o;
            const timeline = o.timeline.map((t, i) =>
              i <= idx ? { ...t, done: true } : t
            );
            return { ...o, timeline, status: timeline[idx].status };
          }),
        })),
    }),
    { name: "deepier-orders", storage: createJSONStorage(() => localStorage) }
  )
);

/* -------------------------------- UI -------------------------------- */

interface UIState {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  quickViewSlug: string | null;
  sizeGuideOpen: boolean;
  closeAll: () => void;
  setSearchOpen: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  setQuickView: (slug: string | null) => void;
  setSizeGuideOpen: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  quickViewSlug: null,
  sizeGuideOpen: false,
  closeAll: () =>
    set({ searchOpen: false, mobileMenuOpen: false, quickViewSlug: null, sizeGuideOpen: false }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  setQuickView: (slug) => set({ quickViewSlug: slug }),
  setSizeGuideOpen: (v) => set({ sizeGuideOpen: v }),
}));

/* -------------------------- Recently viewed ------------------------- */

interface RecentState {
  slugs: string[];
  push: (slug: string) => void;
}

export const useRecent = create<RecentState>()(
  persist(
    (set, get) => ({
      slugs: [],
      push: (slug) =>
        set((s) => ({ slugs: [slug, ...s.slugs.filter((x) => x !== slug)].slice(0, 8) })),
    }),
    { name: "deepier-recent", storage: createJSONStorage(() => localStorage) }
  )
);

/* ------------------------- Hydration helper ------------------------- */

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef(hydrated);
  ref.current = hydrated;
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
