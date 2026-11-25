import { NextRequest, NextResponse } from "next/server";
import { newsletterSubscribeSchema } from "@/lib/validations/newsletter";
import { checkRateLimit } from "@/lib/rate-limit";
import { subscribe } from "@/server/services/newsletter/subscribers";

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction & rate limiting (5 per 10 minutes)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const ipLimit = checkRateLimit(`newsletter:${clientIp}`, 5, 10 * 60 * 1000);
    if (!ipLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many subscription attempts. Please wait a few minutes before trying again.",
          retryAfterMs: ipLimit.resetMs,
        },
        { status: 429 }
      );
    }

    // 2. Parse request payload
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    // 3. Bot protection: Honeypot check
    if (body.website && String(body.website).trim().length > 0) {
      console.warn(`[BOT REJECTED] Newsletter honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json(
        { success: false, error: "Automated submission rejected." },
        { status: 400 }
      );
    }

    // 4. Schema validation
    const parseResult = newsletterSubscribeSchema.safeParse(body);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0] || "Invalid input";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, name, consentSource } = parseResult.data;

    // 5. Subscribe
    const result = await subscribe({ email, name, consentSource });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        alreadySubscribed: result.alreadySubscribed,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Newsletter subscription error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your subscription. Please try again.",
      },
      { status: 500 }
    );
  }
}
