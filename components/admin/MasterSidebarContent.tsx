"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Boxes,
  Briefcase,
  Quote,
  UserCheck,
  MessageSquare,
  Sparkles,
  Send,
  Users,
  ShieldCheck,
  ExternalLink,
  LogOut,
  ChevronRight,
  Cpu,
  BarChart3,
} from "lucide-react";
import { authClient } from "@/features/auth/client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    groupName: "Executive",
    items: [
      {
        label: "Operations Overview",
        href: "/master/overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "Traffic & Lead Analytics",
        href: "/master/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    groupName: "Content Management (CMS)",
    items: [
      {
        label: "Content Hub",
        href: "/master/content",
        icon: FileText,
        exact: true,
      },
      {
        label: "Services Catalog",
        href: "/master/content/services",
        icon: Layers,
      },
      {
        label: "Product Showcase",
        href: "/master/content/products",
        icon: Boxes,
      },
      {
        label: "Client Portfolio",
        href: "/master/content/portfolio",
        icon: Briefcase,
      },
      {
        label: "Client Testimonials",
        href: "/master/content/testimonials",
        icon: Quote,
      },
    ],
  },
  {
    groupName: "CRM & Inquiries",
    items: [
      {
        label: "CRM Leads",
        href: "/master/leads",
        icon: UserCheck,
      },
    ],
  },
  {
    groupName: "Tony AI Assistant",
    items: [
      {
        label: "Chat Conversations",
        href: "/master/conversations",
        icon: MessageSquare,
      },
      {
        label: "Prompts & Safety",
        href: "/master/tony/prompts",
        icon: Sparkles,
        badge: "v1.0",
      },
      {
        label: "AI Providers & Models",
        href: "/master/tony/providers",
        icon: Cpu,
      },
    ],
  },
  {
    groupName: "Audience & Campaigns",
    items: [
      {
        label: "Newsletter Campaigns",
        href: "/master/newsletter/campaigns",
        icon: Send,
      },
      {
        label: "Subscribers",
        href: "/master/newsletter/subscribers",
        icon: Users,
      },
    ],
  },
];

interface MasterSidebarContentProps {
  onNavigate?: () => void;
}

export function MasterSidebarContent({ onNavigate }: MasterSidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/master/login");
    } catch {
      window.location.href = "/master/login";
    } finally {
      setIsSigningOut(false);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <div className="flex flex-col h-full bg-surface text-foreground select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <Link
          href="/master/overview"
          onClick={onNavigate}
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black text-lg shadow-sm transition-transform group-hover:scale-105">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                MegaScript
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                OPS
              </span>
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight block">
              Master Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {group.groupName}
            </h4>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? "bg-primary text-white font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${active ? "text-white" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-surface-border text-foreground"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      active && <ChevronRight className="h-3.5 w-3.5 text-white/80" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer System Status & Profile */}
      <div className="p-3 border-t border-border space-y-2 bg-surface-subtle/50">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <span>Public Website</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">New Tab</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-3.5 w-3.5" />
            <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
          </div>
          <span className="text-[10px] font-mono">15m Exp</span>
        </button>
      </div>
    </div>
  );
}
