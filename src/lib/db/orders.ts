import { Order } from "@/types";
import { mapOrderFromDb, mapOrderToDb } from "../mappers";
import { supabase, getServiceRoleClient } from "./config";
import { logger } from "../logger";

export async function getOrders(): Promise<Order[]> {
  const adminDb = getServiceRoleClient();
  const { data, error } = await adminDb.from("orders").select("*").order("created_at", { ascending: false });
  if (error) {
    logger.error("DB_GET_ORDERS_ERROR", error);
    throw new Error(`Kunde inte hämta ordrar: ${error.message}`);
  }
  return (data || []).map((row) => mapOrderFromDb(row as Record<string, unknown>));
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  // Public client can read order by order_number for order tracking
  const { data, error } = await supabase.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
  if (error) {
    logger.error("DB_GET_ORDER_BY_NUMBER_ERROR", error);
    throw new Error(`Kunde inte hämta order: ${error.message}`);
  }
  return data ? mapOrderFromDb(data as Record<string, unknown>) : null;
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const row = mapOrderToDb(order);
  if (!row.id) {
    row.id = crypto.randomUUID();
  }

  // Use anon client for public creation, as public_insert_orders policy allows it
  const { data, error } = await supabase
    .from("orders")
    .insert(row)
    .select()
    .single();

  if (error) {
    logger.error("DB_CREATE_ORDER_ERROR", error);
    throw new Error(`Kunde inte skapa order: ${error.message}`);
  }

  return mapOrderFromDb(data as Record<string, unknown>);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  const adminDb = getServiceRoleClient();
  const row = mapOrderToDb(updates);
  delete row.id; // ensure we don't update ID

  row.updated_at = new Date().toISOString();

  const { data, error } = await adminDb
    .from("orders")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error("DB_UPDATE_ORDER_ERROR", error);
    throw new Error(`Kunde inte uppdatera order: ${error.message}`);
  }

  return mapOrderFromDb(data as Record<string, unknown>);
}
