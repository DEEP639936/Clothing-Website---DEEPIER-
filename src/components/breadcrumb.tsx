"use client";

import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, light = false, className }: { items: Crumb[]; light?: boolean; className?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `https://deepier.example.com/#${it.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[11.5px] uppercase tracking-[0.14em]", className)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label + i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className={cn("h-3 w-3", light ? "text-white/40" : "text-ink/30")} aria-hidden />}
            {item.href && i < items.length - 1 ? (
              <Link to={item.href} className={cn("transition-colors", light ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-ink")}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("font-semibold", light ? "text-white" : "text-ink")}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
