import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { progressOrderStage } from "@/lib/engine";
import { OrderStatus } from "@/types";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await serverDb.getOrderByNumber(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Ordern hittades inte." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    logger.error("API_GET_ORDER_DETAIL_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta orderdetaljer." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const body = await request.json();
    const existingOrder = await serverDb.getOrderByNumber(params.id);

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Ordern hittades inte." }, { status: 404 });
    }

    let updatedOrder = { ...existingOrder };

    // If updating status, run through workshop stage progression engine
    if (body.status && body.status !== existingOrder.status) {
      updatedOrder = progressOrderStage(
        existingOrder,
        body.status as OrderStatus,
        body.technicianNote,
        body.assignedUpholsterer
      );
    }


    if (body.workshopNotes !== undefined) updatedOrder.workshopNotes = body.workshopNotes;
    if (body.paymentStatus !== undefined) updatedOrder.paymentStatus = body.paymentStatus;
    if (body.estimatedCompletionDate !== undefined) updatedOrder.estimatedCompletionDate = body.estimatedCompletionDate;

    const saved = await serverDb.updateOrder(existingOrder.id, updatedOrder);
    logger.audit("ORDER_UPDATED_VIA_ADMIN", { orderId: params.id, admin: session.email, newStatus: updatedOrder.status });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    logger.error("API_PATCH_ORDER_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte uppdatera ordern." }, { status: 500 });
  }
}
