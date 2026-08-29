import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    await serverDb.deleteReview(params.id);
    logger.audit("REVIEW_DELETED_VIA_API", { id: params.id, admin: session.email });

    return NextResponse.json({ success: true, message: "Omdömet har raderats från databasen." });
  } catch (error) {
    logger.error("API_DELETE_REVIEW_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte radera omdömet." }, { status: 500 });
  }
}
