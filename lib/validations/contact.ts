import { z } from "zod";

export const CONTACT_TOPICS = [
  "Web Development & SEO",
  "Web Application Development",
  "Mobile Application Development",
  "Graphic Design",
  "Video Editing",
  "Google Maps Visibility",
  "Business Coaching",
  "Fortress / Software Products",
  "General Consultation / Other",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

// Relaxed international phone regex (allows + prefix, spaces, dashes, parentheses, 7-18 digits)
const phoneRegex = /^(\+?[0-9\s\-()]{7,18})?$/;

export const contactEnquirySchema = z.object({
  name: z
    .string({ required_error: "Please enter your name" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer"),

  email: z
    .string({ required_error: "Please enter your email address" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(120, "Email must be 120 characters or fewer"),

  phone: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined))
    .refine(
      (val) => !val || phoneRegex.test(val),
      "Please enter a valid phone number (e.g. +254 712 345 678)"
    ),

  topic: z.enum(CONTACT_TOPICS, {
    errorMap: () => ({ message: "Please select an enquiry topic" }),
  }),

  message: z
    .string({ required_error: "Please provide a short description of your project or enquiry" })
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be 2,000 characters or fewer"),

  consent: z
    .boolean({ required_error: "You must confirm that you consent to our privacy policy" })
    .refine((val) => val === true, {
      message: "You must consent to the processing of your enquiry per our privacy policy",
    }),

  // Spam protection: honeypot field (must be left empty by human users)
  honeypot: z.string().optional().default(""),

  // Spam protection: client timestamp on form load (must be >= 2000ms old upon submit)
  timestamp: z.number({ required_error: "Form session timestamp missing" }),

  // Idempotency token to guard against accidental double submissions
  idempotencyKey: z.string().optional(),

  // Source attribution fields
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
  landingPage: z.string().max(500).optional(),
});

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;
