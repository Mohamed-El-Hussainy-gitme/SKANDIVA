// ============================================================
// Skandiva Tapetserarverkstad — Central Type Definitions
// Single source of truth for all DB entities
// ============================================================

// --- Products (Renoverade Möbler i Butiken) ---

export type FurnitureCategory = "Fatolj" | "Soffa" | "Stol" | "Mattor" | "Tillbehor";

export type ConditionGrade = "Nyskick" | "Utmärkt skick" | "Utmarkt skick" | "Gott skick" | "Vacker patina";

export type StockStatus = "i_lager" | "bestallningsvara" | "sald";
export type ProductCollection = "none" | "lamino" | "dux";

export interface Product {
  id: string;
  slug: string;
  name: string;
  designer: string;
  model: string;
  category: FurnitureCategory;
  collection: ProductCollection;
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
  materialIds: string[];
  beforeImage?: string;
  afterImage?: string;
  featured?: boolean;
  createdAt: string;
}

// --- Materials (Läder, Fårskinn, Tyger för Omklädsel) ---

export interface Material {
  id: string;
  name: string;
  materialType: string;   // 'leather' | 'fabric' | 'sheepskin'
  colorHex?: string;
  imageUrl: string;       // Required swatch image for lightbox
  price: number;          // Additional cost for upholstery option
  supplier?: string;
  description?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

// --- Gallery (Före & Efter Renoveringsprojekt) ---

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  beforeImage: string;
  afterImage: string;
  sortOrder: number;
  createdAt: string;
}

// --- Orders (Beställningar från Butiken) ---

export type OrderType = "product" | "bespoke_quote";

export type OrderStatus =
  | "mottagen"            // Received
  | "material_forbereds"  // Material & Fabric preparation
  | "i_verkstaden"        // In workshop / Upholstery in progress
  | "kvalitetskontroll"   // Quality inspection
  | "redo_for_leverans"   // Ready for pickup/delivery
  | "levererad"           // Delivered / Complete
  | "avbruten";           // Cancelled

export type QuoteStatus = "ny" | "offert_skickad" | "bekraftad" | "i_arbete" | "slufford" | "avvisad";

export interface OrderItem {
  id: string;
  type: "product";
  referenceId: string;
  title: string;
  designerOrModel?: string;
  selectedMaterial?: string;
  selectedAddons?: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerPostalCode: string;
  customerCity: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: "klarna" | "swish" | "kort";
  paymentStatus: "betald" | "vantar_pa_betalning" | "delbetalning";
  status: OrderStatus;
  items: OrderItem[];
  estimatedCompletionDate?: string;
  workshopNotes?: string;
  assignedUpholsterer?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Quotes (Begär Offert för Omklädsel / Tjänster) ---

export interface QuoteRequest {
  id: string;
  quoteNumber: string;
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

// --- Site Settings (CMS) ---

export interface SiteSettings {
  id: string;
  companyName: string;
  orgNumber: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  whatsappNumber: string;
  taxEnabled: boolean;
  taxRate: number;
  // Hero
  heroHeadline: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImage: string;
  // Lamino section
  laminoTitle: string;
  laminoDescription: string;
  laminoPrice: number;
  laminoImage: string;
  // Dedicated Omklädsel pages
  laminoPageTitle: string;
  laminoPageSubtitle: string;
  laminoPageImage: string;
  laminoProcessTitle: string;
  laminoProcessDescription: string;
  duxPageTitle: string;
  duxPageSubtitle: string;
  duxPageImage: string;
  duxServicesTitle: string;
  duxServicesDescription: string;
  // Gallery section headings
  beforeAfterTitle: string;
  beforeAfterDescription: string;
  // Category banners
  fatoljBannerTitle: string;
  fatoljBannerDescription: string;
  fatoljBannerImage: string;
  fatoljBannerCta: string;
  soffaBannerTitle: string;
  soffaBannerDescription: string;
  soffaBannerImage: string;
  soffaBannerCta: string;
  // About page CMS
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  updatedAt: string;
}
