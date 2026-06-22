import type {
  Audit,
  AuditCategoryId,
  Finding,
  ChecklistItem,
  DesignTokenIssue,
  RedesignDirection,
  PreviewSpec,
} from "@/types";
import { gradeFromScore, makeId, sortBySeverity } from "./utils";

/* ============================================================================
   Mock analysis engine.
   Deterministic-ish assembly from a curated heuristics library so generated
   audits read like real deliverables rather than random noise.
   ========================================================================== */

export interface AnalyzeInput {
  name: string;
  screen: string;
  context: string;
  scope: AuditCategoryId[];
  imageDataUrl?: string;
  previewKind?: PreviewSpec["kind"];
}

type FindingTemplate = Omit<Finding, "id">;

/** Curated heuristic library, grouped by lens. Severity-balanced. */
const LIBRARY: Record<AuditCategoryId, FindingTemplate[]> = {
  ux: [
    {
      category: "ux", severity: "high",
      title: "Primary action competes with secondary actions",
      location: "Action area",
      hotspot: { x: 0.5, y: 0.78 },
      observation: "More than one control uses the high-emphasis treatment, splitting the user's attention at the decision point.",
      whyItMatters: "When several actions look equally important, users hesitate and the success path slows. Clear primacy is what makes an interface feel decisive.",
      recommendation: "Keep one filled primary per view; demote the rest to secondary or tertiary styles that still read as actionable.",
      reference: "NN/g — Aesthetic & minimalist design", effort: "trivial", impact: "high",
    },
    {
      category: "ux", severity: "high",
      title: "Errors surface late, without recovery guidance",
      location: "Form / validation",
      hotspot: { x: 0.45, y: 0.5 },
      observation: "Validation appears only after submission and does not tell the user precisely how to fix each field.",
      whyItMatters: "Late, vague errors force users to re-parse the whole screen and rebuild their model — a leading cause of task abandonment.",
      recommendation: "Validate inline on blur, write human error copy, and move focus to the first invalid field on submit.",
      reference: "NN/g — Help users recognise & recover from errors", effort: "medium", impact: "high",
    },
    {
      category: "ux", severity: "medium",
      title: "Too many choices presented at once",
      location: "Options / list",
      hotspot: { x: 0.5, y: 0.4 },
      observation: "A long, flat list of equally-weighted options is shown without grouping, defaults, or recommendation.",
      whyItMatters: "Decision time grows with the number of equally-weighted options (Hick's Law). A sensible default removes most of that cost.",
      recommendation: "Group related options, pre-select a smart default, and visually mark a recommended path.",
      reference: "Laws of UX — Hick's Law", effort: "small", impact: "medium",
    },
    {
      category: "ux", severity: "medium",
      title: "System status is unclear during async actions",
      location: "Buttons / loading",
      hotspot: { x: 0.55, y: 0.7 },
      observation: "Actions that take time give no immediate, in-place feedback, leaving users unsure whether the tap registered.",
      whyItMatters: "Ambiguous status invites double-submits and erodes confidence. Visible system status is a foundational heuristic.",
      recommendation: "Show inline pending states (spinner + disabled), optimistic UI where safe, and clear success/error resolution.",
      reference: "NN/g — Visibility of system status", effort: "small", impact: "medium",
    },
    {
      category: "ux", severity: "low",
      title: "Microcopy uses system language, not user language",
      location: "Labels & messages",
      hotspot: { x: 0.4, y: 0.3 },
      observation: "Some labels expose internal terminology rather than words the user would choose themselves.",
      whyItMatters: "Speaking the user's language reduces translation effort and builds trust that the product understands them.",
      recommendation: "Audit labels against real user vocabulary; replace jargon with plain, outcome-focused wording.",
      reference: "NN/g — Match between system & real world", effort: "trivial", impact: "low",
    },
    {
      category: "ux", severity: "positive",
      title: "Clear single focus per screen",
      location: "Layout",
      hotspot: { x: 0.5, y: 0.35 },
      observation: "The screen keeps to one primary job, which keeps cognitive load low.",
      whyItMatters: "Focused screens convert and complete better. This is a strength worth protecting as features are added.",
      recommendation: "Preserve the one-job-per-screen discipline; resist the urge to co-locate unrelated tasks.",
      reference: "Laws of UX — Cognitive load", effort: "trivial", impact: "medium",
    },
  ],
  ui: [
    {
      category: "ui", severity: "medium",
      title: "Spacing rhythm drifts between sections",
      location: "Vertical spacing",
      hotspot: { x: 0.3, y: 0.5 },
      observation: "Gaps between elements use several unrelated values rather than steps from a single spacing scale.",
      whyItMatters: "Inconsistent rhythm reads subconsciously as lack of polish and makes the UI feel improvised.",
      recommendation: "Snap all spacing to a 4 / 8px scale and drive layout from spacing tokens, not ad-hoc values.",
      reference: "Design system — Spacing scale", effort: "small", impact: "medium",
    },
    {
      category: "ui", severity: "medium",
      title: "Type scale has redundant sizes",
      location: "Headings & body",
      hotspot: { x: 0.25, y: 0.25 },
      observation: "Several font sizes do nearly the same job, flattening the hierarchy instead of nesting it.",
      whyItMatters: "An over-populated scale makes it hard to tell what's primary, weakening scannability and perceived quality.",
      recommendation: "Collapse to a 5–6 step modular scale; let size, weight, and colour combine to express hierarchy.",
      reference: "Design system — Type scale", effort: "small", impact: "medium",
    },
    {
      category: "ui", severity: "low",
      title: "Corner radii are inconsistent across components",
      location: "Cards, inputs, buttons",
      hotspot: { x: 0.6, y: 0.6 },
      observation: "Similar components use different corner radii, breaking visual cohesion.",
      whyItMatters: "Mixed radii subtly fragment the interface and undercut the sense of a single, intentional system.",
      recommendation: "Define radius tokens (sm / md / lg) and map every component to one of them.",
      reference: "Design system — Radius tokens", effort: "trivial", impact: "low",
    },
    {
      category: "ui", severity: "high",
      title: "Visual hierarchy lacks a clear focal point",
      location: "Above the fold",
      hotspot: { x: 0.5, y: 0.3 },
      observation: "Elements share similar size and weight, so the eye has no obvious place to land first.",
      whyItMatters: "Without a focal point users must read everything to find anything, raising time-to-comprehension.",
      recommendation: "Establish one clear hero element; step everything else down in size, weight, or colour.",
      reference: "Gestalt — Hierarchy & focal point", effort: "medium", impact: "high",
    },
    {
      category: "ui", severity: "positive",
      title: "Consistent, restrained colour usage",
      location: "Palette",
      hotspot: { x: 0.7, y: 0.4 },
      observation: "Colour is used purposefully, with semantic accents reserved for meaning rather than decoration.",
      whyItMatters: "Restrained colour keeps the interface calm and lets important signals stand out. A genuine strength.",
      recommendation: "Maintain the discipline; document the semantic palette so it scales with the team.",
      reference: "Design system — Colour roles", effort: "trivial", impact: "medium",
    },
  ],
  accessibility: [
    {
      category: "accessibility", severity: "high",
      title: "Text contrast falls below 4.5:1 in places",
      location: "Secondary text",
      hotspot: { x: 0.4, y: 0.55 },
      observation: "Muted and helper text does not meet the 4.5:1 contrast minimum against its background.",
      whyItMatters: "Low-contrast text excludes low-vision users and is harder for everyone in bright environments. It's also a frequent audit failure.",
      recommendation: "Darken muted text to meet 4.5:1 (or 3:1 for large text); verify both light and dark themes.",
      reference: "WCAG 2.2 — 1.4.3 Contrast (Minimum)", effort: "trivial", impact: "high",
    },
    {
      category: "accessibility", severity: "high",
      title: "Interactive controls miss accessible names",
      location: "Icon-only controls",
      hotspot: { x: 0.85, y: 0.2 },
      observation: "Some icon-only buttons have no aria-label, so assistive tech announces them with no purpose.",
      whyItMatters: "Unnamed controls are effectively invisible to screen-reader users, blocking core tasks.",
      recommendation: "Add concise aria-labels to every icon-only control; keep tooltips as a sighted supplement only.",
      reference: "WCAG 2.2 — 4.1.2 Name, Role, Value", effort: "trivial", impact: "high",
    },
    {
      category: "accessibility", severity: "medium",
      title: "Meaning conveyed by colour alone",
      location: "Status / states",
      hotspot: { x: 0.5, y: 0.45 },
      observation: "Some states are signalled only by colour, with no icon, text, or shape backup.",
      whyItMatters: "Colour-only meaning fails for colour-blind and low-vision users, who can't perceive the distinction.",
      recommendation: "Pair colour with a second cue — icon, label, or pattern — for every meaningful state.",
      reference: "WCAG 2.2 — 1.4.1 Use of Color", effort: "small", impact: "medium",
    },
    {
      category: "accessibility", severity: "medium",
      title: "Focus order doesn't match visual order",
      location: "Tab sequence",
      hotspot: { x: 0.5, y: 0.6 },
      observation: "Keyboard focus jumps around the layout rather than following a logical reading order.",
      whyItMatters: "An illogical focus order disorients keyboard and switch users and can strand them on inaccessible controls.",
      recommendation: "Align DOM order with visual order; verify the full path with keyboard-only testing.",
      reference: "WCAG 2.2 — 2.4.3 Focus Order", effort: "small", impact: "medium",
    },
    {
      category: "accessibility", severity: "positive",
      title: "Visible, consistent focus indicators",
      location: "Interactive controls",
      hotspot: { x: 0.45, y: 0.4 },
      observation: "Controls show a clear focus ring, supporting keyboard navigation throughout.",
      whyItMatters: "Reliable focus visibility is foundational for keyboard accessibility and is often missing — good to see here.",
      recommendation: "Keep the focus style; ensure it meets 3:1 contrast against adjacent colours.",
      reference: "WCAG 2.2 — 2.4.7 Focus Visible", effort: "trivial", impact: "medium",
    },
  ],
  conversion: [
    {
      category: "conversion", severity: "high",
      title: "Value proposition isn't stated at the decision point",
      location: "Near primary CTA",
      hotspot: { x: 0.5, y: 0.7 },
      observation: "The user is asked to commit without a concise restatement of what they get and why now.",
      whyItMatters: "People convert on clarity, not pressure. A crisp value line beside the action removes last-moment doubt.",
      recommendation: "Add a one-line benefit and the key terms (price, cadence, guarantee) immediately beside the CTA.",
      reference: "Conversion — Clarity over persuasion", effort: "small", impact: "high",
    },
    {
      category: "conversion", severity: "medium",
      title: "Trust signals are absent at the moment of commitment",
      location: "CTA area",
      hotspot: { x: 0.55, y: 0.8 },
      observation: "There are no security, guarantee, or social-proof cues near the action that asks for commitment.",
      whyItMatters: "Trust is most fragile right before conversion; small honest reassurances measurably lift completion.",
      recommendation: "Add a compact, factual trust strip (security, guarantee, reputable proof) — never fake urgency.",
      reference: "Baymard — Trust signals", effort: "small", impact: "medium",
    },
    {
      category: "conversion", severity: "medium",
      title: "Unnecessary fields inflate the cost of converting",
      location: "Form",
      hotspot: { x: 0.4, y: 0.5 },
      observation: "The form requests information that isn't required to deliver immediate value.",
      whyItMatters: "Every extra field is a small tax on completion. Deferring optional data lowers the barrier to the first win.",
      recommendation: "Cut to the minimum viable ask; collect the rest progressively, inside the product.",
      reference: "Conversion — Friction reduction", effort: "medium", impact: "medium",
    },
    {
      category: "conversion", severity: "positive",
      title: "Fast path offered for returning users",
      location: "Top of flow",
      hotspot: { x: 0.5, y: 0.2 },
      observation: "A quicker route is surfaced for users who've been here before, respecting their time.",
      whyItMatters: "Honouring returning intent lifts completion and signals a thoughtful product. A real asset.",
      recommendation: "Keep it; consider remembering the last-used path to pre-emphasise it next time.",
      reference: "Conversion — Returning-user paths", effort: "trivial", impact: "medium",
    },
  ],
  mobile: [
    {
      category: "mobile", severity: "high",
      title: "Primary action sits outside the thumb zone",
      location: "Header / top bar",
      hotspot: { x: 0.85, y: 0.08 },
      observation: "The main action lives near the top of the screen, the hardest area to reach one-handed.",
      whyItMatters: "Mobile use is overwhelmingly one-handed; an out-of-reach primary forces a grip-shift on every interaction.",
      recommendation: "Pin the primary action to a full-width button in the bottom safe-area where the thumb naturally rests.",
      reference: "Laws of UX — Thumb zone / Fitts's Law", effort: "small", impact: "high",
    },
    {
      category: "mobile", severity: "high",
      title: "Touch targets fall below the minimum size",
      location: "Tappable controls",
      hotspot: { x: 0.5, y: 0.5 },
      observation: "Several interactive targets are smaller than the 44px guideline, with tight spacing between them.",
      whyItMatters: "Small, crowded targets cause mis-taps for everyone and create a real barrier for motor-impaired users.",
      recommendation: "Raise targets to ≥44px, add ≥8px spacing, and extend the hit area beyond the visible bounds.",
      reference: "WCAG 2.2 — 2.5.8 Target Size", effort: "trivial", impact: "high",
    },
    {
      category: "mobile", severity: "medium",
      title: "Layout ignores device safe areas",
      location: "Top / bottom edges",
      hotspot: { x: 0.5, y: 0.92 },
      observation: "Content uses fixed offsets rather than safe-area insets, risking clipping under the notch or home indicator.",
      whyItMatters: "Content lost behind system UI looks broken and undermines a premium first impression.",
      recommendation: "Adopt env(safe-area-inset-*) for edge padding and test on the smallest supported device.",
      reference: "Mobile — Safe areas", effort: "small", impact: "medium",
    },
    {
      category: "mobile", severity: "positive",
      title: "One clear action per screen",
      location: "Flow structure",
      hotspot: { x: 0.5, y: 0.6 },
      observation: "Each screen presents a single primary action, keeping momentum high.",
      whyItMatters: "One-thing-per-screen is a proven mobile pattern that sustains comprehension and flow.",
      recommendation: "Preserve the structure; keep secondary actions visually quiet.",
      reference: "Mobile — One thing per screen", effort: "trivial", impact: "medium",
    },
  ],
};

