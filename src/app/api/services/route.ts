import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { WorkshopService } from "@/types";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const services = await serverDb.getServices();
    return NextResponse.json({ success: true, count: services.length, data: services });
  } catch (error) {
    logger.error("API_GET_SERVICES_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta verkstadstjänster." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.slug || !body.shortDescription) {
      return NextResponse.json(
        { success: false, error: "Obligatoriska fält saknas (namn, slug, kort beskrivning)." },
        { status: 400 }
      );
    }

    const serviceId = body.id || `serv-${Date.now()}`;
    const newService: WorkshopService = {
      id: serviceId,
      slug: body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      name: body.name.trim(),
      shortDescription: body.shortDescription.trim(),
      fullDescription: body.fullDescription || body.shortDescription,
      furnitureType: body.furnitureType || "Fatolj",
      applicableModels: Array.isArray(body.applicableModels) ? body.applicableModels : [body.name],
      isFixedPrice: Boolean(body.isFixedPrice),
      priceRangeText: body.priceRangeText || `${body.basePrice || 4900} kr`,
      basePrice: Number(body.basePrice || 0),
      turnaroundDays: Number(body.turnaroundDays || 14),
      turnaroundText: body.turnaroundText || `${body.turnaroundDays || 14} arbetsdagar`,
      primaryImage: body.primaryImage || "/IMG_0948.png",
      beforeAfterPair:
        body.beforeAfterPair && body.beforeAfterPair.before && body.beforeAfterPair.after
          ? body.beforeAfterPair
          : undefined,
      materials: Array.isArray(body.materials) ? body.materials : [],
      addons: Array.isArray(body.addons) ? body.addons : [],
      featured: Boolean(body.featured),
    };

    const saved = await serverDb.saveService(newService);
    logger.audit("WORKSHOP_SERVICE_CREATED", { id: saved.id, name: saved.name, admin: session.email });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    logger.error("API_POST_SERVICE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte skapa verkstadstjänst." }, { status: 500 });
  }
}
