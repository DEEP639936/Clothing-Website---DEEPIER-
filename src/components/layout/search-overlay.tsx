"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useUI } from "@/lib/store";
import { useRouter, Link } from "@/lib/router";
import { searchProducts, cn } from "@/lib/utils";
import { products, POPULAR_SEARCHES } from "@/lib/data";
import { formatINR } from "@/lib/utils";

const RECENT_KEY = "deepier-recent-searches";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const { navigate } = useRouter();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      setQ("");
      try {
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
      } catch { /* ignore */ }
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = q.trim() ? searchProducts(products, q).slice(0, 6) : [];
  const trending = products.filter((p) => p.bestSellerRank).slice(0, 4);

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const submit = (term?: string) => {
    const t = (term ?? q).trim();
    if (!t) return;
    saveRecent(t);
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(t)}`);
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in" onClick={() => setSearchOpen(false)} />
      <div className="relative bg-bone animate-fade-up">
        <div className="container-x py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-muted-foreground">Search DEEPIER</p>
            <button aria-label="Close search" onClick={() => setSearchOpen(false)} className="p-2 -mr-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form
            className="mt-5 flex items-center gap-4 border-b-2 border-ink pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            role="search"
          >
            <Search className="h-6 w-6 shrink-0 text-ink/60" strokeWidth={1.6} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, collections..."
              className="w-full bg-transparent text-xl sm:text-2xl font-medium placeholder:text-ink/30 focus:outline-none"
              aria-label="Search query"
            />
            <button
              type="submit"
              className="hidden sm:block shrink-0 bg-ink px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-80"
            >
              Search
            </button>
          </form>

          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            {/* Left rail: recent + popular */}
            <div className="lg:col-span-4 space-y-8">
              {recent.length > 0 && (
                <div>
                  <p className="eyebrow mb-4 flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Recent searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => submit(r)}
                        className="border border-line bg-white px-3.5 py-2 text-[13px] text-ink/80 transition-colors hover:border-ink hover:text-ink"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="eyebrow mb-4 flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" /> Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((r) => (
                    <button
                      key={r}
                      onClick={() => submit(r)}
                      className="border border-line bg-white px-3.5 py-2 text-[13px] text-ink/80 transition-colors hover:border-ink hover:text-ink"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results / trending */}
            <div className="lg:col-span-8">
              {q.trim() ? (
                <div>
                  <p className="eyebrow mb-4 text-muted-foreground">
                    {results.length > 0 ? `${results.length} result${results.length > 1 ? "s" : ""} for "${q}"` : `No results for "${q}"`}
                  </p>
                  {results.length === 0 ? (
                    <div className="border border-dashed border-line bg-white p-8 text-center">
                      <p className="text-[15px] font-semibold">Nothing matched &ldquo;{q}&rdquo;.</p>
                      <p className="mt-1 text-[13.5px] text-muted-foreground">Try &ldquo;hoodie&rdquo;, &ldquo;oversized&rdquo; or browse the sale.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-line border-y border-line">
                      {results.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/product/${p.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="group flex items-center gap-4 py-3.5"
                          >
                            <div className="h-16 w-14 shrink-0 overflow-hidden bg-secondary">
                              { }
                              <img src={p.images[0].src} alt="" loading="lazy" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14.5px] font-semibold group-hover:underline">{p.name}</p>
                              <p className="text-[12px] uppercase tracking-wider text-muted-foreground">{p.gender} · {p.category.replace(/-/g, " ")}</p>
                            </div>
                            <p className="text-[14px] font-semibold">{formatINR(p.price)}</p>
                            <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div>
                  <p className="eyebrow mb-4 text-muted-foreground">Trending products</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {trending.map((p) => (
                      <Link key={p.id} to={`/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="group">
                        <div className="aspect-[3/4] overflow-hidden bg-secondary">
                          { }
                          <img
                            src={p.images[0].src}
                            alt={p.name}
                            loading="lazy"
                            className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-105")}
                          />
                        </div>
                        <p className="mt-2 truncate text-[13px] font-semibold">{p.name}</p>
                        <p className="text-[12.5px] text-muted-foreground">{formatINR(p.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
