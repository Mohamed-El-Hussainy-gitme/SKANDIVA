"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, FurnitureCategory, ProductCollection } from "@/types";
import { formatSEK } from "@/lib/utils";
import { ConditionBadge } from "@/components/ui/Badge";
import { Search } from "lucide-react";

interface ShopFilterClientProps {
  initialProducts: Product[];
}

const CATEGORIES: { label: string; value: FurnitureCategory | "ALL" }[] = [
  { label: "Alla Klassiker", value: "ALL" },
  { label: "Fåtöljer", value: "Fatolj" },
  { label: "Soffor", value: "Soffa" },
  { label: "Stolar", value: "Stol" },
  { label: "Mattor & Textil", value: "Mattor" },
  { label: "Tillbehör", value: "Tillbehor" },
];

export const ShopFilterClient: React.FC<ShopFilterClientProps> = ({
  initialProducts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    FurnitureCategory | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<ProductCollection | "ALL">("ALL");

  // Filtered product calculation
  const filtered = useMemo(() => {
    return initialProducts.filter((product) => {
      if (selectedCollection !== "ALL" && product.collection !== selectedCollection) {
        return false;
      }
      // Category Filter
      if (
        selectedCategory !== "ALL" &&
        product.category !== selectedCategory
      ) {
        return false;
      }

      // In Stock Filter
      if (inStockOnly && product.stockStatus === "sald") {
        return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesigner = product.designer.toLowerCase().includes(q);
        const matchModel = product.model.toLowerCase().includes(q);
        return matchName || matchDesigner || matchModel;
      }

      return true;
    });
  }, [initialProducts, selectedCategory, searchQuery, inStockOnly, selectedCollection]);

  return (
    <div className="space-y-8">
      {/* Collection navigation */}
      <div className="grid grid-cols-3 border border-stone-200 bg-white">
        {[
          { value: "ALL" as const, label: "Alla produkter", note: "Hela sortimentet" },
          { value: "dux" as const, label: "DUX", note: "Kuddar, väv & klädsel" },
          { value: "lamino" as const, label: "Lamino", note: "Renovering & fårskinn" },
        ].map((collection) => (
          <button key={collection.value} type="button" onClick={() => setSelectedCollection(collection.value)} className={`text-left p-4 sm:p-5 border-r last:border-r-0 border-stone-200 transition-colors ${selectedCollection === collection.value ? "bg-stone-900 text-white" : "hover:bg-stone-50 text-stone-900"}`}>
            <span className="font-serif text-lg sm:text-xl block">{collection.label}</span>
            <span className={`text-[10px] font-mono uppercase tracking-wider mt-1 block ${selectedCollection === collection.value ? "text-stone-300" : "text-stone-500"}`}>{collection.note}</span>
          </button>
        ))}
      </div>

      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white font-bold"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Stock Filter */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Sök formgivare, modell..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-mono bg-white border border-stone-200 focus:outline-none focus:border-stone-500 w-48 sm:w-64"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-stone-600 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-stone-800"
            />
            <span>Endast i lager</span>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center bg-white border border-stone-200 space-y-2">
          <p className="font-serif text-xl text-stone-900">Inga möbler matchade din sökning</p>
          <p className="text-xs font-mono text-stone-500">Prova att återställa filter eller söka på ett annat sökord.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/butik/${product.slug}`}
              className="group flex flex-col space-y-3"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] sm:aspect-square w-full bg-stone-100 overflow-hidden">
                <Image
                  src={product.primaryImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {product.stockStatus === "sald" ? (
                  <div className="absolute top-2 left-2 bg-stone-900/90 text-white font-mono text-[10px] uppercase px-2 py-0.5 font-bold shadow-sm">
                    Såld
                  </div>
                ) : product.conditionGrade ? (
                  <div className="absolute top-2 left-2">
                    <ConditionBadge grade={product.conditionGrade} />
                  </div>
                ) : null}
              </div>

              {/* Product Details */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-stone-500 block tracking-wider">
                  {product.designer}
                </span>
                <h3 className="font-sans text-xs sm:text-sm font-normal text-stone-900 group-hover:text-stone-600 transition-colors leading-snug line-clamp-2 uppercase">
                  {product.name}
                </h3>
                <div className="pt-1">
                  <span className="text-sm sm:text-base font-bold text-stone-900 block font-mono">
                    {formatSEK(product.basePrice)}
                  </span>
                  {product.materialIds?.length > 0 && <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mt-1">Välj material</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
