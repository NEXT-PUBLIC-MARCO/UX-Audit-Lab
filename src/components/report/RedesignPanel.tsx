import type { RedesignDirection } from "@/types";
import { Icon } from "@/components/ui/Icon";

export function RedesignPanel({ directions }: { directions: RedesignDirection[] }) {
  return (
    <div className="space-y-5">
      {directions.map((dir, i) => (
        <div key={dir.id} className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
          <div className="flex items-start gap-3 border-b border-line bg-surface-2 px-5 py-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-xs font-semibold text-ink-contrast">
              {i + 1}
            </span>
            <div>
              <h3 className="text-lg leading-snug">{dir.title}</h3>
              <p className="mt-0.5 text-sm text-muted">{dir.summary}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2">
            <Column tone="before" items={dir.before} />
            <div className="hidden w-px bg-line sm:block" aria-hidden />
            <Column tone="after" items={dir.after} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Column({ tone, items }: { tone: "before" | "after"; items: string[] }) {
  const isAfter = tone === "after";
  return (
    <div className={isAfter ? "bg-positive-soft/30 p-5" : "p-5"}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`grid h-6 w-6 place-items-center rounded-full ${
            isAfter ? "bg-positive text-white" : "bg-surface-3 text-subtle"
          }`}
        >
          <Icon name={isAfter ? "arrow-up-right" : "minus"} size={13} strokeWidth={2.25} />
        </span>
        <span className={`kicker ${isAfter ? "text-positive" : ""}`}>
          {isAfter ? "After — recommended" : "Before — today"}
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
            <Icon
              name={isAfter ? "check" : "x"}
              size={14}
              strokeWidth={2.25}
              className={`mt-1 shrink-0 ${isAfter ? "text-positive" : "text-faint"}`}
            />
            <span className={isAfter ? "text-fg" : "text-muted"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
