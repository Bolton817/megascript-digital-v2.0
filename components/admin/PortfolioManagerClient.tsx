"use client";

import React, { useState, useTransition } from "react";
import { PortfolioProject, PublishStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  togglePortfolioStatusAction,
  togglePortfolioFeaturedAction,
} from "@/server/actions/cms";
import { Check, AlertCircle, RefreshCw, Star, ShieldAlert } from "lucide-react";

interface PortfolioManagerClientProps {
  initialProjects: PortfolioProject[];
}

export function PortfolioManagerClient({ initialProjects }: PortfolioManagerClientProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const featuredCount = projects.filter((p) => p.isFeatured).length;

  const handleToggleStatus = (projectId: string, currentStatus: PublishStatus) => {
    const nextStatus =
      currentStatus === PublishStatus.PUBLISHED
        ? PublishStatus.DRAFT
        : PublishStatus.PUBLISHED;

    startTransition(async () => {
      try {
        const result = await togglePortfolioStatusAction(projectId, nextStatus);
        if (result.success && result.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? (result.project as PortfolioProject) : p))
          );
          setFeedback({
            type: "success",
            message: `Project status updated to ${nextStatus}. Homepage revalidated.`,
          });
        }
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err?.message || "Failed to update project status",
        });
      }
    });
  };

  const handleToggleFeatured = (projectId: string, currentFeatured: boolean) => {
    startTransition(async () => {
      try {
        const result = await togglePortfolioFeaturedAction(projectId, !currentFeatured);
        if (result.success && result.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? (result.project as PortfolioProject) : p))
          );
          setFeedback({
            type: "success",
            message: `Homepage featured status updated.`,
          });
        }
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err?.message || "Failed to update featured flag",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* TDD Compliance Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <strong className="font-bold">
            TDD Specification Sheets 042 &amp; 058 Directives:
          </strong>
          <p className="leading-relaxed">
            Strictly zero portfolio project screenshots and zero technology stack labels. Client engagements are presented solely through brand mark / monogram, sector, verified business challenge, delivered scope, and optional external live URL.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary bar */}
      <div className="flex items-center justify-between px-2 text-xs text-[var(--muted-foreground)]">
        <div>
          Total Projects: <strong className="text-[var(--foreground)]">{projects.length}</strong>
        </div>
        <div>
          Featured on Homepage:{" "}
          <strong className="text-[var(--primary)]">{featuredCount} / 4 target</strong>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[var(--muted-foreground)]">
              <tr>
                <th className="py-3 px-4 font-semibold w-12 text-center">#</th>
                <th className="py-3 px-4 font-semibold">Business Name</th>
                <th className="py-3 px-4 font-semibold">Industry</th>
                <th className="py-3 px-4 font-semibold">Featured</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <td className="py-3 px-4 text-center font-mono font-bold text-[var(--muted-foreground)]">
                    {project.displayOrder}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[var(--foreground)]">
                      {project.businessName}
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)] truncate max-w-sm mt-0.5">
                      {project.businessDescription}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" size="sm">
                      {project.industry}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleToggleFeatured(project.id, project.isFeatured)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        project.isFeatured
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-semibold"
                          : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          project.isFeatured ? "fill-[var(--primary)]" : ""
                        }`}
                      />
                      <span>{project.isFeatured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === PublishStatus.PUBLISHED
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant={project.status === PublishStatus.PUBLISHED ? "outline" : "primary"}
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleToggleStatus(project.id, project.status)}
                      className="text-[11px] h-7 px-2.5"
                    >
                      {isPending && <RefreshCw className="h-3 w-3 animate-spin mr-1" />}
                      {project.status === PublishStatus.PUBLISHED ? "Unpublish" : "Publish"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
