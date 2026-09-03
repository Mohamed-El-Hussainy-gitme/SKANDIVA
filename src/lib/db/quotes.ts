import { QuoteRequest } from "@/types";
import { mapQuoteFromDb, mapQuoteToDb } from "../mappers";
import { supabase, getServiceRoleClient } from "./config";
import { logger } from "../logger";

export async function getQuotes(): Promise<QuoteRequest[]> {
  const adminDb = getServiceRoleClient();
  const { data, error } = await adminDb.from("quote_requests").select("*").order("created_at", { ascending: false });
  if (error) {
    logger.error("DB_GET_QUOTES_ERROR", error);
    throw new Error(`Kunde inte hämta offerter: ${error.message}`);
  }
  return (data || []).map((row) => mapQuoteFromDb(row as Record<string, unknown>));
}

export async function createQuote(quote: Partial<QuoteRequest>): Promise<QuoteRequest> {
  const row = mapQuoteToDb(quote);
  if (!row.id) {
    row.id = crypto.randomUUID();
  }

  // Use anon client for public creation
  const { data, error } = await supabase
    .from("quote_requests")
    .insert(row)
    .select()
    .single();

  if (error) {
    logger.error("DB_CREATE_QUOTE_ERROR", error);
    throw new Error(`Kunde inte skapa offert: ${error.message}`);
  }

  return mapQuoteFromDb(data as Record<string, unknown>);
}

export async function updateQuote(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> {
  const adminDb = getServiceRoleClient();
  const row = mapQuoteToDb(updates);
  delete row.id;

  const { data, error } = await adminDb
    .from("quote_requests")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error("DB_UPDATE_QUOTE_ERROR", error);
    throw new Error(`Kunde inte uppdatera offert: ${error.message}`);
  }

  return mapQuoteFromDb(data as Record<string, unknown>);
}
