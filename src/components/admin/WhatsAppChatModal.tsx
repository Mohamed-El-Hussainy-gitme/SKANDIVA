"use client";

import React, { useState } from "react";
import { MessageSquare, ExternalLink, Save, X, Check, Phone, User } from "lucide-react";

interface WhatsAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceNumber: string; // e.g. OFF-2026-1045 or SKD-2026-8942
  customerName: string;
  customerPhone: string;
  furnitureDetails?: string;
  currentNotes?: string;
  onSaveNotes: (newNotes: string) => Promise<void>;
}

export const WhatsAppChatModal: React.FC<WhatsAppChatModalProps> = ({
  isOpen,
  onClose,
  referenceNumber,
  customerName,
  customerPhone,
  furnitureDetails,
  currentNotes = "",
  onSaveNotes,
}) => {
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  // Clean and format phone number for international WhatsApp URL
  let cleanPhone = customerPhone.replace(/[^0-9+]/g, "");
  if (cleanPhone.startsWith("07")) {
    cleanPhone = "46" + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith("+46")) {
    cleanPhone = cleanPhone.replace("+", "");
  }

  // Pre-filled Swedish response message
  const isQuote = referenceNumber.startsWith("OFF");
  const defaultMessage = isQuote
    ? `Hej ${customerName}! Vi har mottagit er offertförfrågan (${referenceNumber}) gällande renovering av ${furnitureDetails || "er möbel"} hos Skandiva Tapetserarverkstad i Stockholm. Vi vill gärna stämma av materialval och erbjuda kostnadsfri rådgivning.`
    : `Hej ${customerName}! Detta gäller er pågående beställning (${referenceNumber}) hos Skandiva Tapetserarverkstad i Stockholm.`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSaveNotes(notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Kunde inte spara konversationsanteckningar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#F6F3ED] border-2 border-[#5B4433] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-stone pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-full">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-wood font-bold block">
                Direktkommunikation & Logg
              </span>
              <h3 className="font-serif text-xl font-medium text-ink">
                WhatsApp • {referenceNumber}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-ink/60 hover:text-ink p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Context */}
        <div className="bg-canvas border border-stone p-3.5 text-xs font-mono space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-wood" />
            <span className="font-bold text-ink">{customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-wood" />
            <span className="text-ink/80">{customerPhone}</span>
          </div>
          {furnitureDetails && (
            <p className="text-[11px] text-wood pt-1 border-t border-stone/50">
              Möbel: {furnitureDetails}
            </p>
          )}
        </div>

        {/* 1-Click WhatsApp Trigger Button */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase text-wood">
            1. Öppna WhatsApp Konversation
          </label>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Öppna WhatsApp Chat ({customerName})</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
          </a>
        </div>

        {/* Internal Conversation Logger & Agreement Notes */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase text-wood">
            2. Logga Konversation & Överenskommet Pris
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Skriv anteckningar från WhatsApp-dialogen här (t.ex. 'Kunden valde cognacläder, avtalat fast pris 12 500 kr, hämtning bokad tisdag kl 10:00')..."
            className="w-full bg-white border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
          />
        </div>

        {/* Save Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-stone">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone text-xs font-mono text-ink hover:bg-stone-light"
          >
            Stäng
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-ink text-canvas font-mono text-xs uppercase font-semibold hover:bg-wood transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Sparat i systemet!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Spara anteckningar</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
