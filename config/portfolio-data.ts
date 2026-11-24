export interface PortfolioProjectData {
  slug: string;
  businessName: string;
  industry: string;
  industryCategory:
    | "tours-travel"
    | "finance-advisory"
    | "community-arts"
    | "hospitality-events"
    | "technology";
  monogram: string;
  businessDescription: string;
  deliveredWork: string;
  externalUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
  challengeSummary: string;
  deliveredScopeDetails: {
    area: string;
    deliverables: string[];
  }[];
  businessOutcome: string;
  relatedServiceSlug: string;
  seo: {
    title: string;
    description: string;
  };
}

export const PORTFOLIO_PROJECTS_DATA: Record<string, PortfolioProjectData> = {
  "lucky-house-safaris": {
    slug: "lucky-house-safaris",
    businessName: "Lucky House Safaris",
    industry: "Tours & Safaris",
    industryCategory: "tours-travel",
    monogram: "LHS",
    businessDescription:
      "A tour and safari company organizing guided travel experiences, wildlife expeditions, and custom itineraries across East Africa.",
    deliveredWork:
      "Website platform and digital tour showcase tailored to help international travelers explore itineraries and send trip inquiries clearly.",
    externalUrl: "https://luckyhousetc.co.ke/",
    isFeatured: true,
    displayOrder: 1,
    challengeSummary:
      "Prospective travelers needed a clear, trustworthy website to browse regional tour packages without confusing booking steps or scattered pricing sheets.",
    deliveredScopeDetails: [
      {
        area: "Web Architecture & Discoverability",
        deliverables: [
          "Responsive, mobile-first tour and safari showcase",
          "Structured itinerary overview with day-by-day breakdowns",
          "High-speed image loading optimized for safari photography",
        ],
      },
      {
        area: "Inquiry Conversion",
        deliverables: [
          "Direct trip inquiry modal and quote request routing",
          "Direct WhatsApp contact pathways for immediate traveler support",
          "East African travel advisory and package inclusion disclosures",
        ],
      },
    ],
    businessOutcome:
      "Established a dependable online home that positions the agency professionally for international travelers planning East African safaris.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Lucky House Safaris Case Profile | MegaScript Digital Kenya",
      description:
        "Case overview for Lucky House Safaris: digital tour showcase and inquiry platform engineered by MegaScript Digital.",
    },
  },

  "luminary-mtaji-partners": {
    slug: "luminary-mtaji-partners",
    businessName: "Luminary Mtaji Partners",
    industry: "Finance & Advisory",
    industryCategory: "finance-advisory",
    monogram: "LMP",
    businessDescription:
      "A finance and advisory company providing structured financial solutions, growth capital consulting, and business financing options.",
    deliveredWork:
      "Corporate digital presence and brand presentation built for institutional credibility, regulatory clarity, and direct client inquiries.",
    externalUrl: "https://luminarymtajipartners.co.ke/",
    isFeatured: true,
    displayOrder: 2,
    challengeSummary:
      "Financial advisory requires strong institutional trust. The firm needed an authoritative digital profile explaining financing models without ambiguous financial claims.",
    deliveredScopeDetails: [
      {
        area: "Corporate Platform",
        deliverables: [
          "Executive corporate website with high-contrast typography",
          "Structured financing criteria and advisory service descriptions",
          "Secure qualification inquiry pathways for commercial clients",
        ],
      },
      {
        area: "Governance & Disclosures",
        deliverables: [
          "Clear regulatory disclosures and engagement process outlines",
          "Mobile-accessible consultation booking pathways",
        ],
      },
    ],
    businessOutcome:
      "Equipped the firm with a high-trust digital storefront that qualifies incoming commercial financing inquiries effectively.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Luminary Mtaji Partners Case Profile | MegaScript Digital Kenya",
      description:
        "Corporate digital presence engineered for Luminary Mtaji Partners by MegaScript Digital.",
    },
  },

  "skrach-art": {
    slug: "skrach-art",
    businessName: "Skrach Art",
    industry: "Art Organisation",
    industryCategory: "community-arts",
    monogram: "SKA",
    businessDescription:
      "A community-focused art organization supporting creative expression, artist mentorship, and cultural development initiatives in Kenya.",
    deliveredWork:
      "Official website setup designed to communicate community programs, showcase creative initiatives, and streamline contact pathways.",
    externalUrl: "https://skrachart.co.ke/",
    isFeatured: true,
    displayOrder: 3,
    challengeSummary:
      "The organization was running community programs but lacked a centralized public platform to present its artistic mission, past exhibitions, and partnership pathways.",
    deliveredScopeDetails: [
      {
        area: "Community Showcase",
        deliverables: [
          "Clean visual layout presenting community programs and artist workshops",
          "Exhibition archives with contextual project descriptions",
          "Partner and patron outreach contact pathways",
        ],
      },
      {
        area: "Digital Accessibility",
        deliverables: [
          "High-contrast, accessible typography for varied screen environments",
          "Fast loading across mobile networks for community members",
        ],
      },
    ],
    businessOutcome:
      "Delivered an authoritative public home that validates the organization's work to international partners and cultural institutions.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Skrach Art Case Profile | MegaScript Digital Kenya",
      description:
        "Digital web presence engineered for Skrach Art community organization by MegaScript Digital.",
    },
  },

  "abwa-world": {
    slug: "abwa-world",
    businessName: "ABWA World",
    industry: "Non-Profit Organisation",
    industryCategory: "community-arts",
    monogram: "ABW",
    businessDescription:
      "Action for Better World Association (ABWA), an international non-profit organization dedicated to sustainable community outreach and youth empowerment.",
    deliveredWork:
      "Public web platform structured to present community initiatives, support global outreach, and simplify ongoing program announcements.",
    externalUrl: "https://abwaworld.org/",
    isFeatured: true,
    displayOrder: 4,
    challengeSummary:
      "Non-profit initiatives require transparent documentation of projects, community programs, and contact pathways for international supporters.",
    deliveredScopeDetails: [
      {
        area: "Program Platform",
        deliverables: [
          "Public web architecture organizing initiatives into distinct thematic areas",
          "Community story publishing layout for impact updates",
          "Direct volunteer and supporter contact channels",
        ],
      },
      {
        area: "Global Reliability",
        deliverables: [
          "Global CDN caching ensuring reliable uptime for overseas visitors",
          "Accessible standards complying with international web guidelines",
        ],
      },
    ],
    businessOutcome:
      "Empowered the organization to present its field work with transparency and credibility across multiple countries.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "ABWA World Case Profile | MegaScript Digital Kenya",
      description:
        "Public web platform engineered for Action for Better World Association (ABWA) by MegaScript Digital.",
    },
  },

  "fexty-safaris": {
    slug: "fexty-safaris",
    businessName: "Fexty Safaris",
    industry: "Tour & Safari Agency",
    industryCategory: "tours-travel",
    monogram: "FXS",
    businessDescription:
      "A tour and safari agency offering curated travel itineraries, game drives, and East African coastal destination experiences.",
    deliveredWork:
      "Digital web presence structured for clear safari package discovery, destination guides, and traveler inquiries.",
    externalUrl: "https://fextysafaris.com/en",
    isFeatured: false,
    displayOrder: 5,
    challengeSummary:
      "Competing safari operators often overwhelm visitors with fragmented options. Fexty Safaris needed a simple, elegant presentation of their primary safari packages.",
    deliveredScopeDetails: [
      {
        area: "Tour Showcase",
        deliverables: [
          "Curated destination catalog with clear regional highlights",
          "Structured safari inquiry form capturing travel dates and group sizes",
          "Mobile-friendly package navigation",
        ],
      },
    ],
    businessOutcome:
      "Provided a clean booking inquiry pipeline that reduces back-and-forth communication for custom travel itineraries.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Fexty Safaris Case Profile | MegaScript Digital Kenya",
      description:
        "Safari package showcase and traveler inquiry pipeline engineered for Fexty Safaris by MegaScript Digital.",
    },
  },

  "tawi-talent-partners": {
    slug: "tawi-talent-partners",
    businessName: "Tawi Talent Partners",
    industry: "Travel & Talent Agency",
    industryCategory: "tours-travel",
    monogram: "TTP",
    businessDescription:
      "Connects clients and candidates with structured international placement, professional relocation, and travel support services.",
    deliveredWork:
      "Fast, streamlined company website designed for clear service communication and direct applicant or client contact.",
    externalUrl: "https://tawitalentpartners.co.ke/",
    isFeatured: false,
    displayOrder: 6,
    challengeSummary:
      "International placement and recruitment processes demand clarity regarding verified application channels, documentation support, and employer partnerships.",
    deliveredScopeDetails: [
      {
        area: "Service Architecture",
        deliverables: [
          "Structured recruitment service pages distinguishing client and candidate tracks",
          "Document verification guidance and FAQ section",
          "Direct candidate inquiry workflow",
        ],
      },
    ],
    businessOutcome:
      "Streamlined candidate inquiry triage and established verified online legitimacy against unauthorized copycats.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Tawi Talent Partners Case Profile | MegaScript Digital Kenya",
      description:
        "Corporate web presence for talent and travel advisory engineered for Tawi Talent Partners by MegaScript Digital.",
    },
  },

  "craydel-africa-travel": {
    slug: "craydel-africa-travel",
    businessName: "Craydel Africa Travel",
    industry: "Safari Agency",
    industryCategory: "tours-travel",
    monogram: "CAT",
    businessDescription:
      "A boutique safari agency curating African travel experiences, private lodge bookings, and adventure expeditions.",
    deliveredWork:
      "Travel website presentation built to showcase destinations and streamline visitor inquiries.",
    externalUrl: "https://craydelafricatravel.netlify.app/",
    isFeatured: false,
    displayOrder: 7,
    challengeSummary:
      "The agency required a lightweight digital presence capable of showcasing high-quality safari packages with rapid page load speeds on mobile networks.",
    deliveredScopeDetails: [
      {
        area: "Lightweight Web Showcase",
        deliverables: [
          "Clean visual portfolio of holiday itineraries and national park tours",
          "Direct inquiry pathways linked to agency trip planners",
          "Mobile-optimized safari package detail layouts",
        ],
      },
    ],
    businessOutcome:
      "Enabled rapid client onboarding and trip planning with an accessible, high-speed mobile website.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Craydel Africa Travel Case Profile | MegaScript Digital Kenya",
      description:
        "Boutique safari travel showcase engineered for Craydel Africa Travel by MegaScript Digital.",
    },
  },

  "janave-events": {
    slug: "janave-events",
    businessName: "Janave Events",
    industry: "Events Planning",
    industryCategory: "hospitality-events",
    monogram: "JNE",
    businessDescription:
      "An events planning and production company coordinating private celebrations, corporate functions, and themed decor across Kenya.",
    deliveredWork:
      "Clean service website highlighting event planning capabilities, portfolio highlights, and direct booking inquiries.",
    externalUrl: "https://janaveevents.netlify.app/",
    isFeatured: false,
    displayOrder: 8,
    challengeSummary:
      "Event hosts needed to evaluate venue styling, coordination packages, and availability quickly before submitting consultation requests.",
    deliveredScopeDetails: [
      {
        area: "Event Service Portfolio",
        deliverables: [
          "Service packaging separating corporate, wedding, and private events",
          "Interactive consultation booking request form",
          "Visual service breakdown emphasizing coordination reliability",
        ],
      },
    ],
    businessOutcome:
      "Provided an organized platform that converts event hosting inquiries into qualified planning sessions.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Janave Events Case Profile | MegaScript Digital Kenya",
      description:
        "Event planning service showcase engineered for Janave Events by MegaScript Digital.",
    },
  },

  "ozone-lounge": {
    slug: "ozone-lounge",
    businessName: "Ozone Lounge",
    industry: "Bar & Food Lounge",
    industryCategory: "hospitality-events",
    monogram: "OZL",
    businessDescription:
      "A hospitality venue offering food, specialty drinks, evening entertainment, and VIP lounge experiences in Kenya.",
    deliveredWork:
      "Digital venue presence and menu access tailored for easy smartphone browsing by patrons and guests.",
    externalUrl: "https://ozonelounge.co.ke/",
    isFeatured: false,
    displayOrder: 9,
    challengeSummary:
      "Patrons at the venue and prospective weekend guests needed rapid access to food menus, event schedules, and reservation contacts from their mobile phones.",
    deliveredScopeDetails: [
      {
        area: "Mobile Venue Experience",
        deliverables: [
          "Mobile-first digital menu optimized for low-bandwidth cellular connections",
          "One-tap table reservation and location navigation pathways",
          "Weekly entertainment schedule announcements",
        ],
      },
    ],
    businessOutcome:
      "Eliminated slow PDF menu downloads for patrons and gave the venue an authentic, branded mobile landing point.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Ozone Lounge Case Profile | MegaScript Digital Kenya",
      description:
        "Mobile venue platform and digital menu access engineered for Ozone Lounge by MegaScript Digital.",
    },
  },

  "unified-option-service": {
    slug: "unified-option-service",
    businessName: "Unified Option Service",
    industry: "Finance",
    industryCategory: "finance-advisory",
    monogram: "UOS",
    businessDescription:
      "A financial services company providing structured financing options, asset financing, and working capital solutions to commercial and personal clients.",
    deliveredWork:
      "Corporate website built to explain financing options clearly and route qualified prospects to the team.",
    externalUrl: "https://unified.co.ke/",
    isFeatured: false,
    displayOrder: 10,
    challengeSummary:
      "Applicants often struggled to understand eligibility requirements across multiple financing products without speaking directly to a representative.",
    deliveredScopeDetails: [
      {
        area: "Financial Product Clarity",
        deliverables: [
          "Transparent product outlines with requirement checklists",
          "Application inquiry routing with preliminary eligibility prompts",
          "Compliant financial disclosures and business contact details",
        ],
      },
    ],
    businessOutcome:
      "Reduced unqualified inquiries and accelerated application processing for the lending team.",
    relatedServiceSlug: "website-development-seo",
    seo: {
      title: "Unified Option Service Case Profile | MegaScript Digital Kenya",
      description:
        "Financial service website engineered for Unified Option Service by MegaScript Digital.",
    },
  },

  "megascript-digital-solutions": {
    slug: "megascript-digital-solutions",
    businessName: "MegaScript Solutions",
    industry: "Technology",
    industryCategory: "technology",
    monogram: "MDS",
    businessDescription:
      "MegaScript Digital's internal platform engineering showcase and architectural demonstration testbed.",
    deliveredWork:
      "Platform engineering, proof-of-concept architectures, and continuous performance benchmarking.",
    externalUrl: "https://megascriptdigital.co.ke",
    isFeatured: false,
    displayOrder: 11,
    challengeSummary:
      "Validating high-speed serverless deployments, multi-tenant databases, and accessibility standards in live production environments.",
    deliveredScopeDetails: [
      {
        area: "Engineering Benchmarks",
        deliverables: [
          "Real-time database connection pooling and transaction routing",
          "Strict WCAG 2.2 AA accessibility test implementations",
          "Zero-dependency layout token systems",
        ],
      },
    ],
    businessOutcome:
      "Serves as the rigorous engineering foundation powering all MegaScript customer and proprietary applications.",
    relatedServiceSlug: "web-app-development",
    seo: {
      title: "MegaScript Solutions Case Profile | MegaScript Digital Kenya",
      description:
        "Internal platform engineering and architectural testbed profile for MegaScript Digital Solutions.",
    },
  },
};
