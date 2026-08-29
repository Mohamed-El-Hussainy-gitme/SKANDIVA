import { NextResponse } from "next/server";
import { supabaseAdmin, mapOrderFromDb } from "@/lib/supabaseServer";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || searchParams.get("query") || searchParams.get("id");

  if (!q || !q.trim()) {
    return NextResponse.json(
      { success: false, error: "Sökterm (ordernummer eller e-postadress) saknas." },
      { status: 400 }
    );
  }

  const query = q.trim();

  try {
  let orderRow: Record<string, unknown> | null = null;

    if (query.includes("@")) {
      // Search by customer email
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .ilike("customer_email", query)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        orderRow = data;
      }
    } else {
      // Search by order number (case-insensitive)
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .ilike("order_number", query)
        .maybeSingle();

      if (!error && data) {
        orderRow = data;
      }
    }

    if (!orderRow) {
      logger.info("TRACKING_QUERY_NOT_FOUND", { query });
      return NextResponse.json(
        { success: false, error: "Ingen aktiv order hittades med det angivna ordernumret eller e-postadressen." },
        { status: 404 }
      );
    }

    const order = mapOrderFromDb(orderRow);
    logger.info("TRACKING_QUERY_SUCCESS", { orderNumber: order.orderNumber });

    // Return strictly sanitized public tracking data (No PII: no email, phone, or address)
    const sanitized = {
      orderNumber: order.orderNumber,
      orderType: order.orderType,
      customerCity: order.customerCity,
      deliveryZoneName: order.deliveryZoneName,
      status: order.status,
      items: order.items.map((i) => ({
        id: i.id || `item-${Math.random().toString(36).substring(2, 9)}`,
        title: i.title,
        designerOrModel: i.designerOrModel,
        selectedVariantName: i.selectedVariantName,
        selectedMaterial: i.selectedMaterial,
        selectedAddons: i.selectedAddons,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
        image: i.image,
      })),
      totalAmount: order.totalAmount,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      trackingEvents: order.trackingEvents,
      estimatedCompletionDate: order.estimatedCompletionDate,
      assignedUpholsterer: order.assignedUpholsterer,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json({ success: true, data: sanitized });
  } catch (error) {
    logger.error("API_TRACKING_FAILED", error);
    return NextResponse.json(
      { success: false, error: "Kunde inte slå upp orderstatus." },
      { status: 500 }
    );
  }
}
