"use client";

import { useEffect, useState } from "react";
import { X, Star, Heart, ArrowRight, Check } from "lucide-react";
import { useUI, useCart, useWishlist } from "@/lib/store";
import { getProduct } from "@/lib/data";
import { cn, formatINR, discountPct } from "@/lib/utils";
import { Link, useRouter } from "@/lib/router";
import { useToast } from "@/hooks/use-toast";

export function QuickView() {
  const { quickViewSlug, setQuickView } = useUI();
  const [size, setSize] = useState<string | null>(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCart((s) => s.addItem);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => (quickViewSlug ? s.ids.includes(getProduct(quickViewSlug)?.id ?? "") : false));
  const { toast } = useToast();
  const { navigate } = useRouter();

  const product = quickViewSlug ? getProduct(quickViewSlug) : null;

  useEffect(() => {
    setSize(null);
    setColorIdx(0);
    setImgIdx(0);
    document.body.style.overflow = quickViewSlug ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [quickViewSlug]);

  if (!product) return null;
  const disc = discountPct(product.price, product.mrp);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={`Quick view ${product.name}`}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in" onClick={() => setQuickView(null)} />
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto dp-scroll bg-bone animate-fade-up">
        <button
          aria-label="Close quick view"
          onClick={() => setQuickView(null)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-bone/90 backdrop-blur transition-transform hover:rotate-90 duration-300"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="grid sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-secondary sm:aspect-auto">
            { }
            <img src={product.images[imgIdx].src} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setImgIdx(i)}
                  className={cn("h-1.5 w-6 transition-colors", i === imgIdx ? "bg-ink" : "bg-ink/25")}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8">
            <p className="eyebrow text-muted-foreground">{product.collection}</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase leading-tight">{product.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex items-center gap-1 bg-secondary px-2 py-0.5 text-[12px] font-semibold">
                <Star className="h-3 w-3 fill-ink" /> {product.rating}
              </span>
              <span className="text-[12px] text-muted-foreground">{product.reviewCount} reviews</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2.5">
              <p className="text-xl font-bold">{formatINR(product.price)}</p>
              {disc > 0 && (
                <>
                  <p className="text-[14px] text-muted-foreground line-through">{formatINR(product.mrp)}</p>
                  <p className="text-[13px] font-bold text-sale">{disc}% off</p>
                </>
              )}
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink/70">{product.shortDescription}. {product.fabric}.</p>

            {/* Colors */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60">Colour — {product.colors[colorIdx].name}</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    aria-label={c.name}
                    onClick={() => setColorIdx(i)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 p-0.5 transition-colors",
                      i === colorIdx ? "border-ink" : "border-transparent"
                    )}
                  >
                    <span className="block h-full w-full rounded-full border border-ink/10" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60">Select size</p>
                <Link to="/size-guide" onClick={() => setQuickView(null)} className="text-[11.5px] underline underline-offset-4 text-muted-foreground hover:text-ink">
                  Size guide
                </Link>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    disabled={!s.inStock}
                    onClick={() => setSize(s.label)}
                    className={cn(
                      "min-w-11 border px-2 py-2 text-[13px] font-semibold transition-colors",
                      size === s.label
                        ? "border-ink bg-ink text-bone"
                        : s.inStock
                          ? "border-line hover:border-ink"
                          : "cursor-not-allowed border-line/60 text-ink/25 line-through"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto] gap-2.5">
              <button
                disabled={!size}
                onClick={() => {
                  addItem({ productId: product.id, size: size!, color: product.colors[colorIdx].name, qty: 1 });
                  setQuickView(null);
                }}
                className="flex items-center justify-center gap-2 bg-ink py-3.5 text-[11.5px] font-bold uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to bag
              </button>
              <button
                aria-label="Toggle wishlist"
                onClick={() => {
                  const added = toggleWish(product.id);
                  toast({ title: added ? "Added to wishlist" : "Removed from wishlist" });
                }}
                className="flex w-12 items-center justify-center border border-ink transition-colors hover:bg-secondary"
              >
                <Heart className={cn("h-4.5 w-4.5", wished && "fill-sale text-sale")} />
              </button>
            </div>
            <button
              onClick={() => {
                setQuickView(null);
                navigate(`/product/${product.slug}`);
              }}
              className="group mt-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] underline underline-offset-4 decoration-bronze decoration-2"
            >
              View full details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
