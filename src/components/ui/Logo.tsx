import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-ink text-ink-contrast shadow-[var(--shadow-sm)]">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M8 9.5C8 8.67 8.67 8 9.5 8H19a5 5 0 0 1 0 10h-6.5v5.5A1.5 1.5 0 0 1 11 25H9.5A1.5 1.5 0 0 1 8 23.5V9.5Z"
            fill="hsl(var(--brand))"
          />
          <circle cx="21.5" cy="20.5" r="4.5" stroke="currentColor" strokeWidth="2" />
          <path d="M24.7 23.7L27 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {showWordmark && (
        <span className="leading-tight">
          <span className="block font-display text-[1.05rem] font-medium tracking-tight">
            UX Audit Lab
          </span>
          <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-subtle">
            Structured design review
          </span>
        </span>
      )}
    </span>
  );
}
