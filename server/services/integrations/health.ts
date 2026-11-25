import { db } from "@/server/db";
import { PROVIDER_REGISTRY } from "./index";
import { checkGoogleBusinessEligibility } from "./google-business";

export interface IntegrationHealthSummary {
  provider: string;
  name: string;
  category: string;
  status: "CONNECTED" | "NEEDS_CONFIGURATION" | "ERROR" | "NOT_CONNECTED";
  statusLabel: string;
  lastSyncAt: Date | null;
  lastError: string | null;
  isConfigured: boolean;
  actionRequired: boolean;
}

export async function getIntegrationHealthOverview(): Promise<{
  providers: IntegrationHealthSummary[];
  connectedCount: number;
  needsConfigCount: number;
  errorCount: number;
  totalProviders: number;
  overallStatus: "HEALTHY" | "ATTENTION_REQUIRED" | "SETUP_NEEDED";
}> {
  const connections = await db.integrationConnection.findMany({
    include: {
      syncLogs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const connectionMap = new Map(connections.map((c) => [c.provider, c]));

  const summaries: IntegrationHealthSummary[] = [];

  for (const def of Object.values(PROVIDER_REGISTRY)) {
    const conn = connectionMap.get(def.id);
    const hasSecret = Boolean(conn?.encryptedSecretRef);
    const lastSync = conn?.lastSyncAt || null;
    const latestLog = conn?.syncLogs?.[0];
    const isError = conn?.status === "ERROR" || latestLog?.status === "FAILED";

    let status: IntegrationHealthSummary["status"] = "NOT_CONNECTED";
    let statusLabel = "Not connected";
    let actionRequired = false;

    if (isError) {
      status = "ERROR";
      statusLabel = "Sync Failed";
      actionRequired = true;
    } else if (hasSecret && conn?.status === "CONNECTED") {
      status = "CONNECTED";
      statusLabel = "Connected";
    } else if (hasSecret && conn?.status === "NEEDS_CONFIGURATION") {
      status = "NEEDS_CONFIGURATION";
      statusLabel = "Setup required";
      actionRequired = true;
    } else {
      status = "NOT_CONNECTED";
      statusLabel = "Not connected";
    }

    summaries.push({
      provider: def.id,
      name: def.name,
      category: def.category,
      status,
      statusLabel,
      lastSyncAt: lastSync,
      lastError: conn?.lastErrorCategory || latestLog?.errorMessage || null,
      isConfigured: hasSecret,
      actionRequired,
    });
  }

  const connectedCount = summaries.filter((s) => s.status === "CONNECTED").length;
  const needsConfigCount = summaries.filter((s) => s.status === "NEEDS_CONFIGURATION").length;
  const errorCount = summaries.filter((s) => s.status === "ERROR").length;

  let overallStatus: "HEALTHY" | "ATTENTION_REQUIRED" | "SETUP_NEEDED" = "SETUP_NEEDED";
  if (errorCount > 0) {
    overallStatus = "ATTENTION_REQUIRED";
  } else if (connectedCount > 0 && needsConfigCount === 0) {
    overallStatus = "HEALTHY";
  }

  return {
    providers: summaries,
    connectedCount,
    needsConfigCount,
    errorCount,
    totalProviders: summaries.length,
    overallStatus,
  };
}
