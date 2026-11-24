import { db } from "../server/db";
import { SERVICES_DATA } from "../config/services-data";
import {
  FOOTER_CORE_SERVICES,
  FOOTER_COMPLEMENTARY_SERVICES,
  MORE_SERVICES_MENU,
} from "../config/navigation";

async function runStage09Tests() {
  console.log("=================================================");
  console.log("Running Stage 09 Core & Complementary Services Tests");
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

  const EXPECTED_SLUGS = [
    "website-development-seo",
    "web-app-development",
    "mobile-app-development",
    "graphic-design",
    "video-editing",
    "google-maps-visibility",
    "business-coaching",
  ];

  try {
    // -------------------------------------------------------------------------
    // SUITE 1: 7 Canonical Service Records Integrity (TDD Sheet 174)
    // -------------------------------------------------------------------------
    console.log("--- Suite 1: Canonical Service Records Integrity ---");

    const dataSlugs = Object.keys(SERVICES_DATA);
    assert(dataSlugs.length === 7, `SERVICES_DATA has exactly 7 services (found ${dataSlugs.length})`);

    for (const slug of EXPECTED_SLUGS) {
      assert(!!SERVICES_DATA[slug], `Service configuration exists for canonical slug: ${slug}`);
    }

    // Verify against database seeded records
    const dbServices = await db.service.findMany({
      where: { slug: { in: EXPECTED_SLUGS } },
    });
    assert(dbServices.length === 7, `Database contains all 7 canonical service records`);

    // Verify Core vs. Complementary categorization
    const coreServices = Object.values(SERVICES_DATA).filter((s) => s.category === "CORE");
    const compServices = Object.values(SERVICES_DATA).filter((s) => s.category === "COMPLEMENTARY");
    assert(coreServices.length === 3, "Exactly 3 Core Engineering services configured");
    assert(compServices.length === 4, "Exactly 4 Complementary Growth services configured");

    // -------------------------------------------------------------------------
    // SUITE 2: Strict Pricing Isolation (TDD Sheet 174 & Sheet 046)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 2: Strict Pricing Isolation ---");

    const webDev = SERVICES_DATA["website-development-seo"];
    assert(!!webDev.pricingGuidance, "Website Development & SEO defines pricing guidance");
    assert(webDev.pricingGuidance?.minKsh === 35000, "Pricing guide min is KSh 35,000");
    assert(webDev.pricingGuidance?.maxKsh === 125000, "Pricing guide max is KSh 125,000");
    assert(
      webDev.pricingGuidance?.timeline.includes("2 to 6 weeks") === true,
      "Timeline guide states 2 to 6 weeks"
    );
    assert(
      webDev.pricingGuidance?.disclaimer.length! > 20,
      "Pricing guidance contains explicit scope and approval disclaimer"
    );

    // Verify all other 6 services have ZERO pricing guidance and do NOT misapply 35,000/125,000
    const otherSlugs = EXPECTED_SLUGS.filter((s) => s !== "website-development-seo");
    for (const slug of otherSlugs) {
      const s = SERVICES_DATA[slug];
      assert(
        s.pricingGuidance === undefined,
        `Service [${slug}] strictly has NO fixed pricingGuidance block`
      );

      const serialized = JSON.stringify(s);
      assert(
        !serialized.includes("35,000") && !serialized.includes("125,000"),
        `Service [${slug}] strictly omits standard website price numbers`
      );
    }

    // -------------------------------------------------------------------------
    // SUITE 3: Zero Outcome Guarantees (TDD Sheet 174 & Sheets 046-052)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 3: Zero Outcome Guarantees Compliance ---");

    for (const slug of EXPECTED_SLUGS) {
      const s = SERVICES_DATA[slug];
      const serialized = JSON.stringify(s).toLowerCase();

      assert(
        !serialized.includes("guaranteed ranking") &&
          !serialized.includes("guaranteed first page") &&
          !serialized.includes("guaranteed viral") &&
          !serialized.includes("guaranteed profit") &&
          !serialized.includes("guaranteed income"),
        `Service [${slug}] contains zero prohibited guarantee claims`
      );
    }

    // Explicit disclaimer verification
    const gmaps = SERVICES_DATA["google-maps-visibility"];
    assert(
      JSON.stringify(gmaps).includes("do not guarantee") ||
        JSON.stringify(gmaps).includes("cannot guarantee") ||
        JSON.stringify(gmaps).includes("no agency can guarantee"),
      "Google Maps Visibility contains explicit ranking disclaimer"
    );

    const coaching = SERVICES_DATA["business-coaching"];
    assert(
      JSON.stringify(coaching).includes("not constitute regulated financial advice") ||
        JSON.stringify(coaching).includes("do not provide regulated"),
      "Business Coaching contains explicit non-financial advice disclaimer"
    );

    // -------------------------------------------------------------------------
    // SUITE 4: Technical Modals & Process Specifications
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 4: Technical Modals & Structure ---");

    for (const slug of EXPECTED_SLUGS) {
      const s = SERVICES_DATA[slug];
      assert(s.processSteps.length >= 4, `Service [${slug}] has >= 4 process steps`);
      assert(s.technicalModal.sections.length >= 2, `Service [${slug}] has >= 2 technical modal sections`);
      assert(s.faqs.length >= 3, `Service [${slug}] has >= 3 FAQs`);
      assert(!!s.seo.title && !!s.seo.description, `Service [${slug}] has complete SEO metadata`);
      assert(!!s.cta.primaryHref && !!s.cta.primaryLabel, `Service [${slug}] has primary conversion CTA`);
    }

    // -------------------------------------------------------------------------
    // SUITE 5: Navigation & Menu Wiring
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 5: Navigation & Menu Wiring Alignment ---");

    const footerHrefs = [
      ...FOOTER_CORE_SERVICES.map((s) => s.href),
      ...FOOTER_COMPLEMENTARY_SERVICES.map((s) => s.href),
    ];
    assert(footerHrefs.length === 7, "Footer contains all 7 service links");

    for (const href of footerHrefs) {
      const slug = href.replace("/services/", "");
      assert(EXPECTED_SLUGS.includes(slug), `Footer link [${href}] resolves to valid service slug`);
    }

    const moreServicesHrefs = MORE_SERVICES_MENU.items.map((i) => i.href);
    assert(moreServicesHrefs.length === 4, "MegaMenu contains all 4 complementary service links");
    for (const href of moreServicesHrefs) {
      const slug = href.replace("/services/", "");
      assert(EXPECTED_SLUGS.includes(slug), `MegaMenu link [${href}] resolves to valid service slug`);
    }

    // Final summary
    console.log("\n=================================================");
    console.log(`Stage 09 Tests Completed: ${passedTests}/${totalTests} Passed`);
    console.log("=================================================");
  } catch (error) {
    console.error("Test execution failed with error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runStage09Tests();
