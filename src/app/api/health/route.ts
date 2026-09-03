import { NextResponse } from "next/server";
import { supabase } from "@/lib/db/config";
import { logger } from "@/lib/logger";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "connected";
  let dbLatencyMs = 0;
  let errorDetail: string | null = null;

  try {
    const { error } = await supabase.from("products").select("id").limit(1);
    dbLatencyMs = Date.now() - startTime;

    if (error) {
      dbStatus = "degraded";
      errorDetail = error.message;
    }
  } catch (e) {
    dbStatus = "disconnected";
    errorDetail = String(e);
    dbLatencyMs = Date.now() - startTime;
  }

  const healthPayload = {
    status: dbStatus === "connected" ? "healthy" : "warning",
    timestamp: new Date().toISOString(),
    service: "Skandiva Stockholm Atelier Core API",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    database: {
      provider: "Supabase PostgreSQL",
      status: dbStatus,
      latencyMs: dbLatencyMs,
      error: errorDetail,
    },
    uptimeSeconds: process.uptime ? Math.floor(process.uptime()) : undefined,
  };

  logger.info("HEALTH_CHECK_PERFORMED", { status: healthPayload.status, latencyMs: dbLatencyMs });

  return NextResponse.json(healthPayload, {
    status: dbStatus === "connected" ? 200 : 503,
  });
}
