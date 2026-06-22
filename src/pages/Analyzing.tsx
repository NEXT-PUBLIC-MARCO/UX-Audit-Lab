import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Meter } from "@/components/ui/Meter";
import { ANALYSIS_STAGES } from "@/lib/constants";
import { analyze, type AnalyzeInput } from "@/lib/analyze";
import { useAudits } from "@/context/AuditContext";
import { cn } from "@/lib/utils";

interface NavState {
  input?: AnalyzeInput;
  imageDataUrl?: string;
}

const STAGE_MS = 720;

export function Analyzing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAudit, setPreviewImage } = useAudits();
  const state = (location.state ?? {}) as NavState;

  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!state.input) {
      navigate("/new", { replace: true });
      return;
    }

    const input = state.input;
    const timers: number[] = [];

    ANALYSIS_STAGES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setStage(i + 1), STAGE_MS * (i + 1)),
      );
    });

    timers.push(
      window.setTimeout(() => {
        const audit = analyze(input);
        if (state.imageDataUrl) {
          setPreviewImage(audit.id, state.imageDataUrl);
        }
        addAudit(audit);
        navigate(`/audit/${audit.id}`, { replace: true });
      }, STAGE_MS * (ANALYSIS_STAGES.length + 1)),
    );

    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.round((stage / ANALYSIS_STAGES.length) * 100);

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center">
      <Card className="w-full bg-grid">
        <div className="mb-6 flex items-center justify-between">
          <Logo showWordmark={false} />
          <span className="kicker">Analysing</span>
        </div>

        <h1 className="text-2xl">Reviewing your screen</h1>
        <p className="mt-1.5 text-sm text-muted">
          Applying expert frameworks and assembling a structured report.
        </p>

        <div className="mt-6">
          <Meter value={progress} />
          <div className="mt-2 flex justify-between text-xs text-subtle">
            <span>{progress}% complete</span>
            <span>{state.input?.scope.length ?? 0} lenses</span>
          </div>
        </div>

        <ol className="mt-7 space-y-1">
          {ANALYSIS_STAGES.map((s, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <li
                key={s.id}
                className={cn(
                  "flex items-start gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors",
                  active && "bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors",
                    done
                      ? "border-positive bg-positive text-white"
                      : active
                        ? "border-brand text-brand"
                        : "border-line text-faint",
                  )}
                >
                  {done ? (
                    <Icon name="check" size={13} strokeWidth={2.5} />
                  ) : active ? (
                    <Icon name="refresh" size={13} className="animate-spin-slow" />
                  ) : (
                    <span className="text-[0.65rem] font-medium">{i + 1}</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-sm font-medium", !done && !active && "text-subtle")}>
                    {s.label}
                  </span>
                  <span className="block text-[0.8125rem] text-muted">{s.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
