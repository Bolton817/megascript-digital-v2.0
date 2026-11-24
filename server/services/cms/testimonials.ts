import { db } from "@/server/db";
import { PublishStatus } from "@prisma/client";
import { createContentRevision } from "./revision";
import { logAuditEvent } from "@/server/services/audit";

async function safeRevalidate(path: string) {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(path);
  } catch {
    // No-op outside Next.js server runtime
  }
}

export interface CreateTestimonialInput {
  quote: string;
  clientName: string;
  organization: string;
  role?: string | null;
  logoUrl?: string | null;
  approvalEvidence?: string | null;
  isApproved?: boolean;
  status?: PublishStatus;
  displayOrder?: number;
}

export interface UpdateTestimonialInput {
  quote?: string;
  clientName?: string;
  organization?: string;
  role?: string | null;
  logoUrl?: string | null;
  approvalEvidence?: string | null;
  isApproved?: boolean;
  status?: PublishStatus;
  displayOrder?: number;
}

/**
 * Public query: fetches only PUBLISHED and APPROVED testimonials.
 * Strictly prevents unapproved draft leakage.
 */
export async function getPublishedTestimonials() {
  return await db.testimonial.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      isApproved: true,
    },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Admin query: fetches all testimonials regardless of status or approval.
 */
export async function getAllTestimonials() {
  return await db.testimonial.findMany({
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Admin query: get testimonial by ID.
 */
export async function getTestimonialById(id: string) {
  return await db.testimonial.findUnique({
    where: { id },
  });
}

/**
 * Create a new testimonial with revision and audit trail.
 */
export async function createTestimonial(actorId: string, input: CreateTestimonialInput) {
  const testimonial = await db.testimonial.create({
    data: {
      quote: input.quote,
      clientName: input.clientName,
      organization: input.organization,
      role: input.role ?? null,
      logoUrl: input.logoUrl ?? null,
      approvalEvidence: input.approvalEvidence ?? null,
      isApproved: input.isApproved ?? false,
      status: input.status ?? PublishStatus.DRAFT,
      displayOrder: input.displayOrder ?? 0,
    },
  });

  await createContentRevision({
    entityType: "TESTIMONIAL",
    entityId: testimonial.id,
    data: {
      quote: testimonial.quote,
      clientName: testimonial.clientName,
      organization: testimonial.organization,
      role: testimonial.role,
      isApproved: testimonial.isApproved,
      status: testimonial.status,
      displayOrder: testimonial.displayOrder,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_CREATED",
    targetType: "TESTIMONIAL",
    targetId: testimonial.id,
    metadata: {
      clientName: testimonial.clientName,
      organization: testimonial.organization,
      status: testimonial.status,
    },
  });

  await safeRevalidate("/");

  return testimonial;
}

/**
 * Update an existing testimonial and record snapshot revision.
 */
export async function updateTestimonial(
  actorId: string,
  id: string,
  input: UpdateTestimonialInput
) {
  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Testimonial with ID ${id} not found`);
  }

  const updated = await db.testimonial.update({
    where: { id },
    data: input,
  });

  await createContentRevision({
    entityType: "TESTIMONIAL",
    entityId: updated.id,
    data: {
      quote: updated.quote,
      clientName: updated.clientName,
      organization: updated.organization,
      role: updated.role,
      isApproved: updated.isApproved,
      status: updated.status,
      displayOrder: updated.displayOrder,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_UPDATED",
    targetType: "TESTIMONIAL",
    targetId: updated.id,
    metadata: {
      clientName: updated.clientName,
      organization: updated.organization,
      status: updated.status,
    },
  });

  await safeRevalidate("/");

  return updated;
}

/**
 * Explicitly approve a testimonial with evidence verification.
 */
export async function approveTestimonial(
  actorId: string,
  id: string,
  approvalEvidence: string
) {
  return await updateTestimonial(actorId, id, {
    isApproved: true,
    approvalEvidence,
  });
}

/**
 * Quick toggle status for a testimonial.
 */
export async function updateTestimonialStatus(
  actorId: string,
  id: string,
  status: PublishStatus
) {
  return await updateTestimonial(actorId, id, { status });
}

/**
 * Reorder testimonials display sequence.
 */
export async function reorderTestimonials(
  actorId: string,
  items: { id: string; displayOrder: number }[]
) {
  await db.$transaction(
    items.map((item) =>
      db.testimonial.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  );

  await logAuditEvent({
    actorId,
    action: "CONTENT_REORDERED",
    targetType: "TESTIMONIAL_CATALOG",
    targetId: "testimonials-reorder",
    metadata: { count: items.length },
  });

  await safeRevalidate("/");

  return { success: true, count: items.length };
}
