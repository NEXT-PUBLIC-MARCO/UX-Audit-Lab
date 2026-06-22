import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
  grade?: string;
  className?: string;
}

function colorForScore(score: number): string {
  if (score >= 85) return "hsl(var(--positive))";
  if (score >= 70) return "hsl(var(--medium))";
  if (score >= 55) return "hsl(var(--high))";
  return "hsl(var(--critical))";
}

export function ScoreRing({
  score,
  size = 128,
  stroke = 10,
  label,
  grade,
  className,
}: ScoreRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, score)) / 100) * c;
  const color = colorForScore(score);

  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--line))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display leading-none" style={{ fontSize: size * 0.3 }}>
            {Math.round(score)}
          </div>
          {grade && (
            <div className="mt-0.5 font-mono text-[0.65rem] font-medium tracking-wider" style={{ color }}>
              GRADE {grade}
            </div>
          )}
          {label && !grade && <div className="kicker mt-1">{label}</div>}
        </div>
      </div>
    </div>
  );
}
