import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Clock, Phone, MessageSquare } from "lucide-react";
import { serverDb } from "@/lib/db";

export async function Footer() {
  let settings;
  try {
    settings = await serverDb.getSettings();
  } catch (e) {
    console.error("Failed to load settings in Footer", e);
  }

  const companyName = settings?.companyName || "Skandiva Tapetserarverkstad AB";
  const orgNumber = settings?.orgNumber || "559281-3942";
  const address = settings?.address || "Åsögatan 142, 116 24 Danderyd, Stockholm";
  const openingHours = settings?.openingHours || "Mån–Fre: 08:30 – 17:00 • Lör: Enligt tidsbokning";
  const phone = settings?.phone || "08-640 22 90";
  const email = settings?.email || "kontakt@skandiva.se";
  const whatsappNumber = settings?.whatsappNumber || "+4686402290";
  const cleanMomsNr = orgNumber.replace(/[^0-9]/g, "");

  return (
    <footer className="bg-stone-950 text-stone-200 pt-16 pb-12 border-t-4 border-stone-800">
      {/* Main Footer Body with Logo, Contact & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Crest Info (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-stone-700 bg-stone-100 shrink-0">
                <Image
                  src="/skandiva_classic_logo.png"
                  alt="Skandiva Stockholm Emblem"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight block text-white">SKANDIVA</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase">
                  {companyName}
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans max-w-md">
              Skandiva är Stockholms specialiserade tapetserarverkstad och butik på Danderyd. Omklädsel och restaurering av svenska möbelikoner som Lamino, Pernilla, Karin och DUX med äkta Skandilock-fårskinn och exklusiva läder.
            </p>
            <div className="pt-2 text-xs font-mono text-stone-300 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Verkstad: {address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              {whatsappNumber && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-stone-400 shrink-0" />
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp: {whatsappNumber}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Butik (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-serif text-base text-white uppercase tracking-wider border-b border-stone-800 pb-2">
              Butik
            </h5>
            <ul className="space-y-2 text-xs font-sans text-stone-400">
              <li><Link href="/butik" className="hover:text-white transition-colors">Alla Möbler i Lager</Link></li>
              <li><Link href="/butik" className="hover:text-white transition-colors">Renoverade Fåtöljer</Link></li>
              <li><Link href="/butik" className="hover:text-white transition-colors">Renoverade Soffor</Link></li>
              <li><Link href="/butik" className="hover:text-white transition-colors">Klassiker i Nyskick</Link></li>
              <li><Link href="/galleri" className="hover:text-white transition-colors">Före- &amp; Eftergalleri</Link></li>
            </ul>
          </div>

          {/* Omklädsel & Tjänster (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-serif text-base text-white uppercase tracking-wider border-b border-stone-800 pb-2">
              Omklädsel
            </h5>
            <ul className="space-y-2 text-xs font-sans text-stone-400">
              <li><Link href="/dux-omkladsel" className="hover:text-white transition-colors">DUX &amp; Bruno Mathsson</Link></li>
              <li><Link href="/lamino-omkladsel" className="hover:text-white transition-colors">Lamino i Fårskinn</Link></li>
              <li><Link href="/begar-offert" className="hover:text-white transition-colors font-semibold text-stone-200">Begär Offert</Link></li>
            </ul>
          </div>

          {/* Information & Legal (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-serif text-base text-white uppercase tracking-wider border-b border-stone-800 pb-2">
              Information
            </h5>
            <ul className="space-y-2 text-xs font-sans text-stone-400">
              <li><Link href="/om-oss" className="hover:text-white transition-colors">Om Vår Verkstad</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Hitta till Danderyd</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakta Oss</Link></li>
            </ul>
            <div className="pt-3 border-t border-stone-800">
              <span className="text-[11px] font-mono text-stone-500 block">Organisationsnummer:</span>
              <span className="text-xs font-mono text-stone-300 font-semibold">{orgNumber}</span>
              <span className="text-[10px] font-mono text-stone-500 block mt-0.5">
                Godkänd för F-skatt • Momsreg.nr: SE{cleanMomsNr}01
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Payment Badges & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-wider">Trygg Betalning:</span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-sans font-semibold text-xs border border-white/15">Klarna.</span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-sans font-semibold text-xs border border-white/15">Swish</span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-sans font-semibold text-xs border border-white/15">Kort</span>
        </div>

        <div>
          © {new Date().getFullYear()} {companyName}. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}
