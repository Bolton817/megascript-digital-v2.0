import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { SERVICES_DATA } from "@/config/services-data";
import { getPublishedServiceBySlug, getServiceBySlug } from "@/server/services/cms/services";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceDeliverables } from "@/components/services/ServiceDeliverables";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = SERVICES_DATA[params.slug];

  if (!service) {
    return {
      title: "Service Not Found | MegaScript Digital",
    };
  }

  const canonicalUrl = `https://megascriptdigital.co.ke/services/${params.slug}`;

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      url: canonicalUrl,
      siteName: "MegaScript Digital",
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.seo.title,
      description: service.seo.description,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const isDraft = draftMode().isEnabled;
  const staticData = SERVICES_DATA[params.slug];

  if (!staticData) {
    notFound();
  }

  // Query database CMS for any overridden copy or publishing status
  const dbService = isDraft
    ? await getServiceBySlug(params.slug)
    : await getPublishedServiceBySlug(params.slug);

  // If in standard public mode, and database explicitly marked this service as DRAFT, return 404
  if (!isDraft && dbService && dbService.status !== "PUBLISHED") {
    notFound();
  }

  // Marry database details with static data
  const service = {
    ...staticData,
    name: dbService?.name || staticData.name,
    shortDescription: dbService?.shortDescription || staticData.shortDescription,
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Draft Mode Notice Banner */}
      {isDraft && (
        <aside
          aria-label="Draft Preview Banner"
          className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2"
        >
          <span>Admin Draft Mode Enabled: Viewing unpublished service revisions.</span>
          <a
            href="/api/preview/disable?path=/services"
            className="underline ml-2 hover:text-black"
          >
            Exit Preview
          </a>
        </aside>
      )}

      {/* Hero Section */}
      <ServiceHero service={service} />

      {/* Deliverables / Scope Boundaries */}
      <ServiceDeliverables
        includedStandard={service.includedStandard}
        customScoped={service.customScoped}
        serviceName={service.name}
      />

      {/* Process Roadmap */}
      <ServiceProcess steps={service.processSteps} serviceName={service.name} />

      {/* Frequently Asked Questions */}
      <ServiceFaq faqs={service.faqs} serviceName={service.name} />

      {/* Conversion CTA */}
      <ServiceCta cta={service.cta} />
    </main>
  );
}
