"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatSEK } from "@/lib/store";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    totalAmount,
    selectedZone,
    isDrawerOpen,
    setIsDrawerOpen,
    removeItem,
    updateQuantity,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-canvas border-l border-stone flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-stone flex items-center justify-between bg-stone-light/60">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-wood">Skandiva Stockholm</span>
              <h2 className="font-serif text-xl font-semibold text-ink">
                Varukorg ({itemCount} {itemCount === 1 ? "artikel" : "artiklar"})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-ink hover:text-wood transition-colors"
              aria-label="Stäng varukorg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-light flex items-center justify-center mb-4 text-wood">
                  <svg className="w-8 h-8 stroke-current fill-none" viewBox="0 0 24 24">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg text-ink font-medium">Din varukorg är tom</h3>
                <p className="text-xs text-ink/70 mt-1 max-w-xs">
                  Utforska våra renoverade designklassiker eller boka vår populära Lamino Express tjänst.
                </p>
                <div className="mt-6 flex flex-col gap-2 w-full">
                  <Link
                    href="/butik"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2.5 px-4 bg-ink text-canvas font-mono text-xs uppercase tracking-wider text-center hover:bg-wood transition-colors"
                  >
                    Till Butiken
                  </Link>
                  <Link
                    href="/tjanster/lamino-express"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2.5 px-4 border border-wood text-wood font-mono text-xs uppercase tracking-wider text-center hover:bg-wood hover:text-canvas transition-colors"
                  >
                    Lamino Express
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-stone-light border border-stone shrink-0 overflow-hidden">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=300&q=80"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-medium text-ink leading-snug">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-ink/40 hover:text-rose-700 transition-colors p-1"
                          title="Ta bort"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.designerOrModel && (
                        <p className="text-[11px] font-mono text-wood">{item.designerOrModel}</p>
                      )}

                      {item.selectedVariantName && (
                        <p className="text-[11px] text-ink/70 mt-0.5">
                          Val: <span className="font-medium">{item.selectedVariantName}</span>
                        </p>
                      )}

                      {item.selectedMaterial && (
                        <p className="text-[11px] text-ink/70 mt-0.5">
                          Material: <span className="font-medium">{item.selectedMaterial}</span>
                        </p>
                      )}

                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="mt-1">
                          <span className="text-[10px] font-mono text-wood uppercase">Tillval:</span>
                          <ul className="text-[10px] text-ink/80 list-disc list-inside">
                            {item.selectedAddons.map((addon, idx) => (
                              <li key={idx}>{addon}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone/30">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone bg-canvas">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-light text-ink transition-colors"
                          aria-label="Minska antal"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-xs text-ink">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-light text-ink transition-colors"
                          aria-label="Öka antal"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-mono text-sm font-semibold text-ink">
                        {formatSEK(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone bg-stone-light/40 space-y-4">
              {/* Delivery info snippet */}
              <div className="flex items-center justify-between text-xs font-mono text-ink/70">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-wood" />
                  {selectedZone?.name || "Stockholm"}
                </span>
                <span>{(selectedZone?.surcharge || 0) === 0 ? "Ingår (0 kr)" : formatSEK(selectedZone?.surcharge || 0)}</span>
              </div>

              {/* Subtotal & Total */}
              <div className="space-y-1.5 pt-2 border-t border-stone/60">
                <div className="flex justify-between text-xs text-ink/70">
                  <span>Delsumma (inkl. 25% moms)</span>
                  <span className="font-mono">{formatSEK(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-ink">
                  <span>Totalt</span>
                  <span className="font-mono">{formatSEK(totalAmount)}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/varukorg"
                  onClick={() => setIsDrawerOpen(false)}
                  className="py-3 px-3 border border-stone bg-canvas hover:bg-stone-light text-ink text-center font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Visa Varukorg
                </Link>
                <Link
                  href="/kassa"
                  onClick={() => setIsDrawerOpen(false)}
                  className="py-3 px-3 bg-ink hover:bg-wood text-canvas text-center font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Till Kassan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-ink/60 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-wood" />
                <span>Trygg betalning via Klarna, Swish & Kort</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
