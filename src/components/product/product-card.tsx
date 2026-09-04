"use client";

import React, { useState } from "react";
import { Heart, Star, Eye, Plus, Check } from "lucide-react";
import type { Product } from "@/types";
import { Link, useRouter } from "@/lib/router";
import { useCart, useWishlist } from "@/lib/store";
import { cn, formatINR, discountPct } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUI } from "@/lib/store";

const BADGE_STYLES: Record<string, string> = {
  NEW: "bg-white text-ink",
  BESTSELLER: "bg-ink text-bone",
  LIMITED: "bg-bronze text-white",
  SALE: "bg-sale text-white",
};

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [heartPop, setHeartPop] = useState(false);
  const { toggle } = useWishlist();
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const addItem = useCart((s) => s.addItem);
  const setQuickView = useUI((s) => s.setQuickView);
  const { toast } = useToast();
  const { navigate } = useRouter();

  const disc = discountPct(product.price, product.mrp);
  const secondImage = product.images[1]?.src;
  const shown = hovered && secondImage ? secondImage : product.images[0].src;
  const stockLeft = product.sizes.filter((s) => s.inStock).length;

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(product.id);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 500);
    toast({
      title: added ? "Added to wishlist" : "Removed from wishlist",
      description: product.name,
    });
  };

  const quickAddSize = (size: string) => {
    addItem({ productId: product.id, size, color: product.colors[0].name, qty: 1 });
    setAddedSize(size);
    setTimeout(() => {
      setAddedSize(null);
      setQuickAdd(false);
    }, 900);
  };

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setQuickAdd(false);
      }}
      aria-label={product.name}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-secondary">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <div className="relative aspect-[3/4] w-full">
            { }
            <img
              src={shown}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                hovered && secondImage ? "scale-[1.04]" : "scale-100"
              )}
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.badges.map((b) => (
            <span
              key={b}
              className={cn(
                "px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em]",
                BADGE_STYLES[b]
              )}
            >
              {b}
            </span>
          ))}
          {disc > 0 && (
            <span className="bg-white px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-sale">
              {disc}% off
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWish}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center bg-white/90 text-ink shadow-sm backdrop-blur transition-all hover:bg-white"
        >
          <Heart
            className={cn("h-4 w-4 transition-colors", wished ? "fill-sale text-sale" : "text-ink", heartPop && "animate-heart-pop")}
            strokeWidth={1.8}
          />
        </button>

        {/* Low stock */}
        {product.lowStock && (
          <span className="absolute bottom-2.5 left-2.5 bg-ink/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-bone backdrop-blur">
            Low stock
          </span>
        )}

        {/* Hover actions */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 hidden translate-y-2 flex-col gap-px p-2.5 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:flex",
            !hovered && "pointer-events-none"
          )}
        >
          {!quickAdd ? (
            <div className="flex gap-px">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickAdd(true);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 bg-white/95 py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink backdrop-blur transition-colors hover:bg-ink hover:text-bone"
              >
                <Plus className="h-3.5 w-3.5" /> Quick add
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickView(product.slug);
                }}
                aria-label={`Quick view ${product.name}`}
                className="flex w-11 items-center justify-center bg-white/95 backdrop-blur transition-colors hover:bg-ink hover:text-bone"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="bg-white/95 p-2.5 backdrop-blur">
              <p className="mb-2 text-center text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink/60">
                {addedSize ? <span className="inline-flex items-center gap-1 text-bronze"><Check className="h-3 w-3" /> Added — size {addedSize}</span> : "Quick add — pick a size"}
              </p>
              {!addedSize && (
                <div className="flex flex-wrap justify-center gap-1">
                  {product.sizes.map((s) => (
                    <button
                      key={s.label}
                      disabled={!s.inStock}
                      onClick={(e) => {
                        e.preventDefault();
                        quickAddSize(s.label);
                      }}
                      className={cn(
                        "min-w-8 border px-1.5 py-1.5 text-[11px] font-semibold transition-colors",
                        s.inStock
                          ? "border-line hover:border-ink hover:bg-ink hover:text-bone"
                          : "cursor-not-allowed border-line/60 text-ink/25 line-through"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product.slug}`}>
              <h3 className="truncate text-[14px] font-semibold leading-snug hover:underline underline-offset-2">
                {product.name}
              </h3>
            </Link>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {product.gender} · {product.category.replace(/-/g, " ")}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[14.5px] font-bold">{formatINR(product.price)}</p>
            {disc > 0 && (
              <p className="text-[12px] text-muted-foreground">
                <span className="line-through">{formatINR(product.mrp)}</span>{" "}
                <span className="font-semibold text-sale">{disc}% off</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 bg-secondary px-1.5 py-0.5 text-[11px] font-semibold">
              <Star className="h-3 w-3 fill-ink text-ink" /> {product.rating}
            </span>
            <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1" aria-label={`Available in ${product.colors.map((c) => c.name).join(", ")}`}>
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-ink/15"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="skeleton mt-3 h-4 w-3/4" />
      <div className="skeleton mt-2 h-3 w-1/3" />
    </div>
  );
}
