import { getServiceRoleClient } from "./config";
import * as productsApi from "./products";
import * as ordersApi from "./orders";
import * as quotesApi from "./quotes";
import * as settingsApi from "./settings";
import * as materialsApi from "./materials";
import * as galleryApi from "./gallery";

export const serverDb = {
  ...productsApi,
  ...ordersApi,
  ...quotesApi,
  ...settingsApi,
  ...materialsApi,
  ...galleryApi,
};

export const db = serverDb;

// Re-export supabaseAdmin for API routes that need direct Supabase Admin access
// (e.g. auth/login, upload, orders)
export const supabaseAdmin = getServiceRoleClient();
