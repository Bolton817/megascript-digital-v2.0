import { db } from "../server/db";
import { PORTFOLIO_PROJECTS_DATA, PortfolioProjectData } from "../config/portfolio-data";
import { WOW_FACTORS_DATA, WowFactorData } from "../config/wow-factors-data";
import { BLOG_POSTS_DATA, BlogPostData } from "../config/blog-data";
import {
  getAllPortfolioProjects,
  getPublishedPortfolioProjects,
  getPublishedPortfolioProjectBySlug,
} from "../server/services/cms/portfolio";
import {
  getAllTestimonials,
  getPublishedTestimonials,
} from "../server/services/cms/testimonials";
import {
  getPublishedBlogPosts,
  getPublishedBlogPostBySlug,
  getAllBlogPosts,
} from "../server/services/cms/blog";
import * as fs from "fs";
import * as path from "path";

async function runStage11Tests() {
  console.log("==================================================================");
  console.log("Running Stage 11: About, Portfolio, Testimonials, Blog & Wow Factors");
  console.log("==================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  const CANONICAL_PORTFOLIO_SLUGS = [
    "lucky-house-safaris",
    "luminary-mtaji-partners",
    "skrach-art",
    "abwa-world",
    "fexty-safaris",
    "tawi-talent-partners",
    "craydel-africa-travel",
    "janave-events",
    "ozone-lounge",
    "unified-option-service",
    "megascript-digital-solutions",
  ];

  const CANONICAL_FEATURED_SLUGS = [
    "lucky-house-safaris",
    "luminary-mtaji-partners",
    "skrach-art",
    "abwa-world",
  ];

  const CANONICAL_WOW_SLUGS = [
    "ai-crm-agent",
    "interactive-rental-dashboard",
    "high-velocity-checkout",
    "dynamic-dispatch-calendar",
  ];

  const CANONICAL_BLOG_SLUGS = [
    "what-to-prepare-before-building-a-business-website",
    "integrating-mpesa-with-custom-web-applications",
    "why-clean-google-maps-visibility-drives-local-foot-traffic",
  ];

  try {
    // -------------------------------------------------------------------------
    // SUITE 1: Canonical 11 Portfolio Projects Data & DB Integrity
    // -------------------------------------------------------------------------
    console.log("--- Suite 1: Canonical 11 Portfolio Projects Data & DB Integrity ---");

    const dictSlugs = Object.keys(PORTFOLIO_PROJECTS_DATA);
    assert(
      dictSlugs.length === 11,
      `PORTFOLIO_PROJECTS_DATA contains exactly 11 projects (found ${dictSlugs.length})`
    );

    for (const slug of CANONICAL_PORTFOLIO_SLUGS) {
      assert(!!PORTFOLIO_PROJECTS_DATA[slug], `Dictionary contains case study for ${slug}`);
      const p = PORTFOLIO_PROJECTS_DATA[slug];
      assert(p.businessName.length > 0, `${slug} has businessName: ${p.businessName}`);
      assert(p.monogram.length >= 2 && p.monogram.length <= 4, `${slug} has monogram: ${p.monogram}`);
      assert(p.industry.length > 0, `${slug} has industry: ${p.industry}`);
      assert(p.businessDescription.length > 20, `${slug} has businessDescription`);
      assert(p.deliveredWork.length > 20, `${slug} has deliveredWork`);
      assert(p.challengeSummary.length > 20, `${slug} specifies challengeSummary`);
      assert(p.businessOutcome.length > 20, `${slug} specifies businessOutcome`);
      const totalDeliverables = p.deliveredScopeDetails.reduce((acc, curr) => acc + curr.deliverables.length, 0);
      assert(
        p.deliveredScopeDetails.length >= 1 && totalDeliverables >= 3,
        `${slug} has >= 3 total deliverables across scope areas (found ${totalDeliverables})`
      );
      assert(p.seo.title.includes("MegaScript Digital"), `${slug} has complete SEO title`);
    }

    const dbProjects = await getAllPortfolioProjects();
    assert(
      dbProjects.length >= 11,
      `Database contains at least 11 portfolio projects (found ${dbProjects.length})`
    );

    const dbSlugs = dbProjects.map((p) => p.slug);
    for (const slug of CANONICAL_PORTFOLIO_SLUGS) {
      assert(dbSlugs.includes(slug), `Database contains seeded record for ${slug}`);
    }

    // -------------------------------------------------------------------------
    // SUITE 2: Exact 4 Homepage Featured Clients
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 2: Exact 4 Homepage Featured Clients ---");

    const featuredDbProjects = dbProjects.filter((p) => p.isFeatured);
    assert(
      featuredDbProjects.length === 4,
      `Database has exactly 4 featured portfolio projects (found ${featuredDbProjects.length})`
    );

    const featuredDbSlugs = featuredDbProjects.map((p) => p.slug).sort();
    const expectedFeaturedSorted = [...CANONICAL_FEATURED_SLUGS].sort();
    assert(
      JSON.stringify(featuredDbSlugs) === JSON.stringify(expectedFeaturedSorted),
      `Featured slugs match canonical: ${CANONICAL_FEATURED_SLUGS.join(", ")}`
    );

    // Verify FeaturedPortfolioSection.tsx has exact 4 slugs
    const featuredSectionContent = fs.readFileSync(
      path.join(process.cwd(), "components/home/FeaturedPortfolioSection.tsx"),
      "utf8"
    );
    for (const slug of CANONICAL_FEATURED_SLUGS) {
      assert(
        featuredSectionContent.includes(slug),
        `FeaturedPortfolioSection.tsx references canonical slug: ${slug}`
      );
    }

    // -------------------------------------------------------------------------
    // SUITE 3: Strict Zero Screenshots and Zero Tech Stack Labels (TDD Sheets 042, 058)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 3: Strict Zero Screenshots & Tech Stack Labels ---");

    const portfolioCardContent = fs.readFileSync(
      path.join(process.cwd(), "components/portfolio/PortfolioCard.tsx"),
      "utf8"
    );
    const portfolioHeroContent = fs.readFileSync(
      path.join(process.cwd(), "components/portfolio/PortfolioHero.tsx"),
      "utf8"
    );
    const portfolioDetailHeroContent = fs.readFileSync(
      path.join(process.cwd(), "components/portfolio/PortfolioDetailHero.tsx"),
      "utf8"
    );
    const portfolioScopeContent = fs.readFileSync(
      path.join(process.cwd(), "components/portfolio/PortfolioScopeBreakdown.tsx"),
      "utf8"
    );

    // Prohibited tech stack badges
    const prohibitedTechLabels = [
      "React",
      "Next.js",
      "Tailwind",
      "PostgreSQL",
      "TypeScript",
      "Node.js",
      "Python",
      "Django",
      "Vue",
      "Prisma",
    ];

    // Check portfolio data dictionary
    for (const [slug, p] of Object.entries(PORTFOLIO_PROJECTS_DATA)) {
      assert(!("technologies" in p), `${slug} dictionary does not contain tech stack array`);
      assert(!("techStack" in p), `${slug} dictionary does not contain techStack field`);
      assert(!("screenshot" in p), `${slug} dictionary does not contain screenshot field`);
      assert(!("imageUrl" in p), `${slug} dictionary does not contain imageUrl field`);
      assert(p.monogram.length >= 2, `${slug} uses typography monogram presentation: ${p.monogram}`);
    }

    // Check components for tech stack badge rendering
    assert(
      !portfolioCardContent.includes("technologies") && !portfolioCardContent.includes("techStack"),
      "PortfolioCard.tsx strictly avoids tech stack rendering"
    );
    assert(
      !portfolioDetailHeroContent.includes("technologies") && !portfolioDetailHeroContent.includes("techStack"),
      "PortfolioDetailHero.tsx strictly avoids tech stack rendering"
    );
    assert(
      !featuredSectionContent.includes("technologies") && !featuredSectionContent.includes("techStack"),
      "FeaturedPortfolioSection.tsx strictly avoids tech stack rendering"
    );

    // -------------------------------------------------------------------------
    // SUITE 4: About Us Page & Content Boundaries (TDD Sheet 057)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 4: About Us Content & Operational Boundaries ---");

    const aboutHeroContent = fs.readFileSync(
      path.join(process.cwd(), "components/about/AboutHero.tsx"),
      "utf8"
    );
    const aboutStoryContent = fs.readFileSync(
      path.join(process.cwd(), "components/about/AboutStory.tsx"),
      "utf8"
    );
    const aboutApproachContent = fs.readFileSync(
      path.join(process.cwd(), "components/about/AboutApproach.tsx"),
      "utf8"
    );
    const aboutValuesContent = fs.readFileSync(
      path.join(process.cwd(), "components/about/AboutValues.tsx"),
      "utf8"
    );

    // Factual boundary checks (Sheet 057 prohibits unapproved founder bios, false team numbers, fabricated certifications)
    const prohibitedClaims = [
      "ISO 9001",
      "50+ engineers",
      "100+ team members",
      "Fortune 500 partner",
      "Established in 2010",
      "Silicon Valley",
    ];

    for (const claim of prohibitedClaims) {
      assert(!aboutHeroContent.includes(claim), `AboutHero does not contain unapproved claim: "${claim}"`);
      assert(!aboutStoryContent.includes(claim), `AboutStory does not contain unapproved claim: "${claim}"`);
      assert(!aboutApproachContent.includes(claim), `AboutApproach does not contain unapproved claim: "${claim}"`);
      assert(!aboutValuesContent.includes(claim), `AboutValues does not contain unapproved claim: "${claim}"`);
    }

    // Verify 5-step methodology in AboutApproach
    assert(aboutApproachContent.includes("Understand"), "AboutApproach includes Understand step");
    assert(aboutApproachContent.includes("Plan"), "AboutApproach includes Plan step");
    assert(aboutApproachContent.includes("Build"), "AboutApproach includes Build step");
    assert(aboutApproachContent.includes("Test"), "AboutApproach includes Test step");
    assert(aboutApproachContent.includes("Support"), "AboutApproach includes Support step");

    // -------------------------------------------------------------------------
    // SUITE 5: Wow Factors Truthful Demonstration Types (TDD Sheet 060)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 5: Wow Factors Demonstration Types & Truthful Labeling ---");

    const wowSlugs = Object.keys(WOW_FACTORS_DATA);
    assert(
      wowSlugs.length === 4,
      `WOW_FACTORS_DATA contains exactly 4 prototypes (found ${wowSlugs.length})`
    );

    const validDemoTypes = [
      "LIVE_DEMO",
      "VISUAL_CONCEPT",
      "CLIENT_FEATURE",
      "ILLUSTRATIVE_PROTOTYPE",
    ];

    const validBadgeLabels = [
      "Live Working Demo",
      "Visual Concept",
      "Client-Delivered Feature",
      "Illustrative Prototype",
    ];

    for (const slug of CANONICAL_WOW_SLUGS) {
      assert(!!WOW_FACTORS_DATA[slug], `Wow factor exists for ${slug}`);
      const w = WOW_FACTORS_DATA[slug];
      assert(
        validDemoTypes.includes(w.demonstrationType),
        `${slug} demonstrationType is valid: ${w.demonstrationType}`
      );
      assert(
        validBadgeLabels.includes(w.typeBadgeLabel),
        `${slug} typeBadgeLabel is truthful: ${w.typeBadgeLabel}`
      );
      assert(w.capabilities.length >= 3, `${slug} specifies >= 3 capabilities`);
      assert(w.operationalValue.length > 20, `${slug} specifies operationalValue`);
      assert(w.summary.length > 20, `${slug} includes detailed summary`);
    }

    // -------------------------------------------------------------------------
    // SUITE 6: Blog Engine Publishing & Category Filtering (TDD Sheet 061)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 6: Blog Engine Publishing & Static Slugs ---");

    const blogSlugs = Object.keys(BLOG_POSTS_DATA);
    assert(
      blogSlugs.length === 3,
      `BLOG_POSTS_DATA contains exactly 3 canonical articles (found ${blogSlugs.length})`
    );

    for (const slug of CANONICAL_BLOG_SLUGS) {
      assert(!!BLOG_POSTS_DATA[slug], `Blog article exists for ${slug}`);
      const b = BLOG_POSTS_DATA[slug];
      assert(b.title.length > 10, `${slug} has title: ${b.title}`);
      assert(b.excerpt.length > 20, `${slug} has excerpt`);
      assert(b.sections.length >= 3, `${slug} has >= 3 sections (found ${b.sections.length})`);
      assert(b.keyTakeaways.length >= 3, `${slug} has >= 3 key takeaways`);
      assert(b.readingTime.includes("min read"), `${slug} specifies readingTime`);
    }

    // Verify blog dynamic route files exist
    assert(
      fs.existsSync(path.join(process.cwd(), "app/blog/page.tsx")),
      "app/blog/page.tsx exists"
    );
    assert(
      fs.existsSync(path.join(process.cwd(), "app/blog/[slug]/page.tsx")),
      "app/blog/[slug]/page.tsx exists"
    );

    // -------------------------------------------------------------------------
    // SUITE 7: Testimonial Moderation & Zero Fabricated Reviews (Sheet 063 & Sheet 176)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 7: Testimonial Moderation & Audit Safeguards ---");

    // Public query must only return approved & published testimonials
    const publishedTestimonials = await getPublishedTestimonials();
    for (const t of publishedTestimonials) {
      assert(t.isApproved === true, `Published testimonial ${t.id} has isApproved = true`);
      assert(t.status === "PUBLISHED", `Published testimonial ${t.id} has status = PUBLISHED`);
    }

    // Verify Testimonials Admin Page & Client Component exist
    assert(
      fs.existsSync(path.join(process.cwd(), "app/(admin)/master/content/testimonials/page.tsx")),
      "Master Testimonials admin page exists"
    );
    assert(
      fs.existsSync(path.join(process.cwd(), "components/admin/TestimonialManagerClient.tsx")),
      "TestimonialManagerClient component exists"
    );

    // Verify TestimonialManagerClient contains zero fabricated review policy
    const testimonialClientContent = fs.readFileSync(
      path.join(process.cwd(), "components/admin/TestimonialManagerClient.tsx"),
      "utf8"
    );
    assert(
      testimonialClientContent.includes("Zero Fabricated Reviews Policy"),
      "TestimonialManagerClient includes Zero Fabricated Reviews Policy disclaimer"
    );
    assert(
      testimonialClientContent.includes("toggleTestimonialApprovalAction"),
      "TestimonialManagerClient calls toggleTestimonialApprovalAction"
    );

    // -------------------------------------------------------------------------
    // SUITE 8: Brand Design Prohibitions (0 Emojis, 0 Purple Gradients)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 8: Brand Design Prohibitions (0 Emojis, 0 Purple Gradients) ---");

    const emojiRegex = /[\uD83C-\uD83E][\uDC00-\uDFFF]|[\u2600-\u26FF]|[\u2700-\u27BF]/;
    const purpleKeywords = ["purple", "violet", "fuchsia", "from-purple", "to-purple", "indigo-600"];

    const stage11Files = [
      "config/portfolio-data.ts",
      "config/wow-factors-data.ts",
      "config/blog-data.ts",
      "components/portfolio/PortfolioHero.tsx",
      "components/portfolio/PortfolioCard.tsx",
      "components/portfolio/PortfolioFilterGrid.tsx",
      "components/portfolio/PortfolioDetailHero.tsx",
      "components/portfolio/PortfolioScopeBreakdown.tsx",
      "components/about/AboutHero.tsx",
      "components/about/AboutStory.tsx",
      "components/about/AboutApproach.tsx",
      "components/about/AboutValues.tsx",
      "components/wow-factors/WowFactorsHero.tsx",
      "components/wow-factors/WowFactorCard.tsx",
      "components/blog/BlogHero.tsx",
      "components/blog/BlogCard.tsx",
      "components/blog/BlogFilterGrid.tsx",
      "components/blog/ArticleContent.tsx",
      "components/admin/TestimonialManagerClient.tsx",
      "app/portfolio/page.tsx",
      "app/about/page.tsx",
      "app/wow-factors/page.tsx",
      "app/blog/page.tsx",
    ];

    for (const relPath of stage11Files) {
      const fullPath = path.join(process.cwd(), relPath);
      if (fs.existsSync(fullPath)) {
        const fileContent = fs.readFileSync(fullPath, "utf8");
        assert(!emojiRegex.test(fileContent), `${relPath} contains strictly ZERO emojis`);
        for (const kw of purpleKeywords) {
          assert(!fileContent.includes(kw), `${relPath} strictly avoids purple gradient/color: ${kw}`);
        }
      }
    }

    console.log("\n==================================================================");
    console.log(`All Stage 11 Tests Passed Successfully! (${passedTests}/${totalTests} assertions)`);
    console.log("==================================================================\n");
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runStage11Tests();
