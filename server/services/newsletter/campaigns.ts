import { db } from "@/server/db";
import { CampaignStatus, SubscriberStatus, Prisma } from "@prisma/client";
import { CampaignInput } from "@/lib/validations/newsletter";
import { generateSignedToken } from "@/lib/tokens";
import { sendCampaignEmail } from "@/server/services/email";
import { getSiteUrl } from "./subscribers";

/**
 * Strips HTML tags to produce a clean plain-text fallback for email clients.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Creates a new newsletter campaign draft.
 */
export async function createCampaign(input: CampaignInput) {
  return db.newsletterCampaign.create({
    data: {
      title: input.title,
      subject: input.subject,
      preheader: input.preheader || null,
      body: input.body,
      status: input.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
      scheduledAt: input.scheduledAt || null,
    },
  });
}

/**
 * Updates an existing newsletter campaign.
 */
export async function updateCampaign(id: string, input: Partial<CampaignInput>) {
  const existing = await db.newsletterCampaign.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Campaign not found");
  }

  if (existing.status === CampaignStatus.SENT) {
    throw new Error("Cannot edit a campaign that has already been sent");
  }

  return db.newsletterCampaign.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.subject !== undefined && { subject: input.subject }),
      ...(input.preheader !== undefined && { preheader: input.preheader || null }),
      ...(input.body !== undefined && { body: input.body }),
      ...(input.scheduledAt !== undefined && {
        scheduledAt: input.scheduledAt || null,
        status: input.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
      }),
    },
  });
}

/**
 * Deletes a draft or cancelled campaign.
 */
export async function deleteCampaign(id: string) {
  const existing = await db.newsletterCampaign.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Campaign not found");
  }

  if (existing.status === CampaignStatus.SENT) {
    throw new Error("Cannot delete a campaign that has already been dispatched");
  }

  return db.newsletterCampaign.delete({
    where: { id },
  });
}

export interface GetCampaignsQuery {
  status?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Retrieves paginated campaigns.
 */
export async function getCampaigns({
  status,
  page = 1,
  pageSize = 20,
}: GetCampaignsQuery = {}) {
  const where: Prisma.NewsletterCampaignWhereInput = {};

  if (status && status !== "ALL" && Object.values(CampaignStatus).includes(status as CampaignStatus)) {
    where.status = status as CampaignStatus;
  }

  const skip = (Math.max(1, page) - 1) * pageSize;

  const [campaigns, total, statusCountsRaw] = await Promise.all([
    db.newsletterCampaign.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    }),
    db.newsletterCampaign.count({ where }),
    db.newsletterCampaign.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const statusCounts: Record<string, number> = {
    ALL: 0,
    DRAFT: 0,
    SCHEDULED: 0,
    SENT: 0,
    CANCELLED: 0,
  };

  statusCountsRaw.forEach((sc) => {
    statusCounts[sc.status] = sc._count.status;
    statusCounts.ALL += sc._count.status;
  });

  return {
    campaigns,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    statusCounts,
  };
}

/**
 * Retrieves a single campaign with delivery metrics.
 */
export async function getCampaignById(id: string) {
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id },
    include: {
      deliveries: {
        orderBy: { sentAt: "desc" },
        take: 50,
      },
      _count: {
        select: { deliveries: true },
      },
    },
  });

  if (!campaign) return null;

  // Aggregate delivery status counts
  const deliveryStats = await db.emailDelivery.groupBy({
    by: ["status"],
    where: { campaignId: id },
    _count: { status: true },
  });

  const statsMap: Record<string, number> = {
    SENT: 0,
    DELIVERED: 0,
    BOUNCED: 0,
    FAILED: 0,
  };

  deliveryStats.forEach((s) => {
    statsMap[s.status] = s._count.status;
  });

  return {
    ...campaign,
    deliveryStats: statsMap,
  };
}

/**
 * Dispatches a test send to an authorized team member or reviewer.
 */
export async function sendTestCampaign(campaignId: string, testRecipientEmail: string) {
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  const siteUrl = getSiteUrl();
  const testUnsubToken = generateSignedToken(testRecipientEmail, "unsubscribe", 24);
  const testUnsubscribeUrl = `${siteUrl}/unsubscribe?token=${testUnsubToken}`;

  const plainText = stripHtml(campaign.body);

  const result = await sendCampaignEmail({
    to: testRecipientEmail.trim(),
    subject: `[TEST PREVIEW] ${campaign.subject}`,
    preheader: campaign.preheader,
    bodyHtml: campaign.body,
    bodyText: plainText,
    unsubscribeUrl: testUnsubscribeUrl,
    campaignId: campaign.id,
  });

  return result;
}

