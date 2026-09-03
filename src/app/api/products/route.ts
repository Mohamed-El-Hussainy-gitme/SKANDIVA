import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { Product } from "@/types";
import { authenticateAdminRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const products = await serverDb.getProducts();
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    logger.error("API_GET_PRODUCTS_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte hämta produkter." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Obehörig. Mästarlösenord krävs." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.basePrice) {
      return NextResponse.json({ success: false, error: "Namn och baspris krävs." }, { status: 400 });
    }

    const newProduct: Product = {
      id: body.id || `prod-${Date.now()}`,
      slug: body.slug
        ? body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
        : body.name.toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/[^a-z0-9]+/g, "-"),
      name: body.name.trim(),
      designer: body.designer || "Skandinavisk Formgivare",
      model: body.model || body.name,
      category: body.category || "Fatolj",
      collection: body.collection || "none",
      categoryNameSwedish: body.categoryNameSwedish || "Fåtöljer",
      basePrice: Number(body.basePrice),
      description: body.description || "",
      historicalContext: body.historicalContext || "",
      dimensions: body.dimensions || "",
      conditionGrade: body.conditionGrade || "Nyskick",
      provenanceCrestText: body.provenanceCrestText || "Helrenoverad av Skandiva Tapetserarverkstad",
      stockStatus: body.stockStatus || "i_lager",
      primaryImage: body.primaryImage || "/IMG_0948.png",
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
      materialIds: Array.isArray(body.materialIds) ? body.materialIds : [],
      beforeImage: body.beforeImage || undefined,
      afterImage: body.afterImage || undefined,
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString(),
    };

    const saved = await serverDb.saveProduct(newProduct);
    logger.audit("PRODUCT_CREATED_VIA_API", { id: saved.id, name: saved.name, admin: session.email });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    logger.error("API_POST_PRODUCT_FAILED", error);
    return NextResponse.json({ success: false, error: "Kunde inte spara produkten i databasen." }, { status: 500 });
  }
}
