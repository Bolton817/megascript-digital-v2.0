"use server";

import { z } from "zod";
import { PrivacyRequestType, PrivacyRequestStatus } from "@prisma/client";
import {
  submitPrivacyRequest,
  getPrivacyRequests,
  matchRequesterData,
  updatePrivacyRequestStatus,
} from "@/server/services/privacy";
import { requirePermission } from "@/features/auth/rbac";

const submitSchema = z.object({
  requesterName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  requesterEmail: z.string().email("Please provide a valid email address").max(200),
  requestType: z.nativeEnum(PrivacyRequestType),
  requestDetails: z.string().min(10, "Please provide at least 10 characters describing your request").max(1000),
});

/**
 * Public action: Submit privacy rights request
 */
export async function submitPrivacyRequestAction(formData: {
  requesterName: string;
  requesterEmail: string;
  requestType: PrivacyRequestType;
  requestDetails: string;
}) {
  try {
    const validated = submitSchema.parse(formData);
    const request = await submitPrivacyRequest(validated);
    return {
      success: true,
      referenceCode: request.referenceCode,
      dueAt: request.dueAt.toISOString(),
      requestType: request.requestType,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Invalid input data" };
    }
    console.error("submitPrivacyRequestAction error:", error);
    return { success: false, error: "Failed to submit privacy request. Please try again." };
  }
}

/**
 * Admin action: Fetch privacy requests
 */
export async function getPrivacyRequestsAction(params: {
  status?: PrivacyRequestStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await requirePermission("security.manage");
    const result = await getPrivacyRequests(params);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("getPrivacyRequestsAction error:", error);
    return { success: false, error: error.message || "Unauthorized" };
  }
}

/**
 * Admin action: Automated data matching for verified requester email
 */
export async function getRequesterDataMatchAction(email: string) {
  try {
    await requirePermission("security.manage");
    if (!email) throw new Error("Email is required for data matching");
    const matched = await matchRequesterData(email);
    return { success: true, data: matched };
  } catch (error: any) {
    console.error("getRequesterDataMatchAction error:", error);
    return { success: false, error: error.message || "Unauthorized" };
  }
}

/**
 * Admin action: Update request status and record resolution
 */
export async function updatePrivacyRequestStatusAction(params: {
  id: string;
  status: PrivacyRequestStatus;
  outcomeDetails?: string;
  assignedTo?: string;
}) {
  try {
    const session = await requirePermission("security.manage");
    const updated = await updatePrivacyRequestStatus({
      ...params,
      actorId: session.user.id,
    });
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("updatePrivacyRequestStatusAction error:", error);
    return { success: false, error: error.message || "Unauthorized" };
  }
}
