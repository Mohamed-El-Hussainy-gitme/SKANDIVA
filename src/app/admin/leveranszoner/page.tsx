"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/supabase";
import { DeliveryZone } from "@/types";
import { formatSEK } from "@/lib/store";
import { Edit, MapPin } from "lucide-react";

export default function AdminLeveranszonerPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [surcharge, setSurcharge] = useState(0);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState("");

  const loadZones = async () => {
    const list = await db.getDeliveryZones();
    setZones(list);
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleStartEdit = (z: DeliveryZone) => {
    setEditingZone(z);
    setName(z.name);
    setDescription(z.description);
    setSurcharge(z.surcharge);
    setEstimatedDeliveryDays(z.estimatedDeliveryDays);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;

    try {
      const res = await fetch(`/api/delivery-zones/${editingZone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          surcharge: Number(surcharge),
          estimatedDeliveryDays,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setZones(zones.map((z) => (z.id === editingZone.id ? data.data : z)));
        setEditingZone(null);
      } else {
        alert(data.error || "Kunde inte spara leveranszon.");
      }
    } catch {
      alert("Nätverksfel vid sparande.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-stone pb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Logistik & Fraktkorridorer
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
          Leveranszoner & Fraktavgifter
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 font-sans mt-1">
          Styr vilka zontillägg som automatiskt appliceras i kassan för både produkter och möbelhämtning.
        </p>
      </div>

      {editingZone && (
        <form onSubmit={handleSave} className="bg-canvas border-2 border-stone p-6 space-y-4 shadow-md text-xs font-mono">
          <h3 className="font-serif text-lg text-ink font-medium">Redigera Leveranszon: {editingZone.name}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-wood mb-1">Zonnamn *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Zontillägg (SEK) *</label>
              <input
                type="number"
                required
                value={surcharge}
                onChange={(e) => setSurcharge(Number(e.target.value))}
                className="w-full bg-stone-light/30 border border-stone p-2 font-bold text-ink focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block uppercase text-wood mb-1">Beskrivning av geografiskt område *</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone">
            <button
              type="button"
              onClick={() => setEditingZone(null)}
              className="px-3 py-1.5 border border-stone text-ink hover:bg-stone-light"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-ink hover:bg-wood text-canvas font-semibold"
            >
              Spara Zon
            </button>
          </div>
        </form>
      )}

      <div className="bg-canvas border border-stone divide-y divide-stone/60">
        {zones.map((zone) => (
          <div key={zone.id} className="p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-wood" />
                <h4 className="font-serif text-base font-medium text-ink">{zone.name}</h4>
              </div>
              <p className="text-xs text-ink/75 font-sans">{zone.description}</p>
              <span className="text-[11px] font-mono text-ink/60 block">{zone.estimatedDeliveryDays}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-ink">
                {zone.surcharge === 0 ? "Gratis / Ingår" : "+" + formatSEK(zone.surcharge)}
              </span>
              <button
                onClick={() => handleStartEdit(zone)}
                className="p-2 border border-stone hover:bg-stone-light text-ink text-xs font-mono"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
