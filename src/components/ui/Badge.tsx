import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";
import { SEVERITY } from "@/lib/constants";
import { Icon } from "./Icon";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "brand" | "positive" | "info" | "outline";
  className?: string;
  icon?: string;
}

const tones: Record<string, string> = {
  neutral: "bg-surface-2 text-muted border border-line",
  brand: "bg-brand-soft text-brand border border-brand/20",
  positive: "bg-positive-soft text-positive border border-positive/20",
  info: "bg-info-soft text-info border border-info/20",
  outline: "text-muted border border-line-strong",
};

export function Badge({ children, tone = "neutral", className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

const SEVERITY_ICON: Record<Severity, string> = {
  critical: "octagon",
  high: "alert",
  medium: "info",
  low: "minus",
  positive: "check-circle",
};

export function SeverityChip({
  severity,
  size = "md",
  showIcon = true,
}: {
  severity: Severity;
  size?: "sm" | "md";
  showIcon?: boolean;
}) {
  const meta = SEVERITY[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        meta.bg,
        meta.fg,
        meta.border,
        size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1 text-xs",
      )}
    >
      {showIcon && <Icon name={SEVERITY_ICON[severity]} size={size === "sm" ? 11 : 13} strokeWidth={2} />}
      {meta.label}
    </span>
  );
}
