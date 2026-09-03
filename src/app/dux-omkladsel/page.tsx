import type { Metadata } from "next";
import { serverDb } from "@/lib/db";
import { ProductArchive } from "@/components/shop/ProductArchive";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "DUX — Klädsel och dynsatser | Skandiva",
  description: "Produkter och dynsatser för DUX och Bruno Mathsson.",
};

export default async function DuxOmkladselPage() {
  const [products, settings] = await Promise.all([serverDb.getProducts(), serverDb.getSettings()]);
  return <ProductArchive title={settings.duxPageTitle || "DUX & Bruno Mathsson"} description={settings.duxPageSubtitle || "Kuddar, dynsatser och klädsel för DUX och Bruno Mathssons klassiker."} products={products.filter((product) => product.collection === "dux")} breadcrumb="DUX" />;
}
