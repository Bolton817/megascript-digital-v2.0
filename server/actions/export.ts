"use server";

import { requireAuthOrRedirect, hasPermission, getUserRolesAndPermissions } from "@/features/auth/rbac";
import { exportLeadsData, exportAnalyticsData } from "@/server/services/export";

export async function exportLeadsAction(params: {
  format?: "csv" | "json";
  anonymize?: boolean;
  status?: string;
  timeframeDays?: number;
}) {
  const { user } = await requireAuthOrRedirect();
  const canExport = await hasPermission(user.id, "leads.export");

  return exportLeadsData({
    actorId: user.id,
    hasExportPermission: canExport,
    format: params.format || "csv",
    anonymize: params.anonymize || false,
    status: params.status,
    timeframeDays: params.timeframeDays,
  });
}

export async function exportAnalyticsAction(params: {
  format?: "csv" | "json";
  timeframeDays?: number;
}) {
  const { user } = await requireAuthOrRedirect();
  const canExport = await hasPermission(user.id, "analytics.export");

  return exportAnalyticsData({
    actorId: user.id,
    hasExportPermission: canExport,
    format: params.format || "csv",
    timeframeDays: params.timeframeDays || 30,
  });
}
