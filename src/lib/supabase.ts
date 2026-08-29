import { createClient } from "@supabase/supabase-js";
import { Product, WorkshopService, DeliveryZone, Order, QuoteRequest, Review } from "@/types";
import { 
  mapProductFromDb, 
  mapOrderFromDb, 
  mapQuoteFromDb,
  mapServiceFromDb,
  mapZoneFromDb,
  mapReviewFromDb
} from "./mappers";
import { logger } from "./logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "FATAL_CONFIG_ERROR: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in environment variables. Hardcoded fallbacks are strictly prohibited."
  );
}

/**
 * Public Client-Side Read-Only Supabase Client (Anon Key)
 * Strictly restricted by RLS to SELECT queries. All writes MUST route via server API.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const db = {
  // ─── Products (Read-Only on Client) ───────────────────────────
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) {
      logger.error("DB_GET_PRODUCTS_ERROR", error);
      throw new Error(`Kunde inte hämta produkter: ${error.message}`);
    }
    return (data || []).map((row) => mapProductFromDb(row as Record<string, unknown>));
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
    if (error) {
      logger.error("DB_GET_PRODUCT_BY_SLUG_ERROR", error);
      throw new Error(`Kunde inte hämta produkt: ${error.message}`);
    }
    return data ? mapProductFromDb(data as Record<string, unknown>) : null;
  },

  // ─── Services (Read-Only on Client) ───────────────────────────
  async getServices(): Promise<WorkshopService[]> {
    const { data, error } = await supabase.from("workshop_services").select("*").order("base_price", { ascending: true });
    if (error) {
      logger.error("DB_GET_SERVICES_ERROR", error);
      throw new Error(`Kunde inte hämta tjänster: ${error.message}`);
    }
    return (data || []).map((row) => mapServiceFromDb(row as Record<string, unknown>));
  },

  async getServiceBySlug(slug: string): Promise<WorkshopService | null> {
    const { data, error } = await supabase.from("workshop_services").select("*").eq("slug", slug).maybeSingle();
    if (error) {
      logger.error("DB_GET_SERVICE_BY_SLUG_ERROR", error);
      throw new Error(`Kunde inte hämta tjänst: ${error.message}`);
    }
    return data ? mapServiceFromDb(data as Record<string, unknown>) : null;
  },

  // ─── Delivery Zones (Read-Only on Client) ─────────────────────
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    const { data, error } = await supabase.from("delivery_zones").select("*").order("surcharge", { ascending: true });
    if (error) {
      logger.error("DB_GET_ZONES_ERROR", error);
      throw new Error(`Kunde inte hämta leveranszoner: ${error.message}`);
    }
    return (data || []).map((row) => mapZoneFromDb(row as Record<string, unknown>));
  },

  // ─── Reviews (Read-Only on Client) ────────────────────────────
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase.from("reviews").select("*").order("date", { ascending: false });
    if (error) {
      logger.error("DB_GET_REVIEWS_ERROR", error);
      throw new Error(`Kunde inte hämta omdömen: ${error.message}`);
    }
    return (data || []).map((row) => mapReviewFromDb(row as Record<string, unknown>));
  },

  // ─── Orders (Read-Only on Client / Admin) ─────────────────────
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) {
      logger.error("DB_GET_ORDERS_ERROR", error);
      throw new Error(`Kunde inte hämta ordrar: ${error.message}`);
    }
    return (data || []).map((row) => mapOrderFromDb(row as Record<string, unknown>));
  },

  // ─── Quotes (Read-Only on Client / Admin) ─────────────────────
  async getQuotes(): Promise<QuoteRequest[]> {
    const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
    if (error) {
      logger.error("DB_GET_QUOTES_ERROR", error);
      throw new Error(`Kunde inte hämta offerter: ${error.message}`);
    }
    return (data || []).map((row) => mapQuoteFromDb(row as Record<string, unknown>));
  },

  // ─── Order Tracking (Read-Only by Order Number) ───────────────
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabase.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
    if (error) {
      logger.error("DB_GET_ORDER_BY_NUMBER_ERROR", error);
      throw new Error(`Kunde inte hämta order: ${error.message}`);
    }
    return data ? mapOrderFromDb(data as Record<string, unknown>) : null;
  },
};
