import { db } from "@/server/db";

export interface SendEmailOptions {
  to: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
  templateId?: string;
  messageType?: "TRANSACTIONAL" | "CAMPAIGN";
  campaignId?: string | null;
}

// In-memory record for local dev testing when Brevo key is not configured
export let lastDevEmailDispatched: {
  to: string;
  subject: string;
  code?: string;
  sentAt: string;
  payload?: any;
} | null = null;

export const devEmailHistory: Array<{
  to: string;
  subject: string;
  textContent: string;
  sentAt: string;
  templateId?: string;
  messageType?: string;
}> = [];

export async function sendEmail({
  to,
  subject,
  textContent,
  htmlContent,
  templateId = "generic",
  messageType = "TRANSACTIONAL",
  campaignId = null,
}: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "info@megascriptdigital.co.ke";
  const senderName = process.env.BREVO_SENDER_NAME || "MegaScript Digital";

  if (!brevoApiKey) {
    // Development / test fallback transport
    console.log(`\n========================================`);
    console.log(`[DEV EMAIL DISPATCH] [${messageType}] [${templateId}]`);
    console.log(`To: ${to}`);
    console.log(`From: ${senderName} <${senderEmail}>`);
    console.log(`Subject: ${subject}`);
    console.log(`----------------------------------------`);
    console.log(textContent);
    console.log(`========================================\n`);

    const devMessageId = `dev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const record = {
      to,
      subject,
      textContent,
      sentAt: new Date().toISOString(),
      templateId,
      messageType,
    };
    lastDevEmailDispatched = record;
    devEmailHistory.push(record);

    // Persist delivery record in database
    try {
      await db.emailDelivery.create({
        data: {
          recipientEmail: to,
          templateId,
          messageType,
          campaignId,
          providerId: devMessageId,
          status: "SENT",
          sentAt: new Date(),
        },
      });
    } catch (dbErr) {
      console.warn("Non-fatal: could not persist EmailDelivery record in dev mode:", dbErr);
    }

    return {
      success: true,
      messageId: devMessageId,
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent: htmlContent || `<pre style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">${textContent}</pre>`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", errorData);
      try {
        await db.emailDelivery.create({
          data: {
            recipientEmail: to,
            templateId,
            messageType,
            campaignId,
            providerId: null,
            status: "FAILED",
            sentAt: new Date(),
          },
        });
      } catch {}
      return { success: false, error: "Email delivery provider error" };
    }

    const result = (await response.json()) as { messageId?: string };

    try {
      await db.emailDelivery.create({
        data: {
          recipientEmail: to,
          templateId,
          messageType,
          campaignId,
          providerId: result.messageId || null,
          status: "SENT",
          sentAt: new Date(),
        },
      });
    } catch {}

    return { success: true, messageId: result.messageId };
  } catch (err: any) {
    console.error("Brevo transport exception:", err.message);
    try {
      await db.emailDelivery.create({
        data: {
          recipientEmail: to,
          templateId,
          messageType,
          campaignId,
          providerId: null,
          status: "FAILED",
          sentAt: new Date(),
        },
      });
    } catch {}
    return { success: false, error: "Failed to dispatch email" };
  }
}

