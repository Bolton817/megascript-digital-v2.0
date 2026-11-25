import { db } from "@/server/db";
import { LeadStatus, Prisma, NotificationType, NotificationSeverity, RoleName } from "@prisma/client";
import { ContactEnquiryInput } from "@/lib/validations/contact";
import { createAdminNotification } from "@/server/services/notifications";

/**
 * Generates a human-friendly unique reference code: MSD-YYYY-XXXX
 * (e.g. MSD-2026-H8K2)
 */
export async function generateReferenceCode(): Promise<string> {
  const year = new Date().getFullYear();
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Avoid 0, O, 1, I to prevent ambiguity

  for (let attempt = 0; attempt < 10; attempt++) {
    let suffix = "";
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `MSD-${year}-${suffix}`;

    const existing = await db.lead.findUnique({
      where: { referenceCode: code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }
  }

  // Fallback with timestamp suffix
  return `MSD-${year}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

/**
 * Transactionally creates a new Lead with initial event and UTM attribution.
 * Includes 5-minute deduplication check for identical email and topic.
 */
export async function createLead(input: ContactEnquiryInput) {
  const normalizedEmail = input.email.trim().toLowerCase();

  // Deduplication check: Same email and topic within last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentDuplicate = await db.lead.findFirst({
    where: {
      normalizedEmail,
      topic: input.topic,
      createdAt: { gte: fiveMinutesAgo },
    },
    include: {
      utmAttribution: true,
      events: true,
    },
  });

  if (recentDuplicate) {
    return {
      lead: recentDuplicate,
      isDuplicate: true,
    };
  }

  const referenceCode = await generateReferenceCode();

  const result = await db.$transaction(async (tx) => {
    // 1. Create Lead
    const lead = await tx.lead.create({
      data: {
        referenceCode,
        name: input.name.trim(),
        email: input.email.trim(),
        normalizedEmail,
        phone: input.phone?.trim() || null,
        topic: input.topic,
        message: input.message.trim(),
        status: LeadStatus.NEW,
        sourceChannel: "contact-form",
        landingPage: input.landingPage || null,
      },
    });

    // 2. Create Initial LeadEvent
    await tx.leadEvent.create({
      data: {
        leadId: lead.id,
        eventType: "LEAD_CREATED",
        description: `Enquiry submitted for "${input.topic}" via contact form`,
      },
    });

    // 3. Create UTM Attribution if any UTM, first-touch, last-touch or referrer data was passed
    const hasAttribution = Boolean(
      input.utmSource ||
      input.utmMedium ||
      input.utmCampaign ||
      input.utmTerm ||
      input.utmContent ||
      input.referrer ||
      input.landingPage ||
      input.firstTouchSource ||
      input.lastTouchSource
    );

    if (hasAttribution) {
      const now = new Date();
      await tx.uTMAttribution.create({
        data: {
          leadId: lead.id,
          // Primary / Consolidated attribution
          utmSource: input.utmSource || input.lastTouchSource || input.firstTouchSource || null,
          utmMedium: input.utmMedium || input.lastTouchMedium || input.firstTouchMedium || null,
          utmCampaign: input.utmCampaign || input.lastTouchCampaign || input.firstTouchCampaign || null,
          utmTerm: input.utmTerm || input.lastTouchTerm || input.firstTouchTerm || null,
          utmContent: input.utmContent || input.lastTouchContent || input.firstTouchContent || null,
          referrer: input.referrer || input.lastTouchReferrer || input.firstTouchReferrer || null,
          landingPath: input.landingPage || input.lastTouchLanding || input.firstTouchLanding || null,

          // First-touch attribution (Sheet 073)
          firstTouchSource: input.firstTouchSource || input.utmSource || null,
          firstTouchMedium: input.firstTouchMedium || input.utmMedium || null,
          firstTouchCampaign: input.firstTouchCampaign || input.utmCampaign || null,
          firstTouchTerm: input.firstTouchTerm || input.utmTerm || null,
          firstTouchContent: input.firstTouchContent || input.utmContent || null,
          firstTouchReferrer: input.firstTouchReferrer || input.referrer || null,
          firstTouchLanding: input.firstTouchLanding || input.landingPage || null,
          firstTouchTimestamp: input.firstTouchTimestamp ? new Date(input.firstTouchTimestamp) : now,

          // Last-touch attribution (Sheet 073)
          lastTouchSource: input.lastTouchSource || input.utmSource || null,
          lastTouchMedium: input.lastTouchMedium || input.utmMedium || null,
          lastTouchCampaign: input.lastTouchCampaign || input.utmCampaign || null,
          lastTouchTerm: input.lastTouchTerm || input.utmTerm || null,
          lastTouchContent: input.lastTouchContent || input.utmContent || null,
          lastTouchReferrer: input.lastTouchReferrer || input.referrer || null,
          lastTouchLanding: input.lastTouchLanding || input.landingPage || null,
          lastTouchTimestamp: input.lastTouchTimestamp ? new Date(input.lastTouchTimestamp) : now,
        },
      });
    }

    return lead;
  });

  // Trigger admin notification (Task 97, Sheet 112)
  try {
    await createAdminNotification({
      type: NotificationType.NEW_LEAD,
      severity: NotificationSeverity.INFO,
      title: `New Enquiry: ${result.name}`,
      message: `Topic: ${result.topic} • Ref: ${result.referenceCode}`,
      linkUrl: `/master/leads/${result.id}`,
      targetRole: RoleName.ADMIN,
      idempotencyKey: `lead_${result.id}`,
    });
  } catch (notifErr) {
    console.error("Non-blocking notification error on lead creation:", notifErr);
  }

  return {
    lead: result,
    isDuplicate: false,
  };
}

export interface GetLeadsFilter {
  status?: LeadStatus | "ALL";
  search?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Retrieves paginated list of leads with counts and assigned user.
 */
export async function getLeads(filter: GetLeadsFilter = {}) {
  const page = Math.max(1, filter.page || 1);
  const pageSize = Math.min(100, Math.max(5, filter.pageSize || 20));
  const skip = (page - 1) * pageSize;

  const where: Prisma.LeadWhereInput = {};

  if (filter.status && filter.status !== "ALL") {
    where.status = filter.status;
  }

  if (filter.search && filter.search.trim().length > 0) {
    const term = filter.search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
      { referenceCode: { contains: term, mode: "insensitive" } },
      { topic: { contains: term, mode: "insensitive" } },
    ];
  }

  const [leads, totalCount] = await Promise.all([
    db.lead.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        utmAttribution: true,
        _count: {
          select: { events: true, notes: true },
        },
      },
    }),
    db.lead.count({ where }),
  ]);

  return {
    leads,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/**
 * Retrieves a single lead by ID with full details, events timeline, notes, and UTM data.
 */
export async function getLeadById(id: string) {
  return db.lead.findUnique({
    where: { id },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true },
      },
      events: {
        orderBy: { createdAt: "desc" },
      },
      notes: {
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      utmAttribution: true,
    },
  });
}

/**
 * Updates a lead's status and logs an audit event.
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus,
  actorId: string,
  actorName?: string
) {
  const current = await db.lead.findUnique({
    where: { id: leadId },
    select: { status: true, referenceCode: true },
  });

  if (!current) {
    throw new Error(`Lead ${leadId} not found`);
  }

  if (current.status === newStatus) {
    return current;
  }

  return db.$transaction(async (tx) => {
    const updated = await tx.lead.update({
      where: { id: leadId },
      data: { status: newStatus },
    });

    await tx.leadEvent.create({
      data: {
        leadId,
        eventType: "STATUS_CHANGED",
        description: `Status changed from ${current.status} to ${newStatus}${
          actorName ? ` by ${actorName}` : ""
        }`,
        actorId,
      },
    });

    return updated;
  });
}

/**
 * Assigns a lead to an operational user and logs an audit event.
 */
export async function assignLead(
  leadId: string,
  assignedUserId: string | null,
  actorId: string,
  actorName?: string
) {
  let assigneeName = "Unassigned";

  if (assignedUserId) {
    const user = await db.user.findUnique({
      where: { id: assignedUserId },
      select: { name: true, email: true },
    });
    if (!user) {
      throw new Error(`User ${assignedUserId} not found`);
    }
    assigneeName = user.name || user.email;
  }

  return db.$transaction(async (tx) => {
    const updated = await tx.lead.update({
      where: { id: leadId },
      data: { assignedUserId },
    });

    await tx.leadEvent.create({
      data: {
        leadId,
        eventType: "LEAD_ASSIGNED",
        description: `Lead assigned to ${assigneeName}${
          actorName ? ` by ${actorName}` : ""
        }`,
        actorId,
      },
    });

    return updated;
  });
}

/**
 * Appends an internal note to a lead and logs an audit event.
 */
export async function addLeadNote(
  leadId: string,
  noteText: string,
  authorId: string,
  isInternal: boolean = true
) {
  const trimmed = noteText.trim();
  if (trimmed.length === 0) {
    throw new Error("Note cannot be empty");
  }

  return db.$transaction(async (tx) => {
    const note = await tx.leadNote.create({
      data: {
        leadId,
        authorId,
        note: trimmed,
        isInternal,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await tx.leadEvent.create({
      data: {
        leadId,
        eventType: "NOTE_ADDED",
        description: `Internal note added by staff`,
        actorId: authorId,
      },
    });

    return note;
  });
}

/**
 * Computes lead summary metrics for the Operations dashboard.
 */
export async function getLeadMetrics() {
  const [totalLeads, newLeads, contactedLeads, qualifiedLeads, wonLeads] =
    await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: LeadStatus.NEW } }),
      db.lead.count({ where: { status: LeadStatus.CONTACTED } }),
      db.lead.count({ where: { status: LeadStatus.QUALIFIED } }),
      db.lead.count({ where: { status: LeadStatus.WON } }),
    ]);

  return {
    totalLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    wonLeads,
  };
}

export interface FollowUpItem {
  id: string;
  referenceCode: string;
  name: string;
  email: string;
  topic: string;
  status: LeadStatus;
  urgency: "HIGH" | "MEDIUM" | "NORMAL";
  reason: string;
  hoursWaiting: number;
  assignedTo: string;
  createdAt: Date;
}

/**
 * Returns pending inquiries requiring operational action or follow-up.
 */
export async function getFollowUpQueue(limit: number = 10): Promise<{
  items: FollowUpItem[];
  totalNeedingFollowUp: number;
}> {
  const pendingLeads = await db.lead.findMany({
    where: {
      status: {
        in: [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.PROPOSAL_SENT],
      },
    },
    include: {
      assignedUser: { select: { displayName: true, name: true } },
      events: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "asc" },
  });

  const now = Date.now();
  const queue: FollowUpItem[] = [];

  for (const lead of pendingLeads) {
    const hoursWaiting = Math.max(0, Math.floor((now - lead.createdAt.getTime()) / (1000 * 60 * 60)));
    let urgency: FollowUpItem["urgency"] = "NORMAL";
    let reason = "Enquiry received";

    if (lead.status === LeadStatus.NEW) {
      if (hoursWaiting >= 24) {
        urgency = "HIGH";
        reason = `Awaiting initial contact (${hoursWaiting}h overdue)`;
      } else {
        urgency = "MEDIUM";
        reason = "New enquiry pending first touch";
      }
    } else if (lead.status === LeadStatus.PROPOSAL_SENT) {
      if (hoursWaiting >= 72) {
        urgency = "HIGH";
        reason = "Proposal sent > 3 days ago; follow-up call recommended";
      } else {
        urgency = "NORMAL";
        reason = "Proposal sent; awaiting client feedback";
      }
    } else if (lead.status === LeadStatus.QUALIFIED) {
      urgency = "MEDIUM";
      reason = "Qualified opportunity ready for proposal draft";
    } else if (lead.status === LeadStatus.CONTACTED) {
      urgency = hoursWaiting >= 48 ? "MEDIUM" : "NORMAL";
      reason = "Initial contact made; schedule discovery meeting";
    }

    queue.push({
      id: lead.id,
      referenceCode: lead.referenceCode,
      name: lead.name,
      email: lead.email,
      topic: lead.topic,
      status: lead.status,
      urgency,
      reason,
      hoursWaiting,
      assignedTo: lead.assignedUser?.displayName || lead.assignedUser?.name || "Unassigned",
      createdAt: lead.createdAt,
    });
  }

  // Sort by urgency priority (HIGH first, then MEDIUM, then NORMAL)
  const urgencyWeight = { HIGH: 3, MEDIUM: 2, NORMAL: 1 };
  queue.sort((a, b) => urgencyWeight[b.urgency] - urgencyWeight[a.urgency] || b.hoursWaiting - a.hoursWaiting);

  return {
    items: queue.slice(0, limit),
    totalNeedingFollowUp: queue.length,
  };
}

