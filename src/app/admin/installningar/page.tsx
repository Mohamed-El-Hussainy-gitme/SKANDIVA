"use client";

import React, { useEffect, useState } from "react";
import { SiteSettings } from "@/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { 
  Building2, 
  Sparkles, 
  Save, 
  Check, 
  Loader2, 
  Layers, 
  MessageSquare,
  Armchair,
  Sofa
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"company" | "hero" | "lamino" | "banners" | "b2b">("hero");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(data.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert(data.error || "Kunde inte spara inställningarna.");
      }
    } catch {
      alert("Nätverksfel vid sparande.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-12 text-xs font-mono text-ink/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-wood" />
        Laddar verkstadsinställningar...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-stone pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-wood">
            Webbplats & Innehållshantering (CMS)
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Inställningar & Startsidesektioner
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-canvas font-mono text-xs uppercase tracking-wider font-semibold hover:bg-wood transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sparar...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sparat!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Spara alla ändringar</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone gap-2 sm:gap-4 overflow-x-auto text-xs font-mono">
        {[
          { id: "hero", label: "Startsida & Hero", icon: Sparkles },
          { id: "lamino", label: "Lamino Sektion", icon: Layers },
          { id: "banners", label: "Fåtölj & Soffa Banners", icon: Armchair },
          { id: "company", label: "Företag & Kontakt", icon: Building2 },
          { id: "b2b", label: "B2B & Sektioner", icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "border-wood text-wood font-bold bg-stone-light/40"
                  : "border-transparent text-ink/70 hover:text-ink hover:border-stone"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-8">

        {/* ─── TAB 1: HERO & STARTSIDA ─── */}
        {activeTab === "hero" && (
          <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl text-ink font-medium border-b border-stone pb-3">
              Hero Sektion (Startsida)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Märke / Topp-Badge Text
                </label>
                <input
                  type="text"
                  value={settings.heroBadge}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Huvudrubrik (Hero Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.heroHeadline}
                  onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-sm font-serif text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Underrubrik / Ingress *
                </label>
                <textarea
                  rows={3}
                  required
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="pt-2">
                <ImageUploadField
                  label="Hero Bakgrundsbild"
                  required
                  value={settings.heroImage}
                  onChange={(url) => setSettings({ ...settings, heroImage: url })}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: LAMINO EXPRESS SEKTION ─── */}
        {activeTab === "lamino" && (
          <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl text-ink font-medium border-b border-stone pb-3">
              Lamino Express — Startsidesektion
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Sektionsrubrik
                </label>
                <input
                  type="text"
                  value={settings.laminoTitle}
                  onChange={(e) => setSettings({ ...settings, laminoTitle: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-sm font-serif text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Sektionsbeskrivning
                </label>
                <textarea
                  rows={3}
                  value={settings.laminoDescription}
                  onChange={(e) => setSettings({ ...settings, laminoDescription: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Grundpris (SEK)
                </label>
                <input
                  type="number"
                  value={settings.laminoPrice}
                  onChange={(e) => setSettings({ ...settings, laminoPrice: Number(e.target.value) })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="pt-2">
                <ImageUploadField
                  label="Lamino Bild"
                  value={settings.laminoImage}
                  onChange={(url) => setSettings({ ...settings, laminoImage: url })}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: FÅTÖLJ & SOFFA BANNERS (Split Workshop Showcase) ─── */}
        {activeTab === "banners" && (
          <div className="space-y-8">
            {/* Banner 1: Fåtölj */}
            <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone pb-3 text-ink">
                <Armchair className="w-5 h-5 text-wood" />
                <h3 className="font-serif text-xl font-medium">Banderoll 1: Omklädsel Fåtölj</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-wood mb-1">Rubrik</label>
                  <input
                    type="text"
                    value={settings.fatoljBannerTitle}
                    onChange={(e) => setSettings({ ...settings, fatoljBannerTitle: e.target.value })}
                    className="w-full bg-stone-light/30 border border-stone p-3 text-sm font-serif text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-wood mb-1">Beskrivningstext</label>
                  <textarea
                    rows={2}
                    value={settings.fatoljBannerDescription}
                    onChange={(e) => setSettings({ ...settings, fatoljBannerDescription: e.target.value })}
                    className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-wood mb-1">Knapptext (CTA)</label>
                  <input
                    type="text"
                    value={settings.fatoljBannerCta}
                    onChange={(e) => setSettings({ ...settings, fatoljBannerCta: e.target.value })}
                    className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div className="pt-2">
                  <ImageUploadField
                    label="Bakgrundsbild Fåtöljbanderoll"
                    value={settings.fatoljBannerImage}
                    onChange={(url) => setSettings({ ...settings, fatoljBannerImage: url })}
                  />
                </div>
              </div>
            </div>

            {/* Banner 2: Soffa */}
            <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone pb-3 text-ink">
                <Sofa className="w-5 h-5 text-wood" />
                <h3 className="font-serif text-xl font-medium">Banderoll 2: Omklädsel Soffa</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-wood mb-1">Rubrik</label>
                  <input
                    type="text"
                    value={settings.soffaBannerTitle}
                    onChange={(e) => setSettings({ ...settings, soffaBannerTitle: e.target.value })}
                    className="w-full bg-stone-light/30 border border-stone p-3 text-sm font-serif text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-wood mb-1">Beskrivningstext</label>
                  <textarea
                    rows={2}
                    value={settings.soffaBannerDescription}
                    onChange={(e) => setSettings({ ...settings, soffaBannerDescription: e.target.value })}
                    className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-wood mb-1">Knapptext (CTA)</label>
                  <input
                    type="text"
                    value={settings.soffaBannerCta}
                    onChange={(e) => setSettings({ ...settings, soffaBannerCta: e.target.value })}
                    className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                  />
                </div>

                <div className="pt-2">
                  <ImageUploadField
                    label="Bakgrundsbild Soffbanderoll"
                    value={settings.soffaBannerImage}
                    onChange={(url) => setSettings({ ...settings, soffaBannerImage: url })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: FÖRETAG & KONTAKT ─── */}
        {activeTab === "company" && (
          <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl text-ink font-medium border-b border-stone pb-3">
              Företagsuppgifter & Kontaktvägar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">Företagsnamn</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">Organisationsnummer</label>
                <input
                  type="text"
                  value={settings.orgNumber}
                  onChange={(e) => setSettings({ ...settings, orgNumber: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">Telefonnummer (Verkstad)</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">WhatsApp Nummer (internationellt format)</label>
                <input
                  type="text"
                  placeholder="+4686402290"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-wood mb-1">E-postadress för förfrågningar</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-mono text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-wood mb-1">Verkstadsadress (Södermalm)</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-wood mb-1">Öppettider</label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: B2B & SEKTIONER ─── */}
        {activeTab === "b2b" && (
          <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl text-ink font-medium border-b border-stone pb-3">
              B2B Banner & Före- & Eftersektion
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  B2B Sektionsrubrik
                </label>
                <input
                  type="text"
                  value={settings.b2bTitle}
                  onChange={(e) => setSettings({ ...settings, b2bTitle: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-sm font-serif text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  B2B Beskrivning
                </label>
                <textarea
                  rows={2}
                  value={settings.b2bDescription}
                  onChange={(e) => setSettings({ ...settings, b2bDescription: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div className="pt-4 border-t border-stone">
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Före & Efter Rubrik
                </label>
                <input
                  type="text"
                  value={settings.beforeAfterTitle}
                  onChange={(e) => setSettings({ ...settings, beforeAfterTitle: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-sm font-serif text-ink focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-wood mb-1">
                  Före & Efter Beskrivning
                </label>
                <textarea
                  rows={2}
                  value={settings.beforeAfterDescription}
                  onChange={(e) => setSettings({ ...settings, beforeAfterDescription: e.target.value })}
                  className="w-full bg-stone-light/30 border border-stone p-3 text-xs font-sans text-ink focus:outline-none focus:border-wood"
                />
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