export function formatOtpEmail(otp: string): { subject: string; textContent: string; htmlContent: string } {
  const subject = "Your MegaScript Digital /master sign-in code";
  const textContent = `Use the one-time verification code below to sign in to the MegaScript Digital operations dashboard:

${otp}

This code expires in 5 minutes and can only be used once. If you did not request this sign-in code, you can safely ignore this email—no access has been granted.

MegaScript Digital Security`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #0f172a; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="display: flex; align-items: center; margin-bottom: 24px;">
        <span style="font-size: 18px; font-weight: bold; color: #0f172a;">MegaScript <span style="color: #0284c7;">Digital</span></span>
      </div>
      <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Your Operations Sign-In Code</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
        Use the one-time verification code below to sign in to the MegaScript Digital operations dashboard:
      </p>
      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0284c7;">${otp}</span>
      </div>
      <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 20px;">
        This code expires in 5 minutes and can only be used once. If you did not request this sign-in code, you can safely ignore this email—no access has been granted.
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
      <p style="font-size: 11px; color: #94a3b8; margin: 0;">
        MegaScript Digital Security &bull; info@megascriptdigital.co.ke
      </p>
    </div>
  `;

  return { subject, textContent, htmlContent };
}

export interface LeadEmailPayload {
  id: string;
  referenceCode: string;
  name: string;
  email: string;
  phone?: string | null;
  topic: string;
  message: string;
  landingPage?: string | null;
  utmAttribution?: {
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
  } | null;
}

/**
 * Dispatches an internal notification to the operations inbox (info@megascriptdigital.co.ke)
 * Task 61 & Sheet 069.
 */
export async function sendInternalLeadNotification(lead: LeadEmailPayload) {
  const recipient =
    process.env.INTERNAL_NOTIFICATION_EMAIL || "info@megascriptdigital.co.ke";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://megascriptdigital.co.ke";
  const leadAdminUrl = `${baseUrl}/master/leads/${lead.id}`;

  const subject = `[New Enquiry] [${lead.referenceCode}] ${lead.topic} - ${lead.name}`;

  const textContent = `New business enquiry received via website contact form.

Reference: ${lead.referenceCode}
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || "Not provided"}
Topic: ${lead.topic}

Message:
${lead.message}

Attribution:
Source: ${lead.utmAttribution?.utmSource || "Direct / None"}
Medium: ${lead.utmAttribution?.utmMedium || "N/A"}
Campaign: ${lead.utmAttribution?.utmCampaign || "N/A"}
Landing Page: ${lead.landingPage || "/contact"}

View and manage this lead in Operations Console:
${leadAdminUrl}
`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #0f172a; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
        <span style="font-size: 18px; font-weight: bold; color: #0f172a;">MegaScript <span style="color: #0284c7;">Digital</span></span>
        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #0284c7; font-weight: 700; margin-top: 4px;">CRM Operations Notification</span>
      </div>

      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <span style="font-size: 12px; font-weight: 600; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;">New Customer Enquiry</span>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 4px 0 0 0;">${lead.topic}</h2>
        <span style="font-family: monospace; font-size: 13px; color: #0284c7; font-weight: 700;">Ref: ${lead.referenceCode}</span>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 120px; font-weight: 500;">Client Name:</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #0284c7; text-decoration: none;">${lead.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Phone:</td>
          <td style="padding: 8px 0; color: #0f172a;">${lead.phone || '<span style="color: #94a3b8;">Not provided</span>'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Campaign Source:</td>
          <td style="padding: 8px 0; color: #0f172a;">${lead.utmAttribution?.utmSource || "Direct / Organic"}</td>
        </tr>
      </table>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 28px;">
        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-bottom: 8px;">Enquiry Message</span>
        <p style="font-size: 14px; line-height: 1.6; color: #1e293b; margin: 0; white-space: pre-wrap;">${lead.message}</p>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${leadAdminUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px;">
          Open Lead in Operations Console &rarr;
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
      <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
        MegaScript Digital Operations System &bull; Automatic notification
      </p>
    </div>
  `;

  return sendEmail({
    to: recipient,
    subject,
    textContent,
    htmlContent,
  });
}

/**
 * Dispatches a branded acknowledgement email to the visitor who submitted the enquiry.
 * Task 61 & Sheet 069.
 */
