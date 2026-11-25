import { db } from "@/server/db";
import { PublishStatus } from "@prisma/client";

export interface KnowledgeItemData {
  title: string;
  content: string;
  contentType: "SERVICE" | "PRODUCT" | "PORTFOLIO" | "FAQ" | "POLICY";
  route?: string;
  language?: string;
  status?: PublishStatus;
}

/**
 * Baseline Agency Facts & FAQs (TDD Sheets 082, 083, 086)
 */
export const BASELINE_KNOWLEDGE_ITEMS: KnowledgeItemData[] = [
  {
    title: "Agency Overview & Capabilities",
    content: "MegaScript Digital is an elite digital engineering agency based in Nairobi, Kenya. We specialize in custom corporate websites, performant web applications, cross-platform mobile apps (iOS & Android), automated workflow systems, and digital visibility. We prioritize rigorous engineering, sub-second page performance, and clean accessible design.",
    contentType: "POLICY",
    route: "/about",
    language: "en",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Office Location & Business Hours",
    content: "Our physical headquarters is situated at Bihi Towers, 5th Floor, Suite 04, Moi Avenue, Nairobi, Kenya. We are open Monday through Friday from 8:00 AM to 5:00 PM East Africa Time (EAT). In-person consultations can be scheduled in advance.",
    contentType: "POLICY",
    route: "/contact",
    language: "en",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Standard Website Pricing Guide",
    content: "For standard business and corporate websites, MegaScript Digital's indicative pricing guide ranges between KSh 35,000 and KSh 125,000. This is an indicative guidance range, not a binding final quote. Final pricing depends on page count, bespoke UI requirements, integrations, content preparation, and custom features. A formal discovery consultation and written quote are required.",
    contentType: "POLICY",
    route: "/pricing",
    language: "en",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Custom Web and Mobile Applications Pricing",
    content: "Custom web applications (client portals, management SaaS, internal workflow tools) and mobile applications are strictly scoped following a technical discovery phase. The standard KSh 35,000 - 125,000 website range does NOT apply to custom software. Scope, architecture, API integrations, and database complexity dictate bespoke application pricing.",
    contentType: "POLICY",
    route: "/services",
    language: "en",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Standard Project Timelines",
    content: "Standard corporate website builds typically require 2 to 6 weeks from kickoff to launch. Web applications and mobile apps typically require 6 to 16 weeks depending on system architecture and discovery sprint outcomes.",
    contentType: "POLICY",
    route: "/process",
    language: "en",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Support and Human Escalation Channels",
    content: "Visitors can connect directly with our engineering and strategy team via WhatsApp or telephone at +254 712 345 678, or by submitting an inquiry at /contact. Enquiries submitted through official channels receive an initial human response within 2 business hours.",
    contentType: "POLICY",
    route: "/contact",
    language: "en",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Privacy & Data Handling Invariant",
    content: "MegaScript Digital never requests passwords, M-Pesa PINs, credit card numbers, or private credentials via chat. All conversations are processed in accordance with the Kenya Data Protection Act 2019 and our published Privacy Policy at /privacy.",
    contentType: "POLICY",
    route: "/privacy",
    language: "en",
    status: PublishStatus.PUBLISHED,
  },
  // Kiswahili Baseline Items (Sheet 084)
  {
    title: "Muhtasari wa MegaScript Digital (Kiswahili)",
    content: "MegaScript Digital ni kampuni ya uhandisi wa kidijitali iliyoko jijini Nairobi, Kenya. Tunatengeneza tovuti za kisasa za kibiashara, mifumo ya wavuti, programu za simu za mkononi, na kuboresha mwonekano wa biashara mtandaoni. Tunazingatia usalama mkubwa, wepesi wa tovuti, na mifumo madhubuti.",
    contentType: "POLICY",
    route: "/about",
    language: "sw",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Makadirio ya Bei za Tovuti (Kiswahili)",
    content: "Kwa tovuti za kawaida za biashara, mwongozo wetu wa bei ni kuanzia KSh 35,000 hadi KSh 125,000 kulingana na mahitaji. Hii ni bei ya mwongozo tu, si nukuu ya mwisho. Bei halisi inategemea muundo, idadi ya kurasa, na vipengele maalum. Mifumo maalum ya wavuti na programu za simu hupimwa kando baada ya kikao cha uchunguzi wa kiufundi.",
    contentType: "POLICY",
    route: "/pricing",
    language: "sw",
    status: PublishStatus.PUBLISHED,
  },
  {
    title: "Ofisi na Mawasiliano (Kiswahili)",
    content: "Ofisi yetu iko Bihi Towers, Ghorofa ya 5, Suite 04, Barabara ya Moi Avenue, Nairobi. Tunafungua Jumatatu hadi Ijumaa, saa 2:00 asubuhi hadi saa 11:00 jioni. Wasiliana nasi kupitia simu au WhatsApp kwa +254 712 345 678.",
    contentType: "POLICY",
    route: "/contact",
    language: "sw",
    status: PublishStatus.PUBLISHED,
  },
];

