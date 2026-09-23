import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router";
import { FileDown, Mail, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AdvisorSessionGate } from "@/components/auth/advisor-gate";
import { PqDownloadButton } from "@/components/model/pq-download";
import { ShareDialog } from "@/components/proposals/share-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { deleteProposal, getProposal, listProposals, type ProposalListItem } from "@/lib/proposals";
import type { ModelInput } from "@/lib/portfolio";

const rootRoute = getRouteApi("__root__");

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const { advisorSession } = rootRoute.useRouteContext();
  return (
    <AdvisorSessionGate ssrEmail={advisorSession?.email}>
      <Dashboard />
    </AdvisorSessionGate>
  );
}

function Dashboard() {
  const user = useCurrentUser();
  const advisorName = user?.displayName || user?.primaryEmail || "Advisor";
  const [rows, setRows] = useState<ProposalListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [share, setShare] = useState<{ mode: "export" | "email"; input: ModelInput; advisorName: string } | null>(
    null,
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    void listProposals()
      .then((list) => {
        setRows(list);
        setError(null);
      })
      .catch((err: unknown) => {
        setRows([]);
        setError(err instanceof Error ? err.message : "Could not load proposals.");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function openShare(id: string, mode: "export" | "email") {
    setBusyId(id);
    try {
      const record = await getProposal({ data: id });
      setShare({ mode, input: record.snapshot, advisorName: record.advisorName });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not open proposal.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string, clientName: string) {
    if (!window.confirm(`Delete the proposal for ${clientName}?`)) return;
    setBusyId(id);
    try {
      await deleteProposal({ data: id });
      setRows((prev) => (prev ?? []).filter((row) => row.id !== id));
      toast("Proposal deleted");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setBusyId(null);
    }
  }

  const countLabel = useMemo(() => {
    if (!rows) return "Loading proposals";
    if (rows.length === 1) return "1 saved proposal";
    return `${rows.length} saved proposals`;
  }, [rows]);

  return (
    <AppShell
      subtitle="Saved proposals"
      actions={
        <>
          <PqDownloadButton advisorName={advisorName} />
          <Button asChild size="sm">
            <Link to="/model" search={{}}>
              <Plus />
              New proposal
            </Link>
          </Button>
        </>
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Book
          </p>
          <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Client proposals
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {countLabel}
            {user?.displayName || user?.primaryEmail
              ? ` · signed in as ${advisorName}`
              : ""}
          </p>
        </div>

        {error ? (
          <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
        ) : null}

        {rows === null ? (
          <div className="h-48 animate-pulse rounded-xl bg-secondary" />
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:p-8">
              <div>
                <p className="font-display text-2xl font-medium tracking-tight">No proposals yet</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Build a core–satellite mix, save it under the household name, then
                  export or email it from this book.
                </p>
              </div>
              <Button asChild>
                <Link to="/model" search={{}}>
                  <Plus />
                  Build a proposal
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-xl bg-card shadow-card md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Advisor</th>
                    <th className="px-5 py-3 font-medium">Portfolio</th>
                    <th className="px-5 py-3 font-medium">Updated</th>
                    <th className="px-5 py-3 font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-border/60">
                      <td className="px-5 py-3.5">
                        <Link
                          to="/model"
                          search={{ proposal: row.id }}
                          className="font-medium hover:underline"
                        >
                          {row.clientName}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        <span className="block text-foreground">{row.advisorName}</span>
                        <span className="text-xs">{row.advisorEmail}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="block">{row.policyTitle}</span>
                        <span className="font-medium tabular-nums text-muted-foreground">
                          {row.policyCode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                        {formatUpdated(row.updatedAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <RowActions
                          busy={busyId === row.id}
                          onExport={() => void openShare(row.id, "export")}
                          onEmail={() => void openShare(row.id, "email")}
                          onDelete={() => void remove(row.id, row.clientName)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="flex flex-col gap-3 md:hidden">
              {rows.map((row) => (
                <li key={row.id}>
                  <Card>
                    <CardContent className="flex flex-col gap-3 p-4">
                      <div>
                        <Link
                          to="/model"
                          search={{ proposal: row.id }}
                          className="font-medium hover:underline"
                        >
                          {row.clientName}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Advisor {row.advisorName}
                        </p>
                        <p className="mt-1 text-sm">
                          {row.policyTitle}
                          <span className="mt-0.5 block font-medium tabular-nums text-muted-foreground">
                            {row.policyCode}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatUpdated(row.updatedAt)}
                        </p>
                      </div>
                      <RowActions
                        busy={busyId === row.id}
                        onExport={() => void openShare(row.id, "export")}
                        onEmail={() => void openShare(row.id, "email")}
                        onDelete={() => void remove(row.id, row.clientName)}
                      />
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {share ? (
        <ShareDialog
          open
          mode={share.mode}
          input={share.input}
          advisorName={share.advisorName}
          onClose={() => setShare(null)}
        />
      ) : null}
    </AppShell>
  );
}

function RowActions({
  busy,
  onExport,
  onEmail,
  onDelete,
}: {
  busy: boolean;
  onExport: () => void;
  onEmail: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <Button variant="ghost" size="sm" disabled={busy} onClick={onExport}>
        <FileDown />
        Export
      </Button>
      <Button variant="ghost" size="sm" disabled={busy} onClick={onEmail}>
        <Mail />
        Email
      </Button>
      <Button variant="ghost" size="sm" disabled={busy} onClick={onDelete} aria-label="Delete proposal">
        <Trash2 />
      </Button>
    </div>
  );
}

function formatUpdated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
