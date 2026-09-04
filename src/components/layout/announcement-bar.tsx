"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Link } from "@/lib/router";

const MESSAGES = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "NEW DROP: THE NIGHTBLOOM COLLECTION IS LIVE",
  "USE CODE DEEPER10 FOR 10% OFF YOUR FIRST ORDER",
];

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const strip = [...MESSAGES, ...MESSAGES];
  return (
    <div className="relative z-[60] bg-ink text-bone overflow-hidden" role="region" aria-label="Announcements">
      <div className="flex overflow-hidden py-2" aria-live="off">
        <div className="animate-marquee flex shrink-0 items-center whitespace-nowrap">
          {strip.map((m, i) => (
            <span key={i} className="mx-8 flex items-center gap-8 text-[10.5px] font-semibold uppercase tracking-[0.24em]">
              {m}
              <span className="inline-block h-1 w-1 rounded-full bg-bronze" aria-hidden />
            </span>
          ))}
        </div>
        <div className="animate-marquee flex shrink-0 items-center whitespace-nowrap" aria-hidden>
          {strip.map((m, i) => (
            <span key={i} className="mx-8 flex items-center gap-8 text-[10.5px] font-semibold uppercase tracking-[0.24em]">
              {m}
              <span className="inline-block h-1 w-1 rounded-full bg-bronze" aria-hidden />
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => setOpen(false)}
        aria-label="Close announcements"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-bone/70 transition-colors hover:text-bone"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function AnnouncementMessage() {
  return (
    <span>
      Free shipping on orders above ₹999 · <Link to="/shop/sale" className="underline">Shop Sale</Link>
    </span>
  );
}
