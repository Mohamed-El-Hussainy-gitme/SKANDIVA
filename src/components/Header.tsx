"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/store";
import { ShoppingCart, Menu, X, Compass, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/butik", label: "Butik & Galleri" },
    { href: "/tjanster/lamino-express", label: "Lamino Express", highlight: true },
    { href: "/tjanster", label: "Verkstadstjänster" },
    { href: "/galleri", label: "Före & Efter" },
    { href: "/om-oss", label: "Om Skandiva" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F6F3ED]/95 backdrop-blur-md border-b border-[#DCD5C8] transition-all">
      {/* Top Announcement Bar: Scandinavian Master Upholsterer Authenticity */}
      <div className="bg-[#1C1917] text-[#F6F3ED] py-1.5 px-4 text-xs font-mono border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4433] animate-pulse" />
            <span className="hidden sm:inline">SKANDIVA TAPETSERARVERKSTAD • SÖDERMALM STOCKHOLM</span>
            <span className="sm:hidden">SKANDIVA • STOCKHOLM</span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-[#DCD5C8] hidden md:inline text-[11px]">Hantverksgaranti 5 år • Eget möbelbud</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/spara-order"
              className="inline-flex items-center gap-1 text-[#F6F3ED]/90 hover:text-white underline underline-offset-2 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Spåra order</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Mobile hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-[#1C1917] hover:text-[#5B4433] focus:outline-none transition-colors"
            aria-label="Öppna meny"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Logo & Emblem with Authentic Skandiva Artwork */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#5B4433]/30 shadow-sm bg-[#F6F3ED] shrink-0">
              <Image
                src="/skandiva_classic_logo.png"
                alt="Skandiva Stockholm Logo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#5B4433] transition-colors leading-none">
                SKANDIVA
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-[#5B4433] uppercase mt-1">
                Tapetserarverkstad • Stockholm
              </span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-sans tracking-wide transition-all relative py-1 ${
                  isActive
                    ? "text-[#1C1917] font-semibold border-b-2 border-[#5B4433]"
                    : "text-[#1C1917]/80 hover:text-[#1C1917]"
                } ${
                  link.highlight
                    ? "text-[#5B4433] font-semibold flex items-center gap-1.5 bg-[#EAE4D9]/80 px-3 py-1 border border-[#5B4433]/25 rounded-full hover:bg-[#EAE4D9]"
                    : ""
                }`}
              >
                {link.label}
                {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#5B4433]" />}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Offert CTA & Cart Drawer) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/tjanster/offert"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-transparent border border-[#5B4433] text-[#5B4433] hover:bg-[#5B4433] hover:text-[#F6F3ED] transition-colors rounded-none font-medium shadow-sm"
          >
            Begär Offert
          </Link>

          {/* Cart Icon & Count -> Direct link to /varukorg */}
          <Link
            href="/varukorg"
            className="relative p-2 text-[#1C1917] hover:text-[#5B4433] transition-colors flex items-center gap-2 border border-[#DCD5C8] bg-white/60 px-3 py-1.5 rounded-xs"
            aria-label="Varukorg"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            <span className="hidden md:inline text-xs font-mono">Varukorg</span>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-[#1C1917] text-[#F6F3ED] font-mono text-[11px] font-bold rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F6F3ED] border-b border-[#DCD5C8] px-5 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 text-base font-serif border-l-2 ${
                  pathname === link.href
                    ? "border-[#5B4433] text-[#5B4433] font-bold bg-[#DCD5C8]/40"
                    : "border-transparent text-[#1C1917] hover:border-[#DCD5C8] hover:text-[#5B4433]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#DCD5C8] space-y-2.5">
              <Link
                href="/spara-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 text-xs font-mono bg-[#DCD5C8]/50 text-[#1C1917]"
              >
                <span>Spåra din beställning</span>
                <Compass className="w-4 h-4 text-[#5B4433]" />
              </Link>
              <Link
                href="/tjanster/offert"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 px-3 text-xs font-mono uppercase bg-[#1C1917] text-[#F6F3ED] font-bold tracking-wider"
              >
                Skicka förfrågan / Kostnadsfri Offert
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
