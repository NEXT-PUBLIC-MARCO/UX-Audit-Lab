import type { Audit } from "@/types";

/* ============================================================================
   Demo audits — handcrafted to read like real consultant deliverables.
   These power the "Load a demo" experience and the saved-history defaults.
   ========================================================================== */

const checkoutAudit: Audit = {
  id: "demo-checkout",
  name: "Northwind Commerce",
  screen: "Checkout — Payment step",
  context: "B2C subscription checkout, desktop web. Drop-off spikes on this step.",
  createdAt: "2026-06-18T14:20:00.000Z",
  scope: ["ux", "ui", "accessibility", "conversion"],
  preview: { kind: "checkout", accent: "hsl(12 74% 53%)", label: "Payment" },
  overallScore: 72,
  grade: "C",
  summary:
    "A competent checkout undermined by avoidable friction at the moment of payment. The form asks for more than it needs, hides the order total below the fold, and surfaces errors only after submission. Three changes — inline validation, a persistent order summary, and trust signals beside the pay button — should recover a meaningful share of the abandonment seen on this step.",
  categoryScores: [
    { category: "ux", score: 70, findings: 4 },
    { category: "ui", score: 78, findings: 3 },
    { category: "accessibility", score: 64, findings: 3 },
    { category: "conversion", score: 68, findings: 3 },
  ],
  stats: { issues: 13, quickWins: 6, accessibilityScore: 64, estReadingMins: 7 },
  findings: [
    {
      id: "c1",
      category: "conversion",
      severity: "critical",
      title: "Order total is below the fold at the point of payment",
      location: "Right rail / order summary",
      hotspot: { x: 0.82, y: 0.66 },
      observation:
        "The amount the user is about to be charged is pushed beneath the payment form and requires scrolling on a 13\" laptop. The primary CTA reads “Pay now” with no figure attached.",
      whyItMatters:
        "Asking someone to authorise a charge they can't currently see is the single most common trigger for last-second abandonment. It also reads as a dark-pattern risk and erodes trust precisely when it matters most.",
      recommendation:
        "Pin the order total to the pay button: “Pay $48.00 / mo”. Keep a condensed, sticky summary visible in the right rail at all viewport heights. Show the renewal date and cancellation terms inline.",
      reference: "NN/g — Visibility of system status",
      effort: "small",
      impact: "high",
    },
    {
      id: "c2",
      category: "ux",
      severity: "high",
      title: "Validation fires only on submit, all at once",
      location: "Card + billing fields",
      hotspot: { x: 0.4, y: 0.45 },
      observation:
        "Field errors appear as a red banner after the user presses Pay. Five fields can error simultaneously, and focus is not moved to the first invalid field.",
      whyItMatters:
        "Late, batched errors force users to re-parse the whole form and re-build their mental model. Success rate drops and perceived effort climbs — a classic cause of rage-quits on otherwise-complete purchases.",
      recommendation:
        "Validate on blur with inline, field-level messages. On submit, move focus to the first invalid field and summarise count in an assertive live region. Accept card formats permissively (spaces, dashes).",
      reference: "NN/g — Error prevention & recovery",
      effort: "medium",
      impact: "high",
    },
    {
      id: "c3",
      category: "accessibility",
      severity: "high",
      title: "Form inputs rely on placeholder text as their only label",
      location: "All payment fields",
      hotspot: { x: 0.38, y: 0.34 },
      observation:
        "“Card number”, “MM/YY”, and “CVC” exist only as placeholders. Once a value is typed the label disappears, and screen readers announce the field as unlabeled.",
      whyItMatters:
        "Placeholder-as-label fails WCAG 3.3.2 and disproportionately harms people using screen readers, magnification, or anyone who paused mid-form. It is one of the most common — and most fixable — accessibility defects in checkout.",
      recommendation:
        "Add persistent, programmatically associated <label> elements above each field. Reserve placeholders for format hints (e.g. “1234 5678 9012 3456”). Connect error text via aria-describedby.",
      reference: "WCAG 2.2 — 3.3.2 Labels or Instructions",
      effort: "small",
      impact: "high",
    },
    {
      id: "c4",
      category: "ui",
      severity: "medium",
      title: "Two competing primary buttons in one viewport",
      location: "Footer + summary",
      hotspot: { x: 0.6, y: 0.8 },
      observation:
        "“Pay now” and “Apply promo code” share the same filled brand treatment and weight, splitting visual priority.",
      whyItMatters:
        "When everything is primary, nothing is. The eye has to arbitrate between two equally-loud targets, slowing the decision and diluting the conversion path.",
      recommendation:
        "Keep a single filled primary (Pay). Demote promo to a tertiary text affordance that expands an input inline. Reserve filled brand for the one action you want most.",
      reference: "Design system — Button hierarchy",
      effort: "trivial",
      impact: "medium",
    },
    {
      id: "c5",
      category: "conversion",
      severity: "medium",
      title: "No trust or security cues beside the pay action",
      location: "Pay button area",
      hotspot: { x: 0.6, y: 0.86 },
      observation:
        "There is no mention of encryption, accepted cards, money-back terms, or the merchant of record near the moment of commitment.",
      whyItMatters:
        "Trust is most fragile at the pay button. A small, honest reassurance (“Secured by Stripe · Cancel anytime”) measurably lifts completion for first-time buyers.",
      recommendation:
        "Add a compact trust strip: lock + processor, accepted card marks, and a one-line guarantee. Keep it factual — no fake urgency or countdown timers.",
      reference: "Baymard — Checkout trust signals",
      effort: "small",
      impact: "medium",
    },
    {
      id: "c6",
      category: "ux",
      severity: "medium",
      title: "Billing address requested before it is needed",
      location: "Billing section",
      hotspot: { x: 0.4, y: 0.6 },
      observation:
        "Full billing address (7 fields) is required up front, even for cards that don't require AVS in this market.",
      whyItMatters:
        "Every extra field is a small tax on completion. Front-loading address capture inflates perceived effort on a step where momentum is everything.",
      recommendation:
        "Collect postal/ZIP only for AVS, then progressively reveal the full address solely if the processor requests it. Offer address autocomplete.",
      reference: "Laws of UX — Hick's Law",
      effort: "medium",
      impact: "medium",
    },
    {
      id: "c7",
      category: "accessibility",
      severity: "medium",
      title: "Focus order skips the order summary",
      location: "Tab sequence",
      hotspot: { x: 0.82, y: 0.5 },
      observation:
        "Tabbing moves from the last form field directly to Pay, bypassing the editable quantity stepper in the summary rail.",
      whyItMatters:
        "An illogical focus order strands keyboard and switch users, who cannot reach a control that mouse users can. It also signals deeper DOM-order problems.",
      recommendation:
        "Align DOM order with visual order, or use a logical tabindex strategy. Verify the full path with keyboard-only testing.",
      reference: "WCAG 2.2 — 2.4.3 Focus Order",
      effort: "small",
      impact: "medium",
    },
    {
      id: "c8",
      category: "ui",
      severity: "low",
      title: "Inconsistent input heights between sections",
      location: "Card vs billing inputs",
      hotspot: { x: 0.38, y: 0.52 },
      observation:
        "Card fields are 44px tall; billing fields are 38px. Corner radii differ by 2px between the two groups.",
      whyItMatters:
        "Small inconsistencies read subconsciously as lack of care and chip away at the premium feel a paid product needs to project.",
      recommendation:
        "Normalise to a single input token (height, radius, padding, focus ring). Drive both groups from the same component.",
      reference: "Design system — Field tokens",
      effort: "trivial",
      impact: "low",
    },
    {
      id: "c9",
      category: "ux",
      severity: "positive",
      title: "Express wallets are offered first and clearly separated",
      location: "Top of form",
      hotspot: { x: 0.4, y: 0.18 },
      observation:
        "Apple Pay / Google Pay appear above the manual form with a clear “or pay with card” divider.",
      whyItMatters:
        "Offering the fastest path first respects returning users and lifts mobile completion. The separation keeps the manual path uncluttered.",
      recommendation:
        "Preserve this pattern. Consider remembering the user's last-used method to pre-emphasise it next time.",
      reference: "Baymard — Express checkout",
      effort: "trivial",
      impact: "medium",
    },
    {
      id: "c10",
      category: "conversion",
      severity: "low",
      title: "Promo field invites comparison-shopping mid-checkout",
      location: "Summary rail",
      hotspot: { x: 0.82, y: 0.4 },
      observation:
        "A prominent empty “Promo code” box sits above the total, prompting users to leave and hunt for a code.",
      whyItMatters:
        "An open coupon field is a known leak — users abandon to search for codes and may not return.",
      recommendation:
        "Collapse to a quiet “Have a code?” link. Auto-apply codes from referral links so most users never see the field.",
      reference: "Baymard — Coupon fields",
      effort: "trivial",
      impact: "low",
    },
  ],
  checklist: [
    { id: "k1", label: "Text contrast ≥ 4.5:1 for body copy", status: "warn", detail: "Helper text at #8A8A8A on white measures 3.4:1.", wcag: "1.4.3" },
    { id: "k2", label: "All inputs have persistent labels", status: "fail", detail: "Payment fields use placeholders only.", wcag: "3.3.2" },
    { id: "k3", label: "Visible focus indicator on all controls", status: "pass", detail: "2px outline present on inputs and buttons." },
    { id: "k4", label: "Logical focus order", status: "fail", detail: "Summary stepper skipped in tab sequence.", wcag: "2.4.3" },
    { id: "k5", label: "Errors announced to assistive tech", status: "fail", detail: "Error banner is not in a live region.", wcag: "4.1.3" },
    { id: "k6", label: "Touch / click targets ≥ 24px", status: "pass", detail: "All actionable targets meet the minimum." },
    { id: "k7", label: "Form usable at 200% zoom", status: "warn", detail: "Right rail overlaps form below 1024px at 200%.", wcag: "1.4.10" },
    { id: "k8", label: "Color is not the only error signal", status: "pass", detail: "Errors pair red with an icon and text." },
  ],
  tokenIssues: [
    { id: "t1", token: "color.text.muted", type: "color", observed: "#8A8A8A", expected: "#6B7280 (3.4:1 → 4.6:1)", note: "Muted text fails contrast on white surfaces.", occurrences: 9 },
    { id: "t2", token: "space.field-gap", type: "spacing", observed: "12 / 16 / 20px mixed", expected: "16px (1 step)", note: "Vertical rhythm drifts between sections.", occurrences: 6 },
    { id: "t3", token: "radius.input", type: "radius", observed: "6px & 8px", expected: "8px", note: "Two radii used for the same component.", occurrences: 4 },
    { id: "t4", token: "button.primary", type: "component", observed: "2 filled primaries", expected: "1 filled primary / view", note: "Promo button mis-uses the primary style.", occurrences: 2 },
  ],
  redesign: [
    {
      id: "r1",
      title: "Make the total impossible to miss",
      summary: "Bind the amount to the action and keep a sticky summary in view.",
      before: ["“Pay now” with no figure", "Total below the fold", "Renewal terms hidden in fine print"],
      after: ["“Pay $48.00 / mo” on the button", "Sticky condensed summary in the rail", "Renewal date + cancel terms inline"],
    },
    {
      id: "r2",
      title: "Validate kindly, in real time",
      summary: "Move from batched submit errors to inline, recoverable guidance.",
      before: ["Red banner after submit", "Focus stays at the button", "Strict card formatting"],
      after: ["Inline validation on blur", "Focus jumps to first error", "Permissive, forgiving input"],
    },
    {
      id: "r3",
      title: "Reassure at the moment of commitment",
      summary: "A quiet, honest trust strip beside the single primary action.",
      before: ["No security cues", "Two competing primaries", "Open promo box leaking attention"],
      after: ["Processor + guarantee strip", "One unmistakable primary", "Collapsed “Have a code?” link"],
    },
  ],
};

