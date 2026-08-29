"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wrench, 
  ClipboardList, 
  Truck, 
  Star, 
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
    { href: "/admin/ordrar", label: "Ordrar & Offerter (Pipeline)", icon: ClipboardList },
    { href: "/admin/produkter", label: "Produkter & Varianter", icon: ShoppingBag },
    { href: "/admin/tjanster", label: "Verkstadstjänster (Lamino)", icon: Wrench },
    { href: "/admin/installningar", label: "Inställningar & CMS", icon: Sliders },
    { href: "/admin/leveranszoner", label: "Leveranszoner", icon: Truck },
    { href: "/admin/omdomen", label: "Omdömen & Feedback", icon: Star },
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
    <div className="min-h-screen bg-stone-light/30 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-ink text-canvas border-r border-white/10 flex flex-col justify-between shrink-0 p-6 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <CrestSeal size="sm" variant="light" subtitle="" />
            <div>
              <span className="font-serif text-lg font-bold tracking-tight block">SKANDIVA</span>
              <span className="font-mono text-[9px] text-stone-dark uppercase tracking-wider block -mt-1">
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
                      ? "bg-wood text-canvas font-semibold"
                      : "text-canvas/70 hover:bg-white/5 hover:text-canvas"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-canvas/60 hover:text-canvas transition-colors"
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
          <div className="text-[10px] font-mono text-canvas/40">
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
