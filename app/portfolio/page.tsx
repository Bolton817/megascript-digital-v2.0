import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PORTFOLIO_PROJECTS_DATA } from "@/config/portfolio-data";
import { getAllPortfolioProjects } from "@/server/services/cms/portfolio";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioFilterGrid } from "@/components/portfolio/PortfolioFilterGrid";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Portfolio & Case Studies | MegaScript Digital Kenya",
  description:
    "Explore verified client engagements engineered by MegaScript Digital across tours & safaris, financial advisory, community organizations, and hospitality.",
  alternates: {
    canonical: "https://megascriptdigital.co.ke/portfolio",
  },
};

export default async function PortfolioCatalogPage() {
  // Query database records for live status or external URL overrides
  const dbProjects = await getAllPortfolioProjects();
  const dbProjectMap = new Map(dbProjects.map((p) => [p.slug, p]));

  // Marry database records with rich static case specifications
  const projectsList = Object.values(PORTFOLIO_PROJECTS_DATA).map((staticProj) => {
    const dbProj = dbProjectMap.get(staticProj.slug);
    return {
      ...staticProj,
      businessName: dbProj?.businessName || staticProj.businessName,
      industry: dbProj?.industry || staticProj.industry,
      businessDescription: dbProj?.businessDescription || staticProj.businessDescription,
      deliveredWork: dbProj?.deliveredWork || staticProj.deliveredWork,
      externalUrl: dbProj?.externalUrl ?? staticProj.externalUrl,
      isFeatured: dbProj?.isFeatured ?? staticProj.isFeatured,
      displayOrder: dbProj?.displayOrder ?? staticProj.displayOrder,
    };
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <main id="main-content" className="min-h-screen pb-16 sm:pb-24">
      {/* Portfolio Hero */}
      <PortfolioHero />

      {/* Main Filterable Project Grid */}
      <Section spacing="lg" variant="default" id="catalog">
        <Container size="lg">
          <PortfolioFilterGrid initialProjects={projectsList} />

          {/* Compliance & Client Integrity Note */}
          <div className="mt-16 p-6 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-start gap-4 text-xs text-[var(--muted-foreground)]">
            <ShieldAlert className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-[var(--foreground)] font-semibold">
                Client Privacy &amp; Presentation Policy:
              </strong>
              <p className="leading-relaxed">
                MegaScript Digital presents client engagements exclusively through brand marks, verified business challenges, delivered technical scope, and live production URLs. In accordance with strict client data confidentiality and TDD Directives, we do not expose internal administrative credentials, proprietary analytics, or speculative metrics.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
