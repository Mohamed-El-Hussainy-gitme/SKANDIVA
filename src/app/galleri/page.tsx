import React from "react";
import Link from "next/link";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { ArrowRight } from "lucide-react";

export default function GalleriPage() {
  const galleryItems = [
    {
      id: "gal-lamino",
      title: "Yngve Ekström — Lamino Fåtölj & Fotpall",
      description: "Från 40 år gammal sliten och noppig textil till nytt 17mm tätlockigt Gotlandsfårskinn i grafitgrå från Skandilock, ny förstärkt bärväv och hårdvaxoljad bokstomme.",
      before: "/IMG_1236.png",
      after: "/IMG_0948.png",
      turnaround: "10 arbetsdagar",
      material: "Skandilock Gotlandsfårskinn",
    },
    {
      id: "gal-pernilla",
      title: "Bruno Mathsson — Pernilla 69 i Svenskt Cognacläder",
      description: "Byte av uttorkade bärband till original sadelgjord i naturhampa, handsydd dynsats i svenskt vegetabilgarvat Elmo Soft anilinläder samt justering av nackkuddens läderremmar.",
      before: "/IMG_1236.png",
      after: "/IMG_0611.jpeg",
      turnaround: "14 arbetsdagar",
      material: "Elmo Soft Cognacläder",
    },
    {
      id: "gal-karin",
      title: "Bruno Mathsson — Karin 73 på Hjulstativ (DUX)",
      description: "Totalrenovering av kromat hjulstativ, ny bärande bärväv med millimeterprecision och helomklädsel med handsydd djuphäftning i djupsvart Elmo-läder.",
      before: "/IMG_1289.jpeg",
      after: "/IMG_8045.jpeg",
      turnaround: "12 arbetsdagar",
      material: "Elmo Soft Svart Anilin",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-[#DCD5C8] pb-8 space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[#5B4433]">
          Skandiva Hantverksarkiv • Före & Efter
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] font-normal leading-tight">
          Restaureringar & Möbeltransformationer
        </h1>
        <p className="text-base sm:text-lg text-[#1C1917]/75 max-w-2xl font-sans leading-relaxed">
          Varje möbel bär på en historia. Se hur vi bevarar originalets själ, ergonomi och värde med mästarkompetens och marknadens finaste naturmaterial.
        </p>
      </div>

      {/* Gallery Transformation Cards */}
      <div className="space-y-16">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#DCD5C8] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Slider */}
            <div className="lg:col-span-8">
              <BeforeAfterSlider
                beforeImage={item.before}
                afterImage={item.after}
                title={item.title}
                description={item.description}
                beforeLabel="Före renovering"
                afterLabel="Efter hos Skandiva"
              />
            </div>

            {/* Verification & Details */}
            <div className="lg:col-span-4 space-y-5 lg:pl-4">
              <div className="flex items-center gap-3">
                <CrestSeal size="sm" variant="image" subtitle="" />
                <div>
                  <span className="font-serif text-sm font-semibold text-[#1C1917] block">Mästarintyg & Certifikat</span>
                  <span className="text-[11px] font-mono text-[#5B4433]">Södermalm Verkstad • Stockholm</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono bg-[#FAFAF8] p-4 border border-[#DCD5C8]">
                <div className="flex justify-between border-b border-[#DCD5C8]/60 pb-1.5">
                  <span className="text-[#1C1917]/60">Material:</span>
                  <span className="font-bold text-[#1C1917]">{item.material}</span>
                </div>
                <div className="flex justify-between border-b border-[#DCD5C8]/60 pb-1.5">
                  <span className="text-[#1C1917]/60">Verkstadstid:</span>
                  <span className="font-bold text-[#1C1917]">{item.turnaround}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1C1917]/60">Garanti:</span>
                  <span className="font-bold text-[#5B4433]">5 års hantverksgaranti</span>
                </div>
              </div>

              <p className="text-xs text-[#1C1917]/75 font-sans leading-relaxed">
                Alla arbeten utförs för hand i vår verkstad. Vi återanvänder och förstärker stommar i massivt trä eller formpressad böjträ så att möbeln kan glädja nästa generation i 50 år till.
              </p>

              <div className="pt-2">
                <Link
                  href="/tjanster/offert"
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#1C1917] text-[#F6F3ED] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#5B4433] transition-colors shadow-sm gap-2"
                >
                  <span>Begär offert för liknande möbel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
