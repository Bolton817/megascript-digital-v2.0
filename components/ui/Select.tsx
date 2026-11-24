import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface OptionItem {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: OptionItem[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      options = [],
      error,
      helperText,
      placeholder,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const errorId = selectId ? `${selectId}-error` : undefined;
    const helperId = selectId ? `${selectId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {props.required && <span className="text-accent ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`block w-full appearance-none rounded-xl border bg-surface px-3.5 py-2.5 pr-10 text-sm text-foreground shadow-xs transition-all hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-surface-border"
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children ||
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-xs font-medium text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