const dashboardAudit: Audit = {
  id: "demo-dashboard",
  name: "Atlas Analytics",
  screen: "Workspace — Overview dashboard",
  context: "B2B analytics SaaS. Power users live here daily; new users bounce.",
  createdAt: "2026-06-15T09:05:00.000Z",
  scope: ["ux", "ui", "accessibility"],
  preview: { kind: "dashboard", accent: "hsl(250 60% 56%)", label: "Overview" },
  overallScore: 81,
  grade: "B",
  summary:
    "A dense, capable dashboard that serves experts well but overwhelms newcomers and leans on color alone to carry meaning. The data visualisation is strong; the information hierarchy and first-run experience are where the value is hiding. Tightening the type scale, adding a default empty/onboarding state, and making charts colour-blind safe would raise both polish and reach.",
  categoryScores: [
    { category: "ux", score: 80, findings: 4 },
    { category: "ui", score: 86, findings: 3 },
    { category: "accessibility", score: 76, findings: 3 },
  ],
  stats: { issues: 10, quickWins: 4, accessibilityScore: 76, estReadingMins: 6 },
  findings: [
    {
      id: "d1",
      category: "ux",
      severity: "high",
      title: "No first-run state — new users meet a wall of empty charts",
      location: "Whole canvas (zero-data)",
      hotspot: { x: 0.5, y: 0.4 },
      observation:
        "Before data connects, every widget renders empty axes and “0”. There is no guidance toward the one action that makes the product valuable: connecting a source.",
      whyItMatters:
        "The first session decides activation. An ambiguous empty canvas reads as “broken” rather than “not set up yet”, and is a leading cause of new-user bounce in analytics tools.",
      recommendation:
        "Design a purposeful empty state: a single clear “Connect a data source” path, a sample-data toggle so users can explore immediately, and skeleton placeholders that explain what each widget will show.",
      reference: "NN/g — Empty states as onboarding",
      effort: "medium",
      impact: "high",
    },
    {
      id: "d2",
      category: "accessibility",
      severity: "high",
      title: "Chart series distinguished by colour alone",
      location: "Trend & breakdown charts",
      hotspot: { x: 0.35, y: 0.55 },
      observation:
        "Up to six series share similar hues. There are no patterns, direct labels, or distinct shapes, and the red/green deltas are indistinguishable for common colour-vision deficiencies.",
      whyItMatters:
        "~1 in 12 men cannot reliably separate these series. Relying on colour alone fails WCAG 1.4.1 and quietly excludes a real slice of a B2B audience.",
      recommendation:
        "Add redundant encodings: direct line-end labels, distinct markers/dashes, and a colour-blind-safe palette. Pair every red/green delta with an arrow and sign.",
      reference: "WCAG 2.2 — 1.4.1 Use of Color",
      effort: "medium",
      impact: "high",
    },
    {
      id: "d3",
      category: "ui",
      severity: "medium",
      title: "Type scale has too many sizes doing similar jobs",
      location: "Card headers & metrics",
      hotspot: { x: 0.2, y: 0.25 },
      observation:
        "Seven distinct font sizes appear above the fold (13, 14, 15, 16, 20, 24, 28px). Metric values and card titles compete rather than nest.",
      whyItMatters:
        "An over-populated scale flattens hierarchy — the eye can't tell what's primary. It also makes the UI feel improvised rather than systematic.",
      recommendation:
        "Collapse to a 5-step modular scale. Give each metric a clear lead value, a quiet label, and a tertiary delta. Let size + weight + colour do the work together.",
      reference: "Design system — Type scale",
      effort: "small",
      impact: "medium",
    },
    {
      id: "d4",
      category: "ux",
      severity: "medium",
      title: "Filters reset on navigation with no undo",
      location: "Global filter bar",
      hotspot: { x: 0.5, y: 0.12 },
      observation:
        "Date range and segment filters silently reset when the user opens a detail view and returns.",
      whyItMatters:
        "Losing a carefully-built view is a high-frustration moment for power users — exactly the people this product retains on. It punishes exploration.",
      recommendation:
        "Persist filter state in the URL and restore it on return. Offer saved views and a one-click “reset to default”.",
      reference: "NN/g — User control & freedom",
      effort: "medium",
      impact: "medium",
    },
    {
      id: "d5",
      category: "ui",
      severity: "medium",
      title: "Card density is uniform regardless of importance",
      location: "Metric grid",
      hotspot: { x: 0.5, y: 0.6 },
      observation:
        "Twelve KPI cards share identical size and weight; the headline metric (MRR) is no more prominent than a secondary count.",
      whyItMatters:
        "Without a focal point, users must read everything to find anything. A flat grid increases time-to-insight on a screen whose entire job is fast insight.",
      recommendation:
        "Introduce a hero metric row with larger cards, then a secondary grid. Let users pin the metrics they care about to the top.",
      reference: "Gestalt — Hierarchy & focal point",
      effort: "medium",
      impact: "medium",
    },
    {
      id: "d6",
      category: "accessibility",
      severity: "medium",
      title: "Icon-only buttons lack accessible names",
      location: "Card action menus",
      hotspot: { x: 0.88, y: 0.28 },
      observation:
        "The ⋯, export, and refresh controls are icon-only with no aria-label or visible text.",
      whyItMatters:
        "Screen readers announce these as “button” with no purpose, making core actions unusable without sight. Tooltips don't fix the programmatic name.",
      recommendation:
        "Add concise aria-labels (“More actions for MRR”). Keep tooltips for sighted hover, but never as the sole label.",
      reference: "WCAG 2.2 — 4.1.2 Name, Role, Value",
      effort: "trivial",
      impact: "medium",
    },
    {
      id: "d7",
      category: "ux",
      severity: "low",
      title: "Tooltips truncate long metric names",
      location: "Chart hover",
      hotspot: { x: 0.4, y: 0.7 },
      observation:
        "Series names longer than ~18 characters are cut with an ellipsis in the hover tooltip.",
      whyItMatters:
        "Ambiguous labels force users to guess which series they're reading — small, but it undermines confidence in the numbers.",
      recommendation:
        "Allow tooltips to wrap to two lines, or show the full name with a secondary muted descriptor.",
      reference: "Data viz — Labelling",
      effort: "trivial",
      impact: "low",
    },
    {
      id: "d8",
      category: "ui",
      severity: "positive",
      title: "Excellent number formatting and unit handling",
      location: "All metrics",
      hotspot: { x: 0.25, y: 0.45 },
      observation:
        "Values use locale-aware grouping, compact notation (1.2M), and consistent currency placement.",
      whyItMatters:
        "Trustworthy number formatting is foundational for an analytics product and is frequently botched. This is done well.",
      recommendation:
        "Preserve it. Extend the same rigour to chart axes and exported CSVs.",
      reference: "Data viz — Numeric formatting",
      effort: "trivial",
      impact: "medium",
    },
    {
      id: "d9",
      category: "ux",
      severity: "positive",
      title: "Keyboard shortcuts are discoverable and documented",
      location: "Command palette (⌘K)",
      hotspot: { x: 0.5, y: 0.5 },
      observation:
        "A command palette exposes navigation and actions with visible shortcut hints.",
      whyItMatters:
        "Power-user ergonomics are a genuine retention lever for daily-use tools, and discoverability via ⌘K is best-in-class.",
      recommendation:
        "Keep investing here. Add a “?” shortcut overlay to teach the palette to newcomers.",
      reference: "Laws of UX — Power users",
      effort: "small",
      impact: "medium",
    },
  ],
  checklist: [
    { id: "k1", label: "Information not conveyed by colour alone", status: "fail", detail: "Chart series rely on hue only.", wcag: "1.4.1" },
    { id: "k2", label: "Interactive controls have accessible names", status: "fail", detail: "Icon-only card menus unlabeled.", wcag: "4.1.2" },
    { id: "k3", label: "Text contrast ≥ 4.5:1", status: "pass", detail: "Body and labels meet contrast on both themes." },
    { id: "k4", label: "Non-text contrast ≥ 3:1 (UI/graphics)", status: "warn", detail: "Some chart gridlines measure 2.4:1.", wcag: "1.4.11" },
    { id: "k5", label: "Visible focus on charts & menus", status: "pass", detail: "Focus rings present throughout." },
    { id: "k6", label: "Reflows to 320px without loss", status: "warn", detail: "KPI grid clips at narrow widths.", wcag: "1.4.10" },
    { id: "k7", label: "Motion respects reduced-motion", status: "pass", detail: "Chart entrance animation is gated." },
    { id: "k8", label: "Data tables for chart alternatives", status: "na", detail: "Consider a table view toggle for SR users." },
  ],
  tokenIssues: [
    { id: "t1", token: "type.scale", type: "typography", observed: "7 sizes above fold", expected: "5-step scale", note: "Over-populated scale flattens hierarchy.", occurrences: 18 },
    { id: "t2", token: "chart.palette", type: "color", observed: "6 similar hues", expected: "CVD-safe categorical set", note: "Series indistinguishable for CVD users.", occurrences: 6 },
    { id: "t3", token: "color.grid", type: "color", observed: "#E3E3E3 (2.4:1)", expected: "≥ 3:1 non-text contrast", note: "Gridlines below non-text contrast floor.", occurrences: 11 },
    { id: "t4", token: "card.density", type: "spacing", observed: "uniform 16px", expected: "tiered density", note: "No visual priority across KPI cards.", occurrences: 12 },
  ],
  redesign: [
    {
      id: "r1",
      title: "Turn the empty canvas into onboarding",
      summary: "Replace the wall of zeros with a guided, explorable first run.",
      before: ["Empty axes and 0s on load", "No path to value", "Reads as broken"],
      after: ["“Connect a source” focal action", "Sample-data toggle to explore now", "Explanatory skeletons per widget"],
    },
    {
      id: "r2",
      title: "Make every chart readable without colour",
      summary: "Add redundant encodings and a CVD-safe palette.",
      before: ["Six look-alike hues", "Red/green deltas only", "Colour-only legend"],
      after: ["Direct labels + markers", "Arrows and signs on deltas", "Colour-blind-safe categorical set"],
    },
    {
      id: "r3",
      title: "Give the eye a place to land",
      summary: "Tier the grid and tame the type scale so insight comes fast.",
      before: ["Flat 12-card grid", "Seven font sizes", "No hero metric"],
      after: ["Hero row + secondary grid", "5-step modular scale", "Pinnable priority metrics"],
    },
  ],
};

