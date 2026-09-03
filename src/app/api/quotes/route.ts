import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { QuoteRequest } from "@/types";
import { generateQuoteNumber } from "@/lib/engine";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }
    const quotes = await serverDb.getQuotes();
    return NextResponse.json({ success: true, count: quotes.length, data: quotes });
  } catch (error) {
    logger.error("API_GET_QUOTES_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta offertförfrågningar." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.contactName || !body.email || !body.phone || !body.furnitureType) {
      return NextResponse.json(
        { success: false, error: "Obligatoriska fält saknas (namn, e-post, telefon, möbeltyp)." },
        { status: 400 }
      );
    }

    const quoteId = `quote-${Date.now()}`;
    const quoteNumber = body.quoteNumber || generateQuoteNumber();

    const newQuote: QuoteRequest = {
      id: quoteId,
      quoteNumber,
      contactName: body.contactName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      city: body.city || "Stockholm",
      furnitureType: body.furnitureType,
      designerModel: body.designerModel || undefined,
      numberOfPieces: Number(body.numberOfPieces || 1),
      fabricPreference: body.fabricPreference || undefined,
      currentConditionDescription: body.currentConditionDescription || "",
      dimensions: body.dimensions || undefined,
      images: Array.isArray(body.images) ? body.images : [],
      status: "ny",
      quotedPrice: body.quotedPrice ? Number(body.quotedPrice) : undefined,
      notes: body.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    const created = await serverDb.createQuote(newQuote);
    logger.audit("NEW_QUOTE_RECEIVED", {
      quoteNumber: created.quoteNumber,
      contactName: created.contactName,
      email: created.email,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    logger.error("API_POST_QUOTE_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte spara offertförfrågan." }, { status: 500 });
  }
}
