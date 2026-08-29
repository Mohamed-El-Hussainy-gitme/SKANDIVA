import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-postadress och lösenord måste anges." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim(),
    });

    if (authError || !authData.user) {
      logger.warn("FAILED_SUPABASE_ADMIN_LOGIN", {
        email: cleanEmail,
        error: authError?.message || "Invalid credentials",
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { success: false, error: authError?.message || "Felaktig e-postadress eller lösenord. Åtkomst nekad." },
        { status: 401 }
      );
    }

    const user = authData.user;

    // 2. Verify Admin Role in Database (admin_users table or app_metadata)
    let isAdmin = false;
    let userRole: "admin" | "master_upholsterer" = "admin";

    try {
      const { data: adminRecord, error: adminErr } = await supabaseAdmin
        .from("admin_users")
        .select("*")
        .ilike("email", cleanEmail)
        .eq("is_active", true)
        .maybeSingle();

      if (!adminErr && adminRecord) {
        isAdmin = true;
        userRole = (adminRecord.role as "admin" | "master_upholsterer") || "admin";
      } else {
        // Check if admin_users is empty (first ever admin setup auto-bootstrap)
        const { count } = await supabaseAdmin
          .from("admin_users")
          .select("*", { count: "exact", head: true });

        if (count === 0 || user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin") {
          // Auto-register first user as admin
          await supabaseAdmin.from("admin_users").upsert({
            user_id: user.id,
            email: cleanEmail,
            full_name: user.user_metadata?.full_name || "Tapetserarmästare",
            role: "admin",
            is_active: true,
          });
          isAdmin = true;
        }
      }
    } catch {
      // If table query fails, strictly check user metadata (fail-closed)
      isAdmin = Boolean(user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin");
    }

    if (!isAdmin) {
      logger.warn("UNAUTHORIZED_ADMIN_ROLE_ACCESS_DENIED", { email: cleanEmail, userId: user.id });
      return NextResponse.json(
        { success: false, error: "Åtkomst nekad: Kontot saknar administratörsbehörighet i verkstaden." },
        { status: 403 }
      );
    }

    // 3. Create cryptographically signed admin session
    const token = createAdminToken(cleanEmail, user.id, userRole);
    logger.audit("SUCCESSFUL_SUPABASE_ADMIN_LOGIN", { email: cleanEmail, userId: user.id, role: userRole });

    const response = NextResponse.json({
      success: true,
      message: "Välkommen till Skandiva Verkstadsadministration",
      user: {
        id: user.id,
        email: cleanEmail,
        role: userRole,
      },
    });

    // 4. Set secure HTTP-Only session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    logger.error("ADMIN_LOGIN_SERVER_ERROR", error);
    return NextResponse.json(
      { success: false, error: "Ett internt serverfel uppstod vid inloggning." },
      { status: 500 }
    );
  }
}
