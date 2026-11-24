"use server";

import { requirePermission } from "@/features/auth/rbac";
import { updateServiceStatus } from "@/server/services/cms/services";
import {
  updatePortfolioStatus,
  updatePortfolioFeatured,
} from "@/server/services/cms/portfolio";
import {
  updateProduct,
  updateProductStatus,
} from "@/server/services/cms/products";
import { rollbackContentRevision } from "@/server/services/cms/revision";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Server action: Toggle service publication status between PUBLISHED and DRAFT.
 * Enforces `services.manage` or `content.publish` permission.
 */
export async function toggleServiceStatusAction(
  serviceId: string,
  newStatus: PublishStatus
) {
  const { user } = await requirePermission("services.manage", {
    isQualifyingActivity: true,
  });

  const updated = await updateServiceStatus(user.id, serviceId, newStatus);
  revalidatePath("/master/content/services");
  revalidatePath("/services");
  return { success: true, service: updated };
}

/**
 * Server action: Toggle portfolio project status between PUBLISHED and DRAFT.
 * Enforces `portfolio.manage` permission.
 */
export async function togglePortfolioStatusAction(
  projectId: string,
  newStatus: PublishStatus
) {
  const { user } = await requirePermission("portfolio.manage", {
    isQualifyingActivity: true,
  });

  const updated = await updatePortfolioStatus(user.id, projectId, newStatus);
  revalidatePath("/master/content/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true, project: updated };
}

/**
 * Server action: Toggle featured flag for a portfolio project.
 * Enforces `portfolio.manage` permission.
 */
export async function togglePortfolioFeaturedAction(
  projectId: string,
  isFeatured: boolean
) {
  const { user } = await requirePermission("portfolio.manage", {
    isQualifyingActivity: true,
  });

  const updated = await updatePortfolioFeatured(user.id, projectId, isFeatured);
  revalidatePath("/master/content/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true, project: updated };
}

/**
 * Server action: Restore a previous content revision snapshot.
 * Enforces `content.rollback` permission.
 */
export async function rollbackRevisionAction(revisionId: string) {
  const { user } = await requirePermission("content.rollback", {
    isQualifyingActivity: true,
  });

  const result = await rollbackContentRevision(user.id, revisionId);
  revalidatePath("/master/content");
  return result;
}

/**
 * Server action: Toggle product publication status between PUBLISHED and DRAFT.
 * Enforces `products.manage` permission.
 */
export async function toggleProductStatusAction(
  productId: string,
  newStatus: PublishStatus
) {
  const { user } = await requirePermission("products.manage", {
    isQualifyingActivity: true,
  });

  const updated = await updateProductStatus(user.id, productId, newStatus);
  revalidatePath("/master/content/products");
  revalidatePath("/products");
  revalidatePath(`/products/${updated.slug}`);
  return { success: true, product: updated };
}

/**
 * Server action: Update product outbound URL or clear it.
 * Enforces `products.manage` permission.
 */
export async function updateProductOutboundUrlAction(
  productId: string,
  outboundUrl: string | null
) {
  const { user } = await requirePermission("products.manage", {
    isQualifyingActivity: true,
  });

  let cleanUrl = outboundUrl;
  if (cleanUrl && cleanUrl.trim().length > 0) {
    const trimmed = cleanUrl.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      throw new Error("Outbound URL must begin with http:// or https://");
    }
    cleanUrl = trimmed;
  } else {
    cleanUrl = null;
  }

  const updated = await updateProduct(user.id, productId, { outboundUrl: cleanUrl });
  revalidatePath("/master/content/products");
  revalidatePath("/products");
  revalidatePath(`/products/${updated.slug}`);
  return { success: true, product: updated };
}

