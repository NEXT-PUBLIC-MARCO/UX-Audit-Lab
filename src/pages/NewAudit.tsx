import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { MockScreen } from "@/components/report/MockScreen";
import { CATEGORY_LIST } from "@/lib/constants";
import type { AuditCategoryId, PreviewSpec } from "@/types";
import { cn } from "@/lib/utils";

interface DemoTemplate {
  kind: PreviewSpec["kind"];
  name: string;
  screen: string;
}

const TEMPLATES: DemoTemplate[] = [
  { kind: "checkout", name: "E-commerce", screen: "Checkout — Payment" },
  { kind: "dashboard", name: "Analytics SaaS", screen: "Workspace — Overview" },
  { kind: "mobile-onboarding", name: "Mobile app", screen: "Onboarding — Step 3" },
  { kind: "pricing", name: "Marketing site", screen: "Pricing page" },
  { kind: "settings", name: "Web app", screen: "Account — Settings" },
];

const MAX_MB = 8;

export function NewAudit() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [template, setTemplate] = useState<PreviewSpec["kind"] | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [screen, setScreen] = useState("");
  const [context, setContext] = useState("");
  const [scope, setScope] = useState<AuditCategoryId[]>(["ux", "ui", "accessibility"]);

  const readFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image. Upload a PNG, JPG, or WebP screenshot.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That image is over ${MAX_MB}MB. Try a smaller export.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setTemplate(null);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const toggleScope = (id: AuditCategoryId) =>
    setScope((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const hasSource = Boolean(image || template);
  const canSubmit = hasSource && scope.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const tmpl = TEMPLATES.find((t) => t.kind === template);
    navigate("/analyzing", {
      state: {
        input: {
          name: name || tmpl?.name || "Untitled product",
          screen: screen || tmpl?.screen || "Reviewed screen",
          context,
          scope,
          previewKind: template ?? "dashboard",
        },
        imageDataUrl: image ?? undefined,
      },
    });
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8">
        <p className="kicker mb-2">New audit</p>
        <h1 className="text-3xl sm:text-4xl">Set up your review</h1>
        <p className="measure mt-2 text-pretty text-muted">
          Add a screen, choose the lenses you care about, and we'll generate a structured
          report. Everything runs locally — your images never leave the browser.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: upload + scope */}
        <div className="space-y-6">
          {/* Dropzone */}
          <Card>
            <SectionHeading
              kicker="Step 1"
              title="Add a screen"
              description="Drop a screenshot, or pick a demo screen to explore the report instantly."
            />

            {image ? (
              <figure className="relative overflow-hidden rounded-[var(--radius-md)] border border-line">
                <img src={image} alt="Uploaded screen preview" className="max-h-[340px] w-full object-contain bg-surface-2" />
                <button
                  onClick={() => setImage(null)}
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-sm)] backdrop-blur transition-colors hover:bg-surface"
                >
                  <Icon name="trash" size={14} /> Remove
                </button>
              </figure>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  "relative grid place-items-center rounded-[var(--radius-md)] border-2 border-dashed px-6 py-12 text-center transition-colors",
                  dragging ? "border-brand bg-brand-soft" : "border-line-strong bg-surface-2/50",
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
                  id="file-upload"
                />
                <div className="grid h-14 w-14 place-items-center rounded-[var(--radius-lg)] border border-line bg-surface text-brand shadow-[var(--shadow-sm)]">
                  <Icon name="upload" size={26} />
                </div>
                <p className="mt-4 text-base font-medium">
                  Drag &amp; drop a screenshot
                </p>
                <p className="mt-1 text-sm text-muted">
                  PNG, JPG, or WebP — up to {MAX_MB}MB
                </p>
                <Button
                  className="mt-5"
                  variant="secondary"
                  icon="image"
                  onClick={() => inputRef.current?.click()}
                >
                  Browse files
                </Button>
                {error && (
                  <p role="alert" className="mt-4 inline-flex items-center gap-1.5 text-sm text-critical">
                    <Icon name="alert" size={15} /> {error}
                  </p>
                )}
              </div>
            )}

            {/* Demo templates */}
            <div className="mt-5">
              <p className="kicker mb-3">Or try a demo screen</p>
              <div className="flex flex-wrap gap-2.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.kind}
                    onClick={() => {
                      setTemplate(t.kind);
                      setImage(null);
                      setError(null);
                      if (!name) setName(t.name);
                      if (!screen) setScreen(t.screen);
                    }}
                    className={cn(
                      "group flex items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2 text-sm transition-colors",
                      template === t.kind
                        ? "border-brand bg-brand-soft text-fg"
                        : "border-line text-muted hover:border-line-strong hover:text-fg",
                    )}
                  >
                    <span className="h-8 w-12 overflow-hidden rounded border border-line">
                      <MockScreen spec={{ kind: t.kind, accent: "hsl(var(--brand))", label: t.screen }} className="h-full w-full" />
                    </span>
                    {t.name}
                    {template === t.kind && <Icon name="check" size={14} className="text-brand" />}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Scope */}
          <Card>
            <SectionHeading
              kicker="Step 2"
              title="Choose audit lenses"
              description="Each lens applies a different expert framework. Pick as many as apply."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORY_LIST.map((c) => {
                const active = scope.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleScope(c.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-start gap-3 rounded-[var(--radius-md)] border p-4 text-left transition-all",
                      active
                        ? "border-brand/40 bg-brand-soft/60 shadow-[var(--shadow-sm)]"
                        : "border-line hover:border-line-strong hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] transition-colors",
                        active ? "bg-brand text-brand-contrast" : "bg-surface-2 text-muted",
                      )}
                    >
                      <Icon name={c.icon} size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{c.label}</span>
                        {active && <Icon name="check-circle" size={15} className="text-brand" />}
                      </span>
                      <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">
                        {c.blurb}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {scope.length === 0 && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-high">
                <Icon name="info" size={15} /> Select at least one lens to continue.
              </p>
            )}
          </Card>
        </div>

        {/* Right: details + submit (sticky) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <SectionHeading kicker="Step 3" title="Add context" />
            <div className="space-y-4">
              <Field label="Product name" hint="e.g. Northwind Commerce">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product or company"
                  className="field"
                />
              </Field>
              <Field label="Screen or flow" hint="e.g. Checkout — Payment step">
                <input
                  value={screen}
                  onChange={(e) => setScreen(e.target.value)}
                  placeholder="What are we reviewing?"
                  className="field"
                />
              </Field>
              <Field label="Context" hint="Optional — goals, audience, known problems">
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                  placeholder="e.g. B2C checkout, desktop. Drop-off spikes here."
                  className="field resize-none"
                />
              </Field>
            </div>

            <div className="mt-5 rounded-[var(--radius-md)] border border-line bg-surface-2 p-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Lenses selected</span>
                <span className="font-medium">{scope.length} / 5</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {scope.length ? (
                  scope.map((s) => (
                    <Badge key={s} tone="brand">
                      {CATEGORY_LIST.find((c) => c.id === s)?.short}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-subtle">None yet</span>
                )}
              </div>
            </div>

            <Button
              size="lg"
              icon="sparkles"
              className="mt-5 w-full"
              disabled={!canSubmit}
              onClick={submit}
            >
              Generate audit
            </Button>
            {!hasSource && (
              <p className="mt-2.5 text-center text-xs text-subtle">
                Add a screenshot or pick a demo screen to begin.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-[0.7rem] text-subtle">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
