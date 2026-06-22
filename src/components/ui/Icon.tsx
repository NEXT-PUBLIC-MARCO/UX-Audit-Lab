import type { SVGProps } from "react";

/* Lightweight inline icon set (Lucide-style geometry, no dependency). */

const PATHS: Record<string, string> = {
  compass: "M12 2a10 10 0 100 20 10 10 0 000-20zM16.2 7.8l-2 5.4-5.4 2 2-5.4 5.4-2z",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  accessibility: "M12 2a2 2 0 100 4 2 2 0 000-4zM21 9l-7 1v4l2 7M3 9l7 1m0 0v4l-2 7",
  target: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z",
  smartphone: "M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3",
  plus: "M12 5v14M5 12h14",
  upload: "M12 16V4M7 9l5-5 5 5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2",
  image: "M4 4h16v16H4zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 16l-5-5L5 21",
  check: "M5 12l5 5L20 6",
  "check-circle": "M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z",
  x: "M6 6l12 12M18 6L6 18",
  "x-circle": "M12 2a10 10 0 100 20 10 10 0 000-20zM15 9l-6 6M9 9l6 6",
  alert: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  octagon: "M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9zM12 8v4m0 4h.01",
  info: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 11v5M12 8h.01",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-left": "M19 12H5M11 18l-6-6 6-6",
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  sun: "M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z",
  download: "M12 3v12M8 11l4 4 4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2",
  sparkles: "M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15l-1.8-4.7L5.5 9l4.7-1.8zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8zM5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4z",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-right": "M9 6l6 6-6 6",
  "file-text": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13h6M9 17h6M9 9h1",
  trash: "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  gauge: "M12 14a2 2 0 100-4 2 2 0 000 4zM13.4 11.6 19 6M3.5 16a9 9 0 1117 0",
  zap: "M13 2 4 14h7l-1 8 9-12h-7z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  grid: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  refresh: "M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z",
  shield: "M12 2l8 3v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V5z",
  "shield-check": "M12 2l8 3v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V5zM9 12l2 2 4-4",
  flag: "M4 21V4a1 1 0 011-1h10l-1 4 1 4H5",
  ruler: "M16 2 22 8 8 22 2 16zM7 11l2 2M11 7l2 2M15 9l-1 1",
  type: "M4 7V5h16v2M9 19h6M12 5v14",
  palette: "M12 2a10 10 0 100 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-.8.7-1.5 1.5-1.5H17a5 5 0 005-5c0-5-4.5-9-10-9zM7.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  "arrow-up": "M12 19V5M5 12l7-7 7 7",
  "arrow-down": "M12 5v14M5 12l7 7 7-7",
  minus: "M5 12h14",
  star: "M12 2l3 6.5 7 .9-5 4.8 1.2 7L12 18l-6.4 3.2L7 14.2l-5-4.8 7-.9z",
  filter: "M3 4h18l-7 9v6l-4 2v-8z",
  copy: "M9 9h11v11H9zM5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1",
  keyboard: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",
  beaker: "M9 3h6M10 3v6L5 19a2 2 0 002 3h10a2 2 0 002-3l-5-10V3M7.5 14h9",
  printer: "M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2M8 14h8v7H8z",
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: keyof typeof PATHS | string;
  size?: number;
  /** filled circle dot variant for status */
}

export function Icon({ name, size = 18, strokeWidth = 1.75, className, ...rest }: IconProps & { strokeWidth?: number }) {
  const d = PATHS[name] ?? PATHS.info;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {d.split(/(?=M)/).map((seg, i) => (
        <path key={i} d={seg} />
      ))}
    </svg>
  );
}
