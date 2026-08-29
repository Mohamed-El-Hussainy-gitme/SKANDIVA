"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="border-b border-stone pb-8 space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Skandiva Tapetserarverkstad • Södermalm
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
          Kontakta Verkstaden
        </h1>
        <p className="text-sm sm:text-base text-ink/75 max-w-2xl font-sans">
          Du är alltid varmt välkommen att besöka vår verkstad, lämna in en möbel eller ställa frågor om tyger och restaurering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column (5 cols): Workshop Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-light/40 border border-stone p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone/60 pb-4">
              <CrestSeal size="sm" variant="wood" subtitle="" />
              <div>
                <h3 className="font-serif text-xl font-medium text-ink">Skandiva Stockholm</h3>
                <span className="text-[11px] font-mono text-wood uppercase">Auktoriserad Ateljé</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono text-ink/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">Besöksadress & Inlämning:</strong>
                  <span>Åsögatan 142, 116 24 Stockholm (Södermalm)</span>
                  <span className="block text-[11px] text-ink/60 mt-0.5">Lastzon finns direkt utanför verkstaden</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">Öppettider:</strong>
                  <span>Måndag – Fredag: 08:30 – 17:00</span>
                  <span className="block text-ink/60">Lördag: Enligt tidsbokning</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">Telefon:</strong>
                  <span>08-640 22 90</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">E-post:</strong>
                  <span>kontakt@skandiva.se</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone/60 text-[11px] font-mono text-ink/60">
              <span>Org.nr: 559281-3942 • Momsreg.nr: SE559281394201</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Direct Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-stone pb-4">
              <h3 className="font-serif text-2xl font-normal text-ink">Skicka ett direktmeddelande</h3>
              <p className="text-xs text-ink/70 font-sans mt-1">
                Gäller det offert med bilder rekommenderar vi vårt <Link href="/tjanster/offert" className="text-wood underline">offertformulär</Link>.
              </p>
            </div>

            {sent ? (
              <div className="p-8 bg-stone-light text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-wood mx-auto" />
                <h4 className="font-serif text-xl text-ink">Tack för ditt meddelande!</h4>
                <p className="text-xs text-ink/70 font-mono">Vi återkopplar inom kort.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono uppercase text-ink/70 mb-1">Ditt Namn *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="För- och efternamn"
                    className="w-full bg-canvas border border-stone p-2.5 font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-ink/70 mb-1">E-postadress *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namn@epost.se"
                    className="w-full bg-canvas border border-stone p-2.5 font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-ink/70 mb-1">Ditt Meddelande *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hur kan vi hjälpa dig?"
                    className="w-full bg-canvas border border-stone p-2.5 font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Skicka Meddelande</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
