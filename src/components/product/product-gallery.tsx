"use client";

import React, { useRef, useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const touchX = useRef<number | null>(null);

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + images.length) % images.length);

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar sm:flex-col sm:overflow-visible" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`${img.kind} image ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-14 shrink-0 overflow-hidden border transition-colors sm:h-20 sm:w-16",
              i === active ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            { }
            <img src={img.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            {img.kind === "detail" && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 bg-ink/80 px-1 text-[7px] font-bold uppercase tracking-wider text-bone">
                Craft
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden bg-secondary">
        <div
          className="relative aspect-[3/4] w-full cursor-zoom-in"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={onMove}
          onClick={() => setFullscreen(true)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
          aria-label={`${name} — image ${active + 1} of ${images.length}, click to enlarge`}
        >
          { }
          <img
            src={images[active].src}
            alt={images[active].alt}
            className="h-full w-full object-cover transition-transform duration-300"
            style={{ transform: zoomed ? "scale(1.9)" : "scale(1)", transformOrigin: origin }}
          />
        </div>

        {/* Badges overlay */}
        <span className="pointer-events-none absolute left-3 top-3 bg-bone/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink backdrop-blur">
          {images[active].kind === "detail" ? "Embroidery close-up" : images[active].kind}
        </span>

        {/* Controls */}
        <button
          aria-label="Fullscreen"
          onClick={() => setFullscreen(true)}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-bone/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-bone"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <button
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="flex h-9 w-9 items-center justify-center bg-bone/90 backdrop-blur transition-colors hover:bg-ink hover:text-bone"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next image"
            onClick={() => go(1)}
            className="flex h-9 w-9 items-center justify-center bg-bone/90 backdrop-blur transition-colors hover:bg-ink hover:text-bone"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="absolute right-3 top-3 text-[10.5px] font-semibold text-ink/50">
          {active + 1} / {images.length}
        </p>
      </div>

      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-label="Fullscreen image">
          <button
            aria-label="Close fullscreen"
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-bone/10 text-bone transition-colors hover:bg-bone/20"
          >
            <X className="h-5 w-5" />
          </button>
          <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white">
            <ChevronLeft className="h-7 w-7" />
          </button>
          { }
          <img src={images[active].src} alt={images[active].alt} className="max-h-[88vh] max-w-full object-contain" />
          <button aria-label="Next" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white">
            <ChevronRight className="h-7 w-7" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-white/60">
            {images[active].kind} — {active + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
