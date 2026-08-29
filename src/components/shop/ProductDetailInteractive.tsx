"use client";

import React, { useState } from "react";
import { Product, ProductVariant } from "@/types";
import { useCart, formatSEK } from "@/lib/store";
import { ShoppingBag, Check, ShieldCheck, Truck, Clock } from "lucide-react";

interface ProductDetailInteractiveProps {
  product: Product;
}

export const ProductDetailInteractive: React.FC<ProductDetailInteractiveProps> = ({ product }) => {
  const { addItem, setIsDrawerOpen } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [added, setAdded] = useState(false);

  const currentPrice = product.basePrice + (selectedVariant ? selectedVariant.priceDelta : 0);
  const isSold = product.stockStatus === "sald";

  const handleAddToCart = () => {
    if (isSold) return;

    addItem({
      id: `item-${product.id}-${selectedVariant ? selectedVariant.id : "default"}`,
      type: "product",
      referenceId: product.id,
      title: product.name,
      designerOrModel: `${product.designer} • ${product.model}`,
      selectedVariantName: selectedVariant?.name,
      selectedVariantPrice: selectedVariant?.priceDelta,
      quantity: 1,
      unitPrice: currentPrice,
      totalPrice: currentPrice,
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
        <span className="text-xs font-mono text-ink/60">Inkl. 25% svensk moms</span>
      </div>

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-stone">
          <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
            Välj Utförande / Klädsel:
          </label>
          <div className="space-y-2">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`w-full text-left p-3.5 border transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-wood ring-2 ring-wood bg-stone-light/40"
                      : "border-stone hover:border-stone-dark bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: v.fabricColorHex || "#5B4433" }}
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-ink block">{v.name}</span>
                      <span className="text-[11px] text-ink/70 font-sans">{v.materialDescription}</span>
                    </div>
                  </div>
                  {v.priceDelta > 0 && (
                    <span className="text-xs font-mono text-wood font-semibold">+{formatSEK(v.priceDelta)}</span>
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
          <button
            onClick={handleAddToCart}
            className="w-full py-4 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2"
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
        )}
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
