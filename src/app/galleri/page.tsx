import React from "react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { db } from "@/lib/db";
import { GalleryItem } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Galleri (Före & Efter) - Skandiva",
  description: "Se våra tidigare arbeten med möbelrenovering och omklädsel. Vi räddar designklassiker.",
};

export const revalidate = 60; // ISR every 60s

export default async function PublicGalleryPage() {
  let galleryItems: GalleryItem[] = [];
  try {
    galleryItems = await db.getGalleryItems();
  } catch (e) {
    console.error("Failed to load gallery", e);
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* Header */}
      <section className="bg-[#1C1917] text-white pt-20 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#DCD5C8]">
            Hantverksgalleri
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal">
            Före & Efter
          </h1>
          <p className="text-[#F6F3ED]/80 font-sans text-sm sm:text-base max-w-xl mx-auto">
            Här samlar vi några av våra mest omtyckta renoveringsprojekt. Dra i pilarna på bilderna för att
            se förvandlingen från sliten trotjänare till gnistrande klassiker.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        {galleryItems.length === 0 ? (
          <div className="text-center py-20 text-ink/60">
            Galleriet uppdateras för tillfället. Kom tillbaka snart.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {galleryItems.map((item) => (
              <div key={item.id} className="space-y-6">
                <div className="border-[8px] border-white shadow-md bg-white">
                  <BeforeAfterSlider 
                    beforeImage={item.beforeImage} 
                    afterImage={item.afterImage} 
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-serif text-2xl text-ink font-medium">{item.title}</h3>
                  <p className="text-sm font-sans text-ink/70 leading-relaxed max-w-md mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <Link
            href="/begar-offert"
            className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-canvas hover:bg-wood font-mono text-sm uppercase tracking-wider font-bold transition-colors shadow-lg"
          >
            <span>Har du en möbel som behöver räddas? Begär Offert</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
