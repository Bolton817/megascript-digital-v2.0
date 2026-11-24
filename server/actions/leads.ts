"use server";

import { requirePermission } from "@/features/auth/rbac";
import {
  updateLeadStatus,
  assignLead,
  addLeadNote,
} from "@/server/services/crm/leads";
import { LeadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Server action: Update a lead's status (NEW -> CONTACTED -> QUALIFIED, etc.)
 * Enforces `leads.manage` permission.
 */
export async function updateLeadStatusAction(
  leadId: string,
  newStatus: LeadStatus
) {
  const { user } = await requirePermission("leads.manage", {
    isQualifyingActivity: true,
  });

  const updated = await updateLeadStatus(
    leadId,
    newStatus,
    user.id,
    user.displayName || user.email
  );

  revalidatePath("/master/leads");
  revalidatePath(`/master/leads/${leadId}`);
  return { success: true, lead: updated };
}

/**
 * Server action: Assign a lead to a team member (or unassign).
 * Enforces `leads.manage` permission.
 */
export async function assignLeadAction(
  leadId: string,
  assignedUserId: string | null
) {
  const { user } = await requirePermission("leads.manage", {
    isQualifyingActivity: true,
  });

  const updated = await assignLead(
    leadId,
    assignedUserId,
    user.id,
    user.displayName || user.email
  );

  revalidatePath("/master/leads");
  revalidatePath(`/master/leads/${leadId}`);
  return { success: true, lead: updated };
}

/**
 * Server action: Append an internal note to a lead.
 * Enforces `leads.manage` permission.
 */
export async function addLeadNoteAction(
  leadId: string,
  noteText: string,
  isInternal: boolean = true
) {
  const { user } = await requirePermission("leads.manage", {
    isQualifyingActivity: true,
  });

  const note = await addLeadNote(leadId, noteText, user.id, isInternal);

  revalidatePath(`/master/leads/${leadId}`);
  return { success: true, note };
}
