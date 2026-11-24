import React from "react";
import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { DifferentiatorsSection } from "@/components/home/DifferentiatorsSection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { ServicesPreviewSection } from "@/components/home/ServicesPreviewSection";
import { ProductsPreviewSection } from "@/components/home/ProductsPreviewSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturedPortfolioSection } from "@/components/home/FeaturedPortfolioSection";
import { HowToGetStartedSection } from "@/components/home/HowToGetStartedSection";
import { PricingExpectationsSection } from "@/components/home/PricingExpectationsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "MegaScript Digital | Modern Digital Engineering & Growth Partner",
  description:
    "We engineer resilient websites, custom web applications, and mobile digital solutions across East Africa. Fast, secure, and revenue-driving digital platforms.",
  openGraph: {
    title: "MegaScript Digital | Modern Digital Engineering & Growth Partner",
    description:
      "Resilient corporate websites, custom web applications, and mobile digital solutions built for East African businesses.",
    url: "https://megascriptdigital.co.ke",
    siteName: "MegaScript Digital",
    locale: "en_KE",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main id="main-content" className="flex flex-col w-full min-h-screen">
      {/* 01. Hero Section (Sheet 035) */}
      <HeroSection />

      {/* 02. What We Do Section (Sheet 036) */}
      <WhatWeDoSection />

      {/* 03. What Makes Us Different (Sheet 037) */}
      <DifferentiatorsSection />

      {/* 04. Who We Work With / Industries (Sheet 038) */}
      <IndustriesSection />

      {/* 05. Services Preview (Sheet 039) */}
      <ServicesPreviewSection />

      {/* 06. Featured Products Preview (Sheet 040) */}
      <ProductsPreviewSection />

      {/* 07. Client Testimonials Carousel (Sheet 041) */}
      <TestimonialsSection />

      {/* 08. Four Featured Portfolio Entries (Sheet 042) */}
      <FeaturedPortfolioSection />

      {/* 09. How to Get Started (Sheet 043) */}
      <HowToGetStartedSection />

      {/* 10. Transparent Pricing & Expectations (Sheet 044) */}
      <PricingExpectationsSection />

      {/* 11. Final CTA & Conversion Handoff (Sheet 045) */}
      <FinalCtaSection />
    </main>
  );
}
