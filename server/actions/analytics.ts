"use server";

import { requirePermission } from "@/features/auth/rbac";
import {
  getAnalyticsDashboardData,
  TimeframeOption,
  AnalyticsDashboardReport,
} from "@/server/services/analytics/dashboard";

/**
 * Server action to retrieve aggregated first-party analytics for the Master Operations Console.
 * Enforces `analytics.read` permission.
 */
export async function fetchAnalyticsReportAction(
  timeframe: TimeframeOption = "30d"
): Promise<{ success: boolean; data?: AnalyticsDashboardReport; error?: string }> {
  try {
    await requirePermission("analytics.read", { isQualifyingActivity: true });
    const data = await getAnalyticsDashboardData(timeframe);
    return { success: true, data };
  } catch (err: any) {
    console.error("Error fetching analytics report:", err);
    return { success: false, error: err.message || "Failed to load analytics data" };
  }
}
