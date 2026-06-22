import type { Severity } from "@/types";

/** Tiny className combiner (no dependency needed). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.round((now - then) / 1000);
  const map: Array<[number, string]> = [
    [60, "s"],
    [3600, "m"],
    [86400, "h"],
    [604800, "d"],
  ];
  if (diff < 60) return "just now";
  for (let i = 1; i < map.length; i++) {
    const [limit, unit] = map[i];
    if (diff < limit) {
      const prev = map[i - 1][0];
      return `${Math.floor(diff / prev)}${unit} ago`;
    }
  }
  return `${Math.floor(diff / 604800)}w ago`;
}

export function gradeFromScore(score: number): string {
  if (score >= 93) return "A";
  if (score >= 90) return "A−";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B−";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C−";
  if (score >= 60) return "D";
  return "F";
}

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  positive: 4,
};

export function sortBySeverity<T extends { severity: Severity }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
}

/** Generate a stable-ish id without external deps. */
export function makeId(prefix = "id"): string {
  const rand = Math.floor(performance.now() * 1000) % 1_000_000;
  return `${prefix}_${rand.toString(36)}${(globalThis.crypto?.randomUUID?.() ?? "").slice(0, 4)}`;
}
