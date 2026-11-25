import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { analyticsEventSchema, sanitizeEventMetadata } from "@/lib/analytics/taxonomy";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Rate limiting: 120 analytics events per minute per IP
    const rateCheck = checkRateLimit(`analytics:${clientIp}`, 120, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: "Analytics rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = analyticsEventSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid analytics event schema" },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Strict PII Sanitization Guarantee (Sheet 074)
    const cleanedMetadata = data.metadata ? sanitizeEventMetadata(data.metadata) : undefined;

    await db.analyticsEvent.create({
      data: {
        eventName: data.eventName,
        route: data.route.slice(0, 500),
        component: data.component?.slice(0, 100),
        sourceChannel: data.sourceChannel?.slice(0, 100),
        sessionId: data.sessionId?.slice(0, 100),
        metadata: cleanedMetadata || undefined,
        consentGiven: data.consentGiven,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Analytics ingestion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to ingest analytics event" },
      { status: 500 }
    );
  }
}
