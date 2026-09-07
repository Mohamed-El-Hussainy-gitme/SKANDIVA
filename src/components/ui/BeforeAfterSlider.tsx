"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "F�RE (Sliten original)",
  afterLabel = "EFTER (Skandiva Restaurering)",
  title,
  description,
  className = "",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-wood">Hantverksdokumentation</span>
          <h3 className="font-serif text-2xl text-ink font-normal">{title}</h3>
          {description && <p className="text-sm text-ink/70 mt-1">{description}</p>}
        </div>
      )}

      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-none border border-stone bg-canvas select-none cursor-ew-resize group shadow-sm"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (Underneath, full width) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={afterImage}
            alt="Efter restaurering"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 right-4 bg-ink/90 text-canvas text-[11px] font-mono tracking-wider px-3 py-1 uppercase backdrop-blur-sm border border-stone/30">
            {afterLabel}
          </div>
        </div>

        {/* BEFORE IMAGE (Clipped to sliderPosition) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}>
            <Image
              src={beforeImage}
              alt="F�re restaurering"
              fill
              className="object-cover grayscale brightness-90 contrast-95"
            />
            <div className="absolute bottom-4 left-4 bg-wood/90 text-canvas text-[11px] font-mono tracking-wider px-3 py-1 uppercase backdrop-blur-sm border border-stone/30">
              {beforeLabel}
            </div>
          </div>
        </div>

        {/* SLIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-canvas shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-ink text-canvas border-2 border-canvas flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <svg
              className="w-4 h-4 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-ink/60">
        <span>? Dra reglaget f�r att j�mf�ra f�re & efter</span>
        <span>Skandiva Atelj�arkiv</span>
      </div>
    </div>
  );
};
