export interface ProductData {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  overview: string;
  audience: string;
  problem: string;
  solution: string;
  verifiedFeatures: {
    title: string;
    description: string;
    isRoadmap?: boolean;
  }[];
  benefits: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  ctaLabel: string;
  defaultOutboundUrl?: string | null;
  seo: {
    title: string;
    description: string;
  };
}

export const PRODUCTS_DATA: Record<string, ProductData> = {
  fortress: {
    slug: "fortress",
    name: "Fortress",
    badge: "AI Website Builder",
    tagline: "Build and launch a structured business website faster without starting from a blank page.",
    overview:
      "Designed to remove the friction of getting online, Fortress is MegaScript Digital's dedicated AI-assisted website builder. It guides founders and small-business owners from initial service description to a fully assembled, responsive website draft in minutes.",
    audience:
      "Small-business owners, founders, solo service providers, and agile teams looking for a guided, structured way to establish an online presence without technical overhead.",
    problem:
      "Starting a website from scratch often leads to blank-page paralysis, high agency setup fees, or confusing generic builders with endless bloated settings. Most small businesses just need a clean, structured site that clearly explains what they do.",
    solution:
      "Fortress asks conversational questions about your business services, target audience, and contact details, then automatically generates structured section drafts, readable copy, and responsive layouts tailored to your industry.",
    verifiedFeatures: [
      {
        title: "Guided Conversational Onboarding",
        description:
          "Answer clear questions about what your business offers, your service areas, and your contact pathways.",
      },
      {
        title: "Automated Section Assembly",
        description:
          "Generates structured multi-section homepage drafts (Hero, Services, About, Testimonials, Contact) with coherent layouts.",
      },
      {
        title: "Responsive Multi-Viewport Preview",
        description:
          "Inspect how your assembled website renders across mobile, tablet, and desktop viewports in real time.",
      },
      {
        title: "Content & Copy Refinement",
        description:
          "Edit text, reorder sections, and adjust color themes with zero coding required.",
      },
      {
        title: "Custom Domain Connection",
        description:
          "Connect your verified domain name when you are ready to publish live to the web.",
        isRoadmap: false,
      },
    ],
    benefits: [
      {
        title: "Eliminate Blank-Page Friction",
        description:
          "Never stare at an empty canvas. Get an intelligent, structured first draft assembled in minutes.",
      },
      {
        title: "Mobile-First Design Foundations",
        description:
          "Every generated template is engineered to look sharp and load quickly on mobile smartphones.",
      },
      {
        title: "Clear Business Communication",
        description:
          "Copy frameworks encourage plain language that explains your actual service benefits to real customers.",
      },
    ],
    faqs: [
      {
        question: "Is Fortress hosted directly inside this website?",
        answer:
          "No. Fortress operates on its own dedicated, standalone cloud infrastructure with separate user authentication and website publishing systems. This page serves solely as an introductory overview.",
      },
      {
        question: "Do I need coding experience to use Fortress?",
        answer:
          "No coding experience is required. Fortress is engineered specifically for non-technical business owners, providing intuitive visual editing and guided content generation.",
      },
      {
        question: "Can I connect my own custom domain?",
        answer:
          "Yes. Once your site draft is ready, Fortress provides guided DNS instructions to point your own custom domain name (e.g. yourbusiness.co.ke) to your published site.",
      },
    ],
    ctaLabel: "Visit Fortress Website",
    defaultOutboundUrl: null, // Configured via /master/content/products or environment
    seo: {
      title: "Fortress AI Website Builder | MegaScript Digital Products",
      description:
        "Build and launch a structured business website faster with Fortress, MegaScript Digital's dedicated AI-assisted website builder.",
    },
  },

  leaseflow: {
    slug: "leaseflow",
    name: "LeaseFlow",
    badge: "Rental Management Platform",
    tagline: "Bring properties, tenant records, and rent tracking into one organized system.",
    overview:
      "Built to simplify everyday rental operations without scattered notebooks and chaotic chat threads. LeaseFlow gives landlords and property managers a single, clear operating dashboard for property directories, tenant ledgers, and rent balance tracking.",
    audience:
      "Landlords, real estate agents, caretakers, and property managers overseeing residential apartments, commercial offices, or multi-unit rental developments.",
    problem:
      "Managing rental units across paper notebooks, spreadsheets, and messaging apps leads to missed payments, confusing deposit records, lost tenant histories, and stressful end-of-month reconciliations.",
    solution:
      "LeaseFlow centralizes properties, units, tenant contacts, lease start/end dates, monthly rent schedules, and payment receipts in one organized database accessible securely from any browser.",
    verifiedFeatures: [
      {
        title: "Property & Unit Inventory Directory",
        description:
          "Organize properties, physical buildings, individual unit numbers, monthly rental rates, and occupancy statuses.",
      },
      {
        title: "Tenant Records & Lease Ledgers",
        description:
          "Maintain tenant contact details, emergency contacts, lease agreements, and security deposit records.",
      },
      {
        title: "Rent Payment Logging & Balance Tracking",
        description:
          "Record rent payments, identify overdue balances, and track partial payments with automatic balance updates.",
      },
      {
        title: "Digital Receipt Generation",
        description:
          "Issue clean, structured payment confirmation receipts and monthly account statements.",
      },
      {
        title: "Occupancy & Revenue Reporting",
        description:
          "Review monthly collection totals, vacancy rates, and overdue rent summaries at a glance.",
        isRoadmap: false,
      },
    ],
    benefits: [
      {
        title: "Stop Rent Tracking Confusion",
        description:
          "Eliminate disputed payment records with timestamped digital ledgers and clear outstanding balances.",
      },
      {
        title: "Zero Lost Tenant Histories",
        description:
          "Keep historical records of past and current tenancies, move-in dates, and security deposits organized.",
      },
      {
        title: "Save Hours at Month-End",
        description:
          "Generate instant collection reports and tenant balance statements with a single click.",
      },
    ],
    faqs: [
      {
        question: "Is LeaseFlow a standalone application?",
        answer:
          "Yes. LeaseFlow is an independent property management SaaS platform running on its own dedicated database and cloud infrastructure. Your property data is isolated and protected.",
      },
      {
        question: "Can multiple property managers or caretakers use the same account?",
        answer:
          "Yes. LeaseFlow supports multi-user administrative access with defined role permissions so staff can record daily payments without accessing private ownership accounts.",
      },
      {
        question: "Does LeaseFlow guarantee automatic rent collection?",
        answer:
          "No software can guarantee tenant compliance or automatic collections. LeaseFlow provides the structured operational tracking, receipting, and balance visibility that makes collection systematic and verifiable.",
      },
    ],
    ctaLabel: "Explore LeaseFlow",
    defaultOutboundUrl: null,
    seo: {
      title: "LeaseFlow Rental Management System | MegaScript Digital Products",
      description:
        "Organize properties, tenant ledgers, and rent collection records in one clean system with LeaseFlow by MegaScript Digital.",
    },
  },

  uzadigital: {
    slug: "uzadigital",
    name: "UzaDigital",
    badge: "Point-of-Sale System",
    tagline: "Streamline everyday counter checkout and sales tracking with clarity.",
    overview:
      "A straightforward point-of-sale platform built for busy retail counters, neighborhood shops, and hospitality venues. UzaDigital replaces paper sales books with fast touch item lookups, order tallying, and clear end-of-day sales reconciliations.",
    audience:
      "Retail shop owners, boutique managers, lounge operators, cafes, and counter-based service providers needing clear sales management without cumbersome enterprise POS setups.",
    problem:
      "Busy counters often struggle with slow checkout arithmetic, unrecorded sales, lost paper receipts, and zero visibility into daily revenue totals until hours after closing.",
    solution:
      "UzaDigital provides a fast, mobile-friendly counter interface where cashiers tap items, calculate order totals instantly, record cash or M-Pesa payments, and generate daily sales summaries.",
    verifiedFeatures: [
      {
        title: "Fast Touch Product Catalog",
        description:
          "Organize items with clear names, categories, and unit prices for rapid one-tap order adding.",
      },
      {
        title: "Instant Cart Calculation",
        description:
          "Calculates order subtotals, line items, and change due with zero manual arithmetic errors.",
      },
      {
        title: "Payment Method Recording",
        description:
          "Categorize completed sales by Cash, M-Pesa reference, or Card for accurate register closing.",
      },
      {
        title: "Daily End-of-Day Sales Summary",
        description:
          "Generate daily revenue summaries showing total sales, order counts, and payment breakdowns.",
      },
      {
        title: "Basic Inventory Item Counter",
        description:
          "Track basic remaining stock quantities as sales are rung up at the register.",
        isRoadmap: false,
      },
    ],
    benefits: [
      {
        title: "Faster Counter Checkout",
        description:
          "Keep customer lines moving quickly with instant item lookup and automated total calculation.",
      },
      {
        title: "Stop Cash Register Discrepancies",
        description:
          "Every sale is recorded with payment method details, simplifying daily shift handovers and reconciliations.",
      },
      {
        title: "Works on Any Tablet or PC",
        description:
          "Accessible through modern web browsers on existing tablets, laptops, or desktop counter screens.",
      },
    ],
    faqs: [
      {
        question: "What hardware is required to run UzaDigital?",
        answer:
          "UzaDigital is designed to run in standard web browsers on devices you already own—such as an Android tablet, iPad, laptop, or desktop counter PC. Special proprietary POS hardware is not mandatory.",
      },
      {
        question: "Does UzaDigital operate on this website?",
        answer:
          "No. UzaDigital is a dedicated retail point-of-sale platform hosted on its own secure application domain. This page serves as a product introduction and demonstration hub.",
      },
      {
        question: "Can UzaDigital automatically file taxes?",
        answer:
          "No. UzaDigital provides structured operational sales records and transaction tallies. It does not automatically file statutory taxes or provide automated fiscal certification unless integrated with approved third-party fiscal devices.",
      },
    ],
    ctaLabel: "Visit UzaDigital",
    defaultOutboundUrl: null,
    seo: {
      title: "UzaDigital Point-of-Sale System | MegaScript Digital Products",
      description:
        "Streamline counter checkout, order line items, and daily sales tracking with UzaDigital by MegaScript Digital.",
    },
  },

  "fm-scheduler": {
    slug: "fm-scheduler",
    name: "FM Scheduler",
    badge: "Creator & Event Scheduling",
    tagline: "Keep your schedule and social content organized in one dependable workflow.",
    overview:
      "Engineered for busy content creators, DJs, event professionals, and independent service providers balancing client bookings, appearances, and digital visibility. FM Scheduler brings booking availability and social media scheduling into a unified calendar.",
    audience:
      "Content creators, DJs, event hosts, creative professionals, photographers, and independent consultants managing client appointment bookings alongside social media presence.",
    problem:
      "Creatives frequently juggle double-booked appearances, chaotic direct-message booking requests, forgotton social media posts, and scattered calendar apps.",
    solution:
      "FM Scheduler provides a shareable booking link where clients request confirmed dates, alongside a social media content planning queue that helps creators stay consistent online.",
    verifiedFeatures: [
      {
        title: "Shareable Availability Calendar",
        description:
          "Set your working hours, blocked dates, and event availability so clients only request open slots.",
      },
      {
        title: "Client Booking Intake Flow",
        description:
          "Capture event details, location, event type, and client contact requirements before confirming dates.",
      },
      {
        title: "Social Media Post Queue",
        description:
          "Plan and organize scheduled draft posts, captions, and publication dates in a visual content calendar.",
      },
      {
        title: "Automated Appointment Reminders",
        description:
          "Send structured reminder notifications to clients prior to scheduled dates and appearances.",
      },
      {
        title: "Appearance & Gig Overview",
        description:
          "Review upcoming confirmed bookings, pending requests, and scheduled content at a glance.",
        isRoadmap: false,
      },
    ],
    benefits: [
      {
        title: "Prevent Double-Bookings",
        description:
          "Clear calendar availability ensures you never agree to two gigs or appointments at the same time.",
      },
      {
        title: "Professional Client Experience",
        description:
          "Replace disorganized WhatsApp chat threads with a structured, professional booking request pathway.",
      },
      {
        title: "Consistent Social Media Presence",
        description:
          "Plan your promotional content days in advance so your marketing runs consistently even during busy performance weeks.",
      },
    ],
    faqs: [
      {
        question: "Can clients book appearances directly without approval?",
        answer:
          "You have full control. You can configure FM Scheduler to require manual review and approval for every booking request, or allow instant confirmation for designated service slots.",
      },
      {
        question: "Does FM Scheduler post to all social networks automatically?",
        answer:
          "Social platform integrations are governed by third-party API policies (Meta, X, TikTok) which require verified user account permissions and may vary by platform. FM Scheduler organizes and schedules content according to current supported platform APIs.",
      },
      {
        question: "Is FM Scheduler separate from the MegaScript corporate site?",
        answer:
          "Yes. FM Scheduler operates on its own dedicated software platform with private user accounts and calendar databases. Your bookings and content are completely private to your account.",
      },
    ],
    ctaLabel: "Explore FM Scheduler",
    defaultOutboundUrl: null,
    seo: {
      title: "FM Scheduler for Creators & Event Professionals | MegaScript Digital Products",
      description:
        "Manage event bookings, client appointments, and social content queues in one organized calendar with FM Scheduler.",
    },
  },
};
