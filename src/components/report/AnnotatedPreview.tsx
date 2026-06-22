import type { Audit, Finding } from "@/types";
import { MockScreen } from "./MockScreen";
import { SEVERITY } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* Annotated review canvas: the screen with numbered, severity-coloured pins
   that map to findings. Hovering a pin (or its issue card) links the two. */

export function AnnotatedPreview({
  audit,
  image,
  numbered,
  activeId,
  onHover,
}: {
  audit: Audit;
  image?: string;
  numbered: Finding[];
  activeId?: string | null;
  onHover?: (id: string | null) => void;
}) {
  const pinned = numbered.filter((f) => f.hotspot);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface-2">
      {/* fake browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-critical/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-medium/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-positive/60" />
        <span className="ml-3 truncate font-mono text-[0.7rem] text-subtle">
          {audit.name.toLowerCase().replace(/\s+/g, "")}.app/{audit.preview.label.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>

      <div className="relative">
        {image ? (
          <img src={image} alt={`Reviewed screen: ${audit.screen}`} className="block max-h-[460px] w-full object-contain" />
        ) : (
          <MockScreen spec={audit.preview} className="block aspect-[632/384] w-full" />
        )}

        {/* pins */}
        {pinned.map((f) => {
          const n = numbered.indexOf(f) + 1;
          const meta = SEVERITY[f.severity];
          const isActive = activeId === f.id;
          return (
            <a
              key={f.id}
              href={`#finding-${f.id}`}
              onMouseEnter={() => onHover?.(f.id)}
              onMouseLeave={() => onHover?.(null)}
              onClick={() => {
                const el = document.getElementById(`finding-${f.id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(f.hotspot!.x) * 100}%`, top: `${(f.hotspot!.y) * 100}%` }}
              aria-label={`Finding ${n}: ${f.title}`}
            >
              {isActive && (
                <span className={cn("absolute inset-0 -m-1 animate-ping rounded-full opacity-60", meta.dot)} />
              )}
              <span
                className={cn(
                  "relative grid h-7 w-7 place-items-center rounded-full border-2 border-white font-mono text-xs font-semibold text-white shadow-[var(--shadow-md)] transition-transform duration-150",
                  meta.dot,
                  isActive ? "scale-125" : "group-hover:scale-110",
                )}
              >
                {n}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
