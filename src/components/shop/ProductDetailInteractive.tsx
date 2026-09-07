"use client";
import { formatSEK } from "@/lib/utils";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, Material } from "@/types";
import { ShieldCheck, Truck, Clock, ArrowRight } from "lucide-react";

interface ProductDetailInteractiveProps {
  product: Product;
  materials?: Material[];
}

export const ProductDetailInteractive: React.FC<ProductDetailInteractiveProps> = ({ product, materials = [] }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>();

  const currentPrice = product.basePrice + (selectedMaterial?.price || 0);
  const isSold = product.stockStatus === "sald";

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl sm:text-4xl text-ink font-bold">
          {formatSEK(currentPrice)}
        </span>
        <span className="text-xs font-mono text-ink/60">{materials.length > 0 ? "Material väljs nedan" : "Fast pris"}</span>
      </div>

      {/* Material Selector */}
      {materials.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-stone">
          <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">Välj material / klädsel</label>
          <div className="space-y-2">
            <select
              value={selectedMaterial?.id || ""}
              onChange={(event) => setSelectedMaterial(materials.find((material) => material.id === event.target.value))}
              className="w-full border border-stone px-4 py-3 bg-canvas text-sm font-sans text-ink focus:outline-none focus:border-wood"
              aria-label="Välj utförande"
            >
              <option value="">Välj ett material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}{material.price > 0 ? ` — +${formatSEK(material.price)}` : ""}
                </option>
              ))}
            </select>
            {materials.map((material) => {
              const isSelected = selectedMaterial?.id === material.id;
              return (
                <button
                  key={material.id}
                  type="button"
                  onClick={() => setSelectedMaterial(material)}
                  className={`w-full text-left p-3 border transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-wood ring-2 ring-wood bg-stone-light/40"
                      : "border-stone hover:border-stone-dark bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {material.imageUrl ? (
                      <Image src={material.imageUrl} alt="" width={40} height={40} className="w-10 h-10 object-cover border border-black/20 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: material.colorHex || "#5B4433" }} />
                    )}
                    <div>
                      <span className="text-xs font-mono font-bold text-ink block">{material.name}</span>
                      <span className="text-[11px] text-ink/70 font-sans">{material.description || material.supplier}</span>
                    </div>
                  </div>
                  {material.price > 0 && (
                    <span className="text-xs font-mono text-wood font-semibold">+{formatSEK(material.price)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA — Begär Offert instead of add-to-cart */}
      <div className="pt-4 space-y-3">
        {isSold ? (
          <div className="w-full py-4 bg-stone text-center text-ink/50 font-mono text-xs uppercase tracking-wider">
            Detta unika exemplar är sålt
          </div>
        ) : (
          <>
            <Link
              href={`/tjanster?produkt=${encodeURIComponent(product.name)}&pris=${currentPrice}`}
              className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-700 text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Begär Offert för denna Möbel</span>
            </Link>
            <Link
              href="/kontakt"
              className="w-full py-3 px-6 border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              Frågor? Kontakta Oss
            </Link>
          </>
        )}
      </div>

      <div className="border-t border-stone pt-5 space-y-2 text-xs text-ink/75 font-sans leading-relaxed">
        <p><strong className="text-ink">Leverans:</strong> Vi återkommer med leverans eller upphämtning i Danderyd och Storstockholm efter bekräftelse.</p>
        <p><strong className="text-ink">Betalning:</strong> Säker betalning och personlig bekräftelse från Skandiva.</p>
        <p><strong className="text-ink">Frågor om materialet?</strong> Kontakta oss innan du beställer.</p>
      </div>

      {/* Trust Badges */}
      <div className="pt-6 border-t border-stone space-y-3 text-xs font-mono text-ink/80">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-wood" />
          <span>5 års full hantverksgaranti från Skandiva</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-wood" />
          <span>Säker möbeltransport och inbärning i Storstockholm</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-wood" />
          <span>Färdigrenoverad i verkstaden — redo för omgående leverans</span>
        </div>
      </div>
    </div>
  );
};
