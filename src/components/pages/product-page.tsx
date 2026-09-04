"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Star, Truck, RotateCcw, ShieldCheck, Sparkles, Share2, Check, Minus, Plus, MapPin, Package } from "lucide-react";
import { getProduct, products } from "@/lib/data";
import { Link, useRouter } from "@/lib/router";
import { useCart, useWishlist, useRecent, useHydrated } from "@/lib/store";
import { cn, formatINR, discountPct, relatedProducts } from "@/lib/utils";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductGallery } from "@/components/product/product-gallery";
import { SizeGuideModal } from "@/components/product/size-guide";
import { ProductCard } from "@/components/product/product-card";
import { useToast } from "@/hooks/use-toast";
import { useReveal } from "@/hooks/use-reveal";
import type { AccordionRow } from "./pdp-accordions";
import { PDPAccordions } from "./pdp-accordions";

export function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const [size, setSize] = useState<string | null>(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<null | { ok: boolean; msg: string }>(null);
  const [adding, setAdding] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(true);

  const { addItem, setOpen } = useCart();
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => (product ? s.ids.includes(product.id) : false));
  const pushRecent = useRecent((s) => s.push);
  const hydrated = useHydrated();
  const { toast } = useToast();
  const { navigate } = useRouter();

  useEffect(() => {
    if (product) pushRecent(product.slug);
     
  }, [slug]);

  useEffect(() => {
    setSize(null);
    setColorIdx(0);
    setQty(1);
    setSizeError(false);
    setPinResult(null);
    setPin("");
    window.scrollTo({ top: 0 });
  }, [slug]);

  useReveal([slug]);

  const recs = useMemo(
    () => (product ? relatedProducts(products, product, 4) : []),
    [product]
  );

  if (!product) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="display-2">Piece not found.</h1>
        <p className="mt-4 text-muted-foreground">This garment may have sold out or moved.</p>
        <Link to="/shop" className="mt-8 inline-block bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone">
          Back to shop
        </Link>
      </div>
    );
  }

  const disc = discountPct(product.price, product.mrp);
  const selectedSize = product.sizes.find((s) => s.label === size);

  const ensureSize = (): boolean => {
    if (!size) {
      setSizeError(true);
      setSizeOpen(true);
      toast({ title: "Please select a size first" });
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleAdd = (buyNow = false) => {
    if (!ensureSize()) return;
    setAdding(true);
    setTimeout(() => {
      addItem({ productId: product.id, size: size!, color: product.colors[colorIdx].name, qty });
      setAdding(false);
      if (buyNow) {
        setOpen(false);
        navigate("/checkout");
      }
    }, 450);
  };

  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) {
      setPinResult({ ok: false, msg: "Enter a valid 6-digit PIN code." });
      return;
    }
    const metro = ["11", "40", "56", "60", "70", "50", "38", "41"].some((p) => pin.startsWith(p));
    setPinResult({
      ok: true,
      msg: metro
        ? `Delivery by ${new Date(Date.now() + 2 * 864e5).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · COD available · Free shipping`
        : `Delivery by ${new Date(Date.now() + 5 * 864e5).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · COD available · Free shipping`,
    });
  };

  const rows: AccordionRow[] = [
    { title: "Description", content: <p className="text-[14px] leading-relaxed text-ink/75">{product.description}</p> },
    {
      title: "Fabric & Material",
      content: (
        <div className="space-y-2 text-[14px] leading-relaxed text-ink/75">
          <p>{product.fabric}.</p>
          <p>Pre-shrunk and tested for colour fastness. Breathable, bio-washed, and finished with a softenening enzyme wash for day-one comfort.</p>
        </div>
      ),
    },
    {
      title: "Embroidery Details",
      content: (
        <div className="space-y-2 text-[14px] leading-relaxed text-ink/75">
          <p>{product.embroidery}.</p>
          <p>Digitised in-studio, stitched at 750 stitches per minute, and heat-finished so threads sit flush against the fabric. Survives 30+ domestic washes.</p>
        </div>
      ),
    },
    {
      title: "Fit & Size",
      content: (
        <div className="space-y-2 text-[14px] leading-relaxed text-ink/75">
          <p><strong>{product.fit} fit</strong> — the model is 5&prime;11&Prime; / 180 cm wearing size M.</p>
          <p>{product.fit === "Oversized" ? "Cut 4–6\u2033 roomier through the chest and body. Size down for a regular silhouette." : product.fit === "Relaxed" ? "Easy through the body with a slight taper. True to size." : "True to size with a modern, clean shoulder."}</p>
        </div>
      ),
    },
    {
      title: "Care Instructions",
      content: (
        <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink/75">
          {product.care.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Shipping",
      content: (
        <p className="text-[14px] leading-relaxed text-ink/75">
          Dispatched within 24 hours. Metro delivery in 2–4 days, rest of India 4–7 days. Free shipping over ₹999, flat ₹79 below. International shipping to select countries.
        </p>
      ),
    },
    {
      title: "Returns & Exchanges",
      content: (
        <p className="text-[14px] leading-relaxed text-ink/75">
          15-day easy returns and free size exchanges. Raise a request from My Orders — doorstep pickup, refund in 5–7 working days after pickup.
        </p>
      ),
    },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => `https://deepier.example.com${i.src}`),
    brand: { "@type": "Brand", name: "DEEPIER" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.sizes.some((s) => s.inStock) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="container-x pt-8 sm:pt-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: product.gender === "men" ? "Men" : "Women", href: `/shop/${product.gender}` },
            { label: product.category.replace(/-/g, " "), href: `/shop/${product.gender}?category=${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-x mt-6 grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="reveal is-visible">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-3">
            <Link to={`/shop/embroidery?collection=${product.collection.toLowerCase().replace(/\s+/g, "-")}`} className="eyebrow text-bronze hover:underline">
              {product.collection}
            </Link>
            {product.badges.includes("LIMITED") && (
              <span className="bg-bronze px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white">Limited</span>
            )}
          </div>
          <h1 className="mt-2 text-[26px] font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">{product.shortDescription}</p>

          <a href="#reviews" className="mt-3 inline-flex items-center gap-2">
            <span className="flex items-center gap-1 bg-secondary px-2 py-1 text-[12px] font-semibold">
              <Star className="h-3.5 w-3.5 fill-ink text-ink" /> {product.rating}
            </span>
            <span className="text-[12.5px] text-muted-foreground underline underline-offset-4">{product.reviewCount} reviews</span>
          </a>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-[26px] font-extrabold">{formatINR(product.price)}</p>
            {disc > 0 && (
              <>
                <p className="text-[16px] text-muted-foreground line-through">{formatINR(product.mrp)}</p>
                <p className="rounded bg-sale/10 px-2 py-1 text-[13px] font-bold text-sale">{disc}% off</p>
              </>
            )}
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">MRP inclusive of all taxes</p>

          {/* Colour */}
          <div className="mt-7">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.16em]">
              Colour — <span className="text-muted-foreground">{product.colors[colorIdx].name}</span>
            </p>
            <div className="mt-2.5 flex gap-2.5">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  aria-label={`Colour ${c.name}`}
                  aria-pressed={i === colorIdx}
                  onClick={() => setColorIdx(i)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 p-0.5 transition-colors",
                    i === colorIdx ? "border-ink" : "border-transparent hover:border-line"
                  )}
                >
                  <span className="h-full w-full rounded-full border border-ink/10" style={{ backgroundColor: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div id="size-selector" className="mt-7 scroll-mt-28">
            <div className="flex items-center justify-between">
              <p className={cn("text-[11.5px] font-bold uppercase tracking-[0.16em]", sizeError && "text-sale")}>
                {sizeError ? "Select a size to continue" : "Select size"}
                {selectedSize?.inStock === false && <span className="ml-2 normal-case text-muted-foreground">(out of stock)</span>}
              </p>
              <button onClick={() => setSizeGuideOpen(true)} className="text-[11.5px] font-semibold underline underline-offset-4 text-muted-foreground hover:text-ink">
                Size guide
              </button>
            </div>
            <div className={cn("mt-3", sizeOpen || "hidden")}>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    disabled={!s.inStock}
                    aria-pressed={size === s.label}
                    onClick={() => {
                      setSize(s.label);
                      setSizeError(false);
                    }}
                    className={cn(
                      "relative min-w-12 border px-3 py-2.5 text-[13.5px] font-semibold transition-colors",
                      size === s.label
                        ? "border-ink bg-ink text-bone"
                        : s.inStock
                          ? "border-line hover:border-ink"
                          : "cursor-not-allowed border-line/60 text-ink/25"
                    )}
                  >
                    {s.label}
                    {!s.inStock && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="h-px w-full rotate-[-24deg] bg-ink/20" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {product.lowStock && (
                <p className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-sale">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sale" /> Selling fast — only a few pieces left
                </p>
              )}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="mt-7 flex items-stretch gap-3">
            <div className="flex items-center border border-line">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-full w-11 items-center justify-center hover:bg-secondary">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-[15px] font-bold" aria-live="polite">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="flex h-full w-11 items-center justify-center hover:bg-secondary">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => handleAdd(false)}
              disabled={adding}
              className="flex-1 bg-ink py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone transition-all hover:opacity-85 active:scale-[0.99] disabled:opacity-60"
            >
              {adding ? <span className="inline-flex items-center gap-2"><Package className="h-4 w-4 animate-bounce" /> Adding…</span> : "Add to bag"}
            </button>
          </div>
          <button
            onClick={() => handleAdd(true)}
            disabled={adding}
            className="mt-2.5 w-full border-2 border-ink py-4 text-[12px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone disabled:opacity-60"
          >
            Buy it now
          </button>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                const added = toggleWish(product.id);
                toast({ title: added ? "Added to wishlist" : "Removed from wishlist", description: product.name });
              }}
              className="flex flex-1 items-center justify-center gap-2 border border-line py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-ink"
            >
              <Heart className={cn("h-4 w-4", wished && "fill-sale text-sale")} /> {wished ? "Wishlisted" : "Wishlist"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`${window.location.origin}/#/product/${product.slug}`).catch(() => {});
                toast({ title: "Link copied to clipboard" });
              }}
              className="flex flex-1 items-center justify-center gap-2 border border-line py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-ink"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {/* Delivery check */}
          <div className="mt-6 border border-line bg-white p-4">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.16em]">Check delivery</p>
            <div className="mt-2.5 flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setPinResult(null);
                  }}
                  placeholder="Enter PIN code"
                  inputMode="numeric"
                  aria-label="PIN code"
                  className="w-full border border-line bg-bone py-3 pl-9 pr-3 text-[14px] focus:border-ink focus:outline-none"
                />
              </div>
              <button onClick={checkPin} className="bg-ink px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-bone hover:opacity-85">
                Check
              </button>
            </div>
            {pinResult && (
              <p className={cn("mt-2.5 flex items-start gap-1.5 text-[13px]", pinResult.ok ? "text-bronze" : "text-sale")} aria-live="polite">
                {pinResult.ok && <Check className="mt-0.5 h-4 w-4 shrink-0" />} {pinResult.msg}
              </p>
            )}
          </div>

          {/* Trust row */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Truck, t: "Free ship ₹999+" },
              { icon: RotateCcw, t: "15-day returns" },
              { icon: ShieldCheck, t: "Secure payment" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="border border-line py-3">
                <Icon className="mx-auto h-4.5 w-4.5 text-bronze" strokeWidth={1.5} />
                <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink/70">{t}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <PDPAccordions rows={rows} />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <section className="border-t border-line bg-white py-16" aria-label="You may also like">
        <div className="container-x">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="display-3">You may also like</h2>
            <Link to="/shop" className="hidden text-[11.5px] font-bold uppercase tracking-[0.18em] underline underline-offset-4 sm:block">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            {recs.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      {hydrated && <RecentlyViewed current={product.slug} />}

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+56px)] z-40 border-t border-line bg-bone/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold">{product.name}</p>
            <p className="text-[13px] font-bold">{formatINR(product.price)}</p>
          </div>
          <button
            onClick={() => handleAdd(false)}
            className="shrink-0 bg-ink px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-bone active:scale-[0.98]"
          >
            {size ? `Add · ${size}` : "Select size"}
          </button>
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}

function RecentlyViewed({ current }: { current: string }) {
  const slugs = useRecent((s) => s.slugs).filter((s) => s !== current).slice(0, 4);
  const items = slugs.map((s) => getProduct(s)).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <section className="container-x py-16" aria-label="Recently viewed">
      <h2 className="display-3 mb-8">Recently viewed</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p!.id} product={p!} />
        ))}
      </div>
    </section>
  );
}