const CHECKLIST_BANK: Record<AuditCategoryId, ChecklistItem[]> = {
  accessibility: [
    { id: "a1", label: "Text contrast ≥ 4.5:1", status: "warn", detail: "Some secondary text measures below 4.5:1.", wcag: "1.4.3" },
    { id: "a2", label: "Controls have accessible names", status: "fail", detail: "Icon-only controls lack aria-labels.", wcag: "4.1.2" },
    { id: "a3", label: "Visible focus indicators", status: "pass", detail: "Focus rings present on interactive elements." },
    { id: "a4", label: "Meaning not by colour alone", status: "warn", detail: "A state relies on colour without a backup cue.", wcag: "1.4.1" },
    { id: "a5", label: "Logical focus order", status: "warn", detail: "Tab order should be verified against visual order.", wcag: "2.4.3" },
    { id: "a6", label: "Targets ≥ 24px", status: "pass", detail: "Targets meet the minimum size." },
  ],
  ux: [
    { id: "u1", label: "Single clear primary action", status: "warn", detail: "Primary action competes with peers." },
    { id: "u2", label: "Inline, recoverable errors", status: "warn", detail: "Validation should fire on blur with guidance." },
    { id: "u3", label: "Visible system status", status: "pass", detail: "Loading/feedback states are present." },
    { id: "u4", label: "Sensible defaults", status: "warn", detail: "Consider pre-selecting a recommended option." },
  ],
  ui: [
    { id: "i1", label: "Consistent spacing scale", status: "warn", detail: "Spacing drifts off the 4/8px scale." },
    { id: "i2", label: "Constrained type scale", status: "warn", detail: "Redundant font sizes present." },
    { id: "i3", label: "Token-driven radii & colour", status: "pass", detail: "Most components map to tokens." },
  ],
  conversion: [
    { id: "v1", label: "Value stated at decision point", status: "warn", detail: "Add a benefit line beside the CTA." },
    { id: "v2", label: "Trust signals near commitment", status: "fail", detail: "No security/guarantee cues at the CTA." },
    { id: "v3", label: "Minimal required fields", status: "warn", detail: "Defer non-essential inputs." },
  ],
  mobile: [
    { id: "m1", label: "Targets ≥ 44px", status: "fail", detail: "Some targets are below 44px." },
    { id: "m2", label: "Respects safe areas", status: "warn", detail: "Use env(safe-area-inset-*)." },
    { id: "m3", label: "Primary action in thumb zone", status: "warn", detail: "Move the primary action to the bottom." },
  ],
};

