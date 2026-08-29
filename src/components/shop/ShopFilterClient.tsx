"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatSEK } from "@/lib/utils";
import { ConditionBadge } from "@/components/ui/Badge";
import { Search } from "lucide-react";

interface ShopFilterClientProps {
  initialProducts: Product[];
}

export const ShopFilterClient: React.FC<ShopFilterClientProps> = ({ initialProducts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "newest">("featured");

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "Alla Möbler" },
    { id: "Fatolj", label: "Fåtöljer" },
    { id: "Soffa", label: "Soffor" },
    { id: "Stol", label: "Stolar" },
    { id: "Tillbehor", label: "Dynsatser & Tillbehör" },
  ];

  const filtered = [...initialProducts]
    .filter((p) => {
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.model.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.basePrice - b.basePrice;
      if (sortBy === "price_desc") return b.basePrice - a.basePrice;
      if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-stone p-4 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`py-2 px-3.5 border transition-all ${
                selectedCategory === c.id
                  ? "bg-ink text-canvas border-ink font-bold"
                  : "bg-canvas text-ink border-stone hover:border-wood"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök formgivare, modell..."
              className="w-full pl-8 pr-3 py-2 bg-canvas border border-stone text-xs font-mono text-ink placeholder:text-ink/40 focus:outline-none focus:border-wood"
            />
            <Search className="w-3.5 h-3.5 text-ink/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "price_asc" | "price_desc" | "newest")}
            className="py-2 px-3 bg-canvas border border-stone text-xs font-mono text-ink focus:outline-none focus:border-wood"
          >
            <option value="featured">Sortera: Utvalda</option>
            <option value="price_asc">Pris: Lägst först</option>
            <option value="price_desc">Pris: Högst först</option>
            <option value="newest">Senast inkommet</option>
          </select>
        </div>
      </div>

      {/* Products Grid — Clean & Borderless (Fanins Style) */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center bg-white/60 border border-stone space-y-2">
          <p className="font-serif text-xl text-ink">Inga möbler matchade din sökning</p>
          <p className="text-xs font-mono text-ink/60">Prova att återställa filter eller söka på ett annat sökord.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/butik/${product.slug}`}
              className="group flex flex-col space-y-3"
            >
              {/* Product Image on Clean Background without outer card borders */}
              <div className="relative aspect-[4/5] sm:aspect-square w-full bg-white/70 overflow-hidden flex items-center justify-center p-2">
                <Image
                  src={product.primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {product.stockStatus === "sald" ? (
                  <div className="absolute top-2 left-2 bg-ink/90 text-canvas font-mono text-[10px] uppercase px-2 py-0.5 font-bold shadow-xs">
                    Såld
                  </div>
                ) : product.conditionGrade ? (
                  <div className="absolute top-2 left-2">
                    <ConditionBadge grade={product.conditionGrade} />
                  </div>
                ) : null}
              </div>

              {/* Product Details (Title & Bold Price) */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-wood/80 block tracking-wider">
                  {product.designer}
                </span>
                <h3 className="font-sans text-xs sm:text-sm font-normal text-ink group-hover:text-wood transition-colors leading-snug line-clamp-2 uppercase">
                  {product.name}
                </h3>
                <div className="pt-1">
                  <span className="font-sans text-sm sm:text-base font-bold text-ink block">
                    {formatSEK(product.basePrice)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
