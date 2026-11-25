"use client";

import React, { useState } from "react";
import { PromptVersionItem, createPromptVersion, activatePromptVersion } from "@/server/actions/tony-prompts";
import { Button } from "@/components/ui/Button";
import {
  ShieldAlert,
  Bot,
  History,
  RotateCcw,
  Plus,
  CheckCircle2,
  FileCode,
  Eye,
  Columns,
  AlertCircle,
  Clock,
  User,
  Sparkles,
} from "lucide-react";

interface PromptManagerClientProps {
  initialVersions: PromptVersionItem[];
  immutableGuardrails: string;
}

export function PromptManagerClient({
  initialVersions,
  immutableGuardrails,
}: PromptManagerClientProps) {
  const [versions, setVersions] = useState<PromptVersionItem[]>(initialVersions);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersionItem>(
    versions.find((v) => v.isCurrent) || versions[0]
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form State
  const [newVersionTag, setNewVersionTag] = useState<string>("");
  const [newPromptContent, setNewPromptContent] = useState<string>(
    selectedVersion?.promptContent || ""
  );
  const [setAsActive, setSetAsActive] = useState<boolean>(true);

  const activeVersion = versions.find((v) => v.isCurrent);

  const handleOpenCreate = () => {
    // Generate suggested next version (e.g. 1.0.0 -> 1.1.0)
    const base = activeVersion ? activeVersion.version.split(".") : ["1", "0", "0"];
    const minor = parseInt(base[1] || "0", 10) + 1;
    setNewVersionTag(`${base[0]}.${minor}.0`);
    setNewPromptContent(activeVersion?.promptContent || "");
    setIsCreating(true);
    setFeedback(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionTag.trim() || !newPromptContent.trim()) {
      setFeedback({ message: "Version tag and prompt content are required", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await createPromptVersion({
        version: newVersionTag.trim(),
        promptContent: newPromptContent.trim(),
        setAsActive,
      });

      if (!res.success) {
        setFeedback({ message: res.error || "Failed to create prompt version", type: "error" });
        setIsSubmitting(false);
        return;
      }

      setFeedback({
        message: `Prompt version ${newVersionTag.trim()} created successfully${setAsActive ? " and activated" : ""}!`,
        type: "success",
      });

      // Update local state
      const now = new Date();
      const updatedList: PromptVersionItem[] = [
        {
          id: res.versionId || `temp-${Date.now()}`,
          version: newVersionTag.trim(),
          promptContent: newPromptContent.trim(),
          isCurrent: setAsActive,
          authorId: "me",
          authorName: "Administrator",
          createdAt: now,
        },
        ...versions.map((v) => (setAsActive ? { ...v, isCurrent: false } : v)),
      ];

      setVersions(updatedList);
      setSelectedVersion(updatedList[0]);
      setIsCreating(false);
    } catch (err: any) {
      setFeedback({ message: err.message || "Failed to save prompt version", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async (versionItem: PromptVersionItem) => {
    if (versionItem.isCurrent) return;

    if (!confirm(`Are you sure you want to activate prompt version ${versionItem.version}? This will become Tony's active system prompt immediately.`)) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await activatePromptVersion(versionItem.id);
      if (!res.success) {
        setFeedback({ message: res.error || "Failed to activate version", type: "error" });
        setIsSubmitting(false);
        return;
      }

      setFeedback({
        message: `Version ${versionItem.version} has been activated. Tony is now running with this instruction set.`,
        type: "success",
      });

      const updated = versions.map((v) => ({
        ...v,
        isCurrent: v.id === versionItem.id,
      }));
      setVersions(updated);
      setSelectedVersion({ ...versionItem, isCurrent: true });
    } catch (err: any) {
      setFeedback({ message: err.message || "Failed to activate version", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {/* Immutable Safety Guardrails Box (Sheet 081) */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-amber-200">
                Immutable Platform Safety Guardrails (TDD Sheet 081)
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Locked In Code
              </span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed max-w-3xl">
              These safety instructions are hardcoded and non-negotiable. They are injected at the very top of
              every system prompt assembly and cannot be bypassed, overridden, or removed by prompt edits, CMS data, or visitor inputs.
            </p>
            <pre className="mt-3 p-3 bg-neutral-950/80 border border-amber-500/20 rounded-xl text-xs font-mono text-amber-300/90 whitespace-pre-wrap leading-relaxed">
              {immutableGuardrails}
            </pre>
          </div>
        </div>
      </div>

      {/* Main Grid: Version History Sidebar & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Version History (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Prompt Versions ({versions.length})
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenCreate}
              className="gap-1.5 h-8 text-xs border-primary/40 text-primary hover:bg-primary/10"
            >
              <Plus className="w-3.5 h-3.5" />
              New Version
            </Button>
          </div>

          <div className="space-y-3">
            {versions.map((ver) => {
              const isSelected = selectedVersion?.id === ver.id;
              return (
                <div
                  key={ver.id}
                  onClick={() => {
                    setSelectedVersion(ver);
                    setIsCreating(false);
                    setIsDiffMode(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary/40 shadow-sm"
                      : "bg-card/50 border-border/40 hover:bg-card/80 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">
                          v{ver.version}
                        </span>
                        {ver.isCurrent ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] text-muted-foreground bg-muted/30">
                            Archived
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ver.authorName || "System"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ver.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {!ver.isCurrent && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isSubmitting}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(ver);
                        }}
                        className="h-7 px-2 text-xs text-primary hover:bg-primary/20 hover:text-primary gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Prompt Viewer / Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {isCreating ? (
            /* Creation Form */
            <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Create New Prompt Version
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Draft a new version of Tony&apos;s system prompt. Version tags follow semver (e.g. 1.1.0).
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Version Number *
                    </label>
                    <input
                      type="text"
                      value={newVersionTag}
                      onChange={(e) => setNewVersionTag(e.target.value)}
                      placeholder="e.g. 1.1.0"
                      className="w-full px-3 py-2 bg-background border border-border/60 rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="setAsActive"
                      checked={setAsActive}
                      onChange={(e) => setSetAsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background"
                    />
                    <label htmlFor="setAsActive" className="text-xs text-foreground font-medium cursor-pointer">
                      Activate immediately upon creation
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Canonical Prompt Content (TDD Sheet 082) *
                    </label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {newPromptContent.length} chars (~{Math.ceil(newPromptContent.length / 4)} tokens)
                    </span>
                  </div>
                  <textarea
                    rows={18}
                    value={newPromptContent}
                    onChange={(e) => setNewPromptContent(e.target.value)}
                    className="w-full p-4 bg-background border border-border/60 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="text-xs bg-primary text-primary-foreground font-semibold"
                  >
                    {isSubmitting ? "Saving..." : setAsActive ? "Save & Activate" : "Save as Draft"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Selected Version Inspector */
            <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold font-mono text-foreground">
                      Version {selectedVersion.version}
                    </h3>
                    {selectedVersion.isCurrent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Live in Production
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-xs text-muted-foreground bg-muted/40">
                        Inactive / Historical Version
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created by {selectedVersion.authorName || "System Default"} on{" "}
                    {new Date(selectedVersion.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeVersion && activeVersion.id !== selectedVersion.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsDiffMode(!isDiffMode)}
                      className="gap-1.5 text-xs h-8"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      {isDiffMode ? "Standard View" : "Diff vs Active"}
                    </Button>
                  )}

                  {!selectedVersion.isCurrent && (
                    <Button
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => handleActivate(selectedVersion)}
                      className="gap-1.5 text-xs h-8 bg-primary text-primary-foreground font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore This Version
                    </Button>
                  )}
                </div>
              </div>

              {/* Diff View Mode */}
              {isDiffMode && activeVersion && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>Active Version (v{activeVersion.version})</span>
                    <span>Inspected Version (v{selectedVersion.version})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <pre className="p-4 bg-background border border-border/40 rounded-xl text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-[500px]">
                      {activeVersion.promptContent}
                    </pre>
                    <pre className="p-4 bg-primary/5 border border-primary/30 rounded-xl text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap max-h-[500px]">
                      {selectedVersion.promptContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* Standard Prompt Content View */}
              {!isDiffMode && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold uppercase tracking-wider">
                      Canonical Prompt Instructions
                    </span>
                    <span className="font-mono">
                      {selectedVersion.promptContent.length} chars (approx{" "}
                      {Math.ceil(selectedVersion.promptContent.length / 4)} tokens)
                    </span>
                  </div>
                  <div className="p-4 bg-background border border-border/40 rounded-xl overflow-x-auto">
                    <pre className="text-xs font-mono text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {selectedVersion.promptContent}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
