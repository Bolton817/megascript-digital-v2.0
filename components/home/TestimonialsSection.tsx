"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Pause, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TestimonialItem {
  id: string;
  quote: string;
  clientName: string;
  role: string;
  organization: string;
  projectScope: string;
}

export function TestimonialsSection() {
  const testimonials: TestimonialItem[] = [
    {
      id: "1",
      quote:
        "MegaScript Digital engineered our competition portal with extreme precision. The registration flows and real-time live leaderboards operated without a glitch under heavy event traffic. Their technical rigor is unmatched.",
      clientName: "David K.",
      role: "Operations Director",
      organization: "Nairobi Fitness Wars",
      projectScope: "Event Registration & Leaderboard Engine",
    },
    {
      id: "2",
      quote:
        "Our safari itinerary presentation and international inquiry volume increased substantially after launching our new web platform with MegaScript. Fast loading, responsive, and completely owned by us.",
      clientName: "Grace W.",
      role: "Managing Director",
      organization: "Primeline Safaris",
      projectScope: "Luxury Safari Showcase & Inquiry Engine",
    },
    {
      id: "3",
      quote:
        "The attention to detail and security in our client acquisition workflow gave our luxury automotive brand the digital presence our clientele expects. No agency fluff—just direct engineering output.",
      clientName: "Antony M.",
      role: "Principal Concierge",
      organization: "Veloce Auto Concierge",
      projectScope: "VIP Vehicle Acquisition Portal",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isHoveredRef = useRef(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-advance carousel every 7 seconds, respecting hover and pause states
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        nextSlide();
      }
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  const current = testimonials[currentIndex];

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
              Client Perspectives
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              What Our Partners Say
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Verifiable feedback from business owners and operational leaders who rely on MegaScript Digital.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause testimonial auto-advance" : "Resume testimonial auto-advance"}
              className="h-10 w-10 p-0 rounded-xl"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="h-10 w-10 p-0 rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="h-10 w-10 p-0 rounded-xl"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Slide Card */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Client Testimonials"
          className="relative min-h-[260px] p-8 sm:p-12 rounded-3xl bg-surface border border-surface-border shadow-xs flex flex-col justify-between"
        >
          <Quote className="h-10 w-10 text-primary/20 mb-6 shrink-0" aria-hidden="true" />

          <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground leading-relaxed max-w-4xl">
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <div className="mt-8 pt-6 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-base font-bold text-foreground">
                {current.clientName}
              </div>
              <div className="text-sm text-muted-foreground">
                {current.role}, <strong className="text-foreground/90 font-semibold">{current.organization}</strong>
              </div>
            </div>

            <Badge variant="outline" className="self-start sm:self-auto text-xs text-muted-foreground">
              Scope: {current.projectScope}
            </Badge>
          </div>

          {/* Pagination Indicators */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1} of ${testimonials.length}`}
                aria-current={currentIndex === idx ? "true" : "false"}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  currentIndex === idx ? "w-8 bg-primary" : "w-2 bg-surface-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
