"use client";

import { useState } from "react";
import { Instagram, Facebook, Youtube, Dribbble, ArrowRight, Check } from "lucide-react";
import { Link } from "@/lib/router";
import { useToast } from "@/hooks/use-toast";

const COLS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Men", to: "/shop/men" },
      { label: "Women", to: "/shop/women" },
      { label: "New Arrivals", to: "/shop/new-arrivals" },
      { label: "Best Sellers", to: "/shop/best-sellers" },
      { label: "Embroidery", to: "/shop/embroidery" },
      { label: "Sale", to: "/shop/sale" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "FAQ", to: "/faq" },
      { label: "Shipping & Delivery", to: "/shipping" },
      { label: "Returns & Refunds", to: "/returns" },
      { label: "Size Guide", to: "/size-guide" },
      { label: "Track Order", to: "/track" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Our Craft", to: "/craft" },
      { label: "Journal", to: "/journal" },
      { label: "Careers", to: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Refund Policy", to: "/returns" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Youtube },
  { label: "Pinterest", icon: Dribbble },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Please enter a valid email address" });
      return;
    }
    setDone(true);
    toast({ title: "Welcome to the deeper side", description: "You're on the list for drops and stories." });
  };

  return (
    <footer className="mt-auto bg-ink text-bone" role="contentinfo">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-x grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="display-2 text-white">Get deeper.</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
              Join the DEEPIER community for new drops, exclusive releases and stories from the studio. No noise — only thread.
            </p>
          </div>
          <form onSubmit={subscribe} className="lg:justify-self-end w-full max-w-md" aria-label="Newsletter signup">
            <div className="flex border-b-2 border-white/40 pb-3 transition-colors focus-within:border-white">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                aria-label="Email address"
                className="w-full bg-transparent text-[14px] font-semibold uppercase tracking-[0.14em] text-white placeholder:text-white/35 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-bone text-ink transition-colors hover:bg-bronze hover:text-white"
              >
                {done ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-3 text-[12px] text-white/40">
              By subscribing you agree to our Privacy Policy and consent to receive updates.
            </p>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="text-xl font-extrabold uppercase tracking-[0.18em] text-white">
            Deep<span className="relative">i<span className="absolute -bottom-[0.28em] left-1/2 -translate-x-1/2 block h-[2px] w-[70%] bg-bronze" aria-hidden /></span>er
          </p>
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/50">
            Premium clothing where embroidery becomes the identity. Crafted in India, worn everywhere.
          </p>
          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href={`https://${label.toLowerCase()}.com/deepier`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`DEEPIER on ${label}`}
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-all hover:border-bone hover:text-bone"
              >
                <Icon className="h-4 w-4" strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label + l.to}>
                  <Link to={l.to} className="text-[14px] text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-[12px] text-white/40">© 2026 DEEPIER Studios Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            {["UPI", "VISA", "Mastercard", "RuPay", "COD"].map((p) => (
              <span
                key={p}
                className="border border-white/15 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-white/50"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
