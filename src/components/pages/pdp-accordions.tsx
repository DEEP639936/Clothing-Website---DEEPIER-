"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionRow {
  title: string;
  content: React.ReactNode;
}

export function PDPAccordions({ rows }: { rows: AccordionRow[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line" aria-label="Product information">
      {rows.map((row, i) => {
        const isOpen = open === i;
        return (
          <div key={row.title}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.16em]">{row.title}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink/50 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <div
              className={cn(
                "grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pr-4">{row.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
