import { SiteSettings } from "@/types";
import { mapSettingsFromDb, mapSettingsToDb } from "../mappers";
import { supabase, getServiceRoleClient } from "./config";
import { logger } from "../logger";

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", "main").maybeSingle();
  if (error) {
    logger.error("DB_GET_SETTINGS_ERROR", error);
    throw new Error(`Kunde inte hämta inställningar: ${error.message}`);
  }
  return mapSettingsFromDb((data || { id: "main" }) as Record<string, unknown>);
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const adminDb = getServiceRoleClient();
  const row = mapSettingsToDb(settings);
  row.updated_at = new Date().toISOString();

  const { data, error } = await adminDb
    .from("site_settings")
    .upsert({ id: "main", ...row }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    logger.error("DB_UPDATE_SETTINGS_ERROR", error);
    throw new Error(`Kunde inte spara inställningar: ${error.message}`);
  }

  return mapSettingsFromDb(data as Record<string, unknown>);
}