const TOKEN_BANK: DesignTokenIssue[] = [
  { id: "tk1", token: "color.text.muted", type: "color", observed: "low contrast", expected: "≥ 4.5:1", note: "Muted text fails contrast on the surface.", occurrences: 7 },
  { id: "tk2", token: "space.section", type: "spacing", observed: "mixed values", expected: "4 / 8px scale", note: "Vertical rhythm drifts across sections.", occurrences: 5 },
  { id: "tk3", token: "type.scale", type: "typography", observed: "redundant sizes", expected: "5-step scale", note: "Over-populated type scale flattens hierarchy.", occurrences: 6 },
  { id: "tk4", token: "radius.component", type: "radius", observed: "mixed radii", expected: "sm / md / lg tokens", note: "Inconsistent corner radii across components.", occurrences: 4 },
];

function buildRedesign(scope: AuditCategoryId[]): RedesignDirection[] {
  const all: RedesignDirection[] = [
    {
      id: "rd1", title: "Establish one decisive focal point",
      summary: "Give the eye a clear place to land and a single primary action.",
      before: ["Competing emphases", "Flat hierarchy", "No obvious first read"],
      after: ["One hero element", "Stepped-down secondary content", "A single, unmistakable primary"],
    },
    {
      id: "rd2", title: "Design for recovery, not just success",
      summary: "Inline validation, honest status, and forgiving inputs.",
      before: ["Batched submit errors", "Ambiguous loading", "Strict input formats"],
      after: ["Inline, on-blur validation", "Clear pending/success states", "Permissive, helpful inputs"],
    },
    {
      id: "rd3", title: "Make it accessible by default",
      summary: "Contrast, names, and non-colour cues baked into the system.",
      before: ["Low-contrast text", "Unnamed icon buttons", "Colour-only states"],
      after: ["≥ 4.5:1 everywhere", "Labelled controls", "Redundant state cues"],
    },
  ];
  if (scope.includes("conversion")) {
    all.push({
      id: "rd4", title: "Earn the conversion with clarity",
      summary: "State the value and reassure at the moment of commitment.",
      before: ["Value left implicit", "No trust signals", "Heavy form"],
      after: ["Benefit line at the CTA", "Honest trust strip", "Minimal viable ask"],
    });
  }
  return all;
}

