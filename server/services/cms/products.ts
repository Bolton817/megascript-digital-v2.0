import { db } from "@/server/db";
import { PublishStatus, Prisma } from "@prisma/client";
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

export interface CreateProductInput {
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  audience: string;
  benefits?: Prisma.InputJsonValue;
  validatedFeatures?: Prisma.InputJsonValue;
  outboundUrl?: string | null;
  ctaLabel?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  status?: PublishStatus;
  seoTitle?: string | null;
  seoDesc?: string | null;
}

export interface UpdateProductInput {
  name?: string;
  tagline?: string;
  overview?: string;
  audience?: string;
  benefits?: Prisma.InputJsonValue;
  validatedFeatures?: Prisma.InputJsonValue;
  outboundUrl?: string | null;
  ctaLabel?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  status?: PublishStatus;
  seoTitle?: string | null;
  seoDesc?: string | null;
}

/**
 * Public query: fetches only PUBLISHED independent products ordered by displayOrder.
 * Strictly prevents draft leakage.
 */
export async function getPublishedProducts() {
  return await db.product.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Public query: fetches single published product by slug.
 */
export async function getPublishedProductBySlug(slug: string) {
  return await db.product.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
    },
  });
}

/**
 * Admin query: fetches all products regardless of publication status.
 */
export async function getAllProducts() {
  return await db.product.findMany({
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Admin query: get product by ID.
 */
export async function getProductById(id: string) {
  return await db.product.findUnique({
    where: { id },
  });
}

/**
 * Create a new product showcase record with revision and audit trail.
 */
export async function createProduct(actorId: string, input: CreateProductInput) {
  const product = await db.product.create({
    data: {
      slug: input.slug,
      name: input.name,
      tagline: input.tagline,
      overview: input.overview,
      audience: input.audience,
      benefits: input.benefits ?? undefined,
      validatedFeatures: input.validatedFeatures ?? undefined,
      outboundUrl: input.outboundUrl ?? null,
      ctaLabel: input.ctaLabel ?? "Visit Product Website",
      isFeatured: input.isFeatured ?? false,
      displayOrder: input.displayOrder ?? 0,
      status: input.status ?? PublishStatus.PUBLISHED,
      seoTitle: input.seoTitle ?? null,
      seoDesc: input.seoDesc ?? null,
    },
  });

  await createContentRevision({
    entityType: "PRODUCT",
    entityId: product.id,
    data: {
      name: product.name,
      slug: product.slug,
      tagline: product.tagline,
      overview: product.overview,
      audience: product.audience,
      outboundUrl: product.outboundUrl,
      ctaLabel: product.ctaLabel,
      isFeatured: product.isFeatured,
      displayOrder: product.displayOrder,
      status: product.status,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_CREATED",
    targetType: "PRODUCT",
    targetId: product.id,
    metadata: {
      slug: product.slug,
      name: product.name,
      status: product.status,
    },
  });

  await safeRevalidate("/products");
  await safeRevalidate(`/products/${product.slug}`);

  return product;
}

/**
 * Update an existing product record and record snapshot revision.
 */
export async function updateProduct(actorId: string, id: string, input: UpdateProductInput) {
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Product with ID ${id} not found`);
  }

  const updated = await db.product.update({
    where: { id },
    data: input,
  });

  await createContentRevision({
    entityType: "PRODUCT",
    entityId: updated.id,
    data: {
      name: updated.name,
      slug: updated.slug,
      tagline: updated.tagline,
      overview: updated.overview,
      audience: updated.audience,
      outboundUrl: updated.outboundUrl,
      ctaLabel: updated.ctaLabel,
      isFeatured: updated.isFeatured,
      displayOrder: updated.displayOrder,
      status: updated.status,
    },
    createdBy: actorId,
  });

  await logAuditEvent({
    actorId,
    action: "CONTENT_UPDATED",
    targetType: "PRODUCT",
    targetId: updated.id,
    metadata: {
      slug: updated.slug,
      name: updated.name,
      status: updated.status,
    },
  });

  await safeRevalidate("/products");
  await safeRevalidate(`/products/${updated.slug}`);

  return updated;
}

/**
 * Quick toggle status for a product.
 */
export async function updateProductStatus(actorId: string, id: string, status: PublishStatus) {
  return await updateProduct(actorId, id, { status });
}

/**
 * Reorder product catalog display sequences.
 */
export async function reorderProducts(
  actorId: string,
  items: { id: string; displayOrder: number }[]
) {
  await db.$transaction(
    items.map((item) =>
      db.product.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  );

  await logAuditEvent({
    actorId,
    action: "CONTENT_REORDERED",
    targetType: "PRODUCT_CATALOG",
    targetId: "products-reorder",
    metadata: { count: items.length },
  });

  await safeRevalidate("/products");

  return { success: true, count: items.length };
}
