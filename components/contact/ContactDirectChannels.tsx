import React from "react";
import {
  Mail,
  MapPin,
  Clock,
  FileCheck2,
  Lock,
  Headphones,
} from "lucide-react";

export function ContactDirectChannels({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Contact Card */}
      <div className="rounded-3xl border border-surface-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Direct Communication
          </span>
          <h2 className="text-xl font-bold text-foreground font-display mt-1">
            Office &amp; Contacts
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Our technology team is based in Nairobi, Kenya, serving businesses
            across East Africa and worldwide.
          </p>
        </div>

        <div className="space-y-4 pt-2 border-t border-surface-border/60">
          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">
                Official Enquiry Email
              </span>
              <a
                href="mailto:info@megascriptdigital.co.ke"
                className="text-sm text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                info@megascriptdigital.co.ke
              </a>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                Monitored by technology leads continuously
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">
                Office Location
              </span>
              <span className="text-sm text-foreground">
                Nairobi, Kenya
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                East Africa Time (EAT / UTC+3)
              </span>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">
                Operational Hours
              </span>
              <span className="text-sm text-foreground">
                Monday &ndash; Friday
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                8:00 AM &ndash; 5:00 PM EAT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Guarantees Card */}
      <div className="rounded-3xl border border-surface-border bg-surface-subtle p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Our Operational Guarantees
        </h3>

        <div className="space-y-3.5 text-xs text-muted-foreground">
          <div className="flex items-start gap-3">
            <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="text-foreground block">
                Strict Non-Disclosure (NDA)
              </strong>
              <span>
                We readily sign bilateral NDAs before discussing proprietary IP,
                architecture blueprints, or internal datasets.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileCheck2 className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="text-foreground block">
                Transparent Milestone Scoping
              </strong>
              <span>
                All proposals provide itemized technical deliverables, clear
                milestones, and binding timelines without hidden surprises.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Headphones className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="text-foreground block">
                Direct Engineering Collaboration
              </strong>
              <span>
                No non-technical intermediaries. You discuss requirements directly
                with senior engineers building your systems.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
