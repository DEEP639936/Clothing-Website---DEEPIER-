"use client";

import React, { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import { useCart, useWishlist, useUI, useAuth, useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { IMG } from "@/lib/images";
import { products, collections } from "@/lib/data";

interface NavItem {
  label: string;
  to: string;
  mega?: "men" | "women" | "embroidery";
}

const NAV: NavItem[] = [
  { label: "MEN", to: "/shop/men", mega: "men" },
  { label: "WOMEN", to: "/shop/women", mega: "women" },
  { label: "NEW ARRIVALS", to: "/shop/new-arrivals" },
  { label: "BEST SELLERS", to: "/shop/best-sellers" },
  { label: "EMBROIDERY", to: "/shop/embroidery", mega: "embroidery" },
  { label: "SALE", to: "/shop/sale" },
];

export const MEGA_CATEGORIES = [
  { slug: "t-shirts", label: "T-Shirts" },
  { slug: "oversized-t-shirts", label: "Oversized T-Shirts" },
  { slug: "shirts", label: "Shirts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "sweatshirts", label: "Sweatshirts" },
  { slug: "jackets", label: "Jackets" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [closeTimer, setCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const { pathname } = useRouter();
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const user = useAuth((s) => s.user);
  const hydrated = useHydrated();
  const { setSearchOpen, setMobileMenuOpen } = useUI();

  const transparentEligible = pathname === "/";
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setAtTop(window.scrollY < 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = transparentEligible && atTop && !megaOpen;
  const light = overHero;

  const openMega = (item: string) => {
    if (closeTimer) clearTimeout(closeTimer);
    setMegaOpen(item);
  };
  const scheduleClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    setCloseTimer(setTimeout(() => setMegaOpen(null), 120));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        overHero ? "bg-transparent" : "bg-bone/95 backdrop-blur-md shadow-[0_1px_0_0_var(--line)]"
      )}
      onMouseLeave={scheduleClose}
    >
      <div className="container-x">
        <div className={cn("grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300", scrolled ? "h-14" : "h-16 lg:h-20")}>
          {/* Left: desktop logo / mobile burger+logo */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className={cn("h-5 w-5", light ? "text-white" : "text-ink")} />
            </button>
            <div className="hidden lg:block">
              <Logo light={light} />
            </div>
            <div className="lg:hidden">
              <Logo light={light} className="scale-90 origin-left" />
            </div>
          </div>

          {/* Center nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV.map((item) => (
                <li key={item.label} onMouseEnter={() => item.mega && openMega(item.mega)}>
                  <Link
                    to={item.to}
                    className={cn(
                      "group relative py-2 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors",
                      light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink",
                      pathname.startsWith(item.to) && "text-ink"
                    )}
                  >
                    <span className="link-underline pb-0.5">{item.label}</span>
                    {item.label === "SALE" && (
                      <span className="absolute -right-4 -top-0.5 h-1.5 w-1.5 rounded-full bg-sale" aria-hidden />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right icons */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className={cn("p-2.5 transition-colors", light ? "text-white hover:text-white/70" : "text-ink hover:text-ink/60")}
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "My account" : "Login"}
              className={cn("hidden sm:block p-2.5 transition-colors", light ? "text-white hover:text-white/70" : "text-ink hover:text-ink/60")}
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </Link>
            <Link
              to="/wishlist"
              aria-label={`Wishlist${hydrated && wishCount > 0 ? `, ${wishCount} items` : ""}`}
              className={cn("relative p-2.5 transition-colors", light ? "text-white hover:text-white/70" : "text-ink hover:text-ink/60")}
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {hydrated && wishCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-bone">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              aria-label={`Shopping bag${hydrated && cartCount > 0 ? `, ${cartCount} items` : ""}`}
              onClick={() => useCart.getState().setOpen(true)}
              className={cn("relative p-2.5 transition-colors", light ? "text-white hover:text-white/70" : "text-ink hover:text-ink/60")}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {hydrated && cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-bone">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mega menu */}
      <div
        className={cn(
          "absolute inset-x-0 top-full hidden lg:block border-t border-line bg-bone shadow-[0_24px_48px_-24px_rgba(20,20,20,0.25)] transition-all duration-300",
          megaOpen ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-2"
        )}
        onMouseEnter={() => megaOpen && openMega(megaOpen)}
      >
        {megaOpen && (
          <MegaContent
            kind={megaOpen === "men" || megaOpen === "women" ? megaOpen : "embroidery"}
            onNavigate={() => setMegaOpen(null)}
          />
        )}
      </div>
    </header>
  );
}

function MegaContent({ kind, onNavigate }: { kind: "men" | "women" | "embroidery"; onNavigate: () => void }) {
  const base = kind === "embroidery" ? "/shop/embroidery" : `/shop/${kind}`;
  const featured = products
    .filter((p) => (kind === "embroidery" ? p.badges.includes("LIMITED") : p.gender === kind))
    .slice(0, 2);
  const promo =
    kind === "women"
      ? { img: IMG("women_hoodie", 4), title: "The Flame Edit", sub: "Embroidery that catches light" }
      : kind === "men"
        ? { img: IMG("men_jacket", 7), title: "Heirloom Bomber", sub: "42,000 stitches. Numbered." }
        : { img: IMG("embroidery", 5), title: "The Craft Atlas", sub: "Heritage stitches, modern cuts" };

  return (
    <div className="container-x grid grid-cols-12 gap-8 py-10">
      {/* Categories / collections */}
      <div className="col-span-3">
        <p className="eyebrow mb-5 text-muted-foreground">{kind === "embroidery" ? "Collections" : "Shop by category"}</p>
        <ul className="space-y-3">
          {(kind === "embroidery" ? collections : MEGA_CATEGORIES).map((c) => (
            <li key={c.slug}>
              <Link
                to={kind === "embroidery" ? `/shop/embroidery?collection=${c.slug}` : `${base}?category=${c.slug}`}
                onClick={onNavigate}
                className="link-underline text-[15px] font-medium text-ink/85 hover:text-ink"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={base}
          onClick={onNavigate}
          className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-ink underline underline-offset-4 decoration-bronze decoration-2"
        >
          Shop all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Featured products */}
      <div className="col-span-5 grid grid-cols-2 gap-5">
        {featured.map((p) => (
          <Link key={p.id} to={`/product/${p.slug}`} onClick={onNavigate} className="group">
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
              { }
              <img
                src={p.images[0].src}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <span className="absolute left-3 top-3 bg-bone px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em]">
                Featured
              </span>
            </div>
            <p className="mt-3 text-[13.5px] font-semibold leading-snug">{p.name}</p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">₹{p.price.toLocaleString("en-IN")}</p>
          </Link>
        ))}
      </div>

      {/* Promo */}
      <Link to={base} onClick={onNavigate} className="group relative col-span-4 overflow-hidden bg-ink lg:max-h-[440px]">
        { }
        <img
          src={promo.img}
          alt={promo.title}
          loading="lazy"
          className="h-full max-h-[440px] w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">{promo.sub}</p>
          <p className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-white">{promo.title}</p>
          <span className="mt-3 inline-flex items-center gap-2 border-b border-white pb-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </div>
  );
}
