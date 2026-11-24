"use client";

import React, { useState, useTransition } from "react";
import { Service, PublishStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toggleServiceStatusAction } from "@/server/actions/cms";
import { Check, AlertCircle, RefreshCw, Eye } from "lucide-react";

interface ServiceManagerClientProps {
  initialServices: Service[];
}

export function ServiceManagerClient({ initialServices }: ServiceManagerClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleToggleStatus = (serviceId: string, currentStatus: PublishStatus) => {
    const nextStatus =
      currentStatus === PublishStatus.PUBLISHED
        ? PublishStatus.DRAFT
        : PublishStatus.PUBLISHED;

    startTransition(async () => {
      try {
        const result = await toggleServiceStatusAction(serviceId, nextStatus);
        if (result.success && result.service) {
          setServices((prev) =>
            prev.map((s) => (s.id === serviceId ? (result.service as Service) : s))
          );
          setFeedback({
            type: "success",
            message: `Service status updated to ${nextStatus}. Cache revalidated.`,
          });
        }
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err?.message || "Failed to update service status",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
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

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[var(--muted-foreground)]">
              <tr>
                <th className="py-3 px-4 font-semibold w-12 text-center">#</th>
                <th className="py-3 px-4 font-semibold">Service Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Slug</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <td className="py-3 px-4 text-center font-mono font-bold text-[var(--muted-foreground)]">
                    {service.displayOrder}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[var(--foreground)]">
                      {service.name}
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)] truncate max-w-md mt-0.5">
                      {service.shortDescription}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={service.category === "CORE" ? "primary" : "outline"}
                      size="sm"
                    >
                      {service.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-[var(--muted-foreground)]">
                    /services/{service.slug}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        service.status === PublishStatus.PUBLISHED
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/api/preview?path=/services/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)] hover:text-[var(--primary)] px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Preview</span>
                      </a>

                      <Button
                        variant={service.status === PublishStatus.PUBLISHED ? "outline" : "primary"}
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleToggleStatus(service.id, service.status)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        {isPending && <RefreshCw className="h-3 w-3 animate-spin mr-1" />}
                        {service.status === PublishStatus.PUBLISHED ? "Unpublish" : "Publish"}
                      </Button>
                    </div>
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
