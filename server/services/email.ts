export interface SendEmailOptions {
  to: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
}

// In-memory record for local dev testing when Brevo key is not configured
export const lastDevEmailDispatched: {
  to: string;
  subject: string;
  code?: string;
  sentAt: string;
} | null = null;

export async function sendEmail({
  to,
  subject,
  textContent,
  htmlContent,
}: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "info@megascriptdigital.co.ke";
  const senderName = process.env.BREVO_SENDER_NAME || "MegaScript Digital";

  if (!brevoApiKey) {
    // Development / test fallback transport
    console.log(`\n========================================`);
    console.log(`[DEV EMAIL DISPATCH]`);
    console.log(`To: ${to}`);
    console.log(`From: ${senderName} <${senderEmail}>`);
    console.log(`Subject: ${subject}`);
    console.log(`----------------------------------------`);
    console.log(textContent);
    console.log(`========================================\n`);

    return {
      success: true,
      messageId: `dev-${Date.now()}`,
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
      return { success: false, error: "Email delivery provider error" };
    }

    const result = (await response.json()) as { messageId?: string };
    return { success: true, messageId: result.messageId };
  } catch (err: any) {
    console.error("Brevo transport exception:", err.message);
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
