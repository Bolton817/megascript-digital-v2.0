"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Pause, Play, ShieldCheck, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface TestimonialItem {
  id: string;
  quote: string;
  clientName: string;
  role: string;
  organization: string;
  projectScope?: string | null;
}

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isHoveredRef = useRef(false);

  const hasTestimonials = testimonials && testimonials.length > 0;

  const nextSlide = useCallback(() => {
    if (!hasTestimonials) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [hasTestimonials, testimonials.length]);

  const prevSlide = useCallback(() => {
    if (!hasTestimonials) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [hasTestimonials, testimonials.length]);

  useEffect(() => {
    if (!isPlaying || !hasTestimonials) return;

    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        nextSlide();
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [isPlaying, hasTestimonials, nextSlide]);

  const current = hasTestimonials ? testimonials[currentIndex] : null;

  return (
    <Section
      spacing="lg"
      variant="subtle"
      id="testimonials"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <Container size="lg">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
              Client Perspectives
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              {hasTestimonials ? "What Our Partners Say" : "Client Partnership Standards"}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {hasTestimonials
                ? "Verifiable feedback from business owners and operational leaders who rely on MegaScript Digital."
                : "Honest feedback standards and direct reference integrity for all client engagements."}
            </p>
          </div>

          <Link href="/portfolio" className="self-start md:self-auto">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Explore Verified Work
            </Button>
          </Link>
        </div>

        {/* Dynamic Presentation: Live Testimonials Carousel OR Graceful Empty State */}
        {hasTestimonials && current ? (
          <div className="relative rounded-3xl border border-surface-border bg-surface p-8 sm:p-14 shadow-card transition-all duration-300">
            <div className="max-w-3xl mx-auto space-y-8">
              <Quote className="h-10 w-10 text-primary/30" aria-hidden="true" />
              
              <blockquote className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed font-display">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-surface-border">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {current.clientName}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {current.role} &bull; <span className="font-semibold text-foreground/90">{current.organization}</span>
                  </p>
                  {current.projectScope && (
                    <span className="inline-block mt-1 text-[11px] font-mono text-primary bg-primary-subtle px-2 py-0.5 rounded">
                      Scope: {current.projectScope}
                    </span>
                  )}
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-2" role="group" aria-label="Testimonial controls">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous testimonial"
                    className="p-2 rounded-full border border-surface-border bg-surface hover:bg-surface-subtle text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? "Pause carousel auto-play" : "Resume carousel auto-play"}
                    className="p-2 rounded-full border border-surface-border bg-surface hover:bg-surface-subtle text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next testimonial"
                    className="p-2 rounded-full border border-surface-border bg-surface hover:bg-surface-subtle text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Graceful, Truthful Client Partnership Integrity Section */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight font-display">
                Direct References on Request
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Because our client engagements involve real business operations, internal tools, and private ledgers, we provide direct contact references to qualified prospective partners during proposal review.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight font-display">
                Verified Live Deployments
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We believe in proof over rhetoric. Every portfolio entry links directly to a live, working production website delivered by MegaScript Digital across East Africa for public inspection.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight font-display">
                Complete Scope Accountability
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every client receives direct code repository custody, domain DNS ownership, milestone sign-offs, and recorded training walkthroughs without ongoing agency retainers.
              </p>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
