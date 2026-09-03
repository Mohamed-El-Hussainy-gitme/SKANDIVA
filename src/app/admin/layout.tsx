"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Palette,
  Image as ImageIcon,
  ClipboardList, 
  Sliders, 
  ArrowLeft,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const links = [
    { href: "/admin", label: "Översikt & KPI", icon: LayoutDashboard },
    { href: "/admin/ordrar", label: "Ordrar", icon: ClipboardList },
    { href: "/admin/offerter", label: "Offerter", icon: ClipboardList },
    { href: "/admin/produkter", label: "Produktkatalog", icon: ShoppingBag },
    { href: "/admin/material", label: "Material & färger", icon: Palette },
    { href: "/admin/galleri", label: "Före & efter", icon: ImageIcon },
    { href: "/admin/installningar", label: "Sidinnehåll & CMS", icon: Sliders },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-stone-900 text-stone-100 border-r border-stone-800 flex flex-col justify-between shrink-0 p-6 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
            <CrestSeal size="sm" variant="light" subtitle="" />
            <div>
              <span className="font-serif text-lg font-bold tracking-tight block text-white">SKANDIVA</span>
              <span className="font-mono text-[9px] text-stone-400 uppercase tracking-wider block -mt-1">
                Verkstadsadministration
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider transition-colors ${
                    isActive
                      ? "bg-stone-800 text-white font-semibold border-l-2 border-white"
                      : "text-stone-400 hover:bg-stone-800/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-stone-800 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tillbaka till Butiken</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logga ut</span>
          </button>
          <div className="text-[10px] font-mono text-stone-500">
            Skandiva Admin v2.0 • Supabase Synkad
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
