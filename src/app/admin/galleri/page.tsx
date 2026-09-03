"use client";

import React, { useState, useEffect } from "react";
import { GalleryItem } from "@/types";
import { Trash2, Save, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: "",
    description: "",
    beforeImage: "",
    afterImage: "",
    sortOrder: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title?.trim()) {
      setError("Titel krävs.");
      return;
    }
    if (!newItem.beforeImage || !newItem.afterImage) {
      setError("Både Före-bild och Efter-bild måste laddas upp.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        setNewItem({ title: "", description: "", beforeImage: "", afterImage: "", sortOrder: 0 });
        loadData();
      } else {
        setError("Kunde inte spara projektet i galleriet.");
      }
    } catch {
      setError("Nätverksfel — försök igen.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Är du säker på att du vill ta bort "${title}" från galleriet?`)) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      loadData();
    } catch {
      alert("Kunde inte radera.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl p-6">
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Före &amp; Efter Galleri</h1>
          <p className="text-sm font-sans text-stone-500 mt-1">
            Ladda upp och hantera transformationsbilder från verkstaden.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-white border border-stone-200 p-6 sm:p-8 space-y-5 self-start sticky top-24 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
            <Plus className="w-5 h-5 text-stone-900" />
            <h2 className="font-serif text-xl text-stone-900 font-medium">Lägg till Före/Efter-projekt</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                Projekttitel *
              </label>
              <input
                required
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Ex: Lamino i Skandilock Scandinavian Grey"
                className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                Beskrivning
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                rows={2}
                placeholder="Ex: Byte av bärväv och nytt fårskinn..."
                className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-600 bg-stone-50 resize-none"
              />
            </div>

            {/* Before Image Upload */}
            <div>
              <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                Före-bild * <span className="normal-case text-stone-400 font-sans">(sliten/ursprungligt skick)</span>
              </label>
              <ImageUploadField
                value={newItem.beforeImage || ""}
                onChange={(url) => setNewItem({ ...newItem, beforeImage: url })}
                label="Ladda upp FÖRE-bild (Browse)"
              />
              {newItem.beforeImage && (
                <div className="mt-2 relative w-24 h-24 border border-stone-200">
                  <Image src={newItem.beforeImage} alt="Före förhandsvisning" fill className="object-cover" sizes="96px" />
                </div>
              )}
            </div>

            {/* After Image Upload */}
            <div>
              <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                Efter-bild * <span className="normal-case text-stone-400 font-sans">(nyskick efter renovering)</span>
              </label>
              <ImageUploadField
                value={newItem.afterImage || ""}
                onChange={(url) => setNewItem({ ...newItem, afterImage: url })}
                label="Ladda upp EFTER-bild (Browse)"
              />
              {newItem.afterImage && (
                <div className="mt-2 relative w-24 h-24 border border-stone-200">
                  <Image src={newItem.afterImage} alt="Efter förhandsvisning" fill className="object-cover" sizes="96px" />
                </div>
              )}
            </div>

            {error && <p className="text-red-600 text-xs font-sans">{error}</p>}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-stone-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Sparar..." : "Spara till galleriet"}</span>
            </button>
          </form>
        </div>

        {/* List of Existing Projects */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-lg text-stone-900 border-b border-stone-200 pb-2">
            Befintliga Projekt i Galleriet ({items.length})
          </h3>

          {loading ? (
            <p className="text-sm font-mono text-stone-400">Laddar galleriprojekt...</p>
          ) : items.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center text-stone-400 space-y-2">
              <ImageIcon className="w-8 h-8 mx-auto text-stone-300" />
              <p className="font-serif text-lg text-stone-600">Galleriet är tomt</p>
              <p className="text-xs font-sans">Ladda upp ditt första Före/Efter-projekt till vänster.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-xs">
                  <div className="flex gap-3 shrink-0">
                    <div className="relative w-20 h-20 bg-stone-100 border border-stone-200">
                      {item.beforeImage && (
                        <Image src={item.beforeImage} alt="Före" fill className="object-cover" sizes="80px" />
                      )}
                      <span className="absolute bottom-0 left-0 right-0 bg-stone-900/80 text-white text-[9px] font-mono uppercase text-center py-0.5">Före</span>
                    </div>
                    <div className="relative w-20 h-20 bg-stone-100 border border-stone-200">
                      {item.afterImage && (
                        <Image src={item.afterImage} alt="Efter" fill className="object-cover" sizes="80px" />
                      )}
                      <span className="absolute bottom-0 left-0 right-0 bg-stone-900/80 text-white text-[9px] font-mono uppercase text-center py-0.5">Efter</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <h4 className="font-serif font-bold text-base text-stone-900">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-stone-600 font-sans line-clamp-2">{item.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors self-end sm:self-center"
                    title="Ta bort"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
