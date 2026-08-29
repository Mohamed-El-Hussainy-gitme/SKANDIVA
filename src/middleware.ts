import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "skandiva_admin_session";
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "";

async function verifyEdgeToken(token: string): Promise<boolean> {
  if (!token || !ADMIN_SECRET) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payloadBase64, signature] = parts;
    const session = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))
      )
    );

    // Invalidate old legacy tokens without Supabase userId
    if (!session.userId) {
      return false;
    }

    // Expiry check
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      return false;
    }

    // Cryptographic HMAC-SHA256 signature verification in Edge Runtime
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(ADMIN_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = Uint8Array.from(
      atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(payloadBase64)
    );

    return isValid;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except login
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isValid = await verifyEdgeToken(token);
    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
