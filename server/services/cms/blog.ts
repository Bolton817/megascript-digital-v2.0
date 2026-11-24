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

/**
 * Public query: fetches only PUBLISHED blog posts ordered by publishedAt descending.
 * Strictly prevents draft and scheduled post leakage.
 */
export async function getPublishedBlogPosts() {
  return await db.blogPost.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
    },
    include: {
      category: true,
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
  });
}

/**
 * Public query: fetches single published blog post by slug.
 */
export async function getPublishedBlogPostBySlug(slug: string) {
  return await db.blogPost.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
    },
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Admin / Draft query: fetches single blog post by slug regardless of publication status.
 */
export async function getBlogPostBySlug(slug: string) {
  return await db.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Admin query: fetches all blog posts regardless of status.
 */
export async function getAllBlogPosts() {
  return await db.blogPost.findMany({
    include: {
      category: true,
      tags: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Admin query: get blog post by ID.
 */
export async function getBlogPostById(id: string) {
  return await db.blogPost.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Update an existing blog post and record a versioned snapshot.
 */
export async function updateBlogPost(
  actorId: string,
  id: string,
  data: {
    title?: string;
    excerpt?: string;
    body?: string;
    status?: PublishStatus;
    publishedAt?: Date | null;
    seoTitle?: string | null;
    seoDesc?: string | null;
  }
) {
  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Blog post with ID ${id} not found`);
  }

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt:
        data.status === PublishStatus.PUBLISHED && !existing.publishedAt
          ? new Date()
          : data.publishedAt ?? existing.publishedAt,
    },
  });

  await createContentRevision({
    entityType: "BLOG_POST",
    entityId: updated.id,
    data: {
      title: updated.title,
      slug: updated.slug,
      excerpt: updated.excerpt,
      status: updated.status,
      publishedAt: updated.publishedAt,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_UPDATED",
    targetType: "BLOG_POST",
    targetId: updated.id,
    metadata: {
      slug: updated.slug,
      title: updated.title,
      status: updated.status,
    },
  });

  await safeRevalidate("/blog");
  await safeRevalidate(`/blog/${updated.slug}`);

  return updated;
}

/**
 * Quick toggle status for a blog post.
 */
export async function updateBlogPostStatus(
  actorId: string,
  id: string,
  status: PublishStatus
) {
  return await updateBlogPost(actorId, id, { status });
}
