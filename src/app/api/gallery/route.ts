import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { GalleryItem } from "@/types";
import { authenticateAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const items = await serverDb.getGalleryItems();
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch {
    return NextResponse.json({ success: false, error: "Kunde inte hämta galleri." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Obehörig." }, { status: 401 });

    const body = await request.json();
    const newItem: Partial<GalleryItem> = {
      title: body.title,
      description: body.description,
      beforeImage: body.beforeImage,
      afterImage: body.afterImage,
      sortOrder: body.sortOrder || 0,
    };

    const saved = await serverDb.saveGalleryItem(newItem);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Kunde inte spara." }, { status: 500 });
  }
}
