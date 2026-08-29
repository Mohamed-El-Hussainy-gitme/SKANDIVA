import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

write("src/app/spara-order/[id]/page.tsx", """\"use client\";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/supabase";
import { Order, OrderStatus } from "@/types";
import { formatSEK } from "@/lib/store";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { 
  CheckCircle2, 
  Hammer, 
  ArrowLeft,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function OrderTrackingDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const found = await db.getOrderByNumber(params.id);
      setOrder(found || null);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-xs text-ink/70">
        Laddar verkstadsstatus för order {params.id}...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-800 mx-auto" />
        <h2 className="font-serif text-2xl text-ink">Order hittades inte</h2>
        <p className="text-xs font-mono text-ink/70">
          Vi kunde inte hitta någon beställning med nummer "{params.id}".
        </p>
        <Link
          href="/spara-order"
          className="inline-block mt-4 px-4 py-2 bg-ink text-canvas font-mono text-xs uppercase"
        >
          Sök igen
        </Link>
      </div>
    );
  }

  const STAGES: { key: OrderStatus; label: string; stepNumber: number }[] = [
    { key: "mottagen", label: "1. Order Mottagen", stepNumber: 1 },
    { key: "material_forbereds", label: "2. Material & Sömnad", stepNumber: 2 },
    { key: "i_verkstaden", label: "3. I Verkstaden (Tapetsering)", stepNumber: 3 },
    { key: "kvalitetskontroll", label: "4. Kvalitetskontroll", stepNumber: 4 },
    { key: "redo_for_leverans", label: "5. Redo / Levererad", stepNumber: 5 },
  ];

  const getStageIndex = (status: OrderStatus) => {
    if (status === "levererad") return 5;
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx >= 0 ? idx + 1 : 1;
  };

  const currentStageIndex = getStageIndex(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="flex items-center justify-between border-b border-stone pb-6">
        <Link href="/spara-order" className="inline-flex items-center gap-1.5 text-xs font-mono text-wood hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Sök annan order</span>
        </Link>
        <div className="text-right">
          <span className="text-[11px] font-mono text-ink/60 uppercase block">Ordernummer</span>
          <span className="font-mono text-lg font-bold text-ink">{order.orderNumber}</span>
        </div>
      </div>

      <div className="bg-canvas border-2 border-stone p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <span className="text-xs font-mono text-ink/60">
                Uppdaterad: {new Date(order.updatedAt).toLocaleDateString("sv-SE")}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-2">
              Produktionsstatus i Verkstaden
            </h1>
            <p className="text-xs sm:text-sm text-ink/75 font-sans">
              Beställare: <strong className="text-ink">{order.customerName}</strong> • {order.customerCity}
            </p>
          </div>

          <div className="p-4 bg-stone-light/60 border border-stone flex items-center gap-3 shrink-0">
            <CrestSeal size="sm" variant="wood" subtitle="" />
            <div className="text-xs font-mono">
              <span className="text-wood uppercase block text-[10px]">Tilldelad Mästare</span>
              <span className="font-semibold text-ink">{order.assignedUpholsterer || "Mästare Lars Bergström"}</span>
              <span className="text-[10px] text-ink/60 block">Södermalm Ateljé</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-wood font-semibold block">
            Framsteg i Arbetsflödet
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
            {STAGES.map((stage, idx) => {
              const stepNumber = idx + 1;
              const isPast = stepNumber < currentStageIndex;
              const isCurrent = stepNumber === currentStageIndex;

              return (
                <div
                  key={stage.key}
                  className={`p-4 border transition-all ${
                    isCurrent
                      ? "border-wood bg-stone-light/80 ring-2 ring-wood shadow-xs"
                      : isPast
                      ? "border-stone bg-canvas opacity-80"
                      : "border-stone/40 bg-stone-light/20 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-mono flex items-center justify-center font-bold ${
                        isPast
                          ? "bg-wood text-canvas"
                          : isCurrent
                          ? "bg-ink text-canvas animate-pulse"
                          : "bg-stone text-ink/60"
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : stepNumber}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono uppercase bg-wood text-canvas px-1.5 py-0.5 font-bold">
                        PÅGÅR
                      </span>
                    )}
                  </div>
                  <span className="font-serif text-sm font-medium text-ink block leading-snug">
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 bg-stone-light/40 border border-stone space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-wood font-semibold">
              <Hammer className="w-4 h-4" />
              <span>Verkstadslogg & Hantverksanteckning</span>
            </div>
            <p className="text-xs text-ink/80 font-sans leading-relaxed">
              {order.workshopNotes || "Arbetet fortskrider enligt tidsplan. Stommen genomgår fackmässig justering och ny förstärkt bärväv monteras."}
            </p>
          </div>

          <div className="p-5 bg-stone-light/40 border border-stone space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-wood font-semibold">
              <Calendar className="w-4 h-4" />
              <span>Beräknad Slutleverans</span>
            </div>
            <div className="font-serif text-2xl text-ink font-semibold">
              {order.estimatedCompletionDate || "2026-08-31"}
            </div>
            <p className="text-[11px] font-mono text-ink/70">
              Leveranszon: <strong className="text-ink">{order.deliveryZoneName}</strong>
            </p>
          </div>
        </div>
      </div>

      {order.trackingEvents && order.trackingEvents.length > 0 && (
        <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone pb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-wood">Händelselogg</span>
            <h3 className="font-serif text-2xl font-normal text-ink mt-1">Detaljerad Händelsehistorik</h3>
          </div>

          <div className="divide-y divide-stone/60">
            {order.trackingEvents.map((evt) => (
              <div key={evt.id} className="py-4 flex gap-4 items-start">
                <div className="mt-1">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      evt.completed
                        ? "bg-wood border-wood"
                        : evt.active
                        ? "bg-ink border-ink animate-ping"
                        : "bg-canvas border-stone-dark"
                    }`}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-ink text-sm font-serif">{evt.title}</span>
                    <span className="text-ink/60">{evt.timestamp}</span>
                  </div>
                  <p className="text-xs text-ink/75 font-sans">{evt.description}</p>
                  {evt.technicianNote && (
                    <div className="mt-2 p-2.5 bg-stone-light/60 border-l-2 border-wood text-[11px] font-mono text-wood-dark">
                      <strong>Mästarnotering:</strong> {evt.technicianNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-wood">Beställda Artiklar / Tjänster</span>
          <h3 className="font-serif text-2xl font-normal text-ink mt-1">Möbler i Denna Order</h3>
        </div>

        <div className="divide-y divide-stone/60">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-stone-light border border-stone shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=300&q=80"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-ink">{item.title}</h4>
                  {item.designerOrModel && (
                    <span className="text-xs font-mono text-wood block">{item.designerOrModel}</span>
                  )}
                  {item.selectedMaterial && (
                    <span className="text-xs text-ink/70 block">Material: {item.selectedMaterial}</span>
                  )}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <span className="text-[11px] text-wood block">
                      Tillval: {item.selectedAddons.join(", ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right font-mono text-sm font-bold text-ink">
                {formatSEK(item.totalPrice)}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-stone flex justify-between items-center text-xs font-mono text-ink/80">
          <span>Totalt ordervärde (inkl. moms & frakt):</span>
          <span className="font-mono text-base font-bold text-ink">{formatSEK(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
""")
