export type WowFactorDemoType =
  | "LIVE_DEMO"
  | "VISUAL_CONCEPT"
  | "CLIENT_FEATURE"
  | "ILLUSTRATIVE_PROTOTYPE";

export interface WowFactorData {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  summary: string;
  demonstrationType: WowFactorDemoType;
  typeBadgeLabel: string;
  capabilities: string[];
  operationalValue: string;
  demoUrl?: string | null;
  ctaText: string;
}

export const WOW_FACTORS_DATA: Record<string, WowFactorData> = {
  "ai-crm-agent": {
    slug: "ai-crm-agent",
    title: "Tony AI Conversational Assistant",
    tagline: "First-Party Qualification & Lead Triage Assistant",
    category: "AI & Conversational Architecture",
    summary:
      "A dual-engine AI conversational agent operating directly on the corporate website, capable of qualifying incoming business inquiries, answering technical service questions, and persisting transcripts securely into the administrative CRM.",
    demonstrationType: "LIVE_DEMO",
    typeBadgeLabel: "Live Working Demo",
    capabilities: [
      "Bilingual English and Swahili conversational understanding",
      "Strict scope guardrails preventing hallucinations or fabricated pricing promises",
      "Dynamic switching between Google Gemini and DeepSeek models",
      "Zero third-party tracking cookies or embedded external iframe widgets",
    ],
    operationalValue:
      "Engages prospective clients at any hour, clarifies project scopes before human team handover, and captures structured qualification notes automatically.",
    demoUrl: null, // Triggers widget opening in UI
    ctaText: "Test Tony Live on this Site",
  },

  "interactive-rental-dashboard": {
    slug: "interactive-rental-dashboard",
    title: "LeaseFlow Operations Console",
    tagline: "Dedicated Property & Tenant Ledger Platform",
    category: "Enterprise Web Applications",
    summary:
      "A purpose-built operational management console designed for landlords and property managers to organize unit directories, track lease agreements, record rent payments, and manage maintenance tickets without spreadsheet chaos.",
    demonstrationType: "ILLUSTRATIVE_PROTOTYPE",
    typeBadgeLabel: "Illustrative Prototype",
    capabilities: [
      "Multi-property and multi-unit directory management",
      "Tenant contact profiles and lease agreement date tracking",
      "Manual rent payment recording and branded PDF receipt generation",
      "Maintenance ticketing queue with priority tracking",
    ],
    operationalValue:
      "Replaces scattered paper notebooks, disjointed messaging apps, and lost receipts with an authoritative operational database.",
    demoUrl: "/products/leaseflow",
    ctaText: "Explore LeaseFlow Overview",
  },

  "high-velocity-checkout": {
    slug: "high-velocity-checkout",
    title: "UzaDigital POS Engine",
    tagline: "Streamlined In-Store Checkout Interface",
    category: "Retail Systems",
    summary:
      "A fast, touch-friendly counter point-of-sale checkout interface built for physical retail shops, boutiques, and merchant counters requiring rapid item lookups, receipt generation, and daily sales reconciliation.",
    demonstrationType: "ILLUSTRATIVE_PROTOTYPE",
    typeBadgeLabel: "Illustrative Prototype",
    capabilities: [
      "Instant barcode scan and fuzzy product catalog search",
      "Cash and mobile money payment recording with automatic balance calculation",
      "Instant printable receipt formatting and SMS receipt dispatch",
      "End-of-day sales reconciliation summary for business owners",
    ],
    operationalValue:
      "Speeds up customer checkout queues, prevents inventory leakage, and provides clear daily takings records without complex hardware setups.",
    demoUrl: "/products/uzadigital",
    ctaText: "Explore UzaDigital Overview",
  },

  "dynamic-dispatch-calendar": {
    slug: "dynamic-dispatch-calendar",
    title: "FM Scheduler Timeline",
    tagline: "Visual Multi-Channel Publishing Calendar",
    category: "Media & Scheduling Systems",
    summary:
      "A visual scheduling calendar and content queue planner designed for digital creators, creative agencies, and service providers managing scheduled content and appointments across multiple channels.",
    demonstrationType: "ILLUSTRATIVE_PROTOTYPE",
    typeBadgeLabel: "Illustrative Prototype",
    capabilities: [
      "Drag-and-drop monthly and weekly calendar planning views",
      "Multi-platform post composition with image attachment previews",
      "Review and approval status stages for collaborative teams",
      "Scheduled publication queue with time slot management",
    ],
    operationalValue:
      "Allows marketing teams and creators to plan weeks of structured content in advance, eliminating last-minute publishing rushes.",
    demoUrl: "/products/fm-scheduler",
    ctaText: "Explore FM Scheduler Overview",
  },
};
