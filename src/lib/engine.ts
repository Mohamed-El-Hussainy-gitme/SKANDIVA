import { Order, OrderStatus } from "@/types";
import { logger } from "./logger";

/**
 * Standard Swedish 5-Stage Workshop Pipeline
 */
export const WORKSHOP_STAGES: {
  status: OrderStatus;
  title: string;
  defaultDescription: string;
}[] = [
  {
    status: "mottagen",
    title: "1. Mottagen & Registrerad",
    defaultDescription: "Möbeln har anlänt till Skandiva Atelje på Danderyd. ID-tagg fäst och grundlig besiktning påbörjad.",
  },
  {
    status: "material_forbereds",
    title: "2. Material & Bärväv Förbereds",
    defaultDescription: "Gammal klädsel demonterad. Trästomme rengjord. Ny förstärkt bärväv i naturhampa tillskuren och uppspänd.",
  },
  {
    status: "i_verkstaden",
    title: "3. I Verkstaden (Tapetsering)",
    defaultDescription: "Tapetsermästare monterar valt färskinn/läder med handsydda fästpunkter och traditionellt hantverk.",
  },
  {
    status: "kvalitetskontroll",
    title: "4. Kvalitetskontroll & Slutfinish",
    defaultDescription: "Slutbesiktning av spänst, sömmar och träfinish inför certifiering och mästarstämpel.",
  },
  {
    status: "redo_for_leverans",
    title: "5. Redo för Leverans",
    defaultDescription: "Emballerad i skyddande möbelfilt och redo för upphämtning eller avlämning.",
  },
];

/**
 * Generates a unique order number: SKD-YYYY-XXXXX
 */
export function generateOrderNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SKD-${currentYear}-${randomSuffix}`;
}

/**
 * Generates a unique quote number: OFF-YYYY-XXXXX
 */
export function generateQuoteNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `OFF-${currentYear}-${randomSuffix}`;
}

/**
 * Calculates financial breakdown.
 * includeTax: if true, taxAmount is extracted from total (Swedish 25% VAT included in price)
 */
export function calculateOrderFinancials(
  itemsTotal: number,
  includeTax: boolean = true,
  taxRate: number = 0.25
): {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
} {
  const totalAmount = Math.max(0, Math.round(itemsTotal));
  const taxAmount = includeTax ? Math.round(totalAmount * (taxRate / (1 + taxRate))) : 0;
  const subtotal = totalAmount - taxAmount;

  return {
    subtotal,
    taxAmount,
    totalAmount,
  };
}

/**
 * Progresses an order to a new workshop stage with audit log
 */
export function progressOrderStage(
  order: Order,
  newStatus: OrderStatus,
  technicianNote?: string,
  assignedUpholsterer?: string
): Order {
  const now = new Date().toISOString();

  logger.audit("ORDER_STAGE_TRANSITION", {
    orderNumber: order.orderNumber,
    fromStatus: order.status,
    toStatus: newStatus,
    technicianNote,
    assignedUpholsterer,
  });

  return {
    ...order,
    status: newStatus,
    assignedUpholsterer: assignedUpholsterer || order.assignedUpholsterer,
    updatedAt: now,
  };
}
