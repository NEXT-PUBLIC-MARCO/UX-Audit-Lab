import { cn } from "@/lib/utils";

function colorForScore(score: number): string {
  if (score >= 85) return "hsl(var(--positive))";
  if (score >= 70) return "hsl(var(--medium))";
  if (score >= 55) return "hsl(var(--high))";
  return "hsl(var(--critical))";
}

export function Meter({
  value,
  max = 100,
  tone,
  className,
  height = 8,
}: {
  value: number;
  max?: number;
  tone?: string;
  className?: string;
  height?: number;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-surface-3", className)}
      style={{ height }}
      role="meter"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: tone ?? colorForScore(pct) }}
      />
    </div>
  );
}
