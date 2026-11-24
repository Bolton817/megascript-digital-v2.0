import { db } from "@/server/db";
import { ServiceCategory, PublishStatus, Prisma } from "@prisma/client";
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

export interface CreateServiceInput {
  slug: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  longDescription?: string | null;
  detailedSections?: Prisma.InputJsonValue;
  isFeatured?: boolean;
  displayOrder?: number;
  status?: PublishStatus;
  seoTitle?: string | null;
  seoDesc?: string | null;
}

export interface UpdateServiceInput {
  name?: string;
  category?: ServiceCategory;
  shortDescription?: string;
  longDescription?: string | null;
  detailedSections?: Prisma.InputJsonValue;
  isFeatured?: boolean;
  displayOrder?: number;
  status?: PublishStatus;
  seoTitle?: string | null;
  seoDesc?: string | null;
}

/**
 * Public query: fetches only PUBLISHED services ordered by displayOrder.
 * Strictly prevents draft leakage.
 */
export async function getPublishedServices() {
  return await db.service.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Public query: fetches single published service by slug.
 */
export async function getPublishedServiceBySlug(slug: string) {
  return await db.service.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
    },
  });
}

/**
 * Admin query: fetches all services regardless of publication status.
 */
export async function getAllServices() {
  return await db.service.findMany({
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Admin query: get service by ID.
 */
export async function getServiceById(id: string) {
  return await db.service.findUnique({
    where: { id },
  });
}

/**
 * Admin query: get service by slug.
 */
export async function getServiceBySlug(slug: string) {
  return await db.service.findUnique({
    where: { slug },
  });
}

/**
 * Create a new service record with revision and audit trail.
 */
export async function createService(actorId: string, input: CreateServiceInput) {
  const service = await db.service.create({
    data: {
      slug: input.slug,
      name: input.name,
      category: input.category,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription ?? null,
      detailedSections: input.detailedSections ?? undefined,
      isFeatured: input.isFeatured ?? false,
      displayOrder: input.displayOrder ?? 0,
      status: input.status ?? PublishStatus.PUBLISHED,
      seoTitle: input.seoTitle ?? null,
      seoDesc: input.seoDesc ?? null,
    },
  });

  await createContentRevision({
    entityType: "SERVICE",
    entityId: service.id,
    data: {
      name: service.name,
      slug: service.slug,
      category: service.category,
      shortDescription: service.shortDescription,
      longDescription: service.longDescription,
      detailedSections: service.detailedSections,
      isFeatured: service.isFeatured,
      displayOrder: service.displayOrder,
      status: service.status,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_CREATED",
    targetType: "SERVICE",
    targetId: service.id,
    metadata: {
      slug: service.slug,
      name: service.name,
      status: service.status,
    },
  });

  await safeRevalidate("/services");
  await safeRevalidate(`/services/${service.slug}`);

  return service;
}

/**
 * Update an existing service record and record snapshot revision.
 */
export async function updateService(actorId: string, id: string, input: UpdateServiceInput) {
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Service with ID ${id} not found`);
  }

  const updated = await db.service.update({
    where: { id },
    data: input,
  });

  await createContentRevision({
    entityType: "SERVICE",
    entityId: updated.id,
    data: {
      name: updated.name,
      slug: updated.slug,
      category: updated.category,
      shortDescription: updated.shortDescription,
      longDescription: updated.longDescription,
      detailedSections: updated.detailedSections,
      isFeatured: updated.isFeatured,
      displayOrder: updated.displayOrder,
      status: updated.status,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_UPDATED",
    targetType: "SERVICE",
    targetId: updated.id,
    metadata: {
      slug: updated.slug,
      name: updated.name,
      status: updated.status,
    },
  });

  await safeRevalidate("/services");
  await safeRevalidate(`/services/${updated.slug}`);

  return updated;
}

/**
 * Quick toggle status for a service (PUBLISHED, DRAFT, ARCHIVED).
 */
export async function updateServiceStatus(actorId: string, id: string, status: PublishStatus) {
  return await updateService(actorId, id, { status });
}

/**
 * Reorder service catalog display sequences.
 */
export async function reorderServices(
  actorId: string,
  items: { id: string; displayOrder: number }[]
) {
  await db.$transaction(
    items.map((item) =>
      db.service.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  );

  await logAuditEvent({
    actorId,
    action: "CONTENT_REORDERED",
    targetType: "SERVICE_CATALOG",
    targetId: "services-reorder",
    metadata: { count: items.length },
  });

  await safeRevalidate("/services");

  return { success: true, count: items.length };
}
