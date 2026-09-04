"use client";

import { useState } from "react";
import { User, Package, Heart, MapPin, LogOut, Truck, Check, Bell, CreditCard, ChevronRight, ShoppingBag } from "lucide-react";
import { useAuth, useOrders, useWishlist, useCart, useHydrated } from "@/lib/store";
import { Link, useRouter } from "@/lib/router";
import { cn, formatINR, formatDate } from "@/lib/utils";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product/product-card";
import { getProduct } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type Tab = "profile" | "orders" | "wishlist" | "addresses";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
];

export function AccountPage({ tab = "profile" }: { tab?: Tab }) {
  const { user, logout, updateProfile, addresses, addAddress, removeAddress } = useAuth();
  const orders = useOrders((s) => s.orders);
  const wishIds = useWishlist((s) => s.ids);
  const hydrated = useHydrated();
  const { navigate } = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", birthday: user?.birthday ?? "" });
  const [newAddr, setNewAddr] = useState({ fullName: "", phone: "", line1: "", city: "", state: "Maharashtra", pin: "" });
  const [addrOpen, setAddrOpen] = useState(false);

  if (!hydrated) return <div className="container-x py-16"><div className="skeleton mx-auto h-72 max-w-4xl" /></div>;

  if (!user) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="display-2">My Account</h1>
        <p className="mx-auto mt-4 max-w-sm text-[14.5px] text-muted-foreground">Sign in to see your orders, wishlist and saved addresses.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/login" className="bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone">Login</Link>
          <Link to="/register" className="border border-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em]">Register</Link>
        </div>
      </div>
    );
  }

  const wishItems = wishIds.map((id) => getProduct(id)).filter(Boolean);

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display-2">Hello, {user.name.split(" ")[0]}.</h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">{user.email} · Member since 2026</p>
        </div>
        <button
          onClick={() => {
            logout();
            toast({ title: "Signed out", description: "See you on the deeper side." });
            navigate("/");
          }}
          className="flex items-center gap-2 border border-line px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-sale hover:text-sale"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Side nav */}
        <nav aria-label="Account sections">
          <ul className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <Link
                  to={`/account/${key === "profile" ? "" : key}`}
                  className={cn(
                    "flex items-center gap-3 whitespace-nowrap px-4 py-3 text-[12.5px] font-bold uppercase tracking-[0.12em] transition-colors",
                    tab === key ? "bg-ink text-bone" : "text-ink/70 hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" /> {label}
                  {key === "orders" && orders.length > 0 && <span className="ml-auto text-[11px] text-bronze">{orders.length}</span>}
                  {key === "wishlist" && wishIds.length > 0 && <span className="ml-auto text-[11px] text-bronze">{wishIds.length}</span>}
                </Link>
              </li>
            ))}
            <li className="hidden lg:mt-4 lg:block">
              <Link to="/track" className="flex items-center gap-3 px-4 py-3 text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink/70 hover:bg-secondary">
                <Truck className="h-4 w-4" /> Track order
              </Link>
            </li>
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0">
          {tab === "profile" && (
            <section aria-label="Profile" className="max-w-xl">
              <h2 className="text-[13px] font-extrabold uppercase tracking-[0.18em]">Profile details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {([
                  { k: "name", label: "Full name" },
                  { k: "email", label: "Email", type: "email" },
                  { k: "phone", label: "Mobile" },
                  { k: "birthday", label: "Birthday", type: "date" },
                ] as const).map((f) => (
                  <div key={f.k}>
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{f.label}</label>
                    <input
                      type={"type" in f ? f.type : "text"}
                      value={form[f.k]}
                      onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                      className="mt-1.5 w-full border border-line bg-white px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  updateProfile(form);
                  toast({ title: "Profile updated" });
                }}
                className="mt-6 bg-ink px-8 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.18em] text-bone hover:opacity-85"
              >
                Save changes
              </button>

              <h2 className="mt-12 text-[13px] font-extrabold uppercase tracking-[0.18em]">Preferences</h2>
              <div className="mt-4 space-y-3">
                {[
                  { icon: Bell, t: "Drop alerts", d: "Be first on every new release" },
                  { icon: CreditCard, t: "Saved payment methods", d: "Managed securely at checkout" },
                ].map(({ icon: Icon, t, d }) => (
                  <div key={t} className="flex items-center justify-between border border-line bg-white px-5 py-4">
                    <span className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5 text-bronze" strokeWidth={1.6} />
                      <span>
                        <span className="block text-[13.5px] font-semibold">{t}</span>
                        <span className="text-[12px] text-muted-foreground">{d}</span>
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink/30" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "orders" && (
            <section aria-label="Orders">
              <h2 className="text-[13px] font-extrabold uppercase tracking-[0.18em]">Order history</h2>
              {orders.length === 0 ? (
                <div className="mt-6 border border-dashed border-line bg-white p-12 text-center">
                  <Package className="mx-auto h-10 w-10 text-ink/25" strokeWidth={1.2} />
                  <p className="mt-4 text-[15px] font-bold uppercase tracking-[0.1em]">No orders yet</p>
                  <p className="mx-auto mt-2 max-w-xs text-[13.5px] text-muted-foreground">When you place an order it will appear here, stitches and all.</p>
                  <Link to="/shop" className="mt-6 inline-block bg-ink px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-bone">Start shopping</Link>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {orders.map((o) => {
                    const doneIdx = o.timeline.findIndex((t) => !t.done);
                    const status = doneIdx === -1 ? o.timeline[o.timeline.length - 1].status : o.timeline[doneIdx - 1 < 0 ? 0 : doneIdx - 1].status;
                    return (
                      <li key={o.id} className="border border-line bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                          <div>
                            <p className="text-[13px] font-extrabold tracking-wide">{o.id}</p>
                            <p className="mt-0.5 text-[12px] text-muted-foreground">Placed {formatDate(o.date)} · {o.items.length} item{o.items.length > 1 ? "s" : ""} · {formatINR(o.total)}</p>
                          </div>
                          <span className={cn(
                            "px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em]",
                            status === "DELIVERED" ? "bg-bronze text-white" : "bg-secondary text-ink"
                          )}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-5 py-4">
                          {o.items.map((i) => (
                            <Link key={i.productId + i.size} to={`/product/${i.slug}`} className="shrink-0">
                              { }
                              <img src={i.image} alt={i.name} className="h-16 w-14 object-cover" />
                            </Link>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3.5">
                          <Link to={`/account/orders/${o.id}`} className="flex items-center gap-1.5 bg-ink px-5 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-bone hover:opacity-85">
                            <Truck className="h-3.5 w-3.5" /> Track order
                          </Link>
                          <button
                            onClick={() => {
                              const cart = useCart.getState();
                              o.items.forEach((i) => cart.addItem({ productId: i.productId, size: i.size, color: i.color, qty: i.qty }));
                              toast({ title: "Added to bag", description: "Your previous order is ready again." });
                            }}
                            className="flex items-center gap-1.5 border border-line px-5 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] hover:border-ink"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" /> Reorder
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {tab === "wishlist" && (
            <section aria-label="Wishlist">
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-extrabold uppercase tracking-[0.18em]">My wishlist</h2>
                <Link to="/wishlist" className="text-[12px] font-bold uppercase tracking-wider underline underline-offset-4">Full page</Link>
              </div>
              {wishItems.length === 0 ? (
                <div className="mt-6 border border-dashed border-line bg-white p-12 text-center">
                  <Heart className="mx-auto h-10 w-10 text-ink/25" strokeWidth={1.2} />
                  <p className="mt-4 text-[15px] font-bold uppercase tracking-[0.1em]">Nothing saved yet</p>
                  <Link to="/shop" className="mt-6 inline-block bg-ink px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-bone">Explore pieces</Link>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3">
                  {wishItems.map((p) => <ProductCard key={p!.id} product={p!} />)}
                </div>
              )}
            </section>
          )}

          {tab === "addresses" && (
            <section aria-label="Addresses">
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-extrabold uppercase tracking-[0.18em]">Saved addresses</h2>
                <button onClick={() => setAddrOpen(!addrOpen)} className="bg-ink px-5 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-bone">
                  {addrOpen ? "Close" : "Add new"}
                </button>
              </div>
              {addrOpen && (
                <div className="mt-5 grid gap-3 border border-line bg-white p-5 sm:grid-cols-2">
                  {([
                    { k: "fullName", label: "Full name" },
                    { k: "phone", label: "Mobile" },
                    { k: "line1", label: "Address", wide: true },
                    { k: "city", label: "City" },
                    { k: "pin", label: "PIN code" },
                  ] as const).map((f) => (
                    <div key={f.k} className={f.wide ? "sm:col-span-2" : ""}>
                      <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{f.label}</label>
                      <input
                        value={newAddr[f.k]}
                        onChange={(e) => setNewAddr({ ...newAddr, [f.k]: e.target.value })}
                        className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-[14px] focus:border-ink focus:outline-none"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => {
                        if (!newAddr.fullName || !newAddr.line1 || !/^\d{6}$/.test(newAddr.pin)) {
                          toast({ title: "Please fill name, address and a valid PIN" });
                          return;
                        }
                        addAddress({ id: "a-" + Date.now(), label: "Home", ...newAddr });
                        setNewAddr({ fullName: "", phone: "", line1: "", city: "", state: "Maharashtra", pin: "" });
                        setAddrOpen(false);
                        toast({ title: "Address saved" });
                      }}
                      className="bg-ink px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-bone"
                    >
                      Save address
                    </button>
                  </div>
                </div>
              )}
              {addresses.length === 0 && !addrOpen ? (
                <p className="mt-6 border border-dashed border-line bg-white p-8 text-center text-[13.5px] text-muted-foreground">
                  No saved addresses yet. Add one for faster checkout.
                </p>
              ) : (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <li key={a.id} className="relative border border-line bg-white p-5">
                      {a.isDefault && <span className="absolute right-4 top-4 bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">Default</span>}
                      <p className="text-[14px] font-bold">{a.fullName}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink/70">
                        {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.pin}
                      </p>
                      <p className="mt-1 text-[12.5px] text-muted-foreground">{a.phone}</p>
                      <div className="mt-3 flex gap-3 text-[11.5px] font-bold uppercase tracking-wider">
                        <button className="text-muted-foreground underline underline-offset-4 hover:text-ink">Edit</button>
                        <button onClick={() => { removeAddress(a.id); toast({ title: "Address removed" }); }} className="text-sale underline underline-offset-4">
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- ORDER TRACKING -------------------------- */

export function OrderTrackingPage({ orderId }: { orderId?: string }) {
  const orders = useOrders((s) => s.orders);
  const advance = useOrders((s) => s.advanceOrder);
  const hydrated = useHydrated();
  const { toast } = useToast();
  const order = orderId ? orders.find((o) => o.id === orderId) : orders[0];

  if (!hydrated) return <div className="container-x py-16"><div className="skeleton mx-auto h-72 max-w-3xl" /></div>;

  if (!order) {
    return (
      <div className="container-x max-w-2xl py-20 text-center">
        <h1 className="display-2">Track order</h1>
        <p className="mx-auto mt-4 max-w-sm text-[14.5px] text-muted-foreground">No orders found in this session. Orders placed at checkout appear here in real time.</p>
        <Link to="/shop" className="mt-8 inline-block bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone">Shop the drop</Link>
      </div>
    );
  }

  return (
    <div className="container-x max-w-3xl py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Orders", href: "/account/orders" }, { label: `Track ${order.id}` }]} />
      <h1 className="display-3 mt-5">Track your order.</h1>
      <p className="mt-2 text-[13.5px] text-muted-foreground">
        {order.id} · Placed {formatDate(order.date)} · Estimated delivery{" "}
        <strong className="text-ink">{new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</strong>
      </p>

      {/* Timeline */}
      <div className="mt-10 border border-line bg-white p-6 sm:p-9">
        <ol className="relative space-y-8" aria-label="Delivery progress">
          {order.timeline.map((t, i) => (
            <li key={t.status} className="relative flex items-start gap-4">
              {i < order.timeline.length - 1 && (
                <span className={cn("absolute left-[17px] top-10 h-[calc(100%+8px)] w-0.5", t.done ? "bg-ink" : "bg-line")} aria-hidden />
              )}
              <span
                className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  t.done ? "border-ink bg-ink text-bone" : "border-line bg-bone text-ink/30"
                )}
              >
                {t.done ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
              </span>
              <div className="flex-1 pt-1">
                <p className={cn("text-[13.5px] font-extrabold uppercase tracking-[0.12em]", !t.done && "text-ink/40")}>{t.status}</p>
                {t.done && (
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    {new Date(t.date).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
        {!order.timeline.every((t) => t.done) && (
          <button
            onClick={() => {
              advance(order.id);
              toast({ title: "Shipment updated", description: "The next milestone just ticked over." });
            }}
            className="mt-8 border border-dashed border-line px-5 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-ink hover:text-ink"
          >
            Demo: advance shipment
          </button>
        )}
      </div>

      {/* Items */}
      <div className="mt-6 border border-line bg-white p-6">
        <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">In this shipment</p>
        <ul className="mt-4 space-y-3">
          {order.items.map((i) => (
            <li key={i.productId + i.size} className="flex items-center gap-4">
              { }
              <img src={i.image} alt={i.name} className="h-16 w-14 object-cover" />
              <div className="min-w-0 flex-1">
                <Link to={`/product/${i.slug}`} className="block truncate text-[14px] font-semibold hover:underline">{i.name}</Link>
                <p className="text-[12.5px] text-muted-foreground">{i.color} · {i.size} · Qty {i.qty}</p>
              </div>
              <p className="text-[13.5px] font-semibold">{formatINR(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
