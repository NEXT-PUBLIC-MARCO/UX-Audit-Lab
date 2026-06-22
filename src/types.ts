/* ============================================================================
   Domain model for UX Audit Lab
   ========================================================================== */

export type Severity = "critical" | "high" | "medium" | "low" | "positive";

export type AuditCategoryId =
  | "ux"
  | "ui"
  | "accessibility"
  | "conversion"
  | "mobile";

export interface AuditCategoryMeta {
  id: AuditCategoryId;
  label: string;
  short: string;
  blurb: string;
  /** lucide-style key resolved by the Icon component */
  icon: string;
}

/** A single annotated finding within a report. */
export interface Finding {
  id: string;
  category: AuditCategoryId;
  severity: Severity;
  title: string;
  /** Where on the screen this applies (human readable). */
  location: string;
  /** Normalised hotspot for the annotated preview: 0..1 of the frame. */
  hotspot?: { x: number; y: number };
  /** The observed problem. */
  observation: string;
  /** Why it matters — the value/impact argument. */
  whyItMatters: string;
  /** Concrete recommended fix. */
  recommendation: string;
  /** Heuristic / principle / WCAG reference. */
  reference?: string;
  /** Estimated implementation effort. */
  effort: "trivial" | "small" | "medium" | "large";
  /** Estimated impact on the experience. */
  impact: "low" | "medium" | "high";
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "warn" | "na";
  detail: string;
  wcag?: string;
}

export interface DesignTokenIssue {
  id: string;
  token: string;
  type: "color" | "spacing" | "typography" | "radius" | "component";
  observed: string;
  expected: string;
  note: string;
  occurrences: number;
}

export interface RedesignDirection {
  id: string;
  title: string;
  summary: string;
  before: string[];
  after: string[];
}

export interface CategoryScore {
  category: AuditCategoryId;
  score: number; // 0..100
  findings: number;
}

export interface Audit {
  id: string;
  /** Product / screen name. */
  name: string;
  /** e.g. "Checkout — Payment step". */
  screen: string;
  /** Short context line. */
  context: string;
  createdAt: string; // ISO
  /** Audit lenses that were run. */
  scope: AuditCategoryId[];
  /** Visual treatment for the mock preview frame. */
  preview: PreviewSpec;
  overallScore: number; // 0..100
  grade: string; // A+, A, B…
  summary: string;
  categoryScores: CategoryScore[];
  findings: Finding[];
  checklist: ChecklistItem[];
  tokenIssues: DesignTokenIssue[];
  redesign: RedesignDirection[];
  /** Headline metrics for the report hero. */
  stats: {
    issues: number;
    quickWins: number;
    accessibilityScore: number;
    estReadingMins: number;
  };
}

/** Declarative spec used to render a believable mock screenshot frame. */
export interface PreviewSpec {
  kind: "checkout" | "dashboard" | "mobile-onboarding" | "pricing" | "settings";
  accent: string; // hsl()
  label: string;
}

export interface AnalysisStage {
  id: string;
  label: string;
  detail: string;
}