/**
 * Schedules a campaign for dispatch.
 */
export async function scheduleCampaign(campaignId: string, scheduledAt: Date) {
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status === CampaignStatus.SENT) {
    throw new Error("Cannot schedule an already sent campaign");
  }

  return db.newsletterCampaign.update({
    where: { id: campaignId },
    data: {
      status: CampaignStatus.SCHEDULED,
      scheduledAt,
    },
  });
}

/**
 * Cancels a scheduled or draft campaign.
 */
export async function cancelCampaign(campaignId: string) {
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status === CampaignStatus.SENT) {
    throw new Error("Cannot cancel an already dispatched campaign");
  }

  return db.newsletterCampaign.update({
    where: { id: campaignId },
    data: {
      status: CampaignStatus.CANCELLED,
    },
  });
}

/**
 * Dispatches a campaign immediately to all CONFIRMED subscribers.
 * Enforces strict suppression rules: PENDING and UNSUBSCRIBED subscribers are completely excluded.
 */
export async function sendCampaignNow(campaignId: string) {
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status === CampaignStatus.SENT) {
    throw new Error("This campaign has already been dispatched");
  }

  // Query only CONFIRMED subscribers
  const recipients = await db.newsletterSubscriber.findMany({
    where: { status: SubscriberStatus.CONFIRMED },
    select: { id: true, email: true, name: true },
  });

  if (recipients.length === 0) {
    throw new Error("No active confirmed subscribers found to receive this campaign.");
  }

  const siteUrl = getSiteUrl();
  const plainText = stripHtml(campaign.body);

  let successCount = 0;
  let failCount = 0;

  // Process sends sequentially or in controlled concurrency
  for (const recipient of recipients) {
    try {
      const unsubToken = generateSignedToken(recipient.email, "unsubscribe", 8760);
      const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${unsubToken}`;

      const res = await sendCampaignEmail({
        to: recipient.email,
        subject: campaign.subject,
        preheader: campaign.preheader,
        bodyHtml: campaign.body,
        bodyText: plainText,
        unsubscribeUrl,
        campaignId: campaign.id,
      });

      if (res.success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (sendErr) {
      console.error(`Failed to send campaign to ${recipient.email}:`, sendErr);
      failCount++;
    }
  }

  // Update campaign to SENT
  const updatedCampaign = await db.newsletterCampaign.update({
    where: { id: campaignId },
    data: {
      status: CampaignStatus.SENT,
      sentAt: new Date(),
    },
  });

  return {
    success: true as const,
    campaign: updatedCampaign,
    totalRecipients: recipients.length,
    successCount,
    failCount,
  };
}

/**
 * Returns audience metrics and delivery statistics for the operations console.
 */
export async function getCampaignMetrics() {
  const [
    subscriberCountsRaw,
    campaignCountsRaw,
    deliveryCountsRaw,
    recentDeliveries,
  ] = await Promise.all([
    db.newsletterSubscriber.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    db.newsletterCampaign.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    db.emailDelivery.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    db.emailDelivery.findMany({
      orderBy: { sentAt: "desc" },
      take: 20,
      include: {
        campaign: {
          select: { title: true, subject: true },
        },
      },
    }),
  ]);

  const subscribers: Record<string, number> = {
    TOTAL: 0,
    CONFIRMED: 0,
    PENDING: 0,
    UNSUBSCRIBED: 0,
  };
  subscriberCountsRaw.forEach((sc) => {
    subscribers[sc.status] = sc._count.status;
    subscribers.TOTAL += sc._count.status;
  });

  const campaigns: Record<string, number> = {
    TOTAL: 0,
    DRAFT: 0,
    SCHEDULED: 0,
    SENT: 0,
    CANCELLED: 0,
  };
  campaignCountsRaw.forEach((cc) => {
    campaigns[cc.status] = cc._count.status;
    campaigns.TOTAL += cc._count.status;
  });

  const deliveries: Record<string, number> = {
    TOTAL: 0,
    SENT: 0,
    DELIVERED: 0,
    BOUNCED: 0,
    FAILED: 0,
  };
  deliveryCountsRaw.forEach((dc) => {
    deliveries[dc.status] = dc._count.status;
    deliveries.TOTAL += dc._count.status;
  });

  return {
    subscribers,
    campaigns,
    deliveries,
    recentDeliveries,
  };
}
