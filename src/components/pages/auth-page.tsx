"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Link, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const login = useAuth((s) => s.login);
  const { navigate } = useRouter();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (mode === "register") {
      if (form.name.trim().length < 3) errs.name = "Enter your full name";
      if (!/^\d{10}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit mobile";
      if (form.confirm !== form.password) errs.confirm = "Passwords don't match";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      login({
        name: mode === "register" ? form.name.trim() : form.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email: form.email,
        phone: mode === "register" ? form.phone : undefined,
      });
      setLoading(false);
      toast({ title: mode === "register" ? "Welcome to DEEPIER" : "Welcome back", description: "You're signed in." });
      navigate("/account");
    }, 900);
  };

  return (
    <div className="grid min-h-[calc(100vh-56px)] lg:grid-cols-2">
      {/* Editorial side */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        { }
        <img
          src="/img/lifestyle-8.webp"
          alt="DEEPIER editorial"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-12">
          <p className="eyebrow text-bronze">Members get deeper</p>
          <h2 className="display-2 mt-3 max-w-md text-white">Every stitch has a story.</h2>
          <ul className="mt-8 space-y-3">
            {["Early access to every drop", "Order tracking & easy returns", "Wishlist that follows you everywhere"].map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-[14px] text-white/75">
                <Check className="h-4 w-4 text-bronze" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-md">
          <h1 className="display-3">{mode === "login" ? "Sign in" : "Create account"}</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            {mode === "login"
              ? "Pick up where the thread left off."
              : "Join the community — first order gets ₹300 off with FIRSTSTITCH."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            {mode === "register" && (
              <AuthField label="Full name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
            )}
            <AuthField label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
            {mode === "register" && (
              <AuthField label="Mobile number" value={form.phone} onChange={(v) => set("phone")(v.replace(/\D/g, "").slice(0, 10))} error={errors.phone} inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" />
            )}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  aria-invalid={!!errors.password}
                  className={cn("w-full border bg-white px-3.5 py-3 pr-11 text-[14px] focus:outline-none", errors.password ? "border-sale" : "border-line focus:border-ink")}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink">
                  {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-[12px] text-sale">{errors.password}</p>}
            </div>
            {mode === "register" && (
              <AuthField label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" placeholder="••••••••" />
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" onClick={() => toast({ title: "Reset link sent", description: "Check your inbox for password reset instructions." })} className="text-[12.5px] text-muted-foreground underline underline-offset-4 hover:text-ink">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-ink py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-bone/30 border-t-bone" /> : <ArrowRight className="h-4 w-4" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] text-muted-foreground">
            {mode === "login" ? (
              <>New to DEEPIER? <Link to="/register" className="font-bold text-ink underline underline-offset-4">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="font-bold text-ink underline underline-offset-4">Sign in</Link></>
            )}
          </p>
          <p className="mt-8 text-center text-[11.5px] leading-relaxed text-ink/40">
            By continuing you agree to DEEPIER&rsquo;s <Link to="/terms" className="underline">Terms</Link> and{" "}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthField({
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
        className={cn("mt-1.5 w-full border bg-white px-3.5 py-3 text-[14px] focus:outline-none", error ? "border-sale" : "border-line focus:border-ink")}
      />
      {error && <p className="mt-1.5 text-[12px] text-sale">{error}</p>}
    </div>
  );
}
