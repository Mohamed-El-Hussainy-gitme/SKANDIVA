import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const includeInactive = new URL(request.url).searchParams.get("includeInactive") === "1";
    if (includeInactive && !authenticateAdminRequest(request)) {
      return NextResponse.json({ success: false, error: "Obehörig." }, { status: 401 });
    }
    const materials = await serverDb.getMaterials(includeInactive);
    return NextResponse.json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    logger.error("API_GET_MATERIALS_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta material." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.imageUrl) {
      return NextResponse.json({ success: false, error: "Namn och bild krävs." }, { status: 400 });
    }

    const saved = await serverDb.saveMaterial({
      id: body.id || `mat-${Date.now()}`,
      name: body.name.trim(),
      materialType: body.materialType || "leather",
      colorHex: body.colorHex || undefined,
      imageUrl: body.imageUrl,
      price: Number(body.price) || 0,
      supplier: body.supplier || undefined,
      description: body.description || undefined,
      sortOrder: Number(body.sortOrder) || 0,
      active: body.active !== false,
      createdAt: new Date().toISOString(),
    });

    logger.audit("MATERIAL_CREATED_VIA_API", { id: saved.id, name: saved.name, admin: session.email });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    logger.error("API_POST_MATERIAL_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte spara material." }, { status: 500 });
  }
}
