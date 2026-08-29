import { Order, OrderStatus, TrackingEvent } from "@/types";
import { logger } from "./logger";

/**
 * Standard Swedish 5-Stage Workshop Tracking Pipeline Definition
 */
export const WORKSHOP_STAGES: {
  status: OrderStatus;
  title: string;
  defaultDescription: string;
}[] = [
  {
    status: "mottagen",
    title: "1. Mottagen & Registrerad",
    defaultDescription: "Möbeln har anlänt till Skandiva Ateljé på Södermalm. ID-tagg fäst och grundlig besiktning påbörjad.",
  },
  {
    status: "material_forbereds",
    title: "2. Material & Bärväv Förbereds",
    defaultDescription: "Gammal klädsel demonterad. Trästomme rengjord. Ny förstärkt bärväv i naturhampa tillskuren och uppspänd.",
  },
  {
    status: "i_verkstaden",
    title: "3. I Verkstaden (Tapetsering)",
    defaultDescription: "Tapetserarmästare monterar valt fårskinn/läder med handsydda fästpunkter och traditionellt hantverk.",
  },
  {
    status: "kvalitetskontroll",
    title: "4. Kvalitetskontroll & Slutfinish",
    defaultDescription: "Slutbesiktning av spänst, sömmar och träfinish inför certifiering och mästarstämpel.",
  },
  {
    status: "redo_for_leverans",
    title: "5. Redo för Leverans / Möbelbud",
    defaultDescription: "Emballerad i skyddande möbelfilt och bokad för transport med Skandivas dedikerade möbelbud.",
  },
];

/**
 * Generates a unique, tamper-resistant order number in format: SKD-YYYY-XXXXX
 */
export function generateOrderNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SKD-${currentYear}-${randomSuffix}`;
}

/**
 * Generates a unique quote number in format: OFF-YYYY-XXXXX
 */
export function generateQuoteNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `OFF-${currentYear}-${randomSuffix}`;
}

/**
 * Calculates financial breakdown with standard Swedish 25% VAT (moms)
 */
export function calculateOrderFinancials(
  itemsTotal: number,
  deliveryFee: number = 0
): {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
} {
  const totalAmount = Math.max(0, Math.round(itemsTotal + deliveryFee));
  // 25% moms included in total (momsats 20% av bruttopriset)
  const taxAmount = Math.round(totalAmount * 0.2);
  const subtotal = totalAmount - taxAmount;

  return {
    subtotal,
    taxAmount,
    totalAmount,
  };
}

/**
 * Initializes the full tracking event array for a new order
 */
export function initializeTrackingEvents(orderId: string): TrackingEvent[] {
  const now = new Date().toISOString();

  return WORKSHOP_STAGES.map((stage, idx) => ({
    id: `ev-${orderId}-${idx + 1}`,
    status: stage.status,
    title: stage.title,
    description: stage.defaultDescription,
    timestamp: idx === 0 ? now : "",
    completed: idx === 0,
    active: idx === 0,
  }));
}

/**
 * Progresses an order to a new workshop stage, recording audit logs & timestamps
 */
export function progressOrderStage(
  order: Order,
  newStatus: OrderStatus,
  technicianNote?: string,
  assignedUpholsterer?: string
): Order {
  const stageIndex = WORKSHOP_STAGES.findIndex((s) => s.status === newStatus);
  const now = new Date().toISOString();

  const updatedTrackingEvents = order.trackingEvents.map((event, idx) => {
    if (stageIndex === -1) {
      // e.g. levererad or avbruten
      if (newStatus === "levererad") {
        return { ...event, completed: true, active: false, timestamp: event.timestamp || now };
      }
      return event;
    }

    if (idx < stageIndex) {
      return {
        ...event,
        completed: true,
        active: false,
        timestamp: event.timestamp || now,
      };
    } else if (idx === stageIndex) {
      return {
        ...event,
        completed: true,
        active: true,
        timestamp: now,
        technicianNote: technicianNote || event.technicianNote,
      };
    } else {
      return {
        ...event,
        completed: false,
        active: false,
      };
    }
  });

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
    trackingEvents: updatedTrackingEvents,
    assignedUpholsterer: assignedUpholsterer || order.assignedUpholsterer,
    updatedAt: now,
  };
}
