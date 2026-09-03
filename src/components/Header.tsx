"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/store";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Mobile: hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-stone-800 hover:text-stone-600 focus:outline-none"
            aria-label="Öppna meny"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-300 bg-stone-50 shrink-0">
            <Image
              src="/skandiva_classic_logo.png"
              alt="Skandiva"
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-xl text-stone-900 tracking-wide uppercase">Skandiva</span>
            <span className="font-sans text-[9px] text-stone-500 tracking-widest uppercase">Tapetserarverkstad</span>
          </div>
        </Link>

        {/* Desktop Nav — centred */}
        <nav className="hidden lg:flex items-center gap-10">

          <Link
            href="/"
            className={`text-xs font-mono uppercase tracking-widest transition-colors ${
              isActive("/") ? "text-stone-900 font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Hem
          </Link>

          <Link
            href="/butik"
            className={`text-xs font-mono uppercase tracking-widest transition-colors ${
              isActive("/butik") ? "text-stone-900 font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Butik
          </Link>

          {/* OMKLÄDSEL dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors py-8">
              Omklädsel <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl border border-stone-200 py-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 flex flex-col z-50">
              <Link
                href="/dux-omkladsel"
                className="px-5 py-3 text-xs font-mono uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                DUX
              </Link>
              <Link
                href="/lamino-omkladsel"
                className="px-5 py-3 text-xs font-mono uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Lamino
              </Link>
            </div>
          </div>

          {/* INFO dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors py-8">
              Info <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl border border-stone-200 py-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 flex flex-col z-50">
              <Link
                href="/galleri"
                className="px-5 py-3 text-xs font-mono uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Före &amp; Efter
              </Link>
              <Link
                href="/om-oss"
                className="px-5 py-3 text-xs font-mono uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Om Oss
              </Link>
            </div>
          </div>

          <Link
            href="/kontakt"
            className={`text-xs font-mono uppercase tracking-widest transition-colors ${
              isActive("/kontakt") ? "text-stone-900 font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Kontakt
          </Link>
        </nav>

        {/* Cart */}
        <Link
          href="/varukorg"
          className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors"
          aria-label="Varukorg"
        >
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-stone-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200">
          <div className="px-4 py-4 flex flex-col gap-1">
            <Link href="/" className="py-3 px-2 text-sm font-mono uppercase tracking-widest text-stone-800 border-b border-stone-100" onClick={() => setMobileMenuOpen(false)}>Hem</Link>
            <Link href="/butik" className="py-3 px-2 text-sm font-mono uppercase tracking-widest text-stone-800 border-b border-stone-100" onClick={() => setMobileMenuOpen(false)}>Butik</Link>

            <div className="py-3 px-2 border-b border-stone-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-2">Omklädsel</span>
              <div className="pl-3 flex flex-col gap-2">
                <Link href="/dux-omkladsel" className="text-sm font-mono uppercase text-stone-700" onClick={() => setMobileMenuOpen(false)}>DUX</Link>
                <Link href="/lamino-omkladsel" className="text-sm font-mono uppercase text-stone-700" onClick={() => setMobileMenuOpen(false)}>Lamino</Link>
              </div>
            </div>

            <div className="py-3 px-2 border-b border-stone-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-2">Info</span>
              <div className="pl-3 flex flex-col gap-2">
                <Link href="/galleri" className="text-sm font-mono uppercase text-stone-700" onClick={() => setMobileMenuOpen(false)}>Före &amp; Efter</Link>
                <Link href="/om-oss" className="text-sm font-mono uppercase text-stone-700" onClick={() => setMobileMenuOpen(false)}>Om Oss</Link>
              </div>
            </div>

            <Link href="/kontakt" className="py-3 px-2 text-sm font-mono uppercase tracking-widest text-stone-800" onClick={() => setMobileMenuOpen(false)}>Kontakt</Link>
          </div>
        </div>
      )}
    </header>
  );
};