/**
 * Synchronizes approved, published CMS models into KnowledgeItem records.
 * STRICT SECURITY INVARIANT (TDD Sheet 083):
 * - ONLY items with status: PUBLISHED are synchronized.
 * - NEVER index drafts, private leads, user accounts, API keys, or hidden notes.
 * - If a product outboundUrl is null, no URL is invented.
 */
export async function syncPublishedKnowledgeBase(): Promise<{
  syncedServices: number;
  syncedProducts: number;
  syncedPortfolio: number;
  syncedBaselines: number;
  totalKnowledgeItems: number;
}> {
  let syncedServices = 0;
  let syncedProducts = 0;
  let syncedPortfolio = 0;
  let syncedBaselines = 0;

  // 1. Sync Baselines
  for (const item of BASELINE_KNOWLEDGE_ITEMS) {
    const existing = await db.knowledgeItem.findFirst({
      where: {
        title: item.title,
        language: item.language || "en",
      },
    });

    if (existing) {
      await db.knowledgeItem.update({
        where: { id: existing.id },
        data: {
          content: item.content,
          contentType: item.contentType,
          route: item.route,
          status: item.status || PublishStatus.PUBLISHED,
        },
      });
    } else {
      await db.knowledgeItem.create({
        data: {
          title: item.title,
          content: item.content,
          contentType: item.contentType,
          route: item.route,
          language: item.language || "en",
          status: item.status || PublishStatus.PUBLISHED,
        },
      });
    }
    syncedBaselines++;
  }

  // 2. Sync Published Services
  const publishedServices = await db.service.findMany({
    where: { status: PublishStatus.PUBLISHED },
  });

  for (const s of publishedServices) {
    const title = `Service: ${s.name}`;
    const content = `${s.name} (${s.category}): ${s.shortDescription}${s.longDescription ? ` ${s.longDescription}` : ""}`;
    const route = `/services/${s.slug}`;

    const existing = await db.knowledgeItem.findFirst({
      where: { title, language: "en" },
    });

    if (existing) {
      await db.knowledgeItem.update({
        where: { id: existing.id },
        data: {
          content,
          contentType: "SERVICE",
          route,
          status: PublishStatus.PUBLISHED,
        },
      });
    } else {
      await db.knowledgeItem.create({
        data: {
          title,
          content,
          contentType: "SERVICE",
          route,
          language: "en",
          status: PublishStatus.PUBLISHED,
        },
      });
    }
    syncedServices++;
  }

  // 3. Sync Published Products
  const publishedProducts = await db.product.findMany({
    where: { status: PublishStatus.PUBLISHED },
  });

  for (const p of publishedProducts) {
    const title = `Product: ${p.name}`;
    const urlNotice = p.outboundUrl ? ` Official URL: ${p.outboundUrl}` : " (Dedicated website configured separately; no external URL confirmed yet).";
    const content = `${p.name} - ${p.tagline}. Overview: ${p.overview}. Target Audience: ${p.audience}.${urlNotice}`;
    const route = `/products/${p.slug}`;

    const existing = await db.knowledgeItem.findFirst({
      where: { title, language: "en" },
    });

    if (existing) {
      await db.knowledgeItem.update({
        where: { id: existing.id },
        data: {
          content,
          contentType: "PRODUCT",
          route,
          status: PublishStatus.PUBLISHED,
        },
      });
    } else {
      await db.knowledgeItem.create({
        data: {
          title,
          content,
          contentType: "PRODUCT",
          route,
          language: "en",
          status: PublishStatus.PUBLISHED,
        },
      });
    }
    syncedProducts++;
  }

  // 4. Sync Published Portfolio Projects
  const publishedPortfolio = await db.portfolioProject.findMany({
    where: { status: PublishStatus.PUBLISHED },
  });

  for (const proj of publishedPortfolio) {
    const title = `Portfolio: ${proj.businessName}`;
    const content = `Client: ${proj.businessName} (${proj.industry}). Solution: ${proj.businessDescription}. Scope Delivered: ${proj.deliveredWork}.${proj.externalUrl ? ` Project URL: ${proj.externalUrl}` : ""}`;
    const route = `/portfolio/${proj.slug}`;

    const existing = await db.knowledgeItem.findFirst({
      where: { title, language: "en" },
    });

    if (existing) {
      await db.knowledgeItem.update({
        where: { id: existing.id },
        data: {
          content,
          contentType: "PORTFOLIO",
          route,
          status: PublishStatus.PUBLISHED,
        },
      });
    } else {
      await db.knowledgeItem.create({
        data: {
          title,
          content,
          contentType: "PORTFOLIO",
          route,
          language: "en",
          status: PublishStatus.PUBLISHED,
        },
      });
    }
    syncedPortfolio++;
  }

  const totalKnowledgeItems = await db.knowledgeItem.count({
    where: { status: PublishStatus.PUBLISHED },
  });

  return {
    syncedServices,
    syncedProducts,
    syncedPortfolio,
    syncedBaselines,
    totalKnowledgeItems,
  };
}
