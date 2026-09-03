import type { Metadata } from "next";
import { serverDb } from "@/lib/db";
import { ProductArchive } from "@/components/shop/ProductArchive";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lamino — Omklädsel och fårskinn | Skandiva",
  description: "Produkter och omklädsel för Yngve Ekströms Lamino.",
};

export default async function LaminoPage() {
  const [products, settings] = await Promise.all([serverDb.getProducts(), serverDb.getSettings()]);
  return <ProductArchive title={settings.laminoPageTitle || "Lamino omklädsel i fårskinn"} description={settings.laminoPageSubtitle || "Varsam renovering och utvalda utföranden för Yngve Ekströms klassiker."} products={products.filter((product) => product.collection === "lamino")} breadcrumb="Lamino" />;
}
