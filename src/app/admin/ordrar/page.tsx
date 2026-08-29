"use client";

import React, { useEffect, useState } from "react";
import { Order, QuoteRequest, OrderStatus, QuoteStatus } from "@/types";
import { formatSEK } from "@/lib/store";
import { OrderStatusBadge, QuoteStatusBadge } from "@/components/ui/Badge";
import { WhatsAppChatModal } from "@/components/admin/WhatsAppChatModal";
import { 
  ClipboardList, 
  Save,
  MessageSquare,
  Loader2
} from "lucide-react";

export default function AdminOrdrarPipelinePage() {
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "quotes">("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const [editingStatus, setEditingStatus] = useState<OrderStatus>("mottagen");
  const [technicianNote, setTechnicianNote] = useState("");
  const [workshopNotes, setWorkshopNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [quotePrice, setQuotePrice] = useState<number | string>("");
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>("ny");

  // WhatsApp modal state
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppTarget, setWhatsAppTarget] = useState<{
    referenceNumber: string;
    customerName: string;
    customerPhone: string;
    furnitureDetails?: string;
    notes?: string;
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resOrders, resQuotes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/quotes"),
      ]);
      const [ordersData, quotesData] = await Promise.all([
        resOrders.json(),
        resQuotes.json(),
      ]);
      if (resOrders.ok && ordersData.success) {
        setOrders(ordersData.data || []);
      }
      if (resQuotes.ok && quotesData.success) {
        setQuotes(quotesData.data || []);
      }
    } catch (e) {
      console.error("Failed to load pipeline data:", e);
    } finally {
      setLoading(false);
    }
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

  const handleOpenWhatsAppForQuote = (quote: QuoteRequest) => {
    setWhatsAppTarget({
      referenceNumber: quote.quoteNumber,
      customerName: quote.isB2B ? `${quote.contactName} (${quote.companyName})` : quote.contactName,
      customerPhone: quote.phone,
      furnitureDetails: `${quote.designerModel || quote.furnitureType} (${quote.numberOfPieces} st)`,
      notes: quote.notes,
    });
    setWhatsAppModalOpen(true);
  };

  const handleOpenWhatsAppForOrder = (order: Order) => {
    setWhatsAppTarget({
      referenceNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      furnitureDetails: order.items[0]?.title || "Möbelbeställning",
      notes: order.workshopNotes,
    });
    setWhatsAppModalOpen(true);
  };

  const handleSaveWhatsAppNotes = async (newNotes: string) => {
    if (!whatsAppTarget) return;

    try {
      if (whatsAppTarget.referenceNumber.startsWith("OFF") && selectedQuote) {
        const res = await fetch(`/api/quotes/${selectedQuote.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: newNotes }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSelectedQuote(data.data);
        }
      } else if (selectedOrder) {
        const res = await fetch(`/api/orders/${selectedOrder.orderNumber}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workshopNotes: newNotes }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSelectedOrder(data.data);
        }
      }
      await loadData();
    } catch {
      alert("Kunde inte spara WhatsApp-anteckningar.");
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editingStatus,
          technicianNote: technicianNote.trim(),
          workshopNotes: workshopNotes.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSelectedOrder(data.data);
        await loadData();
      } else {
        alert(data.error || "Kunde inte uppdatera orderstatus.");
      }
    } catch {
      alert("Nätverksfel vid uppdatering av order.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateQuote = async () => {
    if (!selectedQuote) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: quoteStatus,
          quotedPrice: quotePrice ? Number(quotePrice) : undefined,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSelectedQuote(data.data);
        await loadData();
      } else {
        alert(data.error || "Kunde inte uppdatera offerten.");
      }
    } catch {
      alert("Nätverksfel vid uppdatering av offert.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-wood">
            Verkstadens Orderflöde & Ärendehantering
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Pipeline & Ärendeinspektion
          </h1>
        </div>

        <div className="flex border border-stone text-xs font-mono bg-canvas">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-3 ${activeTab === "all" ? "bg-ink text-canvas font-bold" : "text-ink hover:bg-stone-light"}`}
          >
            Alla ({orders.length + quotes.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-3 border-x border-stone ${activeTab === "orders" ? "bg-ink text-canvas font-bold" : "text-ink hover:bg-stone-light"}`}
          >
            Ordrar ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`py-2 px-3 ${activeTab === "quotes" ? "bg-ink text-canvas font-bold" : "text-ink hover:bg-stone-light"}`}
          >
            Offerter ({quotes.length})
          </button>
        </div>
      </div>

      {/* Main Grid: List on Left, Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Pipeline List */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-xs font-mono text-ink/60 bg-canvas border border-stone">
              <Loader2 className="w-5 h-5 animate-spin mr-2 text-wood" />
              Laddar pipeline från databasen...
            </div>
          ) : (
            <div className="space-y-3">
              {/* Orders */}
              {(activeTab === "all" || activeTab === "orders") && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-wood block">
                    Klara Beställningar (Butik & Lamino Express)
                  </span>
                  {orders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className={`p-4 bg-canvas border transition-all cursor-pointer shadow-xs ${
                          isSelected
                            ? "border-wood ring-2 ring-wood bg-stone-light/40"
                            : "border-stone hover:border-stone-dark"
                        }`}
                      >
                        <div className="flex justify-between items-start text-xs font-mono mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink">{order.orderNumber}</span>
                            <span className="text-ink/60">({order.customerName})</span>
                          </div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-ink/70">
                          <span className="truncate max-w-[280px]">{order.items[0]?.title || "Möbler"}</span>
                          <span className="font-bold text-ink">{formatSEK(order.totalAmount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quotes */}
              {(activeTab === "all" || activeTab === "quotes") && (
                <div className="space-y-2 pt-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-wood block">
                    Inkomna Offertförfrågningar (Skräddarsytt & B2B)
                  </span>
                  {quotes.map((quote) => {
                    const isSelected = selectedQuote?.id === quote.id;
                    return (
                      <div
                        key={quote.id}
                        onClick={() => handleSelectQuote(quote)}
                        className={`p-4 bg-canvas border transition-all cursor-pointer shadow-xs ${
                          isSelected
                            ? "border-wood ring-2 ring-wood bg-stone-light/40"
                            : "border-stone hover:border-stone-dark"
                        }`}
                      >
                        <div className="flex justify-between items-start text-xs font-mono mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink">{quote.quoteNumber}</span>
                            <span className="text-ink/60">
                              {quote.isB2B ? quote.companyName : quote.contactName}
                            </span>
                          </div>
                          <QuoteStatusBadge status={quote.status} />
                        </div>
                        <div className="flex justify-between items-center text-xs font-sans text-ink/70">
                          <span>{quote.designerModel || quote.furnitureType} ({quote.numberOfPieces} st)</span>
                          <span className="font-mono text-wood font-semibold">
                            {quote.quotedPrice ? `${formatSEK(quote.quotedPrice)}` : "Offert ej satt"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Inspector & Actions */}
        <div className="lg:col-span-5 sticky top-20 space-y-6">
          {selectedOrder ? (
            <div className="bg-canvas border-2 border-stone p-6 space-y-6 shadow-md">
              <div className="border-b border-stone pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase text-wood tracking-widest block">
                    Orderinspektör
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-ink">
                    {selectedOrder.orderNumber}
                  </h3>
                  <span className="text-xs font-sans text-ink/70">
                    Kund: {selectedOrder.customerName} ({selectedOrder.customerPhone})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppForOrder(selectedOrder)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase flex items-center gap-1.5 shadow-sm"
                  title="Öppna WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Status Update Control */}
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase text-wood font-semibold">
                  Ändra Verkstadsfas (Tracking)
                </label>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-mono font-semibold text-ink focus:outline-none focus:border-wood"
                >
                  <option value="mottagen">1. Mottagen & Registrerad</option>
                  <option value="material_forbereds">2. Material & Bärväv Förbereds</option>
                  <option value="i_verkstaden">3. I Verkstaden (Tapetsering pågår)</option>
                  <option value="kvalitetskontroll">4. Kvalitetskontroll & Slutfinish</option>
                  <option value="redo_for_leverans">5. Redo för Leverans / Möbelbud</option>
                  <option value="levererad">6. Levererad & Slutförd</option>
                </select>

                <div>
                  <label className="block text-xs font-mono uppercase text-wood font-semibold mb-1">
                    Teknikeranteckning för denna fas (Syns för kund i spårning)
                  </label>
                  <input
                    type="text"
                    value={technicianNote}
                    onChange={(e) => setTechnicianNote(e.target.value)}
                    placeholder="t.ex. 'Gotlandsfårskinn monterat, rengöring av bokstomme påbörjad.'"
                    className="w-full bg-stone-light/30 border border-stone p-2 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-wood font-semibold mb-1">
                    Interna Verkstadsanteckningar
                  </label>
                  <textarea
                    rows={2}
                    value={workshopNotes}
                    onChange={(e) => setWorkshopNotes(e.target.value)}
                    placeholder="Interna anteckningar för mästarna..."
                    className="w-full bg-stone-light/30 border border-stone p-2 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <button
                  onClick={handleUpdateOrderStatus}
                  disabled={isUpdating}
                  className="w-full py-3 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? "Uppdaterar fas..." : "Spara Ny Fas & Meddela Spårning"}</span>
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
              <div className="border-b border-stone pb-3 flex justify-between items-start">
                <div>
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

                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppForQuote(selectedQuote)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase flex items-center gap-1.5 shadow-sm"
                  title="Öppna WhatsApp Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="space-y-2 text-xs font-sans bg-stone-light/40 border border-stone p-4">
                <div>
                  <strong className="font-mono text-wood block uppercase text-[10px]">Möbel & Antal:</strong>
                  <span>{selectedQuote.designerModel || selectedQuote.furnitureType} ({selectedQuote.numberOfPieces} st)</span>
                </div>
                <div>
                  <strong className="font-mono text-wood block uppercase text-[10px]">Kundens beskrivning:</strong>
                  <p className="text-ink/80 italic mt-0.5">&ldquo;{selectedQuote.currentConditionDescription}&rdquo;</p>
                </div>
                <div>
                  <strong className="font-mono text-wood block uppercase text-[10px]">Önskat material:</strong>
                  <span>{selectedQuote.fabricPreference || "Ej angivet"}</span>
                </div>
                {selectedQuote.notes && (
                  <div className="pt-2 border-t border-stone/50">
                    <strong className="font-mono text-emerald-800 block uppercase text-[10px]">Sparad konversation / Anteckning:</strong>
                    <p className="text-xs font-mono text-ink whitespace-pre-line mt-0.5">{selectedQuote.notes}</p>
                  </div>
                )}
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
                  className="w-full py-3 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? "Sparar..." : "Spara Offertuppdatering"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-canvas border border-dashed border-stone p-8 text-center text-xs font-mono text-ink/60 space-y-2">
              <ClipboardList className="w-8 h-8 text-wood mx-auto" />
              <span>Klicka på en order eller offert i listan för att inspektera och öppna WhatsApp eller ändra status.</span>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Modal */}
      {whatsAppTarget && (
        <WhatsAppChatModal
          isOpen={whatsAppModalOpen}
          onClose={() => setWhatsAppModalOpen(false)}
          referenceNumber={whatsAppTarget.referenceNumber}
          customerName={whatsAppTarget.customerName}
          customerPhone={whatsAppTarget.customerPhone}
          furnitureDetails={whatsAppTarget.furnitureDetails}
          currentNotes={whatsAppTarget.notes}
          onSaveNotes={handleSaveWhatsAppNotes}
        />
      )}
    </div>
  );
}
