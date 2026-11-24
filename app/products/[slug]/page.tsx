import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/config/products-data";
import {
  getPublishedProductBySlug,
  getProductBySlug,
} from "@/server/services/cms/products";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductProblemSolution } from "@/components/products/ProductProblemSolution";
import { ProductVerifiedFeatures } from "@/components/products/ProductVerifiedFeatures";
import { ProductAudience } from "@/components/products/ProductAudience";
import { ProductFaq } from "@/components/products/ProductFaq";
import { ProductOutboundCta } from "@/components/products/ProductOutboundCta";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArrowLeft } from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(PRODUCTS_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = PRODUCTS_DATA[params.slug];

  if (!product) {
    return {
      title: "Product Not Found | MegaScript Digital",
    };
  }

  const canonicalUrl = `https://megascriptdigital.co.ke/products/${params.slug}`;

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      url: canonicalUrl,
      siteName: "MegaScript Digital",
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo.title,
      description: product.seo.description,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const isDraft = draftMode().isEnabled;
  const staticData = PRODUCTS_DATA[params.slug];

  if (!staticData) {
    notFound();
  }

  // Query database CMS for any overridden copy or publishing status
  const dbProduct = isDraft
    ? await getProductBySlug(params.slug)
    : await getPublishedProductBySlug(params.slug);

  // If in standard public mode, and database explicitly marked this product as DRAFT, return 404
  if (!isDraft && dbProduct && dbProduct.status !== "PUBLISHED") {
    notFound();
  }

  // Live outbound URL takes precedence from DB if configured, otherwise falls back to static default
  const liveOutboundUrl = dbProduct?.outboundUrl ?? staticData.defaultOutboundUrl;

  // Marry database details with static data
  const product = {
    ...staticData,
    name: dbProduct?.name || staticData.name,
    tagline: dbProduct?.tagline || staticData.tagline,
    overview: dbProduct?.overview || staticData.overview,
    audience: dbProduct?.audience || staticData.audience,
    ctaLabel: dbProduct?.ctaLabel || staticData.ctaLabel,
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Draft Mode Notice Banner */}
      {isDraft && (
        <aside
          aria-label="Draft Preview Banner"
          className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2"
        >
          <span>Admin Draft Mode Enabled: Viewing unpublished product revisions.</span>
          <a
            href="/api/preview/disable?path=/products"
            className="underline ml-2 hover:text-black"
          >
            Exit Preview
          </a>
        </aside>
      )}

      {/* Hero Section */}
      <ProductHero product={product} outboundUrl={liveOutboundUrl} />

      {/* Problem & Solution Comparison */}
      <ProductProblemSolution
        productName={product.name}
        problem={product.problem}
        solution={product.solution}
      />

      {/* Verified MVP Features */}
      <ProductVerifiedFeatures
        productName={product.name}
        features={product.verifiedFeatures}
      />

      {/* Target Audience & Operational Benefits */}
      <ProductAudience
        productName={product.name}
        audience={product.audience}
        benefits={product.benefits}
      />

      {/* Frequently Asked Questions */}
      <ProductFaq faqs={product.faqs} productName={product.name} />

      {/* Bottom Conversion Section */}
      <Section spacing="lg" variant="default" className="border-t border-[var(--border)]">
        <Container size="lg">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] p-8 sm:p-14 text-center space-y-6 max-w-4xl mx-auto shadow-sm">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Ready to Experience {product.name}?
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
                Explore the dedicated {product.name} cloud platform or connect with our engineering team for an operational walkthrough.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <ProductOutboundCta
                productSlug={product.slug}
                productName={product.name}
                outboundUrl={liveOutboundUrl}
                ctaLabel={product.ctaLabel}
                size="lg"
              />

              <Link
                href="/products"
                className="inline-flex items-center text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] gap-2 py-2 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>All Software Products</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
