import type { Metadata } from "next";
import { serverDb } from "@/lib/db";
import { ProductArchive } from "@/components/shop/ProductArchive";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Butik — Omklädsel och kuddsats | Skandiva",
  description: "Omklädsel, kuddsatser och renoverade skandinaviska designklassiker direkt från vår verkstad.",
};

export default async function ButikPage() {
  const products = await serverDb.getProducts();
  return <ProductArchive title="Omklädsel och kuddsats" description="Kuddsatser, omklädda möbler och renoverade designklassiker direkt från vår verkstad i Danderyd. Varje exemplar är unikt och kvalitetssäkrat." products={products} breadcrumb="Butik" />;
}
