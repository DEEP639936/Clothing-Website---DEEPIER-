"use client";

import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { products, categories, collections } from "@/lib/data";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { Link, useRouter } from "@/lib/router";
import { cn, formatINR } from "@/lib/utils";
import { useUI, useHydrated } from "@/lib/store";
import { useReveal } from "@/hooks/use-reveal";
import { Breadcrumb } from "@/components/breadcrumb";

export type SortKey = "recommended" | "newest" | "price-asc" | "price-desc" | "best-selling" | "top-rated";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "best-selling", label: "Best Selling" },
  { key: "top-rated", label: "Top Rated" },
];

const ALL_COLORS = Array.from(
  new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values()
);
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CRAFTS = ["Kantha", "Chikankari", "Aari", "Zardozi", "Chain stitch", "Tonal"];
const PRICE_BUCKETS = [
  { label: "Under ₹1,500", min: 0, max: 1500 },
  { label: "₹1,500 – ₹2,500", min: 1500, max: 2500 },
  { label: "₹2,500 – ₹4,000", min: 2500, max: 4000 },
  { label: "₹4,000+", min: 4000, max: 99999 },
];

interface Filters {
  cats: string[];
  sizes: string[];
  colors: string[];
  prices: { min: number; max: number }[];
  colls: string[];
  crafts: string[];
  inStockOnly: boolean;
  minRating: number;
}

const EMPTY: Filters = { cats: [], sizes: [], colors: [], prices: [], colls: [], crafts: [], inStockOnly: false, minRating: 0 };

export interface ShopConfig {
  mode: "all" | "men" | "women" | "new-arrivals" | "best-sellers" | "embroidery" | "sale";
}

function productMatchesCraft(p: Product, craft: string) {
  const e = p.embroidery.toLowerCase();
  switch (craft) {
    case "Kantha": return e.includes("kantha") || e.includes("running stitch");
    case "Chikankari": return e.includes("chikankari") || e.includes("ivory");
    case "Aari": return e.includes("aari");
    case "Zardozi": return e.includes("zardozi") || e.includes("metallic") || e.includes("bronze");
    case "Chain stitch": return e.includes("chain stitch") || e.includes("chain-stitch");
    case "Tonal": return e.includes("tonal");
    default: return false;
  }
}

