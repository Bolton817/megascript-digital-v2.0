import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { AppearanceCustomizer } from "@/components/layout/AppearanceCustomizer";
import { CommunicationHub } from "@/components/layout/CommunicationHub";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('megascript_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                }
                var m = localStorage.getItem('megascript_motion');
                if (m) document.documentElement.setAttribute('data-motion', m);
                var s = localStorage.getItem('megascript_text_size');
                if (s) document.documentElement.setAttribute('data-text-size', s);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-primary-subtle selection:text-primary`}>
        <ThemeProvider>
          <PublicHeader />
          <div id="main-content" className="flex-1">
            {children}
          </div>
          <PublicFooter />
          <AppearanceCustomizer />
          <CommunicationHub />
        </ThemeProvider>
      </body>
    </html>
  );
}
