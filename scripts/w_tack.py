import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

write("src/app/kassa/tack/page.tsx", """\"use client\";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle2, Compass, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function TackPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "SKD-2026-8942";

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#5B4433", "#DCD5C8", "#1C1917"],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-wood text-canvas flex items-center justify-center shadow-lg border-2 border-stone">
          <CheckCircle2 className="w-10 h-10" />
        </div>
      </div>

      <div className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Beställning Bekräftad • Skandiva Ateljé
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
          Tack för din beställning!
        </h1>
        <p className="text-sm sm:text-base text-ink/75 max-w-lg mx-auto font-sans leading-relaxed">
          Vi har mottagit din order och registrerat den i vårt verkstadssystem. En orderbekräftelse har skickats till din e-post.
        </p>
      </div>

      <div className="bg-canvas border-2 border-stone p-6 sm:p-8 max-w-md mx-auto space-y-4 shadow-sm text-left">
        <div className="flex justify-between items-center border-b border-stone pb-3">
          <span className="text-xs font-mono uppercase text-wood font-semibold">Ditt Ordernummer:</span>
          <span className="font-mono text-xl font-bold text-ink">{orderNumber}</span>
        </div>

        <div className="text-xs font-mono text-ink/75 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-wood shrink-0" />
            <span>Skandiva 5-års hantverksgaranti aktiverad</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-wood shrink-0" />
            <span>Kvitto och specifikation skickad</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={`/spara-order/${orderNumber}`}
            className="w-full py-3.5 px-4 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Följ Möbelns Status i Verkstaden</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <Link
          href="/butik"
          className="px-4 py-2 border border-stone bg-stone-light/40 text-ink hover:bg-stone-light"
        >
          Fortsätt handla i butiken
        </Link>
        <Link
          href="/"
          className="px-4 py-2 border border-stone bg-stone-light/40 text-ink hover:bg-stone-light"
        >
          Till Startsidan
        </Link>
      </div>
    </div>
  );
}
""")
