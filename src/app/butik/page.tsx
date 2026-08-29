import React from "react";
import type { Metadata } from "next";
import { serverDb } from "@/lib/supabaseServer";
import { ShopFilterClient } from "@/components/shop/ShopFilterClient";
import { Product } from "@/types";

export const revalidate = 60; // ISR every 60 seconds

export const metadata: Metadata = {
  title: "Butik — Renoverade Skandinaviska Designklassiker | Skandiva Stockholm",
  description:
    "Utforska vårt handplockade sortiment av helrenoverade klassiker som Lamino, Bruno Mathsson Pernilla och DUX Karin. Klädda för hand i svenskt fårskinn och anilinläder.",
};

export default async function ButikPage() {
  let products: Product[] = [];
  try {
    products = await serverDb.getProducts();
  } catch (e) {
    console.error("Failed to load products for Butik page", e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-stone pb-8 space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Skandiva Ateljé & Butik • Södermalm
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
          Vår Butik & Renoverade Klassiker
        </h1>
        <p className="text-sm text-ink/75 font-sans max-w-2xl leading-relaxed">
          Alla möbler i vår butik är varsamt totalrenoverade av våra tapetserare med nya bärvävar, stoppningar och förstklassiga fårskinn eller läder. Redo för omgående leverans i hela Sverige.
        </p>
      </div>

      {/* Interactive Catalog */}
      <ShopFilterClient initialProducts={products} />
    </div>
  );
}
