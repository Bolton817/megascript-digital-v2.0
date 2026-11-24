import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "accent" | "success" | "warning" | "destructive" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    neutral: "bg-surface-subtle text-muted-foreground border-surface-border",
    primary: "bg-primary-subtle text-primary border-primary/25 font-semibold",
    accent: "bg-accent-subtle text-accent border-accent/25 font-semibold",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-semibold",
    destructive: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-semibold",
    outline: "bg-transparent text-muted-foreground border-surface-border font-medium",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full mr-1.5 bg-current opacity-80 shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}
