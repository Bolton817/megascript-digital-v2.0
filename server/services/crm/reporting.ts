import { db } from "@/server/db";
import { LeadStatus } from "@prisma/client";

export interface LeadReportingData {
  timeframe: string;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  proposalSentLeads: number;
  wonLeads: number;
  lostLeads: number;
  avgResponseHours: number | null;
  responseTimeDistribution: {
    underOneHour: number;
    oneToSixHours: number;
    sixToTwentyFourHours: number;
    overTwentyFourHours: number;
    uncontacted: number;
  };
  funnelProgression: Array<{
    stage: string;
    count: number;
    conversionRate: number;
  }>;
  sourceBreakdown: Array<{
    channel: string;
    leadsCount: number;
    wonCount: number;
    conversionRate: number;
  }>;
  campaignAttribution: Array<{
    campaign: string;
    source: string;
    leadsCount: number;
    wonCount: number;
  }>;
  staffWorkload: Array<{
    userId: string;
    userName: string;
    assignedCount: number;
    wonCount: number;
  }>;
}

export async function getLeadReportingMetrics(timeframeDays: number = 30): Promise<LeadReportingData> {
  const since = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);

  const leads = await db.lead.findMany({
    where: {
      createdAt: { gte: since },
    },
    include: {
      events: {
        orderBy: { createdAt: "asc" },
      },
      utmAttribution: true,
      assignedUser: {
        select: { id: true, name: true, displayName: true, email: true },
      },
    },
  });

  const totalLeads = leads.length;
  let newCount = 0;
  let contactedCount = 0;
  let qualifiedCount = 0;
  let proposalSentCount = 0;
  let wonCount = 0;
  let lostCount = 0;

  let totalResponseMs = 0;
  let responseCount = 0;

  const distribution = {
    underOneHour: 0,
    oneToSixHours: 0,
    sixToTwentyFourHours: 0,
    overTwentyFourHours: 0,
    uncontacted: 0,
  };

  const sourceMap = new Map<string, { channel: string; leadsCount: number; wonCount: number }>();
  const campaignMap = new Map<string, { campaign: string; source: string; leadsCount: number; wonCount: number }>();
  const staffMap = new Map<string, { userId: string; userName: string; assignedCount: number; wonCount: number }>();

  for (const lead of leads) {
    if (lead.status === LeadStatus.NEW) newCount++;
    else if (lead.status === LeadStatus.CONTACTED) contactedCount++;
    else if (lead.status === LeadStatus.QUALIFIED) qualifiedCount++;
    else if (lead.status === LeadStatus.PROPOSAL_SENT) proposalSentCount++;
    else if (lead.status === LeadStatus.WON) wonCount++;
    else if (lead.status === LeadStatus.LOST) lostCount++;

    // Calculate response time from creation to first status change or note
    const firstAction = lead.events.find(
      (e) => e.eventType === "STATUS_CHANGED" || e.eventType === "NOTE_ADDED" || e.eventType === "LEAD_ASSIGNED"
    );

    if (firstAction) {
      const diffMs = firstAction.createdAt.getTime() - lead.createdAt.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      totalResponseMs += diffMs;
      responseCount++;

      if (diffHours < 1) distribution.underOneHour++;
      else if (diffHours <= 6) distribution.oneToSixHours++;
      else if (diffHours <= 24) distribution.sixToTwentyFourHours++;
      else distribution.overTwentyFourHours++;
    } else {
      distribution.uncontacted++;
    }

    // Source breakdown
    const channel = lead.sourceChannel || "direct";
    const srcEntry = sourceMap.get(channel) || { channel, leadsCount: 0, wonCount: 0 };
    srcEntry.leadsCount++;
    if (lead.status === LeadStatus.WON) srcEntry.wonCount++;
    sourceMap.set(channel, srcEntry);

    // Campaign attribution
    const utmCamp = lead.utmAttribution?.utmCampaign || lead.utmAttribution?.firstTouchCampaign;
    if (utmCamp) {
      const utmSrc = lead.utmAttribution?.utmSource || lead.utmAttribution?.firstTouchSource || "direct";
      const campEntry = campaignMap.get(utmCamp) || { campaign: utmCamp, source: utmSrc, leadsCount: 0, wonCount: 0 };
      campEntry.leadsCount++;
      if (lead.status === LeadStatus.WON) campEntry.wonCount++;
      campaignMap.set(utmCamp, campEntry);
    }

    // Staff workload
    const staffId = lead.assignedUser?.id || "unassigned";
    const staffName = lead.assignedUser?.displayName || lead.assignedUser?.name || "Unassigned";
    const staffEntry = staffMap.get(staffId) || { userId: staffId, userName: staffName, assignedCount: 0, wonCount: 0 };
    staffEntry.assignedCount++;
    if (lead.status === LeadStatus.WON) staffEntry.wonCount++;
    staffMap.set(staffId, staffEntry);
  }

  const avgResponseHours = responseCount > 0 ? Number((totalResponseMs / responseCount / (1000 * 60 * 60)).toFixed(1)) : null;

  // Funnel progression
  const funnelStages = [
    { stage: "Total Enquiries", count: totalLeads },
    { stage: "Contacted / In Progress", count: totalLeads - newCount },
    { stage: "Qualified", count: qualifiedCount + proposalSentCount + wonCount },
    { stage: "Proposal Sent", count: proposalSentCount + wonCount },
    { stage: "Won Deals", count: wonCount },
  ];

  const funnelProgression = funnelStages.map((s, idx) => {
    const prev = idx === 0 ? s.count : funnelStages[idx - 1].count;
    const conversionRate = prev > 0 ? Number(((s.count / prev) * 100).toFixed(1)) : 0;
    return {
      stage: s.stage,
      count: s.count,
      conversionRate,
    };
  });

  const sourceBreakdown = Array.from(sourceMap.values()).map((s) => ({
    ...s,
    conversionRate: s.leadsCount > 0 ? Number(((s.wonCount / s.leadsCount) * 100).toFixed(1)) : 0,
  }));

  const campaignAttribution = Array.from(campaignMap.values());
  const staffWorkload = Array.from(staffMap.values());

  return {
    timeframe: `Past ${timeframeDays} Days`,
    totalLeads,
    newLeads: newCount,
    contactedLeads: contactedCount,
    qualifiedLeads: qualifiedCount,
    proposalSentLeads: proposalSentCount,
    wonLeads: wonCount,
    lostLeads: lostCount,
    avgResponseHours,
    responseTimeDistribution: distribution,
    funnelProgression,
    sourceBreakdown,
    campaignAttribution,
    staffWorkload,
  };
}
