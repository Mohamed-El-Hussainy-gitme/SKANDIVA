import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

write("src/app/spara-order/page.tsx", """\"use client\";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/supabase";
import { Compass, Search, AlertCircle } from "lucide-react";

export default function SparaOrderHubPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError("");

    const order = await db.getOrderByNumber(query.trim());

    setIsSearching(false);

    if (order) {
      router.push(`/spara-order/${order.orderNumber}`);
    } else {
      setError(`Kunde inte hitta någon beställning med ordernummer eller e-post "${query}". Kontrollera stavningen.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-light border border-stone text-wood text-xs font-mono uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          <span>Skandiva Realtidsspårning</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
          Följ din möbel i verkstaden
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 font-sans leading-relaxed">
          Skriv in ditt ordernummer (t.ex. <code className="font-mono font-bold text-ink">SKD-2026-8942</code>) eller din e-postadress för att se aktuell produktionsstatus, hantverksanteckningar och beräknad leveransdag.
        </p>
      </div>

      <div className="bg-canvas border-2 border-stone p-6 sm:p-10 shadow-sm max-w-2xl mx-auto space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold mb-2">
              Ordernummer eller E-postadress
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="t.ex. SKD-2026-8942 eller henrik.lindqvist@example.se"
                className="w-full bg-stone-light/30 border border-stone p-4 pr-12 text-sm font-mono text-ink uppercase placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-wood"
                required
              />
              <Search className="w-5 h-5 text-ink/40 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="w-full py-4 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>{isSearching ? "Söker i ateljédatabasen..." : "Spåra Beställning"}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-stone/50 text-xs font-mono text-ink/60 space-y-1.5">
          <span className="block text-[11px] uppercase text-wood font-medium">Testa med exempelordrar:</span>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => {
                setQuery("SKD-2026-8942");
                router.push("/spara-order/SKD-2026-8942");
              }}
              className="px-2.5 py-1 bg-stone-light hover:bg-stone text-ink text-xs underline"
            >
              Lamino Express (I verkstaden: SKD-2026-8942)
            </button>
            <button
              onClick={() => {
                setQuery("SKD-2026-7719");
                router.push("/spara-order/SKD-2026-7719");
              }}
              className="px-2.5 py-1 bg-stone-light hover:bg-stone text-ink text-xs underline"
            >
              Pernilla Dynsats (Levererad: SKD-2026-7719)
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-stone">
        <h3 className="font-serif text-2xl text-ink font-normal text-center">
          Vår 5-stegs hantverksprocess
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs font-mono text-ink/80">
          <div className="p-4 bg-stone-light/40 border border-stone space-y-2">
            <span className="w-6 h-6 rounded-full bg-ink text-canvas text-xs flex items-center justify-center">1</span>
            <strong className="block text-ink font-serif text-sm">Order Mottagen</strong>
            <p className="text-[11px] text-ink/70 font-sans">Produktionskort skapas och läggs in i verkstadsplanen.</p>
          </div>

          <div className="p-4 bg-stone-light/40 border border-stone space-y-2">
            <span className="w-6 h-6 rounded-full bg-ink text-canvas text-xs flex items-center justify-center">2</span>
            <strong className="block text-ink font-serif text-sm">Material Förbereds</strong>
            <p className="text-[11px] text-ink/70 font-sans">Fårskinn eller textil matchas och tillskärs i ateljén.</p>
          </div>

          <div className="p-4 bg-stone-light/40 border border-stone space-y-2">
            <span className="w-6 h-6 rounded-full bg-ink text-canvas text-xs flex items-center justify-center">3</span>
            <strong className="block text-ink font-serif text-sm">I Verkstaden</strong>
            <p className="text-[11px] text-ink/70 font-sans">Tapetsering, bärvävsbyte och stomvård utförs.</p>
          </div>

          <div className="p-4 bg-stone-light/40 border border-stone space-y-2">
            <span className="w-6 h-6 rounded-full bg-ink text-canvas text-xs flex items-center justify-center">4</span>
            <strong className="block text-ink font-serif text-sm">Kvalitetskontroll</strong>
            <p className="text-[11px] text-ink/70 font-sans">Mästargranskning av sömmar och mässingssigill monteras.</p>
          </div>

          <div className="p-4 bg-stone-light/40 border border-stone space-y-2">
            <span className="w-6 h-6 rounded-full bg-ink text-canvas text-xs flex items-center justify-center">5</span>
            <strong className="block text-ink font-serif text-sm">Leverans</strong>
            <p className="text-[11px] text-ink/70 font-sans">Leverans med möbelbud eller avhämtning på Södermalm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
""")
