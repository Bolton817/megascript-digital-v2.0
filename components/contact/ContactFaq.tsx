import React from "react";
import { Container } from "@/components/ui/Container";

const CONTACT_FAQS = [
  {
    question: "What happens immediately after I submit an enquiry?",
    answer:
      "Your enquiry is logged in our secure CRM with a unique reference code (MSD-YYYY-XXXX) and dispatched to our technical leadership team. A senior software engineer or project director reviews your requirements, assesses feasibility, and replies within 24 business hours (Monday–Friday, 8:00 AM – 5:00 PM EAT).",
  },
  {
    question: "How do you calculate project pricing and timelines?",
    answer:
      "We provide itemized, fixed-price or milestone-based quotations derived from an explicit breakdown of features, architecture requirements, third-party integrations, and testing criteria. We do not provide vague ballparks; we offer predictable, binding estimates with transparent milestone deliverables.",
  },
  {
    question: "Can we sign a Non-Disclosure Agreement (NDA) first?",
    answer:
      "Yes. If your project involves proprietary intellectual property, trade secrets, unreleased algorithms, or commercial strategies, inform us in the form or via email. We will execute our standard bilateral NDA—or review your company's NDA—prior to reviewing confidential materials.",
  },
  {
    question: "How quickly can work on our project commence?",
    answer:
      "For standard websites and scoped web applications, technical discovery and sprints typically commence within 5 to 7 business days following milestone approval and agreement sign-off. Larger enterprise systems or multi-tier migrations follow a structured 2-week architectural planning sprint.",
  },
  {
    question: "Do you collaborate with international clients outside Kenya?",
    answer:
      "Yes. While headquartered in Nairobi, Kenya (East Africa Time / UTC+3), our team regularly collaborates with businesses, agencies, and founders in the United Kingdom, United States, Europe, and across the African continent utilizing modern asynchronous workflows, GitHub, Slack, and video discovery sessions.",
  },
  {
    question: "Can MegaScript Digital audit, take over, or modernize an existing codebase?",
    answer:
      "Yes. We frequently conduct code quality audits, performance reviews, security vulnerability scans, and modernizations for established applications built on Next.js, Node.js, React, Python, or legacy stacks. We provide written architectural assessments before beginning refactoring.",
  },
];

export function ContactFaq() {
  return (
    <section className="py-16 md:py-20 border-t border-surface-border bg-surface-subtle">
      <Container>
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display mt-2">
            Everything you need to know before reaching out
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Straight answers to common questions about our engagement model,
            timelines, and technical approach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CONTACT_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-surface-border bg-surface p-6 sm:p-7 shadow-sm space-y-2.5"
            >
              <h3 className="text-base font-bold text-foreground font-display leading-snug">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
