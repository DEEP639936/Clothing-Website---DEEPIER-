"use client";

import { Star, ArrowRight, BadgeCheck, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@/lib/router";
import { SectionHeading } from "./section-heading";
import { ProductCard } from "@/components/product/product-card";
import { ProductCarousel } from "@/components/product/product-carousel";
import { useReveal } from "@/hooks/use-reveal";
import {
  products,
  bestSellers,
  newArrivals,
  reviews,
  categories,
} from "@/lib/data";
import {
  CATEGORY_IMAGES,
  EMBROIDERY_STORY_IMAGES,
  STORY_IMAGE,
  INSTAGRAM_IMAGES,
  NEWDROP_CAMPAIGN,
} from "@/lib/images";
import { cn, formatINR } from "@/lib/utils";

/* ------------------------- THE LATEST DROP ------------------------- */
export function LatestDrop() {
  const items = products.filter((p) => p.badges.includes("NEW")).slice(0, 4);
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="latest-drop">
      <SectionHeading eyebrow="Just landed" title="The Latest Drop" cta="View all" href="/shop/new-arrivals" />
      <div id="latest-drop" className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
        {items.map((p, i) => (
          <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            <ProductCard product={p} priority={i < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- SHOP BY CATEGORY ------------------------- */
export function CategoryGrid() {
  return (
    <section className="container-x py-4 sm:py-10" aria-labelledby="shop-category">
      <SectionHeading eyebrow="Find your silhouette" title="Shop by Category" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.slice(0, 6).map((c, i) => (
          <Link
            key={c.slug}
            to={`/shop?category=${c.slug}`}
            className={cn(
              "group relative block overflow-hidden bg-ink reveal",
              i === 0 && "lg:col-span-2 lg:row-span-2",
              i === 5 && "lg:col-span-2"
            )}
            style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            aria-label={`Shop ${c.label}`}
          >
            <div className={cn("relative w-full", i === 0 ? "aspect-square lg:aspect-auto lg:h-full lg:min-h-[560px]" : "aspect-[3/4]")}>
              { }
              <img
                src={c.image}
                alt={`${c.label} collection`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
                <div>
                  <h3 className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-white sm:text-lg">{c.label}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/60">{c.productCount} styles</p>
                </div>
                <span className="flex items-center gap-1.5 border-b border-white/0 pb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-300 group-hover:border-white group-hover:opacity-100">
                  Shop now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
        {/* New arrivals tile */}
        <Link to="/shop/new-arrivals" className="group relative block overflow-hidden bg-ink reveal lg:col-span-2" style={{ transitionDelay: "210ms" }} aria-label="Shop new arrivals">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[300px]">
            { }
            <img
              src={CATEGORY_IMAGES["new-arrivals"]}
              alt="New arrivals"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">Fresh off the needle</p>
              <h3 className="mt-2 px-4 text-xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-2xl">
                New<br />Arrivals
              </h3>
              <span className="mt-4 flex items-center gap-1.5 border-b border-white pb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ----------------------- EMBROIDERY SHOWCASE ------------------------ */
export function EmbroideryShowcase() {
  useReveal();
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-bone sm:py-28" aria-labelledby="craft-title">
      {/* giant ghost word */}
      <div className="pointer-events-none absolute -top-6 left-0 w-full select-none overflow-hidden" aria-hidden>
        <p className="whitespace-nowrap text-[22vw] font-extrabold uppercase leading-none text-white/[0.04]">DEEPER</p>
      </div>
      <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Animated image stack */}
        <div className="relative order-2 h-[420px] sm:h-[520px] lg:order-1">
          {EMBROIDERY_STORY_IMAGES.map((src, i) => (
            <div
              key={src}
              className={cn(
                "reveal-scale absolute overflow-hidden shadow-2xl",
                i === 0 && "left-0 top-0 h-[62%] w-[58%]",
                i === 1 && "right-0 top-[8%] h-[46%] w-[44%]",
                i === 2 && "bottom-0 left-[8%] h-[42%] w-[40%]",
                i === 3 && "bottom-[4%] right-0 h-[54%] w-[48%]"
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              { }
              <img
                src={src}
                alt={["Machine embroidery needle in motion", "Embroidery threads crossed", "Floral embroidery on denim", "Zardozi metallic threadwork"][i]}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {/* rotating badge */}
          <div className="absolute left-[46%] top-[38%] z-10 flex h-24 w-24 items-center justify-center rounded-full bg-bronze text-center shadow-xl" aria-hidden>
            <p className="text-[8.5px] font-extrabold uppercase leading-tight tracking-[0.14em] text-white">
              Every<br />stitch<br />counts
            </p>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <p className="eyebrow reveal text-bronze">The craft — why we exist</p>
          <h2 id="craft-title" className="display-2 mt-3 reveal text-white">
            Details that go deeper<span className="text-bronze">.</span>
          </h2>
          <p className="mt-6 max-w-lg reveal text-[15.5px] leading-relaxed text-white/70">
            Every stitch has a purpose. Every detail is designed to make the ordinary feel extraordinary.
            We thread heritage techniques — Kantha, Aari, Zardozi — through contemporary silhouettes,
            so a garment is never just worn. It is read, up close, like a story.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: Sparkles, t: "42,000 stitches", d: "on a single Heirloom back panel" },
              { icon: BadgeCheck, t: "30-wash tested", d: "every motif survives the decades, not the season" },
              { icon: ShieldCheck, t: "Thread, never ink", d: "embroidery that outlives any print" },
            ].map(({ icon: Icon, t, d }, i) => (
              <li key={t} className="reveal flex items-start gap-4" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-white/15">
                  <Icon className="h-4.5 w-4.5 text-bronze" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[14.5px] font-bold uppercase tracking-[0.08em] text-white">{t}</p>
                  <p className="mt-0.5 text-[13.5px] text-white/55">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/craft"
            className="group mt-10 inline-flex reveal items-center gap-2 border border-bone px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone hover:text-ink"
          >
            Discover our craft
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- BEST SELLERS -------------------------- */
export function BestSellers() {
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="best-sellers">
      <SectionHeading eyebrow="Community favourites" title="Best Sellers" cta="Shop all" href="/shop/best-sellers" />
      <div id="best-sellers" className="reveal">
        <ProductCarousel products={bestSellers()} />
      </div>
    </section>
  );
}

/* ---------------------------- BRAND STORY --------------------------- */
export function BrandStory() {
  return (
    <section className="py-4 sm:py-10" aria-labelledby="story-title">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden bg-ink lg:min-h-[640px]">
          { }
          <img
            src={STORY_IMAGE}
            alt="DEEPIER editorial — monochrome street portrait"
            loading="lazy"
            className="reveal-scale absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute bottom-5 left-5 bg-bone px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Lookbook 03 — Monolith</p>
          </div>
        </div>
        <div className="flex items-center bg-secondary">
          <div className="container-x py-16 sm:py-20 lg:px-16">
            <p className="eyebrow reveal text-muted-foreground">The house of DEEPIER</p>
            <h2 id="story-title" className="display-2 mt-3 reveal">
              Made to be noticed<span className="text-bronze">.</span>
            </h2>
            <p className="mt-6 max-w-md reveal text-[15.5px] leading-relaxed text-ink/70">
              DEEPIER began with a simple refusal: clothing should not whisper and disappear.
              We cut contemporary silhouettes from premium fabric and mark them with embroidery
              that carries meaning — heritage stitches, modern hands, quiet confidence.
            </p>
            <p className="mt-4 max-w-md reveal text-[15.5px] leading-relaxed text-ink/70">
              From the first sketch to the final press, every piece passes through hands that care
              about the half-millimetre nobody else notices. That is the whole brand: depth over noise.
            </p>
            <Link
              to="/about"
              className="group mt-9 inline-flex reveal items-center gap-2 bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bronze"
            >
              Our story
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- NEW ARRIVALS -------------------------- */
export function NewArrivals() {
  const items = newArrivals().slice(0, 8);
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="new-arrivals">
      <SectionHeading eyebrow="Fresh off the needle" title="New Arrivals" cta="Shop all new" href="/shop/new-arrivals" />
      <div id="new-arrivals" className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p, i) => (
          <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- COMPLETE THE LOOK ----------------------- */
export function CompleteTheLook() {
  const look = [products.find((p) => p.slug === "drift-oversized-tee")!, products.find((p) => p.slug === "monsoon-bomber")!];
  return (
    <section className="container-x pb-16 sm:pb-24" aria-labelledby="ctl-title">
      <div className="grid overflow-hidden border border-line lg:grid-cols-2">
        <div className="relative min-h-[380px]">
          { }
          <img src={NEWDROP_CAMPAIGN} alt="Complete the look — street campaign" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-bone">
            New drop
          </span>
        </div>
        <div className="bg-white p-7 sm:p-10 lg:p-14">
          <p className="eyebrow reveal text-muted-foreground">Styled by the studio</p>
          <h2 id="ctl-title" className="display-3 mt-2 reveal">Complete the look.</h2>
          <p className="mt-4 max-w-md reveal text-[14.5px] leading-relaxed text-ink/70">
            Two pieces, one attitude — the Drift tee layered under the Monsoon bomber.
            Built to be worn apart, better together.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
            {look.map((p) => (
              <div key={p.id} className="reveal">
                <Link to={`/product/${p.slug}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden bg-secondary">
                    { }
                    <img src={p.images[0].src} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 text-[13.5px] font-semibold">{p.name}</p>
                  <p className="text-[13px] text-muted-foreground">{formatINR(p.price)}</p>
                </Link>
              </div>
            ))}
          </div>
          <Link to="/shop" className="group mt-8 inline-flex reveal items-center gap-2 border-b border-ink pb-1 text-[11.5px] font-bold uppercase tracking-[0.2em]">
            Shop the full look
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- REVIEWS ------------------------------ */
export function CustomerReviews() {
  return (
    <section className="bg-secondary py-16 sm:py-24" aria-labelledby="reviews-title">
      <div className="container-x">
        <SectionHeading eyebrow="10,000+ happy customers" title="Worn & Reviewed" align="center" />
        <div className="no-scrollbar -mx-4 mt-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" role="region" aria-label="Customer reviews carousel">
          {reviews.map((r, i) => (
            <figure
              key={r.id}
              className="reveal w-[85vw] max-w-[380px] shrink-0 snap-center border border-line bg-bone p-7"
              style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            >
              <div className="flex items-center gap-0.5" aria-label={`Rated ${r.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={cn("h-3.5 w-3.5", s < r.rating ? "fill-ink text-ink" : "text-line")} />
                ))}
              </div>
              <blockquote className="mt-4">
                <p className="text-[14.5px] font-bold">{r.title}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">&ldquo;{r.text}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <div>
                  <p className="text-[13px] font-semibold">{r.name} · {r.location}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">{r.product}</p>
                </div>
                {r.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-bronze">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- INSTAGRAM ----------------------------- */
export function InstagramSection() {
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="insta-title">
      <SectionHeading eyebrow="@deepier on the streets" title="Follow the Deeper Side." align="center" />
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {INSTAGRAM_IMAGES.map((src, i) => (
          <a
            key={src}
            href="https://instagram.com/deepier"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block overflow-hidden bg-secondary"
            aria-label={`DEEPIER on Instagram — post ${i + 1}`}
          >
            <div className="aspect-square">
              { }
              <img
                src={src}
                alt={`DEEPIER community style ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/35">
              <span className="translate-y-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                @deepier
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href="https://instagram.com/deepier"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 border border-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
        >
          @DEEPIER <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

/* --------------------------- TRUST STRIP ---------------------------- */
export function TrustStrip() {
  const items = [
    { icon: Truck, t: "Free shipping", d: "On orders above ₹999" },
    { icon: BadgeCheck, t: "Easy 15-day returns", d: "Doorstep pickup" },
    { icon: ShieldCheck, t: "Secure payments", d: "UPI · Cards · COD" },
    { icon: Sparkles, t: "Quality checked", d: "Every thread, every piece" },
  ];
  return (
    <section className="border-y border-line bg-bone" aria-label="Why shop DEEPIER">
      <div className="container-x grid grid-cols-2 gap-x-4 gap-y-6 py-10 lg:grid-cols-4">
        {items.map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex items-center gap-3.5">
            <Icon className="h-6 w-6 shrink-0 text-bronze" strokeWidth={1.4} />
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.08em]">{t}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
