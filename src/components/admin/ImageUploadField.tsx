"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  aspectRatio?: string;
  placeholder?: string;
}

const PRESET_ASSETS = [
  { name: "Lamino Fårskinn (IMG_0948)", url: "/IMG_0948.png" },
  { name: "Pernilla Cognac (IMG_0611)", url: "/IMG_0611.jpeg" },
  { name: "Karin Svart Läder (IMG_8045)", url: "/IMG_8045.jpeg" },
  { name: "Pernilla Rost (IMG_1236)", url: "/IMG_1236.png" },
  { name: "DUX Ingrid Fåtölj", url: "/furniture-easy-chair-ingrid-low-beech-steelcut-trio-pie-2-stool-scaled-e1745318977341.jpg" },
  { name: "Showroom Ateljé 1", url: "/artilleriet-store-4.jpg" },
  { name: "Showroom Ateljé 2", url: "/artilleriet-store-21.jpg" },
  { name: "Skandiva Sigill", url: "/skandiva_classic_logo.png" },
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = "Produktbild / Omslag",
  required = false,
  aspectRatio = "aspect-[4/3]",
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onChange(data.url);
        setCustomUrl(data.url);
      } else {
        setError(data.error || "Uppladdning misslyckades.");
      }
    } catch {
      setError("Nätverksfel vid bilduppladdning.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-ink/80">
          <span>{label} {required && <span className="text-wood font-bold">*</span>}</span>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setCustomUrl("");
              }}
              className="text-[11px] text-rose-700 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Ta bort bild
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border border-stone text-xs font-mono bg-canvas">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "upload" ? "bg-ink text-canvas font-bold" : "text-ink/70 hover:bg-stone-light/40"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Ladda upp från dator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 transition-colors border-x border-stone ${
            activeTab === "presets" ? "bg-ink text-canvas font-bold" : "text-ink/70 hover:bg-stone-light/40"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Välj från galleri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "url" ? "bg-ink text-canvas font-bold" : "text-ink/70 hover:bg-stone-light/40"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Bild-URL</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 border border-stone bg-white/70 space-y-3">
        {activeTab === "upload" && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              className="hidden"
              id={`file-upload-${label}`}
            />
            <label
              htmlFor={`file-upload-${label}`}
              className="border-2 border-dashed border-stone hover:border-wood p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-canvas hover:bg-stone-light/30 text-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 text-wood animate-spin" />
                  <span className="text-xs font-mono text-ink">Laddar upp bild till servern...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-7 h-7 text-wood" />
                  <span className="text-xs font-mono font-semibold text-ink">
                    Klicka här för att välja fil (JPG, PNG, WEBP)
                  </span>
                  <span className="text-[11px] font-sans text-ink/60">
                    Max filstorlek: 8 MB
                  </span>
                </>
              )}
            </label>
          </div>
        )}

        {activeTab === "presets" && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-ink/70 block">
              Klicka på en bild ur verkstadsarkivet för att välja den:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
              {PRESET_ASSETS.map((asset) => {
                const isSelected = value === asset.url;
                return (
                  <button
                    key={asset.url}
                    type="button"
                    onClick={() => {
                      onChange(asset.url);
                      setCustomUrl(asset.url);
                    }}
                    className={`relative aspect-[4/3] border text-left overflow-hidden group transition-all ${
                      isSelected ? "border-wood ring-2 ring-wood" : "border-stone hover:border-stone-dark"
                    }`}
                  >
                    <Image
                      src={asset.url}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-ink/80 text-canvas text-[9px] font-mono p-1 truncate">
                      {asset.name}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-wood text-canvas p-0.5 rounded-full shadow-sm">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... eller /IMG_0948.png"
                className="flex-1 px-3 py-2 border border-stone text-xs font-mono bg-canvas focus:outline-none focus:border-wood"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-ink text-canvas font-mono text-xs uppercase hover:bg-wood transition-colors"
              >
                Använd
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs font-mono text-rose-700">{error}</p>
        )}
      </div>

      {/* Live Preview Thumbnail */}
      {value && (
        <div className="flex items-center gap-4 p-3 bg-canvas border border-stone">
          <div className={`relative w-20 h-20 ${aspectRatio} shrink-0 border border-stone overflow-hidden bg-white shadow-xs`}>
            <Image
              src={value}
              alt="Förhandsgranskning"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[10px] font-mono uppercase text-wood font-bold block">
              Vald bild:
            </span>
            <p className="text-xs font-mono text-ink truncate select-all">{value}</p>
            <span className="text-[10px] font-mono text-ink/50 block">✓ Redo att sparas</span>
          </div>
        </div>
      )}
    </div>
  );
};
