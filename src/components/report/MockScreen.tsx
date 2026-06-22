import type { PreviewSpec } from "@/types";

/* ============================================================================
   Believable mock "screenshots" rendered as lightweight SVG wireframes.
   Used when no real upload exists, and as the canvas for annotations.
   Intentionally abstract — they read as a product screen without pretending
   to be a real one. The accent ties each frame to its audit.
   ========================================================================== */

function Bar({ x, y, w, h, o = 1, rx = 2, fill = "currentColor" }: { x: number; y: number; w: number; h: number; o?: number; rx?: number; fill?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} opacity={o} />;
}

function frameContent(spec: PreviewSpec) {
  const accent = spec.accent;
  switch (spec.kind) {
    case "checkout":
      return (
        <g>
          {/* header */}
          <Bar x={32} y={28} w={120} h={12} o={0.85} />
          <Bar x={520} y={28} w={48} h={12} o={0.25} />
          {/* express wallets */}
          <rect x={32} y={64} width={350} height={36} rx={8} fill={accent} opacity={0.18} />
          <rect x={32} y={64} width={170} height={36} rx={8} fill={accent} opacity={0.3} />
          {/* divider */}
          <Bar x={32} y={118} w={350} h={1} o={0.12} />
          {/* form fields */}
          {[150, 196, 242, 288].map((y, i) => (
            <g key={i}>
              <Bar x={32} y={y} w={350} h={34} o={0.06} rx={6} />
              <Bar x={44} y={y + 12} w={90 + (i % 2) * 40} h={9} o={0.22} />
            </g>
          ))}
          {/* small fields row */}
          <Bar x={32} y={334} w={168} h={34} o={0.06} rx={6} />
          <Bar x={214} y={334} w={168} h={34} o={0.06} rx={6} />
          {/* two competing primaries */}
          <rect x={32} y={392} width={170} height={40} rx={8} fill={accent} opacity={0.9} />
          <rect x={214} y={392} width={168} height={40} rx={8} fill={accent} opacity={0.75} />
          {/* summary rail */}
          <Bar x={430} y={64} w={170} h={300} o={0.05} rx={10} />
          <Bar x={448} y={88} w={90} h={10} o={0.3} />
          <Bar x={448} y={120} w={134} h={28} o={0.08} rx={6} />
          <Bar x={448} y={300} w={70} h={9} o={0.2} />
          <Bar x={448} y={318} w={120} h={20} o={0.5} />
        </g>
      );
    case "dashboard":
      return (
        <g>
          {/* topbar + filters */}
          <Bar x={32} y={26} w={110} h={12} o={0.85} />
          <Bar x={360} y={24} w={80} h={20} o={0.08} rx={6} />
          <Bar x={452} y={24} w={80} h={20} o={0.08} rx={6} />
          <rect x={544} y={24} width={56} height={20} rx={6} fill={accent} opacity={0.4} />
          {/* KPI grid - uniform flat cards */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <Bar x={32 + i * 144} y={66} w={132} h={70} o={0.05} rx={10} />
              <Bar x={44 + i * 144} y={80} w={50} h={8} o={0.2} />
              <Bar x={44 + i * 144} y={98} w={70} h={18} o={0.4} />
              <rect x={44 + i * 144} y={122} width={36} height={6} rx={3} fill={i % 2 ? accent : "currentColor"} opacity={0.4} />
            </g>
          ))}
          {/* chart area with similar-hue series */}
          <Bar x={32} y={156} w={384} h={200} o={0.05} rx={10} />
          <polyline points="56,320 110,290 164,300 218,250 272,268 326,220 380,236" fill="none" stroke={accent} strokeWidth="2.5" opacity={0.85} />
          <polyline points="56,332 110,318 164,322 218,300 272,312 326,288 380,296" fill="none" stroke={accent} strokeWidth="2.5" opacity={0.5} />
          <polyline points="56,344 110,338 164,340 218,330 272,336 326,322 380,328" fill="none" stroke={accent} strokeWidth="2.5" opacity={0.28} />
          {/* side breakdown */}
          <Bar x={432} y={156} w={168} h={200} o={0.05} rx={10} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <Bar x={448} y={180 + i * 34} w={70} h={8} o={0.2} />
              <Bar x={448} y={194 + i * 34} w={136 - i * 18} h={8} rx={4} fill={accent} o={0.5 - i * 0.07} />
            </g>
          ))}
        </g>
      );
    case "mobile-onboarding":
      return (
        <g>
          {/* phone frame centered */}
          <rect x={236} y={20} width={160} height={344} rx={26} fill="currentColor" opacity={0.04} stroke="currentColor" strokeOpacity={0.12} />
          {/* notch */}
          <rect x={296} y={28} width={40} height={6} rx={3} fill="currentColor" opacity={0.2} />
          {/* progress */}
          <Bar x={252} y={48} w={128} h={5} o={0.1} rx={3} />
          <rect x={252} y={48} width={84} height={5} rx={3} fill={accent} opacity={0.7} />
          {/* top-right CTA (out of thumb zone) */}
          <rect x={350} y={64} width={34} height={18} rx={6} fill={accent} opacity={0.85} />
          {/* illustration */}
          <circle cx={316} cy={120} r={34} fill={accent} opacity={0.16} />
          <circle cx={316} cy={120} r={20} fill={accent} opacity={0.3} />
          {/* title + subtitle */}
          <Bar x={262} y={172} w={108} h={11} o={0.35} />
          <Bar x={262} y={190} w={84} h={8} o={0.18} />
          {/* small chips grid */}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={262 + (i % 2) * 64} y={216 + Math.floor(i / 2) * 36} width={56} height={28} rx={8} fill="currentColor" opacity={i === 0 ? 0.14 : 0.06} stroke={i === 0 ? accent : "transparent"} strokeOpacity={0.4} />
          ))}
        </g>
      );
    case "pricing":
      return (
        <g>
          <Bar x={32} y={28} w={120} h={12} o={0.85} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Bar x={40 + i * 190} y={70} w={172} h={260} o={i === 1 ? 0.08 : 0.05} rx={12} />
              <Bar x={56 + i * 190} y={92} w={70} h={10} o={0.3} />
              <Bar x={56 + i * 190} y={114} w={100} h={24} o={0.5} />
              {[0, 1, 2, 3].map((r) => (
                <Bar key={r} x={56 + i * 190} y={160 + r * 24} w={130} h={7} o={0.16} />
              ))}
              <rect x={56 + i * 190} y={290} width={140} height={28} rx={8} fill={accent} opacity={i === 1 ? 0.85 : 0.3} />
            </g>
          ))}
        </g>
      );
    case "settings":
    default:
      return (
        <g>
          <Bar x={32} y={28} w={120} h={12} o={0.85} />
          <Bar x={32} y={66} w={140} h={264} o={0.04} rx={10} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Bar key={i} x={48} y={90 + i * 36} w={100} h={9} o={i === 0 ? 0.5 : 0.18} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <Bar x={196} y={70 + i * 64} w={404} h={50} o={0.05} rx={10} />
              <Bar x={214} y={86 + i * 64} w={120} h={9} o={0.3} />
              <Bar x={214} y={102 + i * 64} w={200} h={7} o={0.15} />
              <rect x={552} y={84 + i * 64} width={34} height={18} rx={9} fill={accent} opacity={i % 2 ? 0.4 : 0.12} />
            </g>
          ))}
        </g>
      );
  }
}

export function MockScreen({ spec, className }: { spec: PreviewSpec; className?: string }) {
  return (
    <svg
      viewBox="0 0 632 384"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Wireframe preview of ${spec.label} screen`}
    >
      <rect width="632" height="384" fill="hsl(var(--surface))" />
      <g className="text-fg">{frameContent(spec)}</g>
    </svg>
  );
}
