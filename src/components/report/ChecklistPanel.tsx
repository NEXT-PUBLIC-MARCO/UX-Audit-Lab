import type { ChecklistItem } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { Meter } from "@/components/ui/Meter";
import { cn } from "@/lib/utils";

const STATUS: Record<ChecklistItem["status"], { icon: string; tone: string; ring: string; label: string }> = {
  pass: { icon: "check", tone: "text-positive", ring: "bg-positive-soft border-positive/30", label: "Pass" },
  fail: { icon: "x", tone: "text-critical", ring: "bg-critical-soft border-critical/30", label: "Fail" },
  warn: { icon: "alert", tone: "text-medium", ring: "bg-medium-soft border-medium/30", label: "Review" },
  na: { icon: "minus", tone: "text-subtle", ring: "bg-surface-2 border-line", label: "N/A" },
};

export function ChecklistPanel({ items, score }: { items: ChecklistItem[]; score: number }) {
  const pass = items.filter((i) => i.status === "pass").length;
  const fail = items.filter((i) => i.status === "fail").length;
  const warn = items.filter((i) => i.status === "warn").length;
  const considered = items.filter((i) => i.status !== "na").length;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[var(--radius-md)] border border-line bg-surface-2 p-5">
          <div className="flex items-center gap-2">
            <Icon name="accessibility" size={18} className="text-brand" />
            <span className="font-medium">WCAG 2.2 snapshot</span>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-4xl leading-none">{score}</span>
            <span className="pb-1 text-sm text-muted">/ 100</span>
          </div>
          <Meter value={score} className="mt-3" />
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
            {pass} of {considered} checks pass. Closing {fail} failure{fail === 1 ? "" : "s"} is
            the fastest route to a compliant, inclusive experience.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ["Pass", pass, "text-positive"],
              ["Review", warn, "text-medium"],
              ["Fail", fail, "text-critical"],
            ].map(([l, n, c]) => (
              <div key={l as string} className="rounded-[var(--radius-sm)] border border-line bg-surface py-2">
                <div className={cn("font-display text-xl leading-none", c as string)}>{n as number}</div>
                <div className="mt-0.5 text-[0.65rem] uppercase tracking-wide text-subtle">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="space-y-2.5">
        {items.map((item) => {
          const s = STATUS[item.status];
          return (
            <li
              key={item.id}
              className="flex items-start gap-3.5 rounded-[var(--radius-md)] border border-line bg-surface p-4"
            >
              <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border", s.ring)}>
                <Icon name={s.icon} size={15} strokeWidth={2.25} className={s.tone} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{item.label}</span>
                  {item.wcag && (
                    <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-subtle">
                      WCAG {item.wcag}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted">{item.detail}</p>
              </div>
              <span className={cn("shrink-0 text-xs font-medium", s.tone)}>{s.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
