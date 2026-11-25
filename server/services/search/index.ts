/**
 * Global Published Content Search Service
 * Authoritative Reference: TDD Sheets 015 & 131, Task 84
 * - Searches published services, products, blog posts, portfolio case studies, and static pages
 * - Strictly isolates drafts, archived rows, and admin private data
 * - Computes multi-factor relevance ranking
 */

import { db } from "@/server/db";
import { PublishStatus } from "@prisma/client";

export type SearchContentType = "all" | "service" | "product" | "blog" | "portfolio" | "page";

export interface SearchResultItem {
  id: string;
  type: "service" | "product" | "blog" | "portfolio" | "page";
  title: string;
  excerpt: string;
  route: string;
  badge: string;
  category?: string;
  score: number;
}

export interface SearchOptions {
  query: string;
  type?: SearchContentType;
  limit?: number;
}

const STATIC_CORE_PAGES: Array<{
  id: string;
  title: string;
  excerpt: string;
  route: string;
  keywords: string[];
}> = [
  {
    id: "page-home",
    title: "MegaScript Digital - Bespoke Software & Digital Engineering",
    excerpt: "Nairobi-based digital engineering agency crafting high-performance corporate websites, scalable web applications, and custom mobile platforms.",
    route: "/",
    keywords: ["home", "agency", "nairobi", "kenya", "engineering", "websites", "web apps", "custom software"],
  },
  {
    id: "page-about",
    title: "About MegaScript Digital - Engineering Rigour & Purpose",
    excerpt: "Learn about our mission, Kenyan market craftsmanship, agile engineering standards, and leadership team in Nairobi.",
    route: "/about",
    keywords: ["about", "mission", "team", "vision", "leadership", "bihi towers", "nairobi", "agile"],
  },
  {
    id: "page-services",
    title: "Services Catalog - Web, App & Mobile Development",
    excerpt: "Explore our full scope of core engineering services, SEO architecture, custom web applications, and complementary digital design.",
    route: "/services",
    keywords: ["services", "web development", "seo", "web apps", "mobile apps", "graphic design", "video editing"],
  },
  {
    id: "page-products",
    title: "Proprietary Products - Fortress, LeaseFlow, UzaDigital & FM Scheduler",
    excerpt: "Discover our in-house enterprise SaaS platforms including Fortress AI website builder, LeaseFlow property management, and UzaDigital POS.",
    route: "/products",
    keywords: ["products", "software", "saas", "fortress", "leaseflow", "uzadigital", "fm scheduler", "tools"],
  },
  {
    id: "page-portfolio",
    title: "Client Portfolio - Real-World Deployments & Case Studies",
    excerpt: "Review our delivered client projects spanning eco-safaris, private equity syndicates, bespoke art galleries, and enterprise solutions.",
    route: "/portfolio",
    keywords: ["portfolio", "case studies", "work", "clients", "lucky house safaris", "luminary mtaji", "skrach art"],
  },
  {
    id: "page-contact",
    title: "Contact Us & Project Discovery Enquiry",
    excerpt: "Get in touch with our engineering team at Bihi Towers, Nairobi. Request formal project quotations, architectural discovery, or consultations.",
    route: "/contact",
    keywords: ["contact", "enquiry", "quote", "pricing", "consultation", "email", "phone", "whatsapp", "bihi towers"],
  },
  {
    id: "page-blog",
    title: "Insights & Technical Blog",
    excerpt: "Articles and guides on web architecture, M-Pesa API integrations, Google Maps local visibility, and digital transformation.",
    route: "/blog",
    keywords: ["blog", "articles", "insights", "m-pesa", "seo", "tutorials", "guides"],
  },
  {
    id: "page-wow",
    title: "MegaScript Digital Wow Factors & Differentiators",
    excerpt: "Interactive demonstration of our design excellence, sub-second performance budgets, security posture, and engineering craftsmanship.",
    route: "/wow-factors",
    keywords: ["wow factors", "performance", "craftsmanship", "interactive", "design", "speed", "quality"],
  },
];

/**
 * Searches published content across all modules with strict draft isolation.
 */
