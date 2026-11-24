import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MegaScript Digital | Master Operations Console",
  description: "Private operations, CMS administration, and lead management console.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MasterRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {children}
    </div>
  );
}