const mobileAudit: Audit = {
  id: "demo-mobile",
  name: "Cadence Fitness",
  screen: "Onboarding — Goal setup (3 of 4)",
  context: "Consumer mobile app, iOS. High install-to-activation drop-off.",
  createdAt: "2026-06-11T18:40:00.000Z",
  scope: ["ux", "ui", "accessibility", "mobile", "conversion"],
  preview: { kind: "mobile-onboarding", accent: "hsl(152 52% 38%)", label: "Goals" },
  overallScore: 67,
  grade: "C−",
  summary:
    "An onboarding flow that asks too much, too early, with touch ergonomics that fight the thumb. The visuals are warm and on-brand, but a key CTA sits in the hardest-to-reach corner, targets fall below the 44px guideline, and the value of each question is never explained. Reducing the ask, moving primary actions into the thumb zone, and motivating each step would lift activation.",
  categoryScores: [
    { category: "ux", score: 66, findings: 3 },
    { category: "ui", score: 74, findings: 2 },
    { category: "accessibility", score: 62, findings: 3 },
    { category: "conversion", score: 64, findings: 2 },
    { category: "mobile", score: 60, findings: 3 },
  ],
  stats: { issues: 13, quickWins: 7, accessibilityScore: 62, estReadingMins: 6 },
  findings: [
    {
      id: "m1",
      category: "mobile",
      severity: "critical",
      title: "Primary “Continue” sits in the top-right, out of the thumb zone",
      location: "Header / nav bar",
      hotspot: { x: 0.86, y: 0.08 },
      observation:
        "The step's main action lives in the top-right corner — the least reachable area for right-handed one-handed use on a large phone.",
      whyItMatters:
        "Onboarding is almost always done one-handed. A primary action outside the natural thumb arc forces a grip-shift on every step, adding friction at the most fragile point of the lifecycle.",
      recommendation:
        "Move the primary CTA to a full-width button pinned to the bottom safe-area. Keep “Back” top-left. Let the thumb do the work.",
      reference: "Laws of UX — Thumb zone / Fitts's Law",
      effort: "small",
      impact: "high",
    },
    {
      id: "m2",
      category: "accessibility",
      severity: "high",
      title: "Goal chips are 32px tall — below the minimum target size",
      location: "Goal selection chips",
      hotspot: { x: 0.5, y: 0.45 },
      observation:
        "Selectable goal chips measure 32×32px with 6px gaps, well under the 44px iOS / 24px WCAG target floor.",
      whyItMatters:
        "Small, tightly-packed targets cause mis-taps — frustrating for everyone and a real barrier for users with motor or dexterity differences.",
      recommendation:
        "Raise chips to ≥44px height, increase spacing to ≥8px, and enlarge the hit area beyond the visible bounds.",
      reference: "WCAG 2.2 — 2.5.8 Target Size (Minimum)",
      effort: "trivial",
      impact: "high",
    },
    {
      id: "m3",
      category: "ux",
      severity: "high",
      title: "Six questions before the user sees any value",
      location: "Whole flow",
      hotspot: { x: 0.5, y: 0.3 },
      observation:
        "The user answers six profiling questions (goal, level, days, equipment, height, weight) before reaching anything resembling a payoff.",
      whyItMatters:
        "Long pre-value forms are the top cause of onboarding abandonment. Each question must earn its place, and right now none are justified to the user.",
      recommendation:
        "Cut to the two questions needed for a first useful plan; defer the rest into the product. Show a tailored preview as soon as possible to reward effort.",
      reference: "NN/g — Onboarding & the value gap",
      effort: "medium",
      impact: "high",
    },
    {
      id: "m4",
      category: "conversion",
      severity: "medium",
      title: "No explanation of why each answer is needed",
      location: "Question subtitles",
      hotspot: { x: 0.5, y: 0.22 },
      observation:
        "Questions are bare (“How many days a week?”) with no rationale or reassurance about how the data is used.",
      whyItMatters:
        "Motivation drops when effort feels arbitrary. A single line connecting the answer to a benefit raises completion and trust.",
      recommendation:
        "Add a one-line “why”: “We'll only schedule workouts on days you choose.” Tie each question to a tangible outcome.",
      reference: "Conversion — Motivation & cost",
      effort: "trivial",
      impact: "medium",
    },
    {
      id: "m5",
      category: "accessibility",
      severity: "high",
      title: "Selected chip state relies on a faint colour shift only",
      location: "Goal chips (selected)",
      hotspot: { x: 0.35, y: 0.45 },
      observation:
        "A selected chip differs from an unselected one by a ~1.3:1 background tint, with no checkmark, border, or text-weight change.",
      whyItMatters:
        "Users can't tell what they've chosen — doubly so for low-vision and CVD users. Selection state is meaning, and meaning can't ride on colour alone.",
      recommendation:
        "Add a checkmark and a stronger border/fill to the selected state, and ensure ≥3:1 non-text contrast against the unselected chip.",
      reference: "WCAG 2.2 — 1.4.1 & 1.4.11",
      effort: "trivial",
      impact: "high",
    },
    {
      id: "m6",
      category: "mobile",
      severity: "medium",
      title: "Progress shows step count but not effort remaining",
      location: "Top progress bar",
      hotspot: { x: 0.5, y: 0.06 },
      observation:
        "“3 of 4” implies one step left, but step 4 contains the longest form. Perceived and actual progress diverge.",
      whyItMatters:
        "A misleading progress signal breaks trust right before the finish line, where it can trigger abandonment after sunk effort.",
      recommendation:
        "Weight the progress bar by remaining fields, or split step 4 so each segment is comparable. Honesty sustains momentum.",
      reference: "NN/g — Progress indicators",
      effort: "small",
      impact: "medium",
    },
    {
      id: "m7",
      category: "ui",
      severity: "medium",
      title: "Body copy overflows the safe area on smaller devices",
      location: "Question subtitle",
      hotspot: { x: 0.5, y: 0.18 },
      observation:
        "On a 4.7\" device the subtitle clips under the notch/status area because layout uses fixed offsets, not safe-area insets.",
      whyItMatters:
        "Content lost behind system UI looks broken and erodes the premium impression a paid app needs from second one.",
      recommendation:
        "Use safe-area-inset-* env() values and test on the smallest supported device. Never hard-code top offsets.",
      reference: "Mobile — Safe areas",
      effort: "small",
      impact: "medium",
    },
    {
      id: "m8",
      category: "ux",
      severity: "low",
      title: "No way to skip optional questions",
      location: "Equipment / height / weight",
      hotspot: { x: 0.5, y: 0.6 },
      observation:
        "Even non-essential questions are required, with no “skip for now”.",
      whyItMatters:
        "Forcing optional input inflates the cost of activation and frustrates users who want to start now and refine later.",
      recommendation:
        "Mark optional steps as skippable with a quiet link; let users complete their profile inside the product.",
      reference: "NN/g — User control",
      effort: "trivial",
      impact: "low",
    },
    {
      id: "m9",
      category: "ui",
      severity: "positive",
      title: "Warm, consistent illustration system",
      location: "Header artwork",
      hotspot: { x: 0.5, y: 0.14 },
      observation:
        "Illustrations share a coherent palette, line weight, and mood that feels distinctly on-brand.",
      whyItMatters:
        "A cohesive illustration system builds memorability and warmth — a genuine asset that differentiates the app.",
      recommendation:
        "Keep it. Ensure illustrations have empty alt text (decorative) so they don't clutter the screen-reader pass.",
      reference: "Brand — Illustration system",
      effort: "trivial",
      impact: "low",
    },
    {
      id: "m10",
      category: "conversion",
      severity: "positive",
      title: "Single, focused question per screen",
      location: "Flow structure",
      hotspot: { x: 0.5, y: 0.4 },
      observation:
        "Each screen asks one thing, reducing cognitive load per step.",
      whyItMatters:
        "One-question-per-screen is a proven mobile pattern that keeps momentum and comprehension high.",
      recommendation:
        "Preserve the structure; just reduce the number of screens and justify each.",
      reference: "Mobile — One thing per screen",
      effort: "trivial",
      impact: "medium",
    },
  ],
  checklist: [
    { id: "k1", label: "Touch targets ≥ 44px", status: "fail", detail: "Goal chips are 32px tall.", wcag: "2.5.8" },
    { id: "k2", label: "Selection state not colour-only", status: "fail", detail: "Selected chip uses faint tint only.", wcag: "1.4.1" },
    { id: "k3", label: "Respects safe-area insets", status: "fail", detail: "Subtitle clips under the notch.", wcag: "1.4.10" },
    { id: "k4", label: "Text contrast ≥ 4.5:1", status: "warn", detail: "Subtitle on tinted header is 4.1:1.", wcag: "1.4.3" },
    { id: "k5", label: "Supports Dynamic Type / scaling", status: "warn", detail: "Layout breaks above 130% text size.", wcag: "1.4.4" },
    { id: "k6", label: "Decorative images hidden from SR", status: "pass", detail: "Illustrations marked decorative." },
    { id: "k7", label: "Focus/selection visible without sight cues", status: "fail", detail: "No icon/border on selected chip.", wcag: "1.4.11" },
    { id: "k8", label: "One primary action per screen", status: "pass", detail: "Each step has a single CTA." },
  ],
  tokenIssues: [
    { id: "t1", token: "target.min", type: "spacing", observed: "32px", expected: "≥ 44px", note: "Chips below minimum target size.", occurrences: 8 },
    { id: "t2", token: "state.selected", type: "color", observed: "1.3:1 tint", expected: "≥ 3:1 + icon", note: "Selected state imperceptible.", occurrences: 8 },
    { id: "t3", token: "layout.safe-area", type: "spacing", observed: "fixed 20px top", expected: "env(safe-area-inset-top)", note: "Ignores device insets.", occurrences: 3 },
    { id: "t4", token: "cta.placement", type: "component", observed: "top-right", expected: "bottom thumb zone", note: "Primary action out of reach.", occurrences: 1 },
  ],
  redesign: [
    {
      id: "r1",
      title: "Put the primary action under the thumb",
      summary: "Bottom-pinned, full-width CTA inside the safe area.",
      before: ["“Continue” top-right", "Grip-shift every step", "Back & next compete up top"],
      after: ["Full-width bottom CTA", "One-handed all the way", "Back stays a quiet top-left"],
    },
    {
      id: "r2",
      title: "Ask less, reward sooner",
      summary: "Two questions to a useful plan; defer the rest into the app.",
      before: ["Six pre-value questions", "No rationale per step", "All questions required"],
      after: ["Two essential questions", "A “why” line on each", "Optional steps skippable"],
    },
    {
      id: "r3",
      title: "Make selection unmistakable",
      summary: "Bigger targets, clear selected state, honest progress.",
      before: ["32px chips, faint selection", "“3 of 4” misleads", "Tap targets crowd"],
      after: ["≥44px chips with checkmarks", "Effort-weighted progress", "Comfortable spacing"],
    },
  ],
};

export const DEMO_AUDITS: Audit[] = [checkoutAudit, dashboardAudit, mobileAudit];

export function getDemoAudit(id: string): Audit | undefined {
  return DEMO_AUDITS.find((a) => a.id === id);
}
