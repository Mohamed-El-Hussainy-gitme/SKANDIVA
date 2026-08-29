import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST() {
  logger.audit("ADMIN_LOGOUT");

  const response = NextResponse.json({
    success: true,
    message: "Du har loggats ut från Skandiva Administration.",
  });

  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
