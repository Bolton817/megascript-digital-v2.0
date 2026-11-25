import { db } from "@/server/db";
import { CampaignStatus } from "@prisma/client";

export interface CampaignOutcomeData {
  timeframe: string;
  totalCampaigns: number;
  sentCampaignsCount: number;
  scheduledCount: number;
  draftCount: number;
  totalRecipientsTargeted: number;
  totalDelivered: number;
  totalBounced: number;
  totalFailed: number;
  overallDeliveryRate: number;
  campaigns: Array<{
    id: string;
    title: string;
    subject: string;
    status: CampaignStatus;
    sentAt: Date | null;
    scheduledAt: Date | null;
    recipientsCount: number;
    deliveredCount: number;
    bouncedCount: number;
    failedCount: number;
    deliveryRate: number;
  }>;
}

export async function getCampaignOutcomeAnalytics(timeframeDays: number = 90): Promise<CampaignOutcomeData> {
  const since = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);

  const campaigns = await db.newsletterCampaign.findMany({
    where: {
      createdAt: { gte: since },
    },
    include: {
      deliveries: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let totalRecipients = 0;
  let totalDelivered = 0;
  let totalBounced = 0;
  let totalFailed = 0;

  const campaignRows = campaigns.map((c) => {
    let delivered = 0;
    let bounced = 0;
    let failed = 0;

    c.deliveries.forEach((d) => {
      if (d.status === "DELIVERED" || d.status === "SENT") delivered++;
      else if (d.status === "BOUNCED") bounced++;
      else if (d.status === "FAILED") failed++;
    });

    const recipientCount = c.deliveries.length;
    totalRecipients += recipientCount;
    totalDelivered += delivered;
    totalBounced += bounced;
    totalFailed += failed;

    const deliveryRate = recipientCount > 0 ? Number(((delivered / recipientCount) * 100).toFixed(1)) : 0;

    return {
      id: c.id,
      title: c.title,
      subject: c.subject,
      status: c.status,
      sentAt: c.sentAt,
      scheduledAt: c.scheduledAt,
      recipientsCount: recipientCount,
      deliveredCount: delivered,
      bouncedCount: bounced,
      failedCount: failed,
      deliveryRate,
    };
  });

  const overallDeliveryRate =
    totalRecipients > 0 ? Number(((totalDelivered / totalRecipients) * 100).toFixed(1)) : 100;

  return {
    timeframe: `Past ${timeframeDays} Days`,
    totalCampaigns: campaigns.length,
    sentCampaignsCount: campaigns.filter((c) => c.status === CampaignStatus.SENT).length,
    scheduledCount: campaigns.filter((c) => c.status === CampaignStatus.SCHEDULED).length,
    draftCount: campaigns.filter((c) => c.status === CampaignStatus.DRAFT).length,
    totalRecipientsTargeted: totalRecipients,
    totalDelivered,
    totalBounced,
    totalFailed,
    overallDeliveryRate,
    campaigns: campaignRows,
  };
}
