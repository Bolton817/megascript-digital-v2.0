import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0284c7",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://megascriptdigital.co.ke"
  ),
  title: {
    default: "MegaScript Digital | Websites, Web Applications & Mobile Apps",
    template: "%s | MegaScript Digital",
  },
  description:
    "MegaScript Digital builds clear, reliable websites, custom web applications, mobile apps, and digital systems for businesses, agencies, and organizations.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://megascriptdigital.co.ke",
    siteName: "MegaScript Digital",
    title: "MegaScript Digital | Websites, Web Applications & Mobile Apps",
    description:
      "MegaScript Digital builds clear, reliable websites, custom web applications, mobile apps, and digital systems for businesses, agencies, and organizations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary-subtle selection:text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
