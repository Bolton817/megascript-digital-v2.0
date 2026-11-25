"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, BarChart2, ListFilter, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ExportModal } from "@/components/admin/ExportModal";

interface LeadsHeaderActionsProps {
  currentTab: "list" | "reporting";
  userCanExport: boolean;
}

export function LeadsHeaderActions({
  currentTab,
  userCanExport,
}: LeadsHeaderActionsProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-xl border border-border bg-surface-muted/30 p-1 text-xs">
          <Link
            href="/master/leads?tab=list"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              currentTab === "list"
                ? "bg-surface shadow-sm text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Inquiry Queue</span>
          </Link>
          <Link
            href="/master/leads?tab=reporting"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              currentTab === "reporting"
                ? "bg-surface shadow-sm text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Response &amp; Source Analytics</span>
          </Link>
        </div>

        {/* Export Action (Task 98) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExportOpen(true)}
          className="text-xs gap-1.5"
          title={userCanExport ? "Export CRM Leads" : "Export restricted to Administrator roles"}
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Leads</span>
        </Button>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        exportType="leads"
        userCanExport={userCanExport}
      />
    </>
  );
}
