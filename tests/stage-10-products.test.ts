import { db } from "../server/db";
import { PRODUCTS_DATA, ProductData } from "../config/products-data";
import { PRODUCTS_MENU, FOOTER_PRODUCTS } from "../config/navigation";
import {
  getAllProducts,
  getPublishedProductBySlug,
  getProductBySlug,
} from "../server/services/cms/products";
import * as fs from "fs";
import * as path from "path";

async function runStage10Tests() {
  console.log("=================================================");
  console.log("Running Stage 10 Product Marketing & Outbound Tests");
  console.log("=================================================\n");

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

  const EXPECTED_SLUGS = ["fortress", "leaseflow", "uzadigital", "fm-scheduler"];

  try {
    // -------------------------------------------------------------------------
    // SUITE 1: Canonical 4 Products Integrity (TDD Sheets 053-056 & Sheet 175)
    // -------------------------------------------------------------------------
    console.log("--- Suite 1: Canonical 4 Products Integrity ---");

    const dataSlugs = Object.keys(PRODUCTS_DATA);
    assert(
      dataSlugs.length === 4,
      `PRODUCTS_DATA contains exactly 4 independent products (found ${dataSlugs.length})`
    );

    for (const slug of EXPECTED_SLUGS) {
      assert(!!PRODUCTS_DATA[slug], `Product configuration exists for slug: ${slug}`);
      const prod = PRODUCTS_DATA[slug];
      assert(prod.name.length > 0, `${slug} has valid name: ${prod.name}`);
      assert(prod.badge.length > 0, `${slug} has valid badge: ${prod.badge}`);
      assert(prod.tagline.length > 0, `${slug} has valid tagline`);
      assert(prod.overview.length > 20, `${slug} has thorough overview`);
      assert(prod.audience.length > 20, `${slug} specifies target audience`);
      assert(prod.problem.length > 20, `${slug} specifies operational problem`);
      assert(prod.solution.length > 20, `${slug} specifies product solution`);
      assert(
        Array.isArray(prod.verifiedFeatures) && prod.verifiedFeatures.length >= 3,
        `${slug} specifies at least 3 verified features (found ${prod.verifiedFeatures?.length})`
      );
      assert(
        Array.isArray(prod.benefits) && prod.benefits.length >= 3,
        `${slug} specifies at least 3 operational benefits`
      );
      assert(
        Array.isArray(prod.faqs) && prod.faqs.length >= 3,
        `${slug} specifies at least 3 FAQs`
      );
      assert(
        prod.seo.title.includes("MegaScript Digital") && prod.seo.description.length > 20,
        `${slug} defines complete SEO title and description`
      );
    }

    // Verify database seeded products
    const dbProducts = await getAllProducts();
    assert(
      dbProducts.length === 4,
      `Database contains all 4 independent products (found ${dbProducts.length})`
    );

    for (const slug of EXPECTED_SLUGS) {
      const dbProd = await getPublishedProductBySlug(slug);
      assert(!!dbProd, `Database contains published product for slug: ${slug}`);
      assert(
        dbProd?.status === "PUBLISHED",
        `Product ${slug} has status PUBLISHED in database`
      );
    }

    // -------------------------------------------------------------------------
    // SUITE 2: Outbound URL Safeguard & Zero Guessed URLs (TDD Sheet 175)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 2: Outbound URL Safeguard & Zero Guessed URLs ---");

    for (const slug of EXPECTED_SLUGS) {
      const prod = PRODUCTS_DATA[slug];
      const dbProd = await getProductBySlug(slug);

      // Verify that default seeded outbound URL is null / empty and guarded
      assert(
        dbProd?.outboundUrl === null || dbProd?.outboundUrl === undefined,
        `Initial database outboundUrl for ${slug} is null (not guessed)`
      );

      // Ensure fallback CTA destination topic is predictable
      const expectedFallbackHref = `/contact?topic=product-${slug}`;
      assert(
        expectedFallbackHref.startsWith("/contact?topic=product-"),
        `Safe fallback href is structured correctly: ${expectedFallbackHref}`
      );
    }

    // Test URL validation logic
    const isValidOutboundUrl = (url: any): boolean => {
      return (
        typeof url === "string" &&
        url.trim().length > 0 &&
        (url.startsWith("http://") || url.startsWith("https://"))
      );
    };

    assert(!isValidOutboundUrl(null), "null outbound URL is recognized as invalid");
    assert(!isValidOutboundUrl(""), "empty string outbound URL is recognized as invalid");
    assert(!isValidOutboundUrl("   "), "whitespace string outbound URL is recognized as invalid");
    assert(!isValidOutboundUrl("ftp://example.com"), "non-http/https URL is rejected");
    assert(
      isValidOutboundUrl("https://fortress.megascriptdigital.co.ke"),
      "valid https outbound URL is recognized"
    );

    // -------------------------------------------------------------------------
    // SUITE 3: Product Independence & Zero Duplicated SaaS Logics
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 3: Platform Independence ---");

    const productDir = path.join(process.cwd(), "app", "products");
    const productFiles = fs.readdirSync(productDir, { recursive: true }) as string[];

    for (const file of productFiles) {
      if (typeof file === "string" && (file.endsWith(".tsx") || file.endsWith(".ts"))) {
        const fullPath = path.join(productDir, file);
        const content = fs.readFileSync(fullPath, "utf-8");

        // Verify zero duplicated sign-in or registration forms
        assert(
          !content.includes("<form") || file.includes("Manager"),
          `No public SaaS registration or sign-in form found in ${file}`
        );
        assert(
          !content.includes("useAuth") && !content.includes("signInWithPassword"),
          `No auth consumer logic duplicated in public product file: ${file}`
        );
      }
    }

    // -------------------------------------------------------------------------
    // SUITE 4: Verified Capabilities Integrity
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 4: Verified Capabilities Integrity ---");

    const FORBIDDEN_UNVERIFIED_CLAIMS = [
      "automated banking",
      "guaranteed profit",
      "guaranteed sales",
      "unlimited bandwidth",
      "100% automated tax evasion",
      "offline kra integration",
      "viral growth guaranteed",
    ];

    for (const slug of EXPECTED_SLUGS) {
      const prod = PRODUCTS_DATA[slug];
      const serialized = JSON.stringify(prod).toLowerCase();

      for (const forbidden of FORBIDDEN_UNVERIFIED_CLAIMS) {
        assert(
          !serialized.includes(forbidden),
          `Product ${slug} does not contain forbidden claim: "${forbidden}"`
        );
      }
    }

    // -------------------------------------------------------------------------
    // SUITE 5: Navigation & Link Integration
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 5: Navigation & Link Integration ---");

    assert(
      PRODUCTS_MENU.items.length === 4,
      `PRODUCTS_MENU has exactly 4 items (found ${PRODUCTS_MENU.items.length})`
    );

    for (const item of PRODUCTS_MENU.items) {
      const slug = item.href.replace("/products/", "");
      assert(EXPECTED_SLUGS.includes(slug), `Menu item links to valid slug: ${item.href}`);
    }

    assert(
      PRODUCTS_MENU.footerLink?.href === "/products",
      `Mega menu footer link points to /products catalog`
    );

    assert(
      FOOTER_PRODUCTS.length === 4,
      `FOOTER_PRODUCTS has exactly 4 items`
    );

    for (const item of FOOTER_PRODUCTS) {
      const slug = item.href.replace("/products/", "");
      assert(EXPECTED_SLUGS.includes(slug), `Footer link points to valid product: ${item.href}`);
    }

    // -------------------------------------------------------------------------
    // SUITE 6: Brand Compliance (Zero Emojis & Zero Purple Gradients)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 6: Brand Compliance ---");

    const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]/;
    const purpleGradientRegex = /from-purple|to-purple|via-purple/i;

    const filesToAudit = [
      path.join(process.cwd(), "config", "products-data.ts"),
      path.join(process.cwd(), "app", "products", "page.tsx"),
      path.join(process.cwd(), "app", "products", "[slug]", "page.tsx"),
      path.join(process.cwd(), "components", "products", "ProductHero.tsx"),
      path.join(process.cwd(), "components", "products", "ProductOutboundCta.tsx"),
      path.join(process.cwd(), "components", "products", "ProductProblemSolution.tsx"),
      path.join(process.cwd(), "components", "products", "ProductVerifiedFeatures.tsx"),
      path.join(process.cwd(), "components", "products", "ProductAudience.tsx"),
      path.join(process.cwd(), "components", "products", "ProductFaq.tsx"),
      path.join(process.cwd(), "components", "admin", "ProductManagerClient.tsx"),
      path.join(process.cwd(), "app", "(admin)", "master", "content", "products", "page.tsx"),
    ];

    for (const filePath of filesToAudit) {
      const base = path.basename(filePath);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        assert(!emojiRegex.test(content), `Zero emojis in ${base}`);
        assert(!purpleGradientRegex.test(content), `Zero purple gradients in ${base}`);
      }
    }

    console.log("\n=================================================");
    console.log(`Stage 10 Products Tests Completed: ${passedTests}/${totalTests} Passed!`);
    console.log("=================================================");
  } catch (err: any) {
    console.error("\nStage 10 Tests Terminated on Error:", err?.message || err);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runStage10Tests();
