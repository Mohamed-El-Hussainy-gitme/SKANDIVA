import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { serverDb } from "@/lib/supabaseServer";
import { ProductDetailInteractive } from "@/components/shop/ProductDetailInteractive";
import { ConditionBadge } from "@/components/ui/Badge";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // ISR every 60s

export async function generateStaticParams() {
  try {
    const products = await serverDb.getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await serverDb.getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Möbel ej hittad — Skandiva Stockholm",
    };
  }

  return {
    title: `${product.name} av ${product.designer} — Skandiva Stockholm`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} • Skandiva Tapetserarverkstad`,
      description: product.description,
      images: [
        {
          url: product.primaryImage,
          width: 1200,
          height: 900,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await serverDb.getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Link */}
      <div>
        <Link
          href="/butik"
          className="inline-flex items-center gap-2 text-xs font-mono text-wood hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka till butikssortimentet</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full bg-[#F6F3ED] border border-stone overflow-hidden shadow-sm">
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.stockStatus === "sald" ? (
              <div className="absolute top-3 left-3 bg-ink text-canvas font-mono text-xs uppercase px-3 py-1 font-bold shadow-md">
                Såld — Arkivexemplar
              </div>
            ) : product.conditionGrade ? (
              <div className="absolute top-3 left-3">
                <ConditionBadge grade={product.conditionGrade} />
              </div>
            ) : null}
          </div>

          {/* Thumbnail Gallery */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] border border-stone overflow-hidden bg-white">
                  <Image src={img} alt={`${product.name} vy ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Provenance Crest */}
          <div className="p-6 bg-canvas border border-stone flex items-center gap-4">
            <CrestSeal size="md" variant="ink" />
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-wood block">
                Skandiva Ateljéstämpel
              </span>
              <p className="font-serif text-sm text-ink font-medium">
                {product.provenanceCrestText || "Helrenoverad & Certifierad av Skandiva Tapetserarverkstad"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Info & Interactive Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-stone pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-wood font-semibold">
              {product.designer} • {product.model}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
              {product.name}
            </h1>
            <span className="inline-block text-xs font-mono text-ink/70">
              Kategori: {product.categoryNameSwedish || product.category}
            </span>
          </div>

          {/* Interactive Pricing & Swatch Selector */}
          <ProductDetailInteractive product={product} />

          {/* Description & Historical Context */}
          <div className="space-y-4 pt-6 border-t border-stone text-xs font-sans text-ink/85 leading-relaxed">
            <div>
              <h3 className="font-mono uppercase text-wood font-semibold mb-1">Beskrivning</h3>
              <p>{product.description}</p>
            </div>

            {product.historicalContext && (
              <div>
                <h3 className="font-mono uppercase text-wood font-semibold mb-1">Designhistoria</h3>
                <p className="italic text-ink/75">{product.historicalContext}</p>
              </div>
            )}

            {product.dimensions && (
              <div>
                <h3 className="font-mono uppercase text-wood font-semibold mb-1">Mått & Specifikation</h3>
                <p className="font-mono text-[11px] text-ink">{product.dimensions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
