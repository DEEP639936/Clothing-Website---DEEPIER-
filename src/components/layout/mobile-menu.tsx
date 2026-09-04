"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown, Search, Heart, ShoppingBag, User } from "lucide-react";
import { Link } from "@/lib/router";
import { useUI, useCart, useWishlist, useAuth } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MEGA_CATEGORIES } from "./header";
import { collections } from "@/lib/data";

const PRIMARY = [
  { label: "MEN", to: "/shop/men", mega: "men" as const },
  { label: "WOMEN", to: "/shop/women", mega: "women" as const },
  { label: "NEW ARRIVALS", to: "/shop/new-arrivals" },
  { label: "BEST SELLERS", to: "/shop/best-sellers" },
  { label: "EMBROIDERY", to: "/shop/embroidery", mega: "embroidery" as const },
  { label: "SALE", to: "/shop/sale" },
];

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUI();
  const [expanded, setExpanded] = useState<string | null>(null);
  const user = useAuth((s) => s.user);
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[71] flex w-[86%] max-w-[380px] flex-col bg-bone transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo />
          <button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto dp-scroll px-5 py-4" aria-label="Mobile">
          <ul className="divide-y divide-line">
            {PRIMARY.map((item) => (
              <li key={item.label} className="py-1">
                {item.mega ? (
                  <div>
                    <button
                      className="flex w-full items-center justify-between py-3 text-[13px] font-bold uppercase tracking-[0.18em]"
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      aria-expanded={expanded === item.label}
                    >
                      {item.label}
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", expanded === item.label && "rotate-180")} />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-400 ease-out",
                        expanded === item.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="pb-3 pl-4">
                          {(item.mega === "embroidery"
                            ? collections.map((c) => ({ slug: c.slug, label: c.label }))
                            : MEGA_CATEGORIES
                          ).map((c) => (
                            <li key={c.slug}>
                              <Link
                                to={item.mega === "embroidery" ? `/shop/embroidery?collection=${c.slug}` : `/shop/${item.mega}?category=${c.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-[14px] text-ink/75"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              to={item.to}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-ink underline underline-offset-4 decoration-bronze decoration-2"
                            >
                              Shop all {item.label.toLowerCase()}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-[13px] font-bold uppercase tracking-[0.18em]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <ul className="mt-6 space-y-1 border-t border-line pt-6 text-[14px] text-ink/75">
            {[
              { label: "About DEEPIER", to: "/about" },
              { label: "Our Craft", to: "/craft" },
              { label: "Journal", to: "/journal" },
              { label: "Contact Us", to: "/contact" },
              { label: "Track Order", to: "/track" },
              { label: "Size Guide", to: "/size-guide" },
              { label: "FAQ", to: "/faq" },
              user ? { label: "My Account", to: "/account" } : { label: "Login / Register", to: "/login" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={() => setMobileMenuOpen(false)} className="block py-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line p-5">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
            className="mb-4 flex w-full items-center gap-3 border border-line bg-white px-4 py-3 text-[14px] text-muted-foreground"
          >
            <Search className="h-4 w-4" /> Search products
          </button>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Link
              to={user ? "/account" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1.5 border border-line py-3 text-[11px] font-semibold uppercase tracking-wider text-ink/80"
            >
              <User className="h-4.5 w-4.5" /> {user ? "Account" : "Login"}
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1.5 border border-line py-3 text-[11px] font-semibold uppercase tracking-wider text-ink/80"
            >
              <span className="relative">
                <Heart className="h-4.5 w-4.5" />
                {wishCount > 0 && <span className="absolute -right-2 -top-1.5 text-[9px] font-bold text-bronze">{wishCount}</span>}
              </span>
              Wishlist
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1.5 border border-line py-3 text-[11px] font-semibold uppercase tracking-wider text-ink/80"
            >
              <span className="relative">
                <ShoppingBag className="h-4.5 w-4.5" />
                {cartCount > 0 && <span className="absolute -right-2 -top-1.5 text-[9px] font-bold text-bronze">{cartCount}</span>}
              </span>
              Bag
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
