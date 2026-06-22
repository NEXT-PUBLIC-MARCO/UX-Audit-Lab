# Portfolio interview script — UX Audit Lab

A tight, repeatable walkthrough for portfolio reviews and interviews. Times are
guidance for a ~5–7 minute demo; trim the deep-dive for shorter slots.

---

## 0 · The one-liner (10s)

> "UX Audit Lab turns any product screen into a structured, consultant-grade UI/UX
> audit. I built it to show I can do both halves of the design-engineering role —
> ship a polished, accessible frontend, *and* produce the kind of analysis a senior
> product designer would actually deliver."

---

## 1 · Frame the problem (30s)

> "Design feedback is usually subjective and chaotic — a Slack thread of opinions.
> The hard part isn't having opinions; it's turning them into something
> *prioritized, defensible, and actionable*. So I designed a product around a
> rigorous structure: every finding is observation → why it matters → recommended
> fix, scored on impact and effort. That structure is the actual product."

*Avoid:* calling it an "AI screenshot analyzer." Position it as a structured audit tool.

---

## 2 · The flow (90s) — drive the happy path

1. **Dashboard.** "History persists locally, with at-a-glance scores and severity."
2. **New audit.** "Premium upload — drag-and-drop with validation and a live preview.
   For the demo I'll pick a demo screen so we go straight to a full report." Pick one.
3. **Choose lenses.** "Five lenses, each a different expert framework — usability,
   UI consistency, accessibility, conversion, mobile. I'll keep three."
4. **Analyzing.** "A transparent, staged sequence — it sets expectations instead of a
   black-box spinner, and it names the frameworks being applied."
5. **Report.** Pause here. "This is the screen I designed to be screenshot-worthy."

---

## 3 · The report — what to point at (120s)

- **Hero:** "Overall score and grade, a severity distribution, and per-lens scores —
  the executive summary a stakeholder needs in five seconds."
- **Annotated preview:** "Numbered, severity-colored pins map to findings. Hover a
  pin and its card highlights — and vice versa. That two-way link is what makes a
  long report navigable."
- **A finding card:** expand a *critical* one. "Notice the anatomy — severity,
  location, the observation, the *why it matters* argument, the concrete fix, and an
  effort/impact read plus a WCAG or heuristic reference. That last line is the
  credibility signal."
- **Filters:** "Filter by severity or lens — progressive disclosure so the report
  scales from 4 findings to 40."
- **Accessibility tab:** "A real WCAG 2.2 checklist with success-criterion numbers,
  not vibes."
- **Design system tab:** "Token drift — observed vs. expected, with occurrence
  counts. This is the bridge between design critique and engineering work."
- **Redesign direction:** "Before/after, with hierarchy — the part that turns a
  critique into a plan."
- **Export:** "Print-to-PDF, copy-as-Markdown, or JSON — because a report nobody can
  share is worthless."

---

## 4 · The engineering story (60s)

> "No backend — it's a focused frontend piece. The thing I'm proudest of is the
> design system: one token layer in CSS variables drives color, type, spacing,
> radius, and elevation across light and dark mode, exposed to Tailwind v4 so every
> component speaks in semantic tokens like `bg-surface` and `text-critical`. Theming
> and consistency come for free.
>
> The analysis engine is a curated heuristics library, not randomness — findings are
> severity-balanced and scored, so generated reports read like real deliverables.
> State is two small React contexts with `localStorage` persistence. The mock
> 'screenshots' are SVG wireframes so the whole thing demos without shipping anyone's
> copyrighted UI."

---

## 5 · Accessibility, practiced not preached (30s)

> "An accessibility audit tool has to be accessible itself. It's fully keyboard
> navigable with a visible focus ring, honors `prefers-reduced-motion`, uses semantic
> roles and `aria` on the interactive parts, and the color tokens are contrast-checked
> in both themes. I'll tab through it to show you." *(Then actually tab through it.)*

---

## 6 · If they push — answers ready

- **"Is the analysis real AI?"** "The engine is a deterministic heuristics library by
  design — the point of this piece is the *product and engineering*, and demonstrating
  the quality bar of the analysis. Swapping in a vision model is a clean interface
  boundary: `analyze()` in one file returns the same typed `Audit` shape."
- **"What would you build next?"** "Real image analysis behind the same `Audit`
  contract; multi-screen flow audits; shareable report links; and team commenting on
  findings."
- **"Hardest part?"** "Making a dense report feel calm. The win was progressive
  disclosure plus the annotated-pin ↔ card linking, so volume never becomes chaos."
- **"Why these fonts/colors?"** "I avoided the default template look on purpose —
  an editorial serif paired with a clean grotesk, and a restrained ember-on-ink
  palette, so it reads as intentional and premium."

---

## 7 · Close (10s)

> "So: a credible, premium tool that turns subjective design feedback into structured,
> high-value analysis — and proves I can sit between design and engineering and speak
> both languages."
