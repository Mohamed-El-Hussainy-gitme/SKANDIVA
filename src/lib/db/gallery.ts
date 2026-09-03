import { GalleryItem } from "@/types";
import { mapGalleryItemFromDb, mapGalleryItemToDb } from "../mappers";
import { supabase, getServiceRoleClient } from "./config";
import { logger } from "../logger";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order", { ascending: true });
  if (error) {
    logger.error("DB_GET_GALLERY_ERROR", error);
    throw new Error(`Kunde inte hämta galleri: ${error.message}`);
  }
  return (data || []).map((row) => mapGalleryItemFromDb(row as Record<string, unknown>));
}

export async function saveGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
  const adminDb = getServiceRoleClient();
  const row = mapGalleryItemToDb(item);
  if (!row.id) {
    row.id = crypto.randomUUID();
  }

  const { data, error } = await adminDb
    .from("gallery_items")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    logger.error("DB_SAVE_GALLERY_ITEM_ERROR", error);
    throw new Error(`Kunde inte spara galleribild: ${error.message}`);
  }

  return mapGalleryItemFromDb(data as Record<string, unknown>);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const adminDb = getServiceRoleClient();
  const { error } = await adminDb.from("gallery_items").delete().eq("id", id);
  if (error) {
    logger.error("DB_DELETE_GALLERY_ITEM_ERROR", error);
    throw new Error(`Kunde inte ta bort galleribild: ${error.message}`);
  }
}
