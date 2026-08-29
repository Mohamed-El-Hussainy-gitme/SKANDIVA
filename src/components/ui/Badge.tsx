import React from "react";
import { ConditionGrade, StockStatus, OrderStatus, QuoteStatus } from "@/types";

interface ConditionBadgeProps {
  grade?: ConditionGrade;
  className?: string;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({ grade, className = "" }) => {
  if (!grade) return null;

  const styleMap: Record<ConditionGrade, string> = {
    "Nyskick": "bg-stone-light text-ink border-stone-dark/50",
    "Utmärkt skick": "bg-[#EAE4D9] text-wood-dark border-stone",
    "Utmarkt skick": "bg-[#EAE4D9] text-wood-dark border-stone",
    "Gott skick": "bg-canvas text-wood border-stone",
    "Vacker patina": "bg-[#E3DAC9] text-wood-dark border-wood/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider border ${
        styleMap[grade] || "bg-canvas text-ink border-stone"
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-wood inline-block" />
      {grade}
    </span>
  );
};

export const StockBadge: React.FC<{ status: StockStatus; className?: string }> = ({ status, className = "" }) => {
  const map: Record<StockStatus, { label: string; bg: string; text: string }> = {
    i_lager: { label: "I lager (Leveransklar)", bg: "bg-[#E6ECE3]", text: "text-[#2D4A27]" },
    bestallningsvara: { label: "Tillverkas på beställning", bg: "bg-[#F3EFE6]", text: "text-wood" },
    sald: { label: "Såld (Klassikerarkiv)", bg: "bg-stone-light", text: "text-ink/60" },
  };

  const item = map[status] || map.i_lager;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${item.bg} ${item.text} border border-black/5 ${className}`}
    >
      {item.label}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus; className?: string }> = ({ status, className = "" }) => {
  const map: Record<OrderStatus, { label: string; color: string; border: string }> = {
    mottagen: { label: "1. Mottagen", color: "bg-stone-light text-ink", border: "border-stone" },
    material_forbereds: { label: "2. Material förbereds", color: "bg-amber-50 text-amber-900", border: "border-amber-200" },
    i_verkstaden: { label: "3. I verkstaden (Tapetsering)", color: "bg-blue-50 text-blue-900", border: "border-blue-200" },
    kvalitetskontroll: { label: "4. Kvalitetskontroll", color: "bg-purple-50 text-purple-900", border: "border-purple-200" },
    redo_for_leverans: { label: "5. Redo för leverans", color: "bg-emerald-50 text-emerald-900", border: "border-emerald-200" },
    levererad: { label: "Slutförd / Levererad", color: "bg-emerald-100 text-emerald-950", border: "border-emerald-300" },
    avbruten: { label: "Avbruten", color: "bg-rose-50 text-rose-900", border: "border-rose-200" },
  };

  const item = map[status] || map.mottagen;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border ${item.color} ${item.border} ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-70 animate-pulse" />
      {item.label}
    </span>
  );
};

export const QuoteStatusBadge: React.FC<{ status: QuoteStatus; className?: string }> = ({ status, className = "" }) => {
  const map: Record<QuoteStatus, { label: string; color: string }> = {
    ny: { label: "Ny förfrågan", color: "bg-amber-100 text-amber-900 border-amber-300" },
    offert_skickad: { label: "Offert skickad", color: "bg-blue-100 text-blue-900 border-blue-300" },
    bekraftad: { label: "Bekräftad av kund", color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
    i_arbete: { label: "I verkstaden", color: "bg-indigo-100 text-indigo-900 border-indigo-300" },
    slufford: { label: "Slutförd", color: "bg-stone-light text-ink/70 border-stone" },
    avvisad: { label: "Avvisad", color: "bg-rose-100 text-rose-900 border-rose-300" },
  };

  const item = map[status] || map.ny;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono border ${item.color} ${className}`}>
      {item.label}
    </span>
  );
};
