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
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium mb-3">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Commercial &amp; Technical Clarity</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions About {serviceName}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Straightforward answers regarding process, asset ownership, commercial boundaries, and delivery expectations.
          </p>
        </div>

        <div className="max-w-3xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-card divide-y divide-border">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-content-${idx}`;
            const headerId = `faq-header-${idx}`;

            return (
              <div key={idx} className="py-4 sm:py-5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
                >
                  <span className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-xl bg-surface-muted text-muted-foreground group-hover:text-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 bg-primary/10 text-primary" : ""
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
                    className="pt-3 pr-6 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1"
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
