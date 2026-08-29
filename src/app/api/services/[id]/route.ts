import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const service = await serverDb.getServiceBySlug(params.id) || (await serverDb.getServices()).find((s) => s.id === params.id);
    if (!service) {
      return NextResponse.json({ success: false, error: "Tjänsten hittades inte." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    logger.error("API_GET_SERVICE_DETAIL_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta tjänst." }, { status: 500 });
  }
}

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
    const existing = await serverDb.getServiceBySlug(params.id) || (await serverDb.getServices()).find((s) => s.id === params.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Tjänsten hittades inte." }, { status: 404 });
    }

    const updated = await serverDb.saveService({
      ...existing,
      ...body,
      id: existing.id,
    });

    logger.audit("WORKSHOP_SERVICE_UPDATED", { id: updated.id, name: updated.name, admin: session.email });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logger.error("API_PATCH_SERVICE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte uppdatera tjänsten." }, { status: 500 });
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

    await serverDb.deleteService(params.id);
    logger.audit("WORKSHOP_SERVICE_DELETED", { id: params.id, admin: session.email });

    return NextResponse.json({ success: true, message: "Tjänsten har raderats från databasen." });
  } catch (error) {
    logger.error("API_DELETE_SERVICE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte radera tjänsten." }, { status: 500 });
  }
}
