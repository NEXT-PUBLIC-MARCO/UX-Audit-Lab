import type { Audit } from "@/types";
import { DEMO_AUDITS } from "@/data/audits";

const KEY = "uxauditlab.audits.v1";
const THEME_KEY = "uxauditlab.theme.v1";

/** Audits are stored without their (potentially large) preview image data. */
export function loadAudits(): Audit[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEMO_AUDITS;
    const parsed = JSON.parse(raw) as Audit[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEMO_AUDITS;
    return parsed;
  } catch {
    return DEMO_AUDITS;
  }
}

export function saveAudits(audits: Audit[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(audits));
  } catch {
    /* storage may be full or unavailable — fail quietly */
  }
}

export function resetAudits(): Audit[] {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return DEMO_AUDITS;
}

export type ThemePref = "light" | "dark";

export function loadTheme(): ThemePref {
  try {
    const stored = localStorage.getItem(THEME_KEY) as ThemePref | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function saveTheme(theme: ThemePref): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}
