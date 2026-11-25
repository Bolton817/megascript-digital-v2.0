import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://megascriptdigital.co.ke";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/master/",
          "/api/",
          "/preview/",
          "/newsletter/confirmed",
          "/unsubscribe",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
