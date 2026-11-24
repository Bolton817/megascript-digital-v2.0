import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { logAuditEvent } from "@/server/services/audit";

export interface CreateRevisionParams {
  entityType: "PAGE" | "SERVICE" | "PRODUCT" | "PORTFOLIO" | "TESTIMONIAL";
  entityId: string;
  data: Prisma.InputJsonValue;
  createdBy: string;
}

/**
 * Records an immutable snapshot of content state in ContentRevision.
 */
export async function createContentRevision({
  entityType,
  entityId,
  data,
  createdBy,
}: CreateRevisionParams) {
  // Determine next version number
  const latest = await db.contentRevision.findFirst({
    where: { entityType, entityId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const nextVersion = (latest?.version ?? 0) + 1;

  const revision = await db.contentRevision.create({
    data: {
      entityType,
      entityId,
      version: nextVersion,
      data,
      createdBy,
    },
  });

  return revision;
}

/**
 * Retrieves the revision history for a given entity.
 */
export async function getRevisionHistory(entityType: string, entityId: string) {
  return await db.contentRevision.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Restores a prior revision snapshot (Rollback).
 */
export async function rollbackContentRevision(
  actorId: string,
  revisionId: string
) {
  const revision = await db.contentRevision.findUnique({
    where: { id: revisionId },
  });

  if (!revision) {
    throw new Error(`Revision ${revisionId} not found`);
  }

  const snapshot = revision.data as Record<string, any>;

  switch (revision.entityType) {
    case "PAGE":
      await db.page.update({
        where: { id: revision.entityId },
        data: {
          title: snapshot.title,
          summary: snapshot.summary,
          contentBlocks: snapshot.contentBlocks,
          seoTitle: snapshot.seoTitle,
          seoDesc: snapshot.seoDesc,
          status: snapshot.status,
        },
      });
      break;

    case "SERVICE":
      await db.service.update({
        where: { id: revision.entityId },
        data: {
          name: snapshot.name,
          shortDescription: snapshot.shortDescription,
          longDescription: snapshot.longDescription,
          detailedSections: snapshot.detailedSections,
          status: snapshot.status,
        },
      });
      break;

    case "PRODUCT":
      await db.product.update({
        where: { id: revision.entityId },
        data: {
          name: snapshot.name,
          tagline: snapshot.tagline,
          overview: snapshot.overview,
          audience: snapshot.audience,
          outboundUrl: snapshot.outboundUrl,
          status: snapshot.status,
        },
      });
      break;

    case "PORTFOLIO":
      await db.portfolioProject.update({
        where: { id: revision.entityId },
        data: {
          businessName: snapshot.businessName,
          industry: snapshot.industry,
          businessDescription: snapshot.businessDescription,
          deliveredWork: snapshot.deliveredWork,
          externalUrl: snapshot.externalUrl,
          status: snapshot.status,
        },
      });
      break;

    case "TESTIMONIAL":
      await db.testimonial.update({
        where: { id: revision.entityId },
        data: {
          quote: snapshot.quote,
          clientName: snapshot.clientName,
          organization: snapshot.organization,
          role: snapshot.role,
          isApproved: snapshot.isApproved,
          status: snapshot.status,
        },
      });
      break;

    default:
      throw new Error(`Unsupported rollback entity type: ${revision.entityType}`);
  }

  // Create a new revision documenting the rollback action
  await createContentRevision({
    entityType: revision.entityType as any,
    entityId: revision.entityId,
    data: snapshot,
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_ROLLBACK",
    targetType: revision.entityType,
    targetId: revision.entityId,
    metadata: {
      restoredFromVersion: revision.version,
      revisionId,
    },
  });

  return { success: true, entityType: revision.entityType, entityId: revision.entityId };
}
