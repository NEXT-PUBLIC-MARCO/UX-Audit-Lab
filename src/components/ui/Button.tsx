import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "tertiary" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)] " +
  "transition-[transform,background-color,box-shadow,color,border-color] duration-150 " +
  "active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-contrast shadow-[var(--shadow-sm)] hover:bg-brand-strong hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-surface text-fg border border-line-strong hover:bg-surface-2 hover:border-faint shadow-[var(--shadow-sm)]",
  ghost: "text-muted hover:text-fg hover:bg-surface-2",
  tertiary: "text-brand hover:bg-brand-soft underline-offset-4 hover:underline",
  danger: "bg-critical text-white hover:brightness-110 shadow-[var(--shadow-sm)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[0.8125rem]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon, iconRight, loading, className, children, disabled, ...rest },
  ref,
) {
  const iconSize = size === "lg" ? 19 : size === "sm" ? 15 : 17;
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Icon name="refresh" size={iconSize} className="animate-spin-slow" />
      ) : (
        icon && <Icon name={icon} size={iconSize} />
      )}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
});
