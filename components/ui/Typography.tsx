import React from "react";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
}

export function Heading({
  level = 2,
  as,
  className = "",
  children,
  ...props
}: HeadingProps) {
  const Component = as || (`h${level}` as const);

  const levelStyles = {
    1: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight",
    2: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-snug",
    3: "text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-snug",
    4: "text-lg sm:text-xl font-semibold text-foreground",
    5: "text-base sm:text-lg font-semibold text-foreground",
    6: "text-sm sm:text-base font-semibold text-foreground",
  };

  return (
    <Component className={`${levelStyles[level]} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "lead" | "muted" | "small" | "caption";
  as?: "p" | "span" | "div";
}

export function Text({
  variant = "body",
  as: Component = "p",
  className = "",
  children,
  ...props
}: TextProps) {
  const variantStyles = {
    lead: "text-lg sm:text-xl text-muted-foreground leading-relaxed",
    body: "text-base text-muted-foreground leading-relaxed",
    muted: "text-sm text-muted leading-normal",
    small: "text-sm text-muted-foreground leading-normal",
    caption: "text-xs text-muted leading-tight",
  };

  return (
    <Component className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Eyebrow({ className = "", children, ...props }: EyebrowProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-subtle text-primary border border-primary/20 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
