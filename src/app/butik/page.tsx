import type { Metadata } from "next";
import { serverDb } from "@/lib/db";
import { ProductArchive } from "@/components/shop/ProductArchive";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Butik — Renoverade designklassiker | Skandiva",
  description: "Handplockade och helrenoverade skandinaviska designklassiker.",
};

export default async function ButikPage() {
  const products = await serverDb.getProducts();
  return <ProductArchive title="Renoverade möbler" description="Helrenoverade designklassiker, redo för ett nytt hem. Varje exemplar är unikt och kvalitetssäkrat i vår verkstad på Södermalm." products={products} breadcrumb="Butik" />;
}
