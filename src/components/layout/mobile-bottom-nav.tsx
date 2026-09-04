"use client";

import { Home, LayoutGrid, Search, Heart, User } from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import { useCart, useWishlist, useAuth, useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { to: "/shop", label: "Shop", icon: LayoutGrid, match: (p: string) => p.startsWith("/shop") || p.startsWith("/product") },
  { to: "/search", label: "Search", icon: Search, match: (p: string) => p === "/search" },
  { to: "/wishlist", label: "Wishlist", icon: Heart, match: (p: string) => p === "/wishlist" },
  { to: "/account", label: "Account", icon: User, match: (p: string) => p.startsWith("/account") || p === "/login" || p === "/register" },
];

export function MobileBottomNav() {
  const { pathname } = useRouter();
  const wishCount = useWishlist((s) => s.ids.length);
  const user = useAuth((s) => s.user);
  const hydrated = useHydrated();
  void useCart; // subscribed via wishlist counts only

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-bone/95 backdrop-blur-md lg:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to + label}>
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[9.5px] font-bold uppercase tracking-[0.12em] transition-colors",
                  active ? "text-ink" : "text-ink/45"
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.6} />
                  {label === "Wishlist" && hydrated && wishCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-ink px-0.5 text-[8px] text-bone">
                      {wishCount}
                    </span>
                  )}
                  {label === "Account" && user && (
                    <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-bronze" />
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
