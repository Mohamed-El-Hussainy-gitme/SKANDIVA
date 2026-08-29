import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const { referenceNumber, message, sender } = await request.json();

    if (!referenceNumber || !message) {
      return NextResponse.json({ success: false, error: "Referensnummer och meddelande krävs." }, { status: 400 });
    }

    logger.audit("WHATSAPP_CONVERSATION_SYNCED", { referenceNumber, sender, admin: session.email });

    // If it's a quote (OFF-...), update quote notes in Supabase
    if (referenceNumber.startsWith("OFF")) {
      const quotes = await serverDb.getQuotes();
      const quote = quotes.find((q) => q.quoteNumber === referenceNumber);
      if (quote) {
        const updatedNotes = quote.notes
          ? `${quote.notes}\n[${new Date().toLocaleDateString("sv-SE")}] ${sender || "WhatsApp"}: ${message}`
          : `[${new Date().toLocaleDateString("sv-SE")}] ${sender || "WhatsApp"}: ${message}`;

        await serverDb.updateQuote(quote.id, { notes: updatedNotes });
      }
    } else if (referenceNumber.startsWith("SKD")) {
      // If it's an order (SKD-...), update order workshop notes in Supabase
      const order = await serverDb.getOrderByNumber(referenceNumber);
      if (order) {
        const updatedNotes = order.workshopNotes
          ? `${order.workshopNotes}\n[${new Date().toLocaleDateString("sv-SE")}] ${sender || "WhatsApp"}: ${message}`
          : `[${new Date().toLocaleDateString("sv-SE")}] ${sender || "WhatsApp"}: ${message}`;

        await serverDb.updateOrder(order.id, { workshopNotes: updatedNotes });
      }
    }

    return NextResponse.json({ success: true, message: "Konversation synkroniserad till databasen." });
  } catch (error) {
    logger.error("WHATSAPP_SYNC_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte synkronisera WhatsApp-data." }, { status: 500 });
  }
}
