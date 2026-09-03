"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, CheckCircle2, Upload, X, Loader2 } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          setError(data.error || "Kunde inte ladda upp bilden.");
        }
      }
    } catch {
      setError("Nätverksfel vid bilduppladdning.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idxToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Also register as a quote/inquiry in the database so admin sees it in the pipeline
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: name,
          email,
          phone: phone || "Ej angivet",
          city: "Stockholm",
          furnitureType: "Allmän kontaktförfrågan",
          numberOfPieces: 1,
          currentConditionDescription: message,
          images: uploadedImages,
        }),
      });

      setSent(true);
    } catch {
      setError("Kunde inte skicka meddelandet. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-stone-200 pb-4">
        <h3 className="font-serif text-2xl font-normal text-stone-900">Skicka ett direktmeddelande</h3>
        <p className="text-xs text-stone-500 font-sans mt-1">
          Vill du ha en detaljerad offert med specifikationer kan du även använda vårt{" "}
          <Link href="/begar-offert" className="text-stone-900 underline font-semibold">
            offertformulär
          </Link>.
        </p>
      </div>

      {sent ? (
        <div className="p-8 bg-stone-50 border border-stone-200 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-stone-900 mx-auto" />
          <h4 className="font-serif text-xl text-stone-900">Tack för ditt meddelande!</h4>
          <p className="text-xs text-stone-600 font-mono">Vi återkopplar till dig inom 24 timmar.</p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setName("");
              setEmail("");
              setPhone("");
              setMessage("");
              setUploadedImages([]);
            }}
            className="mt-3 px-4 py-2 text-xs font-mono border border-stone-300 hover:bg-white transition-colors"
          >
            Skicka ett nytt meddelande
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase text-stone-500 mb-1">Ditt Namn *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="För- och efternamn"
              className="w-full bg-stone-50 border border-stone-300 p-3 font-sans text-stone-900 focus:outline-none focus:border-stone-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase text-stone-500 mb-1">E-postadress *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@epost.se"
                className="w-full bg-stone-50 border border-stone-300 p-3 font-sans text-stone-900 focus:outline-none focus:border-stone-600"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-stone-500 mb-1">Telefon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07X-XXX XX XX"
                className="w-full bg-stone-50 border border-stone-300 p-3 font-sans text-stone-900 focus:outline-none focus:border-stone-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase text-stone-500 mb-1">Ditt Meddelande *</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Beskriv din möbel eller vad du har för frågor..."
              className="w-full bg-stone-50 border border-stone-300 p-3 font-sans text-stone-900 focus:outline-none focus:border-stone-600 resize-none"
            />
          </div>

          {/* Customer Image Upload */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label className="block font-mono uppercase text-stone-700 text-[11px] font-bold">
              Bifoga bilder på möbeln (valfritt)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="contact-file-upload"
              disabled={isUploading}
            />

            <label
              htmlFor="contact-file-upload"
              className={`border border-dashed border-stone-300 hover:border-stone-600 bg-stone-50 p-4 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? (
                <div className="flex items-center gap-2 text-stone-600 font-mono text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Laddar upp bild...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-stone-600 font-mono text-xs">
                  <Upload className="w-4 h-4 text-stone-400" />
                  <span>+ Välj eller bifoga bilder</span>
                </div>
              )}
            </label>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square bg-stone-100 border border-stone-200 group">
                    <Image src={url} alt={`Bild ${idx + 1}`} fill className="object-cover" sizes="64px" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-stone-900/80 text-white p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-xs font-sans">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-8 py-3.5 bg-stone-900 hover:bg-stone-700 text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Skickar...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Skicka Meddelande</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
