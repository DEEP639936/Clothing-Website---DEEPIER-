"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, ChevronDown, Search, ArrowRight, Home as HomeIcon, FileText, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/router";
import { Breadcrumb } from "@/components/breadcrumb";
import { faqs, INDIAN_STATES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useReveal } from "@/hooks/use-reveal";

function PageHero({ title, sub, crumb }: { title: string; sub: string; crumb: string }) {
  return (
    <div className="border-b border-line bg-white">
      <div className="container-x py-12 sm:py-16">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: crumb }]} />
        <h1 className="display-2 mt-5">{title}</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-dp max-w-2xl">{children}</div>;
}

/* ================================ FAQ ================================= */

export function FAQPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())
  );
  useReveal();
  return (
    <>
      <PageHero title="Questions, answered." sub="Everything about shipping, sizing, returns and the craft itself. Can't find it? We're one message away." crumb="FAQ" />
      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
            <Search className="h-5 w-5 text-ink/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search FAQs"
              className="w-full bg-transparent text-[15.5px] placeholder:text-ink/30 focus:outline-none"
            />
            {q && <button onClick={() => setQ("")} aria-label="Clear"><ChevronDown className="hidden" /><span className="text-[12px] underline">Clear</span></button>}
          </div>

          <div className="mt-8 divide-y divide-line border-y border-line">
            {filtered.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-bold">{f.q}</span>
                    <ChevronDown className={cn("h-5 w-5 shrink-0 text-ink/50 transition-transform duration-300", isOpen && "rotate-180")} />
                  </button>
                  <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-10 text-[14.5px] leading-relaxed text-ink/70">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-[14px] text-muted-foreground">No answers matched &ldquo;{q}&rdquo; — try different words or write to us below.</p>
            )}
          </div>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          {[
            { icon: Truck, t: "Shipping & Delivery", d: "Timelines, charges, tracking", to: "/shipping" },
            { icon: RotateCcw, t: "Returns & Refunds", d: "15-day easy returns", to: "/returns" },
            { icon: ShieldCheck, t: "Privacy & Terms", d: "The fine print, in plain words", to: "/privacy" },
          ].map(({ icon: Icon, t, d, to }) => (
            <Link key={to} to={to} className="group flex items-center gap-4 border border-line bg-white p-5 transition-colors hover:border-ink">
              <Icon className="h-5 w-5 shrink-0 text-bronze" strokeWidth={1.6} />
              <span className="flex-1">
                <span className="block text-[13.5px] font-bold">{t}</span>
                <span className="text-[12px] text-muted-foreground">{d}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
          <div className="border border-ink bg-ink p-6 text-bone">
            <MessageCircle className="h-5 w-5 text-bronze" />
            <p className="mt-3 text-[14px] font-bold uppercase tracking-wide">Still stuck?</p>
            <p className="mt-1.5 text-[13px] text-white/65">Our team replies within a few hours, Mon–Sat.</p>
            <Link to="/contact" className="mt-4 inline-flex items-center gap-2 border-b border-bronze pb-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-bronze">
              Contact us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ============================== CONTACT =============================== */

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", order: "", topic: "Order support", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.message.trim().length < 10) errs.message = "Tell us a little more";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent(true);
    toast({ title: "Message sent", description: "We'll get back within a few hours (Mon–Sat)." });
  };

  return (
    <>
      <PageHero title="Talk to a human." sub="Order help, size advice, bulk gifting or just to talk stitches — write to us. Real people, Mon–Sat, 10am–7pm IST." crumb="Contact" />
      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_380px]">
        {sent ? (
          <div className="flex h-fit flex-col items-center border border-line bg-white px-8 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink">
              <Mail className="h-7 w-7 text-bone" />
            </span>
            <h2 className="mt-6 text-lg font-extrabold uppercase tracking-[0.08em]">Message received.</h2>
            <p className="mt-2 max-w-sm text-[14px] text-muted-foreground">
              Thanks {form.name.split(" ")[0]} — your note is in the studio queue. Expect a reply within a few working hours.
            </p>
            <Link to="/shop" className="mt-8 bg-ink px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-bone">Back to shop</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="max-w-xl space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <CField label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
              <CField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CField label="Order number (optional)" value={form.order} onChange={(v) => setForm({ ...form, order: v })} placeholder="DP…" />
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Topic</label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="mt-1.5 w-full border border-line bg-white px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none"
                >
                  {["Order support", "Sizing help", "Returns & exchange", "Product question", "Bulk / gifting", "Something else"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                aria-invalid={!!errors.message}
                className={cn("mt-1.5 w-full border bg-white px-3.5 py-3 text-[14px] focus:outline-none", errors.message ? "border-sale" : "border-line focus:border-ink")}
                placeholder="How can we help?"
              />
              {errors.message && <p className="mt-1.5 text-[12px] text-sale">{errors.message}</p>}
            </div>
            <button type="submit" className="flex items-center gap-2 bg-ink px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85">
              Send message <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          {[
            { icon: Mail, t: "Email", d: "care@deepier.com", sub: "Replies within 4 working hours" },
            { icon: Phone, t: "Phone", d: "+91 98200 00000", sub: "Mon–Sat, 10am–7pm IST" },
            { icon: MapPin, t: "Studio", d: "DEEPIER Studios, Unit 14, plot the thread lane, Mumbai 400001", sub: "Visits by appointment" },
          ].map(({ icon: Icon, t, d, sub }) => (
            <div key={t} className="flex gap-4 border border-line bg-white p-5">
              <Icon className="h-5 w-5 shrink-0 text-bronze" strokeWidth={1.6} />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t}</p>
                <p className="mt-1 text-[14px] font-semibold">{d}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
          <div className="bg-secondary p-6">
            <p className="text-[13px] font-bold uppercase tracking-wide">Order already placed?</p>
            <p className="mt-1.5 text-[13px] text-ink/65">Track it in real time — no login needed.</p>
            <Link to="/track" className="mt-3 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[11px] font-bold uppercase tracking-[0.18em]">
              Track order <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function CField({ label, value, onChange, error, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={cn("mt-1.5 w-full border bg-white px-3.5 py-3 text-[14px] focus:outline-none", error ? "border-sale" : "border-line focus:border-ink")}
      />
      {error && <p className="mt-1.5 text-[12px] text-sale">{error}</p>}
    </div>
  );
}

/* ============================== SHIPPING ============================== */

export function ShippingPage() {
  useReveal();
  return (
    <>
      <PageHero title="Shipping & Delivery." sub="Fast dispatch, honest timelines, real tracking. Here is exactly how your order reaches you." crumb="Shipping" />
      <div className="container-x max-w-3xl py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { t: "24 hours", d: "Dispatch time for every in-stock order" },
            { t: "2–4 days", d: "Metro delivery after dispatch" },
            { t: "₹999+", d: "Orders shipping free, India-wide" },
          ].map((s) => (
            <div key={s.t} className="reveal border border-line bg-white p-6 text-center">
              <p className="text-2xl font-extrabold">{s.t}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        <Prose>
          <h2 className="mt-14 text-[15px] font-extrabold uppercase tracking-[0.1em]">Delivery timelines</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            Every order is picked, quality-checked and pressed before it leaves the studio — which is why we dispatch within
            24 hours rather than instantly. Metro cities (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune)
            typically receive orders in 2–4 business days. The rest of India takes 4–7 business days. International orders
            to the UAE, Singapore, UK and USA take 7–12 business days with full tracking.
          </p>
          <h2 className="mt-10 text-[15px] font-extrabold uppercase tracking-[0.1em]">Shipping charges</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            Orders above ₹999 ship free — always, anywhere in India. Below that, a flat ₹79 covers packaging, freight and
            insurance. Express delivery is available at checkout for ₹149 and arrives in roughly half the standard time.
            There are no hidden handling fees; the number you see at checkout is the number you pay.
          </p>
          <h2 className="mt-10 text-[15px] font-extrabold uppercase tracking-[0.1em]">Tracking your order</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            The moment your parcel leaves the studio you will receive a tracking link by SMS, email and WhatsApp. You can
            also track anytime from <Link to="/track" className="font-semibold text-ink underline underline-offset-4">Track Order</Link> using
            your order number — no login required. Tracking updates at every milestone: packed, shipped, out for delivery, delivered.
          </p>
          <h2 className="mt-10 text-[15px] font-extrabold uppercase tracking-[0.1em]">Packaging</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            Orders arrive in a keepsake box with embroidered swing tags and stamped tissue — designed to be kept, not
            discarded. Gift notes can be added free at checkout.
          </p>
        </Prose>
      </div>
    </>
  );
}

/* =============================== RETURNS ============================== */

export function ReturnsPage() {
  useReveal();
  return (
    <>
      <PageHero title="Returns & Refunds." sub="15 days. No interrogations. If a piece isn't right, it comes back — here's exactly how it works." crumb="Returns" />
      <div className="container-x max-w-3xl py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { t: "15 days", d: "Return window from delivery" },
            { t: "Free", d: "Doorstep pickup, India-wide" },
            { t: "5–7 days", d: "Refund after pickup" },
          ].map((s) => (
            <div key={s.t} className="reveal border border-line bg-white p-6 text-center">
              <p className="text-2xl font-extrabold">{s.t}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        <Prose>
          <h2 className="mt-14 text-[15px] font-extrabold uppercase tracking-[0.1em]">The short version</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            You have 15 days from delivery to raise a return or exchange for any unworn, unwashed piece with its tags and
            packaging intact. Raise it from <strong>My Account → Orders</strong> or the contact page, choose a pickup slot,
            and our courier partner collects from your doorstep free of charge. That is the entire process.
          </p>
          <h2 className="mt-10 text-[15px] font-extrabold uppercase tracking-[0.1em]">Exchanges</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            Need a different size? Exchanges are free and your preferred size is reserved the moment you raise the request,
            so it cannot sell out while the pickup happens. Once the original piece is collected, the replacement ships
            within 24 hours.
          </p>
          <h2 className="mt-10 text-[15px] font-extrabold uppercase tracking-[0.1em]">Refund timelines</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            Refunds are initiated within 24 hours of pickup quality-check. UPI and wallet refunds land in 1–2 business
            days; card and net-banking refunds take 5–7 business days depending on your bank. Cash-on-delivery orders are
            refunded to your bank account or as store credit — your choice. Shipping fees are refunded when the return is
            due to a defect or our error.
          </p>
          <h2 className="mt-10 text-[15px] font-extrabold uppercase tracking-[0.1em]">Exceptions</h2>
          <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">
            For hygiene reasons, innerwear and final-sale items marked &ldquo;FINAL&rdquo; at checkout cannot be returned
            or exchanged. Damaged or wrong items are always replaced free — just photograph the issue within 48 hours of
            delivery and write to care@deepier.com.
          </p>
        </Prose>
      </div>
    </>
  );
}

/* =============================== PRIVACY ============================== */

export function PrivacyPage() {
  useReveal();
  const sections: { h: string; ps: string[] }[] = [
    {
      h: "What we collect",
      ps: [
        "We collect only what a premium shopping experience requires: your name, contact details, delivery addresses, order history, and the preferences you choose to save — wishlist items, sizes, and notification settings.",
        "Payment details are processed by PCI-DSS compliant gateways and are never stored on DEEPIER servers. We see only the last four digits of your card and the payment status.",
        "With your permission, we collect basic analytics — pages visited, products viewed — to improve the store. This data is aggregated and never sold, rented, or shared with advertisers.",
      ],
    },
    {
      h: "How we use it",
      ps: [
        "Your contact details are used to fulfil orders: confirmations, dispatch updates, delivery coordination and returns. Marketing emails are sent only if you subscribe, and every email carries a one-click unsubscribe.",
        "Saved preferences (sizes, wishlist, addresses) exist to make your next visit faster. You can view, edit, or delete all of them from My Account at any time.",
      ],
    },
    {
      h: "What we never do",
      ps: [
        "We never sell your personal data. We never share it with third parties beyond the processors required to run the store — payment gateways, courier partners, and SMS/email providers — each bound by their own confidentiality obligations.",
        "We never store payment credentials, CVV numbers, or UPI PINs under any circumstances.",
      ],
    },
    {
      h: "Your rights",
      ps: [
        "You may request a copy of your data, correct it, or ask us to delete it entirely by writing to privacy@deepier.com. We respond within 7 working days.",
        "Cookies are limited to session management, cart persistence, and — with consent — analytics. You can clear or block cookies in your browser; the store will continue to work, though your bag may not persist between visits.",
      ],
    },
  ];
  return (
    <>
      <PageHero title="Privacy Policy." sub="The plain-words version: we collect the minimum, protect it properly, and never sell it." crumb="Privacy" />
      <div className="container-x max-w-3xl py-12">
        <p className="text-[12.5px] text-muted-foreground">Last updated: 1 August 2026</p>
        {sections.map((s) => (
          <section key={s.h} className="reveal mt-12">
            <h2 className="text-[15px] font-extrabold uppercase tracking-[0.1em]">{s.h}</h2>
            {s.ps.map((p) => (
              <p key={p.slice(0, 20)} className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}

/* ================================ TERMS =============================== */

export function TermsPage() {
  useReveal();
  const sections: { h: string; ps: string[] }[] = [
    {
      h: "The agreement",
      ps: [
        "By using deepier.com you agree to these terms. They exist to protect both sides: you get the product described, at the price shown, with the service promised. We get a store that stays fair and functional for everyone.",
        "DEEPIER is operated by DEEPIER Studios Pvt. Ltd., Mumbai, India. References to \u201cwe\u201d, \u201cus\u201d and \u201cour\u201d mean the company and this website.",
      ],
    },
    {
      h: "Products & pricing",
      ps: [
        "We photograph and describe every piece as accurately as modern screens allow; slight colour variation between screens is inevitable and not a defect. Prices are in Indian Rupees, inclusive of applicable taxes.",
        "Garment measurements carry a standard tolerance of ±0.5 inches. Embroidery placement may vary by a few millimetres — this is a characteristic of craft production, not a flaw.",
      ],
    },
    {
      h: "Orders & cancellation",
      ps: [
        "Orders can be cancelled free of charge within 12 hours of placement, or any time before dispatch, by writing to care@deepier.com with your order number. After dispatch, the standard return process applies on delivery.",
        "We may cancel an order if an item becomes unavailable or an address is undeliverable; in that case any payment is refunded in full within 5–7 business days.",
      ],
    },
    {
      h: "Accounts & conduct",
      ps: [
        "You are responsible for keeping your account credentials confidential and for activity under your account. Impersonation, fraudulent returns, and abuse of promotional codes may lead to account suspension.",
        "Content on this site — photography, copy, motifs, and the DEEPIER marks — belongs to DEEPIER Studios and may not be reproduced commercially without written permission.",
      ],
    },
    {
      h: "Liability & law",
      ps: [
        "Our liability for any claim relating to a purchase is limited to the amount paid for the item in question. Nothing in these terms limits your statutory consumer rights under Indian law.",
        "These terms are governed by the laws of India; courts of Mumbai have exclusive jurisdiction. Questions about these terms can be sent to legal@deepier.com.",
      ],
    },
  ];
  return (
    <>
      <PageHero title="Terms & Conditions." sub="Fair terms, written to be read. The essentials of shopping with DEEPIER." crumb="Terms" />
      <div className="container-x max-w-3xl py-12">
        <p className="text-[12.5px] text-muted-foreground">Last updated: 1 August 2026</p>
        {sections.map((s) => (
          <section key={s.h} className="reveal mt-12">
            <h2 className="text-[15px] font-extrabold uppercase tracking-[0.1em]">{s.h}</h2>
            {s.ps.map((p) => (
              <p key={p.slice(0, 20)} className="mt-4 text-[14.5px] leading-[1.85] text-ink/75">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}

/* ============================= SIZE GUIDE PAGE ========================= */

const GUIDE_ROWS = [
  { size: "XS", chest: 34, shoulder: 15.5, length: 26, sleeve: 7.5 },
  { size: "S", chest: 36, shoulder: 16.5, length: 27, sleeve: 7.75 },
  { size: "M", chest: 38, shoulder: 17.5, length: 28, sleeve: 8 },
  { size: "L", chest: 40, shoulder: 18.5, length: 29, sleeve: 8.25 },
  { size: "XL", chest: 42, shoulder: 19.5, length: 30, sleeve: 8.5 },
  { size: "XXL", chest: 44, shoulder: 20.5, length: 31, sleeve: 8.75 },
];

export function SizeGuidePage() {
  const [chest, setChest] = useState("");
  const rec = (() => {
    const c = parseFloat(chest);
    if (!c || c < 28 || c > 52) return null;
    if (c <= 34) return "XS";
    if (c <= 36) return "S";
    if (c <= 38) return "M";
    if (c <= 40.5) return "L";
    if (c <= 42.5) return "XL";
    return "XXL";
  })();
  useReveal();
  return (
    <>
      <PageHero title="Size Guide." sub="Garment measurements in inches, measured flat. Tolerance ±0.5″. When between sizes: up for drape, down for structure." crumb="Size Guide" />
      <div className="container-x max-w-3xl py-12">
        <div className="overflow-x-auto reveal">
          <table className="w-full min-w-[520px] border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-3.5 pr-4 font-bold uppercase tracking-wider">Size</th>
                <th className="py-3.5 pr-4 font-bold uppercase tracking-wider">Chest</th>
                <th className="py-3.5 pr-4 font-bold uppercase tracking-wider">Shoulder</th>
                <th className="py-3.5 pr-4 font-bold uppercase tracking-wider">Length</th>
                <th className="py-3.5 font-bold uppercase tracking-wider">Sleeve</th>
              </tr>
            </thead>
            <tbody>
              {GUIDE_ROWS.map((r) => (
                <tr key={r.size} className={cn("border-b border-line", rec === r.size && "bg-secondary font-semibold")}>
                  <td className="py-3.5 pr-4 font-bold">{r.size}</td>
                  <td className="py-3.5 pr-4">{r.chest}″</td>
                  <td className="py-3.5 pr-4">{r.shoulder}″</td>
                  <td className="py-3.5 pr-4">{r.length}″</td>
                  <td className="py-3.5">{r.sleeve}″</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 border border-line bg-white p-6">
          <h2 className="text-[13px] font-extrabold uppercase tracking-[0.16em]">Not sure about your size?</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">
            Measure your chest at the fullest point (keep the tape level, breathe normally) and we&rsquo;ll recommend a size.
            Oversized styles already include 4–6″ of ease.
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Your chest (inches)</label>
              <input
                value={chest}
                onChange={(e) => setChest(e.target.value.replace(/[^\d.]/g, "").slice(0, 4))}
                inputMode="decimal"
                placeholder="e.g. 39"
                className="mt-1.5 w-40 border border-line bg-bone px-3.5 py-3 text-[15px] focus:border-ink focus:outline-none"
              />
            </div>
            {rec && (
              <p className="flex items-center gap-2 bg-ink px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-bone" aria-live="polite">
                We recommend <span className="text-bronze">{rec}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            { t: "How we measure", d: "Chest: armpit-to-armpit across the front, doubled. Shoulder: seam-to-seam across the back. Length: top of collar to hem. Sleeve: shoulder seam to cuff." },
            { t: "Still unsure?", d: "Send us your usual size in any brand and the fit you like — regular, relaxed, oversized — and we'll reply with a recommendation within hours." },
          ].map((c) => (
            <div key={c.t} className="reveal border border-line bg-white p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.14em]">{c.t}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================ 404 ================================= */

export function NotFoundPage() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow text-bronze">Error 404</p>
      <h1 className="display-1 mt-4">You went a little deeper.</h1>
      <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        This page has drifted off the map. The drop is still very much on — head back before the thread runs out.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="flex items-center gap-2 bg-ink px-9 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85">
          <HomeIcon className="h-4 w-4" /> Back to shop
        </Link>
        <Link to="/" className="border border-ink px-9 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] hover:bg-secondary">
          Home
        </Link>
      </div>
      <div className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { to: "/shop/new-arrivals", label: "New arrivals", icon: FileText },
          { to: "/shop/best-sellers", label: "Best sellers", icon: FileText },
          { to: "/journal", label: "Journal", icon: FileText },
          { to: "/contact", label: "Contact", icon: FileText },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="group border border-line bg-white p-5 transition-colors hover:border-ink">
            <Icon className="mx-auto h-5 w-5 text-bronze" strokeWidth={1.6} />
            <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.12em] group-hover:underline">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
