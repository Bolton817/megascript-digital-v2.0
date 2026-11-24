import { db } from "@/server/db";
import { PublishStatus, Prisma } from "@prisma/client";
import { createContentRevision } from "./revision";
import { logAuditEvent } from "@/server/services/audit";

async function safeRevalidate(path: string) {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(path);
  } catch {
    // No-op outside Next.js server runtime (e.g. test environments)
  }
}

export interface CreatePageInput {
  slug: string;
  title: string;
  summary?: string | null;
  contentBlocks?: Prisma.InputJsonValue;
  status?: PublishStatus;
  seoTitle?: string | null;
  seoDesc?: string | null;
  canonical?: string | null;
}

export interface UpdatePageInput {
  title?: string;
  summary?: string | null;
  contentBlocks?: Prisma.InputJsonValue;
  status?: PublishStatus;
  seoTitle?: string | null;
  seoDesc?: string | null;
  canonical?: string | null;
}

/**
 * Public query: fetches only PUBLISHED pages.
 * Strictly prevents draft/archived leakage.
 */
export async function getPublishedPageBySlug(slug: string) {
  return await db.page.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
    },
  });
}

/**
 * Admin query: fetches all pages across all statuses.
 */
export async function getAllPages() {
  return await db.page.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Admin query: get single page by ID.
 */
export async function getPageById(id: string) {
  return await db.page.findUnique({
    where: { id },
  });
}

/**
 * Admin query: get single page by slug (draft or published).
 */
export async function getPageBySlug(slug: string) {
  return await db.page.findUnique({
    where: { slug },
  });
}

/**
 * Create a new static page with initial ContentRevision and audit trail.
 */
export async function createPage(actorId: string, input: CreatePageInput) {
  const isPublished = input.status === PublishStatus.PUBLISHED;

  const page = await db.page.create({
    data: {
      slug: input.slug,
      title: input.title,
      summary: input.summary ?? null,
      contentBlocks: input.contentBlocks ?? undefined,
      status: input.status ?? PublishStatus.DRAFT,
      seoTitle: input.seoTitle ?? null,
      seoDesc: input.seoDesc ?? null,
      canonical: input.canonical ?? null,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  await createContentRevision({
    entityType: "PAGE",
    entityId: page.id,
    data: {
      title: page.title,
      slug: page.slug,
      summary: page.summary,
      contentBlocks: page.contentBlocks,
      status: page.status,
      seoTitle: page.seoTitle,
      seoDesc: page.seoDesc,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_CREATED",
    targetType: "PAGE",
    targetId: page.id,
    metadata: {
      slug: page.slug,
      title: page.title,
      status: page.status,
    },
  });

  if (isPublished) {
    await safeRevalidate(`/${page.slug}`);
  }

  return page;
}

/**
 * Update page details and record snapshot revision.
 */
export async function updatePage(actorId: string, id: string, input: UpdatePageInput) {
  const existing = await db.page.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Page with ID ${id} not found`);
  }

  const updated = await db.page.update({
    where: { id },
    data: {
      ...input,
      publishedAt:
        input.status === PublishStatus.PUBLISHED && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
  });

  await createContentRevision({
    entityType: "PAGE",
    entityId: updated.id,
    data: {
      title: updated.title,
      slug: updated.slug,
      summary: updated.summary,
      contentBlocks: updated.contentBlocks,
      status: updated.status,
      seoTitle: updated.seoTitle,
      seoDesc: updated.seoDesc,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_UPDATED",
    targetType: "PAGE",
    targetId: updated.id,
    metadata: {
      slug: updated.slug,
      title: updated.title,
      status: updated.status,
    },
  });

  await safeRevalidate(`/${updated.slug}`);

  return updated;
}

/**
 * Publish a page.
 */
export async function publishPage(actorId: string, id: string) {
  return await updatePage(actorId, id, {
    status: PublishStatus.PUBLISHED,
  });
}

/**
 * Unpublish a page (revert to DRAFT).
 */
export async function unpublishPage(actorId: string, id: string) {
  return await updatePage(actorId, id, {
    status: PublishStatus.DRAFT,
  });
}

/**
 * Delete a page.
 */
export async function deletePage(actorId: string, id: string) {
  const existing = await db.page.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Page with ID ${id} not found`);
  }

  await db.page.delete({ where: { id } });

  await logAuditEvent({
    actorId,
    action: "CONTENT_DELETED",
    targetType: "PAGE",
    targetId: id,
    metadata: {
      slug: existing.slug,
      title: existing.title,
    },
  });

  await safeRevalidate(`/${existing.slug}`);

  return { success: true };
}
