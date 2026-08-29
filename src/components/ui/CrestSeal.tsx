"use client";

import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface CrestSealProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "ink" | "wood" | "light" | "canvas" | "image" | string;
  subtitle?: string;
  className?: string;
  showText?: boolean;
}

const SIZES = {
  xs: { seal: "w-9 h-9", imgSize: 36, text: "text-[7px]" },
  sm: { seal: "w-12 h-12", imgSize: 48, text: "text-[8px]" },
  md: { seal: "w-20 h-20", imgSize: 80, text: "text-[9px]" },
  lg: { seal: "w-28 h-28", imgSize: 112, text: "text-[10px]" },
  xl: { seal: "w-36 h-36", imgSize: 144, text: "text-xs" },
};

export const CrestSeal: React.FC<CrestSealProps> = ({
  size = "md",
  subtitle = "Stockholm",
  className = "",
  showText = false,
}) => {
  const { seal, imgSize, text } = SIZES[size];

  return (
    <div className={clsx("flex flex-col items-center gap-2 select-none", className)}>
      {/* Real High-Res Skandiva Emblem */}
      <div className={clsx(seal, "relative shrink-0 overflow-hidden rounded-full shadow-sm border border-wood/20 bg-[#F6F3ED] flex items-center justify-center")}>
        <Image
          src="/skandiva_classic_logo.png"
          alt="Skandiva Tapetserarverkstad Emblem"
          width={imgSize}
          height={imgSize}
          className="w-full h-full object-cover object-center scale-[1.08] hover:scale-110 transition-transform duration-500"
          priority={size === "sm" || size === "md"}
        />
      </div>

      {showText && (
        <div className="text-center space-y-0.5">
          <p className={clsx(text, "font-serif font-bold tracking-[0.2em] text-ink uppercase")}>
            SKANDIVA
          </p>
          {subtitle && (
            <p className={clsx("font-mono tracking-widest text-wood uppercase", text)}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
