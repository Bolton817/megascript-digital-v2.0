import { db } from "../server/db";
import { PublishStatus, ServiceCategory, RoleName } from "@prisma/client";
import {
  createPage,
  updatePage,
  publishPage,
  unpublishPage,
  getPublishedPageBySlug,
  deletePage,
} from "../server/services/cms/pages";
import {
  createService,
  updateServiceStatus,
  getPublishedServices,
  getPublishedServiceBySlug,
} from "../server/services/cms/services";
import {
  createProduct,
  updateProductStatus,
  getPublishedProducts,
  getPublishedProductBySlug,
} from "../server/services/cms/products";
import {
  createPortfolioProject,
  updatePortfolioStatus,
  getPublishedPortfolioProjects,
} from "../server/services/cms/portfolio";
import {
  createTestimonial,
  approveTestimonial,
  updateTestimonialStatus,
  getPublishedTestimonials,
} from "../server/services/cms/testimonials";
import {
  getRevisionHistory,
  rollbackContentRevision,
} from "../server/services/cms/revision";
import { getUserRolesAndPermissions, hasPermission } from "../features/auth/rbac";

async function runStage08Tests() {
  console.log("=================================================");
  console.log("Running Stage 08 CMS Content Models & RBAC Tests");
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

  // Find Super Admin actor for test authoring
  const superAdmin = await db.user.findUnique({
    where: { normalizedEmail: "megascriptdigital@gmail.com" },
  });
  if (!superAdmin) {
    throw new Error("Super Admin not found in database for running tests.");
  }

  const testSuffix = Date.now().toString().slice(-6);

  try {
    // -------------------------------------------------------------------------
    // SUITE 1: Zero Draft Leakage Across All Entities (TDD Sheet 107 & 173)
    // -------------------------------------------------------------------------
    console.log("--- Suite 1: Zero Draft Leakage Invariant ---");

    // 1. Pages Leakage Prevention
    const draftPageSlug = `test-draft-page-${testSuffix}`;
    const pubPageSlug = `test-published-page-${testSuffix}`;

    const draftPage = await createPage(superAdmin.id, {
      slug: draftPageSlug,
      title: "Draft Test Page",
      summary: "Should never be visible to public",
      status: PublishStatus.DRAFT,
    });

    const pubPage = await createPage(superAdmin.id, {
      slug: pubPageSlug,
      title: "Published Test Page",
      summary: "Visible to public",
      status: PublishStatus.PUBLISHED,
    });

    const leakedPage = await getPublishedPageBySlug(draftPageSlug);
    assert(leakedPage === null, "Draft page is strictly inaccessible via getPublishedPageBySlug");

    const fetchedPubPage = await getPublishedPageBySlug(pubPageSlug);
    assert(fetchedPubPage !== null, "Published page is accessible via getPublishedPageBySlug");
    assert(fetchedPubPage?.slug === pubPageSlug, "Published page matches expected slug");

    // 2. Services Leakage Prevention
    const draftServiceSlug = `test-draft-service-${testSuffix}`;
    const draftService = await createService(superAdmin.id, {
      slug: draftServiceSlug,
      name: "Draft Service",
      category: ServiceCategory.CORE,
      shortDescription: "Draft service description",
      status: PublishStatus.DRAFT,
    });

    const publishedServices = await getPublishedServices();
    const serviceLeaked = publishedServices.some((s) => s.slug === draftServiceSlug);
    assert(!serviceLeaked, "Draft service is omitted from getPublishedServices");

    const draftServiceDirect = await getPublishedServiceBySlug(draftServiceSlug);
    assert(draftServiceDirect === null, "Draft service is omitted from getPublishedServiceBySlug");

    // 3. Products Leakage Prevention
    const draftProductSlug = `test-draft-product-${testSuffix}`;
    const draftProduct = await createProduct(superAdmin.id, {
      slug: draftProductSlug,
      name: "Draft Product",
      tagline: "Draft product tagline",
      overview: "Draft overview",
      audience: "Draft audience",
      status: PublishStatus.DRAFT,
    });

    const publishedProducts = await getPublishedProducts();
    const productLeaked = publishedProducts.some((p) => p.slug === draftProductSlug);
    assert(!productLeaked, "Draft product is omitted from getPublishedProducts");

    const draftProductDirect = await getPublishedProductBySlug(draftProductSlug);
    assert(draftProductDirect === null, "Draft product is omitted from getPublishedProductBySlug");

    // 4. Portfolio Leakage Prevention
    const draftPortfolioSlug = `test-draft-portfolio-${testSuffix}`;
    const draftProject = await createPortfolioProject(superAdmin.id, {
      slug: draftPortfolioSlug,
      businessName: "Draft Client Corp",
      industry: "Technology",
      businessDescription: "Draft engagement description",
      deliveredWork: "Draft scope",
      status: PublishStatus.DRAFT,
      isFeatured: true, // even if marked featured, draft MUST NOT leak!
    });

    const publishedPortfolio = await getPublishedPortfolioProjects();
    const portfolioLeaked = publishedPortfolio.some((p) => p.slug === draftPortfolioSlug);
    assert(!portfolioLeaked, "Draft portfolio project is omitted from getPublishedPortfolioProjects");

    const featuredPortfolio = await getPublishedPortfolioProjects({ featuredOnly: true });
    const featuredDraftLeaked = featuredPortfolio.some((p) => p.slug === draftPortfolioSlug);
    assert(!featuredDraftLeaked, "Draft portfolio project is omitted from featured queries");

    // 5. Testimonial Approval & Leakage Prevention
    const unapprovedTestimonial = await createTestimonial(superAdmin.id, {
      quote: "Great team and delivery",
      clientName: "Jane Doe",
      organization: "Sample Corp",
      isApproved: false,
      status: PublishStatus.PUBLISHED, // Published but NOT approved -> MUST NOT LEAK
    });

    const draftApprovedTestimonial = await createTestimonial(superAdmin.id, {
      quote: "Approved quote but draft",
      clientName: "John Smith",
      organization: "Approved Corp",
      isApproved: true,
      approvalEvidence: "Email confirmation 2026-11-24",
      status: PublishStatus.DRAFT, // Approved but DRAFT -> MUST NOT LEAK
    });

    const validTestimonial = await createTestimonial(superAdmin.id, {
      quote: "Valid published and approved quote",
      clientName: "Alice Walker",
      organization: "Legit Enterprise",
      isApproved: true,
      approvalEvidence: "Contract clause 4.2",
      status: PublishStatus.PUBLISHED, // Approved AND Published -> MUST DISPLAY
    });

    const publishedTestimonials = await getPublishedTestimonials();
    const unapprovedFound = publishedTestimonials.some((t) => t.id === unapprovedTestimonial.id);
    const draftApprovedFound = publishedTestimonials.some((t) => t.id === draftApprovedTestimonial.id);
    const validFound = publishedTestimonials.some((t) => t.id === validTestimonial.id);

    assert(!unapprovedFound, "Unapproved testimonial is omitted even if status is PUBLISHED");
    assert(!draftApprovedFound, "Draft testimonial is omitted even if isApproved is true");
    assert(validFound, "Published AND approved testimonial is included in public results");

    // -------------------------------------------------------------------------
    // SUITE 2: Publication & ContentRevision Engine
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 2: Revision Tracking & Publication Lifecycle ---");

    // Verify initial revision for pubPage
    const initialRevs = await getRevisionHistory("PAGE", pubPage.id);
    assert(initialRevs.length === 1, "Page creation generated exactly 1 initial ContentRevision");
    assert(initialRevs[0].version === 1, "Initial ContentRevision is version 1");
    assert(
      (initialRevs[0].data as any).title === "Published Test Page",
      "Revision snapshot data matches initial page title"
    );

    // Update pubPage
    const updatedPage = await updatePage(superAdmin.id, pubPage.id, {
      title: "Updated Published Test Page v2",
      summary: "Updated summary text",
    });

    const updatedRevs = await getRevisionHistory("PAGE", pubPage.id);
    assert(updatedRevs.length === 2, "Page update generated a second ContentRevision");
    assert(updatedRevs[0].version === 2, "Latest ContentRevision is version 2");
    assert(
      (updatedRevs[0].data as any).title === "Updated Published Test Page v2",
      "Version 2 snapshot matches updated title"
    );

    // -------------------------------------------------------------------------
    // SUITE 3: Content Rollback Engine (TDD Sheet 109, 173)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 3: Content Rollback Engine ---");

    const v1Revision = updatedRevs.find((r) => r.version === 1);
    assert(!!v1Revision, "Found version 1 revision for rollback test");

    // Execute Rollback
    const rollbackResult = await rollbackContentRevision(superAdmin.id, v1Revision!.id);
    assert(rollbackResult.success === true, "Rollback operation succeeded");

    const rolledBackPage = await db.page.findUnique({ where: { id: pubPage.id } });
    assert(
      rolledBackPage?.title === "Published Test Page",
      "Page title restored to version 1 snapshot"
    );

    const postRollbackRevs = await getRevisionHistory("PAGE", pubPage.id);
    assert(postRollbackRevs.length === 3, "Rollback generated an immutable version 3 revision");
    assert(postRollbackRevs[0].version === 3, "New revision after rollback is version 3");

    // Check audit trail for rollback
    const rollbackAudit = await db.auditLog.findFirst({
      where: {
        action: "CONTENT_ROLLBACK",
        targetType: "PAGE",
        targetId: pubPage.id,
      },
      orderBy: { createdAt: "desc" },
    });
    assert(!!rollbackAudit, "Audit log records CONTENT_ROLLBACK event");
    assert(
      (rollbackAudit?.metadata as any)?.restoredFromVersion === 1,
      "Audit metadata records source version 1 restored"
    );

    // -------------------------------------------------------------------------
    // SUITE 4: Role Boundaries & Content RBAC (TDD Sheet 189-191)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 4: Role Boundaries & Permissions Enforcement ---");

    // 1. Create a test user with EDITOR role
    const editorRole = await db.role.findUnique({ where: { name: RoleName.EDITOR } });
    assert(!!editorRole, "EDITOR role exists in database");

    const testEditorUser = await db.user.create({
      data: {
        email: `test-editor-${testSuffix}@megascriptdigital.co.ke`,
        normalizedEmail: `test-editor-${testSuffix}@megascriptdigital.co.ke`,
        displayName: "Test Content Editor",
        status: "ACTIVE",
      },
    });

    await db.userRole.create({
      data: {
        userId: testEditorUser.id,
        roleId: editorRole!.id,
      },
    });

    const editorPerms = await getUserRolesAndPermissions(testEditorUser.id);
    assert(editorPerms.isSuperAdmin === false, "Editor is not Super Admin");
    assert(editorPerms.permissions.has("content.read"), "Editor has permission: content.read");
    assert(editorPerms.permissions.has("content.write"), "Editor has permission: content.write");
    assert(editorPerms.permissions.has("content.publish"), "Editor has permission: content.publish");
    assert(editorPerms.permissions.has("portfolio.manage"), "Editor has permission: portfolio.manage");
    assert(editorPerms.permissions.has("services.manage"), "Editor has permission: services.manage");

    // Strict boundary checks: Editor CANNOT manage security, users, roles, or integrations
    assert(!editorPerms.permissions.has("users.manage"), "Editor strictly lacks users.manage");
    assert(!editorPerms.permissions.has("roles.manage"), "Editor strictly lacks roles.manage");
    assert(!editorPerms.permissions.has("security.manage"), "Editor strictly lacks security.manage");
    assert(!editorPerms.permissions.has("integrations.manage"), "Editor strictly lacks integrations.manage");

    // 2. Create a test user with ANALYST role
    const analystRole = await db.role.findUnique({ where: { name: RoleName.ANALYST } });
    assert(!!analystRole, "ANALYST role exists in database");

    const testAnalystUser = await db.user.create({
      data: {
        email: `test-analyst-${testSuffix}@megascriptdigital.co.ke`,
        normalizedEmail: `test-analyst-${testSuffix}@megascriptdigital.co.ke`,
        displayName: "Test Performance Analyst",
        status: "ACTIVE",
      },
    });

    await db.userRole.create({
      data: {
        userId: testAnalystUser.id,
        roleId: analystRole!.id,
      },
    });

    const analystPerms = await getUserRolesAndPermissions(testAnalystUser.id);
    assert(analystPerms.permissions.has("analytics.read"), "Analyst has permission: analytics.read");
    assert(analystPerms.permissions.has("dashboard.read"), "Analyst has permission: dashboard.read");
    assert(!analystPerms.permissions.has("content.write"), "Analyst strictly lacks content.write");
    assert(!analystPerms.permissions.has("content.publish"), "Analyst strictly lacks content.publish");
    assert(!analystPerms.permissions.has("content.rollback"), "Analyst strictly lacks content.rollback");
    assert(!analystPerms.permissions.has("portfolio.manage"), "Analyst strictly lacks portfolio.manage");

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    console.log("\n--- Cleaning up temporary test artifacts ---");

    // Delete created revisions for test entities
    await db.contentRevision.deleteMany({
      where: {
        OR: [
          { entityId: draftPage.id },
          { entityId: pubPage.id },
          { entityId: draftService.id },
          { entityId: draftProduct.id },
          { entityId: draftProject.id },
          { entityId: unapprovedTestimonial.id },
          { entityId: draftApprovedTestimonial.id },
          { entityId: validTestimonial.id },
        ],
      },
    });

    // Delete test pages
    await db.page.deleteMany({
      where: { id: { in: [draftPage.id, pubPage.id] } },
    });

    // Delete test service
    await db.service.delete({ where: { id: draftService.id } });

    // Delete test product
    await db.product.delete({ where: { id: draftProduct.id } });

    // Delete test portfolio project
    await db.portfolioProject.delete({ where: { id: draftProject.id } });

    // Delete test testimonials
    await db.testimonial.deleteMany({
      where: {
        id: { in: [unapprovedTestimonial.id, draftApprovedTestimonial.id, validTestimonial.id] },
      },
    });

    // Delete test users and user roles
    await db.userRole.deleteMany({
      where: { userId: { in: [testEditorUser.id, testAnalystUser.id] } },
    });
    await db.user.deleteMany({
      where: { id: { in: [testEditorUser.id, testAnalystUser.id] } },
    });

    console.log("Cleanup completed successfully.");

    // Final summary
    console.log("\n=================================================");
    console.log(`Stage 08 Tests Completed: ${passedTests}/${totalTests} Passed`);
    console.log("=================================================");
  } catch (error) {
    console.error("Test execution failed with error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runStage08Tests();
