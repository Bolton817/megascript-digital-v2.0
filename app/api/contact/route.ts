import { NextRequest, NextResponse } from "next/server";
import { contactEnquirySchema } from "@/lib/validations/contact";
import { checkRateLimit, getIdempotentResult, setIdempotentResult } from "@/lib/rate-limit";
import { createLead } from "@/server/services/crm/leads";
import {
  sendInternalLeadNotification,
  sendVisitorLeadAcknowledgement,
} from "@/server/services/email";

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction & rate limiting (5 submissions per 10 minutes)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const ipLimit = checkRateLimit(`ip:${clientIp}`, 5, 10 * 60 * 1000);
    if (!ipLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many enquiries submitted from this network. Please wait a few minutes before trying again.",
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

    // 3. Schema validation
    const parseResult = contactEnquirySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields correctly.",
          fieldErrors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 4. Bot protection: Honeypot check
    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn(`[BOT REJECTED] Honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json(
        { success: false, error: "Automated submission rejected." },
        { status: 400 }
      );
    }

    // 5. Bot protection: Minimum elapsed time threshold (>= 2000ms)
    const elapsedMs = Date.now() - data.timestamp;
    if (elapsedMs < 2000) {
      console.warn(
        `[BOT REJECTED] Submission too fast (${elapsedMs}ms) from IP: ${clientIp}`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Submission completed suspiciously quickly. Please take a moment to review your details.",
        },
        { status: 400 }
      );
    }

    // 6. Email rate limiting (3 submissions per 10 minutes per email)
    const emailLimit = checkRateLimit(`email:${data.email}`, 3, 10 * 60 * 1000);
    if (!emailLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Multiple enquiries received from this email address. Our team is already reviewing your request.",
          retryAfterMs: emailLimit.resetMs,
        },
        { status: 429 }
      );
    }

    // 7. Idempotency check
    if (data.idempotencyKey) {
      const cached = getIdempotentResult<{
        success: boolean;
        referenceCode: string;
        message: string;
      }>(data.idempotencyKey);

      if (cached) {
        return NextResponse.json(cached, { status: 200 });
      }
    }

    // 8. Transactionally create Lead record in database
    const { lead, isDuplicate } = await createLead(data);

    // 9. Dispatch emails (only for new leads, or duplicate logging)
    if (!isDuplicate) {
      try {
        await Promise.allSettled([
          sendInternalLeadNotification({
            id: lead.id,
            referenceCode: lead.referenceCode,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            topic: lead.topic,
            message: lead.message,
            landingPage: lead.landingPage,
            utmAttribution: {
              utmSource: data.utmSource,
              utmMedium: data.utmMedium,
              utmCampaign: data.utmCampaign,
            },
          }),
          sendVisitorLeadAcknowledgement({
            referenceCode: lead.referenceCode,
            name: lead.name,
            email: lead.email,
            topic: lead.topic,
          }),
        ]);
      } catch (emailErr) {
        console.error("Non-fatal error dispatching lead notification emails:", emailErr);
      }
    }

    const responsePayload = {
      success: true,
      referenceCode: lead.referenceCode,
      message:
        "Thank you! Your enquiry has been received. A technology lead will review your project and respond within 24 business hours.",
    };

    // 10. Cache idempotency result for 5 minutes
    if (data.idempotencyKey) {
      setIdempotentResult(data.idempotencyKey, responsePayload, 5 * 60 * 1000);
    }

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    console.error("Unhandled error in /api/contact:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A server error occurred while processing your enquiry. Please try again shortly or email us directly at info@megascriptdigital.co.ke.",
      },
      { status: 500 }
    );
  }
}
