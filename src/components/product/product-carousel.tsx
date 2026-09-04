"use client";

import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const w = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-end gap-2">
        <button
          aria-label="Previous products"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          className={cn(
            "flex h-10 w-10 items-center justify-center border border-line bg-white transition-all",
            canPrev ? "hover:border-ink hover:bg-ink hover:text-bone" : "cursor-not-allowed opacity-35"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          aria-label="Next products"
          onClick={() => scroll(1)}
          disabled={!canNext}
          className={cn(
            "flex h-10 w-10 items-center justify-center border border-line bg-white transition-all",
            canNext ? "hover:border-ink hover:bg-ink hover:text-bone" : "cursor-not-allowed opacity-35"
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={trackRef}
        onScroll={update}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-1 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none" }}
        role="region"
        aria-label="Product carousel"
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[68vw] shrink-0 snap-start sm:w-[300px]">
            <ProductCard product={p} priority={i < 2} />
          </div>
        ))}
      </div>
    </div>
  );
}
