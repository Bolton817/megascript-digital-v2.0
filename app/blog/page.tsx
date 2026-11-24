import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BLOG_POSTS_DATA, BlogPostData } from "@/config/blog-data";
import { getPublishedBlogPosts } from "@/server/services/cms/blog";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogFilterGrid } from "@/components/blog/BlogFilterGrid";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Practical Digital & Technology Guides | MegaScript Digital Blog",
  description:
    "Engineering insights, web architecture guides, M-Pesa integration practices, and local business digital strategy from MegaScript Digital Kenya.",
  alternates: {
    canonical: "https://megascriptdigital.co.ke/blog",
  },
  openGraph: {
    title: "Practical Digital & Technology Guides | MegaScript Digital Blog",
    description:
      "Engineering insights, web architecture guides, M-Pesa integration practices, and local business digital strategy from MegaScript Digital Kenya.",
    url: "https://megascriptdigital.co.ke/blog",
    siteName: "MegaScript Digital",
    locale: "en_KE",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  // Query DB published articles
  let dbPosts: any[] = [];
  try {
    dbPosts = await getPublishedBlogPosts();
  } catch (error) {
    console.error("Failed to query blog posts from DB:", error);
  }

  const dbPostMap = new Map(dbPosts.map((p) => [p.slug, p]));

  // Combine database published state with rich static articles
  const postsList: BlogPostData[] = Object.values(BLOG_POSTS_DATA).map((staticPost) => {
    const dbPost = dbPostMap.get(staticPost.slug);
    if (!dbPost) return staticPost;

    return {
      ...staticPost,
      title: dbPost.title || staticPost.title,
      excerpt: dbPost.excerpt || staticPost.excerpt,
      publishedAt: dbPost.publishedAt
        ? new Date(dbPost.publishedAt).toISOString().split("T")[0]
        : staticPost.publishedAt,
    };
  });

  return (
    <main id="main-content" className="min-h-screen pb-16 sm:pb-24">
      {/* Blog Hero */}
      <BlogHero />

      {/* Main Filterable Article Grid */}
      <Section spacing="lg" variant="default" id="articles">
        <Container size="lg">
          <BlogFilterGrid initialPosts={postsList} />

          {/* Editorial Integrity Disclosure */}
          <div className="mt-16 p-6 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-start gap-4 text-xs text-[var(--muted-foreground)]">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-[var(--foreground)] font-semibold">
                Editorial &amp; Architectural Integrity:
              </strong>
              <p className="leading-relaxed">
                All guides published by MegaScript Digital are written from real production engineering experience in the Kenyan market. We do not publish automated keyword filler, unvetted affiliate content, or speculative benchmarks. Every guide focuses on practical technical patterns and measurable business clarity.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
