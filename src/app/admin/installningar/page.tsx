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
  Info,
  Armchair
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"company" | "hero" | "lamino" | "dux" | "banners" | "about">("hero");

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
      <div className="flex items-center justify-center p-12 text-xs font-mono text-stone-600">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-stone-900" />
        Laddar verkstadsinställningar...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500">
            Webbplats & Innehållshantering (CMS)
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
            Inställningar & CMS
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stone-700 transition-colors shadow-sm disabled:opacity-50"
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
      <div className="flex border-b border-stone-200 gap-2 sm:gap-4 overflow-x-auto text-xs font-mono">
        {[
          { id: "hero", label: "Startsida", icon: Sparkles },
          { id: "lamino", label: "Lamino-sida", icon: Layers },
          { id: "dux", label: "DUX-sida", icon: Armchair },
          { id: "banners", label: "Fåtölj & Soffa Banners", icon: Armchair },
          { id: "company", label: "Företag & Kontakt", icon: Building2 },
          { id: "about", label: "Om Oss & Galleri Rubriker", icon: Info },
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
                  ? "border-stone-900 text-stone-900 font-bold bg-stone-100"
                  : "border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* ─── TAB 1: HERO ─── */}
        {activeTab === "hero" && (
          <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl text-stone-900 font-medium border-b border-stone-200 pb-3">
              Hero Sektion (Startsida Överdel)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Märke / Badge Text
                </label>
                <input
                  type="text"
                  value={settings.heroBadge}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Huvudrubrik (Stor Font)
                </label>
                <input
                  type="text"
                  value={settings.heroHeadline}
                  onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                Underrubrik / Inledande Berättelse
              </label>
              <textarea
                rows={3}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-500 mb-2">
                Hero Bakgrundsbild
              </label>
              <ImageUploadField
                value={settings.heroImage}
                onChange={(url) => setSettings({ ...settings, heroImage: url })}
                label="Ladda upp bakgrundsbild för herosektionen"
              />
            </div>
          </div>
        )}

        {/* ─── TAB 2: LAMINO SEKTION ─── */}
        {activeTab === "lamino" && (
          <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-8 shadow-sm">
            <h3 className="font-serif text-xl text-stone-900 font-medium border-b border-stone-200 pb-3">
              Lamino-sektion
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    Lamino Rubrik
                  </label>
                  <input
                    type="text"
                    value={settings.laminoTitle}
                    onChange={(e) => setSettings({ ...settings, laminoTitle: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    Lamino Referenspris (kr)
                  </label>
                  <input
                    type="number"
                    value={settings.laminoPrice}
                    onChange={(e) => setSettings({ ...settings, laminoPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Lamino Beskrivning
                </label>
                <textarea
                  rows={3}
                  value={settings.laminoDescription}
                  onChange={(e) => setSettings({ ...settings, laminoDescription: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-2">
                  Lamino Sektionsbild
                </label>
                <ImageUploadField
                  value={settings.laminoImage}
                  onChange={(url) => setSettings({ ...settings, laminoImage: url })}
                  label="Ladda upp utvald Laminobild"
                />
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB 3: DUX PAGE SETTINGS ─── */}
        {(activeTab === "dux" || activeTab === "banners") && (
          <div className="space-y-6">
            {activeTab === "dux" && <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl text-stone-900 font-medium border-b border-stone-200 pb-3">
                DUX & Bruno Mathsson Specialsida
              </h3>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Titel för DUX-sidan
                </label>
                <input
                  type="text"
                  value={settings.duxPageTitle}
                  onChange={(e) => setSettings({ ...settings, duxPageTitle: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Intro / beskrivning för DUX-sidan
                </label>
                <textarea
                  rows={3}
                  value={settings.duxPageSubtitle}
                  onChange={(e) => setSettings({ ...settings, duxPageSubtitle: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-2">
                  Hero-bild för DUX-sidan
                </label>
                <ImageUploadField
                  value={settings.duxPageImage}
                  onChange={(url) => setSettings({ ...settings, duxPageImage: url })}
                  label="Ladda upp bild för DUX-specialsidan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">Rubrik för DUX-tjänster</label>
                  <input type="text" value={settings.duxServicesTitle} onChange={(e) => setSettings({ ...settings, duxServicesTitle: e.target.value })} className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">Beskrivning för DUX-tjänster</label>
                  <textarea rows={2} value={settings.duxServicesDescription} onChange={(e) => setSettings({ ...settings, duxServicesDescription: e.target.value })} className="w-full bg-stone-50 border border-stone-300 p-3 text-sm text-stone-900 focus:outline-none focus:border-stone-600" />
                </div>
              </div>
            </div>}

            {/* Fåtölj Banner */}
            {activeTab === "banners" && <><div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl text-stone-900 font-medium border-b border-stone-200 pb-3">
                Fåtölj Banner (Omklädsel & Renovering)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    Rubrik
                  </label>
                  <input
                    type="text"
                    value={settings.fatoljBannerTitle}
                    onChange={(e) => setSettings({ ...settings, fatoljBannerTitle: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    CTA Knapptext
                  </label>
                  <input
                    type="text"
                    value={settings.fatoljBannerCta}
                    onChange={(e) => setSettings({ ...settings, fatoljBannerCta: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 p-3 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Beskrivning
                </label>
                <textarea
                  rows={2}
                  value={settings.fatoljBannerDescription}
                  onChange={(e) => setSettings({ ...settings, fatoljBannerDescription: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-xs font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-2">
                  Bannerbild Fåtölj
                </label>
                <ImageUploadField
                  value={settings.fatoljBannerImage}
                  onChange={(url) => setSettings({ ...settings, fatoljBannerImage: url })}
                  label="Ladda upp bild för Fåtöljbanner"
                />
              </div>
            </div>

            {/* Soffa Banner */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl text-stone-900 font-medium border-b border-stone-200 pb-3">
                Soffa Banner (Omklädsel & Skinnarbete)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    Rubrik
                  </label>
                  <input
                    type="text"
                    value={settings.soffaBannerTitle}
                    onChange={(e) => setSettings({ ...settings, soffaBannerTitle: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    CTA Knapptext
                  </label>
                  <input
                    type="text"
                    value={settings.soffaBannerCta}
                    onChange={(e) => setSettings({ ...settings, soffaBannerCta: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 p-3 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Beskrivning
                </label>
                <textarea
                  rows={2}
                  value={settings.soffaBannerDescription}
                  onChange={(e) => setSettings({ ...settings, soffaBannerDescription: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-xs font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-2">
                  Bannerbild Soffa
                </label>
                <ImageUploadField
                  value={settings.soffaBannerImage}
                  onChange={(url) => setSettings({ ...settings, soffaBannerImage: url })}
                  label="Ladda upp bild för Soffbanner"
                />
              </div>
            </div></>}
          </div>
        )}

        {/* ─── TAB 4: FÖRETAGSUPPGIFTER ─── */}
        {activeTab === "company" && (
          <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl text-stone-900 font-medium border-b border-stone-200 pb-3">
              Företagsuppgifter & Kontaktvägar
            </h3>

            <div className="border-t border-stone-200 pt-6 space-y-4">
              <h4 className="font-serif text-lg text-stone-900">Momsinställningar</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer">
                  <input type="checkbox" checked={settings.taxEnabled} onChange={(e) => setSettings({ ...settings, taxEnabled: e.target.checked })} className="w-4 h-4 accent-stone-800" />
                  Aktivera moms i orderberäkningen
                </label>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">Momssats (decimal, exempel 0.25)</label>
                  <input type="number" min="0" max="1" step="0.01" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-mono text-stone-900 focus:outline-none focus:border-stone-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Företagsnamn
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Organisationsnummer
                </label>
                <input
                  type="text"
                  value={settings.orgNumber}
                  onChange={(e) => setSettings({ ...settings, orgNumber: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Telefonnummer
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  E-postadress
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Verkstadsadress (Gatuadress & Postort)
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Öppettider
                </label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  WhatsApp Telefonnummer (för direktchatt)
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                  placeholder="+46701234567"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: OM OSS & GALLERI RUBRIKER ─── */}
        {activeTab === "about" && (
          <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl text-stone-900 font-medium border-b border-stone-200 pb-3">
              Om Oss & Galleri Rubriker
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Om Oss Rubrik
                </label>
                <input
                  type="text"
                  value={settings.aboutTitle}
                  onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Om Oss Text
                </label>
                <textarea
                  rows={4}
                  value={settings.aboutDescription}
                  onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-xs font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-2">
                  Om Oss Bild
                </label>
                <ImageUploadField
                  value={settings.aboutImage}
                  onChange={(url) => setSettings({ ...settings, aboutImage: url })}
                  label="Ladda upp bild för Om oss sidan"
                />
              </div>

              <div className="pt-4 border-t border-stone-200">
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Före & Efter Rubrik
                </label>
                <input
                  type="text"
                  value={settings.beforeAfterTitle}
                  onChange={(e) => setSettings({ ...settings, beforeAfterTitle: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-sm font-serif text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  Före & Efter Beskrivning
                </label>
                <textarea
                  rows={2}
                  value={settings.beforeAfterDescription}
                  onChange={(e) => setSettings({ ...settings, beforeAfterDescription: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 p-3 text-xs font-sans text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
