import { Product, Order, QuoteRequest, WorkshopService, DeliveryZone, Review, SiteSettings } from "@/types";

// ─── Bidirectional Mappers (Pure TypeScript, Safe for Client & Server) ──────────────────────

export function mapProductFromDb(row: Record<string, unknown>): Product {
  return {
    id: String(row.id || ""),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    designer: String(row.designer || ""),
    model: String(row.model || ""),
    category: row.category as Product["category"],
    categoryNameSwedish: String(row.category_name_swedish || ""),
    basePrice: Number(row.base_price || 0),
    description: String(row.description || ""),
    historicalContext: row.historical_context ? String(row.historical_context) : undefined,
    dimensions: row.dimensions ? String(row.dimensions) : undefined,
    conditionGrade: row.condition_grade as Product["conditionGrade"],
    provenanceCrestText: row.provenance_crest_text ? String(row.provenance_crest_text) : undefined,
    stockStatus: (row.stock_status || "i_lager") as Product["stockStatus"],
    primaryImage: String(row.primary_image || "/IMG_0948.png"),
    galleryImages: Array.isArray(row.gallery_images) ? (row.gallery_images as string[]) : [],
    beforeImage: row.before_image ? String(row.before_image) : undefined,
    afterImage: row.after_image ? String(row.after_image) : undefined,
    featured: Boolean(row.featured),
    variants: Array.isArray(row.variants) ? (row.variants as Product["variants"]) : [],
    createdAt: String(row.created_at || ""),
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
  if (p.beforeImage !== undefined) row.before_image = p.beforeImage;
  if (p.afterImage !== undefined) row.after_image = p.afterImage;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.variants !== undefined) row.variants = p.variants;
  return row;
}

