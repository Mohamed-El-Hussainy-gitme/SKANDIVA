import React from "react";
import type { Metadata } from "next";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { ContactForm } from "@/components/contact/ContactForm";
import { serverDb } from "@/lib/db";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export const revalidate = 60; // ISR every 60s

export const metadata: Metadata = {
  title: "Kontakt — Skandiva Tapetserarverkstad Stockholm | Danderyd",
  description:
    "Kontakta Skandiva Tapetserarverkstad på Åsögatan 142 på Danderyd. Boka mötesinlämning, rådgivning eller provsittning i vår ateljé.",
};

export default async function KontaktPage() {
  const settings = await serverDb.getSettings();

  const companyName = settings?.companyName || "Skandiva Stockholm";
  const orgNumber = settings?.orgNumber || "559281-3942";
  const address = settings?.address || "Åsögatan 142, 116 24 Stockholm (Danderyd)";
  const openingHours = settings?.openingHours || "Måndag – Fredag: 08:30 – 17:00 • Lördag: Enligt tidsbokning";
  const phone = settings?.phone || "08-640 22 90";
  const email = settings?.email || "kontakt@skandiva.se";
  const whatsappNumber = settings?.whatsappNumber || "+4686402290";
  const cleanMomsNr = orgNumber.replace(/[^0-9]/g, "");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="border-b border-stone pb-8 space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-wood">
          Skandiva Tapetserarverkstad • Danderyd
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
          Kontakta Verkstaden
        </h1>
        <p className="text-sm sm:text-base text-ink/75 max-w-2xl font-sans">
          Du är alltid varmt välkommen att besöka vår verkstad, lämna in en möbel eller ställa frågor om tyger och restaurering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column (5 cols): Live Workshop Info from CMS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-light/40 border border-stone p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone/60 pb-4">
              <CrestSeal size="sm" variant="wood" subtitle="" />
              <div>
                <h3 className="font-serif text-xl font-medium text-ink">{companyName}</h3>
                <span className="text-[11px] font-mono text-wood uppercase">Auktoriserad Ateljé</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono text-ink/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">Besöksadress & Inlämning:</strong>
                  <span>{address}</span>
                  <span className="block text-[11px] text-ink/60 mt-0.5">Lastzon finns direkt utanför verkstaden</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">Öppettider:</strong>
                  <span>{openingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">Telefon:</strong>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-wood transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              {whatsappNumber && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-ink font-semibold">WhatsApp (Direkt):</strong>
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-wood transition-colors"
                    >
                      {whatsappNumber}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-wood mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-ink font-semibold">E-post:</strong>
                  <a href={`mailto:${email}`} className="hover:text-wood transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone/60 text-[11px] font-mono text-ink/60">
              <span>Org.nr: {orgNumber} • Momsreg.nr: SE{cleanMomsNr}01</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Direct Message Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
