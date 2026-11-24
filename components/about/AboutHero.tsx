import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Code2, Compass, ShieldCheck } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-border bg-gradient-to-b from-surface-muted/50 to-background">
      <Container size="lg">
        <div className="max-w-3xl space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
            About MegaScript Digital
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            Engineered for Operational Clarity
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            MegaScript Digital is a Kenyan digital engineering and software consultancy. We build high-speed corporate websites, custom web applications, mobile platforms, and specialized software systems tailored to real business workflows.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-primary" />
              <span>Nairobi, Kenya &bull; East Africa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Full-Stack Engineering Practice</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Direct Client Ownership Always</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
