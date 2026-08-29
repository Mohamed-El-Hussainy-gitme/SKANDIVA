import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const body = await request.json();
    const zones = await serverDb.getDeliveryZones();
    const existing = zones.find((z) => z.id === params.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Leveranszonen hittades inte." }, { status: 404 });
    }

    const updated = await serverDb.saveDeliveryZone({
      ...existing,
      ...body,
      id: existing.id,
    });

    logger.audit("DELIVERY_ZONE_UPDATED", { id: updated.id, name: updated.name, admin: session.email });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logger.error("API_PATCH_DELIVERY_ZONE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte uppdatera leveranszon." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    await serverDb.deleteDeliveryZone(params.id);
    logger.audit("DELIVERY_ZONE_DELETED", { id: params.id, admin: session.email });

    return NextResponse.json({ success: true, message: "Leveranszonen har raderats från databasen." });
  } catch (error) {
    logger.error("API_DELETE_DELIVERY_ZONE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte radera leveranszon." }, { status: 500 });
  }
}
