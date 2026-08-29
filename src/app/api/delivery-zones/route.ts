import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { DeliveryZone } from "@/types";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const zones = await serverDb.getDeliveryZones();
    return NextResponse.json({ success: true, count: zones.length, data: zones });
  } catch (error) {
    logger.error("API_GET_DELIVERY_ZONES_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta leveranszoner." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: "Zonnamn krävs." }, { status: 400 });
    }

    const newZone: DeliveryZone = {
      id: body.id || `zone-${Date.now()}`,
      name: body.name.trim(),
      description: body.description || "",
      corridorDescription: body.corridorDescription || "",
      surcharge: Number(body.surcharge || 0),
      estimatedDeliveryDays: body.estimatedDeliveryDays || "2–5 vardagar",
      active: body.active !== undefined ? Boolean(body.active) : true,
    };

    const saved = await serverDb.saveDeliveryZone(newZone);
    logger.audit("DELIVERY_ZONE_CREATED", { id: saved.id, name: saved.name, admin: session.email });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    logger.error("API_POST_DELIVERY_ZONE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte spara leveranszon." }, { status: 500 });
  }
}
