import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import { getAIProviderSettings } from "@/server/actions/tony-providers";
import { ProviderManagerClient } from "@/components/admin/tony/ProviderManagerClient";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Button } from "@/components/ui/Button";
import { Cpu, ArrowLeft, MessageSquare, Sparkles } from "lucide-react";

export const metadata = {
  title: "AI Providers & Model Switching | Master Operations",
  description: "Configure Google Gemini and DeepSeek adapters, API credentials, rate limits, and run synthetic evaluation tests.",
};

export default async function TonyProvidersPage() {
  // Enforce ai.configure permission & session inactivity tracking
  await requirePermission("ai.configure", { isQualifyingActivity: true });

  // Load provider configurations, credentials status, and usage telemetry
  const settings = await getAIProviderSettings();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SessionInactivityGuard />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header / Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Link href="/master/overview" className="hover:text-foreground transition-colors">
                Operations
              </Link>
              <span>/</span>
              <Link href="/master/conversations" className="hover:text-foreground transition-colors">
                Tony Assistant
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Provider Configuration</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Cpu className="w-5 h-5" />
              </span>
              AI Provider Adapters & Governance
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure Google Gemini and DeepSeek models, encrypted API secrets, daily usage ceilings, bounded fallback, and synthetic evaluation tests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/master/tony/prompts">
              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Prompt Versioning
              </Button>
            </Link>
            <Link href="/master/conversations">
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Live Conversations
              </Button>
            </Link>
            <Link href="/master/overview">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Overview
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive Provider Manager Client */}
        <ProviderManagerClient initialSettings={settings} />
      </main>
    </div>
  );
}
