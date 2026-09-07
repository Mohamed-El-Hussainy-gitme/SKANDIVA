import React from "react";
import Link from "next/link";
import Image from "next/image";
import { serverDb } from "@/lib/db";
import { formatSEK } from "@/lib/utils";
import { Product, GalleryItem } from "@/types";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export const revalidate = 60;

export default async function HomePage() {
  const settings = await serverDb.getSettings();

  let renoverade: Product[] = [];
  let galleryItems: GalleryItem[] = [];

  try {
    renoverade = await serverDb.getProducts();
    galleryItems = await serverDb.getGalleryItems();
  } catch (e) {
    console.error("Home page DB fetch error", e);
  }

  const selectedFeatured = renoverade.filter((product) => product.featured).slice(0, 4);
  const featuredRenoverade = selectedFeatured.length > 0 ? selectedFeatured : renoverade.slice(0, 4);
  const featuredGallery = galleryItems.slice(0, 2);

  return (
    <div className="bg-stone-50 text-stone-900">

      {/* ════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════ */}
      <section className="relative w-full h-[78vh] min-h-[560px] flex items-end overflow-hidden">
        <Image
          src={settings.heroImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2400&q=85"}
          alt="Skandiva Tapetserarverkstad Stockholm"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-stone-300">
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-pulse" />
              {settings.heroBadge || "Tapetserarverkstad • Danderyd, Stockholm"}
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-normal leading-[1.05] tracking-tight">
              {settings.heroHeadline || "Vi bevarar det svenska designarvet."}
            </h1>

            <p className="text-base text-white/80 leading-relaxed font-sans max-w-xl">
              {settings.heroSubtitle || "Specialiserad verkstad för omklädsel och renovering av Lamino, DUX och Bruno Mathsson. Vi säljer även helrenoverade klassiker i vår butik."}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/begar-offert"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 font-mono text-xs uppercase tracking-widest font-bold hover:bg-stone-100 transition-colors shadow-lg"
              >
                Begär Offert <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/butik"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border border-white/40 font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Utforska Butik
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. SNABBA VÄGAR
      ════════════════════════════════════════════ */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 sm:grid-cols-3">
          {[
            { eyebrow: "Till salu nu", title: "Utforska butiken", text: "Helrenoverade designklassiker redo för ett nytt hem.", href: "/butik" },
            { eyebrow: "För din möbel", title: "DUX & Mathsson", text: "Kuddar, väv och klädsel för ikoniska modeller.", href: "/dux-omkladsel" },
            { eyebrow: "Signaturarbete", title: "Lamino i fårskinn", text: "Varsam renovering av Yngve Ekströms klassiker.", href: "/lamino-omkladsel" },
          ].map((path) => (
            <Link key={path.href} href={path.href} className="group border-t sm:border-t-0 sm:border-r last:border-r-0 border-stone-200 px-0 py-7 sm:px-7 hover:bg-stone-50 transition-colors first:sm:pl-0">
              <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">{path.eyebrow}</span>
              <h2 className="font-serif text-2xl text-stone-900 mt-2">{path.title}</h2>
              <p className="text-sm text-stone-600 leading-relaxed mt-2 max-w-xs">{path.text}</p>
              <span className="inline-flex items-center gap-2 mt-5 font-mono text-[10px] uppercase tracking-widest text-stone-800 group-hover:gap-3 transition-all">Se mer <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. KLASSIKER I LAGER
      ════════════════════════════════════════════ */}
      <section className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-stone-500">Klassiker i Lager</span>
              <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 font-normal">Vår Butik</h2>
              <p className="text-stone-600 font-sans text-sm max-w-lg leading-relaxed">Helrenoverade designklassiker, redo för ett nytt hem.</p>
            </div>
            <Link href="/butik" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-700 hover:text-stone-900 border-b border-stone-400 pb-1">Se hela butiken <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {featuredRenoverade.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {featuredRenoverade.map((product) => (
                <Link key={product.id} href={`/butik/${product.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <Image src={product.primaryImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                    {product.stockStatus === "sald" && <span className="absolute left-2 top-2 bg-stone-900 px-2 py-1 text-[10px] font-mono uppercase text-white">Såld</span>}
                  </div>
                  <div className="pt-3 space-y-1"><h3 className="font-serif text-base text-stone-900 leading-tight">{product.name}</h3><p className="text-stone-500 text-xs font-mono">{product.designer}</p><p className="text-stone-900 font-bold font-mono text-sm">{formatSEK(product.basePrice)}</p></div>
                </Link>
              ))}
            </div>
          ) : <div className="border border-dashed border-stone-300 bg-white py-12 text-center text-sm text-stone-500">Butiken uppdateras med nya klassiker inom kort.</div>}
        </div>
      </section>


      {/* ════════════════════════════════════════════
          4. OMKLÄDSEL — LAMINO (Dedikerat fokus)
      ════════════════════════════════════════════ */}
      <section className="py-20 bg-[#8B7355] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-white/60">Specialitet</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
                {settings.laminoTitle || "Lamino Omklädsel i Fårskinn"}
              </h2>
              <p className="text-white/80 font-sans text-base leading-relaxed">
                {settings.laminoDescription || "Har du en Lamino-fåtölj med slitet fårskinn eller trasig bärväv? Vi är specialiserade på Yngve Ekströms mästerverk och klär om med premiumfårskinn från Skandilock i klassiska kulörer som Scandinavian Grey, Offwhite, Charcoal och Sahara."}
              </p>
              {settings.laminoPrice > 0 && (
                <p className="font-mono text-sm uppercase tracking-widest text-white/90">
                  Från {formatSEK(settings.laminoPrice)}
                </p>
              )}
              <ul className="space-y-2.5 pt-2">
                {[
                  "Certifierat Skandilock-fårskinn (högsta slitstyrka)",
                  "Ny bärväv i kraftig natur/linne vid behov",
                  "Översyn och limning av trästomme",
                  "5 års garanti på hantverket",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-sans text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-white/70 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/lamino-omkladsel" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 font-mono text-xs uppercase tracking-widest font-bold hover:bg-stone-100 transition-colors">
                  Läs om Lamino-omklädsel <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/begar-offert" className="inline-flex items-center gap-2 px-6 py-4 border border-white/40 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Begär Offert
                </Link>
              </div>
            </div>
            <div className="relative aspect-square bg-white/10 overflow-hidden">
              <Image
                src={settings.laminoImage || "/IMG_0948.png"}
                alt="Lamino fåtölj omklädd i fårskinn hos Skandiva"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          4. OMKLÄDSEL — DUX & BRUNO MATHSSON
      ════════════════════════════════════════════ */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] bg-stone-800 overflow-hidden order-2 lg:order-1">
              <Image
                src={settings.duxPageImage || "https://images.unsplash.com/photo-1580481077111-e4014902c38d?auto=format&fit=crop&w=1200&q=80"}
                alt="DUX och Bruno Mathsson omklädsel i anilinläder"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <span className="font-mono text-xs uppercase tracking-widest text-stone-400">Specialitet</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
                {settings.duxPageTitle || "DUX & Bruno Mathsson"}
              </h2>
              <p className="text-stone-300 font-sans text-base leading-relaxed">
                {settings.duxPageSubtitle || "Vi klär om och restaurerar Bruno Mathssons och DUX mest älskade ikoner."}
              </p>
              <ul className="space-y-2.5 pt-2">
                {[
                  "Dynsatser i Elmosoft & Tärnsjö anilinläder",
                  "Byte av bärande väv (kanvas / linne)",
                  "Knappdragning och fyllning efter originalspecifikation",
                  "Individuell offert baserad på dina önskemål",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-sans text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-stone-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/begar-offert?typ=dux" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 font-mono text-xs uppercase tracking-widest font-bold hover:bg-stone-100 transition-colors">
                  Begär Offert för DUX / Mathsson <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          5. TJÄNSTER — FÅTÖLJ & SOFFA
      ════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: settings.fatoljBannerTitle, description: settings.fatoljBannerDescription, image: settings.fatoljBannerImage, cta: settings.fatoljBannerCta, href: "/begar-offert?typ=fatolj" },
            { title: settings.soffaBannerTitle, description: settings.soffaBannerDescription, image: settings.soffaBannerImage, cta: settings.soffaBannerCta, href: "/begar-offert?typ=soffa" },
          ].map((banner) => (
            <Link key={banner.href} href={banner.href} className="group relative min-h-[360px] overflow-hidden bg-stone-900">
              <Image src={banner.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"} alt={banner.title || "Tapetsering och renovering"} fill className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
              <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-8 text-white">
                <h2 className="font-serif text-3xl sm:text-4xl">{banner.title || "Omklädsel och renovering"}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">{banner.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">{banner.cta || "Begär offert"} <ArrowRight className="w-4 h-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          6. FÖRE & EFTER — Gallerihöjdpunkter
      ════════════════════════════════════════════ */}
      {featuredGallery.length > 0 && (
        <section className="py-20 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-stone-500">Hantverksresultat</span>
                <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 font-normal mt-1">Före & Efter</h2>
              </div>
              <Link href="/galleri" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-700 hover:text-stone-900 border-b border-stone-400 pb-0.5 transition-colors">
                Se hela galleriet ({galleryItems.length} projekt) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {featuredGallery.map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="border-4 border-stone-100 shadow-sm bg-stone-100">
                    <BeforeAfterSlider beforeImage={item.beforeImage} afterImage={item.afterImage} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-stone-900">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm font-sans text-stone-600 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ════════════════════════════════════════════
          7. KONTAKT & BEGÄR OFFERT (Avslutande CTA)
      ════════════════════════════════════════════ */}
      <section className="py-24 bg-stone-950 text-white text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-400">Kostnadsfri Offert</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal">
            Har du en möbel som behöver renoveras?
          </h2>
          <p className="text-stone-300 font-sans text-base leading-relaxed">
            Skicka oss bilder och en kort beskrivning av din möbel — vi återkommer med ett personligt prisförslag inom 24 timmar.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/begar-offert" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-stone-900 font-mono text-sm uppercase tracking-widest font-bold hover:bg-stone-100 transition-colors">
              Begär Offert <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/kontakt" className="inline-flex items-center gap-2 px-8 py-5 border border-white/30 text-white font-mono text-sm uppercase tracking-widest hover:bg-white/10 transition-colors">
              Kontakta Verkstaden
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
