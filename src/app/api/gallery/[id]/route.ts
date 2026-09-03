import { NextResponse } from "next/server";
import { serverDb } from "@/lib/db";
import { authenticateAdminRequest } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = authenticateAdminRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Obehörig." }, { status: 401 });

    await serverDb.deleteGalleryItem(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Kunde inte radera." }, { status: 500 });
  }
}
