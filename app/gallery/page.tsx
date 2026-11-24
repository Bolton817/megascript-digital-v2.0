"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import {
  Sun,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Heading, Text, Eyebrow } from "@/components/ui/Typography";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Dialog } from "@/components/ui/Dialog";
import { Popover } from "@/components/ui/Popover";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ComponentGalleryPage() {
  const {
    theme,
    toggleTheme,
    motion,
    toggleMotion,
    textSize,
    setTextSize,
    resetToDefaults,
  } = useTheme();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // In production, guard against public access
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Sticky Gallery Top Bar for Live Theme Testing */}
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/90 backdrop-blur-md px-4 py-3">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              MegaScript Design System
            </span>
            <h1 className="text-lg font-bold text-foreground">
              UI Primitives &amp; Tokens Gallery
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              leftIcon={theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            >
              {theme === "light" ? "Dark Mode" : "Bright Mode"}
            </Button>

            {/* Motion Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMotion}
              leftIcon={motion === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            >
              {motion === "active" ? "Pause Motion" : "Resume Motion"}
            </Button>

            {/* Text Size Controls */}
            <div className="flex items-center rounded-lg border border-surface-border bg-surface-subtle p-0.5">
              <button
                type="button"
                onClick={() => setTextSize("sm")}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  textSize === "sm" ? "bg-surface text-primary font-bold shadow-sm" : "text-muted"
                }`}
              >
                Small
              </button>
              <button
                type="button"
                onClick={() => setTextSize("default")}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  textSize === "default" ? "bg-surface text-primary font-bold shadow-sm" : "text-muted"
                }`}
              >
                Default
              </button>
              <button
                type="button"
                onClick={() => setTextSize("lg")}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  textSize === "lg" ? "bg-surface text-primary font-bold shadow-sm" : "text-muted"
                }`}
              >
                Large
              </button>
            </div>

            {/* Reset Defaults */}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset
            </Button>
          </div>
        </Container>
      </header>

      <main className="space-y-16 mt-8">
        {/* Section 1: Color Tokens & Surfaces */}
        <Section spacing="sm">
          <Container>
            <Eyebrow>Theme Tokens</Eyebrow>
            <Heading level={2} className="mt-2 mb-6">
              Color System &amp; Brand Surfaces
            </Heading>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="rounded-xl border border-surface-border bg-primary p-4 text-primary-foreground shadow-sm">
                <p className="text-xs font-mono font-bold">Primary</p>
                <p className="text-xs opacity-80">Light Blue (Action)</p>
              </div>
              <div className="rounded-xl border border-surface-border bg-primary-subtle p-4 text-primary shadow-sm">
                <p className="text-xs font-mono font-bold">Primary Subtle</p>
                <p className="text-xs opacity-80">Soft Brand Tint</p>
              </div>
              <div className="rounded-xl border border-surface-border bg-accent p-4 text-accent-foreground shadow-sm">
                <p className="text-xs font-mono font-bold">Accent</p>
                <p className="text-xs opacity-80">Restrained Orange</p>
              </div>
              <div className="rounded-xl border border-surface-border bg-surface p-4 text-foreground shadow-sm">
                <p className="text-xs font-mono font-bold">Surface</p>
                <p className="text-xs text-muted-foreground">Base Container</p>
              </div>
              <div className="rounded-xl border border-surface-border bg-surface-subtle p-4 text-foreground shadow-xs">
                <p className="text-xs font-mono font-bold">Surface Subtle</p>
                <p className="text-xs text-muted-foreground">Page Secondary</p>
              </div>
              <div className="rounded-xl border border-surface-border bg-surface-muted p-4 text-foreground shadow-xs">
                <p className="text-xs font-mono font-bold">Surface Muted</p>
                <p className="text-xs text-muted-foreground">Tangible Contrast</p>
              </div>
              <div className="rounded-xl border border-surface-border bg-surface-elevated p-4 text-foreground shadow-xs">
                <p className="text-xs font-mono font-bold">Surface Elevated</p>
                <p className="text-xs text-muted-foreground">High Contrast</p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Section 2: Typography Hierarchy */}
        <Section spacing="sm" variant="subtle">
          <Container>
            <Eyebrow>Typography Scale</Eyebrow>
            <Heading level={2} className="mt-2 mb-6">
              Semantic Headings &amp; Responsive Body
            </Heading>
            <div className="space-y-4 rounded-2xl border border-surface-border bg-surface p-6 sm:p-8">
              <Heading level={1}>Heading Level 1: Digital solutions that work</Heading>
              <Heading level={2}>Heading Level 2: Three core ways we build</Heading>
              <Heading level={3}>Heading Level 3: Custom browser-based systems</Heading>
              <Heading level={4}>Heading Level 4: Transparent Pricing &amp; Expectations</Heading>
              <Heading level={5}>Heading Level 5: Lead qualification and handoff</Heading>
              <Heading level={6}>Heading Level 6: Technical Specifications</Heading>
              <hr className="border-surface-border my-4" />
              <Text variant="lead">
                Lead paragraph: We design and build websites, web applications, and mobile apps
                that look sharp on the surface and run reliably underneath.
              </Text>
              <Text variant="body">
                Body paragraph: Standard websites typically range from KSh 35,000 to KSh 125,000
                depending on scope, design depth, content structure, and approved integrations.
              </Text>
              <Text variant="muted">
                Muted paragraph: Domain renewals, third-party subscriptions, and ongoing maintenance
                are quoted separately unless stated in a formal written scope.
              </Text>
              <Text variant="small">
                Small text: Protected by the Kenya Data Protection Act, 2019.
              </Text>
            </div>
          </Container>
        </Section>

        {/* Section 3: Buttons & Interactive States */}
        <Section spacing="sm">
          <Container>
            <Eyebrow>Interactive Controls</Eyebrow>
            <Heading level={2} className="mt-2 mb-6">
              Buttons, Sizes &amp; Loading States
            </Heading>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="accent">Accent Action (Orange)</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Outline Action</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Text Link Button</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">Small</Button>
                <Button size="md" variant="primary">Medium (Default)</Button>
                <Button size="lg" variant="primary">Large Hero</Button>
                <Button
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  With Icon
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Sparkles className="h-4 w-4 text-accent" />}
                >
                  Leading Icon
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  isLoading={buttonLoading}
                  loadingText="Submitting..."
                  onClick={() => {
                    setButtonLoading(true);
                    setTimeout(() => setButtonLoading(false), 2000);
                  }}
                >
                  {buttonLoading ? "Submitting..." : "Click to Test Loading"}
                </Button>
                <Button variant="primary" disabled>
                  Disabled Primary
                </Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Section 4: Badges & Status Indicators */}
        <Section spacing="sm" variant="subtle">
          <Container>
            <Eyebrow>Status Tokens</Eyebrow>
            <Heading level={2} className="mt-2 mb-6">
              Badges &amp; Tags
            </Heading>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="neutral">Neutral Draft</Badge>
              <Badge variant="primary">Published</Badge>
              <Badge variant="primary" dot>Production Active</Badge>
              <Badge variant="accent">High Priority</Badge>
              <Badge variant="accent" dot>High Priority Live</Badge>
              <Badge variant="success" dot>Connected</Badge>
              <Badge variant="warning">Needs Configuration</Badge>
              <Badge variant="destructive">Sync Error</Badge>
              <Badge variant="primary" size="sm">Small Tag</Badge>
            </div>
          </Container>
        </Section>

        {/* Section 5: Form Controls */}
        <Section spacing="sm">
          <Container>
            <Eyebrow>Form Controls</Eyebrow>
            <Heading level={2} className="mt-2 mb-6">
              Inputs, Textareas &amp; Selects
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <Input
                label="Full Name"
                placeholder="Your full name"
                required
                helperText="First and last name as you prefer to be addressed."
              />
              <Input
                label="Business Email"
                type="email"
                placeholder="name@company.com"
                required
                error="Please enter a valid email address (for example, name@company.com)."
              />
              <Select
                label="Service Enquiry Topic"
                placeholder="Select a service category..."
                required
                options={[
                  { value: "website", label: "Website Development & SEO" },
                  { value: "web-app", label: "Web Application Development" },
                  { value: "mobile-app", label: "Mobile Application Development" },
                  { value: "graphic-design", label: "Graphic Design" },
                  { value: "video-editing", label: "Video Editing" },
                  { value: "maps-visibility", label: "Google Maps Visibility" },
                  { value: "coaching", label: "Business Coaching" },
                ]}
              />
              <Input
                label="Phone Number (Optional)"
                placeholder="e.g. +254 700 000000"
                helperText="Include if you prefer a direct phone or WhatsApp follow-up."
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Project Overview"
                  placeholder="Briefly describe your business, what you need, and any target timeline..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </Container>
        </Section>

        {/* Section 6: Cards & Modals */}
        <Section spacing="sm" variant="subtle">
          <Container>
            <Eyebrow>Overlay &amp; Containers</Eyebrow>
            <Heading level={2} className="mt-2 mb-6">
              Cards, Dialogs &amp; Popovers
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card interactive>
                <CardHeader>
                  <Badge variant="primary" className="w-fit mb-2">
                    Core Service
                  </Badge>
                  <CardTitle>Website Development &amp; SEO</CardTitle>
                  <CardDescription>
                    Fast, mobile-first websites designed to explain what you do clearly and build trust.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted">
                    Includes responsive design, clean semantic HTML, structured metadata, and XML sitemaps.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Open Technical Details
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="accent" className="w-fit mb-2">
                    Custom Scope
                  </Badge>
                  <CardTitle>Built-In Staff CRM</CardTitle>
                  <CardDescription>
                    Role-restricted operations dashboard with structured lead tracking.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted">
                    Enforces server-side permissions and 15-minute idle session timeouts.
                  </p>
                </CardContent>
                <CardFooter>
                  <Popover
                    trigger={({ toggle, isOpen }) => (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={toggle}
                        aria-expanded={isOpen}
                      >
                        Popover Menu
                      </Button>
                    )}
                  >
                    {({ close }) => (
                      <div className="w-48 space-y-2 text-xs">
                        <p className="font-semibold text-foreground">Quick Actions</p>
                        <p className="text-muted">Options inside an accessible floating popover.</p>
                        <Button size="sm" variant="ghost" className="w-full justify-start" onClick={close}>
                          Action 1
                        </Button>
                        <Button size="sm" variant="ghost" className="w-full justify-start text-destructive" onClick={close}>
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </Popover>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="neutral" className="w-fit mb-2">
                    Loading Skeleton
                  </Badge>
                  <CardTitle>Content Loading</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rectangle" height="40px" />
                </CardContent>
              </Card>
            </div>

            {/* Accessible Dialog Component Test */}
            <Dialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Website Engineering Details"
              description="Under the hood specifications for standard website delivery."
              maxWidth="md"
            >
              <div className="space-y-4">
                <p>
                  Every website is engineered around clean semantic HTML, responsive layouts
                  tested down to 320px screens, structured metadata, XML sitemaps, and optimized imagery.
                </p>
                <div className="rounded-xl bg-surface-subtle border border-surface-border p-4 text-xs space-y-2">
                  <p className="font-semibold text-foreground">Architecture Highlights:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Server-rendered with React Server Components</li>
                    <li>WCAG 2.2 AA accessibility target</li>
                    <li>Tailwind CSS variables with dark mode capability</li>
                    <li>Zero layout shifts with dimensioned media</li>
                  </ul>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(false)}>
                    Understood
                  </Button>
                </div>
              </div>
            </Dialog>
          </Container>
        </Section>

        {/* Section 7: Empty State Primitive */}
        <Section spacing="sm">
          <Container>
            <Eyebrow>Empty States</Eyebrow>
            <Heading level={2} className="mt-2 mb-6">
              Search &amp; Inventory Fallbacks
            </Heading>
            <EmptyState
              title="No matching results found"
              description="We could not find published content matching your search terms. Try a broader search or ask Tony in the bottom-left corner."
              action={
                <Button variant="outline" size="sm">
                  Contact Us for Specific Questions
                </Button>
              }
            />
          </Container>
        </Section>
      </main>
    </div>
  );
}
