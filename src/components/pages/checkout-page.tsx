"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Landmark, Lock, MapPin, Package, Smartphone, Truck, Wallet, ShieldCheck, BadgeCheck } from "lucide-react";
import { useCart, useAuth, useOrders, useHydrated } from "@/lib/store";
import { getProduct, coupons, INDIAN_STATES } from "@/lib/data";
import { formatINR, cartTotals, cn, orderNumber, addDays } from "@/lib/utils";
import { Link, useRouter } from "@/lib/router";
import { useToast } from "@/hooks/use-toast";
import type { Address, Order } from "@/types";

type Step = 0 | 1 | 2 | 3;
const STEPS = ["Contact", "Delivery Address", "Shipping", "Payment"] as const;

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm & more", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay, Amex", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", sub: "All major Indian banks", icon: Landmark },
  { id: "wallet", label: "Wallets", sub: "Paytm, Amazon Pay, Mobikwik", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", sub: "Pay when it arrives · ₹0 fee under ₹5,000", icon: Package },
];

export function CheckoutPage() {
  const { items, clear, couponCode } = useCart();
  const { user, addresses, addAddress } = useAuth();
  const addOrder = useOrders((s) => s.addOrder);
  const hydrated = useHydrated();
  const { toast } = useToast();
  const { navigate } = useRouter();

  const [step, setStep] = useState<Step>(0);
  const [placing, setPlacing] = useState(false);
  const [contact, setContact] = useState({ fullName: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [addr, setAddr] = useState({ line1: "", line2: "", city: "", state: "Maharashtra", pin: "" });
  const [shipSpeed, setShipSpeed] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const lines = useMemo(
    () => items.map((i) => ({ item: i, product: getProduct(i.productId)! })).filter((x) => x.product),
    [items]
  );
  const subtotal = lines.reduce((a, x) => a + x.product.price * x.item.qty, 0);
  const coupon = coupons.find((c) => c.code === couponCode && subtotal >= c.minOrder) ?? null;
  const base = cartTotals(subtotal, coupon);
  const expressFee = shipSpeed === "express" ? 149 : 0;
  const shipping = base.shipping + expressFee;
  const total = subtotal - base.discount + shipping;

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (contact.fullName.trim().length < 3) e.fullName = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(contact.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateAddress = () => {
    const e: Record<string, string> = {};
    if (addr.line1.trim().length < 6) e.line1 = "Enter your street address";
    if (!addr.city.trim()) e.city = "Enter your city";
    if (!/^\d{6}$/.test(addr.pin)) e.pin = "Enter a valid 6-digit PIN";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    if (payment === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
      setErrors({ upi: "Enter a valid UPI ID (e.g. name@okhdfc)" });
      return;
    }
    if (payment === "card") {
      const e: Record<string, string> = {};
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ""))) e.cardNumber = "Enter a valid 16-digit card number";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "MM/YY";
      if (!/^\d{3}$/.test(card.cvv)) e.cvv = "3 digits";
      setErrors(e);
      if (Object.keys(e).length) return;
    }

    setPlacing(true);
    setTimeout(() => {
      const address: Address = {
        id: "a-" + Date.now(),
        label: "Home",
        fullName: contact.fullName,
        phone: contact.phone,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        pin: addr.pin,
        isDefault: true,
      };
      addAddress(address);
      const days = shipSpeed === "express" ? 2 : 5;
      const order: Order = {
        id: orderNumber(),
        date: new Date().toISOString(),
        items: lines.map((x) => ({
          productId: x.product.id,
          name: x.product.name,
          slug: x.product.slug,
          image: x.product.images[0].src,
          size: x.item.size,
          color: x.item.color,
          qty: x.item.qty,
          price: x.product.price,
        })),
        subtotal,
        discount: base.discount,
        shipping,
        total,
        paymentMethod: PAYMENT_METHODS.find((p) => p.id === payment)?.label ?? payment,
        status: "CONFIRMED",
        estimatedDelivery: addDays(days),
        address,
        timeline: [
          { status: "ORDER PLACED", date: new Date().toISOString(), done: true },
          { status: "CONFIRMED", date: new Date().toISOString(), done: true },
          { status: "PACKED", date: addDays(1), done: false },
          { status: "SHIPPED", date: addDays(2), done: false },
          { status: "OUT FOR DELIVERY", date: addDays(days - 1), done: false },
          { status: "DELIVERED", date: addDays(days), done: false },
        ],
      };
      addOrder(order);
      clear();
      setPlacing(false);
      navigate(`/order-confirmation/${order.id}`);
    }, 1400);
  };

  if (!hydrated) {
    return <div className="container-x py-16"><div className="skeleton mx-auto h-96 max-w-3xl" /></div>;
  }

  if (lines.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="display-2">Checkout</h1>
        <p className="mx-auto mt-4 max-w-sm text-[14.5px] text-muted-foreground">Your bag is empty — add a piece before checking out.</p>
        <Link to="/shop" className="mt-8 inline-block bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8 sm:py-12">
      {/* Steps header */}
      <ol className="mx-auto flex max-w-2xl items-center justify-between" aria-label="Checkout progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-bold transition-colors",
                  i < step ? "border-ink bg-ink text-bone" : i === step ? "border-ink bg-bone text-ink" : "border-line text-ink/40"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider", i <= step ? "text-ink" : "text-ink/40")}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={cn("mx-2 mb-5 h-px flex-1", i < step ? "bg-ink" : "bg-line")} />}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Form area */}
        <div>
          {step === 0 && (
            <section aria-label="Contact details">
              <h1 className="text-lg font-extrabold uppercase tracking-[0.08em]">Contact details</h1>
              <p className="mt-1.5 text-[13.5px] text-muted-foreground">Order updates will be sent by email and SMS.</p>
              {!user && (
                <p className="mt-4 bg-secondary px-4 py-3 text-[13px]">
                  Have an account?{" "}
                  <Link to="/login" className="font-bold underline underline-offset-4">Login</Link> for faster checkout.
                </p>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={contact.fullName} onChange={(v) => setContact({ ...contact, fullName: v })} error={errors.fullName} autoComplete="name" />
                <Field label="Mobile number" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v.replace(/\D/g, "").slice(0, 10) })} error={errors.phone} inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" />
                <div className="sm:col-span-2">
                  <Field label="Email address" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} error={errors.email} autoComplete="email" />
                </div>
              </div>
              <button
                onClick={() => validateContact() && setStep(1)}
                className="mt-8 flex items-center gap-2 bg-ink px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85"
              >
                Continue to address <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          )}

          {step === 1 && (
            <section aria-label="Delivery address">
              <button onClick={() => setStep(0)} className="mb-4 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-ink">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h1 className="text-lg font-extrabold uppercase tracking-[0.08em]">Delivery address</h1>
              {addresses.length > 0 && (
                <div className="mt-5 space-y-3">
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Saved addresses</p>
                  {addresses.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setAddr({ line1: a.line1, line2: a.line2 ?? "", city: a.city, state: a.state, pin: a.pin });
                        setContact({ ...contact, fullName: a.fullName, phone: a.phone });
                        toast({ title: "Address selected", description: `${a.line1}, ${a.city}` });
                      }}
                      className="block w-full border border-line bg-white p-4 text-left text-[13.5px] transition-colors hover:border-ink"
                    >
                      <span className="font-bold">{a.fullName}</span> — {a.line1}, {a.city}, {a.state} {a.pin}
                    </button>
                  ))}
                  <p className="text-[12px] text-muted-foreground">…or edit below to add a new one.</p>
                </div>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Flat / House no., Building, Street" value={addr.line1} onChange={(v) => setAddr({ ...addr, line1: v })} error={errors.line1} autoComplete="address-line1" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Landmark (optional)" value={addr.line2} onChange={(v) => setAddr({ ...addr, line2: v })} autoComplete="address-line2" />
                </div>
                <Field label="City" value={addr.city} onChange={(v) => setAddr({ ...addr, city: v })} error={errors.city} autoComplete="address-level2" />
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">State</label>
                  <select
                    value={addr.state}
                    onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                    className="mt-1.5 w-full border border-line bg-white px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Field label="PIN code" value={addr.pin} onChange={(v) => setAddr({ ...addr, pin: v.replace(/\D/g, "").slice(0, 6) })} error={errors.pin} inputMode="numeric" autoComplete="postal-code" />
              </div>
              <button
                onClick={() => validateAddress() && setStep(2)}
                className="mt-8 flex items-center gap-2 bg-ink px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85"
              >
                Continue to shipping <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          )}

          {step === 2 && (
            <section aria-label="Shipping method">
              <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-ink">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h1 className="text-lg font-extrabold uppercase tracking-[0.08em]">Shipping method</h1>
              <div className="mt-6 space-y-3">
                {[
                  { id: "standard" as const, icon: Truck, t: "Standard delivery", d: `Arrives by ${new Date(Date.now() + 5 * 864e5).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}`, price: base.shipping === 0 ? "FREE" : formatINR(base.shipping) },
                  { id: "express" as const, icon: Package, t: "Express delivery", d: `Arrives by ${new Date(Date.now() + 2 * 864e5).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}`, price: formatINR(149) },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setShipSpeed(o.id)}
                    aria-pressed={shipSpeed === o.id}
                    className={cn(
                      "flex w-full items-center gap-4 border p-5 text-left transition-colors",
                      shipSpeed === o.id ? "border-ink bg-white" : "border-line bg-white hover:border-ink/40"
                    )}
                  >
                    <o.icon className="h-5 w-5 text-bronze" strokeWidth={1.6} />
                    <span className="flex-1">
                      <span className="block text-[14.5px] font-bold">{o.t}</span>
                      <span className="mt-0.5 block text-[13px] text-muted-foreground">{o.d}</span>
                    </span>
                    <span className="text-[14px] font-bold">{o.price}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-2.5 bg-secondary p-4 text-[13px] text-ink/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
                Delivering to <strong className="font-semibold">{addr.line1}, {addr.city} — {addr.pin}</strong>
              </div>
              <button
                onClick={() => setStep(3)}
                className="mt-8 flex items-center gap-2 bg-ink px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85"
              >
                Continue to payment <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          )}

          {step === 3 && (
            <section aria-label="Payment">
              <button onClick={() => setStep(2)} className="mb-4 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-ink">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h1 className="text-lg font-extrabold uppercase tracking-[0.08em]">Payment</h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Encrypted and secure. We never store card details.
              </p>
              <div className="mt-6 space-y-3" role="radiogroup" aria-label="Payment method">
                {PAYMENT_METHODS.map((m) => (
                  <div key={m.id}>
                    <button
                      role="radio"
                      aria-checked={payment === m.id}
                      onClick={() => setPayment(m.id)}
                      className={cn(
                        "flex w-full items-center gap-4 border p-4 text-left transition-colors",
                        payment === m.id ? "border-ink bg-white" : "border-line bg-white hover:border-ink/40"
                      )}
                    >
                      <m.icon className="h-5 w-5 text-bronze" strokeWidth={1.6} />
                      <span className="flex-1">
                        <span className="block text-[14px] font-bold">{m.label}</span>
                        <span className="text-[12.5px] text-muted-foreground">{m.sub}</span>
                      </span>
                      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border", payment === m.id ? "border-ink bg-ink" : "border-line")}>
                        {payment === m.id && <Check className="h-3 w-3 text-bone" />}
                      </span>
                    </button>
                    {payment === "upi" && m.id === "upi" && (
                      <div className="border border-t-0 border-line bg-white p-4">
                        <input
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          aria-label="UPI ID"
                          className="w-full border border-line bg-bone px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none"
                        />
                        {errors.upi && <p className="mt-1.5 text-[12px] text-sale">{errors.upi}</p>}
                      </div>
                    )}
                    {payment === "card" && m.id === "card" && (
                      <div className="grid gap-3 border border-t-0 border-line bg-white p-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field label="Card number" value={card.number} onChange={(v) => setCard({ ...card, number: v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })} error={errors.cardNumber} inputMode="numeric" placeholder="1234 5678 9012 3456" />
                        </div>
                        <Field label="Name on card" value={card.name} onChange={(v) => setCard({ ...card, name: v })} />
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Expiry" value={card.expiry} onChange={(v) => { const d = v.replace(/\D/g, "").slice(0, 4); setCard({ ...card, expiry: d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d }); }} placeholder="MM/YY" error={errors.expiry} />
                          <Field label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "").slice(0, 3) })} inputMode="numeric" placeholder="•••" error={errors.cvv} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="mt-8 flex w-full items-center justify-center gap-2 bg-ink py-5 text-[13px] font-extrabold uppercase tracking-[0.22em] text-bone transition-opacity hover:opacity-85 disabled:opacity-60 sm:w-auto sm:px-14"
              >
                {placing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-bone/30 border-t-bone" /> Processing payment…
                  </>
                ) : (
                  <>Pay {formatINR(total)} securely</>
                )}
              </button>
              <p className="mt-3 text-[12px] text-muted-foreground">
                By placing this order you agree to our <Link to="/terms" className="underline">Terms</Link> and{" "}
                <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </section>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-24" aria-label="Order summary">
          <div className="border border-line bg-white p-6">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.2em]">Order Summary</h2>
            <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto dp-scroll pr-1">
              {lines.map(({ item, product }) => (
                <li key={item.key} className="flex items-center gap-3">
                  <span className="relative shrink-0">
                    { }
                    <img src={product.images[0].src} alt="" className="h-16 w-14 object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-bone">
                      {item.qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold">{product.name}</span>
                    <span className="text-[12px] text-muted-foreground">{item.size} · {item.color}</span>
                  </span>
                  <span className="text-[13.5px] font-semibold">{formatINR(product.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[14px]">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold">{formatINR(subtotal)}</dd></div>
              {base.discount > 0 && (
                <div className="flex justify-between text-sale"><dt>Coupon ({coupon?.code})</dt><dd className="font-semibold">−{formatINR(base.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping {shipSpeed === "express" && "(Express)"}</dt><dd className="font-semibold">{shipping === 0 ? <span className="text-bronze">FREE</span> : formatINR(shipping)}</dd></div>
              <div className="flex justify-between border-t border-line pt-4 text-[16px]"><dt className="font-extrabold uppercase">Total</dt><dd className="font-extrabold">{formatINR(total)}</dd></div>
            </dl>
            <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[11.5px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-bronze" /> PCI-DSS compliant · 256-bit SSL
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, error, type = "text", inputMode, autoComplete, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: "numeric" | "text" | "email";
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1.5 w-full border bg-white px-3.5 py-3 text-[14px] focus:outline-none",
          error ? "border-sale" : "border-line focus:border-ink"
        )}
      />
      {error && <p className="mt-1.5 text-[12px] text-sale">{error}</p>}
    </div>
  );
}

/* ------------------------ ORDER CONFIRMATION ------------------------ */

export function OrderConfirmationPage({ orderId }: { orderId: string }) {
  const order = useOrders((s) => s.orders.find((o) => o.id === orderId));
  const { navigate } = useRouter();

  if (!order) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="display-2">Order not found</h1>
        <p className="mt-4 text-muted-foreground">We couldn&rsquo;t find this order. It may belong to another session.</p>
        <button onClick={() => navigate("/account/orders")} className="mt-8 bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone">
          My orders
        </button>
      </div>
    );
  }

  return (
    <div className="container-x max-w-3xl py-14 sm:py-20">
      <div className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ink">
          <BadgeCheck className="h-9 w-9 text-bone" strokeWidth={1.5} />
        </span>
        <h1 className="display-2 mt-7">Order confirmed.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Thank you, {order.address.fullName.split(" ")[0]}. Your pieces are being prepared with care —
          a confirmation has been sent to your email and phone.
        </p>
      </div>

      <div className="mt-10 border border-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Order number</p>
            <p className="mt-1 text-[16px] font-extrabold tracking-wide">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Estimated delivery</p>
            <p className="mt-1 text-[16px] font-extrabold">
              {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </p>
          </div>
        </div>
        <ul className="divide-y divide-line">
          {order.items.map((i) => (
            <li key={i.productId + i.size} className="flex items-center gap-4 py-4">
              { }
              <img src={i.image} alt={i.name} className="h-16 w-14 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">{i.name}</p>
                <p className="text-[12.5px] text-muted-foreground">{i.color} · Size {i.size} · Qty {i.qty}</p>
              </div>
              <p className="text-[14px] font-semibold">{formatINR(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-line pt-4 text-[14px]">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-sale"><dt>Discount</dt><dd>−{formatINR(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</dd></div>
          <div className="flex justify-between pt-1 text-[16px] font-extrabold"><dt>Total paid</dt><dd>{formatINR(order.total)}</dd></div>
          <p className="pt-1 text-[12.5px] text-muted-foreground">Paid via {order.paymentMethod}</p>
        </dl>
        <div className="mt-6 border-t border-line pt-5 text-[13.5px] text-ink/70">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
            <span>
              Delivering to <strong>{order.address.fullName}</strong>, {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}, {order.address.state} — {order.address.pin}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => navigate(`/account/orders/${order.id}`)} className="flex items-center gap-2 bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85">
          <Truck className="h-4 w-4" /> Track order
        </button>
        <button onClick={() => navigate("/shop/new-arrivals")} className="border border-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] hover:bg-secondary">
          Continue shopping
        </button>
      </div>
    </div>
  );
}
