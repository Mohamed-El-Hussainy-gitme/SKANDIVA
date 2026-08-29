import React from "react";
import type { Metadata } from "next";
import { serverDb } from "@/lib/supabaseServer";
import { LaminoConfigurator } from "@/components/shop/LaminoConfigurator";
import { WorkshopService } from "@/types";

export const revalidate = 60; // ISR every 60 seconds

export const metadata: Metadata = {
  title: "Lamino Express™ Omklädsel Fårskinn (Fast Pris 4 900 kr) | Skandiva Stockholm",
  description:
    "Specialiserad omklädsel och helrenovering av Lamino fåtölj i äkta Skandilock-fårskinn. 10–14 dagars ledtid, 5 års garanti och hämtning i hela Stockholm.",
};

const DEFAULT_LAMINO_SERVICE: WorkshopService = {
  id: "serv-lamino",
  slug: "lamino-express",
  name: "Lamino Express™ Fårskinnsomklädsel",
  shortDescription: "Specialiserad helrenovering av Lamino fåtölj i äkta Skandilock-fårskinn.",
  fullDescription: "Vår mest populära hantverkstjänst. Vi demonterar gammal klädsel, spänner ny förstärkt bärväv, förnyar stoppning och klär om med förstklassigt fårskinn.",
  furnitureType: "Fatolj",
  applicableModels: ["Lamino Fåtölj", "Lamino Fotpall"],
  isFixedPrice: true,
  priceRangeText: "4 900 kr",
  basePrice: 4900,
  turnaroundDays: 14,
  turnaroundText: "10–14 arbetsdagar",
  primaryImage: "/IMG_0948.png",
  materials: [
    {
      id: "mat-grafit",
      name: "Skandinaviskt Fårskinn Grafitgrå (Original)",
      category: "farskinn",
      colorName: "Grafitgrå",
      colorHex: "#6B6A68",
      price: 0,
    },
    {
      id: "mat-offwhite",
      name: "Skandinaviskt Fårskinn Off-White / Naturvit",
      category: "farskinn",
      colorName: "Naturvit",
      colorHex: "#EAE6DF",
      price: 0,
    },
    {
      id: "mat-sahara",
      name: "Skandinaviskt Fårskinn Sahara / Varmbrun",
      category: "farskinn",
      colorName: "Sahara Brun",
      colorHex: "#8C6D58",
      price: 400,
    },
    {
      id: "mat-black",
      name: "Skandinaviskt Fårskinn Kolsvart",
      category: "farskinn",
      colorName: "Kolsvart",
      colorHex: "#222222",
      price: 0,
    },
  ],
  addons: [
    {
      id: "add-stool",
      name: "Omklädsel Lamino Fotpall i matchande fårskinn",
      description: "Ny bärväv och matchande fårskinnsskinn från samma parti.",
      price: 1900,
    },
    {
      id: "add-cushion",
      name: "Original Nackkudde i läder / fårskinn med motvikt",
      description: "Ergonomisk nackkudde för maximal sittkomfort.",
      price: 950,
    },
    {
      id: "add-wood-care",
      name: "Djupgående Trästomsvård & Ytbehandling",
      description: "Rengöring, lätt slipning och vaxning av böjträstomme i ek/bok/valnöt.",
      price: 650,
    },
  ],
  featured: true,
};

export default async function LaminoExpressPage() {
  let service: WorkshopService = DEFAULT_LAMINO_SERVICE;

  try {
    const fetched = await serverDb.getServiceBySlug("lamino-express");
    if (fetched) {
      service = {
        ...DEFAULT_LAMINO_SERVICE,
        ...fetched,
        materials: fetched.materials && fetched.materials.length > 0 ? fetched.materials : DEFAULT_LAMINO_SERVICE.materials,
        addons: fetched.addons && fetched.addons.length > 0 ? fetched.addons : DEFAULT_LAMINO_SERVICE.addons,
      };
    }
  } catch (e) {
    console.error("Failed to load Lamino Express service from DB", e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* ─── Breadcrumb & Title ─── */}
      <div className="border-b border-stone pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Skandiva Verkstad • Fastprisgaranti
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
          {service.name}
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 font-sans max-w-2xl">
          {service.shortDescription}
        </p>
      </div>

      {/* ─── Live Dynamic Configurator ─── */}
      <LaminoConfigurator service={service} />
    </div>
  );
}
