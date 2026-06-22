import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: "grid", end: true },
  { to: "/new", label: "New audit", icon: "plus" },
];

const LENSES = [
  { label: "UX & Usability", icon: "compass" },
  { label: "UI Consistency", icon: "layers" },
  { label: "Accessibility", icon: "accessibility" },
  { label: "Conversion", icon: "target" },
  { label: "Mobile", icon: "smartphone" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5 pb-4">
        <NavLink to="/" onClick={() => setMobileOpen(false)} aria-label="UX Audit Lab — home">
          <Logo />
        </NavLink>
      </div>

      <nav className="px-3" aria-label="Primary">
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-surface-2 text-fg"
                      : "text-muted hover:bg-surface-2 hover:text-fg",
                  )
                }
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 pt-7 pb-2">
        <p className="kicker">Audit lenses</p>
      </div>
      <ul className="space-y-0.5 px-3">
        {LENSES.map((l) => (
          <li
            key={l.label}
            className="flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-1.5 text-[0.8125rem] text-subtle"
          >
            <Icon name={l.icon} size={15} className="text-faint" />
            {l.label}
          </li>
        ))}
      </ul>

      <div className="mt-auto p-4">
        <div className="rounded-[var(--radius-md)] border border-line bg-surface-2 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Icon name="beaker" size={16} className="text-brand" />
            Demo workspace
          </div>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
            Sample audits are preloaded. Run your own — everything stays in your browser.
          </p>
          <Button
            size="sm"
            variant="secondary"
            icon="sparkles"
            className="mt-3 w-full"
            onClick={() => {
              setMobileOpen(false);
              navigate("/new");
            }}
          >
            Start an audit
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-paper">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-line bg-surface lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-surface animate-rise">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-20 glass border-b border-line">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-line text-muted lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="list" size={18} />
            </button>

            <div className="hidden items-center gap-2 text-sm text-subtle sm:flex">
              <Icon name="shield-check" size={15} className="text-positive" />
              <span>WCAG 2.2 · Nielsen-Norman heuristics · Laws of UX</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <a
                href="https://www.w3.org/WAI/WCAG22/quickref/"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex"
              >
                <Icon name="file-text" size={16} />
                Methodology
              </a>
              <ThemeToggle />
              <Button icon="plus" onClick={() => navigate("/new")} className="hidden sm:inline-flex">
                New audit
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
