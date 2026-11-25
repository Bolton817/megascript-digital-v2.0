import React from "react";
import { Metadata } from "next";
import { requirePermission } from "@/features/auth/rbac";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { listAllIntegrations } from "@/server/services/integrations";
import { IntegrationsClient } from "@/components/admin/integrations/IntegrationsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Integration Connection Centre | MegaScript Master Console",
  description: "Centralized external API connectors operating in disconnected-safe mode (GA4, Search Console, Meta, Brevo, AI models).",
};

export default async function MasterIntegrationsPage() {
  await requirePermission("integrations.read", { isQualifyingActivity: true });
  const integrations = await listAllIntegrations();

  return (
    <div className="space-y-6">
      <SessionInactivityGuard />
      <IntegrationsClient initialIntegrations={integrations} />
    </div>
  );
}
