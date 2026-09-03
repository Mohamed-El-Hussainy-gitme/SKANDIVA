import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { Order, OrderItem } from "@/types";
import { generateOrderNumber, calculateOrderFinancials } from "@/lib/engine";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/db";

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

      let unitPrice = product.basePrice;
      if (product.materialIds.length > 0 && !item.selectedMaterial) {
        return NextResponse.json({ success: false, error: `Välj material för produkten "${product.name}".` }, { status: 400 });
      }
      if (item.selectedMaterial && product.materialIds.length > 0) {
        const materials = await serverDb.getMaterials();
        const material = materials.find((entry) => entry.name === item.selectedMaterial && product.materialIds.includes(entry.id));
        if (!material) {
          return NextResponse.json({ success: false, error: `اختر خامة صحيحة للمنتج "${product.name}".` }, { status: 400 });
        }
        unitPrice += material.price;
      }

      const totalPrice = unitPrice * (item.quantity || 1);
      calculatedItemsTotal += totalPrice;
      validatedItems.push({ ...item, unitPrice, totalPrice });
      productsToMarkSold.push(product.id);
    }

    // 3. Compute Financials
    const settings = await serverDb.getSettings();
    const financials = calculateOrderFinancials(calculatedItemsTotal, settings.taxEnabled, settings.taxRate);

    // 4. Guaranteed Collision-Free Order Number
    let orderNumber = generateOrderNumber();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await serverDb.getOrderByNumber(orderNumber);
      if (!existing) break;
      orderNumber = generateOrderNumber();
    }

    const orderId = `order-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      orderType: "product",
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim(),
      customerPhone: body.customerPhone.trim(),
      customerAddress: body.customerAddress || "",
      customerPostalCode: body.customerPostalCode || "",
      customerCity: body.customerCity || "Stockholm",
      subtotal: financials.subtotal,
      taxAmount: financials.taxAmount,
      totalAmount: financials.totalAmount,
      paymentMethod: body.paymentMethod || "klarna",
      paymentStatus: "betald",
      status: "mottagen",
      items: validatedItems,
      estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      workshopNotes: body.workshopNotes?.trim() || "Order mottagen via webbutiken.",
      assignedUpholsterer: "Mästare",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 5. Save order
    const created = await serverDb.createOrder(newOrder);

    // 6. Atomically mark products as sold
    for (const prodId of productsToMarkSold) {
      try {
        const { error: stockError } = await supabaseAdmin
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