export function ShopPage({ mode }: ShopConfig) {
  const { query, navigate, pathname } = useRouter();
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const hydrated = useHydrated();
  const { setMobileMenuOpen } = useUI();
  const [filterOpen, setFilterOpen] = useState(false);

  // sync category from query param
  useEffect(() => {
    const cat = query.category;
    if (cat) {
      setFilters((f) => (f.cats.includes(cat) ? f : { ...f, cats: [cat] }));
    } else {
      setFilters((f) => (f.cats.length ? { ...f, cats: [] } : f));
    }
    const coll = query.collection;
    if (coll) {
      setFilters((f) => (f.colls.includes(coll) ? f : { ...f, colls: [coll] }));
    } else {
      setFilters((f) => (f.colls.length ? { ...f, colls: [] } : f));
    }
     
  }, [query.category, query.collection]);

  const basePool = useMemo(() => {
    switch (mode) {
      case "men": return products.filter((p) => p.gender === "men");
      case "women": return products.filter((p) => p.gender === "women");
      case "new-arrivals": return products.filter((p) => p.newArrived || p.badges.includes("NEW"));
      case "best-sellers": return products.filter((p) => p.bestSellerRank);
      case "sale": return products.filter((p) => p.mrp > p.price);
      case "embroidery": return products; // everything is embroidered; curated sort below
      default: return products;
    }
  }, [mode]);

  const filtered = useMemo(() => {
    let list = basePool.filter((p) => {
      if (filters.cats.length && !filters.cats.includes(p.category)) return false;
      if (filters.colls.length && !filters.colls.includes(p.collection.toLowerCase().replace(/\s+/g, "-"))) return false;
      if (filters.sizes.length && !p.sizes.some((s) => s.inStock && filters.sizes.includes(s.label))) return false;
      if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c.name))) return false;
      if (filters.prices.length && !filters.prices.some((r) => p.price >= r.min && p.price < r.max)) return false;
      if (filters.crafts.length && !filters.crafts.some((c) => productMatchesCraft(p, c))) return false;
      if (filters.inStockOnly && p.soldOut) return false;
      if (filters.inStockOnly && !p.sizes.some((s) => s.inStock)) return false;
      if (filters.minRating && p.rating < filters.minRating) return false;
      return true;
    });
    const disc = (p: Product) => (p.mrp - p.price) / p.mrp;
    switch (sort) {
      case "newest": list = [...list].sort((a, b) => Number(!!b.newArrived) - Number(!!a.newArrived)); break;
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "best-selling": list = [...list].sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "top-rated": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "embroidery-mode": break;
      default:
        list = [...list].sort(
          (a, b) => Number(!!b.bestSellerRank) - Number(!!a.bestSellerRank) || Number(!!b.badges.includes("NEW")) - Number(!!a.badges.includes("NEW")) || disc(b) - disc(a)
        );
    }
    return list;
  }, [basePool, filters, sort]);

  useReveal([filtered.length, pathname, mode]);

  const title =
    mode === "men" ? "Shop Men" :
    mode === "women" ? "Shop Women" :
    mode === "new-arrivals" ? "New Arrivals" :
    mode === "best-sellers" ? "Best Sellers" :
    mode === "embroidery" ? "The Embroidery Collection" :
    mode === "sale" ? "Sale" : "Shop All";

  const subtitle =
    mode === "embroidery"
      ? "Thread as identity. Every DEEPIER piece carries heritage stitches reworked for the present."
      : mode === "sale"
        ? "Last-call pieces from past drops. Same craft, softer prices — once gone, gone deeper."
        : mode === "new-arrivals"
          ? "The newest additions to the line — fresh motifs, fresh silhouettes."
          : "Premium fabric, detailed embroidery, contemporary fit. Filter to your depth.";

  const activeChips: { label: string; clear: () => void }[] = [
    ...filters.cats.map((c) => ({ label: categories.find((x) => x.slug === c)?.label ?? c, clear: () => setFilters((f) => ({ ...f, cats: f.cats.filter((x) => x !== c) })) })),
    ...filters.sizes.map((s) => ({ label: `Size ${s}`, clear: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })) })),
    ...filters.colors.map((c) => ({ label: c, clear: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })) })),
    ...filters.prices.map((r, i) => ({ label: PRICE_BUCKETS.find((b) => b.min === r.min && b.max === r.max)?.label ?? `Price ${i}`, clear: () => setFilters((f) => ({ ...f, prices: f.prices.filter((_, x) => x !== i) })) })),
    ...filters.colls.map((c) => ({ label: collections.find((x) => x.slug === c)?.label ?? c, clear: () => setFilters((f) => ({ ...f, colls: f.colls.filter((x) => x !== c) })) })),
    ...filters.crafts.map((c) => ({ label: c, clear: () => setFilters((f) => ({ ...f, crafts: f.crafts.filter((x) => x !== c) })) })),
    ...(filters.inStockOnly ? [{ label: "In stock", clear: () => setFilters((f) => ({ ...f, inStockOnly: false })) }] : []),
    ...(filters.minRating ? [{ label: `${filters.minRating}★ & up`, clear: () => setFilters((f) => ({ ...f, minRating: 0 })) }] : []),
  ];

  const anyActive = activeChips.length > 0;

  const toggle = <K extends keyof Filters>(key: K, value: Filters[K] extends (infer T)[] ? T : never) =>
    setFilters((f) => {
      const arr = f[key] as unknown as string[];
      const has = arr.includes(value as string);
      return { ...f, [key]: has ? arr.filter((x) => x !== value) : [...arr, value as string] } as Filters;
    });

  const FilterPanel = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        <div className="space-y-2.5">
          {categories.map((c) => (
            <CheckRow key={c.slug} label={c.label} count={basePool.filter((p) => p.category === c.slug).length} checked={filters.cats.includes(c.slug)} onChange={() => toggle("cats", c.slug)} />
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle("sizes", s)}
              aria-pressed={filters.sizes.includes(s)}
              className={cn(
                "min-w-11 border px-2.5 py-2 text-[13px] font-semibold transition-colors",
                filters.sizes.includes(s) ? "border-ink bg-ink text-bone" : "border-line hover:border-ink"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Colour">
        <div className="space-y-2.5">
          {ALL_COLORS.map((c) => (
            <label key={c.name} className="flex cursor-pointer items-center gap-3 text-[13.5px]">
              <span
                className={cn("flex h-4.5 w-4.5 items-center justify-center border transition-colors", filters.colors.includes(c.name) ? "border-ink bg-ink" : "border-line bg-white")}
              >
                {filters.colors.includes(c.name) && <Check className="h-3 w-3 text-bone" />}
              </span>
              <input type="checkbox" className="sr-only" checked={filters.colors.includes(c.name)} onChange={() => toggle("colors", c.name)} />
              <span className="h-3.5 w-3.5 rounded-full border border-ink/15" style={{ backgroundColor: c.hex }} aria-hidden />
              {c.name}
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        <div className="space-y-2.5">
          {PRICE_BUCKETS.map((b) => (
            <CheckRow
              key={b.label}
              label={b.label}
              checked={filters.prices.some((r) => r.min === b.min && r.max === b.max)}
              onChange={() =>
                setFilters((f) => ({
                  ...f,
                  prices: f.prices.some((r) => r.min === b.min && r.max === b.max)
                    ? f.prices.filter((r) => !(r.min === b.min && r.max === b.max))
                    : [...f.prices, { min: b.min, max: b.max }],
                }))
              }
            />
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Collection">
        <div className="space-y-2.5">
          {collections.map((c) => (
            <CheckRow key={c.slug} label={c.label} checked={filters.colls.includes(c.slug)} onChange={() => toggle("colls", c.slug)} />
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Embroidery">
        <div className="space-y-2.5">
          {CRAFTS.map((c) => (
            <CheckRow key={c} label={c} checked={filters.crafts.includes(c)} onChange={() => toggle("crafts", c)} />
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Rating">
        <div className="space-y-2.5">
          {[4.5, 4, 0].map((r) => (
            <CheckRow
              key={r}
              label={r === 0 ? "All ratings" : `${r}★ & up`}
              checked={filters.minRating === r}
              onChange={() => setFilters((f) => ({ ...f, minRating: r }))}
            />
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Availability" last>
        <CheckRow label="In stock only" checked={filters.inStockOnly} onChange={() => setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))} />
      </FilterGroup>
    </div>
  );

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(mode !== "all" ? [{ label: "Shop", href: "/shop" }] : []),
          { label: title },
        ]}
      />

      <header className="mt-6 border-b border-line pb-8">
        <h1 className="display-2">{title}</h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">{subtitle}</p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[250px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto dp-scroll pr-2">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[12px] font-bold uppercase tracking-[0.18em]">Filters</p>
              {anyActive && (
                <button onClick={() => setFilters(EMPTY)} className="text-[12px] text-muted-foreground underline underline-offset-4 hover:text-ink">
                  Clear all
                </button>
              )}
            </div>
            {FilterPanel}
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-[13px] text-muted-foreground" aria-live="polite">
              {hydrated ? `${filtered.length} product${filtered.length === 1 ? "" : "s"}` : "Loading…"}
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters {anyActive && `(${activeChips.length})`}
              </button>
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                  className="flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em]"
                >
                  Sort: <span className="font-semibold normal-case tracking-normal text-muted-foreground">{SORTS.find((s) => s.key === sort)?.label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", sortOpen && "rotate-180")} />
                </button>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                    <ul className="absolute right-0 top-full z-20 mt-1 w-56 border border-line bg-white shadow-xl" role="listbox">
                      {SORTS.map((s) => (
                        <li key={s.key}>
                          <button
                            role="option"
                            aria-selected={sort === s.key}
                            onClick={() => {
                              setSort(s.key);
                              setSortOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between px-4 py-3 text-left text-[13.5px] transition-colors hover:bg-secondary",
                              sort === s.key && "font-bold"
                            )}
                          >
                            {s.label}
                            {sort === s.key && <Check className="h-4 w-4" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Active chips */}
          {anyActive && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map((c, i) => (
                <button
                  key={c.label + i}
                  onClick={c.clear}
                  className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:bg-line"
                >
                  {c.label} <X className="h-3 w-3" />
                </button>
              ))}
              <button onClick={() => setFilters(EMPTY)} className="px-2 text-[12.5px] text-muted-foreground underline underline-offset-4 hover:text-ink">
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {hydrated && filtered.length === 0 ? (
            <div className="mt-16 border border-dashed border-line bg-white p-14 text-center">
              <p className="text-[15px] font-bold uppercase tracking-[0.12em]">No pieces match those filters</p>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-muted-foreground">
                Try removing a filter or two — the deeper cuts are worth it.
              </p>
              <button
                onClick={() => setFilters(EMPTY)}
                className="mt-6 bg-ink px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-bone hover:opacity-85"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
                  <ProductCard product={p} priority={i < 3} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          filterOpen ? "" : "pointer-events-none"
        )}
      >
        <div
          className={cn("absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300", filterOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setFilterOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86%] max-w-[360px] flex-col bg-bone transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            filterOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em]">Filters {anyActive && `(${activeChips.length})`}</p>
            <button aria-label="Close filters" onClick={() => setFilterOpen(false)} className="p-2 -mr-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto dp-scroll px-5 py-5">{FilterPanel}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
            <button
              onClick={() => setFilters(EMPTY)}
              className="border border-ink py-3.5 text-[11px] font-bold uppercase tracking-[0.16em]"
            >
              Clear all
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="bg-ink py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-bone"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={cn(!last && "border-b border-line pb-6")}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="mb-3.5 flex w-full items-center justify-between text-[11.5px] font-bold uppercase tracking-[0.18em]">
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function CheckRow({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[13.5px] text-ink/85">
      <span className={cn("flex h-4.5 w-4.5 items-center justify-center border transition-colors", checked ? "border-ink bg-ink" : "border-line bg-white")}>
        {checked && <Check className="h-3 w-3 text-bone" />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="flex-1">{label}</span>
      {typeof count === "number" && <span className="text-[12px] text-muted-foreground">({count})</span>}
    </label>
  );
}