function pickForCategory(cat: AuditCategoryId): Finding[] {
  const pool = LIBRARY[cat];
  // Take a believable spread: up to 3 issues + the positive, when available.
  const positives = pool.filter((f) => f.severity === "positive");
  const issues = sortBySeverity(pool.filter((f) => f.severity !== "positive")).slice(0, 3);
  const chosen = [...issues, ...positives.slice(0, 1)];
  return chosen.map((t) => ({ ...t, id: makeId(cat) }));
}

function scoreFromFindings(findings: Finding[]): number {
  // Start high, deduct by severity. Keeps generated scores realistic.
  let score = 96;
  for (const f of findings) {
    if (f.severity === "critical") score -= 11;
    else if (f.severity === "high") score -= 6;
    else if (f.severity === "medium") score -= 3;
    else if (f.severity === "low") score -= 1;
    else score += 1; // strengths nudge up
  }
  return Math.max(48, Math.min(97, Math.round(score)));
}

export function analyze(input: AnalyzeInput): Audit {
  const scope = input.scope.length ? input.scope : (["ux", "ui", "accessibility"] as AuditCategoryId[]);

  const findings = scope.flatMap(pickForCategory);

  const categoryScores = scope.map((category) => {
    const catFindings = findings.filter((f) => f.category === category);
    return {
      category,
      score: scoreFromFindings(catFindings),
      findings: catFindings.filter((f) => f.severity !== "positive").length,
    };
  });

  const overallScore = Math.round(
    categoryScores.reduce((sum, c) => sum + c.score, 0) / categoryScores.length,
  );

  const checklist = scope
    .flatMap((c) => CHECKLIST_BANK[c] ?? [])
    .slice(0, 8)
    .map((c, i) => ({ ...c, id: `chk_${i}` }));

  const issueCount = findings.filter((f) => f.severity !== "positive").length;
  const quickWins = findings.filter(
    (f) => f.severity !== "positive" && (f.effort === "trivial" || f.effort === "small"),
  ).length;
  const a11yScore = categoryScores.find((c) => c.category === "accessibility")?.score
    ?? Math.max(60, overallScore - 8);

  return {
    id: makeId("audit"),
    name: input.name || "Untitled product",
    screen: input.screen || "Reviewed screen",
    context: input.context || "Uploaded for review.",
    createdAt: new Date().toISOString(),
    scope,
    preview: {
      kind: input.previewKind ?? "dashboard",
      accent: "hsl(12 74% 53%)",
      label: input.screen?.split("—").pop()?.trim() || "Screen",
    },
    overallScore,
    grade: gradeFromScore(overallScore),
    summary:
      `This review of ${input.name || "the screen"} applied ${scope.length} ${scope.length === 1 ? "lens" : "lenses"} ` +
      `and surfaced ${issueCount} issue${issueCount === 1 ? "" : "s"}, ${quickWins} of which are quick wins. ` +
      `The fastest gains come from tightening hierarchy, making feedback recoverable, and closing the accessibility gaps flagged below.`,
    categoryScores,
    findings: sortBySeverity(findings),
    checklist,
    tokenIssues: TOKEN_BANK.map((t, i) => ({ ...t, id: `tk_${i}` })),
    redesign: buildRedesign(scope),
    stats: {
      issues: issueCount,
      quickWins,
      accessibilityScore: a11yScore,
      estReadingMins: Math.max(3, Math.round(findings.length * 0.7)),
    },
  };
}
