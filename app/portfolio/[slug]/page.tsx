import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { PORTFOLIO_PROJECTS_DATA } from "@/config/portfolio-data";
import {
  getPublishedPortfolioProjectBySlug,
  getPortfolioProjectBySlug,
} from "@/server/services/cms/portfolio";
import { PortfolioDetailHero } from "@/components/portfolio/PortfolioDetailHero";
import { PortfolioScopeBreakdown } from "@/components/portfolio/PortfolioScopeBreakdown";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArrowLeft } from "lucide-react";

interface PortfolioPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(PORTFOLIO_PROJECTS_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const project = PORTFOLIO_PROJECTS_DATA[params.slug];

  if (!project) {
    return {
      title: "Case Profile Not Found | MegaScript Digital",
    };
  }

  const canonicalUrl = `https://megascriptdigital.co.ke/portfolio/${params.slug}`;

  return {
    title: project.seo.title,
    description: project.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      url: canonicalUrl,
      siteName: "MegaScript Digital",
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title,
      description: project.seo.description,
    },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioPageProps) {
  const isDraft = draftMode().isEnabled;
  const staticData = PORTFOLIO_PROJECTS_DATA[params.slug];

  if (!staticData) {
    notFound();
  }

  // Query database CMS for any overridden details or publishing status
  const dbProject = isDraft
    ? await getPortfolioProjectBySlug(params.slug)
    : await getPublishedPortfolioProjectBySlug(params.slug);

  // If in public mode and database explicitly marked this record as DRAFT, return 404
  if (!isDraft && dbProject && dbProject.status !== "PUBLISHED") {
    notFound();
  }

  // Marry database details with rich static case specifications
  const project = {
    ...staticData,
    businessName: dbProject?.businessName || staticData.businessName,
    industry: dbProject?.industry || staticData.industry,
    businessDescription: dbProject?.businessDescription || staticData.businessDescription,
    deliveredWork: dbProject?.deliveredWork || staticData.deliveredWork,
    externalUrl: dbProject?.externalUrl ?? staticData.externalUrl,
    isFeatured: dbProject?.isFeatured ?? staticData.isFeatured,
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Draft Mode Notice Banner */}
      {isDraft && (
        <aside
          aria-label="Draft Preview Banner"
          className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2"
        >
          <span>Admin Draft Mode Enabled: Viewing unpublished portfolio revisions.</span>
          <a
            href="/api/preview/disable?path=/portfolio"
            className="underline ml-2 hover:text-black"
          >
            Exit Preview
          </a>
        </aside>
      )}

      {/* Case Profile Hero */}
      <PortfolioDetailHero project={project} />

      {/* Scope Breakdown & Deliverables */}
      <PortfolioScopeBreakdown project={project} />

      {/* Back to All Projects Navigation */}
      <Section spacing="sm" variant="default" className="border-t border-[var(--border)]">
        <Container size="lg">
          <div className="flex items-center justify-between">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All 11 Client Engagements</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] py-2.5 px-4 rounded-xl transition-colors shadow-xs"
            >
              <span>Start Your Project</span>
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
