import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "muted" | "elevated" | "outline";
  interactive?: boolean;
}

export function Card({
  variant = "default",
  interactive = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-surface border border-surface-border/90 shadow-xs",
    subtle: "bg-surface-subtle border border-surface-border/60 shadow-xs",
    muted: "bg-surface-muted border border-surface-border/80 shadow-xs",
    elevated: "bg-surface border border-surface-border/60 shadow-card",
    outline: "bg-transparent border border-surface-border",
  };

  const interactiveStyles = interactive
    ? "hover:-translate-y-0.5 hover:shadow-card hover:border-primary/40 cursor-pointer focus-within:ring-2 focus-within:ring-primary transition-all duration-200"
    : "transition-colors duration-150";

  return (
    <div
      className={`rounded-2xl p-6 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  as: Component = "h3",
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" }) {
  return (
    <Component
      className={`text-lg sm:text-xl font-bold tracking-tight text-foreground ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-muted-foreground leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-sm text-foreground ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-6 flex items-center pt-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
