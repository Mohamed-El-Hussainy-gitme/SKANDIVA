"use client";
import { formatSEK } from "@/lib/utils";
import React, { useState } from "react";
import Image from "next/image";
import { Product, Material } from "@/types";
import { useCart } from "@/lib/store";
import { ShoppingBag, Check, ShieldCheck, Truck, Clock } from "lucide-react";

interface ProductDetailInteractiveProps {
  product: Product;
  materials?: Material[];
}

export const ProductDetailInteractive: React.FC<ProductDetailInteractiveProps> = ({ product, materials = [] }) => {
  const { addItem, setIsDrawerOpen } = useCart();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const currentPrice = product.basePrice + (selectedMaterial?.price || 0);
  const isSold = product.stockStatus === "sald";

  const handleAddToCart = () => {
    if (isSold) return;

    addItem({
      id: `item-${product.id}-${selectedMaterial ? selectedMaterial.id : "default"}`,
      type: "product",
      referenceId: product.id,
      title: product.name,
      designerOrModel: `${product.designer} • ${product.model}`,
      selectedMaterial: selectedMaterial?.name,
      quantity,
      unitPrice: currentPrice,
      totalPrice: currentPrice * quantity,
      image: product.primaryImage,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsDrawerOpen(true);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl sm:text-4xl text-ink font-bold">
          {formatSEK(currentPrice)}
        </span>
        <span className="text-xs font-mono text-ink/60">{product.materialIds.length > 0 ? "Material väljs nedan" : "Pris enligt vald produkt"}</span>
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
              {materials.map((material) => <option key={material.id} value={material.id}>{material.name}{material.price > 0 ? ` — +${formatSEK(material.price)}` : ""}</option>)}
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

      {/* Add to Cart Button */}
      <div className="pt-4">
        {isSold ? (
          <button
            disabled
            className="w-full py-4 bg-stone text-ink/50 font-mono text-xs uppercase tracking-wider cursor-not-allowed"
          >
            Detta unika exemplar är sålt
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between border border-stone bg-canvas mb-3">
              <span className="px-4 text-xs font-mono uppercase tracking-wider text-ink/70">Antal</span>
              <div className="flex items-center">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-11 w-11 text-lg text-ink hover:bg-stone-light" aria-label="Minska antal">-</button>
                <span className="w-10 text-center font-mono text-sm">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} className="h-11 w-11 text-lg text-ink hover:bg-stone-light" aria-label="Öka antal">+</button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={Boolean(materials.length) && !selectedMaterial}
              className="w-full py-4 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-stone disabled:text-ink/50 disabled:cursor-not-allowed"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tillagd i varukorgen!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Köp Möbel & Gå Till Kassan</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      <div className="border-t border-stone pt-5 space-y-2 text-xs text-ink/75 font-sans leading-relaxed">
        <p><strong className="text-ink">Leverans:</strong> Vi återkommer med leverans eller upphämtning på Södermalm efter beställning.</p>
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
