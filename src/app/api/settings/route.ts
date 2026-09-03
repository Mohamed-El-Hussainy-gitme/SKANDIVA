import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const settings = await serverDb.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    logger.error("GET_SETTINGS_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte läsa inställningar från databasen." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const updates = await request.json();
    const updated = await serverDb.updateSettings(updates);
    logger.audit("SITE_SETTINGS_UPDATED_IN_DATABASE", { updatedFields: Object.keys(updates), admin: session.email });

    // Invalidate Next.js cache so changes reflect immediately across all pages and footer
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/", "layout");
      revalidatePath("/kontakt");
      revalidatePath("/om-oss");
      revalidatePath("/butik");
    } catch {
      // ignore in test/build environments
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logger.error("PATCH_SETTINGS_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte spara inställningar till databasen." }, { status: 500 });
  }
}
