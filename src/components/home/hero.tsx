"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { HERO_IMAGES } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative -mt-16 h-[92svh] min-h-[560px] w-full overflow-hidden bg-ink lg:-mt-20" aria-label="DEEPIER hero">
      {/* Background image */}
      <div className="absolute inset-0">
        { }
        <img
          src={HERO_IMAGES}
          alt="DEEPIER — premium embroidered clothing campaign"
          fetchPriority="high"
          className="animate-hero-zoom h-full w-full object-cover object-[50%_30%]"
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-24 sm:justify-center sm:pb-0">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-up text-white/60" style={{ animationDelay: "0.15s" }}>
            Premium embroidered clothing · Est. in the studio
          </p>
          <h1 className="display-1 mt-4 animate-fade-up text-white" style={{ animationDelay: "0.3s" }}>
            Wear your<br />story<span className="text-bronze">.</span>
          </h1>
          <p
            className="mt-5 max-w-md animate-fade-up text-[15px] leading-relaxed text-white/75 sm:text-base"
            style={{ animationDelay: "0.45s" }}
          >
            Premium embroidered clothing, crafted for those who go deeper. Every stitch placed with intent, every detail designed to last.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3" style={{ animationDelay: "0.6s" }}>
            <Link
              to="/shop/men"
              className="group flex items-center gap-2 bg-bone px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
            >
              Shop men
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop/women"
              className="group flex items-center gap-2 bg-bone px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
            >
              Shop women
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <Link
            to="/craft"
            className="mt-5 inline-flex animate-fade-up items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white"
            style={{ animationDelay: "0.72s" }}
          >
            <span className="h-px w-8 bg-bronze" aria-hidden />
            Explore embroidery
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block" aria-hidden>
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-white/30 p-1.5">
          <div className="h-2.5 w-[3px] animate-bounce rounded-full bg-white/70" style={{ animationDuration: "1.6s" }} />
        </div>
      </div>
    </section>
  );
}
