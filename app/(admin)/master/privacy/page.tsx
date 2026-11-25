import React from "react";
import { Metadata } from "next";
import { requirePermission } from "@/features/auth/rbac";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { getPrivacyRequests } from "@/server/services/privacy";
import { PrivacyDashboardClient } from "@/components/admin/privacy/PrivacyDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Requests & Governance | Master Console",
  description: "Kenya Data Protection Act 2019 compliance module, privacy rights requests, and data processor register.",
};

export default async function MasterPrivacyPage() {
  await requirePermission("security.manage", { isQualifyingActivity: true });

  const initialData = await getPrivacyRequests({
    status: "ALL",
    page: 1,
    limit: 50,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <SessionInactivityGuard />
      <PrivacyDashboardClient initialData={initialData} />
    </div>
  );
}
