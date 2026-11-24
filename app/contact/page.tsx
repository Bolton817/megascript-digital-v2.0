import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactDirectChannels } from "@/components/contact/ContactDirectChannels";
import { ContactFaq } from "@/components/contact/ContactFaq";

export const metadata: Metadata = {
  title: "Contact Us | Start a Project or Enquiry",
  description:
    "Get in touch with MegaScript Digital. We build websites, web applications, mobile apps, and custom digital systems with transparent scoping and a 24-business-hour response time.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact MegaScript Digital | Start a Project",
    description:
      "Share your software, website, or digital systems requirements with our technical team. 24-business-hour SLA and transparent architectural feedback.",
    url: "https://megascriptdigital.co.ke/contact",
    siteName: "MegaScript Digital",
    locale: "en_KE",
    type: "website",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MegaScript Digital",
    description:
      "Contact MegaScript Digital for website development, web applications, mobile apps, and software systems.",
    url: "https://megascriptdigital.co.ke/contact",
    mainEntity: {
      "@type": "Organization",
      name: "MegaScript Digital",
      url: "https://megascriptdigital.co.ke",
      email: "info@megascriptdigital.co.ke",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-background text-foreground">
        {/* Editorial Hero */}
        <ContactHero />

        {/* Form & Direct Channels Grid */}
        <section className="py-14 sm:py-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Primary Form Column */}
              <div className="lg:col-span-7 xl:col-span-8">
                <ContactForm />
              </div>

              {/* Direct Channels & Guarantees Column */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
                <ContactDirectChannels />
              </div>
            </div>
          </Container>
        </section>

        {/* Commercial FAQs */}
        <ContactFaq />
      </main>
    </>
  );
}
