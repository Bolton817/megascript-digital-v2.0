import { NextResponse } from "next/server";
import { lastDevEmailDispatched } from "@/server/services/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Only accessible in local development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.toLowerCase().trim();

  if (!lastDevEmailDispatched) {
    return NextResponse.json({ success: true, otp: null });
  }

  if (email && lastDevEmailDispatched.to.toLowerCase().trim() !== email) {
    return NextResponse.json({ success: true, otp: null });
  }

  const rawRecord = lastDevEmailDispatched as any;
  const subjectMatch = rawRecord.subject?.match(/\b\d{6}\b/);
  const bodyMatch = typeof rawRecord.textContent === "string" ? rawRecord.textContent.match(/\b\d{6}\b/) : null;
  const otp = rawRecord.code || subjectMatch?.[0] || bodyMatch?.[0] || null;

  return NextResponse.json({
    success: true,
    otp,
    to: lastDevEmailDispatched.to,
    sentAt: lastDevEmailDispatched.sentAt,
  });
}
