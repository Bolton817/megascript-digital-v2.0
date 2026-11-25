import React from "react";
import { Metadata } from "next";
import { MasterAppShell } from "@/components/admin/MasterAppShell";

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
    <MasterAppShell>
      {children}
    </MasterAppShell>
  );
}
