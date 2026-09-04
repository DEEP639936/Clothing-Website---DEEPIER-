"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, Heart, ArrowRight, Tag, X, ShieldCheck, Truck, Lock, ShoppingBag } from "lucide-react";
import { useCart, useWishlist, useHydrated } from "@/lib/store";
import { getProduct, products, coupons } from "@/lib/data";
import { formatINR, cartTotals, FREE_SHIPPING_THRESHOLD, cn } from "@/lib/utils";
import { Link, useRouter } from "@/lib/router";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product/product-card";
import { useToast } from "@/hooks/use-toast";

export function CartPage() {
  const { items, updateQty, removeItem, couponCode, applyCoupon } = useCart();
  const wishlist = useWishlist();
  const hydrated = useHydrated();
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { navigate } = useRouter();

  const lines = items
    .map((i) => ({ item: i, product: getProduct(i.productId) }))
    .filter((x) => x.product) as { item: (typeof items)[number]; product: NonNullable<ReturnType<typeof getProduct>> }[];

  const subtotal = lines.reduce((a, x) => a + x.product.price * x.item.qty, 0);
  const coupon = coupons.find((c) => c.code === couponCode) ?? null;
  const couponValid = coupon && subtotal >= coupon.minOrder ? coupon : null;
  const { discount, shipping, total } = cartTotals(subtotal, couponValid);
  const savings = lines.reduce((a, x) => a + (x.product.mrp - x.product.price) * x.item.qty, 0) + discount;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));

  const applyCode = () => {
    const c = coupons.find((x) => x.code === code.trim().toUpperCase());
    if (!c) {
      toast({ title: "Invalid coupon code", description: `${code.toUpperCase()} is not a valid code.` });
      return;
    }
    if (subtotal < c.minOrder) {
      toast({ title: `Add ${formatINR(c.minOrder - subtotal)} more`, description: c.label });
      return;
    }
    applyCoupon(c.code);
    toast({ title: `Coupon applied — ${c.code}`, description: c.label });
    setCode("");
  };

  if (!hydrated) {
    return (
      <div className="container-x py-16">
        <div className="skeleton h-8 w-40" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">{[0, 1].map((i) => <div key={i} className="skeleton h-36" />)}</div>
          <div className="skeleton h-80" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-x py-20">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shopping Bag" }]} />
        <div className="mx-auto mt-10 max-w-md border border-line bg-white px-8 py-16 text-center">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-10 w-10 text-ink/35" strokeWidth={1.2} />
          </span>
          <h1 className="mt-8 text-xl font-extrabold uppercase tracking-[0.1em]">Your bag is empty</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Nothing in here yet. The latest drop is waiting — every piece carries its own stitches.
          </p>
          <div className="mt-8 flex flex-col gap-2.5">
            <Link to="/shop/new-arrivals" className="bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85">
              Shop new arrivals
            </Link>
            <Link to="/shop/best-sellers" className="border border-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] hover:bg-secondary">
              Best sellers
            </Link>
          </div>
        </div>
        <RecommendedRow />
      </div>
    );
  }

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shopping Bag" }]} />
      <h1 className="display-2 mt-5">
        Your Bag <span className="text-muted-foreground/60">({lines.reduce((a, l) => a + l.item.qty, 0)})</span>
      </h1>

      {remaining > 0 ? (
        <div className="mt-5 border border-line bg-white p-4">
          <p className="text-[13.5px]">
            You&rsquo;re <span className="font-bold text-bronze">{formatINR(remaining)}</span> away from{" "}
            <span className="font-bold uppercase tracking-wide">free shipping</span>
          </p>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-ink transition-all duration-700"
              style={{ width: `${Math.min(100, ((subtotal - discount) / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2 border border-bronze/30 bg-bronze/5 p-4 text-[13.5px] font-semibold text-bronze">
          <Truck className="h-4 w-4" /> Free shipping unlocked on this order.
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {lines.map(({ item, product }) => (
              <li key={item.key} className="flex gap-4 py-6 sm:gap-6">
                <Link to={`/product/${product.slug}`} className="w-24 shrink-0 overflow-hidden bg-secondary sm:w-32">
                  { }
                  <img src={product.images[0].src} alt={product.name} loading="lazy" className="aspect-[3/4] h-full w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/product/${product.slug}`} className="text-[15px] font-bold leading-snug hover:underline">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[12.5px] text-muted-foreground">
                        {item.color} · Size {item.size} · {product.collection}
                      </p>
                      <p className="mt-1.5 text-[12.5px] font-medium text-bronze">In stock — ships in 24h</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[15.5px] font-bold">{formatINR(product.price * item.qty)}</p>
                      {product.mrp > product.price && (
                        <p className="text-[12px] text-muted-foreground line-through">{formatINR(product.mrp * item.qty)}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div className="flex items-center border border-line">
                      <button aria-label="Decrease quantity" onClick={() => updateQty(item.key, item.qty - 1)} className="flex h-9 w-9 items-center justify-center hover:bg-secondary">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-[14px] font-semibold">{item.qty}</span>
                      <button aria-label="Increase quantity" onClick={() => updateQty(item.key, item.qty + 1)} className="flex h-9 w-9 items-center justify-center hover:bg-secondary">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          wishlist.toggle(item.productId);
                          removeItem(item.key);
                          toast({ title: "Moved to wishlist", description: product.name });
                        }}
                        className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-ink"
                      >
                        <Heart className="h-4 w-4" /> Move to wishlist
                      </button>
                      <button
                        onClick={() => {
                          removeItem(item.key);
                          toast({ title: "Removed from bag" });
                        }}
                        aria-label={`Remove ${product.name}`}
                        className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-sale"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-ink">
            <ArrowRight className="h-4 w-4 rotate-180" /> Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-24" aria-label="Order summary">
          <div className="border border-line bg-white p-6">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.2em]">Order Summary</h2>

            {/* Coupon */}
            <div className="mt-5">
              {couponValid ? (
                <div className="flex items-center justify-between border border-bronze/40 bg-bronze/5 px-3.5 py-3">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-bronze">
                    <Tag className="h-4 w-4" /> {couponValid.code}
                    <span className="font-normal text-ink/60">— {couponValid.label}</span>
                  </div>
                  <button aria-label="Remove coupon" onClick={() => applyCoupon(null)} className="p-1 text-ink/50 hover:text-ink">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    aria-label="Coupon code"
                    className="w-full border border-line bg-bone px-3.5 py-3 text-[13.5px] uppercase tracking-wider focus:border-ink focus:outline-none"
                  />
                  <button onClick={applyCode} disabled={!code.trim()} className="shrink-0 border border-ink px-5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-bone disabled:opacity-40">
                    Apply
                  </button>
                </div>
              )}
              <p className="mt-2 text-[11.5px] text-muted-foreground">Try <strong>DEEPER10</strong> — 10% off above ₹1,499</p>
            </div>

            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatINR(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sale">
                  <dt>Coupon discount</dt>
                  <dd className="font-semibold">−{formatINR(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold">{shipping === 0 ? <span className="text-bronze">FREE</span> : formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Taxes</dt>
                <dd className="text-[13px] text-muted-foreground">Included in MRP</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-[16px]">
                <dt className="font-extrabold uppercase">Total</dt>
                <dd className="font-extrabold">{formatINR(total)}</dd>
              </div>
              {savings > 0 && (
                <p className="bg-secondary px-3 py-2 text-[12.5px] font-semibold text-bronze">
                  You&rsquo;re saving {formatINR(savings)} on this order
                </p>
              )}
            </dl>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-ink py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone transition-opacity hover:opacity-85"
            >
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Secure 256-bit encrypted checkout
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink/50">
              <ShieldCheck className="h-4 w-4 text-bronze" /> UPI · Visa · Mastercard · RuPay · COD
            </div>
          </div>
        </aside>
      </div>

      <RecommendedRow />
    </div>
  );
}

function RecommendedRow() {
  const recs = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  return (
    <section className="mt-20 border-t border-line pt-14" aria-label="Recommended for you">
      <h2 className="display-3 mb-8">Pairs well with</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
        {recs.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
