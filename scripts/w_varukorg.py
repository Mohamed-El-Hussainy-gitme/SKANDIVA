import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

write("src/app/varukorg/page.tsx", """\"use client\";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatSEK } from "@/lib/store";
import { INITIAL_DELIVERY_ZONES } from "@/data/initialData";
import { DeliveryZone } from "@/types";
import { Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck, MapPin } from "lucide-react";

export default function VarukorgPage() {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    taxAmount,
    totalAmount,
    selectedZone,
    setSelectedZone,
    removeItem,
    updateQuantity,
  } = useCart();

  const [zones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-stone pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">Skandiva Varukorg</span>
        <h1 className="font-serif text-4xl text-ink font-normal">
          Din Varukorg ({itemCount} {itemCount === 1 ? "artikel" : "artiklar"})
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone p-8 max-w-lg mx-auto space-y-4">
          <h3 className="font-serif text-2xl text-ink">Din varukorg är tom</h3>
          <p className="text-xs text-ink/70 font-sans">
            Utforska vårt sortiment av klassiker och beställ Lamino Express direkt online.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/butik"
              className="px-6 py-3 bg-ink text-canvas font-mono text-xs uppercase hover:bg-wood transition-colors"
            >
              Till Butiken
            </Link>
            <Link
              href="/tjanster/lamino-express"
              className="px-6 py-3 border border-wood text-wood font-mono text-xs uppercase hover:bg-wood hover:text-canvas transition-colors"
            >
              Lamino Express
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-stone bg-canvas divide-y divide-stone/60">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="relative w-24 h-24 bg-stone-light border border-stone shrink-0 overflow-hidden">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=300&q=80"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg font-medium text-ink leading-snug">{item.title}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ink/40 hover:text-rose-700 transition-colors p-1"
                        title="Ta bort"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.designerOrModel && (
                      <p className="text-xs font-mono text-wood">{item.designerOrModel}</p>
                    )}

                    {item.selectedVariantName && (
                      <p className="text-xs text-ink/70">
                        Utförande: <span className="font-medium text-ink">{item.selectedVariantName}</span>
                      </p>
                    )}

                    {item.selectedMaterial && (
                      <p className="text-xs text-ink/70">
                        Material: <span className="font-medium text-ink">{item.selectedMaterial}</span>
                      </p>
                    )}

                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="text-[11px] text-wood font-mono mt-1">
                        Tillval: {item.selectedAddons.join(", ")}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center border border-stone bg-canvas">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-stone-light text-ink font-mono text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-mono text-xs text-ink font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-stone-light text-ink font-mono text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-base font-bold text-ink">
                        {formatSEK(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-stone bg-stone-light/40 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-wood font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Välj Leverans- / Hämtningszon (Fast avgift & Tillägg)</span>
              </div>
              <p className="text-xs text-ink/70 font-sans">
                Vi erbjuder anpassad möbeltransport med bud eller inlämning i vår verkstad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {zones.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-4 border cursor-pointer transition-all ${
                        isSelected
                          ? "border-wood bg-canvas ring-1 ring-wood shadow-xs"
                          : "border-stone bg-stone-light/50 hover:bg-canvas"
                      }`}
                    >
                      <div className="flex justify-between items-start text-xs font-mono">
                        <span className="font-semibold text-ink">{zone.name}</span>
                        <span className="font-bold text-wood">
                          {zone.surcharge === 0 ? "Ingår (0 kr)" : `+${formatSEK(zone.surcharge)}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink/70 font-sans mt-1">{zone.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="border-2 border-stone bg-canvas p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-2xl text-ink font-normal border-b border-stone pb-4">
                Ordersammanfattning
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between text-ink/80">
                  <span>Delsumma artiklar</span>
                  <span>{formatSEK(subtotal)}</span>
                </div>

                <div className="flex justify-between text-ink/80">
                  <span>Leverans ({selectedZone.name})</span>
                  <span>{selectedZone.surcharge === 0 ? "0 kr" : formatSEK(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-ink/60 border-t border-stone/50 pt-2">
                  <span>Varav 25% moms</span>
                  <span>{formatSEK(taxAmount)}</span>
                </div>

                <div className="flex justify-between text-lg font-serif font-bold text-ink border-t border-stone pt-3">
                  <span>Totalt att betala</span>
                  <span className="font-mono">{formatSEK(totalAmount)}</span>
                </div>
              </div>

              <Link
                href="/kassa"
                className="w-full py-4 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Gå Till Kassan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-2 pt-2 border-t border-stone text-xs font-mono text-ink/70">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-wood" />
                  <span>5 års hantverksgaranti & äkthetssigill</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-wood" />
                  <span>Spårbar leverans med ordernummer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
""")
