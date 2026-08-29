"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/supabase";
import { Review } from "@/types";
import { Star, Plus, Trash2, Loader2 } from "lucide-react";

export default function AdminOmdomenPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("Stockholm");
  const [furnitureModel, setFurnitureModel] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const list = await db.getReviews();
      setReviews(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        author,
        location,
        furnitureModel,
        rating,
        text,
        date: new Date().toISOString().split("T")[0],
        verifiedPurchase: true,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews([data.data, ...reviews]);
        setAuthor("");
        setFurnitureModel("");
        setText("");
      } else {
        alert(data.error || "Kunde inte spara omdömet.");
      }
    } catch {
      alert("Kunde inte spara omdömet till databasen.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm("Är du säker på att du vill radera detta omdöme från databasen?")) {
      try {
        const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok && data.success) {
          setReviews(reviews.filter((r) => r.id !== id));
        } else {
          alert(data.error || "Kunde inte radera omdömet.");
        }
      } catch {
        alert("Kunde inte radera omdömet.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-stone pb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Innehållshantering & Kundbetyg
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
          Kundomdömen & Referenser (Supabase Synkad)
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 font-sans mt-1">
          Hantera verifierade recensioner som sparas i databasen och visas på startsidan och i butiken.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add Form */}
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
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Plats / Stadsdel</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="t.ex. Vasastan, Stockholm"
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none focus:border-wood"
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
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <div>
              <label className="block uppercase text-wood mb-1">Betyg (1–5 stjärnor)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none focus:border-wood"
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
                className="w-full bg-stone-light/30 border border-stone p-2 text-ink focus:outline-none focus:border-wood"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-ink hover:bg-wood text-canvas uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sparar i databasen...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publicera Omdöme till Supabase</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: List & Delete */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-xl font-medium text-ink">
            Publicerade Omdömen ({reviews.length} st)
          </h3>

          {loading ? (
            <div className="flex items-center justify-center p-12 text-xs font-mono text-ink/60 bg-canvas border border-stone">
              <Loader2 className="w-5 h-5 animate-spin mr-2 text-wood" />
              Laddar recensioner från Supabase...
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-canvas border border-stone p-5 space-y-2 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1 text-wood">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-ink/50">{r.date}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(r.id)}
                          className="text-rose-700 hover:text-rose-900 p-1"
                          title="Radera omdöme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-ink/80 italic font-serif leading-relaxed mt-2">&ldquo;{r.text}&rdquo;</p>
                  </div>

                  <div className="pt-2 border-t border-stone/50 flex justify-between text-xs font-mono">
                    <span className="font-bold text-ink">{r.author} ({r.location})</span>
                    <span className="text-wood">{r.furnitureModel}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
