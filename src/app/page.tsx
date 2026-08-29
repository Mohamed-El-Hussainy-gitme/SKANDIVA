import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { ConditionBadge } from "@/components/ui/Badge";
import { serverDb } from "@/lib/supabaseServer";
import { formatSEK } from "@/lib/utils";
import { Product, Review } from "@/types";
import {
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  Truck,
  ChevronRight,
  Building2,
  Sparkles,
  Scissors,
  CheckCircle2,
  Layers
} from "lucide-react";

export const revalidate = 60; // Incremental Static Regeneration for Google SEO (every 60s)

export default async function HomePage() {
  const settings = await serverDb.getSettings();

  // Query live Supabase database on server
  let products: Product[] = [];
  let reviews: Review[] = [];

  try {
    const [fetchedProducts, fetchedReviews] = await Promise.all([
      serverDb.getProducts(),
      serverDb.getReviews(),
    ]);
    products = fetchedProducts;
    reviews = fetchedReviews;
  } catch (e) {
    console.error("Home page DB fetch fallback", e);
  }

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-0 pb-0 overflow-hidden bg-[#F6F3ED] text-[#1C1917]">

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO SECTION — DYNAMIC CMS DRIVEN (NORDIC LUXURY EDITORIAL)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[88vh] flex items-end overflow-hidden">
        {/* Atmospheric Workshop Image */}
        <Image
          src={settings.heroImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2200&q=85"}
          alt="Skandiva Tapetserarverkstad Stockholm"
          fill
          priority
          className="object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
        />

        {/* Dark Gradient Overlays for Maximum Text Legibility & Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/95 via-[#1C1917]/40 to-[#1C1917]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/80 via-transparent to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20 w-full">
          <div className="max-w-2xl space-y-6">

            {/* Emblem Pill & Master Badge */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#DCD5C8] animate-pulse" />
              <span className="uppercase text-[11px]">{settings.heroBadge}</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F6F3ED] font-normal leading-[1.1] tracking-tight">
              {settings.heroHeadline}
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base text-[#F6F3ED]/85 leading-relaxed font-sans max-w-xl font-normal">
              {settings.heroSubtitle}
            </p>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/tjanster/lamino-express"
                className="px-7 py-3.5 bg-[#F6F3ED] text-[#1C1917] font-mono text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-white transition-all rounded-full shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Omklädsel Lamino</span>
                <ArrowRight className="w-4 h-4 text-[#5B4433]" />
              </Link>

              <Link
                href="/butik"
                className="px-7 py-3.5 bg-white/15 backdrop-blur-md text-[#F6F3ED] border border-white/30 font-mono text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-white/25 transition-all rounded-full"
              >
                Utforska Butik
              </Link>

              <Link
                href="/tjanster/offert"
                className="px-6 py-3.5 bg-white/10 backdrop-blur-md text-[#F6F3ED] border border-white/20 font-mono text-xs sm:text-sm uppercase tracking-wider font-medium hover:bg-white/20 transition-all rounded-full hidden sm:inline-flex"
              >
                Begär Offert
              </Link>
            </div>

            {/* Micro Trust Bullets */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] font-mono text-[#F6F3ED]/75">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCD5C8]" />
                10–14 dagars garanterad ledtid
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCD5C8]" />
                5 års hantverksgaranti
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCD5C8]" />
                Möbelbud i Storstockholm
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          2. BRAND HERITAGE & ATELIER SIGNATURE (SKANDIVA EMBLEM)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#F6F3ED] border-b border-[#DCD5C8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Authentic Brand Crest */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-8 bg-white/60 border border-[#DCD5C8] shadow-sm rounded-sm">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#5B4433]/30 shadow-md bg-[#F6F3ED] mb-4">
                <Image
                  src="/skandiva_classic_logo.png"
                  alt="Skandiva Stockholm Sigill"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
                SKANDIVA
              </h3>
              <p className="font-mono text-xs text-[#5B4433] uppercase tracking-[0.2em] mt-1">
                Tapetserarverkstad • Stockholm
              </p>
              <p className="font-mono text-[10px] text-[#1C1917]/50 uppercase tracking-widest mt-2 border-t border-[#DCD5C8] pt-2 w-full">
                Köp • Sälj • Renovering
              </p>
            </div>

            {/* Right: The Preservation Manifesto */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5B4433]">
                <Scissors className="w-4 h-4" />
                <span>Traditionellt Hantverk • Södermalm</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal leading-snug">
                Vi bevarar och förädlar det svenska designarvet.
              </h2>
              <p className="text-sm sm:text-base text-[#1C1917]/80 font-sans leading-relaxed">
                Varje möbel som lämnar vår verkstad på Åsögatan är renoverad med samma omsorg, precision och material som när den en gång skapades av Sveriges främsta formgivare. Vi byter slitna bärvävar, förnyar spiralfjädring och klär om med certifierat Skandilock-fårskinn eller vegetabiliskt garvat läder från Tärnsjö och Elmo.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-[#DCD5C8]">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#5B4433] block">1 400+</span>
                  <span className="text-xs font-mono text-[#1C1917]/70 uppercase">Möbler restaurerade</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#5B4433] block">5 År</span>
                  <span className="text-xs font-mono text-[#1C1917]/70 uppercase">Full hantverksgaranti</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#5B4433] block">100%</span>
                  <span className="text-xs font-mono text-[#1C1917]/70 uppercase">Cirkulärt återbruk</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          3. VÅR BUTIK — LIVE SUPABASE POWERED CATALOG
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-5 lg:pt-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#5B4433] block">
                Klassiker i Lager
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
                Vår butik
              </h2>
              <p className="text-sm text-[#1C1917]/70 font-sans leading-relaxed">
                Ett noga utvalt sortiment av skandinaviska designmöbler, egentillverkade dynsatser och tillbehör — nyklädda i vår ateljé och redo för omgående leverans.
              </p>
              <Link
                href="/butik"
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#1C1917] text-[#1C1917] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#1C1917] hover:text-[#F6F3ED] transition-colors"
              >
                <span>Till Butiken ({products.length} st)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Column: 4-Up Grid (Clean & Borderless Fanins Style) */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/butik/${product.slug}`}
                    className="group flex flex-col space-y-2.5"
                  >
                    <div className="relative aspect-square w-full bg-white/70 overflow-hidden flex items-center justify-center p-2">
                      <Image
                        src={product.primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.stockStatus === "sald" ? (
                        <div className="absolute top-2 left-2 bg-ink/90 text-canvas font-mono text-[10px] uppercase px-2 py-0.5 font-bold">
                          Såld
                        </div>
                      ) : product.conditionGrade ? (
                        <div className="absolute top-2 left-2">
                          <ConditionBadge grade={product.conditionGrade} />
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#5B4433] block">
                        {product.designer}
                      </span>
                      <h4 className="text-xs sm:text-sm font-sans font-normal text-[#1C1917] group-hover:text-[#5B4433] transition-colors line-clamp-2 uppercase">
                        {product.name}
                      </h4>
                      <div className="pt-0.5">
                        <span className="font-sans text-sm sm:text-base font-bold text-[#1C1917]">
                          {formatSEK(product.basePrice)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          4. LAMINO EXPRESS — LUXURY ACCENT SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#8B7355] text-[#F6F3ED] py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest text-[#DCD5C8]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flaggskeppstjänst • Fast Pris</span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl font-normal uppercase tracking-wide leading-tight text-white">
                {settings.laminoTitle}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#F6F3ED]/90 font-sans">
                {settings.laminoDescription}
              </p>

              <div className="space-y-3 bg-black/15 p-5 border border-white/15 rounded-sm">
                <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
                  <span>Omklädsel Lamino Fåtölj (inkl. fårskinn)</span>
                  <span className="font-bold text-white">{formatSEK(settings.laminoPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
                  <span>Tillägg: Tillhörande Fotpall</span>
                  <span className="font-bold text-white">+1 900 kr</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#DCD5C8]">
                  <span>Ledtid i verkstaden</span>
                  <span className="font-bold">10–14 arbetsdagar</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link
                  href="/tjanster/lamino-express"
                  className="px-7 py-3.5 bg-white text-[#1C1917] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#F6F3ED] transition-colors rounded-full shadow-md flex items-center gap-2"
                >
                  <span>Konfigurera & Boka Lamino</span>
                  <ArrowRight className="w-4 h-4 text-[#5B4433]" />
                </Link>
                <Link
                  href="/tjanster/offert"
                  className="font-mono text-xs uppercase tracking-widest text-[#F6F3ED] border-b border-white/40 hover:border-white pb-0.5 transition-colors"
                >
                  Har du andra modeller? Skicka förfrågan →
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border-4 border-white/10">
              <Image
                src={settings.laminoImage || "/IMG_0948.png"}
                alt="Lamino omklädd i fårskinn hos Skandiva"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono text-white rounded-none border border-white/20">
                Äkta Gotlandsfårskinn • Skandilock
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          5. INTERACTIVE BEFORE & AFTER (FÖRE & EFTER)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#DCD5C8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5B4433]">
                <Layers className="w-4 h-4" />
                <span>Verkstadsgalleri • Före & Efter</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal leading-snug">
                {settings.beforeAfterTitle}
              </h2>
              <p className="text-sm text-[#1C1917]/75 font-sans leading-relaxed">
                {settings.beforeAfterDescription}
              </p>
              <div className="pt-2">
                <Link
                  href="/galleri"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#5B4433] hover:text-[#1C1917] font-semibold border-b border-[#5B4433] pb-1 transition-colors"
                >
                  <span>Utforska hela före- & efterarkivet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-2 bg-[#F6F3ED] border border-[#DCD5C8] shadow-lg rounded-sm">
                <BeforeAfterSlider
                  beforeImage="/IMG_1236.png"
                  afterImage="/IMG_0948.png"
                  beforeLabel="Före (Slitet tyg)"
                  afterLabel="Efter (Skandilock Fårskinn)"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          6. REINSTATED SPLIT WORKSHOP BANNERS — "OMKLÄDSEL FÅTÖLJ & SOFFA"
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#1C1917] text-[#F6F3ED] divide-y divide-white/10">
        
        {/* Banner 1: OMKLÄDSEL FÅTÖLJ */}
        <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center overflow-hidden">
          <Image
            src={settings.fatoljBannerImage || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80"}
            alt={settings.fatoljBannerTitle}
            fill
            className="object-cover object-center opacity-40 brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal uppercase tracking-wide">
                  {settings.fatoljBannerTitle}
                </h2>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <p className="text-sm sm:text-base text-white/85 font-sans leading-relaxed max-w-lg">
                  {settings.fatoljBannerDescription}
                </p>
                <div>
                  <Link
                    href="/tjanster/offert?category=Fatolj"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white hover:text-[#DCD5C8] font-bold border-b-2 border-white pb-1 transition-all"
                  >
                    <span>{settings.fatoljBannerCta}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner 2: OMKLÄDSEL SOFFA */}
        <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center overflow-hidden">
          <Image
            src={settings.soffaBannerImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80"}
            alt={settings.soffaBannerTitle}
            fill
            className="object-cover object-center opacity-40 brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal uppercase tracking-wide">
                  {settings.soffaBannerTitle}
                </h2>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <p className="text-sm sm:text-base text-white/85 font-sans leading-relaxed max-w-lg">
                  {settings.soffaBannerDescription}
                </p>
                <div>
                  <Link
                    href="/tjanster/offert?category=Soffa"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white hover:text-[#DCD5C8] font-bold border-b-2 border-white pb-1 transition-all"
                  >
                    <span>{settings.soffaBannerCta}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* ═══════════════════════════════════════════════════════════════
          7. TRUST & REPUTATION STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-[#F6F3ED] border-y border-[#DCD5C8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: Clock, label: "10–14 arbetsdagar", sub: "Garanterad snabb ledtid" },
              { icon: ShieldCheck, label: "5 års garanti", sub: "På hantverk & bärväv" },
              { icon: Truck, label: "Eget Möbelbud", sub: "Hämtning i Storstockholm" },
              { icon: Star, label: "4.9 / 5 i betyg", sub: "180+ nöjda möbelägare" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="space-y-1.5 p-3">
                <Icon className="w-6 h-6 text-[#5B4433] mx-auto" />
                <p className="font-serif text-base font-semibold text-[#1C1917]">{label}</p>
                <p className="text-xs text-[#1C1917]/65 font-sans">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          8. CUSTOMER REVIEWS (LIVE SUPABASE FETCHED)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-[#5B4433]">
              Verifierade Omdömen
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
              Vad säger våra kunder?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-[#FAFAF8] border border-[#DCD5C8] p-7 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#5B4433]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif text-sm sm:text-base text-[#1C1917]/85 italic leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DCD5C8] text-xs font-mono flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#1C1917] block">{review.author}</span>
                    <span className="text-[#5B4433]">{review.furnitureModel}</span>
                  </div>
                  <span className="text-[#1C1917]/50">{review.location}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          9. B2B & ENTERPRISE BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#1C1917] text-[#F6F3ED]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#DCD5C8]">
              <Building2 className="w-4 h-4 text-[#DCD5C8]" />
              <span>Företag, Kontor & Hotellmiljöer</span>
            </div>
            <h3 className="font-serif text-3xl font-normal text-white">
              {settings.b2bTitle}
            </h3>
            <p className="text-[#F6F3ED]/75 text-sm font-sans leading-relaxed">
              {settings.b2bDescription}
            </p>
          </div>

          <Link
            href="/tjanster/offert?b2b=true"
            className="whitespace-nowrap px-8 py-4 bg-[#F6F3ED] text-[#1C1917] font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-lg rounded-none"
          >
            <span>Begär Företagsoffert</span>
            <ArrowRight className="w-4 h-4 text-[#5B4433]" />
          </Link>
        </div>
      </section>

    </div>
  );
}