export function mapOrderFromDb(row: Record<string, unknown>): Order {
  return {
    id: String(row.id || ""),
    orderNumber: String(row.order_number || ""),
    orderType: (row.order_type as Order["orderType"]) || "product",
    customerName: String(row.customer_name || ""),
    customerEmail: String(row.customer_email || ""),
    customerPhone: String(row.customer_phone || ""),
    customerAddress: String(row.customer_address || ""),
    customerPostalCode: String(row.customer_postal_code || ""),
    customerCity: String(row.customer_city || ""),
    deliveryZoneId: String(row.delivery_zone_id || "zone-stockholm-innerstad"),
    deliveryZoneName: String(row.delivery_zone_name || "Stockholm Innerstad"),
    deliveryFee: Number(row.delivery_fee || 0),
    subtotal: Number(row.subtotal || 0),
    taxAmount: Number(row.tax_amount || 0),
    totalAmount: Number(row.total_amount || 0),
    paymentMethod: (row.payment_method as Order["paymentMethod"]) || "klarna",
    paymentStatus: (row.payment_status as Order["paymentStatus"]) || "betald",
    status: (row.status as Order["status"]) || "mottagen",
    items: Array.isArray(row.items) ? (row.items as Order["items"]) : [],
    trackingEvents: Array.isArray(row.tracking_events) ? (row.tracking_events as Order["trackingEvents"]) : [],
    estimatedCompletionDate: row.estimated_completion_date ? String(row.estimated_completion_date) : undefined,
    workshopNotes: row.workshop_notes ? String(row.workshop_notes) : undefined,
    assignedUpholsterer: row.assigned_upholsterer ? String(row.assigned_upholsterer) : undefined,
    createdAt: String(row.created_at || ""),
    updatedAt: String(row.updated_at || ""),
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
  if (o.deliveryZoneId !== undefined) row.delivery_zone_id = o.deliveryZoneId;
  if (o.deliveryZoneName !== undefined) row.delivery_zone_name = o.deliveryZoneName;
  if (o.deliveryFee !== undefined) row.delivery_fee = o.deliveryFee;
  if (o.subtotal !== undefined) row.subtotal = o.subtotal;
  if (o.taxAmount !== undefined) row.tax_amount = o.taxAmount;
  if (o.totalAmount !== undefined) row.total_amount = o.totalAmount;
  if (o.paymentMethod !== undefined) row.payment_method = o.paymentMethod;
  if (o.paymentStatus !== undefined) row.payment_status = o.paymentStatus;
  if (o.status !== undefined) row.status = o.status;
  if (o.items !== undefined) row.items = o.items;
  if (o.trackingEvents !== undefined) row.tracking_events = o.trackingEvents;
  if (o.estimatedCompletionDate !== undefined) row.estimated_completion_date = o.estimatedCompletionDate;
  if (o.workshopNotes !== undefined) row.workshop_notes = o.workshopNotes;
  if (o.assignedUpholsterer !== undefined) row.assigned_upholsterer = o.assignedUpholsterer;
  if (o.updatedAt !== undefined) row.updated_at = o.updatedAt;
  return row;
}

export function mapQuoteFromDb(row: Record<string, unknown>): QuoteRequest {
  return {
    id: String(row.id || ""),
    quoteNumber: String(row.quote_number || ""),
    isB2B: Boolean(row.is_b2b),
    companyName: row.company_name ? String(row.company_name) : undefined,
    orgNumber: row.org_number ? String(row.org_number) : undefined,
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
    status: (row.status || "ny") as QuoteRequest["status"],
    quotedPrice: row.quoted_price ? Number(row.quoted_price) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: String(row.created_at || ""),
  };
}

export function mapQuoteToDb(q: Partial<QuoteRequest>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (q.id !== undefined) row.id = q.id;
  if (q.quoteNumber !== undefined) row.quote_number = q.quoteNumber;
  if (q.isB2B !== undefined) row.is_b2b = q.isB2B;
  if (q.companyName !== undefined) row.company_name = q.companyName;
  if (q.orgNumber !== undefined) row.org_number = q.orgNumber;
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

export function mapServiceFromDb(row: Record<string, unknown>): WorkshopService {
  return {
    id: String(row.id || ""),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    shortDescription: String(row.short_description || ""),
    fullDescription: String(row.full_description || row.short_description || ""),
    furnitureType: (row.furniture_type as WorkshopService["furnitureType"]) || "Fatolj",
    applicableModels: Array.isArray(row.applicable_models) ? (row.applicable_models as string[]) : [String(row.name || "")],
    isFixedPrice: Boolean(row.is_fixed_price),
    priceRangeText: String(row.price_range_text || ""),
    basePrice: Number(row.base_price || 0),
    turnaroundDays: Number(row.turnaround_days || 10),
    turnaroundText: String(row.turnaround_text || ""),
    primaryImage: String(row.primary_image || "/IMG_0948.png"),
    beforeAfterPair: row.before_after_pair as WorkshopService["beforeAfterPair"],
    materials: Array.isArray(row.materials) ? (row.materials as WorkshopService["materials"]) : [],
    addons: Array.isArray(row.addons) ? (row.addons as WorkshopService["addons"]) : [],
    featured: Boolean(row.featured),
  };
}

export function mapServiceToDb(s: Partial<WorkshopService>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (s.id !== undefined) row.id = s.id;
  if (s.slug !== undefined) row.slug = s.slug;
  if (s.name !== undefined) row.name = s.name;
  if (s.shortDescription !== undefined) row.short_description = s.shortDescription;
  if (s.fullDescription !== undefined) row.full_description = s.fullDescription;
  if (s.furnitureType !== undefined) row.furniture_type = s.furnitureType;
  if (s.applicableModels !== undefined) row.applicable_models = s.applicableModels;
  if (s.isFixedPrice !== undefined) row.is_fixed_price = s.isFixedPrice;
  if (s.priceRangeText !== undefined) row.price_range_text = s.priceRangeText;
  if (s.basePrice !== undefined) row.base_price = s.basePrice;
  if (s.turnaroundDays !== undefined) row.turnaround_days = s.turnaroundDays;
  if (s.turnaroundText !== undefined) row.turnaround_text = s.turnaroundText;
  if (s.primaryImage !== undefined) row.primary_image = s.primaryImage;
  if (s.beforeAfterPair !== undefined) row.before_after_pair = s.beforeAfterPair;
  if (s.materials !== undefined) row.materials = s.materials;
  if (s.addons !== undefined) row.addons = s.addons;
  if (s.featured !== undefined) row.featured = s.featured;
  return row;
}

export function mapZoneFromDb(row: Record<string, unknown>): DeliveryZone {
  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    description: String(row.description || ""),
    corridorDescription: String(row.corridor_description || ""),
    surcharge: Number(row.surcharge || 0),
    estimatedDeliveryDays: String(row.estimated_delivery_days || ""),
    active: Boolean(row.active),
  };
}

export function mapZoneToDb(z: Partial<DeliveryZone>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (z.id !== undefined) row.id = z.id;
  if (z.name !== undefined) row.name = z.name;
  if (z.description !== undefined) row.description = z.description;
  if (z.corridorDescription !== undefined) row.corridor_description = z.corridorDescription;
  if (z.surcharge !== undefined) row.surcharge = z.surcharge;
  if (z.estimatedDeliveryDays !== undefined) row.estimated_delivery_days = z.estimatedDeliveryDays;
  if (z.active !== undefined) row.active = z.active;
  return row;
}

export function mapReviewFromDb(row: Record<string, unknown>): Review {
  return {
    id: String(row.id || ""),
    author: String(row.author || ""),
    location: String(row.location || ""),
    furnitureModel: String(row.furniture_model || ""),
    rating: Number(row.rating || 5),
    text: String(row.text || ""),
    date: String(row.date || ""),
    verifiedPurchase: Boolean(row.verified_purchase),
  };
}

export function mapReviewToDb(r: Partial<Review>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (r.id !== undefined) row.id = r.id;
  if (r.author !== undefined) row.author = r.author;
  if (r.location !== undefined) row.location = r.location;
  if (r.furnitureModel !== undefined) row.furniture_model = r.furnitureModel;
  if (r.rating !== undefined) row.rating = r.rating;
  if (r.text !== undefined) row.text = r.text;
  if (r.date !== undefined) row.date = r.date;
  if (r.verifiedPurchase !== undefined) row.verified_purchase = r.verifiedPurchase;
  return row;
}

export function mapSettingsFromDb(row: Record<string, unknown>): SiteSettings {
  return {
    id: String(row.id || "main"),
    companyName: String(row.company_name || "Skandiva Tapetserarverkstad AB"),
    orgNumber: String(row.org_number || "559281-3942"),
    phone: String(row.phone || "08-640 22 90"),
    email: String(row.email || "kontakt@skandiva.se"),
    address: String(row.address || "Åsögatan 142, 116 24 Södermalm, Stockholm"),
    openingHours: String(row.opening_hours || "Mån–Fre: 08:30 – 17:00 • Lör: Enligt tidsbokning"),
    whatsappNumber: String(row.whatsapp_number || "+4686402290"),
    heroHeadline: String(row.hero_headline || "Ge nytt liv åt svenska designklassiker."),
    heroSubtitle: String(row.hero_subtitle || ""),
    heroBadge: String(row.hero_badge || "Stockholms Mästare i Möbelrestaurering sedan 2018"),
    heroImage: String(row.hero_image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2200&q=85"),
    laminoTitle: String(row.lamino_title || "LAMINO — OMKLÄDSEL MEST ÄLSKADE FÅTÖLJ"),
    laminoDescription: String(row.lamino_description || ""),
    laminoPrice: Number(row.lamino_price || 4900),
    laminoImage: String(row.lamino_image || "/IMG_0948.png"),
    beforeAfterTitle: String(row.before_after_title || "Se förvandlingen från sliten klassiker till nyskick."),
    beforeAfterDescription: String(row.before_after_description || ""),
    fatoljBannerTitle: String(row.fatolj_banner_title || "OMKLÄDSEL FÅTÖLJ"),
    fatoljBannerDescription: String(row.fatolj_banner_description || ""),
    fatoljBannerImage: String(row.fatolj_banner_image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80"),
    fatoljBannerCta: String(row.fatolj_banner_cta || "BEGÄR OFFERT FÖR FÅTÖLJ"),
    soffaBannerTitle: String(row.soffa_banner_title || "OMKLÄDSEL SOFFA"),
    soffaBannerDescription: String(row.soffa_banner_description || ""),
    soffaBannerImage: String(row.soffa_banner_image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80"),
    soffaBannerCta: String(row.soffa_banner_cta || "BEGÄR OFFERT FÖR SOFFA"),
    b2bTitle: String(row.b2b_title || "Ska ni renovera 5+ möbler för ert kontor?"),
    b2bDescription: String(row.b2b_description || ""),
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
  if (s.heroHeadline !== undefined) row.hero_headline = s.heroHeadline;
  if (s.heroSubtitle !== undefined) row.hero_subtitle = s.heroSubtitle;
  if (s.heroBadge !== undefined) row.hero_badge = s.heroBadge;
  if (s.heroImage !== undefined) row.hero_image = s.heroImage;
  if (s.laminoTitle !== undefined) row.lamino_title = s.laminoTitle;
  if (s.laminoDescription !== undefined) row.lamino_description = s.laminoDescription;
  if (s.laminoPrice !== undefined) row.lamino_price = s.laminoPrice;
  if (s.laminoImage !== undefined) row.lamino_image = s.laminoImage;
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
  if (s.b2bTitle !== undefined) row.b2b_title = s.b2bTitle;
  if (s.b2bDescription !== undefined) row.b2b_description = s.b2bDescription;
  if (s.updatedAt !== undefined) row.updated_at = s.updatedAt;
  return row;
}
