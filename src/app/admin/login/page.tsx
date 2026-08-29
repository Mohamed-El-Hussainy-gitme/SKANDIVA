"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(data.error || "Felaktig e-post eller lösenord. Åtkomst nekad.");
      }
    } catch {
      setError("Nätverksfel vid inloggning. Kontrollera din anslutning och försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F6F3ED] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#24211E] border border-white/15 p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Subtle top accent border in brand wood color */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#5B4433]" />

        {/* Brand Emblem & Header */}
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border border-[#5B4433]/60 shadow-lg bg-[#F6F3ED]">
            <Image
              src="/skandiva_classic_logo.png"
              alt="Skandiva Emblem"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#DCD5C8]/70 block">
              Skandiva Ateljé • Södermalm
            </span>
            <h1 className="font-serif text-3xl font-normal text-white">
              Verkstadsportal
            </h1>
            <p className="text-xs font-sans text-white/60">
              Behörighetskontroll för mästare och verkstadsledning
            </p>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-mono flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#DCD5C8]/80">
              E-postadress
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skandiva.se"
                required
                autoFocus
                className="w-full bg-[#1C1917] border border-white/20 px-4 py-3 pl-10 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#5B4433] focus:ring-1 focus:ring-[#5B4433] transition-all"
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#DCD5C8]/80">
              Mästarlösenord
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#1C1917] border border-white/20 px-4 py-3 pl-10 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#5B4433] focus:ring-1 focus:ring-[#5B4433] transition-all"
              />
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#5B4433] hover:bg-[#735640] text-[#F6F3ED] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifierar behörighet...</span>
              </>
            ) : (
              <>
                <span>Logga in i verkstaden</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Stamp */}
        <div className="pt-4 border-t border-white/10 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DCD5C8]" />
            <span>Krypterad session med HMAC-signering</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1C1917] flex items-center justify-center text-xs font-mono text-white/60">
          Laddar inloggningsportal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
