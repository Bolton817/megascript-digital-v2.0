import React from "react";
import { Metadata } from "next";
import { requirePermission } from "@/features/auth/rbac";
import { getAnalyticsDashboardData } from "@/server/services/analytics/dashboard";
import { AnalyticsDashboardClient } from "@/components/admin/analytics/AnalyticsDashboardClient";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";

export const metadata: Metadata = {
  title: "Traffic & Lead Analytics | Megascript Master Console",
  description: "First-party telemetry streams, marketing attribution, content reach, and user search intent",
};

export default async function MasterAnalyticsPage() {
  // Enforce analytics.read permission and log qualifying activity
  await requirePermission("analytics.read", { isQualifyingActivity: true });

  // Load initial 30-day analytics report
  const initialReport = await getAnalyticsDashboardData("30d");

  return (
    <div className="space-y-6">
      <SessionInactivityGuard />
      <AnalyticsDashboardClient initialReport={initialReport} />
    </div>
  );
}
