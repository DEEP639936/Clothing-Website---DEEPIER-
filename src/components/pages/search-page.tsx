"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { searchProducts, cn } from "@/lib/utils";
import { products, POPULAR_SEARCHES } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { useRouter } from "@/lib/router";
import { Breadcrumb } from "@/components/breadcrumb";
import { useReveal } from "@/hooks/use-reveal";

export function SearchPage() {
  const { query, navigate } = useRouter();
  const q = query.q ?? "";
  const [input, setInput] = useState(q);
  const results = useMemo(() => (q ? searchProducts(products, q) : []), [q]);
  useReveal([q]);

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="display-2 mt-5">Search.</h1>

      <form
        className="mt-6 flex max-w-2xl items-center gap-3 border-b-2 border-ink pb-3"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/search?q=${encodeURIComponent(input.trim())}`);
        }}
        role="search"
      >
        <Search className="h-5 w-5 text-ink/50" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for products, collections..."
          aria-label="Search"
          className="w-full bg-transparent text-lg font-medium placeholder:text-ink/30 focus:outline-none"
          autoFocus
        />
        {input && (
          <button type="button" aria-label="Clear" onClick={() => setInput("")}>
            <X className="h-4.5 w-4.5 text-ink/40 hover:text-ink" />
          </button>
        )}
      </form>

      {q ? (
        <>
          <p className="mt-6 text-[13.5px] text-muted-foreground" aria-live="polite">
            {results.length} result{results.length === 1 ? "" : "s"} for <strong className="text-ink">&ldquo;{q}&rdquo;</strong>
          </p>
          {results.length === 0 ? (
            <div className="mt-8 border border-dashed border-line bg-white p-14 text-center">
              <p className="text-[15px] font-bold uppercase tracking-[0.1em]">You went a little deeper.</p>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-muted-foreground">
                Nothing matched &ldquo;{q}&rdquo;. Try a broader term — or explore the drops below.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {POPULAR_SEARCHES.slice(0, 5).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setInput(t);
                      navigate(`/search?q=${encodeURIComponent(t)}`);
                    }}
                    className="border border-line bg-bone px-4 py-2 text-[13px] hover:border-ink"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {results.map((p, i) => (
                <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                  <ProductCard product={p} priority={i < 4} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-10">
          <p className="eyebrow text-muted-foreground">Popular right now</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setInput(t);
                  navigate(`/search?q=${encodeURIComponent(t)}`);
                }}
                className="border border-line bg-white px-4 py-2.5 text-[13.5px] transition-colors hover:border-ink"
              >
                {t}
              </button>
            ))}
          </div>
          <p className="eyebrow mt-12 text-muted-foreground">Best sellers</p>
          <div className={cn("mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4")}>
            {products.filter((p) => p.bestSellerRank).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
