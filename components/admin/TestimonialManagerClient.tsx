"use client";

import React, { useState, useTransition } from "react";
import { Testimonial, PublishStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toggleTestimonialApprovalAction } from "@/server/actions/cms";
import {
  Check,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  FileCheck,
  Building,
} from "lucide-react";

interface TestimonialManagerClientProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialManagerClient({
  initialTestimonials,
}: TestimonialManagerClientProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleToggleApproval = (id: string, currentApproval: boolean) => {
    setFeedback(null);
    startTransition(async () => {
      try {
        const nextApproval = !currentApproval;
        const res = await toggleTestimonialApprovalAction(id, nextApproval);
        if (res.success && res.testimonial) {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === id ? (res.testimonial as Testimonial) : t))
          );
          setFeedback({
            type: "success",
            message: `Updated approval status for "${res.testimonial.clientName}".`,
          });
        }
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err.message || "Failed to update testimonial status.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Policy Banner (TDD Sheet 063 & Sheet 176) */}
      <div className="p-5 rounded-2xl bg-surface-muted border border-border flex items-start gap-4">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-muted-foreground">
          <strong className="text-foreground font-semibold text-sm block">
            Zero Fabricated Reviews Policy (TDD Sheet 063 &amp; Sheet 176 Task 55)
          </strong>
          <p className="leading-relaxed">
            MegaScript Digital strictly enforces truthful client endorsements. A testimonial cannot be published without verified, recorded approval evidence (written email consent, verified contract permission, or signed client communication). Unapproved reviews are strictly withheld from public queries.
          </p>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
              : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="hover:opacity-75 focus-visible:outline-none"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-muted-foreground font-semibold">
                <th scope="col" className="py-3.5 px-4 sm:px-6">Client / Organization</th>
                <th scope="col" className="py-3.5 px-4">Quote Excerpt</th>
                <th scope="col" className="py-3.5 px-4">Approval Evidence</th>
                <th scope="col" className="py-3.5 px-4 text-center">Approval State</th>
                <th scope="col" className="py-3.5 px-4 text-center">Publish Status</th>
                <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => {
                  return (
                    <tr
                      key={testimonial.id}
                      className="hover:bg-surface-muted/30 transition-colors"
                    >
                      {/* Client / Organization */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-foreground">
                            {testimonial.clientName}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Building className="h-3 w-3 shrink-0" />
                            <span>
                              {testimonial.organization}
                              {testimonial.role ? ` • ${testimonial.role}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Quote Excerpt */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-foreground italic line-clamp-2 leading-relaxed">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                      </td>

                      {/* Approval Evidence */}
                      <td className="py-4 px-4 max-w-xs">
                        {testimonial.approvalEvidence ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <FileCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate" title={testimonial.approvalEvidence}>
                              {testimonial.approvalEvidence}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                            <span className="italic">No evidence recorded</span>
                          </div>
                        )}
                      </td>

                      {/* Approval State */}
                      <td className="py-4 px-4 text-center">
                        {testimonial.isApproved ? (
                          <Badge variant="primary" size="sm" className="font-semibold">
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm" className="text-amber-600 border-amber-500/30">
                            Unapproved
                          </Badge>
                        )}
                      </td>

                      {/* Publish Status */}
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant={
                            testimonial.status === PublishStatus.PUBLISHED ? "neutral" : "outline"
                          }
                          size="sm"
                        >
                          {testimonial.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <Button
                          variant={testimonial.isApproved ? "outline" : "primary"}
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            handleToggleApproval(testimonial.id, testimonial.isApproved)
                          }
                          className="text-xs h-8 px-3"
                        >
                          {isPending ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : testimonial.isApproved ? (
                            <span>Revoke Approval</span>
                          ) : (
                            <span>Approve &amp; Publish</span>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground space-y-2"
                  >
                    <MessageSquare className="h-8 w-8 mx-auto opacity-40" />
                    <p className="font-medium">No testimonials found in database.</p>
                    <p className="text-[11px]">
                      Testimonials require recorded client approval evidence before publication.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
