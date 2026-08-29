import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

write("src/app/admin/ordrar/page.tsx", """\"use client\";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/supabase";
import { Order, QuoteRequest, OrderStatus, QuoteStatus } from "@/types";
import { formatSEK } from "@/lib/store";
import { OrderStatusBadge, QuoteStatusBadge } from "@/components/ui/Badge";
import { 
  ClipboardList, 
  ExternalLink,
  Save,
  Building2
} from "lucide-react";

export default function AdminOrdrarPipelinePage() {
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "quotes">("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const [editingStatus, setEditingStatus] = useState<OrderStatus>("mottagen");
  const [technicianNote, setTechnicianNote] = useState("");
  const [workshopNotes, setWorkshopNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [quotePrice, setQuotePrice] = useState<number | string>("");
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>("ny");

  const loadData = async () => {
    const [allOrders, allQuotes] = await Promise.all([db.getOrders(), db.getQuotes()]);
    setOrders(allOrders);
    setQuotes(allQuotes);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setSelectedQuote(null);
    setEditingStatus(order.status);
    setWorkshopNotes(order.workshopNotes || "");
    setTechnicianNote("");
  };

  const handleSelectQuote = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setSelectedOrder(null);
    setQuoteStatus(quote.status);
    setQuotePrice(quote.quotedPrice || "");
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);

    const stageTitles: Record<OrderStatus, string> = {
      mottagen: "Order Registrerad",
      material_forbereds: "Material & Fårskinn Plockat från Garveri",
      i_verkstaden: "I Verkstaden — Tapetsering & Stomarbete Pågår",
      kvalitetskontroll: "Kvalitetskontroll & Skandiva Sigill",
      redo_for_leverans: "Redo för Leverans / Möbelbud",
      levererad: "Levererad & Slutförd",
      avbruten: "Order Avbruten",
    };

    const updatedEvents = [...(selectedOrder.trackingEvents || [])];
    const newEvent = {
      id: "evt-" + Date.now(),
      status: editingStatus,
      title: stageTitles[editingStatus] || "Statusuppdatering",
      description: "Status ändrad av verkstadsansvarig till " + editingStatus + ".",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      completed: true,
      active: true,
      technicianNote: technicianNote || undefined,
    };

    const updated = await db.updateOrder(selectedOrder.id, {
      status: editingStatus,
      workshopNotes: workshopNotes || selectedOrder.workshopNotes,
      trackingEvents: [newEvent, ...updatedEvents],
    });

    if (updated) {
      setSelectedOrder(updated);
    }
    await loadData();
    setIsUpdating(false);
  };

  const handleUpdateQuote = async () => {
    if (!selectedQuote) return;
    setIsUpdating(true);

    const priceNum = typeof quotePrice === "number" ? quotePrice : parseFloat(String(quotePrice)) || undefined;
    const updated = await db.updateQuoteStatus(selectedQuote.id, quoteStatus, priceNum);

    if (updated) {
      setSelectedQuote(updated);
    }
    await loadData();
    setIsUpdating(false);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-stone pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-wood">
            Verkstadspipeline & Kundspårning
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Enhetlig Order- & Offertkö
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-sans mt-1">
            Uppdateringar här slår direkt igenom på kundens spårningssida (spara-order).
          </p>
        </div>

        <div className="flex bg-canvas border border-stone p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 transition-colors ${activeTab === "all" ? "bg-ink text-canvas font-bold" : "text-ink/70 hover:text-ink"}`}
          >
            Alla ({orders.length + quotes.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-1.5 transition-colors ${activeTab === "orders" ? "bg-ink text-canvas font-bold" : "text-ink/70 hover:text-ink"}`}
          >
            Direkta Ordrar ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`px-3 py-1.5 transition-colors ${activeTab === "quotes" ? "bg-ink text-canvas font-bold" : "text-ink/70 hover:text-ink"}`}
          >
            Offerter ({quotes.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          {(activeTab === "all" || activeTab === "orders") && (
            <div className="bg-canvas border border-stone p-5 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg text-ink font-medium flex items-center justify-between border-b border-stone/60 pb-2">
                <span>Direkta Ordrar (Kassa & Lamino Express)</span>
                <span className="text-xs font-mono text-wood">{orders.length} st</span>
              </h3>

              <div className="divide-y divide-stone/50">
                {orders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => handleSelectOrder(ord)}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-stone-light/80 border-l-4 border-wood"
                          : "hover:bg-stone-light/30"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-ink">{ord.orderNumber}</span>
                          <span className="text-xs text-ink/70 font-sans">({ord.customerName})</span>
                        </div>
                        <span className="text-[11px] font-mono text-wood block">
                          {ord.items[0]?.title || "Möbel"} • {ord.deliveryZoneName}
                        </span>
                      </div>

                      <div className="text-right space-y-1">
                        <OrderStatusBadge status={ord.status} />
                        <span className="font-mono text-xs font-bold text-ink block">
                          {formatSEK(ord.totalAmount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "quotes") && (
            <div className="bg-canvas border border-stone p-5 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg text-ink font-medium flex items-center justify-between border-b border-stone/60 pb-2">
                <span>Offertförfrågningar (Bespoke & B2B)</span>
                <span className="text-xs font-mono text-wood">{quotes.length} st</span>
              </h3>

              <div className="divide-y divide-stone/50">
                {quotes.map((q) => {
                  const isSelected = selectedQuote?.id === q.id;
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleSelectQuote(q)}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-stone-light/80 border-l-4 border-wood"
                          : "hover:bg-stone-light/30"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-ink">{q.quoteNumber}</span>
                          {q.isB2B && <span className="px-1.5 py-0.5 bg-wood text-canvas text-[9px] font-mono uppercase">B2B</span>}
                          <span className="text-xs text-ink/70 font-sans">({q.isB2B ? q.companyName : q.contactName})</span>
                        </div>
                        <span className="text-[11px] font-mono text-wood block">
                          {q.designerModel || q.furnitureType} ({q.numberOfPieces} st)
                        </span>
                      </div>

                      <div className="text-right space-y-1">
                        <QuoteStatusBadge status={q.status} />
                        {q.quotedPrice && (
                          <span className="font-mono text-xs font-bold text-ink block">
                            Offert: {formatSEK(q.quotedPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 sticky top-6">
          {selectedOrder ? (
            <div className="bg-canvas border-2 border-stone p-6 space-y-6 shadow-md">
              <div className="flex justify-between items-start border-b border-stone pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-wood tracking-widest block">
                    Orderinspektör
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-ink">
                    {selectedOrder.orderNumber}
                  </h3>
                  <span className="text-xs font-sans text-ink/70">{selectedOrder.customerName} • {selectedOrder.customerEmail}</span>
                </div>
                <Link
                  href={`/spara-order/${selectedOrder.orderNumber}`}
                  target="_blank"
                  className="p-2 border border-stone hover:bg-stone-light text-ink text-xs font-mono flex items-center gap-1"
                  title="Öppna kundens spårningsvy"
                >
                  <span>Kundvy</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3 bg-stone-light/40 border border-stone p-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
                  Ändra Produktionsstatus (Uppdaterar Spårning)
                </label>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-mono font-bold text-ink focus:outline-none focus:border-wood"
                >
                  <option value="mottagen">1. Mottagen / Registrerad</option>
                  <option value="material_forbereds">2. Material förbereds</option>
                  <option value="i_verkstaden">3. I Verkstaden (Tapetsering pågår)</option>
                  <option value="kvalitetskontroll">4. Kvalitetskontroll & Sigill</option>
                  <option value="redo_for_leverans">5. Redo för leverans / Möbelbud</option>
                  <option value="levererad">Slutförd / Levererad</option>
                  <option value="avbruten">Avbruten</option>
                </select>

                <div>
                  <label className="block text-[11px] font-mono text-ink/70 mb-1">
                    Lägg till mästarnotering för kunden (valfritt)
                  </label>
                  <input
                    type="text"
                    value={technicianNote}
                    onChange={(e) => setTechnicianNote(e.target.value)}
                    placeholder="t.ex. Fårskinnsparti #SK-902 färdigmonterat på stommen."
                    className="w-full bg-canvas border border-stone p-2 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <button
                  onClick={handleUpdateOrderStatus}
                  disabled={isUpdating}
                  className="w-full py-3 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? "Uppdaterar spårning..." : "Spara Ny Status"}</span>
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono text-ink/80 pt-2 border-t border-stone/60">
                <div className="flex justify-between">
                  <span className="text-wood">Leveranszon:</span>
                  <span>{selectedOrder.deliveryZoneName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-wood">Gatuadress:</span>
                  <span>{selectedOrder.customerAddress}, {selectedOrder.customerCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-wood">Betalsätt:</span>
                  <span className="uppercase">{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-stone/40">
                  <span>Totalt:</span>
                  <span>{formatSEK(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          ) : selectedQuote ? (
            <div className="bg-canvas border-2 border-stone p-6 space-y-6 shadow-md">
              <div className="border-b border-stone pb-3">
                <span className="text-[10px] font-mono uppercase text-wood tracking-widest block">
                  Offertinspektör
                </span>
                <h3 className="font-serif text-2xl font-semibold text-ink">
                  {selectedQuote.quoteNumber}
                </h3>
                <span className="text-xs font-sans text-ink/70">
                  {selectedQuote.isB2B ? selectedQuote.companyName : selectedQuote.contactName} ({selectedQuote.email})
                </span>
              </div>

              <div className="space-y-2 text-xs font-sans bg-stone-light/40 border border-stone p-4">
                <div>
                  <strong className="font-mono text-wood block uppercase text-[10px]">Möbel & Antal:</strong>
                  <span>{selectedQuote.designerModel || selectedQuote.furnitureType} ({selectedQuote.numberOfPieces} st)</span>
                </div>
                <div>
                  <strong className="font-mono text-wood block uppercase text-[10px]">Kundens beskrivning:</strong>
                  <p className="text-ink/80 italic mt-0.5">"{selectedQuote.currentConditionDescription}"</p>
                </div>
                <div>
                  <strong className="font-mono text-wood block uppercase text-[10px]">Önskat material:</strong>
                  <span>{selectedQuote.fabricPreference}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-wood font-semibold mb-1">
                    Offertstatus
                  </label>
                  <select
                    value={quoteStatus}
                    onChange={(e) => setQuoteStatus(e.target.value as QuoteStatus)}
                    className="w-full bg-canvas border border-stone p-2.5 text-xs font-mono font-semibold text-ink focus:outline-none focus:border-wood"
                  >
                    <option value="ny">Ny förfrågan</option>
                    <option value="offert_skickad">Offert skickad till kund</option>
                    <option value="bekraftad">Bekräftad av kund</option>
                    <option value="i_arbete">I verkstaden</option>
                    <option value="slufford">Slutförd</option>
                    <option value="avvisad">Avvisad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-wood font-semibold mb-1">
                    Offererat Pris (SEK)
                  </label>
                  <input
                    type="number"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="t.ex. 38400"
                    className="w-full bg-canvas border border-stone p-2.5 text-xs font-mono font-bold text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <button
                  onClick={handleUpdateQuote}
                  disabled={isUpdating}
                  className="w-full py-3 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? "Sparar..." : "Spara Offertuppdatering"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-canvas border border-dashed border-stone p-8 text-center text-xs font-mono text-ink/60 space-y-2">
              <ClipboardList className="w-8 h-8 text-wood mx-auto" />
              <span>Klicka på en order eller offert i listan för att inspektera och uppdatera status.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
""")
