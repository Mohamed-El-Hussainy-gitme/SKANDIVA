import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, RefreshCw, Award, MapPin, Mail, Clock, Phone } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1917] text-[#F6F3ED] pt-16 pb-12 border-t-4 border-[#5B4433]">
      {/* 4 Trust & Heritage Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/5 border border-white/10 shrink-0 rounded-sm">
              <Award className="w-6 h-6 text-[#DCD5C8]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#F6F3ED]">Mästarkompetens</h4>
              <p className="text-xs text-[#F6F3ED]/70 font-sans mt-1 leading-relaxed">
                Auktoriserat tapetserarhantverk med traditionella och moderna metoder.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/5 border border-white/10 shrink-0 rounded-sm">
              <ShieldCheck className="w-6 h-6 text-[#DCD5C8]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#F6F3ED]">5 Års Garanti</h4>
              <p className="text-xs text-[#F6F3ED]/70 font-sans mt-1 leading-relaxed">
                Full garanti på utfört hantverk, bärväv, spiralfjädring och sömnad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/5 border border-white/10 shrink-0 rounded-sm">
              <Truck className="w-6 h-6 text-[#DCD5C8]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#F6F3ED]">Hämtning & Leverans</h4>
              <p className="text-xs text-[#F6F3ED]/70 font-sans mt-1 leading-relaxed">
                Eget möbelbud i hela Storstockholm samt säker transport i hela landet.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/5 border border-white/10 shrink-0 rounded-sm">
              <RefreshCw className="w-6 h-6 text-[#DCD5C8]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#F6F3ED]">Cirkulär Hållbarhet</h4>
              <p className="text-xs text-[#F6F3ED]/70 font-sans mt-1 leading-relaxed">
                Vi förlänger livslängden på svenska designikoner i generationer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body with Logo, Contact & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Crest Info (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#5B4433]/50 shadow-md bg-[#F6F3ED] shrink-0">
                <Image
                  src="/skandiva_classic_logo.png"
                  alt="Skandiva Stockholm Emblem"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight block text-[#F6F3ED]">SKANDIVA</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#DCD5C8] uppercase">
                  Tapetserarverkstad • Stockholm
                </span>
              </div>
            </div>
            <p className="text-xs text-[#F6F3ED]/80 leading-relaxed font-sans max-w-md">
              Skandiva är Stockholms ledande tapetserarverkstad och butik på Södermalm. Specialiserade på omklädsel och restaurering av svenska möbelikoner som Lamino, Pernilla, Karin och DUX med äkta Skandilock-fårskinn och exklusiva läder.
            </p>
            <div className="pt-2 text-xs font-mono text-[#F6F3ED]/75 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#DCD5C8] shrink-0" />
                <span>Verkstad: Åsögatan 142, 116 24 Södermalm, Stockholm</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#DCD5C8] shrink-0" />
                <span>Mån–Fre: 08:30 – 17:00 • Lör: Enligt tidsbokning</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DCD5C8] shrink-0" />
                <span>08-640 22 90</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DCD5C8] shrink-0" />
                <span>kontakt@skandiva.se</span>
              </div>
            </div>
          </div>

          {/* Butik & Klassiker (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-serif text-base text-[#F6F3ED] uppercase tracking-wider border-b border-white/10 pb-2">
              Butik
            </h5>
            <ul className="space-y-2 text-xs font-sans text-[#F6F3ED]/80">
              <li><Link href="/butik" className="hover:text-white underline-offset-4 hover:underline">Alla Möbler i Lager</Link></li>
              <li><Link href="/butik?designer=Yngve%20Ekstr%C3%B6m" className="hover:text-white underline-offset-4 hover:underline">Lamino / Yngve Ekström</Link></li>
              <li><Link href="/butik?designer=Bruno%20Mathsson" className="hover:text-white underline-offset-4 hover:underline">Bruno Mathsson (Pernilla, Karin)</Link></li>
              <li><Link href="/butik?designer=DUX" className="hover:text-white underline-offset-4 hover:underline">DUX Klassiker</Link></li>
              <li><Link href="/butik?category=Tillbehor" className="hover:text-white underline-offset-4 hover:underline">Dynsatser & Fårskinn</Link></li>
              <li><Link href="/galleri" className="hover:text-white underline-offset-4 hover:underline">Före- & Efterarkiv</Link></li>
            </ul>
          </div>

          {/* Workshop Services (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-serif text-base text-[#F6F3ED] uppercase tracking-wider border-b border-white/10 pb-2">
              Verkstad
            </h5>
            <ul className="space-y-2 text-xs font-sans text-[#F6F3ED]/80">
              <li><Link href="/tjanster/lamino-express" className="text-[#DCD5C8] font-medium hover:text-white">Lamino Express (Fast pris)</Link></li>
              <li><Link href="/tjanster" className="hover:text-white underline-offset-4 hover:underline">Fåtöljklädsel & Bandbyte</Link></li>
              <li><Link href="/tjanster" className="hover:text-white underline-offset-4 hover:underline">Soffrenovering & Fjädring</Link></li>
              <li><Link href="/tjanster/offert" className="hover:text-white underline-offset-4 hover:underline">B2B & Hotellprojekt</Link></li>
              <li><Link href="/tjanster/offert" className="hover:text-white underline-offset-4 hover:underline">Begär Kostnadsfri Offert</Link></li>
              <li><Link href="/spara-order" className="hover:text-white underline-offset-4 hover:underline text-[#DCD5C8]">Spåra Pågående Order</Link></li>
            </ul>
          </div>

          {/* Information & Legal (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-serif text-base text-[#F6F3ED] uppercase tracking-wider border-b border-white/10 pb-2">
              Information & Villkor
            </h5>
            <ul className="space-y-2 text-xs font-sans text-[#F6F3ED]/80">
              <li><Link href="/om-oss" className="hover:text-white underline-offset-4 hover:underline">Om Vår Verkstad</Link></li>
              <li><Link href="/kontakt" className="hover:text-white underline-offset-4 hover:underline">Hitta till Södermalm</Link></li>
              <li><Link href="/kontakt" className="hover:text-white underline-offset-4 hover:underline">Leverans- & Köpvillkor</Link></li>
              <li><Link href="/kontakt" className="hover:text-white underline-offset-4 hover:underline">Integritetspolicy</Link></li>
            </ul>
            <div className="pt-3 border-t border-white/10">
              <span className="text-[11px] font-mono text-[#F6F3ED]/60 block">Organisationsnummer:</span>
              <span className="text-xs font-mono text-[#F6F3ED] font-semibold">559281-3942</span>
              <span className="text-[10px] font-mono text-[#F6F3ED]/50 block mt-0.5">Godkänd för F-skatt • Momsreg.nr: SE559281394201</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Payment Badges & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F6F3ED]/60">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-wider">Trygg Betalning:</span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-sans font-semibold text-xs border border-white/15">Klarna.</span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-sans font-semibold text-xs border border-white/15">Swish</span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-sans font-semibold text-xs border border-white/15">VISA</span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-sans font-semibold text-xs border border-white/15">Mastercard</span>
        </div>

        <div>
          © {new Date().getFullYear()} Skandiva Tapetserarverkstad AB. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
};
