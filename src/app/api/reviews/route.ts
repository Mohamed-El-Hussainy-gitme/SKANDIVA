import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { Review } from "@/types";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const reviews = await serverDb.getReviews();
    return NextResponse.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    logger.error("API_GET_REVIEWS_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta omdömen." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.author || !body.text || !body.furnitureModel) {
      return NextResponse.json({ success: false, error: "Kundnamn, text och möbelmodell krävs." }, { status: 400 });
    }

    const newReview: Review = {
      id: body.id || `rev-${Date.now()}`,
      author: body.author.trim(),
      location: body.location || "Stockholm",
      furnitureModel: body.furnitureModel.trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating || 5))),
      text: body.text.trim(),
      date: body.date || new Date().toISOString().split("T")[0],
      verifiedPurchase: body.verifiedPurchase !== undefined ? Boolean(body.verifiedPurchase) : true,
    };

    const saved = await serverDb.saveReview(newReview);
    logger.audit("REVIEW_CREATED_VIA_API", { id: saved.id, author: saved.author, admin: session.email });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    logger.error("API_POST_REVIEW_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte spara omdömet i databasen." }, { status: 500 });
  }
}
