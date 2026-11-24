import React from "react";
import {
  ShoppingBag,
  Compass,
  Building2,
  Stethoscope,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Palette,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function IndustriesSection() {
  const industries = [
    {
      icon: <ShoppingBag className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Retail & E-Commerce",
      description: "Direct-to-consumer catalogs, inventory tracking, and automated M-Pesa & card checkouts.",
    },
    {
      icon: <Compass className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Tourism & Hospitality",
      description: "Safari itinerary builders, lodge showcases, and international booking enquiry systems.",
    },
    {
      icon: <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Real Estate & Property",
      description: "Verified property listings, tenant portals, and automated maintenance request workflows.",
    },
    {
      icon: <Stethoscope className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Healthcare & Clinics",
      description: "Patient appointment booking, specialist credentials, and high-trust medical practice sites.",
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Education & Academies",
      description: "Curriculum catalogs, student enrolment pipelines, and institutional resource portals.",
    },
    {
      icon: <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Financial & Advisory",
      description: "Corporate positioning, institutional authority, and compliant business enquiry capture.",
    },
    {
      icon: <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "NGOs & Non-Profits",
      description: "Transparent donor reporting, field impact storytelling, and community initiative hubs.",
    },
    {
      icon: <Palette className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Events & Creative",
      description: "Visual portfolio showcases, ticket reservation flows, and high-impact media production.",
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="industries">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            Sector Expertise
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Who We Work With
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Tailored engineering for ambitious East African businesses, growing regional brands, and mission-driven institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {industries.map((ind) => (
            <div
              key={ind.title}
              className="p-5 sm:p-6 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:bg-surface-subtle transition-all duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle border border-primary/20 mb-4">
                {ind.icon}
              </div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                {ind.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {ind.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
