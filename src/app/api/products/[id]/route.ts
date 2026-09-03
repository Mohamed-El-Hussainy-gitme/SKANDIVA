import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await serverDb.getProductById(params.id) || await serverDb.getProductBySlug(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Produkten hittades inte." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    logger.error("API_GET_PRODUCT_DETAIL_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta produkt." }, { status: 500 });
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
    const existing = await serverDb.getProductById(params.id) || await serverDb.getProductBySlug(params.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Produkten hittades inte." }, { status: 404 });
    }

    const updated = await serverDb.saveProduct({
      ...existing,
      ...body,
      id: existing.id,
    });

    logger.audit("PRODUCT_UPDATED_VIA_API", { id: updated.id, name: updated.name, admin: session.email });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logger.error("API_PATCH_PRODUCT_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte uppdatera produkten." }, { status: 500 });
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

    await serverDb.deleteProduct(params.id);
    logger.audit("PRODUCT_DELETED_VIA_API", { id: params.id, admin: session.email });

    return NextResponse.json({ success: true, message: "Produkten har raderats permanent från databasen." });
  } catch (error) {
    logger.error("API_DELETE_PRODUCT_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte radera produkten." }, { status: 500 });
  }
}
