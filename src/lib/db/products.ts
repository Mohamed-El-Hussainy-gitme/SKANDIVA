import { Product } from "@/types";
import { mapProductFromDb, mapProductToDb } from "../mappers";
import { supabase, getServiceRoleClient } from "./config";
import { logger } from "../logger";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    logger.error("DB_GET_PRODUCTS_ERROR", error);
    throw new Error(`Kunde inte hämta produkter: ${error.message}`);
  }
  return (data || []).map((row) => mapProductFromDb(row as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    logger.error("DB_GET_PRODUCT_BY_SLUG_ERROR", error);
    throw new Error(`Kunde inte hämta produkt: ${error.message}`);
  }
  return data ? mapProductFromDb(data as Record<string, unknown>) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) {
    logger.error("DB_GET_PRODUCT_BY_ID_ERROR", error);
    throw new Error(`Kunde inte hämta produkt: ${error.message}`);
  }
  return data ? mapProductFromDb(data as Record<string, unknown>) : null;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const adminDb = getServiceRoleClient();
  const row = mapProductToDb(product);

  if (!row.id) {
    row.id = crypto.randomUUID();
  }

  // Generate slug from name if missing
  if (!row.slug && row.name) {
    row.slug = String(row.name)
      .toLowerCase()
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const { data, error } = await adminDb
    .from("products")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    logger.error("DB_SAVE_PRODUCT_ERROR", error);
    throw new Error(`Kunde inte spara produkt: ${error.message}`);
  }

  return mapProductFromDb(data as Record<string, unknown>);
}

export async function deleteProduct(id: string): Promise<void> {
  const adminDb = getServiceRoleClient();
  const { error } = await adminDb.from("products").delete().eq("id", id);
  if (error) {
    logger.error("DB_DELETE_PRODUCT_ERROR", error);
    throw new Error(`Kunde inte ta bort produkt: ${error.message}`);
  }
}
