"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatSEK } from "@/lib/utils";
import { useCart } from "@/lib/store";
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  ArrowLeft, 
  Truck, 
  CheckCircle2
} from "lucide-react";

export default function KassaPage() {
  const router = useRouter();
  const { items, subtotal, taxAmount, totalAmount, taxEnabled, taxRate, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPostalCode, setCustomerPostalCode] = useState("");
  const [customerCity, setCustomerCity] = useState("Stockholm");
  const [workshopNotes, setWorkshopNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"klarna" | "swish" | "kort">("klarna");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          customerPostalCode,
          customerCity,
          paymentMethod,
          items,
          workshopNotes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        setIsSubmitting(false);
        router.push(`/kassa/tack?order=${data.data.orderNumber}`);
      } else {
        alert(data.error || "Ett fel uppstod vid bearbetning av ordern.");
        setIsSubmitting(false);
      }
    } catch {
      alert("Nätverksfel vid sändning av order.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-ink">Din varukorg är tom</h2>
        <p className="text-xs text-ink/70 font-mono">
          Lägg till artiklar i varukorgen innan du går till kassan.
        </p>
        <Link
          href="/butik"
          className="inline-block px-6 py-3 bg-ink text-canvas font-mono text-xs uppercase"
        >
          Till Butiken
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center justify-between border-b border-stone pb-6">
        <Link href="/varukorg" className="inline-flex items-center gap-1 text-xs font-mono text-wood hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka till varukorgen</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-ink/70">
          <Lock className="w-3.5 h-3.5 text-wood" />
          <span>Krypterad & Säker Kassa</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone/60 pb-3">
              <h2 className="font-serif text-xl font-medium text-ink flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-ink text-canvas font-mono text-xs flex items-center justify-center">1</span>
                <span>Leverans- & Kontaktuppgifter</span>
              </h2>
              <span className="text-xs font-mono text-wood">Sverige</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Fullständigt namn *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="t.ex. Henrik Lindqvist"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  E-postadress (för orderbekräftelse & spårning) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="henrik@exempel.se"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Telefonnummer (för avisering) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="070-123 45 67"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Gatuadress *
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Götgatan 48, lgh 1202"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Postnummer *
                </label>
                <input
                  type="text"
                  required
                  value={customerPostalCode}
                  onChange={(e) => setCustomerPostalCode(e.target.value)}
                  placeholder="118 26"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Ort / Postort *
                </label>
                <input
                  type="text"
                  required
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="Stockholm"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Eventuella önskemål till tapetserarmästaren (valfritt)
                </label>
                <textarea
                  rows={2}
                  value={workshopNotes}
                  onChange={(e) => setWorkshopNotes(e.target.value)}
                  placeholder="t.ex. Önskemål om extra matt linoljevax på trädetaljer eller portkod för möbelbud."
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>
            </div>
          </div>

          <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone/60 pb-3">
              <h2 className="font-serif text-xl font-medium text-ink flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-ink text-canvas font-mono text-xs flex items-center justify-center">2</span>
                <span>Välj Betalsätt</span>
              </h2>
              <span className="text-xs font-mono text-wood">Svensk Betalväxel</span>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => setPaymentMethod("klarna")}
                className={`p-4 border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "klarna"
                    ? "border-wood bg-stone-light/70 ring-1 ring-wood"
                    : "border-stone bg-canvas hover:bg-stone-light/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === "klarna" ? "border-wood bg-wood" : "border-stone"
                    }`}
                  >
                    {paymentMethod === "klarna" && <div className="w-1.5 h-1.5 rounded-full bg-canvas" />}
                  </div>
                  <div>
                    <span className="font-serif text-sm font-semibold text-ink">Klarna</span>
                    <p className="text-[11px] text-ink/70 font-sans">
                      Få först. Betala sen inom 30 dagar, eller dela upp räntefritt.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-pink-100 text-pink-900 font-sans font-bold text-xs">Klarna.</span>
              </div>

              <div
                onClick={() => setPaymentMethod("swish")}
                className={`p-4 border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "swish"
                    ? "border-wood bg-stone-light/70 ring-1 ring-wood"
                    : "border-stone bg-canvas hover:bg-stone-light/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === "swish" ? "border-wood bg-wood" : "border-stone"
                    }`}
                  >
                    {paymentMethod === "swish" && <div className="w-1.5 h-1.5 rounded-full bg-canvas" />}
                  </div>
                  <div>
                    <span className="font-serif text-sm font-semibold text-ink">Swish</span>
                    <p className="text-[11px] text-ink/70 font-sans">
                      Direktbetalning säkert via Mobilt BankID i din Swish-app.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-900 font-sans font-bold text-xs">Swish</span>
              </div>

              <div
                onClick={() => setPaymentMethod("kort")}
                className={`p-4 border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "kort"
                    ? "border-wood bg-stone-light/70 ring-1 ring-wood"
                    : "border-stone bg-canvas hover:bg-stone-light/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === "kort" ? "border-wood bg-wood" : "border-stone"
                    }`}
                  >
                    {paymentMethod === "kort" && <div className="w-1.5 h-1.5 rounded-full bg-canvas" />}
                  </div>
                  <div>
                    <span className="font-serif text-sm font-semibold text-ink">Betalkort (VISA / Mastercard)</span>
                    <p className="text-[11px] text-ink/70 font-sans">
                      Säker 3D-Secure kortbetalning med fullt bedrägeriskydd.
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 text-[10px] font-mono text-ink/60">
                  <CreditCard className="w-5 h-5 text-ink/70" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-canvas border-2 border-stone p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif text-2xl text-ink font-normal border-b border-stone pb-4">
              Din Beställning
            </h3>

            <div className="space-y-4 divide-y divide-stone/50 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                  <div className="relative w-14 h-14 bg-stone-light border border-stone shrink-0 overflow-hidden">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=200&q=80"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h4 className="font-serif font-medium text-ink">{item.title}</h4>
                    {item.selectedMaterial && (
                      <p className="text-[11px] text-ink/70">{item.selectedMaterial}</p>
                    )}
                    <div className="flex justify-between font-mono text-[11px] text-ink/80 pt-1">
                      <span>Antal: {item.quantity}</span>
                      <span className="font-bold">{formatSEK(item.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-stone text-xs font-mono">
              <div className="flex justify-between text-ink/80">
                <span>Delsumma artiklar</span>
                <span>{formatSEK(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/60 border-t border-stone/40 pt-1.5">
                <span>{taxEnabled ? `Moms (${Math.round((taxRate || 0) * 100)}% ingår)` : "Moms"}</span>
                <span>{formatSEK(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-xl font-serif font-bold text-ink border-t border-stone pt-3">
                <span>Totalt</span>
                <span className="font-mono">{formatSEK(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Behandlar beställning..." : `Slutför Köp • ${formatSEK(totalAmount)}`}</span>
            </button>

            <div className="space-y-2 pt-2 border-t border-stone text-[11px] font-mono text-ink/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-wood" />
                <span>5 års garanti & Skandiva äkthetssigill ingår</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-wood" />
                <span>Direkt spårning via kundportalen efter beställning</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
