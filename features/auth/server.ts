import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { db } from "@/server/db";
import { checkEmailAllowlisted } from "./allowlist";
import { sendEmail, formatOtpEmail } from "@/server/services/email";
import { logAuditEvent } from "@/server/services/audit";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "default-better-auth-secret-min-32-chars-long",
  user: {
    additionalFields: {
      normalizedEmail: {
        type: "string",
        required: false,
      },
      displayName: {
        type: "string",
        required: false,
      },
      isProtected: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days max absolute
    updateAge: 60 * 15,          // 15 minutes throttle
    cookieCache: {
      enabled: false,            // Strictly disabled to enforce server-side session checks
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // 5 minutes validity
      async sendVerificationOTP({ email, otp, type }) {
        const normalized = email.toLowerCase().trim();
        const allowlistCheck = await checkEmailAllowlisted(normalized);

        if (!allowlistCheck.isAllowed) {
          console.warn(`[AUTH] Non-allowlisted email attempted sign-in OTP: ${normalized}`);
          await logAuditEvent({
            action: "OTP_REJECTED_UNLISTED_EMAIL",
            targetType: "AUTH",
            metadata: { attemptedEmail: normalized },
          });
          // Return cleanly without dispatching OTP to prevent email enumeration
          return;
        }

        // Format and send OTP email (via Brevo or dev logger)
        const emailContent = formatOtpEmail(otp);
        await sendEmail({
          to: normalized,
          subject: emailContent.subject,
          textContent: emailContent.textContent,
          htmlContent: emailContent.htmlContent,
        });

        await logAuditEvent({
          actorId: allowlistCheck.user?.id,
          action: "OTP_DISPATCHED",
          targetType: "AUTH",
          metadata: { email: normalized, type },
        });
      },
    }),
  ],
});
