import React from "react";

interface JsonLdProps {
  data?: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://megascriptdigital.co.ke";

  const defaultSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${baseUrl}/#organization`,
        name: "MegaScript Digital",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        image: `${baseUrl}/opengraph-image`,
        description:
          "MegaScript Digital builds clear, resilient websites, custom web applications, mobile apps, and digital systems for Kenyan and East African businesses.",
        telephone: "+254700000000",
        email: "info@megascriptdigital.co.ke",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -1.286389,
          longitude: 36.817223,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:30",
            closes: "17:30",
          },
        ],
        sameAs: [
          "https://github.com/megascriptdigital",
          "https://linkedin.com/company/megascript-digital",
          "https://x.com/megascriptke",
        ],
        priceRange: "$$",
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "MegaScript Digital",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  const schemaToRender = data || defaultSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaToRender) }}
    />
  );
}
