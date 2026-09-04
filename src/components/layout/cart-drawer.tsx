"use client";

import { useEffect } from "react";
import { X, Minus, Plus, Trash2, Heart, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart, useHydrated } from "@/lib/store";
import { getProduct } from "@/lib/data";
import { formatINR, FREE_SHIPPING_THRESHOLD, cn } from "@/lib/utils";
import { Link, useRouter } from "@/lib/router";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQty, removeItem } = useCart();
  const hydrated = useHydrated();
  const { toast } = useToast();
  const { navigate } = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!hydrated) return null;

  const lines = items
    .map((i) => ({ item: i, product: getProduct(i.productId) }))
    .filter((x) => x.product);
  const subtotal = lines.reduce((a, x) => a + x.product!.price * x.item.qty, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[75] bg-ink/50 backdrop-blur-sm transition-opacity duration-400",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[76] flex w-full max-w-[440px] flex-col bg-bone shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-[13px] font-extrabold uppercase tracking-[0.2em]">
            Your Bag {lines.length > 0 && <span className="text-muted-foreground">({lines.reduce((a, l) => a + l.item.qty, 0)})</span>}
          </h2>
          <button aria-label="Close bag" onClick={() => setOpen(false)} className="p-2 -mr-2 transition-transform hover:rotate-90 duration-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-8 w-8 text-ink/40" strokeWidth={1.4} />
            </span>
            <p className="mt-6 text-[16px] font-bold uppercase tracking-[0.12em]">Your bag is empty</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Every stitch begins with a first piece. Explore the latest drop.
            </p>
            <Link
              to="/shop/new-arrivals"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center gap-2 bg-ink px-8 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-85"
            >
              Shop new arrivals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-line px-6 py-4">
              <p className="text-[12.5px] font-medium text-ink/80">
                {remaining > 0 ? (
                  <>
                    You&rsquo;re <span className="font-bold text-bronze">{formatINR(remaining)}</span> away from{" "}
                    <span className="font-bold">FREE SHIPPING</span>
                  </>
                ) : (
                  <span className="font-bold text-bronze">You&rsquo;ve unlocked FREE shipping</span>
                )}
              </p>
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full rounded-full bg-ink transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto dp-scroll px-6">
              <ul className="divide-y divide-line">
                {lines.map(({ item, product }) => (
                  <li key={item.key} className="flex gap-4 py-5">
                    <Link to={`/product/${product!.slug}`} onClick={() => setOpen(false)} className="h-28 w-22 shrink-0 overflow-hidden bg-secondary" style={{ width: 88 }}>
                      { }
                      <img src={product!.images[0].src} alt={product!.name} loading="lazy" className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${product!.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-[14px] font-semibold leading-snug hover:underline"
                        >
                          {product!.name}
                        </Link>
                        <p className="shrink-0 text-[14px] font-semibold">{formatINR(product!.price * item.qty)}</p>
                      </div>
                      <p className="mt-1 text-[12.5px] text-muted-foreground">
                        {item.color} · Size {item.size}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-line">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-[13px] font-semibold" aria-live="polite">{item.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            aria-label="Move to wishlist"
                            onClick={() => {
                              const { toggle } = useWishlist.getState();
                              const added = toggle(item.productId);
                              if (added) {
                                removeItem(item.key);
                                toast({ title: "Moved to wishlist", description: product!.name });
                              }
                            }}
                            className="p-1.5 text-ink/60 transition-colors hover:text-ink"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <button
                            aria-label={`Remove ${product!.name}`}
                            onClick={() => {
                              removeItem(item.key);
                              toast({ title: "Removed from bag" });
                            }}
                            className="p-1.5 text-ink/60 transition-colors hover:text-sale"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-line bg-white px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] uppercase tracking-[0.14em] text-muted-foreground">Subtotal</p>
                <p className="text-[16px] font-bold">{formatINR(subtotal)}</p>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Truck className="h-3.5 w-3.5" /> {remaining > 0 ? "Shipping calculated at checkout" : "Free shipping unlocked"}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center border border-ink px-4 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-secondary"
                >
                  View cart
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/checkout");
                  }}
                  className="flex items-center justify-center gap-2 bg-ink px-4 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-bone transition-opacity hover:opacity-85"
                >
                  Checkout <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-3 w-full text-center text-[12.5px] text-muted-foreground underline underline-offset-4 hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
