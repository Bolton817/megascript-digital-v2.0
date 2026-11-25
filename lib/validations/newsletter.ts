import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(120, "Email must be 120 characters or fewer"),

  name: z
    .string()
    .trim()
    .max(100, "Name must be 100 characters or fewer")
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),

  consentSource: z
    .string()
    .trim()
    .max(50)
    .default("footer"),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

export const campaignSchema = z.object({
  title: z
    .string({ required_error: "Campaign title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or fewer"),

  subject: z
    .string({ required_error: "Email subject line is required" })
    .trim()
    .min(5, "Subject line must be at least 5 characters")
    .max(150, "Subject line must be 150 characters or fewer"),

  preheader: z
    .string()
    .trim()
    .max(150, "Preheader must be 150 characters or fewer")
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),

  body: z
    .string({ required_error: "Email body content is required" })
    .trim()
    .min(20, "Email body must contain at least 20 characters")
    .max(20000, "Email body must be 20,000 characters or fewer"),

  scheduledAt: z
    .string()
    .datetime({ message: "Invalid scheduled date format" })
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
