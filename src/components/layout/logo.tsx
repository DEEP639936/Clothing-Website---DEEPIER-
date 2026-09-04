"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/lib/router";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" aria-label="DEEPIER — home" className={cn("inline-flex items-baseline select-none", className)}>
      <span
        className={cn(
          "font-sans font-extrabold uppercase tracking-[0.18em] leading-none",
          light ? "text-white" : "text-ink",
          "text-lg sm:text-xl"
        )}
      >
        Deep<span className="relative">i<span className="absolute -bottom-[0.28em] left-1/2 -translate-x-1/2 block h-[2px] w-[70%] bg-bronze" aria-hidden /></span>er
      </span>
      <span className="sr-only">DEEPIER — premium embroidered clothing</span>
    </Link>
  );
}
