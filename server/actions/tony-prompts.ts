"use server";

import { requirePermission } from "@/features/auth/rbac";
import { logAuditEvent } from "@/server/services/audit";
import {
  listAllPromptVersions,
  createPromptVersionRecord,
  activatePromptVersionRecord,
} from "@/server/services/tony/prompt";
import { revalidatePath } from "next/cache";

export interface PromptVersionItem {
  id: string;
  version: string;
  promptContent: string;
  isCurrent: boolean;
  authorId: string | null;
  authorName?: string;
  createdAt: Date;
}

/**
 * Lists all registered AIPromptVersion records, ordered by creation date descending.
 */
export async function listPromptVersions(): Promise<PromptVersionItem[]> {
  const { user } = await requirePermission("ai.configure");

  const versions = await listAllPromptVersions();

  return versions.map((v) => ({
    id: v.id,
    version: v.version,
    promptContent: v.promptContent,
    isCurrent: v.isCurrent,
    authorId: v.authorId,
    authorName: v.author ? (v.author.name || v.author.email) : "System Default",
    createdAt: v.createdAt,
  }));
}

/**
 * Creates a new prompt version. If setAsActive is true, atomically demotes other versions.
 */
export async function createPromptVersion(input: {
  version: string;
  promptContent: string;
  setAsActive?: boolean;
}): Promise<{ success: boolean; versionId?: string; error?: string }> {
  const { user } = await requirePermission("ai.configure");

  const result = await createPromptVersionRecord({
    version: input.version,
    promptContent: input.promptContent,
    setAsActive: input.setAsActive,
    authorId: user.id,
  });

  if (!result.success || !result.versionId) {
    return { success: false, error: result.error || "Failed to create prompt version" };
  }

  await logAuditEvent({
    actorId: user.id,
    action: "PROMPT_VERSION_CREATED",
    targetType: "AIPromptVersion",
    targetId: result.versionId,
    metadata: {
      version: input.version,
      isCurrent: Boolean(input.setAsActive),
    },
  });

  revalidatePath("/master/tony/prompts");
  return { success: true, versionId: result.versionId };
}

/**
 * Activates or rolls back to a specific prompt version.
 */
export async function activatePromptVersion(id: string): Promise<{ success: boolean; version?: string; error?: string }> {
  const { user } = await requirePermission("ai.configure");

  const result = await activatePromptVersionRecord(id);

  if (!result.success) {
    return { success: false, error: result.error || "Failed to activate prompt version" };
  }

  await logAuditEvent({
    actorId: user.id,
    action: "PROMPT_VERSION_ACTIVATED",
    targetType: "AIPromptVersion",
    targetId: id,
    metadata: {
      version: result.version,
    },
  });

  revalidatePath("/master/tony/prompts");
  return { success: true, version: result.version };
}
