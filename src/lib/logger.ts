/**
 * Structured Observability Logger for Skandiva Stockholm
 * Standard JSON format for server logs, metrics, audit trails and state transitions.
 */

type LogLevel = "info" | "warn" | "error" | "audit";

interface LogPayload {
  level: LogLevel;
  action: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  error?: string;
  stack?: string;
}

function log(level: LogLevel, action: string, metadata?: Record<string, unknown>, err?: unknown) {
  const payload: LogPayload = {
    level,
    action,
    timestamp: new Date().toISOString(),
    metadata,
  };

  if (err) {
    if (err instanceof Error) {
      payload.error = err.message;
      payload.stack = err.stack;
    } else {
      payload.error = String(err);
    }
  }

  const formatted = JSON.stringify(payload);

  if (level === "error") {
    console.error(`[SKANDIVA_ERR] ${formatted}`);
  } else if (level === "warn") {
    console.warn(`[SKANDIVA_WARN] ${formatted}`);
  } else if (level === "audit") {
    console.info(`[SKANDIVA_AUDIT] ${formatted}`);
  } else {
    console.log(`[SKANDIVA_INFO] ${formatted}`);
  }
}

export const logger = {
  info: (action: string, metadata?: Record<string, unknown>) => log("info", action, metadata),
  warn: (action: string, metadata?: Record<string, unknown>) => log("warn", action, metadata),
  error: (action: string, err?: unknown, metadata?: Record<string, unknown>) => log("error", action, metadata, err),
  audit: (action: string, metadata?: Record<string, unknown>) => log("audit", action, metadata),
};
