import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

write("src/app/tjanster/page.tsx", """import React from "react";
import Link from "next/link";
import Image from "next/image";
import { INITIAL_SERVICES } from "@/data/initialData";
import { ArrowRight, Sparkles, Clock, ShieldCheck, Hammer, Building2 } from "lucide-react";

export default function TjansterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div className="border-b border-stone pb-8 space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Skandiva Tapetserarateljé • Stockholm
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
          Verkstadstjänster & Möbelrestaurering
        </h1>
        <p className="text-sm sm:text-base text-ink/75 max-w-2xl font-sans">
          Vi utför allt från fastprisrenoveringar av Lamino till storskalig cirkulär omklädsel för kontor och fastighetsägare.
        </p>
      </div>

      <div className="bg-stone-light/60 border-2 border-wood/40 p-8 sm:p-12 relative overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-wood text-canvas text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flaggskeppstjänst • Fast Pris</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
              Lamino Express™ Fårskinnsomklädsel
            </h2>
            <p className="text-ink/80 text-sm leading-relaxed">
              Vår specialiserade helrenovering för din Lamino fåtölj. Välj mellan Skandinaviens finaste fårskinn, lägg till fotpall och nackkudde och få din fåtölj tillbaka i nyskick inom 10–14 dagar.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-ink/75 pt-2">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-wood" /> 10–14 arbetsdagar</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-wood" /> 5 års hantverksgaranti</span>
              <span className="flex items-center gap-1.5"><Hammer className="w-4 h-4 text-wood" /> Ny bärväv & stomvård ingår</span>
            </div>
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/tjanster/lamino-express"
                className="px-6 py-3.5 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>Öppna Lamino Konfigurator (4 900 kr)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] bg-stone-light border border-stone overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=800&q=80"
              alt="Lamino Express"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal border-b border-stone pb-4">
          Alla Verkstadstjänster
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INITIAL_SERVICES.map((service) => (
            <div
              key={service.id}
              className="border border-stone bg-canvas flex flex-col justify-between hover:border-wood transition-colors shadow-xs"
            >
              <div className="relative aspect-[16/10] w-full bg-stone-light overflow-hidden">
                <Image
                  src={service.primaryImage}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-xs text-canvas font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                  {service.furnitureType}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-wood">
                    <span>{service.turnaroundText}</span>
                    <span>{service.isFixedPrice ? "Fast pris" : "Offertbaserad"}</span>
                  </div>
                  <h4 className="font-serif text-xl font-medium text-ink">{service.name}</h4>
                  <p className="text-xs text-ink/70 font-sans leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink/50 block">Pris</span>
                    <span className="font-mono text-sm font-bold text-ink">{service.priceRangeText}</span>
                  </div>
                  <Link
                    href={service.isFixedPrice ? `/tjanster/${service.slug}` : `/tjanster/offert?service=${encodeURIComponent(service.name)}`}
                    className="px-3 py-1.5 bg-ink hover:bg-wood text-canvas text-xs font-mono uppercase tracking-wider transition-colors"
                  >
                    {service.isFixedPrice ? "Konfigurera" : "Begär Offert"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-stone bg-stone-light/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-wood">
            <Building2 className="w-4 h-4" />
            <span>Företag & Offentlig Miljö</span>
          </div>
          <h4 className="font-serif text-2xl font-normal text-ink">
            Behöver ert kontor klä om 10+ stolar eller lounger?
          </h4>
          <p className="text-xs text-ink/75 font-sans leading-relaxed">
            Vi hjälper arkitekter, företag och hotell att återbruka kvalitetsmöbler. Vi hämtar och levererar i hela Mälardalen med full dokumentation för er hållbarhetsredovisning.
          </p>
        </div>
        <Link
          href="/tjanster/offert?b2b=true"
          className="px-6 py-3.5 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors"
        >
          Begär Företagsoffert →
        </Link>
      </div>
    </div>
  );
}
""")
