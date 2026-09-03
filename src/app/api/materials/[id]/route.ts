import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const saved = await serverDb.saveMaterial({
      id,
      name: body.name?.trim(),
      materialType: body.materialType,
      colorHex: body.colorHex || undefined,
      imageUrl: body.imageUrl,
      price: Number(body.price) || 0,
      supplier: body.supplier || undefined,
      description: body.description || undefined,
      sortOrder: Number(body.sortOrder) || 0,
      active: body.active !== false,
    });

    logger.audit("MATERIAL_UPDATED_VIA_API", { id, name: saved.name, admin: session.email });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    logger.error("API_PUT_MATERIAL_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte uppdatera material." }, { status: 500 });
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

    const { id } = params;
    await serverDb.deleteMaterial(id);

    logger.audit("MATERIAL_DELETED_VIA_API", { id, admin: session.email });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("API_DELETE_MATERIAL_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte ta bort material." }, { status: 500 });
  }
}
