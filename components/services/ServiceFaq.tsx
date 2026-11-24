"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceFaqProps {
  faqs: FaqItem[];
  serviceName: string;
}

export function ServiceFaq({ faqs, serviceName }: ServiceFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <Section spacing="lg" variant="default" id="faqs">
      <Container size="lg">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-2">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Common Questions About {serviceName}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            Straightforward answers regarding process, ownership, commercial boundaries, and delivery expectations.
          </p>
        </div>

        <div className="max-w-3xl divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-content-${idx}`;
            const headerId = `faq-header-${idx}`;

            return (
              <div key={idx} className="py-4 sm:py-5">
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg p-1"
                >
                  <span className="text-base sm:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-[var(--surface-muted)] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="pt-3 pr-6 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
