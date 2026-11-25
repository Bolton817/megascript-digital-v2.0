import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import { getOrSeedCanonicalPrompt, IMMUTABLE_SAFETY_GUARDRAILS } from "@/server/services/tony/prompt";
import { listPromptVersions } from "@/server/actions/tony-prompts";
import { PromptManagerClient } from "@/components/admin/tony/PromptManagerClient";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Button } from "@/components/ui/Button";
import { Bot, ArrowLeft, MessageSquare, BookOpen } from "lucide-react";

export const metadata = {
  title: "Tony Prompt & Knowledge Configuration | Master Operations",
  description: "Manage canonical AI system prompts, view immutable safety guardrails, and rollback versions.",
};

export default async function TonyPromptsPage() {
  // Enforce ai.configure permission & session inactivity tracking
  await requirePermission("ai.configure", { isQualifyingActivity: true });

  // Ensure baseline v1.0.0 prompt exists in DB
  await getOrSeedCanonicalPrompt();

  // Load all prompt versions
  const versions = await listPromptVersions();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Session Inactivity Guard (TDD Sheet 193) */}
      <SessionInactivityGuard />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header / Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Link
                href="/master/overview"
                className="hover:text-foreground transition-colors"
              >
                Operations
              </Link>
              <span>/</span>
              <Link
                href="/master/conversations"
                className="hover:text-foreground transition-colors"
              >
                Tony Assistant
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Prompt Versioning</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Bot className="w-5 h-5" />
              </span>
              Tony Canonical Prompt & Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage versioned system instructions, inspect immutable platform safety guardrails, and rollback configuration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/master/conversations">
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Live Conversations
              </Button>
            </Link>
            <Link href="/master/overview">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Console Overview
              </Button>
            </Link>
          </div>
        </div>

        {/* Prompt Manager Client UI */}
        <PromptManagerClient
          initialVersions={versions}
          immutableGuardrails={IMMUTABLE_SAFETY_GUARDRAILS}
        />
      </main>
    </div>
  );
}
