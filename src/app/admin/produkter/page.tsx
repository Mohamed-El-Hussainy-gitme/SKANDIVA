"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/supabase";
import { Product, FurnitureCategory, ConditionGrade } from "@/types";
import { formatSEK } from "@/lib/store";
import { ConditionBadge } from "@/components/ui/Badge";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminProdukterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [name, setName] = useState("");
  const [designer, setDesigner] = useState("Yngve Ekström");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState<FurnitureCategory>("Fatolj");
  const [basePrice, setBasePrice] = useState<number>(12000);
  const [description, setDescription] = useState("");
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>("Nyskick");
  const [primaryImage, setPrimaryImage] = useState("https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=800&q=80");

  const loadProducts = async () => {
    const list = await db.getProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingProduct(null);
    setName("");
    setDesigner("Yngve Ekström");
    setModel("");
    setCategory("Fatolj");
    setBasePrice(12000);
    setDescription("");
    setConditionGrade("Nyskick");
    setPrimaryImage("https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=800&q=80");
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setIsCreatingNew(false);
    setName(p.name);
    setDesigner(p.designer);
    setModel(p.model);
    setCategory(p.category);
    setBasePrice(p.basePrice);
    setDescription(p.description);
    setConditionGrade(p.conditionGrade || "Nyskick");
    setPrimaryImage(p.primaryImage);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = (name || "produkt").toLowerCase().replace(/[^a-z0-9]/g, "-");

    if (isCreatingNew) {
      const payload = {
        name,
        designer,
        model,
        category,
        categoryNameSwedish: category === "Fatolj" ? "Fåtöljer" : category === "Soffa" ? "Soffor" : "Klassiker",
        basePrice: Number(basePrice),
        description,
        conditionGrade,
        primaryImage,
        slug,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts([data.data, ...products]);
        setIsCreatingNew(false);
      } else {
        alert(data.error || "Kunde inte spara produkten.");
      }
    } else if (editingProduct) {
      const payload = {
        name,
        designer,
        model,
        category,
        basePrice: Number(basePrice),
        description,
        conditionGrade,
        primaryImage,
      };

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? data.data : p)));
        setEditingProduct(null);
      } else {
        alert(data.error || "Kunde inte uppdatera produkten.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Är du säker på att du vill ta bort denna produkt från databasen?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts(products.filter((p) => p.id !== id));
          if (editingProduct?.id === id) setEditingProduct(null);
        } else {
          alert(data.error || "Kunde inte radera produkten.");
        }
      } catch {
        alert("Kunde inte radera produkten från databasen.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-stone pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-wood">
            Katalog- & Varianthantering
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Produkter & Dynsatser
          </h1>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Skapa Ny Produkt</span>
        </button>
      </div>

      {(isCreatingNew || editingProduct) && (
        <form onSubmit={handleSave} className="bg-canvas border-2 border-stone p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex justify-between items-center border-b border-stone pb-3">
            <h3 className="font-serif text-xl font-medium text-ink">
              {isCreatingNew ? "Skapa Ny Produkt i Butiken" : "Redigera: " + editingProduct?.name}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreatingNew(false);
                setEditingProduct(null);
              }}
              className="p-1.5 text-ink hover:text-wood"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-wood mb-1">Produktnamn *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="t.ex. Lamino Fåtölj i Gotlandsfårskinn"
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-xs text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-wood mb-1">Grundpris (SEK) *</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-xs font-mono font-bold text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-wood mb-1">Formgivare *</label>
              <select
                value={designer}
                onChange={(e) => setDesigner(e.target.value)}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-xs text-ink focus:outline-none focus:border-wood"
              >
                <option value="Yngve Ekström">Yngve Ekström (Lamino)</option>
                <option value="Bruno Mathsson">Bruno Mathsson (Pernilla, Karin)</option>
                <option value="DUX">DUX Klassiker</option>
                <option value="Carl Malmsten">Carl Malmsten</option>
                <option value="Josef Frank">Josef Frank / Svenskt Tenn</option>
                <option value="Skandiva Formstudio">Skandiva Formstudio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-wood mb-1">Modell</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="t.ex. Lamino, Pernilla 69"
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-xs text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-wood mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FurnitureCategory)}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-xs text-ink focus:outline-none focus:border-wood"
              >
                <option value="Fatolj">Fåtöljer</option>
                <option value="Soffa">Soffor</option>
                <option value="Stol">Stolar</option>
                <option value="Tillbehor">Dynsatser & Tillbehör</option>
                <option value="Mattor">Mattor & Textil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-wood mb-1">Skick / Gradering</label>
              <select
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value as ConditionGrade)}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-xs text-ink focus:outline-none focus:border-wood"
              >
                <option value="Nyskick">Nyskick (Nyrenoverad)</option>
                <option value="Utmarkt skick">Utmärkt skick</option>
                <option value="Gott skick">Gott skick</option>
                <option value="Vacker patina">Vacker patina</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <ImageUploadField
                label="Produktbild (Omslag) *"
                required
                value={primaryImage}
                onChange={(url) => setPrimaryImage(url)}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-mono uppercase text-wood mb-1">Beskrivning *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-xs text-ink focus:outline-none focus:border-wood"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone">
            <button
              type="button"
              onClick={() => {
                setIsCreatingNew(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 border border-stone text-xs font-mono uppercase text-ink hover:bg-stone-light"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-ink hover:bg-wood text-canvas text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Spara Produkt</span>
            </button>
          </div>
        </form>
      )}

      <div className="bg-canvas border border-stone overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs font-mono divide-y divide-stone">
          <thead className="bg-stone-light/60 text-wood uppercase tracking-wider">
            <tr>
              <th className="p-4">Produkt</th>
              <th className="p-4">Formgivare / Modell</th>
              <th className="p-4">Skick</th>
              <th className="p-4">Varianter</th>
              <th className="p-4">Grundpris</th>
              <th className="p-4 text-right">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone/50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-light/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-stone-light border border-stone shrink-0 overflow-hidden">
                    <Image src={p.primaryImage} alt={p.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-serif text-sm font-semibold text-ink block">{p.name}</span>
                    <span className="text-[11px] text-ink/60">{p.categoryNameSwedish}</span>
                  </div>
                </td>
                <td className="p-4 text-ink">
                  <span className="font-bold block">{p.designer}</span>
                  <span className="text-ink/60">{p.model}</span>
                </td>
                <td className="p-4">
                  {p.conditionGrade && <ConditionBadge grade={p.conditionGrade} />}
                </td>
                <td className="p-4 text-ink">
                  <span>{p.variants?.length || 1} st tyg/skinn</span>
                </td>
                <td className="p-4 font-bold text-ink">
                  {formatSEK(p.basePrice)}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="p-1.5 border border-stone hover:bg-stone-light text-ink transition-colors inline-flex items-center gap-1"
                    title="Redigera"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 border border-rose-200 text-rose-800 hover:bg-rose-50 transition-colors inline-flex items-center gap-1"
                    title="Ta bort"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
