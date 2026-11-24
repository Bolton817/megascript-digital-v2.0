export interface NavigationItem {
  title: string;
  href: string;
  description: string;
  badge?: string;
}

export interface MegaMenuCategory {
  id: "more-services" | "products" | "company";
  label: string;
  heading: string;
  intro: string;
  items: NavigationItem[];
  footerLink?: {
    text: string;
    href: string;
    actionText: string;
  };
}

export const MORE_SERVICES_MENU: MegaMenuCategory = {
  id: "more-services",
  label: "More Services",
  heading: "Complementary Services",
  intro:
    "Creative and strategic support that strengthens how your business looks, communicates, and gets found.",
  items: [
    {
      title: "Graphic Design",
      href: "/services/graphic-design",
      description:
        "Visual brand assets, marketing collateral, and print-ready designs built for consistency.",
    },
    {
      title: "Video Editing",
      href: "/services/video-editing",
      description:
        "Clean, structured video editing for promotional campaigns, reels, and business storytelling.",
    },
    {
      title: "Google Maps Visibility",
      href: "/services/google-maps-visibility",
      description:
        "Practical Google Business Profile setup and optimization to help local customers find you.",
    },
    {
      title: "Business Coaching",
      href: "/services/business-coaching",
      description:
        "Structured guidance on digital readiness, operations, and practical business growth.",
    },
  ],
  footerLink: {
    text: "Looking for websites or custom software?",
    href: "/#services",
    actionText: "Explore our core development services",
  },
};

export const PRODUCTS_MENU: MegaMenuCategory = {
  id: "products",
  label: "Products",
  heading: "Independent Software Products",
  intro:
    "Purpose-built software solutions created by MegaScript Digital, each operating on its own dedicated platform.",
  items: [
    {
      title: "Fortress",
      href: "/products/fortress",
      description:
        "AI website builder designed to help businesses launch online faster.",
      badge: "AI Builder",
    },
    {
      title: "LeaseFlow",
      href: "/products/leaseflow",
      description:
        "Rental management system for organizing properties, tenants, and rent records.",
      badge: "Real Estate",
    },
    {
      title: "UzaDigital",
      href: "/products/uzadigital",
      description:
        "Point-of-sale product built to streamline everyday sales and checkout workflows.",
      badge: "POS",
    },
    {
      title: "FM Scheduler",
      href: "/products/fm-scheduler",
      description:
        "Scheduling and social media management solution for creators and service providers.",
      badge: "Scheduling",
    },
  ],
};

export const COMPANY_MENU: MegaMenuCategory = {
  id: "company",
  label: "Company",
  heading: "Inside MegaScript Digital",
  intro:
    "Learn how we work, review verified client projects, and explore our interactive capability showcase.",
  items: [
    {
      title: "About Us",
      href: "/about",
      description:
        "Our mission, principles, and practical approach to building digital systems.",
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      description:
        "Selected businesses, agencies, and organizations we have worked with.",
    },
    {
      title: "Wow Factors",
      href: "/wow-factors",
      description:
        "Live demos, prototypes, and interactive examples of what we can build.",
    },
    {
      title: "Blog",
      href: "/blog",
      description:
        "Straightforward guides on websites, software, digital visibility, and business operations.",
    },
  ],
};

export const MEGA_MENUS: MegaMenuCategory[] = [
  MORE_SERVICES_MENU,
  PRODUCTS_MENU,
  COMPANY_MENU,
];

export const FOOTER_CORE_SERVICES = [
  { title: "Website Development & SEO", href: "/services/website-development-seo" },
  { title: "Web Application Development", href: "/services/web-app-development" },
  { title: "Mobile Application Development", href: "/services/mobile-app-development" },
];

export const FOOTER_COMPLEMENTARY_SERVICES = [
  { title: "Graphic Design", href: "/services/graphic-design" },
  { title: "Video Editing", href: "/services/video-editing" },
  { title: "Google Maps Visibility", href: "/services/google-maps-visibility" },
  { title: "Business Coaching", href: "/services/business-coaching" },
];

export const FOOTER_PRODUCTS = [
  { title: "Fortress", href: "/products/fortress" },
  { title: "LeaseFlow", href: "/products/leaseflow" },
  { title: "UzaDigital", href: "/products/uzadigital" },
  { title: "FM Scheduler", href: "/products/fm-scheduler" },
];

export const FOOTER_COMPANY = [
  { title: "About Us", href: "/about" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Wow Factors", href: "/wow-factors" },
  { title: "Blog", href: "/blog" },
];

export interface SocialLink {
  platform: string;
  url: string | null;
  label: string;
}

export const SOCIAL_CHANNELS: SocialLink[] = [
  { platform: "Facebook", url: null, label: "MegaScript Digital on Facebook" },
  { platform: "Instagram", url: null, label: "MegaScript Digital on Instagram" },
  { platform: "X", url: null, label: "MegaScript Digital on X" },
  { platform: "Threads", url: null, label: "MegaScript Digital on Threads" },
  { platform: "YouTube", url: null, label: "MegaScript Digital on YouTube" },
  { platform: "TikTok", url: null, label: "MegaScript Digital on TikTok" },
  { platform: "LinkedIn", url: null, label: "MegaScript Digital on LinkedIn" },
];
