import { db } from "@/server/db";
import { generateSignedToken, verifySignedToken } from "@/lib/tokens";
import {
  sendNewsletterConfirmationEmail,
  sendNewsletterWelcomeEmail,
} from "@/server/services/email";
import { SubscriberStatus, Prisma } from "@prisma/client";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.URL) {
    return process.env.URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export interface SubscribeParams {
  email: string;
  name?: string;
  consentSource?: string;
}

export interface SubscribeResult {
  success: boolean;
  message: string;
  alreadySubscribed?: boolean;
  subscriberId?: string;
}

/**
 * Initiates double opt-in subscription for a contact.
 * Enforces Kenya DPA 2019 explicit consent and double opt-in workflow.
 */
export async function subscribe({
  email,
  name,
  consentSource = "footer",
}: SubscribeParams): Promise<SubscribeResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name ? name.trim() : null;

  // Check if subscriber already exists
  const existing = await db.newsletterSubscriber.findUnique({
    where: { normalizedEmail },
  });

  if (existing) {
    if (existing.status === SubscriberStatus.CONFIRMED) {
      return {
        success: true,
        alreadySubscribed: true,
        message: "You are already subscribed to our newsletter.",
        subscriberId: existing.id,
      };
    }

    // If previously UNSUBSCRIBED or PENDING, reset to PENDING and refresh details
    await db.newsletterSubscriber.update({
      where: { id: existing.id },
      data: {
        name: trimmedName || existing.name,
        status: SubscriberStatus.PENDING,
        consentSource,
        consentTimestamp: new Date(),
        unsubscribeTimestamp: null,
      },
    });
  } else {
    // Create new subscriber in PENDING state
    await db.newsletterSubscriber.create({
      data: {
        email: email.trim(),
        normalizedEmail,
        name: trimmedName,
        status: SubscriberStatus.PENDING,
        consentSource,
        consentTimestamp: new Date(),
      },
    });
  }

  // Generate 72-hour signed confirmation token
  const token = generateSignedToken(normalizedEmail, "confirm", 72);
  const siteUrl = getSiteUrl();
  const confirmationUrl = `${siteUrl}/api/newsletter/confirm?token=${token}`;

  // Dispatch confirmation email
  await sendNewsletterConfirmationEmail({
    email: email.trim(),
    name: trimmedName || undefined,
    confirmUrl: confirmationUrl,
  });

  return {
    success: true,
    message: "Confirmation link sent. Please check your inbox to activate your subscription.",
  };
}

/**
 * Validates a double opt-in token, marks the subscriber CONFIRMED, and sends the welcome onboarding email.
 */
export async function confirmSubscription(token: string): Promise<{
  success: boolean;
  email?: string;
  alreadyConfirmed?: boolean;
  error?: string;
}> {
  const verification = verifySignedToken(token, "confirm");
  if (!verification.valid || !verification.email) {
    return {
      success: false,
      error: verification.error || "Invalid or expired confirmation link.",
    };
  }

  const normalizedEmail = verification.email;
  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { normalizedEmail },
  });

  if (!subscriber) {
    return {
      success: false,
      error: "Subscriber account not found. Please subscribe again.",
    };
  }

  if (subscriber.status === SubscriberStatus.CONFIRMED) {
    return {
      success: true,
      alreadyConfirmed: true,
      email: subscriber.email,
    };
  }

  // Update status to CONFIRMED
  await db.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      status: SubscriberStatus.CONFIRMED,
      updatedAt: new Date(),
    },
  });

  // Generate unsubscribe link for welcome onboarding email
  const siteUrl = getSiteUrl();
  const unsubToken = generateSignedToken(subscriber.email, "unsubscribe", 8760);
  const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${unsubToken}`;

  // Send onboarding welcome email
  await sendNewsletterWelcomeEmail({
    email: subscriber.email,
    name: subscriber.name || undefined,
    unsubscribeUrl,
  });

  return {
    success: true,
    email: subscriber.email,
  };
}

/**
 * Suppresses a subscriber by marking their status as UNSUBSCRIBED.
 * Accepts either a signed token (from email link) or an email address (from admin or web form).
 */
export async function unsubscribe(
  tokenOrEmail: string,
  _reason?: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  let targetEmail: string;

  if (tokenOrEmail.includes(".")) {
    const verification = verifySignedToken(tokenOrEmail, "unsubscribe");
    if (!verification.valid || !verification.email) {
      return {
        success: false,
        error: verification.error || "Invalid unsubscribe link.",
      };
    }
    targetEmail = verification.email;
  } else {
    targetEmail = tokenOrEmail.trim().toLowerCase();
  }

  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { normalizedEmail: targetEmail },
  });

  if (!subscriber) {
    // If not found, return success idempotently
    return { success: true, email: targetEmail };
  }

  if (subscriber.status !== SubscriberStatus.UNSUBSCRIBED) {
    await db.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: SubscriberStatus.UNSUBSCRIBED,
        unsubscribeTimestamp: new Date(),
      },
    });
  }

  return {
    success: true,
    email: subscriber.email,
  };
}

export interface GetSubscribersQuery {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Retrieves a paginated list of subscribers for the operations console.
 */
export async function getSubscribers({
  status,
  search,
  page = 1,
  pageSize = 20,
}: GetSubscribersQuery = {}) {
  const where: Prisma.NewsletterSubscriberWhereInput = {};

  if (status && status !== "ALL" && Object.values(SubscriberStatus).includes(status as SubscriberStatus)) {
    where.status = status as SubscriberStatus;
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  const skip = (Math.max(1, page) - 1) * pageSize;

  const [subscribers, total, counts] = await Promise.all([
    db.newsletterSubscriber.findMany({
      where,
      orderBy: { consentTimestamp: "desc" },
      skip,
      take: pageSize,
    }),
    db.newsletterSubscriber.count({ where }),
    db.newsletterSubscriber.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const statusCounts: Record<string, number> = {
    ALL: 0,
    PENDING: 0,
    CONFIRMED: 0,
    UNSUBSCRIBED: 0,
  };

  counts.forEach((c) => {
    statusCounts[c.status] = c._count.status;
    statusCounts.ALL += c._count.status;
  });

  return {
    subscribers,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    statusCounts,
  };
}

/**
 * Exports all newsletter subscribers to CSV format.
 */
export async function exportSubscribersCsv(): Promise<string> {
  const subscribers = await db.newsletterSubscriber.findMany({
    orderBy: { consentTimestamp: "desc" },
  });

  const headers = [
    "ID",
    "Email",
    "Name",
    "Status",
    "Consent Source",
    "Consent Timestamp",
    "Unsubscribed At",
    "Updated At",
  ];

  const escapeCsv = (str: string | null | undefined) => {
    if (str === null || str === undefined) return "";
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = subscribers.map((s) => [
    escapeCsv(s.id),
    escapeCsv(s.email),
    escapeCsv(s.name),
    escapeCsv(s.status),
    escapeCsv(s.consentSource),
    escapeCsv(s.consentTimestamp.toISOString()),
    escapeCsv(s.unsubscribeTimestamp ? s.unsubscribeTimestamp.toISOString() : ""),
    escapeCsv(s.updatedAt.toISOString()),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
