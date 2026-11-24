import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text";
  height?: string | number;
  width?: string | number;
}

export function Skeleton({
  variant = "rectangle",
  height,
  width,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangle: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={`animate-pulse bg-surface-border/60 ${variantStyles[variant]} ${className}`}
      style={{
        height: height,
        width: width,
        ...style,
      }}
      {...props}
    />
  );
}
