<div align="center">

# UX Audit Lab

**Turn any product screen into a structured, consultant-grade UI/UX audit.**

Upload a screenshot or pick a demo screen, choose your review lenses, and get a
prioritized report: usability issues, accessibility findings, design-system drift,
and redesign direction — each with the reasoning behind it.

`React 18` · `TypeScript` · `Vite` · `Tailwind CSS v4` · `Zero backend`

</div>

---

## Why this project stands out (for recruiters)

Most "AI screenshot analyzer" demos look the same: a file input, a spinner, and a
wall of generic bullet points. **UX Audit Lab is deliberately the opposite.** It's
built to demonstrate the rare overlap recruiters actually look for — someone who can
*engineer* a polished frontend **and** *think* like a product designer and
accessibility specialist.

It shows, in one artifact:

| Signal | How it's demonstrated |
| --- | --- |
| **Frontend execution** | Custom design system, light/dark theming, accessible components, sensible state, clean file organization — no UI kit shortcuts. |
| **UX literacy** | Findings are framed as *observation → why it matters → recommended fix*, scored on impact × effort. This is how real audits read. |
| **Accessibility awareness** | A genuine WCAG 2.2 checklist with success-criterion references, plus the app itself is keyboard-navigable, focus-visible, reduced-motion aware, and contrast-checked. |
| **Data presentation** | Score rings, severity distributions, annotated hotspots, a design-token drift table, and a before/after redesign layout. |
| **Design-systems maturity** | One token source of truth (color, type, spacing, radius, elevation) driving every component across both themes. |
| **Product thinking** | A confident upload → analyze → report flow with progressive disclosure, and considered empty / loading / error / success states. |

> The report is intentionally designed to be **screenshot-worthy** — that's the
> moment a portfolio piece earns a second look.

---

## Feature tour

- **Premium upload experience** — drag-and-drop with validation, live preview, and
  five one-click demo screens so a reviewer can see a full report in seconds.
- **Five audit lenses** — UX & Usability, UI Consistency, Accessibility, Conversion
  Clarity, and Mobile Usability. Each applies a different expert framework.
- **Staged analysis** — a transparent, anticipation-building progress sequence
  (reading the frame → heuristics → accessibility → design system → synthesis).
- **The report** (the showpiece):
  - Hero with overall score + grade ring, severity distribution, per-lens scores.
  - **Annotated preview** — numbered, severity-colored hotspot pins that link to
    their finding cards on hover (two-way).
  - **Findings** — expandable cards with severity, location, observation, "why this
    matters", recommended fix, effort/impact, and a heuristic/WCAG reference.
    Filter by severity or lens.
  - **Accessibility** — WCAG 2.2 checklist with pass/review/fail status and criteria.
  - **Design system** — a token-drift table (observed vs. expected, with occurrence
    counts).
  - **Redesign direction** — before/after recommendations with clear hierarchy.
- **Export** — print-to-PDF layout, copy-as-Markdown brief, and download-as-JSON.
- **Saved history** — every audit persists to `localStorage`; nothing is uploaded.
- **Light & dark mode** — full parity, respecting system preference.

---

## Design system

A single token layer in [`src/index.css`](src/index.css) defines color, typography,
spacing, radius, and elevation as CSS variables for both themes, then exposes them to
Tailwind v4 via `@theme inline`. Components reference semantic tokens
(`bg-surface`, `text-muted`, `border-line`, `text-critical`…) rather than raw values,
so theming and consistency are free.

- **Type:** *Newsreader* (editorial display) paired with *Hanken Grotesk* (UI) and
  *JetBrains Mono* (labels/code) — chosen to feel distinctive, not template-default.
- **Color:** warm neutral ramp + a restrained ember brand + a five-step semantic
  severity scale (critical / high / medium / low / strength).
- **Accessibility:** contrast-checked text tokens, a visible `:focus-visible` ring,
  honored `prefers-reduced-motion`, and `role`/`aria` wiring on interactive parts.

---

## Tech & architecture

```
src/
├── components/
│   ├── ui/            # Design-system primitives (Button, Badge, Card, Icon, ScoreRing, Meter…)
│   ├── report/        # Report building blocks (MockScreen, AnnotatedPreview, IssueCard, panels)
│   ├── shell/         # AppShell: sidebar, topbar, responsive drawer
│   └── AuditCard.tsx
├── context/           # ThemeContext, AuditContext (state + localStorage)
├── data/              # Handcrafted demo audits that read like real deliverables
├── lib/               # analyze (mock engine), constants, export, storage, utils
├── pages/             # Dashboard, NewAudit, Analyzing, Report
├── types.ts           # Domain model
└── index.css          # The design system
```

- **No backend.** A curated, heuristics-based mock engine
  ([`src/lib/analyze.ts`](src/lib/analyze.ts)) assembles believable, severity-balanced
  reports from an expert findings library — deliberately structured rather than random.
- **State** lives in two small React contexts; audits persist to `localStorage`.
- **Mock screens** are rendered as lightweight SVG wireframes
  ([`MockScreen.tsx`](src/components/report/MockScreen.tsx)) so the app demos fully
  without shipping copyrighted screenshots.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```

Requires Node 18+. No environment variables, no API keys.

---

## A note on credibility

The demo audits (Northwind checkout, Atlas analytics, Cadence mobile onboarding) are
written as a senior practitioner would write them — citing Nielsen-Norman heuristics,
Laws of UX, Baymard checkout research, and specific WCAG 2.2 success criteria. The
goal isn't to fake an AI; it's to demonstrate the *quality bar* of the analysis a
real product designer would deliver.

See [`PORTFOLIO_SCRIPT.md`](PORTFOLIO_SCRIPT.md) for a ready-to-use interview walkthrough.
