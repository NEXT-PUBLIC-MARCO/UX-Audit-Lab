import type { DesignTokenIssue } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const TYPE_META: Record<DesignTokenIssue["type"], { icon: string; tone: string }> = {
  color: { icon: "palette", tone: "text-info" },
  spacing: { icon: "ruler", tone: "text-brand" },
  typography: { icon: "type", tone: "text-medium" },
  radius: { icon: "grid", tone: "text-positive" },
  component: { icon: "layers", tone: "text-critical" },
};

export function DesignSystemPanel({ issues }: { issues: DesignTokenIssue[] }) {
  const totalDrift = issues.reduce((s, i) => s + i.occurrences, 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-4 rounded-[var(--radius-md)] border border-line bg-surface-2 p-4">
        <Icon name="ruler" size={20} className="text-brand" />
        <p className="flex-1 text-sm text-muted">
          <span className="font-medium text-fg">{totalDrift} instances</span> of token drift
          across {issues.length} categories. Consolidating these tightens visual consistency
          and shrinks future maintenance.
        </p>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-line">
        {/* header (desktop) */}
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_auto] gap-4 border-b border-line bg-surface-2 px-5 py-3 text-xs font-medium uppercase tracking-wide text-subtle sm:grid">
          <span>Token</span>
          <span>Observed</span>
          <span>Expected</span>
          <span className="text-right">Drift</span>
        </div>
        <ul className="divide-y divide-[hsl(var(--line))]">
          {issues.map((issue) => {
            const meta = TYPE_META[issue.type];
            return (
              <li key={issue.id} className="bg-surface px-5 py-4">
                <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-surface-2", meta.tone)}>
                      <Icon name={meta.icon} size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-mono text-[0.8125rem] font-medium">{issue.token}</div>
                      <div className="text-xs capitalize text-subtle">{issue.type}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-subtle sm:hidden">Observed: </span>
                    <span className="text-critical">{issue.observed}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-subtle sm:hidden">Expected: </span>
                    <span className="text-positive">{issue.expected}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 font-mono text-xs">
                      ×{issue.occurrences}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[0.8125rem] text-muted sm:pl-[2.625rem]">{issue.note}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
