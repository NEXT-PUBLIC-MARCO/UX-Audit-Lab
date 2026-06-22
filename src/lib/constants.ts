import type {
  AuditCategoryId,
  AuditCategoryMeta,
  Severity,
  AnalysisStage,
} from "@/types";

export const CATEGORIES: Record<AuditCategoryId, AuditCategoryMeta> = {
  ux: {
    id: "ux",
    label: "UX & Usability",
    short: "UX",
    blurb: "Task flow, cognitive load, error prevention, and clarity of intent.",
    icon: "compass",
  },
  ui: {
    id: "ui",
    label: "UI Consistency",
    short: "UI",
    blurb: "Visual hierarchy, spacing rhythm, and design-system adherence.",
    icon: "layers",
  },
  accessibility: {
    id: "accessibility",
    label: "Accessibility",
    short: "A11y",
    blurb: "WCAG 2.2 contrast, focus order, semantics, and assistive support.",
    icon: "accessibility",
  },
  conversion: {
    id: "conversion",
    label: "Conversion Clarity",
    short: "Convert",
    blurb: "Value framing, friction, trust signals, and decision support.",
    icon: "target",
  },
  mobile: {
    id: "mobile",
    label: "Mobile Usability",
    short: "Mobile",
    blurb: "Touch targets, reachability, responsive layout, and thumb ergonomics.",
    icon: "smartphone",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export interface SeverityMeta {
  id: Severity;
  label: string;
  /** tailwind text/bg color tokens */
  fg: string;
  bg: string;
  border: string;
  dot: string;
  description: string;
}

export const SEVERITY: Record<Severity, SeverityMeta> = {
  critical: {
    id: "critical",
    label: "Critical",
    fg: "text-critical",
    bg: "bg-critical-soft",
    border: "border-critical/30",
    dot: "bg-critical",
    description: "Blocks the task or breaks trust. Fix before ship.",
  },
  high: {
    id: "high",
    label: "High",
    fg: "text-high",
    bg: "bg-high-soft",
    border: "border-high/30",
    dot: "bg-high",
    description: "Materially hurts success rate or comprehension.",
  },
  medium: {
    id: "medium",
    label: "Medium",
    fg: "text-medium",
    bg: "bg-medium-soft",
    border: "border-medium/30",
    dot: "bg-medium",
    description: "Adds friction or polish debt worth scheduling.",
  },
  low: {
    id: "low",
    label: "Low",
    fg: "text-low",
    bg: "bg-low-soft",
    border: "border-low/30",
    dot: "bg-low",
    description: "Minor refinement; address opportunistically.",
  },
  positive: {
    id: "positive",
    label: "Strength",
    fg: "text-positive",
    bg: "bg-positive-soft",
    border: "border-positive/30",
    dot: "bg-positive",
    description: "Working well — preserve through future changes.",
  },
};

export const SEVERITY_LIST = [
  SEVERITY.critical,
  SEVERITY.high,
  SEVERITY.medium,
  SEVERITY.low,
  SEVERITY.positive,
];

export const ANALYSIS_STAGES: AnalysisStage[] = [
  { id: "ingest", label: "Reading the frame", detail: "Mapping layout regions, components, and content zones" },
  { id: "heuristics", label: "Applying heuristics", detail: "Nielsen-Norman, Gestalt, and Laws of UX" },
  { id: "a11y", label: "Checking accessibility", detail: "Contrast ratios, focus order, target sizes, semantics" },
  { id: "system", label: "Auditing the design system", detail: "Token drift, spacing rhythm, type scale adherence" },
  { id: "synthesis", label: "Prioritising findings", detail: "Scoring impact × effort and drafting fixes" },
];

export const EFFORT_LABEL: Record<string, string> = {
  trivial: "Trivial",
  small: "Small",
  medium: "Medium",
  large: "Large",
};

export const IMPACT_LABEL: Record<string, string> = {
  low: "Low impact",
  medium: "Medium impact",
  high: "High impact",
};
