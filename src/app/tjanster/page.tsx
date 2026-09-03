"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Upload, CheckCircle2, X, Loader2 } from "lucide-react";

const FURNITURE_TYPES = [
  "DUX-fåtölj (Karin, Jetson, etc.)",
  "DUX-soffa",
  "Lamino-fåtölj (Swedese)",
  "Bruno Mathsson (Pernilla, etc.)",
  "Annan designfåtölj",
  "Soffa",
  "Stol / Matstolar",
  "Övrigt renoveringsuppdrag",
];

export default function TjansterPage() {
  const [form, setForm] = useState({
    contactName: "",
    email: "",
    phone: "",
    city: "",
    furnitureType: "",
    designerModel: "",
    numberOfPieces: "1",
    fabricPreference: "",
    currentConditionDescription: "",
    dimensions: "",
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setUploadedImages((prev) => [...prev, data.url]);
        } else {
          setError(data.error || "Kunde inte ladda upp en eller flera bilder.");
        }
      }
    } catch {
      setError("Nätverksfel vid bilduppladdning.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          furnitureType: form.furnitureType,
          designerModel: form.designerModel,
          numberOfPieces: Number(form.numberOfPieces) || 1,
          fabricPreference: form.fabricPreference,
          currentConditionDescription: form.currentConditionDescription,
          dimensions: form.dimensions,
          images: uploadedImages,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "Något gick fel. Försök igen.");
      }
    } catch {
      setError("Kunde inte skicka förfrågan. Kontrollera din uppkoppling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900">

      {/* Hero */}
      <section className="bg-stone-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-400">Verkstadstjänster • Södermalm</span>
          <h1 className="font-serif text-5xl sm:text-6xl font-normal">Begär Kostnadsfri Offert</h1>
          <p className="text-stone-300 font-sans text-base max-w-xl mx-auto leading-relaxed">
            Fyll i formuläret nedan och bifoga gärna bilder på din möbel. Vi återkommer med en personlig offert inom 24 timmar.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 mb-4">Vad ingår i vår offert?</h2>
              <ul className="space-y-3">
                {[
                  "Kostnadsfri besiktning och fast prisförslag",
                  "Rådgivning kring läder, fårskinn & tygval",
                  "Byte av bärväv, fjädrar och stoppning",
                  "Stomjustering och trävård vid behov",
                  "5 års full hantverksgaranti",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-sans text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-stone-200 pt-6 space-y-4">
              <h3 className="font-serif text-xl text-stone-900">Våra kärnspecialiteter</h3>
              <div className="space-y-2 text-sm font-mono text-stone-600">
                <p>• DUX (Karin 73, Jetson 69, Spider)</p>
                <p>• Lamino (Yngve Ekström / Swedese)</p>
                <p>• Bruno Mathsson (Pernilla, Mina, Eva)</p>
                <p>• Klassiska fåtöljer &amp; soffor</p>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <p className="text-sm font-sans text-stone-500">
                Vill du prata direkt med en tapetserare?
              </p>
              <Link href="/kontakt" className="inline-flex items-center gap-2 text-stone-900 font-mono text-sm uppercase tracking-wider mt-2 hover:text-stone-600 transition-colors">
                Kontakta oss <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white border border-stone-200 p-12 text-center space-y-4 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-stone-900 mx-auto" />
                <h2 className="font-serif text-3xl text-stone-900">Tack för din förfrågan!</h2>
                <p className="text-stone-600 font-sans max-w-md mx-auto">
                  Vi har mottagit din offertförfrågan samt dina bifogade bilder. Våra tapetserarmästare granskar underlaget och återkommer med ett prisförslag inom 24 timmar.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ contactName: "", email: "", phone: "", city: "", furnitureType: "", designerModel: "", numberOfPieces: "1", fabricPreference: "", currentConditionDescription: "", dimensions: "" });
                    setUploadedImages([]);
                  }}
                  className="mt-4 px-6 py-3 border border-stone-300 text-stone-700 font-mono text-xs uppercase tracking-wider hover:bg-stone-50 transition-colors"
                >
                  Skicka en ny förfrågan
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl text-stone-900">Kontaktuppgifter</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Namn *</label>
                    <input
                      type="text" name="contactName" required value={form.contactName} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                      placeholder="För- och efternamn"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">E-post *</label>
                    <input
                      type="email" name="email" required value={form.email} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                      placeholder="din@email.se"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Telefon *</label>
                    <input
                      type="tel" name="phone" required value={form.phone} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                      placeholder="07X-XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Stad / Område</label>
                    <input
                      type="text" name="city" value={form.city} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                      placeholder="Stockholm"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6">
                  <h3 className="font-serif text-xl text-stone-900 mb-4">Om möbeln</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Möbeltyp *</label>
                    <select
                      name="furnitureType" required value={form.furnitureType} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                    >
                      <option value="">Välj typ...</option>
                      {FURNITURE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Formgivare / Modell</label>
                    <input
                      type="text" name="designerModel" value={form.designerModel} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                      placeholder="Ex: DUX Karin 73 eller Lamino"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Antal exemplar</label>
                    <input
                      type="number" name="numberOfPieces" min="1" value={form.numberOfPieces} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Önskat material</label>
                    <input
                      type="text" name="fabricPreference" value={form.fabricPreference} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                      placeholder="Ex: Fårskinn (grå/vit), Anilinläder cognac, tyg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Beskriv möbelns nuvarande skick *</label>
                  <textarea
                    name="currentConditionDescription" required value={form.currentConditionDescription} onChange={handleChange}
                    rows={4}
                    className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50 resize-none"
                    placeholder="Beskriv t.ex. slitage på läder, lös bärväv, glappa fogar eller om stoppningen sjunkit ihop..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Mått (valfritt)</label>
                  <input
                    type="text" name="dimensions" value={form.dimensions} onChange={handleChange}
                    className="w-full border border-stone-300 px-4 py-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600 bg-stone-50"
                    placeholder="Ex: B 75 × D 80 × H 90 cm"
                  />
                </div>

                {/* Direct Image Upload for Customers */}
                <div className="border-t border-stone-200 pt-6 space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-900 font-bold">
                    Ladda upp bilder på din möbel (valfritt men rekommenderas)
                  </label>
                  <p className="text-xs text-stone-500 font-sans">
                    Bifoga helhetsbild och detaljbilder på slitaget för snabbast och mest exakt prisförslag.
                  </p>

                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="customer-image-upload"
                      disabled={isUploading}
                    />

                    <label
                      htmlFor="customer-image-upload"
                      className={`border-2 border-dashed border-stone-300 hover:border-stone-600 bg-stone-50 p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Laddar upp bild(er)...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-stone-600">
                          <Upload className="w-6 h-6 text-stone-400" />
                          <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                            + Välj eller dra in bilder här
                          </span>
                          <span className="text-[11px] font-sans text-stone-400">
                            JPG, PNG, WEBP, AVIF (Max 15 MB)
                          </span>
                        </div>
                      )}
                    </label>

                    {/* Image Previews */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                        {uploadedImages.map((url, idx) => (
                          <div key={idx} className="relative aspect-square bg-stone-100 border border-stone-200 group">
                            <Image src={url} alt={`Uppladdad bild ${idx + 1}`} fill className="object-cover" sizes="96px" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-stone-900/80 text-white p-1 hover:bg-red-600 transition-colors"
                              title="Ta bort bild"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm font-sans">{error}</p>
                )}

                <button
                  type="submit" disabled={loading || isUploading}
                  className="w-full py-4 bg-stone-900 text-white font-mono text-sm uppercase tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Skickar förfrågan...</span>
                    </>
                  ) : (
                    <>
                      <span>Skicka Offertförfrågan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
