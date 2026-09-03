import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
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
    const quotes = await serverDb.getQuotes();
    const existing = quotes.find((q) => q.id === params.id || q.quoteNumber === params.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Offertförfrågan hittades inte." }, { status: 404 });
    }

    const updated = await serverDb.updateQuote(existing.id, {
      ...existing,
      ...body,
      id: existing.id,
    });

    logger.audit("QUOTE_UPDATED_VIA_API", { id: updated.id, quoteNumber: updated.quoteNumber, admin: session.email });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logger.error("API_PATCH_QUOTE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte uppdatera offerten." }, { status: 500 });
  }
}
