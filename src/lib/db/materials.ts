import { Material } from "@/types";
import { mapMaterialFromDb, mapMaterialToDb } from "../mappers";
import { supabase, getServiceRoleClient } from "./config";
import { logger } from "../logger";

export async function getMaterials(includeInactive = false): Promise<Material[]> {
  let query = supabase.from("materials").select("*").order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) {
    logger.error("DB_GET_MATERIALS_ERROR", error);
    throw new Error(`Kunde inte hämta material: ${error.message}`);
  }
  return (data || []).map((row) => mapMaterialFromDb(row as Record<string, unknown>));
}

export async function saveMaterial(material: Partial<Material>): Promise<Material> {
  const adminDb = getServiceRoleClient();
  const row = mapMaterialToDb(material);
  if (!row.id) {
    row.id = crypto.randomUUID();
  }

  const { data, error } = await adminDb
    .from("materials")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    logger.error("DB_SAVE_MATERIAL_ERROR", error);
    throw new Error(`Kunde inte spara material: ${error.message}`);
  }

  return mapMaterialFromDb(data as Record<string, unknown>);
}

export async function deleteMaterial(id: string): Promise<void> {
  const adminDb = getServiceRoleClient();
  const { error } = await adminDb.from("materials").delete().eq("id", id);
  if (error) {
    logger.error("DB_DELETE_MATERIAL_ERROR", error);
    throw new Error(`Kunde inte ta bort material: ${error.message}`);
  }
}
