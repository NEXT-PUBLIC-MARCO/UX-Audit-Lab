import { useNavigate } from "react-router-dom";
import type { Audit } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { MockScreen } from "@/components/report/MockScreen";
import { useAudits } from "@/context/AuditContext";
import { CATEGORIES } from "@/lib/constants";
import { relativeTime, cn } from "@/lib/utils";

function scoreColor(score: number): string {
  if (score >= 85) return "text-positive";
  if (score >= 70) return "text-medium";
  if (score >= 55) return "text-high";
  return "text-critical";
}

export function AuditCard({ audit }: { audit: Audit }) {
  const navigate = useNavigate();
  const { previewImages } = useAudits();
  const img = previewImages[audit.id];

  return (
    <Card
      interactive
      inset
      className="group overflow-hidden"
      onClick={() => navigate(`/audit/${audit.id}`)}
      role="link"
      tabIndex={0}
      aria-label={`Open audit for ${audit.name} — ${audit.screen}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/audit/${audit.id}`);
        }
      }}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface-2">
        {img ? (
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <MockScreen
            spec={audit.preview}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute right-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-sm font-semibold shadow-[var(--shadow-sm)] backdrop-blur",
              scoreColor(audit.overallScore),
            )}
          >
            {audit.overallScore}
            <span className="text-[0.65rem] font-medium text-subtle">/100</span>
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-subtle">
          <Icon name="clock" size={13} />
          {relativeTime(audit.createdAt)}
          <span className="text-faint">·</span>
          <span>
            {audit.stats.issues} issue{audit.stats.issues === 1 ? "" : "s"}
          </span>
        </div>

        <h3 className="mt-2 truncate text-lg leading-snug">{audit.name}</h3>
        <p className="truncate text-sm text-muted">{audit.screen}</p>

        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {audit.scope.slice(0, 3).map((s) => (
            <Badge key={s} tone="outline" icon={CATEGORIES[s].icon}>
              {CATEGORIES[s].short}
            </Badge>
          ))}
          {audit.scope.length > 3 && (
            <Badge tone="neutral">+{audit.scope.length - 3}</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
