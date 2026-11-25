import { db } from "@/server/db";
import { PrivacyRequestType, PrivacyRequestStatus } from "@prisma/client";
import { createAdminNotification } from "@/server/services/notifications";
import { logAuditEvent } from "@/server/services/audit";
import crypto from "crypto";

export interface SubmitPrivacyRequestInput {
  requesterName: string;
  requesterEmail: string;
  requestType: PrivacyRequestType;
  requestDetails: string;
}

/**
 * Generates an official reference code in the format PR-YYYY-XXXX (TDD Sheet 142)
 */
function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `PR-${year}-${randomSuffix}`;
}

/**
 * Submit a formal privacy rights request under KDPA 2019
 */
export async function submitPrivacyRequest(input: SubmitPrivacyRequestInput) {
  const referenceCode = generateReferenceCode();
  // Statutory 21-day timeline under KDPA regulations
  const dueAt = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);

  const request = await db.privacyRequest.create({
    data: {
      referenceCode,
      requestType: input.requestType,
      requesterName: input.requesterName.trim(),
      requesterEmail: input.requesterEmail.trim().toLowerCase(),
      requestDetails: input.requestDetails.trim(),
      status: PrivacyRequestStatus.PENDING,
      dueAt,
    },
  });

  // Trigger internal admin notification for compliance officer / Super Admin
  try {
    await createAdminNotification({
      type: "SECURITY_ALERT",
      severity: "INFO",
      title: "New Privacy Rights Request",
      message: `Data subject ${input.requesterName} filed a ${input.requestType} request (${referenceCode}).`,
      linkUrl: "/master/privacy",
      targetRole: "SUPER_ADMIN",
      idempotencyKey: `privacy-req-${referenceCode}`,
    });
  } catch (err) {
    console.error("Failed to emit notification for privacy request:", err);
  }

  return request;
}

/**
 * Retrieve privacy requests with status filters and search
 */
export async function getPrivacyRequests(params: {
  status?: PrivacyRequestStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.status && params.status !== "ALL") {
    where.status = params.status;
  }

  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    where.OR = [
      { referenceCode: { contains: q, mode: "insensitive" } },
      { requesterEmail: { contains: q, mode: "insensitive" } },
      { requesterName: { contains: q, mode: "insensitive" } },
    ];
  }

  const [requests, totalCount] = await Promise.all([
    db.privacyRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.privacyRequest.count({ where }),
  ]);

  // Aggregate KPI summary metrics
  const [total, pending, verifying, processing, resolved, declined] = await Promise.all([
    db.privacyRequest.count(),
    db.privacyRequest.count({ where: { status: PrivacyRequestStatus.PENDING } }),
    db.privacyRequest.count({ where: { status: PrivacyRequestStatus.VERIFYING } }),
    db.privacyRequest.count({ where: { status: PrivacyRequestStatus.PROCESSING } }),
    db.privacyRequest.count({ where: { status: PrivacyRequestStatus.RESOLVED } }),
    db.privacyRequest.count({ where: { status: PrivacyRequestStatus.DECLINED } }),
  ]);

  const overdue = await db.privacyRequest.count({
    where: {
      status: { in: [PrivacyRequestStatus.PENDING, PrivacyRequestStatus.VERIFYING, PrivacyRequestStatus.PROCESSING] },
      dueAt: { lt: new Date() },
    },
  });

  return {
    requests,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
    metrics: {
      total,
      pending,
      verifying,
      processing,
      resolved,
      declined,
      overdue,
    },
  };
}

/**
 * Automated Data Matching Tool: Scans databases for matched records using requester email
 */
export async function matchRequesterData(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const [leads, subscriber, chatConversations] = await Promise.all([
    db.lead.findMany({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      select: {
        id: true,
        referenceCode: true,
        status: true,
        topic: true,
        createdAt: true,
      },
    }),
    db.newsletterSubscriber.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      select: {
        id: true,
        email: true,
        status: true,
        consentTimestamp: true,
      },
    }),
    db.chatConversation.count({
      where: {
        lead: { email: { equals: normalizedEmail, mode: "insensitive" } },
      },
    }),
  ]);

  return {
    email: normalizedEmail,
    leadsCount: leads.length,
    leads,
    isSubscriber: Boolean(subscriber),
    subscriber,
    chatConversationsCount: chatConversations,
  };
}

/**
 * Update request status, record resolution notes, and log immutable audit event
 */
export async function updatePrivacyRequestStatus(params: {
  id: string;
  status: PrivacyRequestStatus;
  outcomeDetails?: string;
  assignedTo?: string;
  actorId?: string;
}) {
  const existing = await db.privacyRequest.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    throw new Error(`Privacy request not found: ${params.id}`);
  }

  const isResolving =
    params.status === PrivacyRequestStatus.RESOLVED ||
    params.status === PrivacyRequestStatus.DECLINED;

  const updated = await db.privacyRequest.update({
    where: { id: params.id },
    data: {
      status: params.status,
      outcomeDetails: params.outcomeDetails !== undefined ? params.outcomeDetails : existing.outcomeDetails,
      assignedTo: params.assignedTo !== undefined ? params.assignedTo : existing.assignedTo,
      resolvedAt: isResolving ? new Date() : existing.resolvedAt,
    },
  });

  // Log audit event
  await logAuditEvent({
    action: "privacy_request.update_status",
    actorId: params.actorId || null,
    targetType: "PrivacyRequest",
    targetId: params.id,
    metadata: {
      referenceCode: existing.referenceCode,
      previousStatus: existing.status,
      newStatus: params.status,
      outcomeDetails: params.outcomeDetails || null,
    },
  });

  return updated;
}
