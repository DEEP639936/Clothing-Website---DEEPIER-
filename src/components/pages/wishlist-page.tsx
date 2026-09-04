"use client";

import { useState } from "react";
import { Heart, ArrowRight, ShoppingBag, Bell } from "lucide-react";
import { useWishlist, useCart, useHydrated } from "@/lib/store";
import { getProduct } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";
import { Link } from "@/lib/router";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { useToast } from "@/hooks/use-toast";

export function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const addItem = useCart((s) => s.addItem);
  const hydrated = useHydrated();
  const [moving, setMoving] = useState<string | null>(null);
  const { toast } = useToast();

  const items = ids.map((id) => getProduct(id)).filter(Boolean);

  const moveToBag = (slug: string, id: string) => {
    const p = getProduct(slug);
    if (!p) return;
    const firstInStock = p.sizes.find((s) => s.inStock);
    if (!firstInStock) {
      toast({ title: "Currently unavailable", description: `${p.name} is out of stock in all sizes.` });
      return;
    }
    setMoving(id);
    setTimeout(() => {
      addItem({ productId: id, size: firstInStock.label, color: p.colors[0].name, qty: 1 });
      remove(id);
      setMoving(null);
      toast({ title: "Moved to bag", description: `${p.name} · size ${firstInStock.label}` });
    }, 400);
  };

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="display-2 mt-5">
        Wishlist {items.length > 0 && <span className="text-muted-foreground/60">({items.length})</span>}
      </h1>
      <p className="mt-3 max-w-md text-[14px] text-muted-foreground">
        Saved pieces live here. We&rsquo;ll flag price drops and restocks the moment they happen.
      </p>

      {!hydrated ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto mt-10 max-w-md border border-line bg-white px-8 py-16 text-center">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <Heart className="h-10 w-10 text-ink/30" strokeWidth={1.2} />
          </span>
          <h2 className="mt-8 text-xl font-extrabold uppercase tracking-[0.1em]">Nothing saved yet</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Tap the heart on any piece to keep it here. Your future favourites are one scroll away.
          </p>
          <Link to="/shop" className="mt-8 inline-block bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85">
            Start exploring
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            {items.map((p) => {
              const outOfStock = !p!.sizes.some((s) => s.inStock);
              return (
                <div key={p!.id} className="reveal is-visible group/card">
                  <ProductCard product={p!} />
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => moveToBag(p!.slug, p!.id)}
                      disabled={outOfStock || moving === p!.id}
                      className={cn(
                        "flex items-center justify-center gap-1.5 bg-ink py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-bone transition-opacity hover:opacity-85",
                        (outOfStock || moving === p!.id) && "cursor-not-allowed opacity-40"
                      )}
                    >
                      {moving === p!.id ? <span className="h-3.5 w-3.5 animate-spin rounded-full border border-bone/40 border-t-bone" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                      {outOfStock ? "Sold out" : "Move to bag"}
                    </button>
                    <button
                      onClick={() => {
                        remove(p!.id);
                        toast({ title: "Removed from wishlist" });
                      }}
                      className="border border-line py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-sale hover:text-sale"
                    >
                      Remove
                    </button>
                  </div>
                  {outOfStock && (
                    <button className="mt-2 flex w-full items-center justify-center gap-1.5 border border-dashed border-line py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground hover:border-ink hover:text-ink">
                      <Bell className="h-3.5 w-3.5" /> Notify me
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-14 border-t border-line pt-8">
            <Link to="/shop" className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em]">
              Continue shopping <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export function WishlistPriceNote({ price }: { price: number }) {
  return <span className="text-[12px] text-muted-foreground">{formatINR(price)}</span>;
}
