export type FurnitureCategory = "Fatolj" | "Soffa" | "Stol" | "Mattor" | "Tillbehor";

export type ConditionGrade = "Nyskick" | "Utmärkt skick" | "Utmarkt skick" | "Gott skick" | "Vacker patina";

export type StockStatus = "i_lager" | "bestallningsvara" | "sald";

export interface ProductVariant {
  id: string;
  name: string;
  fabricName: string;
  fabricColorHex: string;
  materialDescription: string;
  priceDelta: number; // additional price on top of basePrice
  sku: string;
  inStock: boolean;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  designer: string;
  model: string;
  category: FurnitureCategory;
  categoryNameSwedish: string;
  basePrice: number;
  description: string;
  historicalContext?: string;
  dimensions?: string;
  conditionGrade?: ConditionGrade;
  provenanceCrestText?: string;
  stockStatus: StockStatus;
  primaryImage: string;
  galleryImages: string[];
  beforeImage?: string;
  afterImage?: string;
  featured?: boolean;
  variants: ProductVariant[];
  createdAt: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  selectedByDefault?: boolean;
}

export interface ServiceOptionMaterial {
  id: string;
  name: string;
  category: "farskinn" | "lader" | "ulltyg" | "sammet" | "linne";
  colorName: string;
  colorHex: string;
  price: number;
  supplier?: string;
  description?: string;
}

export interface WorkshopService {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  furnitureType: string;
  applicableModels: string[];
  isFixedPrice: boolean;
  priceRangeText: string;
  basePrice: number;
  turnaroundDays: number;
  turnaroundText: string;
  primaryImage: string;
  beforeAfterPair?: {
    before: string;
    after: string;
  };
  materials: ServiceOptionMaterial[];
  addons: ServiceAddon[];
  featured?: boolean;
}

export type OrderType = "product" | "service" | "bespoke_quote";

export type OrderStatus = 
  | "mottagen"            // Received
  | "material_forbereds"  // Material & Fabric preparation
  | "i_verkstaden"        // In workshop / Upholstery in progress
  | "kvalitetskontroll"   // Quality inspection
  | "redo_for_leverans"   // Dispatched / Ready for courier
  | "levererad"           // Delivered / Complete
  | "avbruten";           // Cancelled

export type QuoteStatus = "ny" | "offert_skickad" | "bekraftad" | "i_arbete" | "slufford" | "avvisad";

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  corridorDescription: string;
  surcharge: number; // SEK
  estimatedDeliveryDays: string;
  active: boolean;
}

export interface OrderItem {
  id: string;
  type: "product" | "service";
  referenceId: string;
  title: string;
  designerOrModel?: string;
  selectedVariantName?: string;
  selectedVariantPrice?: number;
  selectedMaterial?: string;
  selectedAddons?: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
  technicianNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SKD-2026-8942"
  orderType: OrderType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerPostalCode: string;
  customerCity: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  deliveryFee: number;
  subtotal: number;
  taxAmount: number; // 25% Swedish moms
  totalAmount: number;
  paymentMethod: "klarna" | "swish" | "kort";
  paymentStatus: "betald" | "vantar_pa_betalning" | "delbetalning";
  status: OrderStatus;
  items: OrderItem[];
  trackingEvents: TrackingEvent[];
  estimatedCompletionDate?: string;
  workshopNotes?: string;
  assignedUpholsterer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequest {
  id: string;
  quoteNumber: string; // e.g. "OFF-2026-1045"
  isB2B: boolean;
  companyName?: string;
  orgNumber?: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  furnitureType: string;
  designerModel?: string;
  numberOfPieces: number;
  fabricPreference?: string;
  currentConditionDescription: string;
  dimensions?: string;
  images: string[];
  status: QuoteStatus;
  quotedPrice?: number;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  furnitureModel: string;
  rating: number; // 1-5
  text: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface SiteSettings {
  id: string;
  companyName: string;
  orgNumber: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  whatsappNumber: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImage: string;
  laminoTitle: string;
  laminoDescription: string;
  laminoPrice: number;
  laminoImage: string;
  beforeAfterTitle: string;
  beforeAfterDescription: string;
  fatoljBannerTitle: string;
  fatoljBannerDescription: string;
  fatoljBannerImage: string;
  fatoljBannerCta: string;
  soffaBannerTitle: string;
  soffaBannerDescription: string;
  soffaBannerImage: string;
  soffaBannerCta: string;
  b2bTitle: string;
  b2bDescription: string;
  updatedAt: string;
}
