import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles: keyboard accessible, flex alignment, smooth transitions, tactile feedback
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

    // Size variants
    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    // Color & Surface variants
    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs hover:shadow-subtle shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] border border-primary-hover/30",
      secondary:
        "bg-surface-subtle text-foreground hover:bg-surface-muted border border-surface-border shadow-xs hover:border-border",
      accent:
        "bg-accent text-accent-foreground hover:bg-accent-hover shadow-xs hover:shadow-subtle shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] border border-accent-hover/30",
      outline:
        "bg-transparent text-foreground hover:bg-surface-subtle border border-surface-border hover:border-border shadow-xs",
      ghost:
        "bg-transparent text-foreground hover:bg-surface-subtle active:bg-surface-muted active:scale-[0.98]",
      destructive:
        "bg-destructive text-white hover:bg-destructive/90 shadow-xs active:scale-[0.98]",
      link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium active:scale-100",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
