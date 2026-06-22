import type { ReactNode } from "react";
import { useId, useState } from "react";

/** Lightweight, accessible tooltip — appears on hover and keyboard focus. */
export function Tooltip({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      <span
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-xs)] bg-ink px-2 py-1 text-[0.6875rem] font-medium text-ink-contrast shadow-[var(--shadow-md)] transition-opacity duration-150 ${
          open ? "opacity-100" : "opacity-0"
        } ${side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}
      >
        {label}
      </span>
    </span>
  );
}
