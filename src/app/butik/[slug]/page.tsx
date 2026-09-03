import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serverDb } from "@/lib/db";
import { ProductDetailInteractive } from "@/components/shop/ProductDetailInteractive";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { formatSEK } from "@/lib/utils";

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

  const relatedProducts = (await serverDb.getProducts())
    .filter((item) => item.id !== product.id && item.collection === product.collection)
    .slice(0, 4);
  const materials = product.materialIds.length > 0
    ? (await serverDb.getMaterials()).filter((material) => product.materialIds.includes(material.id))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <nav aria-label="Brödsmulor" className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-stone-500">
        <Link href="/" className="hover:text-stone-900">Hem</Link>
        <span aria-hidden="true">/</span>
        <Link href="/butik" className="hover:text-stone-900">Butik</Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-stone-900">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <ProductGallery product={product} />

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
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
              {product.name}
            </h1>
            <span className="inline-block text-xs font-mono text-ink/70">
              Kategori: {product.categoryNameSwedish || product.category}
            </span>
          </div>

          {/* Interactive Pricing & Swatch Selector */}
            <ProductDetailInteractive product={product} materials={materials} />

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

      {relatedProducts.length > 0 && (
        <section className="border-t border-stone pt-10 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-wood">Samma kollektion</span>
              <h2 className="font-serif text-3xl text-ink mt-1">Fler modeller</h2>
            </div>
            <Link href="/butik" className="text-xs font-mono uppercase tracking-wider text-wood hover:text-ink">Till butiken</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/butik/${item.slug}`} className="group space-y-2">
                <div className="relative aspect-square overflow-hidden bg-canvas border border-stone">
                  <Image src={item.primaryImage} alt={item.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-serif text-base text-ink leading-tight">{item.name}</h3>
                <p className="font-mono text-xs text-wood">{formatSEK(item.basePrice)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