export async function sendVisitorLeadAcknowledgement(lead: {
  referenceCode: string;
  name: string;
  email: string;
  topic: string;
}) {
  const subject = `We've received your enquiry [${lead.referenceCode}] | MegaScript Digital`;

  const textContent = `Hello ${lead.name},

Thank you for contacting MegaScript Digital regarding "${lead.topic}".

We have received your enquiry and logged it under reference code: ${lead.referenceCode}.

What happens next:
A technology lead will review your requirements and respond within 24 business hours (Monday–Friday, 8:00 AM – 5:00 PM EAT). We will assess feasibility, provide preliminary technical guidance, and outline clear next steps.

If you have urgent details to add, simply reply to this email or contact us at info@megascriptdigital.co.ke quoting reference ${lead.referenceCode}.

Best regards,
MegaScript Digital Team
Nairobi, Kenya
https://megascriptdigital.co.ke
`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 36px 24px; color: #0f172a; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
        <span style="font-size: 20px; font-weight: bold; color: #0f172a;">MegaScript <span style="color: #0284c7;">Digital</span></span>
      </div>

      <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Enquiry Received</h1>

      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
        Hello ${lead.name}, thank you for reaching out regarding <strong>${lead.topic}</strong>.
      </p>

      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
        <span style="font-size: 12px; font-weight: 600; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Your Enquiry Reference Code</span>
        <span style="font-family: monospace; font-size: 24px; font-weight: 800; color: #0284c7; letter-spacing: 2px;">${lead.referenceCode}</span>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 8px;">What happens next:</h3>
        <ul style="font-size: 14px; line-height: 1.6; color: #475569; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 6px;">A technology lead will review your project requirements and scope.</li>
          <li style="margin-bottom: 6px;">You will receive a tailored response within <strong>24 business hours</strong> (Monday–Friday, 8:00 AM – 5:00 PM EAT).</li>
          <li>We will provide transparent architectural guidance, realistic timeline estimates, and honest feedback.</li>
        </ul>
      </div>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #64748b; line-height: 1.5;">
        Have additional details or attachments? Reply directly to this email or write to <a href="mailto:info@megascriptdigital.co.ke" style="color: #0284c7; text-decoration: none;">info@megascriptdigital.co.ke</a> quoting your reference code <strong>${lead.referenceCode}</strong>.
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
      <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
        &copy; ${new Date().getFullYear()} MegaScript Digital &bull; Nairobi, Kenya &bull; info@megascriptdigital.co.ke
      </p>
    </div>
  `;

  return sendEmail({
    to: lead.email,
    subject,
    textContent,
    htmlContent,
    templateId: "lead-acknowledgement",
    messageType: "TRANSACTIONAL",
  });
}

/**
 * Dispatches a double opt-in confirmation email to a new newsletter subscriber.
 * Task 64 & Sheet 070.
 */
export async function sendNewsletterConfirmationEmail({
  email,
  name,
  confirmUrl,
}: {
  email: string;
  name?: string | null;
  confirmUrl: string;
}) {
  const subject = "Confirm your subscription | MegaScript Digital";
  const recipientGreeting = name ? `Hello ${name},` : "Hello,";

  const textContent = `${recipientGreeting}

Thank you for your interest in MegaScript Digital.

Please confirm your newsletter subscription by opening the secure link below:
${confirmUrl}

This confirmation link expires in 72 hours. Once confirmed, you will receive straightforward digital engineering guides, software architecture insights, and product updates.

If you did not make this request, you can safely ignore this email—you will not be subscribed.

Best regards,
MegaScript Digital Team
info@megascriptdigital.co.ke
https://megascriptdigital.co.ke
`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 36px 24px; color: #0f172a; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
        <span style="font-size: 20px; font-weight: bold; color: #0f172a;">MegaScript <span style="color: #0284c7;">Digital</span></span>
      </div>

      <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Confirm Your Subscription</h1>

      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
        ${recipientGreeting} thank you for subscribing. You're one step away from receiving practical technology guides, custom software strategies, and digital visibility insights.
      </p>

      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${confirmUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          Confirm Subscription &rarr;
        </a>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 20px;">
        Or copy and paste this link in your browser:<br />
        <a href="${confirmUrl}" style="color: #0284c7; word-break: break-all; font-size: 12px;">${confirmUrl}</a>
      </p>

      <div style="background-color: #f8fafc; border-radius: 10px; padding: 14px; margin-bottom: 24px; font-size: 12px; color: #64748b; line-height: 1.5;">
        <strong>Notice:</strong> This link expires in 72 hours. If you did not request this, you can ignore this email and you will not be added to our list.
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
      <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
        &copy; ${new Date().getFullYear()} MegaScript Digital &bull; Nairobi, Kenya &bull; info@megascriptdigital.co.ke
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    textContent,
    htmlContent,
    templateId: "newsletter-confirmation",
    messageType: "TRANSACTIONAL",
  });
}

/**
 * Dispatches a welcome / onboarding email once double opt-in confirmation completes.
 * Task 64 & Sheet 070.
 */
export async function sendNewsletterWelcomeEmail({
  email,
  name,
  unsubscribeUrl,
}: {
  email: string;
  name?: string | null;
  unsubscribeUrl: string;
}) {
  const subject = "Welcome to MegaScript Digital! Your subscription is active";
  const recipientGreeting = name ? `Hello ${name},` : "Hello,";

  const textContent = `${recipientGreeting}

Welcome to the MegaScript Digital newsletter! Your subscription is now active.

What you will receive:
- Practical guides on building reliable websites, web applications, and mobile apps.
- Honest architectural comparisons, performance tuning tips, and local visibility advice.
- Product updates and release notes for our independent platforms (Fortress, LeaseFlow, UzaDigital, FM Scheduler).

We respect your inbox: we publish approximately once or twice per month, with zero aggressive marketing pitches.

If you ever wish to unsubscribe, you can do so with one click:
${unsubscribeUrl}

Best regards,
MegaScript Digital Team
Nairobi, Kenya
https://megascriptdigital.co.ke
`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 36px 24px; color: #0f172a; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
        <span style="font-size: 20px; font-weight: bold; color: #0f172a;">MegaScript <span style="color: #0284c7;">Digital</span></span>
      </div>

      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <span style="font-size: 12px; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Subscription Active</span>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">Welcome aboard!</h2>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
        ${recipientGreeting} thank you for joining our community. Here is what you can look forward to:
      </p>

      <ul style="font-size: 14px; line-height: 1.6; color: #475569; padding-left: 20px; margin-bottom: 24px;">
        <li style="margin-bottom: 8px;"><strong>Practical Software Architecture:</strong> Real-world engineering insights on building scalable web and mobile systems.</li>
        <li style="margin-bottom: 8px;"><strong>Digital Visibility:</strong> Straightforward guides on search visibility, Google Business optimization, and user experience.</li>
        <li><strong>Product Milestones:</strong> Early updates on independent solutions we build and maintain.</li>
      </ul>

      <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 28px;">
        We publish approximately once or twice a month. Zero spam, zero high-pressure sales pitches.
      </p>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
      <div style="text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
        <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} MegaScript Digital &bull; Nairobi, Kenya</p>
        <p style="margin: 0;">
          No longer wish to receive these emails? <a href="${unsubscribeUrl}" style="color: #0284c7; text-decoration: underline;">Unsubscribe with one click</a>.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    textContent,
    htmlContent,
    templateId: "newsletter-welcome",
    messageType: "TRANSACTIONAL",
  });
}

/**
 * Dispatches a newsletter campaign email with mandatory unsubscribe footer.
 * Task 65 & Sheet 071.
 */
export async function sendCampaignEmail({
  to,
  subject,
  preheader,
  bodyHtml,
  bodyText,
  unsubscribeUrl,
  campaignId,
}: {
  to: string;
  subject: string;
  preheader?: string | null;
  bodyHtml: string;
  bodyText: string;
  unsubscribeUrl: string;
  campaignId: string;
}) {
  const textContent = `${preheader ? `${preheader}\n\n` : ""}${bodyText}

--------------------------------------------------
MegaScript Digital • Nairobi, Kenya
To unsubscribe, visit: ${unsubscribeUrl}
`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 24px; color: #0f172a; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      ${
        preheader
          ? `<div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>`
          : ""
      }
      <div style="margin-bottom: 28px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
        <span style="font-size: 20px; font-weight: bold; color: #0f172a;">MegaScript <span style="color: #0284c7;">Digital</span></span>
      </div>

      <div style="font-size: 15px; line-height: 1.7; color: #1e293b; margin-bottom: 32px;">
        ${bodyHtml}
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
      <div style="text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
        <p style="margin: 0 0 6px 0;">&copy; ${new Date().getFullYear()} MegaScript Digital &bull; Nairobi, Kenya</p>
        <p style="margin: 0;">
          You received this because you subscribed to updates from MegaScript Digital.<br />
          <a href="${unsubscribeUrl}" style="color: #0284c7; text-decoration: underline;">Unsubscribe from future campaigns</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    textContent,
    htmlContent,
    templateId: "campaign-broadcast",
    messageType: "CAMPAIGN",
    campaignId,
  });
}


