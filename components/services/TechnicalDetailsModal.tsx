"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Terminal, ShieldAlert, CheckCircle2 } from "lucide-react";

interface TechnicalDetailsModalProps {
  modalData: {
    title: string;
    subtitle: string;
    sections: {
      heading: string;
      items: string[];
    }[];
  };
  triggerLabel?: string;
}

export function TechnicalDetailsModal({
  modalData,
  triggerLabel = "View Technical Specifications",
}: TechnicalDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="md"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-xs sm:text-sm"
      >
        <Terminal className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{triggerLabel}</span>
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalData.title}
        description={modalData.subtitle}
        maxWidth="lg"
      >
        <div className="space-y-6 pt-2">
          {modalData.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                {sec.heading}
              </h3>
              <ul className="space-y-2.5">
                {sec.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                  >
                    <CheckCircle2
                      className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-surface-muted border border-border flex items-start gap-3 text-xs text-muted-foreground mt-6">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-foreground font-semibold">
                Technical Governance &amp; Ownership:
              </strong>
              <p>
                All specifications, architectural boundaries, and third-party integrations are formally documented in our written engineering proposals. MegaScript Digital operates on full client asset ownership upon settlement.
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
