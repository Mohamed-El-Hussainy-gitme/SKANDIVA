"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/supabase";
import { WorkshopService } from "@/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Edit, Save, Plus, Trash2, X, Loader2 } from "lucide-react";

export default function AdminTjansterPage() {
  const [services, setServices] = useState<WorkshopService[]>([]);
  const [editingService, setEditingService] = useState<WorkshopService | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [furnitureType, setFurnitureType] = useState("Fatolj");
  const [isFixedPrice, setIsFixedPrice] = useState(true);
  const [basePrice, setBasePrice] = useState(4900);
  const [priceRangeText, setPriceRangeText] = useState("4 900 – 6 900 kr");
  const [turnaroundDays, setTurnaroundDays] = useState(10);
  const [turnaroundText, setTurnaroundText] = useState("10–14 arbetsdagar");
  const [primaryImage, setPrimaryImage] = useState("/IMG_0948.png");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [featured, setFeatured] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const list = await db.getServices();
      setServices(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleStartCreate = () => {
    setEditingService(null);
    setName("");
    setSlug("");
    setShortDescription("");
    setFullDescription("");
    setFurnitureType("Fatolj");
    setIsFixedPrice(true);
    setBasePrice(4900);
    setPriceRangeText("4 900 – 6 900 kr");
    setTurnaroundDays(10);
    setTurnaroundText("10–14 arbetsdagar");
    setPrimaryImage("/IMG_0948.png");
    setBeforeImage("");
    setAfterImage("");
    setFeatured(false);
    setIsCreatingNew(true);
  };

  const handleStartEdit = (s: WorkshopService) => {
    setIsCreatingNew(false);
    setEditingService(s);
    setName(s.name);
    setSlug(s.slug);
    setShortDescription(s.shortDescription);
    setFullDescription(s.fullDescription || s.shortDescription);
    setFurnitureType(s.furnitureType || "Fatolj");
    setIsFixedPrice(s.isFixedPrice);
    setBasePrice(s.basePrice);
    setPriceRangeText(s.priceRangeText);
    setTurnaroundDays(s.turnaroundDays || 14);
    setTurnaroundText(s.turnaroundText);
    setPrimaryImage(s.primaryImage || "/IMG_0948.png");
    setBeforeImage(s.beforeAfterPair?.before || "");
    setAfterImage(s.beforeAfterPair?.after || "");
    setFeatured(Boolean(s.featured));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const beforeAfterPair = beforeImage && afterImage ? { before: beforeImage, after: afterImage } : undefined;

    if (isCreatingNew) {
      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || shortDescription.trim(),
        furnitureType,
        applicableModels: [name],
        isFixedPrice,
        priceRangeText: priceRangeText || `${basePrice} kr`,
        basePrice: Number(basePrice),
        turnaroundDays: Number(turnaroundDays),
        turnaroundText: turnaroundText || `${turnaroundDays} arbetsdagar`,
        primaryImage: primaryImage || "/IMG_0948.png",
        beforeAfterPair,
        featured,
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setServices([data.data, ...services]);
        setIsCreatingNew(false);
      } else {
        alert(data.error || "Kunde inte spara tjänsten.");
      }
    } else if (editingService) {
      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || editingService.slug,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        furnitureType,
        isFixedPrice,
        basePrice: Number(basePrice),
        priceRangeText,
        turnaroundDays: Number(turnaroundDays),
        turnaroundText,
        primaryImage,
        beforeAfterPair,
        featured,
      };

      const res = await fetch(`/api/services/${editingService.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setServices(services.map((s) => (s.id === editingService.id ? data.data : s)));
        setEditingService(null);
      } else {
        alert(data.error || "Kunde inte uppdatera tjänsten.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Är du säker på att du vill radera denna verkstadstjänst från databasen?")) {
      try {
        const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok && data.success) {
          setServices(services.filter((s) => s.id !== id));
          if (editingService?.id === id) setEditingService(null);
        } else {
          alert(data.error || "Kunde inte radera tjänsten.");
        }
      } catch {
        alert("Kunde inte radera tjänsten från databasen.");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-wood">
            Tjänstekonfiguration & Prismodell
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Verkstadstjänster (CRUD & Fastpris)
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-sans mt-1">
            Lägg till, redigera och konfigurera verkstadstjänster som &ldquo;Lamino Express&rdquo; för direkt utcheckning.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-canvas font-mono text-xs uppercase tracking-wider font-semibold hover:bg-wood transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Skapa Ny Tjänst</span>
        </button>
      </div>

      {/* Edit / Create Form */}
      {(isCreatingNew || editingService) && (
        <form onSubmit={handleSave} className="bg-canvas border-2 border-wood/50 p-6 sm:p-8 space-y-6 shadow-md">
          <div className="border-b border-stone pb-3 flex justify-between items-center">
            <h3 className="font-serif text-xl font-medium text-ink">
              {isCreatingNew ? "Skapa Ny Verkstadstjänst" : `Redigera Tjänst: ${editingService?.name}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingService(null);
                setIsCreatingNew(false);
              }}
              className="text-xs font-mono text-ink/60 hover:text-ink flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Avbryt
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="sm:col-span-2">
              <label className="block uppercase text-wood mb-1">Tjänstenamn *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (isCreatingNew) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                }}
                placeholder="t.ex. Pernilla 69 Omklädsel i Läder"
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">URL-Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="t.ex. pernilla-omkladsel"
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Möbelkategori *</label>
              <select
                value={furnitureType}
                onChange={(e) => setFurnitureType(e.target.value)}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              >
                <option value="Fatolj">Fåtölj</option>
                <option value="Soffa">Soffa</option>
                <option value="Stol">Stol</option>
                <option value="Tillbehor">Dynsats / Tillbehör</option>
              </select>
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Prismodell / Kassaflöde *</label>
              <select
                value={isFixedPrice ? "fixed" : "quote"}
                onChange={(e) => setIsFixedPrice(e.target.value === "fixed")}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              >
                <option value="fixed">Fast Pris (Direkt i kassan)</option>
                <option value="quote">Offertbaserad (Offerförfrågan)</option>
              </select>
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Grundpris (SEK)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Prisintervall (Visningstext)</label>
              <input
                type="text"
                value={priceRangeText}
                onChange={(e) => setPriceRangeText(e.target.value)}
                placeholder="4 900 – 6 900 kr"
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Uppskattad Ledtid (Dagar)</label>
              <input
                type="number"
                value={turnaroundDays}
                onChange={(e) => setTurnaroundDays(Number(e.target.value))}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Ledtidstext</label>
              <input
                type="text"
                value={turnaroundText}
                onChange={(e) => setTurnaroundText(e.target.value)}
                placeholder="10–14 arbetsdagar"
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block uppercase text-wood mb-1">Kort Beskrivning *</label>
              <input
                type="text"
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block uppercase text-wood mb-1">Fullständig Tjänstebeskrivning</label>
              <textarea
                rows={3}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full bg-stone-light/30 border border-stone p-2.5 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div className="sm:col-span-3 pt-2">
              <ImageUploadField
                label="Huvudbild för Tjänst (Omslag)"
                required
                value={primaryImage}
                onChange={(url) => setPrimaryImage(url)}
              />
            </div>

            <div className="sm:col-span-3 pt-2 border-t border-stone/50 space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-wood font-semibold block">
                Före- & Efterjämförelse (Valfritt för Galleri & Reglage)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Före-bild (Sliten/Original)"
                  value={beforeImage}
                  onChange={(url) => setBeforeImage(url)}
                />
                <ImageUploadField
                  label="Efter-bild (Renoverad/Klar)"
                  value={afterImage}
                  onChange={(url) => setAfterImage(url)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone">
            <button
              type="button"
              onClick={() => {
                setEditingService(null);
                setIsCreatingNew(false);
              }}
              className="px-4 py-2.5 border border-stone text-xs font-mono uppercase text-ink hover:bg-stone-light"
            >
              Avbryt
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-ink hover:bg-wood text-canvas text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isCreatingNew ? "Skapa Tjänst" : "Spara Ändringar"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-xs font-mono text-ink/60">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-wood" />
          Laddar verkstadstjänster...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.id} className="bg-canvas border border-stone p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-wood tracking-wider font-semibold">
                      {s.furnitureType} • {s.isFixedPrice ? "Fast Pris" : "Offert"}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-ink mt-0.5">{s.name}</h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(s)}
                      className="p-1.5 border border-stone hover:bg-stone-light text-ink text-xs"
                      title="Redigera"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 border border-stone hover:bg-rose-50 text-rose-700 text-xs"
                      title="Radera"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[16/9] w-full bg-stone-light border border-stone overflow-hidden">
                  <Image
                    src={s.primaryImage || "/IMG_0948.png"}
                    alt={s.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-xs text-ink/70 font-sans leading-relaxed">
                  {s.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-stone/50 flex justify-between text-xs font-mono text-ink/80">
                <span>Pris: <strong className="text-ink">{s.priceRangeText}</strong></span>
                <span>Ledtid: <strong className="text-ink">{s.turnaroundText}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
