import { useState } from "react";
import type { Finding } from "@/types";
import { SeverityChip, Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, EFFORT_LABEL, IMPACT_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const IMPACT_TONE: Record<string, string> = {
  high: "text-positive",
  medium: "text-medium",
  low: "text-subtle",
};

export function IssueCard({
  finding,
  index,
  defaultOpen = false,
  onHover,
  active,
}: {
  finding: Finding;
  index: number;
  defaultOpen?: boolean;
  onHover?: (id: string | null) => void;
  active?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const cat = CATEGORIES[finding.category];
  const isStrength = finding.severity === "positive";

  return (
    <article
      onMouseEnter={() => onHover?.(finding.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-[var(--radius-md)] border bg-surface transition-all duration-200",
        active ? "border-brand/50 shadow-[var(--shadow-md)]" : "border-line",
      )}
      id={`finding-${finding.id}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-surface-2/60 sm:p-5"
      >
        {/* index marker */}
        <span
          className={cn(
            "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs font-medium",
            isStrength ? "bg-positive-soft text-positive" : "bg-surface-2 text-muted",
          )}
        >
          {isStrength ? <Icon name="check" size={14} strokeWidth={2.5} /> : index}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityChip severity={finding.severity} size="sm" />
            <Badge tone="outline" icon={cat.icon}>
              {cat.short}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-subtle">
              <Icon name="eye" size={12} /> {finding.location}
            </span>
          </div>
          <h3 className="mt-2 text-pretty text-[1.05rem] leading-snug">{finding.title}</h3>
        </div>

        <Icon
          name="chevron-down"
          size={18}
          className={cn("mt-1 shrink-0 text-faint transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="animate-fade border-t border-line px-4 pb-5 pt-4 sm:px-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Block icon="search" label="Observation" tone="text-muted">
              {finding.observation}
            </Block>
            <Block icon="lightbulb" label="Why it matters" tone="text-fg">
              {finding.whyItMatters}
            </Block>
          </div>

          <div className="mt-4 rounded-[var(--radius-sm)] border border-positive/25 bg-positive-soft/50 p-4">
            <div className="flex items-center gap-2">
              <Icon name="check-circle" size={16} className="text-positive" />
              <span className="text-sm font-medium text-positive">Recommended fix</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-fg">{finding.recommendation}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <Meta icon="ruler" label="Effort" value={EFFORT_LABEL[finding.effort]} />
            <Meta
              icon="zap"
              label="Impact"
              value={IMPACT_LABEL[finding.impact].replace(" impact", "")}
              valueClass={IMPACT_TONE[finding.impact]}
            />
            {finding.reference && (
              <span className="inline-flex items-center gap-1.5 text-subtle">
                <Icon name="file-text" size={13} />
                <span className="font-mono">{finding.reference}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function Block({ icon, label, tone, children }: { icon: string; label: string; tone: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon name={icon} size={14} className="text-faint" />
        <span className="kicker">{label}</span>
      </div>
      <p className={cn("text-sm leading-relaxed", tone)}>{children}</p>
    </div>
  );
}

function Meta({ icon, label, value, valueClass }: { icon: string; label: string; value: string; valueClass?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-subtle">
      <Icon name={icon} size={13} />
      {label}:
      <span className={cn("font-medium text-fg", valueClass)}>{value}</span>
    </span>
  );
}
