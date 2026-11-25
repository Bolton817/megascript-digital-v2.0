"use server";

import { requirePermission } from "@/features/auth/rbac";
import { revalidatePath } from "next/cache";
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendTestCampaign,
  scheduleCampaign,
  cancelCampaign,
  sendCampaignNow,
} from "@/server/services/newsletter/campaigns";
import { unsubscribe } from "@/server/services/newsletter/subscribers";
import { campaignSchema, CampaignInput } from "@/lib/validations/newsletter";

/**
 * Server action to create a new campaign draft.
 * Enforces `newsletter.manage` permission.
 */
export async function createCampaignAction(rawInput: unknown) {
  await requirePermission("newsletter.manage", { isQualifyingActivity: true });

  const parseResult = campaignSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMsg = Object.values(parseResult.error.flatten().fieldErrors)[0]?.[0] || "Invalid input";
    return { success: false, error: errorMsg };
  }

  const campaign = await createCampaign(parseResult.data);
  revalidatePath("/master/newsletter");
  revalidatePath("/master/newsletter/campaigns");
  return { success: true, campaign };
}

/**
 * Server action to update an existing campaign.
 * Enforces `newsletter.manage` permission.
 */
export async function updateCampaignAction(id: string, rawInput: unknown) {
  await requirePermission("newsletter.manage", { isQualifyingActivity: true });

  const partialSchema = campaignSchema.partial();
  const parseResult = partialSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMsg = Object.values(parseResult.error.flatten().fieldErrors)[0]?.[0] || "Invalid input";
    return { success: false, error: errorMsg };
  }

  const campaign = await updateCampaign(id, parseResult.data as Partial<CampaignInput>);
  revalidatePath("/master/newsletter");
  revalidatePath("/master/newsletter/campaigns");
  revalidatePath(`/master/newsletter/campaigns/${id}`);
  return { success: true, campaign };
}

/**
 * Server action to delete a draft or cancelled campaign.
 * Enforces `newsletter.manage` permission.
 */
export async function deleteCampaignAction(id: string) {
  await requirePermission("newsletter.manage", { isQualifyingActivity: true });

  try {
    await deleteCampaign(id);
    revalidatePath("/master/newsletter");
    revalidatePath("/master/newsletter/campaigns");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete campaign" };
  }
}

/**
 * Server action to dispatch a test campaign preview email.
 * Enforces `newsletter.manage` permission.
 */
export async function sendTestCampaignAction(campaignId: string, testEmail: string) {
  await requirePermission("newsletter.manage", { isQualifyingActivity: true });

  if (!testEmail || !testEmail.includes("@")) {
    return { success: false, error: "Please enter a valid test recipient email." };
  }

  const result = await sendTestCampaign(campaignId, testEmail.trim().toLowerCase());
  return { success: result.success, messageId: result.messageId, error: result.error };
}

/**
 * Server action to schedule a campaign.
 * Enforces `newsletter.send` permission.
 */
export async function scheduleCampaignAction(campaignId: string, scheduledAtIso: string) {
  await requirePermission("newsletter.send", { isQualifyingActivity: true });

  const date = new Date(scheduledAtIso);
  if (isNaN(date.getTime()) || date.getTime() <= Date.now()) {
    return { success: false, error: "Please choose a future date and time for scheduling." };
  }

  try {
    const campaign = await scheduleCampaign(campaignId, date);
    revalidatePath("/master/newsletter");
    revalidatePath("/master/newsletter/campaigns");
    revalidatePath(`/master/newsletter/campaigns/${campaignId}`);
    return { success: true, campaign };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to schedule campaign" };
  }
}

/**
 * Server action to cancel a scheduled or draft campaign.
 * Enforces `newsletter.send` permission.
 */
export async function cancelCampaignAction(campaignId: string) {
  await requirePermission("newsletter.send", { isQualifyingActivity: true });

  try {
    const campaign = await cancelCampaign(campaignId);
    revalidatePath("/master/newsletter");
    revalidatePath("/master/newsletter/campaigns");
    revalidatePath(`/master/newsletter/campaigns/${campaignId}`);
    return { success: true, campaign };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to cancel campaign" };
  }
}

/**
 * Server action to dispatch a campaign immediately to all confirmed subscribers.
 * Enforces `newsletter.send` permission.
 */
export async function sendCampaignNowAction(campaignId: string) {
  await requirePermission("newsletter.send", { isQualifyingActivity: true });

  try {
    const result = await sendCampaignNow(campaignId);
    revalidatePath("/master/newsletter");
    revalidatePath("/master/newsletter/campaigns");
    revalidatePath(`/master/newsletter/campaigns/${campaignId}`);
    return result;
  } catch (err: any) {
    return {
      success: false as const,
      error: err.message || "Failed to dispatch broadcast campaign.",
    };
  }
}

/**
 * Server action to unsubscribe a subscriber from the admin console.
 * Enforces `newsletter.manage` permission.
 */
export async function unsubscribeSubscriberAction(email: string) {
  await requirePermission("newsletter.manage", { isQualifyingActivity: true });

  const result = await unsubscribe(email);
  revalidatePath("/master/newsletter");
  revalidatePath("/master/newsletter/subscribers");
  return result;
}