export async function searchPublishedContent(
  options: SearchOptions
): Promise<{ results: SearchResultItem[]; total: number; query: string }> {
  const cleanQuery = options.query?.trim().toLowerCase() || "";
  const typeFilter = options.type || "all";
  const limit = Math.min(Math.max(options.limit || 10, 1), 50);

  if (!cleanQuery || cleanQuery.length < 2) {
    return { results: [], total: 0, query: cleanQuery };
  }

  const queryTerms = cleanQuery.split(/\s+/).filter((t) => t.length > 1);
  const results: SearchResultItem[] = [];

  // Helper to score text matches
  const calculateScore = (title: string, summary: string, bodyText: string = "", keywords: string[] = []) => {
    let score = 0;
    const lowerTitle = title.toLowerCase();
    const lowerSummary = summary.toLowerCase();
    const lowerBody = bodyText.toLowerCase();

    // Exact title match
    if (lowerTitle === cleanQuery) score += 50;
    else if (lowerTitle.includes(cleanQuery)) score += 25;

    for (const term of queryTerms) {
      if (lowerTitle.includes(term)) score += 10;
      if (lowerSummary.includes(term)) score += 5;
      if (keywords.some((k) => k.toLowerCase().includes(term))) score += 4;
      if (lowerBody.includes(term)) score += 2;
    }

    return score;
  };

  // 1. Search Published Services
  if (typeFilter === "all" || typeFilter === "service") {
    const services = await db.service.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { name: { contains: cleanQuery, mode: "insensitive" } },
          { shortDescription: { contains: cleanQuery, mode: "insensitive" } },
          { longDescription: { contains: cleanQuery, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        longDescription: true,
        category: true,
      },
      take: 15,
    });

    for (const s of services) {
      const score = calculateScore(s.name, s.shortDescription, s.longDescription || "");
      if (score > 0) {
        results.push({
          id: s.id,
          type: "service",
          title: s.name,
          excerpt: s.shortDescription,
          route: `/services/${s.slug}`,
          badge: "Service",
          category: s.category,
          score,
        });
      }
    }
  }

  // 2. Search Published Products
  if (typeFilter === "all" || typeFilter === "product") {
    const products = await db.product.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { name: { contains: cleanQuery, mode: "insensitive" } },
          { tagline: { contains: cleanQuery, mode: "insensitive" } },
          { overview: { contains: cleanQuery, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        overview: true,
      },
      take: 15,
    });

    for (const p of products) {
      const score = calculateScore(p.name, p.tagline, p.overview);
      if (score > 0) {
        results.push({
          id: p.id,
          type: "product",
          title: p.name,
          excerpt: p.tagline || p.overview.slice(0, 140),
          route: `/products/${p.slug}`,
          badge: "Product",
          score,
        });
      }
    }
  }

  // 3. Search Published Blog Posts
  if (typeFilter === "all" || typeFilter === "blog") {
    const posts = await db.blogPost.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { title: { contains: cleanQuery, mode: "insensitive" } },
          { excerpt: { contains: cleanQuery, mode: "insensitive" } },
          { body: { contains: cleanQuery, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        body: true,
        category: {
          select: { name: true },
        },
      },
      take: 15,
    });

    for (const b of posts) {
      const score = calculateScore(b.title, b.excerpt, b.body);
      if (score > 0) {
        results.push({
          id: b.id,
          type: "blog",
          title: b.title,
          excerpt: b.excerpt,
          route: `/blog/${b.slug}`,
          badge: "Article",
          category: b.category?.name,
          score,
        });
      }
    }
  }

  // 4. Search Published Portfolio Projects
  if (typeFilter === "all" || typeFilter === "portfolio") {
    const portfolio = await db.portfolioProject.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { businessName: { contains: cleanQuery, mode: "insensitive" } },
          { industry: { contains: cleanQuery, mode: "insensitive" } },
          { businessDescription: { contains: cleanQuery, mode: "insensitive" } },
          { deliveredWork: { contains: cleanQuery, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        businessName: true,
        slug: true,
        businessDescription: true,
        deliveredWork: true,
        industry: true,
      },
      take: 15,
    });

    for (const port of portfolio) {
      const score = calculateScore(port.businessName, port.businessDescription, port.deliveredWork);
      if (score > 0) {
        results.push({
          id: port.id,
          type: "portfolio",
          title: port.businessName,
          excerpt: port.businessDescription.slice(0, 140),
          route: `/portfolio/${port.slug}`,
          badge: "Case Study",
          category: port.industry,
          score,
        });
      }
    }
  }

  // 5. Search Static Core Pages
  if (typeFilter === "all" || typeFilter === "page") {
    for (const page of STATIC_CORE_PAGES) {
      const score = calculateScore(page.title, page.excerpt, "", page.keywords);
      if (score > 0) {
        results.push({
          id: page.id,
          type: "page",
          title: page.title,
          excerpt: page.excerpt,
          route: page.route,
          badge: "Page",
          score,
        });
      }
    }
  }

  // Sort by relevance score descending
  results.sort((a, b) => b.score - a.score);

  const paginated = results.slice(0, limit);

  // Asynchronously record search term to SearchQueryLog without blocking
  try {
    await db.searchQueryLog.create({
      data: {
        query: cleanQuery.slice(0, 100),
        resultCount: results.length,
      },
    });
  } catch (logErr) {
    // Non-fatal logging error
  }

  return {
    results: paginated,
    total: results.length,
    query: cleanQuery,
  };
}
