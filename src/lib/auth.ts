import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY as string;

if (!ADMIN_SECRET) {
  throw new Error(
    "FATAL_CONFIG_ERROR: ADMIN_SECRET_KEY must be defined in environment variables. Hardcoded secret fallbacks are strictly prohibited."
  );
}

export const ADMIN_COOKIE_NAME = "skandiva_admin_session";

export interface AdminSession {
  userId?: string;
  email: string;
  username: string;
  role: "admin" | "master_upholsterer";
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates a cryptographically signed HMAC token for the authenticated admin session
 */
export function createAdminToken(email: string, userId?: string, role: "admin" | "master_upholsterer" = "admin"): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 7 * 24 * 60 * 60 * 1000; // 7 days validity

  const session: AdminSession = {
    userId,
    email: email.trim().toLowerCase(),
    username: email.split("@")[0] || "admin",
    role,
    issuedAt,
    expiresAt,
  };

  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

/**
 * Verifies and decodes an admin token
 */
export function verifyAdminToken(token: string | undefined): AdminSession | null {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payload)
      .digest("base64url");

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const session: AdminSession = JSON.parse(Buffer.from(payload, "base64url").toString());

    // Invalidate old legacy tokens without Supabase userId
    if (!session.userId) {
      return null;
    }

    // Check expiration
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Authenticates an incoming Request by verifying the HMAC session cookie or header
 */
export function authenticateAdminRequest(request: Request): AdminSession | null {
  // Check cookie header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );
    const token = cookies[ADMIN_COOKIE_NAME];
    if (token) {
      const session = verifyAdminToken(token);
      if (session) return session;
    }
  }

  // Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyAdminToken(token);
  }

  return null;
}
