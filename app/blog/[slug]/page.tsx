import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { BLOG_POSTS_DATA } from "@/config/blog-data";
import {
  getPublishedBlogPostBySlug,
  getBlogPostBySlug,
} from "@/server/services/cms/blog";
import { ArticleContent } from "@/components/blog/ArticleContent";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = BLOG_POSTS_DATA[params.slug];

  if (!post) {
    return {
      title: "Article Not Found | MegaScript Digital",
    };
  }

  const canonicalUrl = `https://megascriptdigital.co.ke/blog/${params.slug}`;

  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      url: canonicalUrl,
      siteName: "MegaScript Digital",
      locale: "en_KE",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const isDraft = draftMode().isEnabled;
  const staticData = BLOG_POSTS_DATA[params.slug];

  // 1. Fetch DB record if present
  let dbPost = null;
  try {
    if (isDraft) {
      dbPost = await getBlogPostBySlug(params.slug);
    } else {
      dbPost = await getPublishedBlogPostBySlug(params.slug);
    }
  } catch (err) {
    console.error("Failed to query blog post by slug from DB:", err);
  }

  // If in public mode and database explicitly marked this record as DRAFT, return 404
  if (!isDraft && dbPost && dbPost.status !== "PUBLISHED") {
    notFound();
  }

  // If article not found in static data and no db post, 404
  if (!staticData && !dbPost) {
    notFound();
  }

  // Compose active post data
  const post = staticData
    ? {
        ...staticData,
        title: dbPost?.title || staticData.title,
        excerpt: dbPost?.excerpt || staticData.excerpt,
      }
    : {
        slug: dbPost!.slug,
        title: dbPost!.title,
        excerpt: dbPost!.excerpt,
        category: dbPost!.category?.name || "Technology",
        categorySlug: "web-development" as const,
        tags: dbPost!.tags?.map((t: any) => t.name) || [],
        author: dbPost!.authorName || "MegaScript Editorial Team",
        authorRole: "Digital Engineering Specialists",
        readingTime: "5 min read",
        publishedAt: dbPost!.publishedAt
          ? new Date(dbPost!.publishedAt).toISOString().split("T")[0]
          : "2026-11-20",
        sections: [{ heading: "Overview", content: dbPost!.body }],
        keyTakeaways: ["Review standard implementation guidelines."],
        relatedServiceSlug: "website-development-seo",
        seo: {
          title: `${dbPost!.title} | MegaScript Digital`,
          description: dbPost!.excerpt,
        },
      };

  // Find related articles (same category first, excluding self)
  const allPosts = Object.values(BLOG_POSTS_DATA).filter((p) => p.slug !== post.slug);
  const sameCategoryPosts = allPosts.filter((p) => p.categorySlug === post.categorySlug);
  const otherPosts = allPosts.filter((p) => p.categorySlug !== post.categorySlug);
  const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 2);

  return (
    <main id="main-content">
      {/* Draft Mode Notice Banner */}
      {isDraft && (
        <aside
          aria-label="Draft Preview Banner"
          className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2"
        >
          <span>Admin Draft Mode Enabled: Viewing unpublished article revisions.</span>
          <a
            href="/api/preview/disable?path=/blog"
            className="underline ml-2 hover:text-black"
          >
            Exit Preview
          </a>
        </aside>
      )}

      <ArticleContent post={post} relatedPosts={relatedPosts} />
    </main>
  );
}

