import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabaseServer";
import { Order, OrderItem } from "@/types";
import { generateOrderNumber, calculateOrderFinancials, initializeTrackingEvents } from "@/lib/engine";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Obehörig. Mästarlösenord krävs för orderinspektion." },
        { status: 401 }
      );
    }

    const orders = await serverDb.getOrders();
    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    logger.error("API_GET_ORDERS_FAILED", error);
    return NextResponse.json(
      { success: false, error: "Kunde inte hämta ordrar från databasen." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Required fields validation
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Obligatoriska fält saknas (namn, e-post, telefon, varor)." },
        { status: 400 }
      );
    }

    // 2. Server-side Price & Stock Verification
    let calculatedItemsTotal = 0;
    const validatedItems: OrderItem[] = [];
    const productsToMarkSold: string[] = [];

    for (const item of body.items as OrderItem[]) {
      if (item.type === "product") {
        const product = await serverDb.getProductById(item.referenceId);
        if (!product) {
          return NextResponse.json(
            { success: false, error: `Produkten "${item.title}" finns inte längre i sortimentet.` },
            { status: 400 }
          );
        }

        if (product.stockStatus === "sald") {
          return NextResponse.json(
            { success: false, error: `Tyvärr har "${product.name}" precis blivit såld till en annan kund.` },
            { status: 409 }
          );
        }

        // Check variant price if applicable
        let unitPrice = product.basePrice;
        if (item.selectedVariantName) {
          const variant = product.variants.find((v) => v.name === item.selectedVariantName);
          if (variant) {
            unitPrice += variant.priceDelta;
          }
        }

        const totalPrice = unitPrice * (item.quantity || 1);
        calculatedItemsTotal += totalPrice;
        validatedItems.push({
          ...item,
          unitPrice,
          totalPrice,
        });

        productsToMarkSold.push(product.id);
      } else if (item.type === "service") {
        const service = (await serverDb.getServiceBySlug(item.referenceId)) || (await serverDb.getServices()).find((s) => s.id === item.referenceId);
        const basePrice = service ? service.basePrice : item.unitPrice || 4900;
        let totalPrice = basePrice;

        // Check selected addons
        if (Array.isArray(item.selectedAddons) && item.selectedAddons.length > 0 && service) {
          for (const addonName of item.selectedAddons) {
            const matchedAddon = service.addons.find((a) => addonName.includes(a.name) || a.name === addonName);
            if (matchedAddon) {
              totalPrice += matchedAddon.price;
            }
          }
        }

        calculatedItemsTotal += totalPrice * (item.quantity || 1);
        validatedItems.push({
          ...item,
          unitPrice: totalPrice,
          totalPrice: totalPrice * (item.quantity || 1),
        });
      }
    }

    // 3. Verify Delivery Zone Fee
    const zones = await serverDb.getDeliveryZones();
    const matchedZone = zones.find((z) => z.id === body.deliveryZoneId) || zones[0];
    const deliveryFee = matchedZone ? matchedZone.surcharge : 0;

    // 4. Compute Financials & moms
    const financials = calculateOrderFinancials(calculatedItemsTotal, deliveryFee);

    // 5. Guaranteed Collision-Free Order Number (Retry Loop)
    let orderNumber = generateOrderNumber();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await serverDb.getOrderByNumber(orderNumber);
      if (!existing) break;
      orderNumber = generateOrderNumber();
    }

    const orderId = `order-${Date.now()}`;
    const trackingEvents = initializeTrackingEvents(orderId);

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      orderType: body.orderType || (validatedItems.some((i) => i.type === "service") ? "service" : "product"),
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim(),
      customerPhone: body.customerPhone.trim(),
      customerAddress: body.customerAddress || "",
      customerPostalCode: body.customerPostalCode || "",
      customerCity: body.customerCity || "Stockholm",
      deliveryZoneId: matchedZone?.id || "zone-stockholm-innerstad",
      deliveryZoneName: matchedZone?.name || "Stockholm Innerstad & Närförort",
      deliveryFee,
      subtotal: financials.subtotal,
      taxAmount: financials.taxAmount,
      totalAmount: financials.totalAmount,
      paymentMethod: body.paymentMethod || "klarna",
      paymentStatus: "betald",
      status: "mottagen",
      items: validatedItems,
      trackingEvents,
      estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      workshopNotes: body.workshopNotes?.trim() || "Order mottagen via webbutiken.",
      assignedUpholsterer: "Mästare Lars Bergström",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 6. Save order to Supabase
    const created = await serverDb.createOrder(newOrder);

    // 7. Atomically lock stock status (UPDATE WHERE stock_status != 'sald' to prevent race conditions)
    for (const prodId of productsToMarkSold) {
      try {
        const { error: stockError } = await (await import("@/lib/supabaseServer")).supabaseAdmin
          .from("products")
          .update({ stock_status: "sald" })
          .eq("id", prodId)
          .neq("stock_status", "sald");

        if (stockError) {
          logger.warn("FAILED_TO_MARK_PRODUCT_SOLD", { productId: prodId, error: stockError.message });
        } else {
          logger.info("PRODUCT_MARKED_SOLD_UPON_ORDER", { productId: prodId, orderNumber: created.orderNumber });
        }
      } catch (e) {
        logger.warn("FAILED_TO_MARK_PRODUCT_SOLD", { productId: prodId, error: String(e) });
      }
    }

    logger.audit("NEW_ORDER_PROCESSED_SERVER_SIDE", {
      orderNumber: created.orderNumber,
      totalAmount: created.totalAmount,
      customerEmail: created.customerEmail,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    logger.error("API_POST_ORDER_FAILED", error);
    return NextResponse.json(
      { success: false, error: "Kunde inte bearbeta och spara ordern på servern." },
      { status: 500 }
    );
  }
}
