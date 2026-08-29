"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QuoteRequest } from "@/types";
import { 
  Building2, 
  User, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  FileText
} from "lucide-react";

export default function OffertPage() {
  const [isB2B, setIsB2B] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const city = "Stockholm";
  const [furnitureType, setFurnitureType] = useState("Fatolj");
  const [designerModel, setDesignerModel] = useState("");
  const [numberOfPieces, setNumberOfPieces] = useState(1);
  const [fabricPreference, setFabricPreference] = useState("");
  const [currentConditionDescription, setCurrentConditionDescription] = useState("");
  const dimensions = "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isB2B,
          companyName: isB2B ? companyName : undefined,
          orgNumber: isB2B ? orgNumber : undefined,
          contactName,
          email,
          phone,
          city,
          furnitureType,
          designerModel: designerModel || "Ej specificerad",
          numberOfPieces: Number(numberOfPieces) || 1,
          fabricPreference: fabricPreference || "Enligt rekommendation från mästare",
          currentConditionDescription,
          dimensions: dimensions || undefined,
          images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
          ],
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedQuote(data.data);
      } else {
        alert(data.error || "Ett fel uppstod vid sändning av offertförfrågan.");
      }
    } catch {
      alert("Nätverksfel vid sändning av offertförfrågan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-stone pb-8 text-center space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Skandiva Offertförfrågan & Rådgivning
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
          Begär kostnadsfri offert för möbeltapetsering
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 max-w-xl mx-auto font-sans">
          Fyll i formuläret så återkommer vår tapetserarmästare med en fast prisuppskattning och materialförslag inom 24 timmar.
        </p>
      </div>

      {submittedQuote ? (
        <div className="bg-stone-light/60 border-2 border-wood/50 p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-wood text-canvas flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-wood">
              Förfrågan Mottagen
            </span>
            <h2 className="font-serif text-3xl text-ink">Tack för din förfrågan, {submittedQuote.contactName}!</h2>
            <p className="text-xs font-mono text-ink/70">
              Ditt referensnummer: <strong className="text-ink font-bold">{submittedQuote.quoteNumber}</strong>
            </p>
          </div>

          <div className="bg-canvas border border-stone p-6 max-w-md mx-auto text-left text-xs font-mono space-y-2 text-ink/80">
            <div className="flex justify-between border-b border-stone/50 pb-2">
              <span className="text-wood uppercase">Typ:</span>
              <span className="font-semibold">{submittedQuote.isB2B ? "Företag / B2B" : "Privatperson"}</span>
            </div>
            <div className="flex justify-between border-b border-stone/50 pb-2">
              <span className="text-wood uppercase">Möbel:</span>
              <span>{submittedQuote.designerModel || submittedQuote.furnitureType} ({submittedQuote.numberOfPieces} st)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wood uppercase">Status:</span>
              <span className="text-wood font-semibold">Registrerad i verkstadsdatabasen</span>
            </div>
          </div>

          <p className="text-xs text-ink/70 font-sans max-w-md mx-auto">
            Vår verkstadsansvarige granskar specifikationen och skickar en detaljerad offert till <span className="font-semibold text-ink">{submittedQuote.email}</span>.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-ink text-canvas font-mono text-xs uppercase tracking-wider hover:bg-wood transition-colors"
            >
              Till Startsidan
            </Link>
            <button
              onClick={() => setSubmittedQuote(null)}
              className="px-6 py-3 border border-stone bg-canvas font-mono text-xs uppercase text-ink hover:bg-stone-light"
            >
              Skicka en ny förfrågan
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-canvas border border-stone p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
              1. Vem gäller förfrågan?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsB2B(false)}
                className={`p-4 border flex items-center justify-center gap-3 transition-all ${
                  !isB2B
                    ? "border-wood bg-stone-light/70 ring-1 ring-wood font-semibold text-ink"
                    : "border-stone bg-canvas text-ink/70 hover:bg-stone-light/30"
                }`}
              >
                <User className="w-4 h-4 text-wood" />
                <span className="font-serif text-sm">Privatperson / Enstaka möbel</span>
              </button>

              <button
                type="button"
                onClick={() => setIsB2B(true)}
                className={`p-4 border flex items-center justify-center gap-3 transition-all ${
                  isB2B
                    ? "border-wood bg-stone-light/70 ring-1 ring-wood font-semibold text-ink"
                    : "border-stone bg-canvas text-ink/70 hover:bg-stone-light/30"
                }`}
              >
                <Building2 className="w-4 h-4 text-wood" />
                <span className="font-serif text-sm">Företag / B2B / Arkitekt</span>
              </button>
            </div>
          </div>

          {isB2B && (
            <div className="p-4 bg-stone-light/40 border border-stone space-y-4 animate-in fade-in">
              <span className="font-mono text-xs uppercase tracking-wider text-wood font-semibold block">
                Företagsuppgifter
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                    Företagsnamn *
                  </label>
                  <input
                    type="text"
                    required={isB2B}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="t.ex. Arkitektbyrå AB"
                    className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                    Organisationsnummer
                  </label>
                  <input
                    type="text"
                    value={orgNumber}
                    onChange={(e) => setOrgNumber(e.target.value)}
                    placeholder="556XXX-XXXX"
                    className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
              2. Kontaktuppgifter
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Ditt Namn *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="För- och efternamn"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  E-postadress *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namn@epost.se"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Telefonnummer *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="070-123 45 67"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
              3. Om möbeln / Projektet
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Typ av möbel *
                </label>
                <select
                  value={furnitureType}
                  onChange={(e) => setFurnitureType(e.target.value)}
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                >
                  <option value="Fatolj">Fåtölj</option>
                  <option value="Soffa">Soffa</option>
                  <option value="Stol">Stolar / Matstolar</option>
                  <option value="Kontorsmobel">Kontors- & Konferensmöbler</option>
                  <option value="Ovrigt">Annat / Specialprojekt</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Formgivare / Modell (om känd)
                </label>
                <input
                  type="text"
                  value={designerModel}
                  onChange={(e) => setDesignerModel(e.target.value)}
                  placeholder="t.ex. Bruno Mathsson Pernilla, DUX Karin"
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                  Antal föremål *
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={numberOfPieces}
                  onChange={(e) => setNumberOfPieces(Number(e.target.value))}
                  className="w-full bg-canvas border border-stone p-2.5 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                Önskemål om material / Tyg (fårskinn, anilinläder, ull, linne)
              </label>
              <input
                type="text"
                value={fabricPreference}
                onChange={(e) => setFabricPreference(e.target.value)}
                placeholder="t.ex. Mörkbrunt anilinläder, Gotlandsfårskinn eller Kvadrat Hallingdal"
                className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-ink/70 mb-1">
                Beskrivning av möbelns nuvarande skick & eventuella skador *
              </label>
              <textarea
                rows={4}
                required
                value={currentConditionDescription}
                onChange={(e) => setCurrentConditionDescription(e.target.value)}
                placeholder="Beskriv om stommen glappar, om spiralfjädrar/bärband är trasiga eller om det enbart gäller nytt tyg/läder."
                className="w-full bg-canvas border border-stone p-2.5 text-xs font-sans text-ink focus:outline-none focus:border-wood"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
              4. Bifoga bilder på möbeln (rekommenderas)
            </label>
            <div className="border-2 border-dashed border-stone p-6 text-center hover:border-wood transition-colors bg-stone-light/20 cursor-pointer">
              <UploadCloud className="w-8 h-8 text-wood mx-auto mb-2" />
              <span className="font-serif text-sm text-ink block font-medium">Klicka för att ladda upp bilder</span>
              <span className="text-[11px] font-mono text-ink/60 block mt-0.5">JPG, PNG upp till 10 MB per bild</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-ink/70">
              <ShieldCheck className="w-4 h-4 text-wood shrink-0" />
              <span>Kostnadsfri offert utan förbindelse inom 24 timmar</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>{isSubmitting ? "Skickar förfrågan..." : "Skicka Offertförfrågan"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
