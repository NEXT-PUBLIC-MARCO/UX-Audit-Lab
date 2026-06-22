import { useNavigate } from "react-router-dom";
import { useAudits } from "@/context/AuditContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { AuditCard } from "@/components/AuditCard";
import { SectionHeading } from "@/components/ui/Card";

function Stat({ icon, value, label, tone }: { icon: string; value: string; label: string; tone: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] ${tone}`}>
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div className="font-display text-2xl leading-none">{value}</div>
        <div className="mt-1 text-xs text-muted">{label}</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { audits } = useAudits();

  const totalIssues = audits.reduce((s, a) => s + a.stats.issues, 0);
  const avgScore = audits.length
    ? Math.round(audits.reduce((s, a) => s + a.overallScore, 0) / audits.length)
    : 0;
  const quickWins = audits.reduce((s, a) => s + a.stats.quickWins, 0);

  return (
    <div className="mx-auto max-w-[1180px]">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface bg-blueprint card-shadow">
        <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="animate-rise">
            <Badge tone="brand" icon="sparkles">
              Expert-led design review
            </Badge>
            <h1 className="mt-5 text-balance text-4xl leading-[1.05] sm:text-5xl">
              Turn any screen into a structured&nbsp;
              <span className="font-display italic text-brand">UX&nbsp;audit.</span>
            </h1>
            <p className="measure mt-4 text-pretty text-[1.05rem] leading-relaxed text-muted">
              Upload a screenshot or mock and get a consultant-grade report: prioritized
              usability issues, accessibility findings, design-system drift, and redesign
              direction — each with the reasoning behind it.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" icon="upload" onClick={() => navigate("/new")}>
                Run a new audit
              </Button>
              <Button
                size="lg"
                variant="secondary"
                icon="eye"
                onClick={() => navigate(`/audit/${audits[0]?.id ?? "demo-checkout"}`)}
              >
                View a sample report
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-subtle">
              <span className="inline-flex items-center gap-2">
                <Icon name="shield-check" size={16} className="text-positive" /> WCAG 2.2
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="compass" size={16} className="text-brand" /> 10 usability heuristics
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="ruler" size={16} className="text-info" /> Design-system checks
              </span>
            </div>
          </div>

          <div className="hidden lg:block">
            <Card className="rotate-1 transition-transform duration-500 hover:rotate-0 card-shadow-lg">
              <div className="flex items-center justify-between">
                <Badge tone="positive" icon="check-circle">
                  Audit complete
                </Badge>
                <span className="font-mono text-xs text-subtle">A11Y · UX · UI</span>
              </div>
              <div className="mt-4 flex items-end gap-4">
                <div>
                  <div className="font-display text-5xl leading-none text-medium">72</div>
                  <div className="kicker mt-2">Overall score</div>
                </div>
                <div className="flex-1 space-y-2 pb-1">
                  {[
                    ["Critical", "1", "bg-critical"],
                    ["High", "3", "bg-high"],
                    ["Medium", "4", "bg-medium"],
                  ].map(([l, n, c]) => (
                    <div key={l} className="flex items-center gap-2 text-xs">
                      <span className={`h-2 w-2 rounded-full ${c}`} />
                      <span className="text-muted">{l}</span>
                      <span className="ml-auto font-medium">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      {audits.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><Stat icon="file-text" value={String(audits.length)} label="Audits in workspace" tone="bg-surface-2 text-fg" /></Card>
          <Card><Stat icon="gauge" value={String(avgScore)} label="Average score" tone="bg-medium-soft text-medium" /></Card>
          <Card><Stat icon="flag" value={String(totalIssues)} label="Issues identified" tone="bg-critical-soft text-critical" /></Card>
          <Card><Stat icon="zap" value={String(quickWins)} label="Quick wins available" tone="bg-positive-soft text-positive" /></Card>
        </div>
      )}

      {/* History */}
      <section className="mt-10">
        <SectionHeading
          kicker="Saved audits"
          title="Audit history"
          description="Every report you run is saved here in your browser. Open one to revisit findings and export."
          action={
            <Button variant="secondary" icon="plus" onClick={() => navigate("/new")}>
              New audit
            </Button>
          }
        />

        {audits.length === 0 ? (
          <EmptyHistory onStart={() => navigate("/new")} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {audits.map((a) => (
              <AuditCard key={a.id} audit={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyHistory({ onStart }: { onStart: () => void }) {
  return (
    <Card className="grid place-items-center bg-grid py-16 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-[var(--radius-lg)] border border-line bg-surface-2">
          <Icon name="beaker" size={26} className="text-brand" />
        </div>
        <h3 className="mt-5 text-xl">No audits yet</h3>
        <p className="mt-2 text-pretty text-sm text-muted">
          Run your first audit to see a structured, exportable report. It takes about a
          minute, and nothing leaves your browser.
        </p>
        <Button className="mt-6" icon="upload" onClick={onStart}>
          Run your first audit
        </Button>
      </div>
    </Card>
  );
}
