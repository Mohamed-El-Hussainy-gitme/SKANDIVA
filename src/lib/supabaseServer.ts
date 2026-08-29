import { createClient } from "@supabase/supabase-js";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Product, Order, QuoteRequest, WorkshopService, DeliveryZone, Review, SiteSettings } from "@/types";
import {
  mapProductFromDb,
  mapProductToDb,
  mapOrderFromDb,
  mapOrderToDb,
  mapQuoteFromDb,
  mapQuoteToDb,
  mapServiceFromDb,
  mapServiceToDb,
  mapZoneFromDb,
  mapZoneToDb,
  mapReviewFromDb,
  mapReviewToDb,
  mapSettingsFromDb,
  mapSettingsToDb,
} from "./mappers";

export {
  mapProductFromDb,
  mapProductToDb,
  mapOrderFromDb,
  mapOrderToDb,
  mapQuoteFromDb,
  mapQuoteToDb,
  mapServiceFromDb,
  mapServiceToDb,
  mapZoneFromDb,
  mapZoneToDb,
  mapReviewFromDb,
  mapReviewToDb,
  mapSettingsFromDb,
  mapSettingsToDb,
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "FATAL_CONFIG_ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined. Privileged database operations cannot proceed without service role credentials."
  );
}

/**
 * Server-only privileged Supabase Client (Service Role)
 * NEVER exposed to client-side bundles.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const SETTINGS_FALLBACK_FILE = path.join(process.cwd(), "src", "data", "siteSettings.json");

// ─── Direct Database CRUD Helpers ──────────────────────────────

export const serverDb = {
  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase products fetch failed: ${error.message}`);
    return (data || []).map((row) => mapProductFromDb(row as Record<string, unknown>));
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabaseAdmin.from("products").select("*").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`Supabase product by slug failed: ${error.message}`);
    return data ? mapProductFromDb(data as Record<string, unknown>) : null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Supabase product by id failed: ${error.message}`);
    return data ? mapProductFromDb(data as Record<string, unknown>) : null;
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const row = mapProductToDb(product);
    const { data, error } = await supabaseAdmin.from("products").upsert(row).select().single();
    if (error) throw new Error(`Supabase save product failed: ${error.message}`);
    return mapProductFromDb(data as Record<string, unknown>);
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw new Error(`Supabase delete product failed: ${error.message}`);
  },

  // Services
  async getServices(): Promise<WorkshopService[]> {
    const { data, error } = await supabaseAdmin.from("workshop_services").select("*").order("base_price", { ascending: true });
    if (error) throw new Error(`Supabase services fetch failed: ${error.message}`);
    return (data || []).map((row) => mapServiceFromDb(row as Record<string, unknown>));
  },

  async getServiceBySlug(slug: string): Promise<WorkshopService | null> {
    const { data, error } = await supabaseAdmin.from("workshop_services").select("*").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`Supabase service by slug failed: ${error.message}`);
    return data ? mapServiceFromDb(data as Record<string, unknown>) : null;
  },

  async saveService(service: Partial<WorkshopService>): Promise<WorkshopService> {
    const row = mapServiceToDb(service);
    const { data, error } = await supabaseAdmin.from("workshop_services").upsert(row).select().single();
    if (error) throw new Error(`Supabase save service failed: ${error.message}`);
    return mapServiceFromDb(data as Record<string, unknown>);
  },

  async deleteService(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("workshop_services").delete().eq("id", id);
    if (error) throw new Error(`Supabase delete service failed: ${error.message}`);
  },

  // Delivery Zones
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    const { data, error } = await supabaseAdmin.from("delivery_zones").select("*").order("surcharge", { ascending: true });
    if (error) throw new Error(`Supabase delivery zones fetch failed: ${error.message}`);
    return (data || []).map((row) => mapZoneFromDb(row as Record<string, unknown>));
  },

  async saveDeliveryZone(zone: Partial<DeliveryZone>): Promise<DeliveryZone> {
    const row = mapZoneToDb(zone);
    const { data, error } = await supabaseAdmin.from("delivery_zones").upsert(row).select().single();
    if (error) throw new Error(`Supabase save delivery zone failed: ${error.message}`);
    return mapZoneFromDb(data as Record<string, unknown>);
  },

  async deleteDeliveryZone(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("delivery_zones").delete().eq("id", id);
    if (error) throw new Error(`Supabase delete delivery zone failed: ${error.message}`);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabaseAdmin.from("reviews").select("*").order("date", { ascending: false });
    if (error) throw new Error(`Supabase reviews fetch failed: ${error.message}`);
    return (data || []).map((row) => mapReviewFromDb(row as Record<string, unknown>));
  },

  async saveReview(review: Partial<Review>): Promise<Review> {
    const row = mapReviewToDb(review);
    const { data, error } = await supabaseAdmin.from("reviews").upsert(row).select().single();
    if (error) throw new Error(`Supabase save review failed: ${error.message}`);
    return mapReviewFromDb(data as Record<string, unknown>);
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
    if (error) throw new Error(`Supabase delete review failed: ${error.message}`);
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase orders fetch failed: ${error.message}`);
    return (data || []).map((row) => mapOrderFromDb(row as Record<string, unknown>));
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabaseAdmin.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
    if (error) throw new Error(`Supabase order by number failed: ${error.message}`);
    return data ? mapOrderFromDb(data as Record<string, unknown>) : null;
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const row = mapOrderToDb(order);
    const { data, error } = await supabaseAdmin.from("orders").insert(row).select().single();
    if (error) throw new Error(`Supabase create order failed: ${error.message}`);
    return mapOrderFromDb(data as Record<string, unknown>);
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const row = mapOrderToDb(updates);
    const { data, error } = await supabaseAdmin.from("orders").update(row).eq("id", id).select().single();
    if (error) throw new Error(`Supabase update order failed: ${error.message}`);
    return mapOrderFromDb(data as Record<string, unknown>);
  },

  // Quotes
  async getQuotes(): Promise<QuoteRequest[]> {
    const { data, error } = await supabaseAdmin.from("quote_requests").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase quotes fetch failed: ${error.message}`);
    return (data || []).map((row) => mapQuoteFromDb(row as Record<string, unknown>));
  },

  async createQuote(quote: Partial<QuoteRequest>): Promise<QuoteRequest> {
    const row = mapQuoteToDb(quote);
    const { data, error } = await supabaseAdmin.from("quote_requests").insert(row).select().single();
    if (error) throw new Error(`Supabase create quote failed: ${error.message}`);
    return mapQuoteFromDb(data as Record<string, unknown>);
  },

  async updateQuote(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> {
    const row = mapQuoteToDb(updates);
    const { data, error } = await supabaseAdmin.from("quote_requests").update(row).eq("id", id).select().single();
    if (error) throw new Error(`Supabase update quote failed: ${error.message}`);
    return mapQuoteFromDb(data as Record<string, unknown>);
  },

  // Site Settings (Database First with JSON Fallback)
  async getSettings(): Promise<SiteSettings> {
    try {
      const { data, error } = await supabaseAdmin.from("site_settings").select("*").eq("id", "main").maybeSingle();
      if (!error && data) {
        return mapSettingsFromDb(data as Record<string, unknown>);
      }
    } catch {
      // fallback to file
    }

    try {
      const raw = await readFile(SETTINGS_FALLBACK_FILE, "utf-8");
      return JSON.parse(raw);
    } catch {
      return {
        id: "main",
        companyName: "Skandiva Tapetserarverkstad AB",
        orgNumber: "559281-3942",
        phone: "08-640 22 90",
        email: "kontakt@skandiva.se",
        address: "Åsögatan 142, 116 24 Södermalm, Stockholm",
        openingHours: "Mån–Fre: 08:30 – 17:00 • Lör: Enligt tidsbokning",
        whatsappNumber: "+4686402290",
        heroHeadline: "Ge nytt liv åt svenska designklassiker.",
        heroSubtitle: "Professionell omklädsel och restaurering av Lamino, Bruno Mathsson och DUX.",
        heroBadge: "Stockholms Mästare i Möbelrestaurering sedan 2018",
        heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2200&q=85",
        laminoTitle: "LAMINO — OMKLÄDSEL MEST ÄLSKADE FÅTÖLJ",
        laminoDescription: "Ge din klassiska Lamino-fåtölj ett nytt sekel med Skandivas Lamino Express-tjänst.",
        laminoPrice: 4900,
        laminoImage: "/IMG_0948.png",
        beforeAfterTitle: "Se förvandlingen från sliten klassiker till nyskick.",
        beforeAfterDescription: "Dra i reglaget för att se hantverket.",
        fatoljBannerTitle: "OMKLÄDSEL FÅTÖLJ",
        fatoljBannerDescription: "Vi klär om fåtöljer.",
        fatoljBannerImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80",
        fatoljBannerCta: "BEGÄR OFFERT FÖR FÅTÖLJ",
        soffaBannerTitle: "OMKLÄDSEL SOFFA",
        soffaBannerDescription: "Vi restaurerar soffor.",
        soffaBannerImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80",
        soffaBannerCta: "BEGÄR OFFERT FÖR SOFFA",
        b2bTitle: "Ska ni renovera 5+ möbler för ert kontor?",
        b2bDescription: "Vi hjälper företag med cirkulär renovering.",
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const row = mapSettingsToDb({ ...settings, id: "main", updatedAt: new Date().toISOString() });

    // 1. Primary: Save to Supabase (fail explicitly on DB error)
    const { error: dbError } = await supabaseAdmin.from("site_settings").upsert(row);
    if (dbError) {
      // Log and fall back to JSON file only if the table doesn't exist yet (migration not run)
      if (dbError.code === "42P01") {
        // Table does not exist — write to JSON fallback silently
        try {
          const current = await this.getSettings();
          const updated = { ...current, ...settings, updatedAt: new Date().toISOString() };
          await writeFile(SETTINGS_FALLBACK_FILE, JSON.stringify(updated, null, 2), "utf-8");
          return updated;
        } catch (fileErr) {
          throw new Error(`Supabase table missing and JSON fallback failed: ${String(fileErr)}`);
        }
      }
      // Any other DB error is a real failure — surface it
      throw new Error(`Supabase update settings failed: ${dbError.message}`);
    }

    // 2. Return the verified saved state from DB
    return this.getSettings();
  },
};
