import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { FalconMark } from "@/components/brand/falcon-mark";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  actions,
  subtitle = "Advisor use · Core–satellite policy",
}: {
  children: ReactNode;
  actions?: ReactNode;
  subtitle?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? "" });

  return (
    <main className="app-shell relative min-h-dvh bg-background text-foreground">
      <header className="border-b border-border/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="flex items-center gap-3">
              <FalconMark />
              <div>
                <p className="font-display text-lg font-medium tracking-tight">
                  Falcon Wealth
                </p>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  {subtitle}
                </p>
              </div>
            </Link>
            <div className="no-print flex flex-wrap items-center gap-2">
              {actions}
              <UserButton />
            </div>
          </div>
          <nav className="no-print flex gap-1">
            <NavChip to="/" label="Dashboard" active={pathname === "/"} />
            <NavChip
              to="/model"
              search={{}}
              label="New proposal"
              active={pathname.startsWith("/model") && !searchStr.includes("proposal=")}
            />
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}

function NavChip({
  to,
  label,
  active,
  search,
}: {
  to: "/" | "/model";
  label: string;
  active: boolean;
  search?: Record<string, never>;
}) {
  return (
    <Link
      to={to}
      search={search}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
