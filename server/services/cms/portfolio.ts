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

export interface CreatePortfolioInput {
  slug: string;
  businessName: string;
  industry: string;
  logoAssetUrl?: string | null;
  businessDescription: string;
  deliveredWork: string;
  externalUrl?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
  status?: PublishStatus;
}

export interface UpdatePortfolioInput {
  businessName?: string;
  industry?: string;
  logoAssetUrl?: string | null;
  businessDescription?: string;
  deliveredWork?: string;
  externalUrl?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
  status?: PublishStatus;
}

/**
 * Public query: fetches only PUBLISHED portfolio projects.
 * Strictly prevents draft leakage.
 * TDD Directive: Zero project screenshots and zero tech stack labels.
 */
export async function getPublishedPortfolioProjects(options?: { featuredOnly?: boolean }) {
  return await db.portfolioProject.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      ...(options?.featuredOnly ? { isFeatured: true } : {}),
    },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Public query: fetches single published portfolio project by slug.
 */
export async function getPublishedPortfolioProjectBySlug(slug: string) {
  return await db.portfolioProject.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
    },
  });
}

/**
 * Admin query: fetches all portfolio projects regardless of publication status.
 */
export async function getAllPortfolioProjects() {
  return await db.portfolioProject.findMany({
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Admin query: get portfolio project by ID.
 */
export async function getPortfolioProjectById(id: string) {
  return await db.portfolioProject.findUnique({
    where: { id },
  });
}

/**
 * Create a new portfolio project record with revision and audit trail.
 */
export async function createPortfolioProject(actorId: string, input: CreatePortfolioInput) {
  const isPublished = input.status === PublishStatus.PUBLISHED;

  const project = await db.portfolioProject.create({
    data: {
      slug: input.slug,
      businessName: input.businessName,
      industry: input.industry,
      logoAssetUrl: input.logoAssetUrl ?? null,
      businessDescription: input.businessDescription,
      deliveredWork: input.deliveredWork,
      externalUrl: input.externalUrl ?? null,
      isFeatured: input.isFeatured ?? false,
      displayOrder: input.displayOrder ?? 0,
      status: input.status ?? PublishStatus.PUBLISHED,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  await createContentRevision({
    entityType: "PORTFOLIO",
    entityId: project.id,
    data: {
      businessName: project.businessName,
      slug: project.slug,
      industry: project.industry,
      businessDescription: project.businessDescription,
      deliveredWork: project.deliveredWork,
      externalUrl: project.externalUrl,
      isFeatured: project.isFeatured,
      displayOrder: project.displayOrder,
      status: project.status,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_CREATED",
    targetType: "PORTFOLIO",
    targetId: project.id,
    metadata: {
      slug: project.slug,
      businessName: project.businessName,
      status: project.status,
    },
  });

  await safeRevalidate("/portfolio");
  await safeRevalidate(`/portfolio/${project.slug}`);
  await safeRevalidate("/");

  return project;
}

/**
 * Update an existing portfolio record and record snapshot revision.
 */
export async function updatePortfolioProject(
  actorId: string,
  id: string,
  input: UpdatePortfolioInput
) {
  const existing = await db.portfolioProject.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Portfolio project with ID ${id} not found`);
  }

  const updated = await db.portfolioProject.update({
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
    entityType: "PORTFOLIO",
    entityId: updated.id,
    data: {
      businessName: updated.businessName,
      slug: updated.slug,
      industry: updated.industry,
      businessDescription: updated.businessDescription,
      deliveredWork: updated.deliveredWork,
      externalUrl: updated.externalUrl,
      isFeatured: updated.isFeatured,
      displayOrder: updated.displayOrder,
      status: updated.status,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_UPDATED",
    targetType: "PORTFOLIO",
    targetId: updated.id,
    metadata: {
      slug: updated.slug,
      businessName: updated.businessName,
      status: updated.status,
    },
  });

  await safeRevalidate("/portfolio");
  await safeRevalidate(`/portfolio/${updated.slug}`);
  await safeRevalidate("/");

  return updated;
}

/**
 * Quick toggle status for a portfolio project.
 */
export async function updatePortfolioStatus(
  actorId: string,
  id: string,
  status: PublishStatus
) {
  return await updatePortfolioProject(actorId, id, { status });
}

/**
 * Toggle featured flag for homepage carousel / featured grid.
 */
export async function updatePortfolioFeatured(
  actorId: string,
  id: string,
  isFeatured: boolean
) {
  return await updatePortfolioProject(actorId, id, { isFeatured });
}

/**
 * Reorder portfolio projects display sequences.
 */
export async function reorderPortfolioProjects(
  actorId: string,
  items: { id: string; displayOrder: number }[]
) {
  await db.$transaction(
    items.map((item) =>
      db.portfolioProject.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  );

  await logAuditEvent({
    actorId,
    action: "CONTENT_REORDERED",
    targetType: "PORTFOLIO_CATALOG",
    targetId: "portfolio-reorder",
    metadata: { count: items.length },
  });

  await safeRevalidate("/portfolio");
  await safeRevalidate("/");

  return { success: true, count: items.length };
}
