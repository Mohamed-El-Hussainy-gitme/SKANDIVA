"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/supabase";
import { Order, QuoteRequest } from "@/types";
import { formatSEK } from "@/lib/store";
import { OrderStatusBadge, QuoteStatusBadge } from "@/components/ui/Badge";
import { 
  ShoppingBag, 
  ClipboardList, 
  Hammer, 
  TrendingUp, 
  Building2,
  RefreshCw,
  Loader2
} from "lucide-react";

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string>("");

  const loadData = async () => {
    try {
      const [allOrders, allQuotes] = await Promise.all([
        db.getOrders(),
        db.getQuotes(),
      ]);
      setOrders(allOrders);
      setQuotes(allQuotes);
      setLastSync(new Date().toLocaleTimeString("sv-SE"));
    } catch (e) {
      console.error("Dashboard data fetch failed", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Metric Computations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeWorkshopJobs = orders.filter((o) => 
    o.status === "mottagen" || 
    o.status === "material_forbereds" || 
    o.status === "i_verkstaden" || 
    o.status === "kvalitetskontroll" || 
    o.status === "redo_for_leverans"
  ).length;
  const newQuotesCount = quotes.filter((q) => q.status === "ny" || q.status === "offert_skickad").length;
  const totalOrdersCount = orders.length;

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="border-b border-stone pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-wood">
              Administration & Verkstadsöversikt
            </span>
            {lastSync && (
              <span className="text-[10px] font-mono text-ink/50 bg-stone-light/50 px-2 py-0.5 border border-stone/50">
                Synkad kl {lastSync}
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Översikt • Skandiva Ateljé
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 border border-stone bg-canvas font-mono text-xs uppercase text-ink hover:bg-stone-light flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Synkronisera med databasen"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-wood" : "text-ink"}`} />
            <span>{refreshing ? "Synkar..." : "Synkronisera"}</span>
          </button>
          <Link
            href="/admin/ordrar"
            className="px-4 py-2 bg-ink text-canvas font-mono text-xs uppercase hover:bg-wood transition-colors"
          >
            Hantera Pipeline
          </Link>
          <Link
            href="/admin/produkter"
            className="px-4 py-2 border border-stone bg-canvas font-mono text-xs uppercase text-ink hover:bg-stone-light"
          >
            Ny Produkt
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-xs font-mono text-ink/60 bg-canvas border border-stone">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-wood" />
          Laddar mätvärden från Supabase databas...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-canvas border border-stone p-6 space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs font-mono text-ink/60">
              <span>TOTAL OMSÄTTNING</span>
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {formatSEK(totalRevenue)}
            </div>
            <span className="text-[11px] font-mono text-ink/50 block">Inkl. moms (25%) & frakt</span>
          </div>

          <div className="bg-canvas border border-stone p-6 space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs font-mono text-ink/60">
              <span>PÅGÅENDE I VERKSTAD</span>
              <Hammer className="w-4 h-4 text-wood" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {activeWorkshopJobs} st
            </div>
            <span className="text-[11px] font-mono text-wood block">Tapetsering & sömnad pågår</span>
          </div>

          <div className="bg-canvas border border-stone p-6 space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs font-mono text-ink/60">
              <span>INKOMNA OFFERTER</span>
              <ClipboardList className="w-4 h-4 text-amber-700" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {newQuotesCount} st
            </div>
            <span className="text-[11px] font-mono text-amber-800 block">Väntar på mästarbedömning</span>
          </div>

          <div className="bg-canvas border border-stone p-6 space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs font-mono text-ink/60">
              <span>TOTALT ORDRAR</span>
              <ShoppingBag className="w-4 h-4 text-ink" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {totalOrdersCount} st
            </div>
            <span className="text-[11px] font-mono text-ink/50 block">Butik & Lamino Express</span>
          </div>
        </div>
      )}

      {/* Unified Pipeline Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-canvas border border-stone p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-stone pb-3">
            <h3 className="font-serif text-xl text-ink font-medium">Senaste Ordrar</h3>
            <Link href="/admin/ordrar" className="text-xs font-mono text-wood hover:underline">
              Visa alla ordrar ({orders.length}) →
            </Link>
          </div>

          <div className="divide-y divide-stone/60 overflow-x-auto">
            {orders.length === 0 ? (
              <p className="text-xs font-mono text-ink/50 py-4">Inga ordrar registrerade än.</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{order.orderNumber}</span>
                      <span className="text-ink/60">({order.customerName})</span>
                    </div>
                    <span className="text-[11px] text-wood block">{order.items[0]?.title || "Möbelbeställning"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-bold text-ink">{formatSEK(order.totalAmount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quotes (5 cols) */}
        <div className="lg:col-span-5 bg-canvas border border-stone p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-stone pb-3">
            <h3 className="font-serif text-xl text-ink font-medium">Inkomna Offerter</h3>
            <Link href="/admin/ordrar" className="text-xs font-mono text-wood hover:underline">
              Hantera ({quotes.length}) →
            </Link>
          </div>

          <div className="divide-y divide-stone/60">
            {quotes.length === 0 ? (
              <p className="text-xs font-mono text-ink/50 py-4">Inga offerter inkomna än.</p>
            ) : (
              quotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="py-3 space-y-1 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink">{quote.quoteNumber}</span>
                    <QuoteStatusBadge status={quote.status} />
                  </div>
                  <div className="text-[11px] text-ink/80 flex items-center gap-1.5">
                    {quote.isB2B && <Building2 className="w-3.5 h-3.5 text-wood shrink-0" />}
                    <span>{quote.isB2B ? quote.companyName : quote.contactName} • {quote.furnitureType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
