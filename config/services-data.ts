export interface ServiceData {
  slug: string;
  name: string;
  category: "CORE" | "COMPLEMENTARY";
  tagline: string;
  shortDescription: string;
  heroDescription: string;
  pricingGuidance?: {
    minKsh: number;
    maxKsh: number;
    timeline: string;
    disclaimer: string;
  };
  includedStandard: string[];
  customScoped: string[];
  processSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  technicalModal: {
    title: string;
    subtitle: string;
    sections: {
      heading: string;
      items: string[];
    }[];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  cta: {
    title: string;
    subtitle: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const SERVICES_DATA: Record<string, ServiceData> = {
  "website-development-seo": {
    slug: "website-development-seo",
    name: "Website Development & SEO",
    category: "CORE",
    tagline: "High-speed corporate websites built for clarity, conversion, and discoverability.",
    shortDescription:
      "Fast, mobile-first websites designed to explain what you do clearly, build trust with visitors, and support search engine discoverability from the ground up.",
    heroDescription:
      "We build responsive, fast-loading business websites that explain your services with precision, establish professional credibility, and provide rock-solid technical SEO foundations for long-term organic search performance.",
    pricingGuidance: {
      minKsh: 35000,
      maxKsh: 125000,
      timeline: "Approximately 2 to 6 weeks",
      disclaimer:
        "Indicative pricing applies strictly to standard multi-page business websites. Final quotations depend on exact page counts, custom content readiness, multilingual requirements, and specialized third-party integrations. Complexity, timely feedback, and approval cycles directly affect actual delivery timelines.",
    },
    includedStandard: [
      "Custom responsive interface design tailored to all screen viewports (mobile, tablet, desktop)",
      "Multi-page information architecture structured for visitor navigation clarity",
      "Semantic HTML5 landmarks, accessible typography, and WCAG AA contrast compliance",
      "Core Web Vitals engineering targeting sub-2.5s Largest Contentful Paint (LCP)",
      "Built-in technical SEO: semantic metadata, OpenGraph tags, dynamic sitemap.xml, and robots.txt",
      "Configured contact capture forms with client notification routing",
      "First-party privacy-respecting analytics and consent integration readiness",
      "Client training and full handover of production assets and code repository",
    ],
    customScoped: [
      "Custom content management system (CMS) collections for complex publishing",
      "Multilingual translation matrices (e.g., English and Kiswahili side-by-side)",
      "Custom payment collection flows (e.g., M-Pesa Daraja STK Push or card gateways)",
      "Complex interactive calculators, booking widgets, or customer account areas",
      "Advanced third-party CRM and email automation webhooks",
    ],
    processSteps: [
      {
        step: 1,
        title: "Discovery & Structure",
        description:
          "We analyze your business goals, target audience, and service hierarchy to map out a clear multi-page sitemap and information architecture.",
      },
      {
        step: 2,
        title: "UX/UI Design & Content",
        description:
          "We craft accessible, clean layouts focused on readability, user trust, and friction-free contact pathways across all device sizes.",
      },
      {
        step: 3,
        title: "Modern Engineering",
        description:
          "We develop your site using modern component frameworks, enforcing semantic HTML, accessible navigation, and zero layout shift.",
      },
      {
        step: 4,
        title: "Technical SEO & Speed Audit",
        description:
          "We optimize asset delivery, configure metadata, establish sitemaps, and test Core Web Vitals performance before deployment.",
      },
      {
        step: 5,
        title: "Launch & Operational Handover",
        description:
          "We deploy your site to production infrastructure, verify SSL certificates and domain records, and deliver full asset ownership with training.",
      },
    ],
    technicalModal: {
      title: "Technical Architecture & SEO Specifications",
      subtitle: "Engineering foundations governing our standard corporate web platforms",
      sections: [
        {
          heading: "Frontend & Runtime Architecture",
          items: [
            "Next.js App Router with React Server Components for minimal client-side JavaScript execution",
            "Tailwind CSS with CSS variables ensuring seamless light and dark mode token adaptation",
            "Zero client-side layout shift (CLS < 0.1) through explicit image dimensions and responsive font loading",
            "Automated image pipeline serving optimized next-gen formats (WebP/AVIF)",
          ],
        },
        {
          heading: "Technical SEO & Discoverability",
          items: [
            "Dynamic XML sitemap generation with automatic canonical URL normalization",
            "Schema.org structured data (Organization, WebSite, LocalBusiness, Service)",
            "Server-rendered OpenGraph and Twitter card metadata localized for Kenya (en_KE)",
            "Strict disclaimer: Technical SEO provides indexation readiness; ranking outcomes depend on search engine algorithms, industry competition, and domain authority.",
          ],
        },
        {
          heading: "Infrastructure & Security",
          items: [
            "Global edge delivery via Netlify OpenNext serverless network",
            "Automated TLS/SSL encryption with strict HTTP transport security headers",
            "Content Security Policy (CSP) and bot-mitigated enquiry endpoints",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "How much does a standard corporate website cost?",
        answer:
          "Our standard corporate websites typically range between KSh 35,000 and KSh 125,000 depending on page count, structural complexity, and specific feature requirements. We provide a detailed, written scope quotation following an initial discovery conversation so there are never unexpected charges.",
      },
      {
        question: "How long does a website project take from start to finish?",
        answer:
          "A typical corporate website project requires approximately 2 to 6 weeks. Timelines vary depending on prompt feedback, content readiness (text and brand assets), and integration requirements. We provide a projected schedule during discovery.",
      },
      {
        question: "Do you guarantee first-page Google search rankings?",
        answer:
          "No reputable agency can guarantee specific search engine rankings or map-pack positions, as Google algorithms and market competition are outside third-party control. What we guarantee is rigorous technical SEO: fast loading speeds, mobile responsiveness, semantic HTML structure, clean metadata, and crawlable sitemaps that give your site the strongest possible technical foundation.",
      },
      {
        question: "Who owns the website and code after launch?",
        answer:
          "You do. MegaScript Digital operates on a 100% client asset ownership model. Upon project settlement, all source code, domain configurations, production deployments, and visual assets belong entirely to your business with zero recurring agency license fees or lock-in retainers.",
      },
      {
        question: "Can we update content ourselves after launch?",
        answer:
          "Yes. Depending on your operational preference, we can integrate an intuitive content editing system or provide lightweight structured updating workflows so your internal team can manage announcements, services, and team details independently.",
      },
    ],
    cta: {
      title: "Ready to establish a credible digital presence?",
      subtitle:
        "Speak directly with our engineering team to review your website requirements and receive a clear, written scope proposal.",
      primaryLabel: "Start a Website Project",
      primaryHref: "/contact?topic=website-development-seo",
      secondaryLabel: "Chat on WhatsApp",
      secondaryHref: "https://wa.me/254700000000?text=Hello%20MegaScript%20Digital,%20I%20would%20like%20to%20discuss%20a%20website%20project.",
    },
    seo: {
      title: "Website Development & Technical SEO | MegaScript Digital Kenya",
      description:
        "Fast, mobile-first corporate websites designed to build trust, convert visitors, and ensure solid technical SEO foundations for Kenyan businesses.",
    },
  },

  "web-app-development": {
    slug: "web-app-development",
    name: "Web Application Development",
    category: "CORE",
    tagline: "Custom browser-based software tailored to your team's operational workflows.",
    shortDescription:
      "Custom browser-based business systems—from staff dashboards and client portals to booking, inventory, and workflow tools—tailored to how your team actually operates.",
    heroDescription:
      "When off-the-shelf software falls short or forces your business into awkward compromises, we engineer bespoke browser-based operational software. From staff management portals to inventory, booking, and administrative dashboards, we automate friction away.",
    includedStandard: [
      "Deep operational workflow mapping and systems requirements specification",
      "Role-based access control (RBAC) with granular administrative permissions",
      "Relational PostgreSQL database schema design with transactional data integrity",
      "Secure user authentication (multi-factor, email OTP, or session allowlists)",
      "Responsive administrative dashboards and operational data tables with filtering",
      "Audit logging for sensitive transactions, data modifications, and staff actions",
      "Automated automated database backup configurations and environment isolation",
      "Comprehensive end-to-end testing across all user roles and permission tiers",
    ],
    customScoped: [
      "Custom RESTful or GraphQL API architectures for external service interoperability",
      "Payment gateway integration (M-Pesa B2B/B2C, Daraja API, card processing)",
      "Automated document generation (PDF invoices, structured reports, export manifests)",
      "Real-time notifications via SMS (Africa's Talking), WhatsApp Business, or Brevo email",
      "Complex algorithmic scheduling, inventory reconciliation, or fleet telemetry",
    ],
    processSteps: [
      {
        step: 1,
        title: "Workflow Discovery",
        description:
          "We spend time understanding your operational reality: how information flows, who approves tasks, where bottlenecks occur, and what data needs tracking.",
      },
      {
        step: 2,
        title: "System Architecture & Schema",
        description:
          "We architect relational database schemas, data validation rules, security permissions, and API boundaries before writing user-facing code.",
      },
      {
        step: 3,
        title: "Iterative Engineering",
        description:
          "We build functional modules iteratively, giving your team early access on private staging environments to validate real-world usability.",
      },
      {
        step: 4,
        title: "Security & Load Testing",
        description:
          "We verify permission boundaries, simulate data concurrency, test edge cases, and ensure session inactivity safeguards protect sensitive records.",
      },
      {
        step: 5,
        title: "Staff Onboarding & Rollout",
        description:
          "We assist with data migration, conduct role-based staff onboarding, and provide comprehensive operational documentation for self-sufficiency.",
      },
    ],
    technicalModal: {
      title: "Web Application Architecture & Security Specifications",
      subtitle: "Engineering standards for custom operational software systems",
      sections: [
        {
          heading: "Backend & Database Infrastructure",
          items: [
            "PostgreSQL database with connection pooling (Supavisor) and strict relational foreign keys",
            "Server-authoritative Prisma ORM data validation preventing injection vulnerabilities",
            "Role-based access control (RBAC) evaluated at the database query layer",
            "Immutable audit trail capturing actor, target, timestamp, and payload snapshots",
          ],
        },
        {
          heading: "Authentication & Session Governance",
          items: [
            "Time-limited email OTP verification or passwordless credential authentication",
            "15-minute server-enforced session inactivity timeout preventing unauthorized console access",
            "Strict email allowlist pre-checks preventing user enumeration",
          ],
        },
        {
          heading: "Commercial Scope Notice",
          items: [
            "Web applications are scoped and quoted individually based on functional requirements, user concurrency, and integration depth.",
            "Standard website pricing packages do not apply to custom software development.",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "How is a web application different from a standard website?",
        answer:
          "A website primarily presents information, explains services, and captures initial inquiries. A web application is an interactive software system: it maintains databases, manages user accounts with distinct roles and permissions, processes complex business logic, records operational transactions, and automates internal workflows.",
      },
      {
        question: "Does standard website pricing apply to custom web applications?",
        answer:
          "No. Custom web applications require dedicated software engineering, database architecture, authentication security, role-based workflows, and thorough testing. Pricing is determined through a detailed functional requirements specification tailored to your scope rather than standard website packages.",
      },
      {
        question: "Can our team request ongoing feature additions after launch?",
        answer:
          "Yes. Because we build systems on modular, clean architectures with full documentation, new modules or feature extensions can be added incrementally as your business grows without rebuilding from scratch.",
      },
      {
        question: "Where is our business data hosted?",
        answer:
          "Your data is hosted in dedicated cloud database instances (such as Supabase PostgreSQL) with encrypted connections, automated backups, and strict region controls. You retain direct administrative ownership of the hosting environment.",
      },
    ],
    cta: {
      title: "Have a workflow ready to be streamlined?",
      subtitle:
        "Describe your team's operational challenges and let's evaluate how custom browser software can solve them.",
      primaryLabel: "Discuss a Web Application",
      primaryHref: "/contact?topic=web-app-development",
      secondaryLabel: "Chat on WhatsApp",
      secondaryHref: "https://wa.me/254700000000?text=Hello%20MegaScript%20Digital,%20I%20would%20like%20to%20discuss%20a%20custom%20web%20application.",
    },
    seo: {
      title: "Custom Web Application Development | MegaScript Digital Kenya",
      description:
        "Custom browser software, staff portals, booking tools, and automated operational dashboards engineered for Kenyan businesses.",
    },
  },

  "mobile-app-development": {
    slug: "mobile-app-development",
    name: "Mobile Application Development",
    category: "CORE",
    tagline: "Dependable Android and iOS applications connecting your business directly to customers.",
    shortDescription:
      "Practical Android and iOS applications that bring your services directly to customers or field teams, backed by dependable cloud infrastructure.",
    heroDescription:
      "Put your business directly in your customers' hands with high-performance native or cross-platform mobile apps. Engineered for smooth mobile performance, responsive UI, offline resilience, and secure backend synchronization.",
    includedStandard: [
      "Mobile UX/UI architecture following Apple Human Interface & Material Design guidelines",
      "Cross-platform or native application engineering for Android and iOS",
      "Secure API integration with your central business database and cloud backend",
      "Offline caching and resilient state synchronization for unstable connections",
      "Push notification architecture for customer alerts and transactional updates",
      "Rigorous device testing across various screen resolutions and operating system versions",
      "App store release preparation: icon sets, splash screens, privacy manifests, and store copy",
      "Submission guidance through Google Play Console and Apple App Store review cycles",
    ],
    customScoped: [
      "In-app payment integrations (M-Pesa STK push, localized payment gateways, card rails)",
      "Geolocation tracking, field team dispatch, and interactive map interfaces",
      "Camera integrations (document scanning, barcode/QR reading, photo uploads)",
      "Bluetooth or external hardware interop for point-of-sale peripherals",
      "Biometric authentication (Fingerprint, Face ID) for enhanced security",
    ],
    processSteps: [
      {
        step: 1,
        title: "Concept & Technical Feasibility",
        description:
          "We evaluate your app concept, user workflows, required device capabilities, offline expectations, and backend integration requirements.",
      },
      {
        step: 2,
        title: "Mobile Interface Design",
        description:
          "We design clean, intuitive touch interfaces tailored to natural thumb ergonomics and platform design conventions.",
      },
      {
        step: 3,
        title: "App & API Development",
        description:
          "We develop the mobile application alongside secure backend APIs, optimizing memory consumption, battery usage, and network payload sizes.",
      },
      {
        step: 4,
        title: "Device Testing & QA",
        description:
          "We test across physical Android and iOS devices under varied network conditions (4G, 3G, offline) to ensure stability.",
      },
      {
        step: 5,
        title: "Store Submission & Launch",
        description:
          "We prepare store compliance assets and guide your submission through Google Play and Apple App Store review requirements.",
      },
    ],
    technicalModal: {
      title: "Mobile Engineering & Store Compliance Specifications",
      subtitle: "Technical baseline for iOS and Android deployment",
      sections: [
        {
          heading: "Store Ownership & Compliance Governance",
          items: [
            "Clients must maintain their own direct developer accounts with Apple ($99/yr) and Google ($25 one-time). MegaScript operates with delegated developer access.",
            "Store approval is governed exclusively by Apple and Google review guidelines. While we adhere strictly to all technical and privacy rules, no agency can guarantee automated or immediate approval.",
            "Payment mechanisms (M-Pesa, card gateways) are subject to payment provider approval and regulatory KYC policies.",
          ],
        },
        {
          heading: "Performance & Architecture",
          items: [
            "Optimized binary footprint and lean asset bundling to minimize mobile download sizes",
            "Encrypted local storage for offline state and token credentials",
            "Graceful network failure handling with retry policies for intermittent connectivity",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "Do you develop for both Android and iPhone (iOS)?",
        answer:
          "Yes. Depending on your audience and budget, we build high-performance cross-platform applications (targeting both Android and iOS simultaneously with shared business logic) or dedicated native applications when deep platform-specific capabilities are required.",
      },
      {
        question: "Who pays for the Google Play and Apple Developer accounts?",
        answer:
          "The client owns and funds these accounts directly ($25 one-time for Google Play, $99/year for Apple Developer). Maintaining direct ownership ensures that your application, brand credentials, and user data remain permanently in your business's legal possession. We guide you through setup and request delegated technical access.",
      },
      {
        question: "Can an app work without an internet connection?",
        answer:
          "Yes. We can architect local data caching and offline synchronization so users can continue browsing content, drafting submissions, or reviewing stored records even when mobile data is disconnected. Changes synchronize automatically once connection resumes.",
      },
      {
        question: "Can you integrate M-Pesa payments inside the mobile app?",
        answer:
          "Yes. We integrate practical M-Pesa STK Push payment workflows via Safaricom Daraja APIs where customers enter their PIN on their handset to complete payments seamlessly, subject to your business obtaining an approved Paybill or Till number.",
      },
    ],
    cta: {
      title: "Ready to launch your mobile application?",
      subtitle:
        "Share your concept with our engineering team for an honest technical assessment and clear project roadmap.",
      primaryLabel: "Plan a Mobile App",
      primaryHref: "/contact?topic=mobile-app-development",
      secondaryLabel: "Chat on WhatsApp",
      secondaryHref: "https://wa.me/254700000000?text=Hello%20MegaScript%20Digital,%20I%20would%20like%20to%20discuss%20a%20mobile%20app%20project.",
    },
    seo: {
      title: "Mobile Application Development (Android & iOS) | MegaScript Digital Kenya",
      description:
        "High-performance Android and iOS mobile app development engineered for Kenyan businesses, field teams, and customer engagement.",
    },
  },

  "graphic-design": {
    slug: "graphic-design",
    name: "Graphic Design",
    category: "COMPLEMENTARY",
    tagline: "Visual brand assets and marketing collateral built for consistency across all touchpoints.",
    shortDescription:
      "Visual brand assets, marketing collateral, and print-ready designs built for consistency across all touchpoints.",
    heroDescription:
      "Professional visual design that ensures your business looks cohesive, trustworthy, and intentional everywhere customers encounter your brand—from digital marketing campaigns to physical print collateral.",
    includedStandard: [
      "Visual identity development: primary logo, secondary marks, and typography guidelines",
      "Color palette definition with exact hex, RGB, and CMYK print color specifications",
      "Digital marketing graphics: social media banners, promotional post templates, and banners",
      "Print-ready collateral: business cards, corporate letterheads, brochures, and flyers",
      "High-resolution exports in vector (SVG, PDF) and optimized raster formats (PNG, JPG)",
      "Standard agreed revision cycles documented in the project scope",
      "Complete handover of final design deliverables and production-ready files",
    ],
    customScoped: [
      "Comprehensive corporate brand guideline books (50+ pages)",
      "Custom brand typography or bespoke hand-drawn illustration suites",
      "Large-format outdoor signage, vehicle branding, and exhibition booth designs",
      "Packaging, product label design, and specialized merchandise mockups",
      "Ongoing monthly design retainers for recurring marketing content",
    ],
    processSteps: [
      {
        step: 1,
        title: "Brand Brief & Aesthetic Direction",
        description:
          "We discuss your business positioning, target demographic, color preferences, and visual tone to define a creative brief.",
      },
      {
        step: 2,
        title: "Concept Exploration",
        description:
          "We develop distinct initial visual directions exploring marks, typographic pairings, and color treatments for your review.",
      },
      {
        step: 3,
        title: "Refinement & Polish",
        description:
          "Based on your structured feedback, we refine the selected direction through agreed revision rounds to finalize layout and details.",
      },
      {
        step: 4,
        title: "Production Formatting & Handover",
        description:
          "We export all assets across standard print-ready formats (CMYK with bleed) and digital web formats, delivering complete asset packages.",
      },
    ],
    technicalModal: {
      title: "Design Standards & Production Specifications",
      subtitle: "Technical guidelines for digital and print asset outputs",
      sections: [
        {
          heading: "Deliverable Formats & Print Standards",
          items: [
            "Vector master files (SVG, PDF) enabling infinite scaling without pixelation or resolution loss",
            "Print collateral exported at 300 DPI with standard 3mm bleed margins and crop marks",
            "Digital marketing graphics exported in sRGB color space optimized for social media feeds",
          ],
        },
        {
          heading: "Scope Boundaries",
          items: [
            "Exact deliverable items, print specs, and revision round counts are specified in each written quotation.",
            "Our scope covers digital and print artwork delivery; physical printing and production costs are handled separately with print vendors.",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "Do you provide editable source files?",
        answer:
          "Yes. Upon final project settlement, we provide master design files (such as vector PDFs, SVGs, or agreed source formats) alongside everyday PNG and JPG formats so you retain full operational flexibility.",
      },
      {
        question: "How many revisions are included in a design project?",
        answer:
          "Every design quote specifies a defined number of revision cycles (typically 2 to 3 structured feedback rounds) to ensure focused creative development without open-ended delays.",
      },
      {
        question: "Do you handle physical printing?",
        answer:
          "We provide print-ready artwork formatted to exact commercial print specifications (300 DPI, CMYK color space, bleed margins). While we do not operate print presses directly, we can liaise with your chosen print vendor to ensure files meet their technical requirements.",
      },
    ],
    cta: {
      title: "Looking to elevate your brand's visual identity?",
      subtitle:
        "Tell us about your brand collateral needs and let's create visual assets that reflect your business quality.",
      primaryLabel: "Request Graphic Design",
      primaryHref: "/contact?topic=graphic-design",
      secondaryLabel: "Chat on WhatsApp",
      secondaryHref: "https://wa.me/254700000000?text=Hello%20MegaScript%20Digital,%20I%20would%20like%20to%20discuss%20graphic%20design%20services.",
    },
    seo: {
      title: "Graphic Design & Brand Collateral | MegaScript Digital Kenya",
      description:
        "Cohesive visual identities, brand marks, social media graphics, and print collateral designed for Kenyan businesses.",
    },
  },

  "video-editing": {
    slug: "video-editing",
    name: "Video Editing",
    category: "COMPLEMENTARY",
    tagline: "Clean, structured video editing for promotional campaigns, social reels, and business storytelling.",
    shortDescription:
      "Clean, structured video editing for promotional campaigns, reels, and business storytelling.",
    heroDescription:
      "Transform raw footage into crisp, engaging video content. We provide structured editing, audio cleanup, brand-consistent transitions, and platform-optimized formats that explain your value clearly.",
    includedStandard: [
      "Assembly and sequential cut editing from client-supplied video footage",
      "Audio balancing, noise reduction, and royalty-free background music integration",
      "Color correction and contrast adjustments for visual consistency",
      "Clean on-screen text overlays, title cards, and call-to-action cards",
      "Accurate subtitle and caption generation for silent social media viewing",
      "Multi-ratio exports: 16:9 widescreen, 9:16 vertical reels/TikTok, and 1:1 square",
      "Standard agreed revision cycles documented in the project quote",
    ],
    customScoped: [
      "On-location filming, drone videography, or physical camera crews",
      "Professional voiceover recording, voice actors, and multilingual dubbing",
      "Complex 3D motion graphics, VFX, or animated character rigging",
      "Premium licensed stock video acquisition and commercial clearance",
      "High-volume monthly social media editing retainers",
    ],
    processSteps: [
      {
        step: 1,
        title: "Footage Ingestion & Narrative Review",
        description:
          "We ingest your supplied raw footage, review your script or messaging intent, and outline the cut sequence and rhythm.",
      },
      {
        step: 2,
        title: "Rough Cut Assembly",
        description:
          "We assemble the primary story arc, pacing, voice track, and core action sequences for your initial structural review.",
      },
      {
        step: 3,
        title: "Audio, Color & Graphics Polish",
        description:
          "We fine-tune transitions, clean audio levels, apply color grading, and add branded lower-thirds and captions.",
      },
      {
        step: 4,
        title: "Platform-Specific Export",
        description:
          "We render final master files optimized for your target platforms (YouTube, Instagram Reels, TikTok, corporate presentations).",
      },
    ],
    technicalModal: {
      title: "Video Specifications & Platform Formats",
      subtitle: "Technical standards governing post-production delivery",
      sections: [
        {
          heading: "Encoding & Delivery Standards",
          items: [
            "H.264 / H.265 (MP4) encoding delivering high visual fidelity with manageable streaming file sizes",
            "Audio mastered to standard -14 LUFS loudness target for digital web and mobile streaming",
            "Burned-in or sidecar (SRT) subtitles ensuring accessibility across mobile platforms where 80%+ of video is viewed muted",
          ],
        },
        {
          heading: "Outcome & Scope Disclaimer",
          items: [
            "Video editing services cover post-production execution based on supplied assets. We do not promise viral reach, view counts, or guaranteed social media engagement.",
            "Source footage, scripts, and licensed assets must be client-supplied unless quoted explicitly as an additional service.",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "Do you come to our location to shoot video?",
        answer:
          "Our standard video service focuses on post-production editing, audio cleanup, formatting, and motion graphics based on footage supplied by your team. If physical on-location shooting is required in Nairobi, it can be quoted separately as a specialized arrangement.",
      },
      {
        question: "What format should we send our raw footage in?",
        answer:
          "We accept common video formats including MP4, MOV, and high-bitrate camera files. Footage can be transferred via secure cloud links (Google Drive, WeTransfer, OneDrive).",
      },
      {
        question: "Do you guarantee our videos will go viral?",
        answer:
          "No. Social media algorithms, trending topics, and audience behavior are outside any agency's control. We guarantee high-quality technical editing, clear storytelling, crisp audio, and platform-optimized formatting that presents your business at its best.",
      },
    ],
    cta: {
      title: "Have video footage that needs professional editing?",
      subtitle:
        "Send us your raw clips and let's craft sharp, engaging videos tailored to your business platforms.",
      primaryLabel: "Request Video Editing",
      primaryHref: "/contact?topic=video-editing",
      secondaryLabel: "Chat on WhatsApp",
      secondaryHref: "https://wa.me/254700000000?text=Hello%20MegaScript%20Digital,%20I%20would%20like%20to%20discuss%20video%20editing%20services.",
    },
    seo: {
      title: "Professional Video Editing Services | MegaScript Digital Kenya",
      description:
        "Crisp video editing for corporate storytelling, promotional reels, and social media campaigns for Kenyan businesses.",
    },
  },

  "google-maps-visibility": {
    slug: "google-maps-visibility",
    name: "Google Maps Visibility",
    category: "COMPLEMENTARY",
    tagline: "Help local customers find and contact your business on Google Search and Maps.",
    shortDescription:
      "Practical Google Business Profile setup and optimization to help local customers find accurate details about your business on Google Search and Maps.",
    heroDescription:
      "When customers in your area search for the services you provide, make sure they find accurate business hours, verified location directions, genuine reviews, and direct contact details right on Google Maps and Search.",
    includedStandard: [
      "Assistance with Google Business Profile claiming, creation, or verification workflows",
      "Standardization of business Name, Address, and Phone (NAP consistency across web assets)",
      "Primary and secondary business category classification matching your actual service scope",
      "Service area configuration, operating hours, and holiday schedules",
      "Upload of high-quality business photos, exterior storefront, and team imagery",
      "Guidance on ethical customer review collection and professional response templates",
      "Website integration: embedded map directions and location schema markup",
    ],
    customScoped: [
      "Multi-location profile management for chain branches across multiple towns",
      "Local landing page creation optimized for specific municipal service zones",
      "Ongoing monthly profile updates, promotional Google Posts, and Q&A monitoring",
      "Assistance resolving suspended or disabled profile appeals with Google support",
    ],
    processSteps: [
      {
        step: 1,
        title: "Profile Audit & Claiming",
        description:
          "We inspect your existing Google presence, check for duplicate listings, and guide you through profile claiming or creation.",
      },
      {
        step: 2,
        title: "Information Optimization",
        description:
          "We structure accurate business categories, service descriptions, operating hours, phone numbers, and direct website links.",
      },
      {
        step: 3,
        title: "Media & Visual Assets",
        description:
          "We organize and upload verified photography (storefront, interior, team, signage) to build immediate visitor trust.",
      },
      {
        step: 4,
        title: "Website Alignment & Review Workflow",
        description:
          "We align your website's contact page and local schema with your Google profile and provide clear customer review workflows.",
      },
    ],
    technicalModal: {
      title: "Local Signals & Account Delegation Governance",
      subtitle: "Operating standards for Google Business Profile optimization",
      sections: [
        {
          heading: "Profile Ownership & Privacy Policy",
          items: [
            "Profile ownership remains strictly and permanently with your business account. MegaScript will never claim primary ownership.",
            "You grant MegaScript temporary delegated 'Manager' access through Google's supported user-management interface. We will never ask for your Google account password.",
          ],
        },
        {
          heading: "Ranking & Outcome Disclaimer",
          items: [
            "We do not promise or guarantee '#1 positions on Google Maps' or guaranteed appearance in the 3-pack map results. Google local rankings depend on proximity, user query intent, review velocity, and algorithmic criteria outside any third-party agency's control.",
            "Our work ensures your profile is technically complete, accurately categorized, compliant with Google's guidelines, and aligned with your website.",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "Do you guarantee that our business will appear #1 on Google Maps?",
        answer:
          "No. Google explicitly states that no agency can guarantee local map rankings or map-pack placement. Local rankings are determined algorithmically based on user proximity, relevance, prominence, and ongoing review patterns. What we provide is thorough profile setup, categorization, verified information accuracy, and website alignment that ensures Google has the best possible data to display your business.",
      },
      {
        question: "Do I have to give you my Google account password?",
        answer:
          "Never. MegaScript Digital strictly prohibits collecting client passwords. Google Business Profile allows you to invite our agency as a 'Manager' via our email address without sharing your personal or business credentials. You can revoke this manager access at any time.",
      },
      {
        question: "What if our business does not have a physical storefront?",
        answer:
          "Businesses that serve customers at their locations (such as mobile technicians, delivery services, or on-site consultants) can be configured as 'Service Area Businesses' on Google Maps, hiding the street address while still displaying the towns or zones you serve.",
      },
    ],
    cta: {
      title: "Want local customers to find your accurate business details?",
      subtitle:
        "Let's set up and optimize your Google Business Profile so customers can call, message, and get directions effortlessly.",
      primaryLabel: "Optimize Google Maps Visibility",
      primaryHref: "/contact?topic=google-maps-visibility",
      secondaryLabel: "Chat on WhatsApp",
      secondaryHref: "https://wa.me/254700000000?text=Hello%20MegaScript%20Digital,%20I%20would%20like%20to%20discuss%20Google%20Maps%20visibility.",
    },
    seo: {
      title: "Google Maps Visibility & Business Profile Setup | MegaScript Digital Kenya",
      description:
        "Accurate Google Business Profile setup, local SEO alignment, and map visibility optimization for Kenyan businesses.",
    },
  },

  "business-coaching": {
    slug: "business-coaching",
    name: "Business Coaching",
    category: "COMPLEMENTARY",
    tagline: "Practical guidance on digital readiness, operations, and structured business growth.",
    shortDescription:
      "Structured guidance on digital readiness, operations, service presentation, and practical business growth.",
    heroDescription:
      "Gain objective, structured perspective on your business operations, digital systems readiness, customer acquisition touchpoints, and service packaging—without corporate jargon or impractical theories.",
    includedStandard: [
      "Structured discovery session examining current business bottlenecks and growth constraints",
      "Digital readiness evaluation: auditing tools, software adoption, and team workflow gaps",
      "Service packaging and pricing presentation review for customer clarity",
      "Customer enquiry and conversion pathway audit (identifying lost lead drop-offs)",
      "Actionable 30-60-90 day practical implementation roadmap",
      "Confidential one-on-one strategy sessions (virtual or in-person by arrangement)",
      "Follow-up accountability check-ins on agreed milestone progress",
    ],
    customScoped: [
      "Multi-week executive team coaching programs and operational realignment workshops",
      "In-depth customer journey mapping and internal staff process documentation",
      "Hands-on technology tool transition assistance and workflow implementation",
      "Quarterly business review retreats and strategic planning sessions",
    ],
    processSteps: [
      {
        step: 1,
        title: "Operational Discovery",
        description:
          "We examine how your business operates today: what services you deliver, who buys them, where margins come from, and where team friction occurs.",
      },
      {
        step: 2,
        title: "Systems & Readiness Audit",
        description:
          "We audit your digital touchpoints, customer communication channels, and internal tools to identify practical improvements.",
      },
      {
        step: 3,
        title: "Roadmap Formulation",
        description:
          "We synthesize findings into a focused, prioritized action plan outlining tangible steps your team can execute immediately.",
      },
      {
        step: 4,
        title: "Accountability & Review",
        description:
          "We conduct structured review sessions to evaluate execution progress, troubleshoot real-world obstacles, and adjust strategy.",
      },
    ],
    technicalModal: {
      title: "Coaching Scope & Professional Advisory Governance",
      subtitle: "Commercial boundaries and non-financial advice disclosure",
      sections: [
        {
          heading: "Scope Boundaries & Regulatory Disclosure",
          items: [
            "MegaScript Business Coaching focuses strictly on operational processes, digital tool adoption, service presentation, and commercial clarity.",
            "Coaching sessions do NOT constitute regulated financial advice, investment advice, legal counsel, or statutory accounting opinions. Clients should consult qualified, licensed professionals for statutory matters.",
          ],
        },
        {
          heading: "Commercial Outcomes & Non-Guarantee Disclosure",
          items: [
            "We do not promise specific revenue figures, funding outcomes, or business profit metrics. Business success depends on market conditions, client execution, product-market fit, and economic factors outside any advisor's control.",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "Is this financial or legal advice?",
        answer:
          "No. Our coaching focuses strictly on operational clarity, service packaging, digital systems readiness, and practical customer communication workflows. We do not provide regulated investment, financial, tax, or legal advice.",
      },
      {
        question: "Do you promise increased revenue or business profits?",
        answer:
          "No. Sustainable business growth depends on product quality, market demand, customer service, and disciplined operational execution. We provide objective analysis, structured perspectives, and actionable operational roadmaps to help you eliminate friction and make better decisions without unrealistic outcome claims.",
      },
      {
        question: "How are coaching sessions structured?",
        answer:
          "Coaching begins with an in-depth discovery session followed by focused 60-to-90-minute structured working sessions (virtual via video or in-person in Nairobi by arrangement). Each session concludes with concrete action items to be completed before the next review.",
      },
    ],
    cta: {
      title: "Ready to bring operational clarity to your business?",
      subtitle:
        "Schedule an initial discovery conversation to explore how structured guidance can support your business goals.",
      primaryLabel: "Inquire About Coaching",
      primaryHref: "/contact?topic=business-coaching",
      secondaryLabel: "Chat on WhatsApp",
      secondaryHref: "https://wa.me/254700000000?text=Hello%20MegaScript%20Digital,%20I%20would%20like%20to%20discuss%20business%20coaching.",
    },
    seo: {
      title: "Business Coaching & Digital Readiness | MegaScript Digital Kenya",
      description:
        "Practical guidance on digital readiness, workflow systems, service presentation, and operational clarity for business owners in Kenya.",
    },
  },
};
