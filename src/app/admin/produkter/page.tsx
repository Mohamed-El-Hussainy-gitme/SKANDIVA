"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Product, FurnitureCategory, ConditionGrade, ProductCollection, Material } from "@/types";
import { formatSEK } from "@/lib/utils";
import { ConditionBadge } from "@/components/ui/Badge";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const CATEGORY_MAP: Record<FurnitureCategory, string> = {
  Fatolj: "Fåtöljer",
  Soffa: "Soffor",
  Stol: "Stolar",
  Mattor: "Mattor",
  Tillbehor: "Tillbehör",
};

const emptyForm = {
  name: "",
  designer: "",
  model: "",
  category: "Fatolj" as FurnitureCategory,
  collection: "none" as ProductCollection,
  basePrice: 12000,
  description: "",
  historicalContext: "",
  dimensions: "",
  provenanceCrestText: "",
  conditionGrade: "Nyskick" as ConditionGrade,
  stockStatus: "i_lager" as Product["stockStatus"],
  featured: false,
  primaryImage: "",
  galleryImages: [] as string[],
  materialIds: [] as string[],
  beforeImage: "",
  afterImage: "",
};

export default function AdminProdukterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState<ProductCollection | "all">("all");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [productsRes, materialsRes] = await Promise.all([fetch("/api/products"), fetch("/api/materials?includeInactive=1")]);
      const [productsData, materialsData] = await Promise.all([productsRes.json(), materialsRes.json()]);
      setProducts(productsData.success ? productsData.data : []);
      setMaterials(materialsData.success ? materialsData.data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingProduct(null);
    setForm({ ...emptyForm });
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setIsCreatingNew(false);
    setForm({
      name: p.name,
      designer: p.designer,
      model: p.model,
      category: p.category,
      collection: p.collection || "none",
      basePrice: p.basePrice,
      description: p.description,
      historicalContext: p.historicalContext || "",
      dimensions: p.dimensions || "",
      provenanceCrestText: p.provenanceCrestText || "",
      conditionGrade: p.conditionGrade || "Nyskick",
      stockStatus: p.stockStatus,
      featured: Boolean(p.featured),
      primaryImage: p.primaryImage,
      galleryImages: p.galleryImages || [],
      materialIds: p.materialIds || [],
      beforeImage: p.beforeImage || "",
      afterImage: p.afterImage || "",
    });
  };

  const handleCancel = () => { setIsCreatingNew(false); setEditingProduct(null); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "basePrice" ? Number(value) : value }));
  };

  const addGalleryImage = (url: string) => {
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, url] }));
  };

  const removeGalleryImage = (idx: number) => {
    setForm((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== idx) }));
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { alert("Namn krävs."); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        categoryNameSwedish: CATEGORY_MAP[form.category],
        stockStatus: form.stockStatus,
      };

      if (isCreatingNew) {
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
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ta bort denna möbel från butiken? Åtgärden kan inte ångras.")) return;
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
      alert("Nätverksfel — försök igen.");
    }
  };

  const visibleProducts = products.filter((product) => collectionFilter === "all" || product.collection === collectionFilter);

  return (
    <div className="p-6 max-w-6xl space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Butik — Renoverade Möbler</h1>
          <p className="text-stone-500 font-sans text-sm mt-1">
            Hantera helrenoverade möbler som säljs i butiken.
          </p>
        </div>
        <button onClick={handleStartCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-stone-700 transition-colors">
          <Plus className="w-4 h-4" /> Ny möbel till butiken
        </button>
      </div>

      {/* Form */}
      {(isCreatingNew || editingProduct) && (
        <form onSubmit={handleSave} className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-stone-200 pb-4">
            <h2 className="font-serif text-xl text-stone-900">
              {isCreatingNew ? "Ny möbel i butiken" : `Redigera: ${editingProduct?.name}`}
            </h2>
            <button type="button" onClick={handleCancel} className="text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Namn *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50"
                placeholder="Ex: Lamino Fåtölj i Oljad Bok" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Formgivare</label>
              <input type="text" name="designer" value={form.designer} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50"
                placeholder="Ex: Yngve Ekström" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Modell</label>
              <input type="text" name="model" value={form.model} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50"
                placeholder="Ex: Lamino" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Kategori</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50">
                {Object.entries(CATEGORY_MAP).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Kollektion / specialsida</label>
              <select name="collection" value={form.collection} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50">
                <option value="none">Ingen kollektion</option>
                <option value="lamino">Lamino</option>
                <option value="dux">DUX</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Pris i butiken (kr) *</label>
              <input type="number" name="basePrice" value={form.basePrice} onChange={handleChange} min="0" required
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Skick / Patina</label>
              <select name="conditionGrade" value={form.conditionGrade} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50">
                {["Nyskick", "Utmärkt skick", "Gott skick", "Vacker patina"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Beskrivning</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50 resize-none"
              placeholder="Beskrivning av möbelns skick, material, stoppning och renovering..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Designhistoria</label>
              <textarea name="historicalContext" value={form.historicalContext} onChange={handleChange} rows={3} className="w-full border border-stone-300 px-4 py-3 text-sm bg-stone-50 resize-none" placeholder="Historik och formgivare..." />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Mått & specifikation</label>
              <textarea name="dimensions" value={form.dimensions} onChange={handleChange} rows={3} className="w-full border border-stone-300 px-4 py-3 text-sm bg-stone-50 resize-none" placeholder="Bredd, höjd, djup..." />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Lagerstatus</label>
              <select name="stockStatus" value={form.stockStatus} onChange={handleChange} className="w-full border border-stone-300 px-4 py-3 text-sm bg-stone-50">
                <option value="i_lager">I lager</option>
                <option value="bestallningsvara">Beställningsvara</option>
                <option value="sald">Såld / arkiv</option>
              </select>
            </div>
            <label className="flex items-center gap-3 text-xs font-mono text-stone-600 pt-8 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4 accent-stone-800" />
              Visa som utvald på startsidan
            </label>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Text stämpel Skandiva</label>
              <input name="provenanceCrestText" value={form.provenanceCrestText} onChange={handleChange} className="w-full border border-stone-300 px-4 py-3 text-xs bg-stone-50" placeholder="Helrenoverad av Skandiva..." />
            </div>
          </div>

          {/* Primary Image */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Huvudbild *</label>
            <ImageUploadField value={form.primaryImage} onChange={(url) => setForm((p) => ({ ...p, primaryImage: url }))} />
            {form.primaryImage && (
              <div className="mt-3 relative w-32 h-24 border border-stone-200">
                <Image src={form.primaryImage} alt="Förhandsvisning" fill className="object-cover" sizes="128px" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Före-bild</label>
              <ImageUploadField value={form.beforeImage} onChange={(url) => setForm((p) => ({ ...p, beforeImage: url }))} label="Ladda upp före-bild" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Efter-bild</label>
              <ImageUploadField value={form.afterImage} onChange={(url) => setForm((p) => ({ ...p, afterImage: url }))} label="Ladda upp efter-bild" />
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
              Galleribilder <span className="normal-case font-sans text-stone-400 ml-1">(detaljbilder, vinklar, tyg/lera/färg)</span>
            </label>
            <div className="space-y-3">
              {form.galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {form.galleryImages.map((url, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="relative w-full aspect-[4/3] border border-stone-200 bg-stone-50 overflow-hidden">
                        <Image src={url} alt={`Bild ${idx + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, 20vw" />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-stone-500 truncate max-w-[120px]">Bild {idx + 1}</span>
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="p-1 text-red-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] font-sans text-stone-400">Inga extra bilder ännu.</p>
              )}
              <ImageUploadField
                value=""
                onChange={(url) => { if (url) addGalleryImage(url); }}
                label="Lägg till extra bild i galleriet"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Material från biblioteket</label>
            <p className="text-[11px] text-stone-400 mb-3">Välj befintliga läder-, tyg- eller fårskinnsprover. De skapas och redigeras i Material & färger.</p>
            {materials.length === 0 ? (
              <p className="border border-dashed border-stone-300 p-4 text-xs text-stone-500">Inga aktiva material ännu. Skapa först ett material i Material & färger.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {materials.map((material) => {
                  const selected = form.materialIds.includes(material.id);
                  return (
                    <button key={material.id} type="button" onClick={() => setForm((prev) => ({ ...prev, materialIds: selected ? prev.materialIds.filter((id) => id !== material.id) : [...prev.materialIds, material.id] }))} className={`text-left border overflow-hidden transition-colors ${selected ? "border-stone-900 ring-2 ring-stone-300" : "border-stone-200 hover:border-stone-500"}`}>
                      <div className="relative aspect-square bg-stone-100"><Image src={material.imageUrl} alt={material.name} fill className="object-cover" sizes="140px" /></div>
                      <span className="block p-2 text-[10px] font-mono leading-tight text-stone-700">{material.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-stone-200 pt-6">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-stone-700 transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "Sparar..." : "Spara möbel"}
            </button>
            <button type="button" onClick={handleCancel}
              className="px-6 py-3 border border-stone-300 text-stone-700 font-mono text-xs uppercase tracking-wider hover:bg-stone-50 transition-colors">
              Avbryt
            </button>
          </div>
        </form>
      )}

      {/* Products list */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
        <span className="mr-2 text-xs font-mono uppercase tracking-wider text-stone-500">Visa:</span>
        {[
          { value: "all" as const, label: "Alla" },
          { value: "dux" as const, label: "DUX" },
          { value: "lamino" as const, label: "Lamino" },
          { value: "none" as const, label: "Övriga" },
        ].map((filter) => (
          <button key={filter.value} type="button" onClick={() => setCollectionFilter(filter.value)} className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${collectionFilter === filter.value ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-500"}`}>
            {filter.label}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-stone-400">{visibleProducts.length} produkter</span>
      </div>

      {loading ? (
        <p className="text-stone-500 font-mono text-sm">Laddar butiksmöbler...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-stone-400 font-sans text-sm text-center py-12">Inga möbler i butiken ännu. Klicka på &quot;Ny möbel till butiken&quot; för att lägga till.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProducts.map((product) => (
            <div key={product.id} className="bg-white border border-stone-200 group shadow-xs">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={product.primaryImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-serif text-base text-stone-900">{product.name}</h3>
                <p className="text-stone-500 text-xs font-mono">{product.designer} — {product.model}</p>
                {product.conditionGrade && <ConditionBadge grade={product.conditionGrade} />}
                <p className="font-bold font-mono text-stone-900">{formatSEK(product.basePrice)}</p>
                {product.galleryImages?.length > 0 && (
                  <p className="text-[10px] font-mono text-stone-400">{product.galleryImages.length} galleribilder</p>
                )}
              </div>
              <div className="flex border-t border-stone-100">
                <button onClick={() => handleStartEdit(product)}
                  className="flex-1 py-2.5 text-xs font-mono uppercase tracking-wider text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" /> Redigera
                </button>
                <button onClick={() => handleDelete(product.id)}
                  className="flex-1 py-2.5 text-xs font-mono uppercase tracking-wider text-red-400 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 border-l border-stone-100">
                  <Trash2 className="w-3.5 h-3.5" /> Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
