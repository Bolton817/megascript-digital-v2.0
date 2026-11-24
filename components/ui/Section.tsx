import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "subtle" | "muted" | "primary-subtle" | "elevated";
  as?: "section" | "div" | "article" | "aside";
}

export function Section({
  spacing = "lg",
  variant = "default",
  as: Component = "section",
  className = "",
  children,
  ...props
}: SectionProps) {
  const spacingStyles = {
    none: "py-0",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16",
    lg: "py-16 sm:py-24",
    xl: "py-20 sm:py-32",
  };

  const variantStyles = {
    default: "bg-background text-foreground",
    subtle: "bg-surface-subtle text-foreground border-y border-surface-border",
    muted: "bg-surface-muted/70 text-foreground border-y border-surface-border",
    "primary-subtle": "bg-primary-subtle text-foreground border-y border-primary/10",
    elevated: "bg-surface text-foreground shadow-xs border-y border-surface-border/60",
  };

  return (
    <Component
      className={`relative w-full ${spacingStyles[spacing]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
