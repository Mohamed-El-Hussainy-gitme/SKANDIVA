"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { WorkshopService, ServiceOptionMaterial } from "@/types";
import { useCart, formatSEK } from "@/lib/store";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { 
  Check, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ShoppingBag
} from "lucide-react";

interface LaminoConfiguratorProps {
  service: WorkshopService;
}

export const LaminoConfigurator: React.FC<LaminoConfiguratorProps> = ({ service }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<ServiceOptionMaterial>(
    service.materials && service.materials.length > 0
      ? service.materials[0]
      : {
          id: "mat-grafit",
          name: "Skandinaviskt Fårskinn Grafitgrå",
          category: "farskinn",
          colorName: "Grafitgrå",
          colorHex: "#6B6A68",
          price: 0,
        }
  );

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [addedNotice, setAddedNotice] = useState(false);

  const { addItem, setIsDrawerOpen } = useCart();

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculatedTotal = useMemo(() => {
    let total = service.basePrice;
    total += selectedMaterial.price || 0;

    selectedAddonIds.forEach((addonId) => {
      const addon = service.addons.find((a) => a.id === addonId);
      if (addon) total += addon.price;
    });

    return total;
  }, [service.basePrice, selectedMaterial.price, selectedAddonIds, service.addons]);

  const handleAddToCart = () => {
    const selectedAddonNames = selectedAddonIds
      .map((id) => service.addons.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];

    addItem({
      id: `srv-${service.id}-${selectedMaterial.id}-${selectedAddonIds.sort().join("-") || "base"}`,
      type: "service",
      referenceId: service.slug,
      title: "Lamino Express™ Omklädsel",
      designerOrModel: `Yngve Ekström • ${selectedMaterial.colorName || selectedMaterial.name}`,
      selectedVariantName: selectedMaterial.name,
      selectedVariantPrice: selectedMaterial.price,
      selectedAddons: selectedAddonNames,
      quantity: 1,
      unitPrice: calculatedTotal,
      totalPrice: calculatedTotal,
      image: service.primaryImage || "/IMG_0948.png",
    });

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setIsDrawerOpen(true);
    }, 400);
  };

  return (
    <div className="space-y-16">
      {/* ─── Top Split: Hero Overview & Live Configurator ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
        
        {/* Left Column: Visual Gallery & Guarantees (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[4/3] w-full bg-stone-light border border-stone overflow-hidden shadow-xs">
            <Image
              src={service.primaryImage || "/IMG_0948.png"}
              alt="Lamino Express Fårskinnsomklädsel"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-ink text-canvas font-mono text-xs uppercase tracking-wider px-3 py-1 font-bold shadow-md">
              Fast Pris • Garanterad Ledtid
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-canvas border border-stone text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-wood font-bold">
                <Clock className="w-4 h-4" />
                <span>{service.turnaroundText || "10–14 Arbetsdagar"}</span>
              </div>
              <p className="text-ink/70 text-[11px] font-sans">Snabbast hantverksledtid i Sverige för Lamino.</p>
            </div>

            <div className="p-4 bg-canvas border border-stone text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-wood font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>5 Års Garanti</span>
              </div>
              <p className="text-ink/70 text-[11px] font-sans">Full garanti på sömmar, bärväv och spänst.</p>
            </div>

            <div className="p-4 bg-canvas border border-stone text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-wood font-bold">
                <Truck className="w-4 h-4" />
                <span>Möbelbud</span>
              </div>
              <p className="text-ink/70 text-[11px] font-sans">Vi hämtar & lämnar i hela Storstockholm.</p>
            </div>
          </div>

          {/* Service Manifesto */}
          <div className="bg-stone-light/40 border border-stone p-6 space-y-3">
            <div className="flex items-center gap-3">
              <CrestSeal size="sm" variant="wood" />
              <h3 className="font-serif text-lg text-ink font-medium">Vad ingår alltid i Lamino Express?</h3>
            </div>
            <ul className="text-xs font-mono text-ink/80 space-y-2 pl-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-wood rounded-full shrink-0" />
                Demontering av gammal sliten klädsel och borttagning av torra häftklamrar.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-wood rounded-full shrink-0" />
                Ny förstärkt bärväv i naturhampa — korrekt spänd och förankrad.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-wood rounded-full shrink-0" />
                Ny stoppning och fyllning i certifierat polyeter/kallskum.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-wood rounded-full shrink-0" />
                Montering av förstklassigt fårskinn från Skandilock eller utvalt läder.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-wood rounded-full shrink-0" />
                Rengöring och oljning/vaxning av böjträstommen (bok/ek/valnöt).
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Option Configurator (5 cols) */}
        <div className="lg:col-span-5 bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
          
          <div className="border-b border-stone pb-4 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-wood font-semibold">
              Skandiva Konfigurator
            </span>
            <h2 className="font-serif text-2xl text-ink font-normal">
              Anpassa din Lamino-renovering
            </h2>
          </div>

          {/* 1. Material & Fårskinn Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
              1. Välj Fårskinn / Kulör:
            </label>
            <div className="space-y-2">
              {service.materials.map((mat) => {
                const isSelected = selectedMaterial.id === mat.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    className={`w-full text-left p-3 border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-wood ring-2 ring-wood bg-stone-light/50 font-bold"
                        : "border-stone hover:border-stone-dark bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: mat.colorHex }}
                      />
                      <span className="text-xs font-mono text-ink">{mat.name}</span>
                    </div>
                    {mat.price > 0 && (
                      <span className="text-xs font-mono text-wood font-semibold">+{formatSEK(mat.price)}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Tillval (Addons) */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
              2. Tillval & Kompletteringar:
            </label>
            <div className="space-y-2">
              {service.addons.map((addon) => {
                const isChecked = selectedAddonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full text-left p-3 border transition-all flex items-center justify-between ${
                      isChecked
                        ? "border-wood bg-stone-light/50"
                        : "border-stone hover:border-stone-dark bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                          isChecked ? "bg-wood border-wood text-canvas" : "border-stone bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-xs font-mono text-ink font-semibold block">{addon.name}</span>
                        <span className="text-[11px] text-ink/70 font-sans block">{addon.description}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-wood font-bold whitespace-nowrap ml-2">
                      +{formatSEK(addon.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Summary & Checkout Action */}
          <div className="pt-4 border-t border-stone space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase text-ink/70">Totalt Fast Pris:</span>
              <div className="text-right">
                <span className="font-serif text-3xl text-ink font-bold block">
                  {formatSEK(calculatedTotal)}
                </span>
                <span className="text-[10px] font-mono text-ink/60">Inkl. 25% moms & hantverk</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Bokning tillagd i varukorgen!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Boka Lamino Renovering ({formatSEK(calculatedTotal)})</span>
                </>
              )}
            </button>

            <p className="text-[11px] font-sans text-center text-ink/60">
              Du betalar tryggt i kassan med Klarna, Swish eller Kort. Vi kontaktar dig för hämtningsbokning.
            </p>
          </div>

        </div>

      </div>

      {/* ─── Bottom Section: Before & After Visual Slider ─── */}
      <div className="border-t border-stone pt-16 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-wood">
            Autentisk Verkstadsförvandling
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
            Före & Efter: Lamino i Gotlandsfårskinn
          </h2>
          <p className="text-xs sm:text-sm text-ink/75 font-sans">
            Dra i reglaget för att granska hantverket och förvandlingen från en sliten 70-talsfåtölj till en nyrenoverad klassiker.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-2 bg-canvas border border-stone shadow-lg">
          <BeforeAfterSlider
            beforeImage="/IMG_1236.png"
            afterImage="/IMG_0948.png"
            beforeLabel="Före (Slitet tyg & slapp väv)"
            afterLabel="Efter (Skandilock Grafitgrå & Ny väv)"
          />
        </div>
      </div>
    </div>
  );
};
