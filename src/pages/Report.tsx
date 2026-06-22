import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAudits } from "@/context/AuditContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Badge, SeverityChip } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Meter } from "@/components/ui/Meter";
import { AnnotatedPreview } from "@/components/report/AnnotatedPreview";
import { IssueCard } from "@/components/report/IssueCard";
import { ChecklistPanel } from "@/components/report/ChecklistPanel";
import { DesignSystemPanel } from "@/components/report/DesignSystemPanel";
import { RedesignPanel } from "@/components/report/RedesignPanel";
import { CATEGORIES, SEVERITY_LIST } from "@/lib/constants";
import { formatDate, cn, sortBySeverity } from "@/lib/utils";
import { buildReportMarkdown } from "@/lib/export";
import type { Severity, AuditCategoryId, Audit } from "@/types";

type Tab = "findings" | "accessibility" | "system" | "redesign";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "findings", label: "Findings", icon: "flag" },
  { id: "accessibility", label: "Accessibility", icon: "accessibility" },
  { id: "system", label: "Design system", icon: "ruler" },
  { id: "redesign", label: "Redesign direction", icon: "lightbulb" },
];

export function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAudit, previewImages, removeAudit } = useAudits();
  const audit = id ? getAudit(id) : undefined;

  const [tab, setTab] = useState<Tab>("findings");
  const [sevFilter, setSevFilter] = useState<Severity | "all">("all");
  const [catFilter, setCatFilter] = useState<AuditCategoryId | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const numbered = useMemo(
    () => (audit ? sortBySeverity(audit.findings.filter((f) => f.severity !== "positive")) : []),
    [audit],
  );

  const sevCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    audit?.findings.forEach((f) => (counts[f.severity] = (counts[f.severity] ?? 0) + 1));
    return counts;
  }, [audit]);

  if (!audit) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-[var(--radius-lg)] border border-line bg-surface-2">
            <Icon name="x-circle" size={26} className="text-muted" />
          </div>
          <h1 className="mt-5 text-2xl">Audit not found</h1>
          <p className="mt-2 text-muted">This report may have been removed from your workspace.</p>
          <Button className="mt-6" icon="arrow-left" onClick={() => navigate("/")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const image = previewImages[audit.id];

  const filtered = numbered.filter(
    (f) =>
      (sevFilter === "all" || f.severity === sevFilter) &&
      (catFilter === "all" || f.category === catFilter),
  );
  const strengths = audit.findings.filter((f) => f.severity === "positive");

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildReportMarkdown(audit));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked */
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(audit, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${audit.name.replace(/\s+/g, "-").toLowerCase()}-audit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      {/* Breadcrumb + actions */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <nav className="flex items-center gap-1.5 text-sm text-subtle" aria-label="Breadcrumb">
          <Link to="/" className="transition-colors hover:text-fg">
            Dashboard
          </Link>
          <Icon name="chevron-right" size={14} />
          <span className="text-fg">{audit.name}</span>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon="copy" onClick={copySummary}>
            {copied ? "Copied" : "Copy summary"}
          </Button>
          <Button variant="ghost" size="sm" icon="download" onClick={downloadJson}>
            JSON
          </Button>
          <Button variant="secondary" size="sm" icon="printer" onClick={() => window.print()}>
            Export PDF
          </Button>
          <button
            onClick={() => {
              if (confirm("Delete this audit from your workspace?")) {
                removeAudit(audit.id);
                navigate("/");
              }
            }}
            aria-label="Delete audit"
            className="grid h-8 w-8 place-items-center rounded-[var(--radius-sm)] text-faint transition-colors hover:bg-critical-soft hover:text-critical"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      {/* Hero */}
      <ReportHero audit={audit} sevCounts={sevCounts} />

      {/* Tabs */}
      <div className="sticky top-16 z-10 -mx-4 mt-8 border-b border-line glass px-4 print:hidden sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const count =
              t.id === "findings" ? numbered.length :
              t.id === "accessibility" ? audit.checklist.filter((c) => c.status === "fail").length :
              t.id === "system" ? audit.tokenIssues.length :
              audit.redesign.length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                  tab === t.id ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                <Icon name={t.icon} size={16} />
                {t.label}
                <span className={cn("rounded-full px-1.5 text-[0.65rem]", tab === t.id ? "bg-brand-soft text-brand" : "bg-surface-2 text-subtle")}>
                  {count}
                </span>
                {tab === t.id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        {tab === "findings" && (
          <FindingsTab
            audit={audit}
            image={image}
            numbered={numbered}
            filtered={filtered}
            strengths={strengths}
            sevFilter={sevFilter}
            setSevFilter={setSevFilter}
            catFilter={catFilter}
            setCatFilter={setCatFilter}
            sevCounts={sevCounts}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        )}
        {tab === "accessibility" && (
          <ChecklistPanel items={audit.checklist} score={audit.stats.accessibilityScore} />
        )}
        {tab === "system" && <DesignSystemPanel issues={audit.tokenIssues} />}
        {tab === "redesign" && <RedesignPanel directions={audit.redesign} />}
      </div>

      <footer className="mt-12 flex flex-col items-center gap-2 border-t border-line py-8 text-center print:hidden">
        <p className="text-sm text-muted">
          Generated by UX Audit Lab · {formatDate(audit.createdAt)}
        </p>
        <Button variant="tertiary" size="sm" icon="plus" onClick={() => navigate("/new")}>
          Run another audit
        </Button>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------- Hero ---- */

function ReportHero({ audit, sevCounts }: { audit: Audit; sevCounts: Record<string, number> }) {
  return (
    <Card className="overflow-hidden bg-blueprint">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" icon="beaker">UX Audit</Badge>
            {audit.scope.map((s: AuditCategoryId) => (
              <Badge key={s} tone="outline" icon={CATEGORIES[s].icon}>
                {CATEGORIES[s].short}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 text-balance text-3xl leading-tight sm:text-4xl">{audit.name}</h1>
          <p className="mt-1 text-lg text-muted">{audit.screen}</p>
          <p className="measure mt-4 text-pretty leading-relaxed text-fg">{audit.summary}</p>

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            <HeroStat value={audit.stats.issues} label="Total issues" icon="flag" />
            <HeroStat value={audit.stats.quickWins} label="Quick wins" icon="zap" tone="text-positive" />
            <HeroStat value={`${audit.stats.accessibilityScore}`} label="A11y score" icon="accessibility" />
            <HeroStat value={`~${audit.stats.estReadingMins}m`} label="Read time" icon="clock" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 lg:border-l lg:border-line lg:pl-8">
          <ScoreRing score={audit.overallScore} grade={audit.grade} size={150} />
          <div className="w-full max-w-[230px] space-y-2">
            {SEVERITY_LIST.filter((s) => s.id !== "positive").map((s) => {
              const n = sevCounts[s.id] ?? 0;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <SeverityChip severity={s.id} size="sm" showIcon={false} />
                  <div className="flex-1">
                    <Meter value={n} max={Math.max(4, audit.stats.issues)} tone={`hsl(var(--${s.id}))`} height={6} />
                  </div>
                  <span className="w-4 text-right text-sm font-medium tabular-nums">{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-7 grid gap-3 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {audit.categoryScores.map((c: any) => (
          <div key={c.category} className="rounded-[var(--radius-md)] border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon name={CATEGORIES[c.category as AuditCategoryId].icon} size={15} className="text-muted" />
                {CATEGORIES[c.category as AuditCategoryId].short}
              </span>
              <span className="font-display text-lg">{c.score}</span>
            </div>
            <Meter value={c.score} className="mt-2.5" height={6} />
            <p className="mt-2 text-xs text-subtle">
              {c.findings} issue{c.findings === 1 ? "" : "s"} flagged
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HeroStat({ value, label, icon, tone }: { value: number | string; label: string; icon: string; tone?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-subtle">
        <Icon name={icon} size={14} />
        <span className="text-xs">{label}</span>
      </div>
      <div className={cn("mt-1 font-display text-2xl leading-none", tone)}>{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------ Findings ---- */

function FindingsTab({
  audit, image, numbered, filtered, strengths,
  sevFilter, setSevFilter, catFilter, setCatFilter, sevCounts,
  activeId, setActiveId,
}: any) {
  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_1.15fr]">
      {/* Left: annotated preview (sticky) */}
      <div className="lg:sticky lg:top-32 lg:self-start">
        <AnnotatedPreview
          audit={audit}
          image={image}
          numbered={numbered}
          activeId={activeId}
          onHover={setActiveId}
        />
        <p className="mt-3 flex items-center gap-2 text-xs text-subtle">
          <Icon name="info" size={13} />
          Numbered pins map to findings. Hover a pin or a card to link them.
        </p>

        {strengths.length > 0 && (
          <Card className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="check-circle" size={17} className="text-positive" />
              <h3 className="text-base">What's working</h3>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((s: any) => (
                <li key={s.id} className="flex items-start gap-2.5 text-sm">
                  <Icon name="check" size={15} strokeWidth={2.25} className="mt-0.5 shrink-0 text-positive" />
                  <span>
                    <span className="font-medium">{s.title}</span>
                    <span className="block text-muted">{s.whyItMatters}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Right: filters + findings */}
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Filter active={sevFilter === "all"} onClick={() => setSevFilter("all")}>
            All ({numbered.length})
          </Filter>
          {SEVERITY_LIST.filter((s) => s.id !== "positive" && (sevCounts[s.id] ?? 0) > 0).map((s) => (
            <Filter key={s.id} active={sevFilter === s.id} onClick={() => setSevFilter(s.id)}>
              <span className={cn("h-2 w-2 rounded-full", s.dot)} />
              {s.label} ({sevCounts[s.id]})
            </Filter>
          ))}
          <div className="ml-auto">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as any)}
              className="field h-8 w-auto py-0 pr-8 text-xs"
              aria-label="Filter by category"
            >
              <option value="all">All lenses</option>
              {audit.scope.map((s: AuditCategoryId) => (
                <option key={s} value={s}>
                  {CATEGORIES[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="grid place-items-center py-12 text-center">
            <div>
              <Icon name="filter" size={24} className="mx-auto text-faint" />
              <p className="mt-3 text-sm text-muted">No findings match this filter.</p>
              <Button
                variant="tertiary"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSevFilter("all");
                  setCatFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((f: any) => (
              <IssueCard
                key={f.id}
                finding={f}
                index={numbered.indexOf(f) + 1}
                active={activeId === f.id}
                onHover={setActiveId}
                defaultOpen={f.severity === "critical"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Filter({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-fg bg-ink text-ink-contrast"
          : "border-line text-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
