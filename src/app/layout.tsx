import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skandiva.se"),
  title: "Skandiva Tapetserarverkstad — Stockholm | Möbler, Lamino & Restaurering",
  description:
    "Auktoriserad möbeltapetserarverkstad i Stockholm. Specialiserade på omklädsel av Lamino, Bruno Mathsson och DUX-möbler, samt försäljning av nyrenoverade designklassiker och dynsatser.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/skandiva_classic_logo.png",
  },
  openGraph: {
    title: "Skandiva Tapetserarverkstad",
    description: "Omklädsel och restaurering av svenska designklassiker i Stockholm.",
    images: [{ url: "/Jetson-69-canvas-jpg-2-jpg.avif", width: 1200, height: 630, alt: "Skandiva tapetserarverkstad" }],
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
      </body>
    </html>
  );
}
