import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/server/db";
import { logAuditEvent } from "@/server/services/audit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Only accessible in local development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const email = (body.email || "megascriptdigital@gmail.com").toLowerCase().trim();

    // Verify user exists
    const user = await db.user.findUnique({
      where: { normalizedEmail: email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: `User with email ${email} not found` }, { status: 404 });
    }

    // Generate random session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create session in DB
    const session = await db.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        lastActivityAt: new Date(),
        userAgent: "Localhost Dev Quick-Login",
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: "DEV_QUICK_LOGIN",
      targetType: "AUTH_SESSION",
      targetId: session.id,
      metadata: { email: user.email },
    });

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set("better-auth.session_token", token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        roles: user.userRoles.map((ur) => ur.role.name),
      },
      redirectUrl: body.redirectUrl || "/master/overview",
    });
  } catch (err: any) {
    console.error("[DEV_QUICK_LOGIN] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to create dev session" }, { status: 500 });
  }
}
