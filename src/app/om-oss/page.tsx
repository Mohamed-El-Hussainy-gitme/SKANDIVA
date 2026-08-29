import React from "react";
import Image from "next/image";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { Award, ShieldCheck, RefreshCw, Scissors } from "lucide-react";

export default function OmOssPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* ─── Header ─── */}
      <div className="border-b border-[#DCD5C8] pb-10 space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#5B4433]">
          Vår Historia & Filosofi • Skandiva Ateljé
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] font-normal leading-tight">
          Traditionellt tapetserarhantverk sedan 2018
        </h1>
        <p className="text-base sm:text-lg text-[#1C1917]/80 max-w-3xl font-sans leading-relaxed">
          Skandiva grundades på Åsögatan på Södermalm i Stockholm med en passionerad vision: att bevara, rädda och förädla Skandinaviens mest älskade designmöbler med kompromisslöst hantverk.
        </p>
      </div>

      {/* ─── Story Grid with Authentic Imagery ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5B4433]">
            <Scissors className="w-4 h-4" />
            <span>Mästarkompetens i varje söm</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Kvalitet som överlever generationer
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#1C1917]/80 font-sans leading-relaxed">
            <p>
              I en tid av massproduktion och slit-och-släng står Skandiva för motsatsen: djup vördnad för originalmöbler formgivna av mästare som Yngve Ekström, Bruno Mathsson, Carl Malmsten och DUX.
            </p>
            <p>
              Våra auktoriserade möbeltapetserare kombinerar sekelskiftets traditionella metoder — såsom handsydda spiralfjädrar, sadelgjordsflätning i naturhampa och tagelstoppning — med marknadens finaste material. Vi samarbetar uteslutande med ledande skandinaviska garverier och väverier som Skandilock, Elmo Läder och Kvadrat.
            </p>
            <p>
              Varje fåtölj eller soffa som lämnar vår verkstad förses med Skandivas certifierade mästarsigill och en 5-årig full garanti på bärighet, stomme och sömnad.
            </p>
          </div>

          <div className="p-6 bg-[#FAFAF8] border-l-4 border-[#5B4433] space-y-2">
            <span className="font-serif text-base sm:text-lg italic text-[#1C1917] font-medium block">
              &ldquo;En äkta Lamino eller Pernilla blir bara vackrare med åren om den tas om hand av rätt händer.&rdquo;
            </span>
            <span className="block font-mono text-xs text-[#5B4433] uppercase tracking-wider">
              — Skandiva Tapetserarverkstad Stockholm
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/5] w-full bg-[#F6F3ED] border border-[#DCD5C8] overflow-hidden shadow-lg rounded-sm">
            <Image
              src="/artilleriet-store-4.jpg"
              alt="Skandiva Verkstad och Butik Stockholm"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 border border-[#DCD5C8] shadow-md rounded-full">
              <CrestSeal size="sm" variant="image" subtitle="" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Gallery Triad of the Workshop & Atelier ─── */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#5B4433]">
            Bakom Kulisserna
          </span>
          <h3 className="font-serif text-3xl text-[#1C1917] font-normal">
            Från vår ateljé på Södermalm
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-[#F6F3ED] border border-[#DCD5C8] overflow-hidden shadow-sm">
              <Image
                src="/IMG_0948.png"
                alt="Lamino i grått fårskinn"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-serif text-sm font-medium text-[#1C1917]">Precision i Fårskinn</p>
            <p className="text-xs text-[#1C1917]/70 font-sans">Specialtillskurna partier av tätlockigt Skandilock-fårskinn anpassade för Lamino.</p>
          </div>

          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-[#F6F3ED] border border-[#DCD5C8] overflow-hidden shadow-sm">
              <Image
                src="/IMG_0611.jpeg"
                alt="Pernilla 69 i läder"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-serif text-sm font-medium text-[#1C1917]">Svenskt Elmo Läder</p>
            <p className="text-xs text-[#1C1917]/70 font-sans">Handsydda djuphäftningar på Bruno Mathssons tidlösa fåtöljer.</p>
          </div>

          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-[#F6F3ED] border border-[#DCD5C8] overflow-hidden shadow-sm">
              <Image
                src="/artilleriet-store-21.jpg"
                alt="Skandiva showroom"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-serif text-sm font-medium text-[#1C1917]">Klassikerbutik & Showroom</p>
            <p className="text-xs text-[#1C1917]/70 font-sans">Välkommen in till vår ateljé för att provsitta och välja tygprover över en kaffe.</p>
          </div>
        </div>
      </div>

      {/* ─── 3 Core Pillars ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-[#DCD5C8]">
        <div className="border border-[#DCD5C8] bg-white p-7 space-y-3 shadow-sm">
          <Award className="w-8 h-8 text-[#5B4433]" />
          <h3 className="font-serif text-xl text-[#1C1917] font-medium">Auktoriserat Hantverk</h3>
          <p className="text-xs text-[#1C1917]/70 font-sans leading-relaxed">
            Medlemskap i Sveriges Tapetserarmästare och decennier av samlad erfarenhet av böjträ, sadelgjord och skinn.
          </p>
        </div>

        <div className="border border-[#DCD5C8] bg-white p-7 space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#5B4433]" />
          <h3 className="font-serif text-xl text-[#1C1917] font-medium">Cirkulär Hållbarhet</h3>
          <p className="text-xs text-[#1C1917]/70 font-sans leading-relaxed">
            Att renovera en befintlig kvalitetsmöbel sparar upp till 80% av koldioxidutsläppen jämfört med att producera nytt.
          </p>
        </div>

        <div className="border border-[#DCD5C8] bg-white p-7 space-y-3 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-[#5B4433]" />
          <h3 className="font-serif text-xl text-[#1C1917] font-medium">5 Års Full Garanti</h3>
          <p className="text-xs text-[#1C1917]/70 font-sans leading-relaxed">
            Vi står till 100% bakom varje söm, bärväv och stomjustering vi utför i vår verkstad på Södermalm.
          </p>
        </div>
      </div>

    </div>
  );
}
