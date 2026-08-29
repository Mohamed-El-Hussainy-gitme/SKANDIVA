import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

# 4. Admin Leveranszoner
write("src/app/admin/leveranszoner/page.tsx", """\"use client\";

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

    const updatedList = zones.map((z) => {
      if (z.id === editingZone.id) {
        return {
          ...z,
          name,
          description,
          surcharge: Number(surcharge),
          estimatedDeliveryDays,
        };
      }
      return z;
    });

    await db.saveDeliveryZones(updatedList);
    setZones(updatedList);
    setEditingZone(null);
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
""")

# 5. Admin Omdömen
write("src/app/admin/omdomen/page.tsx", """\"use client\";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/supabase";
import { Review } from "@/types";
import { Star, Plus } from "lucide-react";

export default function AdminOmdomenPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("Stockholm");
  const [furnitureModel, setFurnitureModel] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const loadReviews = async () => {
    const list = await db.getReviews();
    setReviews(list);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: Review = {
      id: "rev-" + Date.now(),
      author,
      location,
      furnitureModel,
      rating,
      text,
      date: new Date().toISOString().split("T")[0],
      verifiedPurchase: true,
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    setAuthor("");
    setFurnitureModel("");
    setText("");
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-stone pb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Innehållshantering & Kundbetyg
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
          Kundomdömen & Referenser
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 font-sans mt-1">
          Hantera verifierade recensioner som visas på startsidan och under produktkorten.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-canvas border border-stone p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-xl font-medium text-ink border-b border-stone pb-3">
            Lägg till Nytt Omdöme
          </h3>

          <form onSubmit={handleAddReview} className="space-y-3 text-xs font-mono">
            <div>
              <label className="block uppercase text-wood mb-1">Kundnamn *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="t.ex. Anna & Fredrik L."
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Plats / Stadsdel</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="t.ex. Vasastan, Stockholm"
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Renoverad Möbel / Tjänst *</label>
              <input
                type="text"
                required
                value={furnitureModel}
                onChange={(e) => setFurnitureModel(e.target.value)}
                placeholder="t.ex. Lamino Express Fårskinn"
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Betyg (1–5 stjärnor)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none"
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stjärnor (Utmärkt)</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stjärnor (Mycket bra)</option>
                <option value={3}>⭐⭐⭐ 3 Stjärnor (Bra)</option>
              </select>
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Recensionstext *</label>
              <textarea
                rows={3}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Kundens omdöme om hantverket och leveransen..."
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-ink hover:bg-wood text-canvas uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publicera Omdöme</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-xl font-medium text-ink">Publicerade Omdömen ({reviews.length})</h3>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-canvas border border-stone p-5 space-y-2 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1 text-wood">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-ink/50">{r.date}</span>
                </div>

                <p className="text-xs text-ink/80 italic font-serif leading-relaxed">"{r.text}"</p>

                <div className="pt-2 border-t border-stone/50 flex justify-between text-xs font-mono">
                  <span className="font-bold text-ink">{r.author} ({r.location})</span>
                  <span className="text-wood">{r.furnitureModel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
""")
