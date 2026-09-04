"use client";

import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  cta,
  href,
  light = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  cta?: string;
  href?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10",
        align === "center" && "flex-col items-center text-center"
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <p className={cn("eyebrow reveal", light ? "text-white/50" : "text-muted-foreground")}>{eyebrow}</p>
        )}
        <h2
          className={cn(
            "display-2 reveal mt-2",
            light ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
      </div>
      {cta && href && (
        <Link
          to={href}
          className={cn(
            "reveal group inline-flex items-center gap-2 border-b pb-1 text-[11.5px] font-bold uppercase tracking-[0.2em] transition-colors",
            light ? "border-white/40 text-white hover:border-white" : "border-ink text-ink hover:text-bronze hover:border-bronze"
          )}
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      )}
    </div>
  );
}
