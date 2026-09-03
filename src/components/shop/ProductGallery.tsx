"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Product } from "@/types";
import { ConditionBadge } from "@/components/ui/Badge";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = useMemo(() => {
    const items = [product.primaryImage, ...(product.galleryImages || [])].filter(Boolean) as string[];
    return Array.from(new Set(items));
  }, [product.galleryImages, product.primaryImage]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) {
    return (
      <div className="relative aspect-[4/3] w-full bg-[#F6F3ED] border border-stone overflow-hidden shadow-sm flex items-center justify-center text-stone-400 font-mono text-xs uppercase tracking-wider">
        Ingen bild tillgänglig
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-[4/3] w-full bg-[#F6F3ED] border border-stone overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group absolute inset-0 cursor-zoom-in"
            aria-label={`Öppna bild ${selectedIndex + 1} för ${product.name}`}
          >
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </button>

          {product.stockStatus === "sald" ? (
            <div className="absolute top-3 left-3 bg-ink text-canvas font-mono text-[10px] uppercase px-3 py-1 font-bold shadow-md">
              Såld — Arkivexemplar
            </div>
          ) : product.conditionGrade ? (
            <div className="absolute top-3 left-3">
              <ConditionBadge grade={product.conditionGrade} />
            </div>
          ) : null}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-[4/3] border overflow-hidden bg-white transition-all ${
                  idx === selectedIndex ? "border-stone-900 ring-2 ring-stone-200" : "border-stone hover:border-stone-dark"
                }`}
                aria-label={`Visa bild ${idx + 1}`}
              >
                <Image src={img} alt={`${product.name} vy ${idx + 1}`} fill className="object-cover" sizes="(max-width: 640px) 25vw, 15vw" />
                {idx === 0 && (
                  <span className="absolute left-1 bottom-1 bg-black/70 text-white text-[8px] font-mono uppercase px-1.5 py-0.5">
                    Huvudbild
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Stäng bildvisning"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Visa föregående bild"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="relative h-[82vh] w-[min(92vw,1200px)] overflow-hidden rounded-sm bg-black">
            <Image
              src={selectedImage}
              alt={`${product.name} — zoomad bild`}
              fill
              className="object-contain"
              priority
              sizes="90vw"
            />
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Visa nästa bild"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
