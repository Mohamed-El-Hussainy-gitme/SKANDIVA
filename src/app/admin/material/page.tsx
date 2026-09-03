"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Material } from "@/types";
import { Trash2, Plus, Save, X } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const MATERIAL_TYPES = [
  { value: "leather", label: "Läder" },
  { value: "fabric", label: "Tyg" },
  { value: "sheepskin", label: "Fårskinn" },
];

const emptyForm = {
  name: "",
  materialType: "leather",
  colorHex: "#8B7355",
  imageUrl: "",
  price: 0,
  supplier: "",
  description: "",
  sortOrder: 0,
  active: true,
};

export default function AdminMaterialPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/materials");
      const data = await res.json();
      setMaterials(data.success ? data.data : []);
    } catch {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleEdit = (m: Material) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      materialType: m.materialType,
      colorHex: m.colorHex || "#8B7355",
      imageUrl: m.imageUrl,
      price: m.price,
      supplier: m.supplier || "",
      description: m.description || "",
      sortOrder: m.sortOrder,
      active: m.active,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Namn krävs."); return; }
    if (!form.imageUrl.trim()) { setError("Bild krävs för att kunna visa materialet korrekt."); return; }

    setSaving(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/materials/${editingId}` : "/api/materials";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          sortOrder: Number(form.sortOrder),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditingId(null);
        loadMaterials();
      } else {
        setError(data.error || "Kunde inte spara materialet.");
      }
    } catch {
      setError("Nätverksfel — försök igen.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ta bort "${name}"? Åtgärden kan inte ångras.`)) return;
    try {
      await fetch(`/api/materials/${id}`, { method: "DELETE" });
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Kunde inte ta bort materialet.");
    }
  };

  const grouped = MATERIAL_TYPES.map((t) => ({
    ...t,
    items: materials.filter((m) => m.materialType === t.value),
  }));

  return (
    <div className="p-6 max-w-6xl space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Material & Tyger</h1>
          <p className="text-stone-500 font-sans text-sm mt-1">
            Lägg till läder, tyg och fårskinn som visas som swatches vid produktval.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-stone-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nytt material
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-stone-200 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-stone-900">{editingId ? "Redigera material" : "Nytt material"}</h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Namn *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50"
                placeholder="Ex: Elmosoft 33011 Cognac" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Materialtyp *</label>
              <select name="materialType" value={form.materialType} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50">
                {MATERIAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Prisökning (kr)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0"
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Färgkod (hex)</label>
              <div className="flex gap-2">
                <input type="color" name="colorHex" value={form.colorHex} onChange={handleChange}
                  className="w-12 h-12 border border-stone-300 cursor-pointer bg-stone-50 p-1" />
                <input type="text" name="colorHex" value={form.colorHex} onChange={handleChange}
                  className="flex-1 border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50"
                  placeholder="#8B7355" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Leverantör</label>
              <input type="text" name="supplier" value={form.supplier} onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50"
                placeholder="Ex: Elmo Läder, Skandilock" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Sorteringsordning</label>
              <input type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} min="0"
                className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">Beskrivning</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50 resize-none"
              placeholder="Valfri beskrivning av materialet..." />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
              Swatchbild * <span className="normal-case font-sans text-stone-400 ml-1">(krävs för lightbox-visning)</span>
            </label>
            <ImageUploadField
              value={form.imageUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            />
            {form.imageUrl && (
              <div className="mt-3 relative w-24 h-24 border border-stone-200">
                <Image src={form.imageUrl} alt="Förhandsvisning" fill className="object-cover" sizes="96px" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" name="active" checked={form.active}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4 accent-stone-700" />
            <label htmlFor="active" className="text-sm font-sans text-stone-700">Aktivt — visas för kunder</label>
          </div>

          {error && <p className="text-red-600 text-sm font-sans">{error}</p>}

          <div className="flex gap-3 border-t border-stone-200 pt-6">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-stone-700 transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "Sparar..." : "Spara material"}
            </button>
            <button onClick={handleCancel}
              className="px-6 py-3 border border-stone-300 text-stone-700 font-mono text-xs uppercase tracking-wider hover:bg-stone-50 transition-colors">
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Materials grouped by type */}
      {loading ? (
        <p className="text-stone-500 font-mono text-sm">Laddar material...</p>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ label, value, items }) => (
            <div key={value}>
              <div className="flex items-center gap-4 mb-4 border-b border-stone-200 pb-3">
                <h2 className="font-mono text-xs uppercase tracking-widest text-stone-500">{label}</h2>
                <span className="text-xs font-mono text-stone-400">({items.length})</span>
              </div>
              {items.length === 0 ? (
                <p className="text-stone-400 font-sans text-sm italic">Inga {label.toLowerCase()} tillagda ännu.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {items.map((m) => (
                    <div key={m.id} className={`relative group bg-white border ${m.active ? "border-stone-200" : "border-stone-100 opacity-50"}`}>
                      {/* Swatch Image */}
                      <div className="relative aspect-square overflow-hidden bg-stone-100">
                        {m.imageUrl ? (
                          <Image src={m.imageUrl} alt={m.name} fill className="object-cover" sizes="160px" />
                        ) : (
                          <div className="w-full h-full" style={{ backgroundColor: m.colorHex || "#ccc" }} />
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-2.5 space-y-0.5">
                        <p className="text-xs font-mono text-stone-800 leading-tight">{m.name}</p>
                        {m.supplier && <p className="text-[10px] font-mono text-stone-400">{m.supplier}</p>}
                        {m.price > 0 && <p className="text-[10px] font-mono text-stone-600">+{m.price} kr</p>}
                      </div>
                      {/* Actions */}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button onClick={() => handleEdit(m)}
                          className="bg-white shadow border border-stone-200 p-1 text-stone-600 hover:text-stone-900">
                          <Save className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDelete(m.id, m.name)}
                          className="bg-white shadow border border-stone-200 p-1 text-red-400 hover:text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
