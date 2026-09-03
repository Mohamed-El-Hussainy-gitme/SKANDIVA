import React from "react";
import Image from "next/image";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { Award, ShieldCheck, RefreshCw, Scissors } from "lucide-react";
import { serverDb } from "@/lib/db";

export const revalidate = 60;

export const metadata = {
  title: "Om Oss — Skandiva Tapetserarverkstad Stockholm | Södermalm",
  description: "Lär känna Skandiva Tapetserarverkstad på Åsögatan. Vår filosofi, hantverkstradition och passion för skandinaviska designklassiker.",
};

export default async function OmOssPage() {
  const settings = await serverDb.getSettings();

  const title = settings.aboutTitle || "Traditionellt tapetserarhantverk sedan 2018";
  const description = settings.aboutDescription || "Skandiva grundades på Åsögatan på Södermalm i Stockholm med en passionerad vision: att bevara, rädda och förädla Skandinaviens mest älskade designmöbler med kompromisslöst hantverk.";
  const mainImage = settings.aboutImage || "/artilleriet-store-4.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* ─── Header ─── */}
      <div className="border-b border-stone-200 pb-10 space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-stone-500">
          Vår Historia &amp; Filosofi • Skandiva Ateljé
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-normal leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-stone-700 max-w-3xl font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* ─── Story Grid with Authentic Imagery ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500">
            <Scissors className="w-4 h-4" />
            <span>Mästarkompetens i varje söm</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Kvalitet som överlever generationer
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-stone-700 font-sans leading-relaxed">
            <p>
              I en tid av massproduktion och slit-och-släng står Skandiva för motsatsen: djup vördnad för originalmöbler formgivna av mästare som Yngve Ekström, Bruno Mathsson, Carl Malmsten och DUX.
            </p>
            <p>
              Våra auktoriserade möbeltapetserare kombinerar sekelskiftets traditionella metoder — såsom sadelgjordsflätning i naturhampa, handsydda knappar och tagelstoppning — med marknadens finaste material. Vi samarbetar uteslutande med ledande skandinaviska garverier och väverier som Skandilock, Elmo Läder och Tärnsjö.
            </p>
            <p>
              Varje fåtölj eller soffa som lämnar vår verkstad förses med Skandivas certifierade mästarsigill och en 5-årig full garanti på bärighet, stomme och sömnad.
            </p>
          </div>

          <div className="p-6 bg-stone-100 border-l-4 border-stone-800 space-y-2">
            <span className="font-serif text-base sm:text-lg italic text-stone-900 font-medium block">
              &ldquo;En äkta Lamino eller Pernilla blir bara vackrare med åren om den tas om hand av rätt händer.&rdquo;
            </span>
            <span className="block font-mono text-xs text-stone-500 uppercase tracking-wider">
              — Skandiva Tapetserarverkstad Stockholm
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/5] w-full bg-stone-100 border border-stone-200 overflow-hidden shadow-lg">
            <Image
              src={mainImage}
              alt="Skandiva Verkstad och Butik Stockholm"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 border border-stone-200 shadow-md rounded-full">
              <CrestSeal size="sm" variant="image" subtitle="" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Gallery Triad of the Workshop & Atelier ─── */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500">
            Bakom Kulisserna
          </span>
          <h3 className="font-serif text-3xl text-stone-900 font-normal">
            Från vår ateljé på Södermalm
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-stone-100 border border-stone-200 overflow-hidden shadow-xs">
              <Image
                src="/IMG_0948.png"
                alt="Lamino i grått fårskinn"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <p className="font-serif text-sm font-medium text-stone-900">Precision i Fårskinn</p>
            <p className="text-xs text-stone-600 font-sans">Specialtillskurna partier av tätlockigt Skandilock-fårskinn anpassade för Lamino.</p>
          </div>

          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-stone-100 border border-stone-200 overflow-hidden shadow-xs">
              <Image
                src="/IMG_0611.jpeg"
                alt="Pernilla 69 i läder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <p className="font-serif text-sm font-medium text-stone-900">Svenskt Elmo Läder</p>
            <p className="text-xs text-stone-600 font-sans">Handsydda djuphäftningar på Bruno Mathssons tidlösa fåtöljer.</p>
          </div>

          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-stone-100 border border-stone-200 overflow-hidden shadow-xs">
              <Image
                src="/artilleriet-store-21.jpg"
                alt="Skandiva showroom"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <p className="font-serif text-sm font-medium text-stone-900">Klassikerbutik &amp; Showroom</p>
            <p className="text-xs text-stone-600 font-sans">Välkommen in till vår ateljé för att provsitta och välja tygprover över en kaffe.</p>
          </div>
        </div>
      </div>

      {/* ─── 3 Core Pillars ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-stone-200">
        <div className="border border-stone-200 bg-white p-7 space-y-3 shadow-xs">
          <Award className="w-8 h-8 text-stone-800" />
          <h3 className="font-serif text-xl text-stone-900 font-medium">Auktoriserat Hantverk</h3>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Medlemskap i Sveriges Tapetserarmästare och decennier av samlad erfarenhet av böjträ, sadelgjord och skinn.
          </p>
        </div>

        <div className="border border-stone-200 bg-white p-7 space-y-3 shadow-xs">
          <RefreshCw className="w-8 h-8 text-stone-800" />
          <h3 className="font-serif text-xl text-stone-900 font-medium">Cirkulär Hållbarhet</h3>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Att renovera en befintlig kvalitetsmöbel sparar upp till 80% av koldioxidutsläppen jämfört med att producera nytt.
          </p>
        </div>

        <div className="border border-stone-200 bg-white p-7 space-y-3 shadow-xs">
          <ShieldCheck className="w-8 h-8 text-stone-800" />
          <h3 className="font-serif text-xl text-stone-900 font-medium">5 Års Full Garanti</h3>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Vi står till 100% bakom varje söm, bärväv och stomjustering vi utför i vår verkstad på Södermalm.
          </p>
        </div>
      </div>

    </div>
  );
}
