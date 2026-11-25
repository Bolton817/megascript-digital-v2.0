"use server";

import { requirePermission } from "@/features/auth/rbac";
import {
  listAllIntegrations,
  getIntegrationDetails,
  saveIntegrationCredentials,
  disconnectIntegration,
  triggerIntegrationSync,
  testProviderCredentials,
  SupportedProvider,
} from "@/server/services/integrations";

export async function fetchIntegrationsOverviewAction() {
  try {
    await requirePermission("integrations.read", { isQualifyingActivity: true });
    const integrations = await listAllIntegrations();
    return { success: true, data: integrations };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load integrations.";
    return { success: false, error: msg };
  }
}

export async function fetchIntegrationDetailsAction(provider: SupportedProvider) {
  try {
    await requirePermission("integrations.read", { isQualifyingActivity: true });
    const details = await getIntegrationDetails(provider);
    return { success: true, data: details };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load integration details.";
    return { success: false, error: msg };
  }
}

export async function testIntegrationConnectionAction(
  provider: SupportedProvider,
  credentials: Record<string, any>,
  isMock = false
) {
  try {
    await requirePermission("integrations.manage", { isQualifyingActivity: true });
    const result = await testProviderCredentials(provider, credentials, isMock);
    return { success: result.success, message: result.message, details: (result as any).details };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Connection diagnostic failed.";
    return { success: false, error: msg };
  }
}

export async function saveIntegrationCredentialsAction(
  provider: SupportedProvider,
  input: {
    accountAssetLabel?: string;
    scopes?: string;
    credentialsPayload: string;
  }
) {
  try {
    const { user } = await requirePermission("integrations.manage", { isQualifyingActivity: true });
    const saved = await saveIntegrationCredentials(provider, input, user.id);
    return { success: true, data: saved };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save integration credentials.";
    return { success: false, error: msg };
  }
}

export async function triggerIntegrationSyncAction(provider: SupportedProvider) {
  try {
    await requirePermission("integrations.manage", { isQualifyingActivity: true });
    const res = await triggerIntegrationSync(provider);
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to trigger sync.";
    return { success: false, error: msg };
  }
}

export async function disconnectIntegrationAction(provider: SupportedProvider) {
  try {
    const { user } = await requirePermission("integrations.manage", { isQualifyingActivity: true });
    await disconnectIntegration(provider, user.id);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to disconnect integration.";
    return { success: false, error: msg };
  }
}
