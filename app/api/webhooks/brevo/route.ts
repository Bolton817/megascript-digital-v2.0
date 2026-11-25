import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { SubscriberStatus } from "@prisma/client";

interface BrevoWebhookEvent {
  event: string;
  email: string;
  id?: number | string;
  "message-id"?: string;
  messageId?: string;
  date?: string;
  ts?: number;
  reason?: string;
  tag?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Optional Secret Verification
    const configuredSecret = process.env.BREVO_WEBHOOK_SECRET;
    if (configuredSecret && configuredSecret.trim().length > 0) {
      const urlSecret = req.nextUrl.searchParams.get("secret");
      const headerSecret =
        req.headers.get("x-brevo-secret") ||
        req.headers.get("x-sib-webhook-key") ||
        req.headers.get("authorization");

      const providedSecret = urlSecret || headerSecret;
      if (providedSecret !== configuredSecret) {
        console.warn("[BREVO WEBHOOK] Unauthorized webhook attempt rejected");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 2. Parse request body (can be a single object or an array of events)
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const events: BrevoWebhookEvent[] = Array.isArray(body) ? body : [body];

    for (const evt of events) {
      if (!evt || !evt.email) continue;

      const eventType = (evt.event || "").toLowerCase();
      const recipientEmail = evt.email.trim().toLowerCase();
      const messageId = evt["message-id"] || evt.messageId || (evt.id ? String(evt.id) : null);

      console.log(`[BREVO WEBHOOK] Event: ${eventType} for ${recipientEmail} (msgId: ${messageId})`);

      // 3. Update EmailDelivery record if providerId matches
      if (messageId) {
        try {
          const delivery = await db.emailDelivery.findFirst({
            where: {
              OR: [
                { providerId: messageId },
                { providerId: `<${messageId}>` },
                { providerId: messageId.replace(/[<>]/g, "") },
              ],
            },
          });

          if (delivery) {
            let mappedStatus = delivery.status;
            if (eventType === "delivered") {
              mappedStatus = "DELIVERED";
            } else if (
              eventType === "soft_bounce" ||
              eventType === "hard_bounce" ||
              eventType === "blocked" ||
              eventType === "spam"
            ) {
              mappedStatus = "BOUNCED";
            } else if (eventType === "error") {
              mappedStatus = "FAILED";
            }

            if (mappedStatus !== delivery.status) {
              await db.emailDelivery.update({
                where: { id: delivery.id },
                data: { status: mappedStatus },
              });
            }
          }
        } catch (dbErr) {
          console.warn("[BREVO WEBHOOK] Failed to update EmailDelivery status:", dbErr);
        }
      }

      // 4. Suppress subscriber on hard bounce, spam complaint, or unsubscribe
      if (
        eventType === "hard_bounce" ||
        eventType === "unsubscribe" ||
        eventType === "spam"
      ) {
        try {
          const subscriber = await db.newsletterSubscriber.findUnique({
            where: { normalizedEmail: recipientEmail },
          });

          if (subscriber && subscriber.status !== SubscriberStatus.UNSUBSCRIBED) {
            await db.newsletterSubscriber.update({
              where: { id: subscriber.id },
              data: {
                status: SubscriberStatus.UNSUBSCRIBED,
                unsubscribeTimestamp: new Date(),
              },
            });
            console.log(
              `[BREVO WEBHOOK] Automatically suppressed subscriber ${recipientEmail} due to ${eventType}`
            );
          }
        } catch (subErr) {
          console.warn("[BREVO WEBHOOK] Failed to suppress subscriber:", subErr);
        }
      }
    }

    return NextResponse.json({ received: true, count: events.length }, { status: 200 });
  } catch (err: any) {
    console.error("[BREVO WEBHOOK EXCEPTION]", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
