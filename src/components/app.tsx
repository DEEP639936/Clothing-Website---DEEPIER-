"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useRouter, RouterProvider } from "@/lib/router";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { QuickView } from "@/components/product/quick-view";
import { SizeGuideModal } from "@/components/product/size-guide";
import { useUI } from "@/lib/store";

import { HomePage } from "@/components/pages/home-page";
import { ShopPage } from "@/components/pages/shop-page";
import { ProductPage } from "@/components/pages/product-page";
import { CartPage } from "@/components/pages/cart-page";
import { CheckoutPage, OrderConfirmationPage } from "@/components/pages/checkout-page";
import { WishlistPage } from "@/components/pages/wishlist-page";
import { AuthPage } from "@/components/pages/auth-page";
import { AccountPage, OrderTrackingPage } from "@/components/pages/account-page";
import { SearchPage } from "@/components/pages/search-page";
import { AboutPage, CraftPage, JournalPage, JournalArticlePage } from "@/components/pages/editorial-pages";
import {
  FAQPage,
  ContactPage,
  ShippingPage,
  ReturnsPage,
  PrivacyPage,
  TermsPage,
  SizeGuidePage,
  NotFoundPage,
} from "@/components/pages/content-pages";

const TITLES: Record<string, string> = {
  "/": "DEEPIER — Premium Embroidered Clothing | Wear Your Story",
  "/shop": "Shop All",
  "/shop/men": "Shop Men",
  "/shop/women": "Shop Women",
  "/shop/new-arrivals": "New Arrivals",
  "/shop/best-sellers": "Best Sellers",
  "/shop/embroidery": "The Embroidery Collection",
  "/shop/sale": "Sale",
  "/cart": "Your Bag",
  "/checkout": "Checkout",
  "/wishlist": "Wishlist",
  "/search": "Search",
  "/login": "Sign In",
  "/register": "Create Account",
  "/account": "My Account",
  "/about": "About DEEPIER",
  "/craft": "Our Craft",
  "/journal": "The Journal",
  "/contact": "Contact Us",
  "/faq": "FAQ",
  "/shipping": "Shipping & Delivery",
  "/returns": "Returns & Refunds",
  "/privacy": "Privacy Policy",
  "/terms": "Terms & Conditions",
  "/size-guide": "Size Guide",
};

function BackToTop() {
  const show = useScrolled(500);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 z-40 flex h-11 w-11 items-center justify-center border border-ink bg-bone text-ink shadow-lg transition-all duration-400 lg:bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-4.5 w-4.5" />
    </button>
  );
}

function RouteRenderer() {
  const { path } = useRouter();

  if (path === "/") return <HomePage />;
  if (path === "/shop") return <ShopPage mode="all" />;
  if (path === "/shop/men") return <ShopPage mode="men" />;
  if (path === "/shop/women") return <ShopPage mode="women" />;
  if (path === "/shop/new-arrivals") return <ShopPage mode="new-arrivals" />;
  if (path === "/shop/best-sellers") return <ShopPage mode="best-sellers" />;
  if (path === "/shop/embroidery") return <ShopPage mode="embroidery" />;
  if (path === "/shop/sale") return <ShopPage mode="sale" />;
  if (path.startsWith("/product/")) return <ProductPage slug={path.slice("/product/".length)} />;
  if (path === "/cart") return <CartPage />;
  if (path === "/checkout") return <CheckoutPage />;
  if (path.startsWith("/order-confirmation/")) return <OrderConfirmationPage orderId={path.slice("/order-confirmation/".length)} />;
  if (path === "/wishlist") return <WishlistPage />;
  if (path === "/search") return <SearchPage />;
  if (path === "/login") return <AuthPage mode="login" />;
  if (path === "/register") return <AuthPage mode="register" />;
  if (path === "/account" || path === "/account/") return <AccountPage tab="profile" />;
  if (path === "/account/orders") return <AccountPage tab="orders" />;
  if (path === "/account/wishlist") return <AccountPage tab="wishlist" />;
  if (path === "/account/addresses") return <AccountPage tab="addresses" />;
  if (path.startsWith("/account/orders/")) return <OrderTrackingPage orderId={path.slice("/account/orders/".length)} />;
  if (path === "/track") return <OrderTrackingPage />;
  if (path === "/about") return <AboutPage />;
  if (path === "/craft") return <CraftPage />;
  if (path === "/journal") return <JournalPage />;
  if (path.startsWith("/journal/")) return <JournalArticlePage slug={path.slice("/journal/".length)} />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/faq") return <FAQPage />;
  if (path === "/shipping") return <ShippingPage />;
  if (path === "/returns") return <ReturnsPage />;
  if (path === "/privacy") return <PrivacyPage />;
  if (path === "/terms") return <TermsPage />;
  if (path === "/size-guide") return <SizeGuidePage />;
  return <NotFoundPage />;
}

function useDocumentTitle() {
  const { path } = useRouter();
  useEffect(() => {
    const base = TITLES[path];
    if (base) {
      document.title = base.includes("DEEPIER") ? base : `${base} | DEEPIER`;
    } else if (path.startsWith("/product/")) {
      const slug = path.split("/product/")[1];
      document.title = `${slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} | DEEPIER`;
    } else {
      document.title = "DEEPIER — Premium Embroidered Clothing";
    }
  }, [path]);
}

export function App() {
  // Hash-based routing + persisted stores can never match SSR HTML on deep links.
  // Render a branded splash until mounted, then hydrate the real app (zero mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Splash />;
  return (
    <RouterProvider>
      <AppShell />
    </RouterProvider>
  );
}

function Splash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bone" aria-busy="true" aria-label="DEEPIER is loading">
      <p className="animate-pulse text-2xl font-extrabold uppercase tracking-[0.3em] text-ink">
        Deep<span className="text-bronze">i</span>er
      </p>
      <div className="mt-6 h-px w-24 overflow-hidden bg-line">
        <div className="h-full w-1/2 animate-[dp-marquee_1.2s_linear_infinite] bg-ink" />
      </div>
    </div>
  );
}

function AppShell() {
  useDocumentTitle();
  const closeAll = useUI((s) => s.closeAll);
  const { pathname } = useRouter();

  useEffect(() => {
    closeAll();
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0" id="main">
        <RouteRenderer />
      </main>
      <Footer />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <QuickView />
      <SizeGuideModalConnector />
      <MobileBottomNav />
      <BackToTop />
    </div>
  );
}

function SizeGuideModalConnector() {
  const sizeGuideOpen = useUI((s) => s.sizeGuideOpen);
  const setSizeGuideOpen = useUI((s) => s.setSizeGuideOpen);
  return <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />;
}
