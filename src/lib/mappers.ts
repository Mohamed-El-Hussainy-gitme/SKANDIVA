import { Product, Order, QuoteRequest, SiteSettings, Material, GalleryItem, FurnitureCategory, ProductCollection, StockStatus, OrderType, OrderStatus, QuoteStatus } from "@/types";

// ── Products (Butik) ──────────────────────────────────────────────────────────

export function mapProductFromDb(row: Record<string, unknown>): Product {
  return {
    id: String(row.id || ""),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    designer: String(row.designer || ""),
    model: String(row.model || ""),
    category: (row.category as FurnitureCategory) || "Fatolj",
    collection: (row.collection as ProductCollection) || "none",
    categoryNameSwedish: String(row.category_name_swedish || ""),
    basePrice: Number(row.base_price || 0),
    description: String(row.description || ""),
    historicalContext: row.historical_context ? String(row.historical_context) : undefined,
    dimensions: row.dimensions ? String(row.dimensions) : undefined,
    conditionGrade: row.condition_grade ? (row.condition_grade as import("@/types").ConditionGrade) : undefined,
    provenanceCrestText: row.provenance_crest_text ? String(row.provenance_crest_text) : undefined,
    stockStatus: (row.stock_status as StockStatus) || "i_lager",
    primaryImage: String(row.primary_image || ""),
    galleryImages: Array.isArray(row.gallery_images) ? (row.gallery_images as string[]) : [],
    materialIds: Array.isArray(row.material_ids) ? (row.material_ids as string[]) : [],
    beforeImage: row.before_image ? String(row.before_image) : undefined,
    afterImage: row.after_image ? String(row.after_image) : undefined,
    featured: Boolean(row.featured),
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export function mapProductToDb(p: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.name !== undefined) row.name = p.name;
  if (p.designer !== undefined) row.designer = p.designer;
  if (p.model !== undefined) row.model = p.model;
  if (p.category !== undefined) row.category = p.category;
  if (p.collection !== undefined) row.collection = p.collection;
  if (p.categoryNameSwedish !== undefined) row.category_name_swedish = p.categoryNameSwedish;
  if (p.basePrice !== undefined) row.base_price = p.basePrice;
  if (p.description !== undefined) row.description = p.description;
  if (p.historicalContext !== undefined) row.historical_context = p.historicalContext;
  if (p.dimensions !== undefined) row.dimensions = p.dimensions;
  if (p.conditionGrade !== undefined) row.condition_grade = p.conditionGrade;
  if (p.provenanceCrestText !== undefined) row.provenance_crest_text = p.provenanceCrestText;
  if (p.stockStatus !== undefined) row.stock_status = p.stockStatus;
  if (p.primaryImage !== undefined) row.primary_image = p.primaryImage;
  if (p.galleryImages !== undefined) row.gallery_images = p.galleryImages;
  if (p.materialIds !== undefined) row.material_ids = p.materialIds;
  if (p.beforeImage !== undefined) row.before_image = p.beforeImage;
  if (p.afterImage !== undefined) row.after_image = p.afterImage;
  if (p.featured !== undefined) row.featured = p.featured;
  return row;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function mapOrderFromDb(row: Record<string, unknown>): Order {
  return {
    id: String(row.id || ""),
    orderNumber: String(row.order_number || ""),
    orderType: (row.order_type as OrderType) || "product",
    customerName: String(row.customer_name || ""),
    customerEmail: String(row.customer_email || ""),
    customerPhone: String(row.customer_phone || ""),
    customerAddress: String(row.customer_address || ""),
    customerPostalCode: String(row.customer_postal_code || ""),
    customerCity: String(row.customer_city || ""),
    subtotal: Number(row.subtotal || 0),
    taxAmount: Number(row.tax_amount || 0),
    totalAmount: Number(row.total_amount || 0),
    paymentMethod: (row.payment_method as "klarna" | "swish" | "kort") || "kort",
    paymentStatus: (row.payment_status as "betald" | "vantar_pa_betalning" | "delbetalning") || "vantar_pa_betalning",
    status: (row.status as OrderStatus) || "mottagen",
    items: Array.isArray(row.items) ? (row.items as import("@/types").OrderItem[]) : [],
    estimatedCompletionDate: row.estimated_completion_date ? String(row.estimated_completion_date) : undefined,
    workshopNotes: row.workshop_notes ? String(row.workshop_notes) : undefined,
    assignedUpholsterer: row.assigned_upholsterer ? String(row.assigned_upholsterer) : undefined,
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
}

export function mapOrderToDb(o: Partial<Order>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (o.id !== undefined) row.id = o.id;
  if (o.orderNumber !== undefined) row.order_number = o.orderNumber;
  if (o.orderType !== undefined) row.order_type = o.orderType;
  if (o.customerName !== undefined) row.customer_name = o.customerName;
  if (o.customerEmail !== undefined) row.customer_email = o.customerEmail;
  if (o.customerPhone !== undefined) row.customer_phone = o.customerPhone;
  if (o.customerAddress !== undefined) row.customer_address = o.customerAddress;
  if (o.customerPostalCode !== undefined) row.customer_postal_code = o.customerPostalCode;
  if (o.customerCity !== undefined) row.customer_city = o.customerCity;
  if (o.subtotal !== undefined) row.subtotal = o.subtotal;
  if (o.taxAmount !== undefined) row.tax_amount = o.taxAmount;
  if (o.totalAmount !== undefined) row.total_amount = o.totalAmount;
  if (o.paymentMethod !== undefined) row.payment_method = o.paymentMethod;
  if (o.paymentStatus !== undefined) row.payment_status = o.paymentStatus;
  if (o.status !== undefined) row.status = o.status;
  if (o.items !== undefined) row.items = o.items;
  if (o.estimatedCompletionDate !== undefined) row.estimated_completion_date = o.estimatedCompletionDate;
  if (o.workshopNotes !== undefined) row.workshop_notes = o.workshopNotes;
  if (o.assignedUpholsterer !== undefined) row.assigned_upholsterer = o.assignedUpholsterer;
  return row;
}

// ── Quotes ────────────────────────────────────────────────────────────────────

export function mapQuoteFromDb(row: Record<string, unknown>): QuoteRequest {
  return {
    id: String(row.id || ""),
    quoteNumber: String(row.quote_number || ""),
    contactName: String(row.contact_name || ""),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    city: String(row.city || ""),
    furnitureType: String(row.furniture_type || ""),
    designerModel: row.designer_model ? String(row.designer_model) : undefined,
    numberOfPieces: Number(row.number_of_pieces || 1),
    fabricPreference: row.fabric_preference ? String(row.fabric_preference) : undefined,
    currentConditionDescription: String(row.current_condition_description || ""),
    dimensions: row.dimensions ? String(row.dimensions) : undefined,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    status: (row.status as QuoteStatus) || "ny",
    quotedPrice: row.quoted_price ? Number(row.quoted_price) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export function mapQuoteToDb(q: Partial<QuoteRequest>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (q.id !== undefined) row.id = q.id;
  if (q.quoteNumber !== undefined) row.quote_number = q.quoteNumber;
  if (q.contactName !== undefined) row.contact_name = q.contactName;
  if (q.email !== undefined) row.email = q.email;
  if (q.phone !== undefined) row.phone = q.phone;
  if (q.city !== undefined) row.city = q.city;
  if (q.furnitureType !== undefined) row.furniture_type = q.furnitureType;
  if (q.designerModel !== undefined) row.designer_model = q.designerModel;
  if (q.numberOfPieces !== undefined) row.number_of_pieces = q.numberOfPieces;
  if (q.fabricPreference !== undefined) row.fabric_preference = q.fabricPreference;
  if (q.currentConditionDescription !== undefined) row.current_condition_description = q.currentConditionDescription;
  if (q.dimensions !== undefined) row.dimensions = q.dimensions;
  if (q.images !== undefined) row.images = q.images;
  if (q.status !== undefined) row.status = q.status;
  if (q.quotedPrice !== undefined) row.quoted_price = q.quotedPrice;
  if (q.notes !== undefined) row.notes = q.notes;
  return row;
}

// ── Materials ─────────────────────────────────────────────────────────────────

export function mapMaterialFromDb(row: Record<string, unknown>): Material {
  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    materialType: String(row.material_type || ""),
    colorHex: row.color_hex ? String(row.color_hex) : undefined,
    imageUrl: String(row.image_url || ""),
    price: Number(row.price || 0),
    supplier: row.supplier ? String(row.supplier) : undefined,
    description: row.description ? String(row.description) : undefined,
    sortOrder: Number(row.sort_order || 0),
    active: Boolean(row.active !== false), // default true
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export function mapMaterialToDb(m: Partial<Material>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (m.id !== undefined) row.id = m.id;
  if (m.name !== undefined) row.name = m.name;
  if (m.materialType !== undefined) row.material_type = m.materialType;
  if (m.colorHex !== undefined) row.color_hex = m.colorHex;
  if (m.imageUrl !== undefined) row.image_url = m.imageUrl;
  if (m.price !== undefined) row.price = m.price;
  if (m.supplier !== undefined) row.supplier = m.supplier;
  if (m.description !== undefined) row.description = m.description;
  if (m.sortOrder !== undefined) row.sort_order = m.sortOrder;
  if (m.active !== undefined) row.active = m.active;
  return row;
}

// ── Gallery Items ─────────────────────────────────────────────────────────────

export function mapGalleryItemFromDb(row: Record<string, unknown>): GalleryItem {
  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    description: row.description ? String(row.description) : undefined,
    beforeImage: String(row.before_image || ""),
    afterImage: String(row.after_image || ""),
    sortOrder: Number(row.sort_order || 0),
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export function mapGalleryItemToDb(g: Partial<GalleryItem>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (g.id !== undefined) row.id = g.id;
  if (g.title !== undefined) row.title = g.title;
  if (g.description !== undefined) row.description = g.description;
  if (g.beforeImage !== undefined) row.before_image = g.beforeImage;
  if (g.afterImage !== undefined) row.after_image = g.afterImage;
  if (g.sortOrder !== undefined) row.sort_order = g.sortOrder;
  return row;
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export function mapSettingsFromDb(row: Record<string, unknown>): SiteSettings {
  return {
    id: String(row.id || "main"),
    companyName: String(row.company_name || ""),
    orgNumber: String(row.org_number || ""),
    phone: String(row.phone || ""),
    email: String(row.email || ""),
    address: String(row.address || ""),
    openingHours: String(row.opening_hours || ""),
    whatsappNumber: String(row.whatsapp_number || ""),
    taxEnabled: row.tax_enabled !== false,
    taxRate: Number(row.tax_rate ?? 0.20),
    heroHeadline: String(row.hero_headline || "Vi räddar klassiker. Vi skapar arv."),
    heroSubtitle: String(row.hero_subtitle || ""),
    heroBadge: String(row.hero_badge || "Tapetserarverkstad • Danderyd"),
    heroImage: String(row.hero_image || ""),
    laminoTitle: String(row.lamino_title || "Lamino Omklädsel"),
    laminoDescription: String(row.lamino_description || ""),
    laminoPrice: Number(row.lamino_price || 0),
    laminoImage: String(row.lamino_image || ""),
    laminoPageTitle: String(row.lamino_page_title || "Lamino Omklädsel i Fårskinn"),
    laminoPageSubtitle: String(row.lamino_page_subtitle || "Yngve Ekströms mästerverk förtjänar ett långt liv."),
    laminoPageImage: String(row.lamino_page_image || ""),
    laminoProcessTitle: String(row.lamino_process_title || "Så renoverar vi din Lamino"),
    laminoProcessDescription: String(row.lamino_process_description || "Vi arbetar varsamt, med respekt för originalkonstruktionen och materialens livslängd."),
    duxPageTitle: String(row.dux_page_title || "DUX & Bruno Mathsson Omklädsel"),
    duxPageSubtitle: String(row.dux_page_subtitle || "Specialistverkstad för omklädsel och dynsatser i premiumläder."),
    duxPageImage: String(row.dux_page_image || ""),
    duxServicesTitle: String(row.dux_services_title || "Specialanpassad renovering efter originalmått"),
    duxServicesDescription: String(row.dux_services_description || "Vi bevarar konstruktionens originalkänsla med material och arbete anpassat efter varje möbel."),
    beforeAfterTitle: String(row.before_after_title || "Före & Efter"),
    beforeAfterDescription: String(row.before_after_description || ""),
    fatoljBannerTitle: String(row.fatolj_banner_title || ""),
    fatoljBannerDescription: String(row.fatolj_banner_description || ""),
    fatoljBannerImage: String(row.fatolj_banner_image || ""),
    fatoljBannerCta: String(row.fatolj_banner_cta || ""),
    soffaBannerTitle: String(row.soffa_banner_title || ""),
    soffaBannerDescription: String(row.soffa_banner_description || ""),
    soffaBannerImage: String(row.soffa_banner_image || ""),
    soffaBannerCta: String(row.soffa_banner_cta || ""),
    aboutTitle: String(row.about_title || "Om Skandiva Tapetserarverkstad"),
    aboutDescription: String(row.about_description || ""),
    aboutImage: String(row.about_image || ""),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
}

export function mapSettingsToDb(s: Partial<SiteSettings>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (s.id !== undefined) row.id = s.id;
  if (s.companyName !== undefined) row.company_name = s.companyName;
  if (s.orgNumber !== undefined) row.org_number = s.orgNumber;
  if (s.phone !== undefined) row.phone = s.phone;
  if (s.email !== undefined) row.email = s.email;
  if (s.address !== undefined) row.address = s.address;
  if (s.openingHours !== undefined) row.opening_hours = s.openingHours;
  if (s.whatsappNumber !== undefined) row.whatsapp_number = s.whatsappNumber;
  if (s.taxEnabled !== undefined) row.tax_enabled = s.taxEnabled;
  if (s.taxRate !== undefined) row.tax_rate = s.taxRate;
  if (s.heroHeadline !== undefined) row.hero_headline = s.heroHeadline;
  if (s.heroSubtitle !== undefined) row.hero_subtitle = s.heroSubtitle;
  if (s.heroBadge !== undefined) row.hero_badge = s.heroBadge;
  if (s.heroImage !== undefined) row.hero_image = s.heroImage;
  if (s.laminoTitle !== undefined) row.lamino_title = s.laminoTitle;
  if (s.laminoDescription !== undefined) row.lamino_description = s.laminoDescription;
  if (s.laminoPrice !== undefined) row.lamino_price = s.laminoPrice;
  if (s.laminoImage !== undefined) row.lamino_image = s.laminoImage;
  if (s.laminoPageTitle !== undefined) row.lamino_page_title = s.laminoPageTitle;
  if (s.laminoPageSubtitle !== undefined) row.lamino_page_subtitle = s.laminoPageSubtitle;
  if (s.laminoPageImage !== undefined) row.lamino_page_image = s.laminoPageImage;
  if (s.laminoProcessTitle !== undefined) row.lamino_process_title = s.laminoProcessTitle;
  if (s.laminoProcessDescription !== undefined) row.lamino_process_description = s.laminoProcessDescription;
  if (s.duxPageTitle !== undefined) row.dux_page_title = s.duxPageTitle;
  if (s.duxPageSubtitle !== undefined) row.dux_page_subtitle = s.duxPageSubtitle;
  if (s.duxPageImage !== undefined) row.dux_page_image = s.duxPageImage;
  if (s.duxServicesTitle !== undefined) row.dux_services_title = s.duxServicesTitle;
  if (s.duxServicesDescription !== undefined) row.dux_services_description = s.duxServicesDescription;
  if (s.beforeAfterTitle !== undefined) row.before_after_title = s.beforeAfterTitle;
  if (s.beforeAfterDescription !== undefined) row.before_after_description = s.beforeAfterDescription;
  if (s.fatoljBannerTitle !== undefined) row.fatolj_banner_title = s.fatoljBannerTitle;
  if (s.fatoljBannerDescription !== undefined) row.fatolj_banner_description = s.fatoljBannerDescription;
  if (s.fatoljBannerImage !== undefined) row.fatolj_banner_image = s.fatoljBannerImage;
  if (s.fatoljBannerCta !== undefined) row.fatolj_banner_cta = s.fatoljBannerCta;
  if (s.soffaBannerTitle !== undefined) row.soffa_banner_title = s.soffaBannerTitle;
  if (s.soffaBannerDescription !== undefined) row.soffa_banner_description = s.soffaBannerDescription;
  if (s.soffaBannerImage !== undefined) row.soffa_banner_image = s.soffaBannerImage;
  if (s.soffaBannerCta !== undefined) row.soffa_banner_cta = s.soffaBannerCta;
  if (s.aboutTitle !== undefined) row.about_title = s.aboutTitle;
  if (s.aboutDescription !== undefined) row.about_description = s.aboutDescription;
  if (s.aboutImage !== undefined) row.about_image = s.aboutImage;
  if (s.updatedAt !== undefined) row.updated_at = s.updatedAt;
  return row;
}
