import React from "react";
import { requireAuthOrRedirect, getUserRolesAndPermissions, hasPermission } from "@/features/auth/rbac";
import { getOperationsOverview } from "@/server/services/overview";
import { OverviewClient } from "@/components/admin/overview/OverviewClient";

export const dynamic = "force-dynamic";

interface OverviewPageProps {
  searchParams: Promise<{
    timeframe?: string;
  }>;
}

export default async function MasterOverviewPage({ searchParams }: OverviewPageProps) {
  const { user } = await requireAuthOrRedirect();
  const roleInfo = await getUserRolesAndPermissions(user.id);

  const resolvedParams = await searchParams;
  const days = parseInt(resolvedParams.timeframe || "30", 10) || 30;

  const [data, canExportLeads, canExportAnalytics] = await Promise.all([
    getOperationsOverview(days),
    hasPermission(user.id, "leads.export"),
    hasPermission(user.id, "analytics.export"),
  ]);

  const primaryRole = roleInfo.isSuperAdmin
    ? "SUPER_ADMIN"
    : roleInfo.roles[0] || "ADMIN";

  return (
    <OverviewClient
      initialData={data}
      user={{
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isProtected: user.isProtected,
      }}
      primaryRole={primaryRole}
      canExportLeads={canExportLeads}
      canExportAnalytics={canExportAnalytics}
    />
  );
}
