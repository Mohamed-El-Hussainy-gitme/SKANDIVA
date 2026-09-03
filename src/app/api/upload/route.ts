import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { supabaseAdmin } from "@/lib/db";
import { logger } from "@/lib/logger";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Ingen bildfil bifogades." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Otillåtet filformat. Endast JPG, PNG, WEBP, AVIF och GIF stöds.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Filen är för stor. Max tillåten storlek är 15 MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "jpg"}`;
    const safeBaseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueSuffix = crypto.randomBytes(6).toString("hex");
    const filename = `${safeBaseName}-${uniqueSuffix}${ext}`;

    // Upload to Supabase Storage bucket 'media'
    const { data, error } = await supabaseAdmin.storage
      .from("media")
      .upload(`uploads/${filename}`, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error || !data) {
      logger.error("SUPABASE_STORAGE_UPLOAD_FAILED", {
        error: error?.message,
        filename,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            "Bilden kunde inte laddas upp till medielagringen. Kontrollera lagringsinställningarna.",
        },
        { status: 500 }
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("media")
      .getPublicUrl(`uploads/${filename}`);

    if (!urlData?.publicUrl) {
      logger.error("SUPABASE_STORAGE_PUBLIC_URL_MISSING", { filename });
      return NextResponse.json(
        {
          success: false,
          error:
            "Bilden laddades upp men den publika adressen kunde inte hämtas.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename,
      size: file.size,
    });
  } catch (error) {
    logger.error("IMAGE_UPLOAD_FAILED", error);
    return NextResponse.json(
      { success: false, error: "Kunde inte ladda upp bilden till servern." },
      { status: 500 }
    );
  }
}
