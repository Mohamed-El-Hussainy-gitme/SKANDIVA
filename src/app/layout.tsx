import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skandiva.se"),
  title: "Skandiva Tapetserarverkstad — Stockholm | Möbler, Lamino & Restaurering",
  description:
    "Auktoriserad möbeltapetserarverkstad i Stockholm. Specialiserade på omklädsel av Lamino, Bruno Mathsson och DUX-möbler, samt försäljning av nyrenoverade designklassiker och dynsatser.",
  icons: {
    icon: "/skandiva_classic_logo.png",
    shortcut: "/skandiva_classic_logo.png",
    apple: "/skandiva_classic_logo.png",
  },
  keywords: [
    "Lamino omklädsel",
    "Lamino express",
    "Tapetserarverkstad Stockholm",
    "Bruno Mathsson Pernilla omklädsel",
    "DUX Karin renovering",
    "Möbeltapetsering Stockholm",
    "Dynsats Lamino",
    "Fårskinnsomklädsel",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-stone selection:text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
