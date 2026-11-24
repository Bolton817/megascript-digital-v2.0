import { NextRequest, NextResponse } from "next/server";
import { validateSessionWithInactivity } from "@/features/auth/session";

export async function POST(req: NextRequest) {
  // Better Auth cookie names
  const token =
    req.cookies.get("__Secure-better-auth.session_token")?.value ||
    req.cookies.get("better-auth.session_token")?.value;

  if (!token) {
    return NextResponse.json({ valid: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const ipAddress = req.headers.get("x-forwarded-for") || req.ip;

  const result = await validateSessionWithInactivity(token, {
    isQualifyingActivity: true,
    ipAddress,
  });

  if (!result.valid) {
    const response = NextResponse.json(
      { valid: false, error: result.reason || "SESSION_EXPIRED" },
      { status: 401 }
    );
    // Clear cookies if expired
    response.cookies.delete("__Secure-better-auth.session_token");
    response.cookies.delete("better-auth.session_token");
    return response;
  }

  return NextResponse.json({
    valid: true,
    session: {
      lastActivityAt: result.session?.lastActivityAt,
      expiresAt: result.session?.expiresAt,
    },
  });
}
