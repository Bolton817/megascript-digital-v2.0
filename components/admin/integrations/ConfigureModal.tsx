"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  IntegrationSummary,
  SupportedProvider,
} from "@/server/services/integrations";
import {
  testIntegrationConnectionAction,
  saveIntegrationCredentialsAction,
} from "@/server/actions/integrations";

interface ConfigureModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: IntegrationSummary | null;
  onSuccess: () => void;
}

export function ConfigureModal({
  isOpen,
  onClose,
  integration,
  onSuccess,
}: ConfigureModalProps) {
  // Field states based on provider
  const [measurementId, setMeasurementId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [pixelId, setPixelId] = useState("");
  const [capiAccessToken, setCapiAccessToken] = useState("");
  const [locationId, setLocationId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [serviceAccountJson, setServiceAccountJson] = useState("");

  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen || !integration) return null;

  const { provider, definition } = integration;

  const assemblePayload = () => {
    switch (provider) {
      case "GA4":
        return {
          measurementId,
          propertyId,
          serviceAccountJson: serviceAccountJson || undefined,
        };
      case "SEARCH_CONSOLE":
        return {
          siteUrl,
          serviceAccountJson: serviceAccountJson || undefined,
        };
      case "GOOGLE_BUSINESS":
        return {
          locationId,
          accountId,
          serviceAccountJson: serviceAccountJson || undefined,
        };
      case "META":
        return {
          pixelId,
          capiAccessToken: capiAccessToken || undefined,
        };
      case "BREVO":
      case "GEMINI":
      case "DEEPSEEK":
        return {
          apiKey,
        };
      default:
        return {};
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setErrorNotice(null);

    const payload = assemblePayload();
    const res = await testIntegrationConnectionAction(provider, payload, true);
    setIsTesting(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: res.message || "Connection verified successfully.",
      });
    } else {
      setTestResult({
        success: false,
        message: res.error || "Connection test failed.",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorNotice(null);

    const payload = assemblePayload();

    let accountAssetLabel = "";
    if (provider === "GA4") accountAssetLabel = `Property: ${propertyId} (${measurementId})`;
    if (provider === "SEARCH_CONSOLE") accountAssetLabel = `Site: ${siteUrl}`;
    if (provider === "GOOGLE_BUSINESS") accountAssetLabel = `Location: ${locationId}`;
    if (provider === "META") accountAssetLabel = `Pixel: ${pixelId}`;
    if (provider === "BREVO") accountAssetLabel = "Brevo Transactional SMTP";
    if (provider === "GEMINI") accountAssetLabel = "Gemini 2.5 Flash";
    if (provider === "DEEPSEEK") accountAssetLabel = "DeepSeek-Chat";

    const res = await saveIntegrationCredentialsAction(provider, {
      accountAssetLabel,
      credentialsPayload: JSON.stringify(payload),
    });

    setIsSaving(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorNotice(res.error || "Failed to save integration credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Configure {definition.name}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Encrypted credentials storage (AES-256-GCM) with zero plaintext logs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorNotice && (
            <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorNotice}
            </div>
          )}

          {/* Setup Guide Accordion */}
          <div className="p-4 rounded-lg border border-border bg-surface-subtle text-xs space-y-2">
            <div className="font-semibold text-foreground flex items-center justify-between">
              <span>{definition.setupGuide.title}</span>
              {definition.requiresConsentCategory && (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                  Requires {definition.requiresConsentCategory} consent
                </span>
              )}
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
              {definition.setupGuide.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            {definition.setupGuide.notice && (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 pt-1">
                {definition.setupGuide.notice}
              </p>
            )}
          </div>

          {/* Form Fields by Provider */}
          {provider === "GA4" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Measurement ID <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="G-ABC123XYZ"
                  value={measurementId}
                  onChange={(e) => setMeasurementId(e.target.value)}
                  required
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Web stream tracking identifier. Injected client-side only when analytics consent is granted.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Property ID <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="123456789"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  required
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  GA4 Property ID found in Google Analytics Admin &gt; Property Settings.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Service Account JSON (Optional for API Sync)
                </label>
                <textarea
                  className="w-full text-xs font-mono p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  rows={3}
                  placeholder='{"type": "service_account", "client_email": "..."}'
                  value={serviceAccountJson}
                  onChange={(e) => setServiceAccountJson(e.target.value)}
                />
              </div>
            </div>
          )}

          {provider === "SEARCH_CONSOLE" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Property Site URL <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="sc-domain:megascriptdigital.co.ke"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  required
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Domain property (&apos;sc-domain:domain.com&apos;) or URL-prefix property (&apos;https://domain.com/&apos;).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Service Account JSON (Optional for API Sync)
                </label>
                <textarea
                  className="w-full text-xs font-mono p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  rows={3}
                  placeholder='{"type": "service_account", "client_email": "..."}'
                  value={serviceAccountJson}
                  onChange={(e) => setServiceAccountJson(e.target.value)}
                />
              </div>
            </div>
          )}

          {provider === "GOOGLE_BUSINESS" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Location ID
                </label>
                <Input
                  type="text"
                  placeholder="locations/1234567890"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Account ID
                </label>
                <Input
                  type="text"
                  placeholder="accounts/1234567890"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                />
              </div>
            </div>
          )}

          {provider === "META" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Meta Pixel ID <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="123456789012345"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  required
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Numeric dataset identifier from Meta Events Manager. Injected only when marketing consent is granted.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Conversions API (CAPI) Access Token
                </label>
                <Input
                  type="password"
                  placeholder="EAAB..."
                  value={capiAccessToken}
                  onChange={(e) => setCapiAccessToken(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  System User token for server-side conversion dispatch with event deduplication.
                </p>
              </div>
            </div>
          )}

          {(provider === "BREVO" || provider === "GEMINI" || provider === "DEEPSEEK") && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                API Key <span className="text-rose-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
          )}

          {/* Test Diagnostic Output */}
          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                testResult.success
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                  : "border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              {testResult.message}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting || isSaving}
              className="gap-1.5"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <PlayCircle className="w-3.5 h-3.5 text-primary" />
              )}
              Test Connection
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSaving || isTesting}>
                {isSaving ? "Saving..." : "Save Credentials"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
