import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { FileDown, Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AdvisorSessionGate } from "@/components/auth/advisor-gate";
import { AccountFields } from "@/components/model/account-fields";
import { AllocationPanel } from "@/components/model/allocation-panel";
import { CorePicker } from "@/components/model/core-picker";
import { DiagnosticsButton, DiagnosticsReport } from "@/components/model/diagnostics-report";
import { PqDownloadButton } from "@/components/model/pq-download";
import { SatellitePanel } from "@/components/model/satellite-panel";
import { ShareDialog } from "@/components/proposals/share-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import {
  buildAllocation,
  visionFundStatus,
  type EquityStep,
  type ModelInput,
  type SatelliteThemeId,
  type SatelliteWeight,
} from "@/lib/portfolio";
import { getProposal, isProposalId, saveProposal } from "@/lib/proposals";

const rootRoute = getRouteApi("__root__");

type ModelSearch = { proposal?: string };

export const Route = createFileRoute("/model")({
  validateSearch: (search: Record<string, unknown>): ModelSearch => {
    if (isProposalId(search.proposal)) return { proposal: search.proposal };
    return {};
  },
  component: ModelPage,
});

function ModelPage() {
  const { advisorSession } = rootRoute.useRouteContext();
  return (
    <AdvisorSessionGate ssrEmail={advisorSession?.email}>
      <ModelApp />
    </AdvisorSessionGate>
  );
}

function emptyInput(): ModelInput {
  return {
    clientName: "",
    accountValue: 1_000_000,
    coreEquity: 60,
    satelliteOn: false,
    satelliteWeight: null,
    satelliteSplit: false,
    satelliteTheme: null,
    satelliteThemeB: null,
  };
}

function ModelApp() {
  const { proposal: proposalId } = Route.useSearch();
  const navigate = useNavigate({ from: "/model" });
  const user = useCurrentUser();
  const advisorName = user?.displayName || user?.primaryEmail || "Advisor";

  const [clientName, setClientName] = useState("");
  const [accountValue, setAccountValue] = useState<number | null>(1_000_000);
  const [coreEquity, setCoreEquity] = useState<EquityStep>(60);
  const [satelliteOn, setSatelliteOn] = useState(false);
  const [satelliteWeight, setSatelliteWeight] = useState<SatelliteWeight | null>(null);
  const [satelliteSplit, setSatelliteSplit] = useState(false);
  const [satelliteTheme, setSatelliteTheme] = useState<SatelliteThemeId | null>(null);
  const [satelliteThemeB, setSatelliteThemeB] = useState<SatelliteThemeId | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(proposalId ?? null);
  const [saving, setSaving] = useState(false);
  const [shareMode, setShareMode] = useState<"export" | "email" | null>(null);
  const [loaded, setLoaded] = useState(!proposalId);

  const loadedId = useRef<string | null>(proposalId ?? null);

  const input: ModelInput = useMemo(
    () => ({
      clientName,
      accountValue,
      coreEquity,
      satelliteOn,
      satelliteWeight,
      satelliteSplit,
      satelliteTheme,
      satelliteThemeB,
    }),
    [clientName, accountValue, coreEquity, satelliteOn, satelliteWeight, satelliteSplit, satelliteTheme, satelliteThemeB],
  );

  const allocation = useMemo(() => buildAllocation(input), [input]);
  const vision = useMemo(() => visionFundStatus(input), [input]);
  const diagnosticsReady = allocation.pendingMessage === null;
  const canSave = Boolean(clientName.trim()) && diagnosticsReady;

  useEffect(() => {
    if (!proposalId) {
      if (loadedId.current) {
        applyInput(emptyInput());
        setDiagnosticsOpen(false);
        setSavedId(null);
      }
      loadedId.current = null;
      setLoaded(true);
      return;
    }
    let cancelled = false;
    setLoaded(false);
    loadedId.current = proposalId;
    void getProposal({ data: proposalId })
      .then((record) => {
        if (cancelled) return;
        applyInput(record.snapshot);
        setSavedId(record.id);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        toast("That proposal could not be opened.");
        loadedId.current = null;
        setSavedId(null);
        setLoaded(true);
        void navigate({ search: {}, replace: true });
      });
    return () => {
      cancelled = true;
    };
  }, [proposalId, navigate]);

  function applyInput(next: ModelInput) {
    setClientName(next.clientName);
    setAccountValue(next.accountValue);
    setCoreEquity(next.coreEquity);
    setSatelliteOn(next.satelliteOn);
    setSatelliteWeight(next.satelliteWeight);
    setSatelliteSplit(next.satelliteSplit);
    setSatelliteTheme(next.satelliteTheme);
    setSatelliteThemeB(next.satelliteThemeB);
  }

  function reset() {
    applyInput(emptyInput());
    setDiagnosticsOpen(false);
    setSavedId(null);
    void navigate({ search: {} });
  }

  const closeDiagnostics = useCallback(() => setDiagnosticsOpen(false), []);

  function handleSatelliteToggle(on: boolean) {
    setSatelliteOn(on);
    if (!on) {
      setSatelliteWeight(null);
      setSatelliteSplit(false);
      setSatelliteTheme(null);
      setSatelliteThemeB(null);
    }
  }

  function handleSatelliteWeight(weight: SatelliteWeight) {
    setSatelliteWeight(weight);
    if (weight === 10) {
      setSatelliteSplit(false);
      setSatelliteThemeB(null);
    }
  }

  function handleSatelliteSplit(split: boolean) {
    setSatelliteSplit(split);
    if (!split) setSatelliteThemeB(null);
  }

  function handleTheme(theme: SatelliteThemeId | null) {
    setSatelliteTheme(theme);
    if (theme && theme === satelliteThemeB) setSatelliteThemeB(null);
  }

  async function save() {
    if (saving) return;
    if (!canSave) {
      toast(clientName.trim() ? allocation.pendingMessage ?? "Finish the model first." : "Add a client name to save.");
      return;
    }
    setSaving(true);
    try {
      const row = await saveProposal({ data: { id: savedId, input } });
      loadedId.current = row.id;
      setSavedId(row.id);
      toast(`Saved under ${row.clientName}`);
      void navigate({ search: { proposal: row.id } });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      subtitle={savedId ? "Editing saved proposal" : "New proposal"}
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={reset} disabled={!loaded}>
            Reset
          </Button>
          <PqDownloadButton
            clientName={clientName}
            advisorName={advisorName}
            accountValue={accountValue}
          />
          <Button
            variant="ghost"
            size="sm"
            disabled={!diagnosticsReady || !loaded}
            title={diagnosticsReady ? "Export proposal" : allocation.pendingMessage ?? "Finish the model first."}
            onClick={() => setShareMode("export")}
          >
            <FileDown />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!diagnosticsReady || !loaded}
            title={diagnosticsReady ? "Email proposal" : allocation.pendingMessage ?? "Finish the model first."}
            onClick={() => setShareMode("email")}
          >
            <Mail />
            Email
          </Button>
          <DiagnosticsButton ready={diagnosticsReady && loaded} onClick={() => setDiagnosticsOpen(true)} />
          <Button
            size="sm"
            disabled={!canSave || saving || !loaded}
            title={
              !clientName.trim()
                ? "Add a client name to save."
                : !diagnosticsReady
                  ? allocation.pendingMessage ?? "Finish the model first."
                  : undefined
            }
            onClick={() => void save()}
          >
            <Save />
            {saving ? "Saving…" : savedId ? "Save changes" : "Save proposal"}
          </Button>
        </>
      }
    >
      {!loaded ? (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="h-40 animate-pulse rounded-xl bg-secondary" />
        </div>
      ) : (
        <div className="mx-auto grid min-w-0 max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-5 lg:items-stretch lg:py-8">
          <div className="model-form flex min-w-0 flex-col gap-5 lg:col-span-3">
            <Card>
              <CardHeader>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Step 01
                </p>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Client name is required to save. Account value is used for
                  dollar weights and the Falcon Vision Fund I minimum test.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountFields
                  clientName={clientName}
                  accountValue={accountValue}
                  onClientName={setClientName}
                  onAccountValue={setAccountValue}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Step 02 · Core model
                </p>
                <CardTitle>Select the core mix</CardTitle>
                <CardDescription>
                  Strategic equity / fixed-income policy, in 5% steps from 100/0
                  to 0/100. Underlying fund weights are the Falcon Core Model.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CorePicker equity={coreEquity} onSelect={setCoreEquity} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Step 03 · Satellite
                </p>
                <CardTitle>Elect a satellite overlay</CardTitle>
                <CardDescription>
                  A separate sleeve, distinct from the core. If elected, choose
                  10% or 20%. A 20% overlay can be one theme or two 10% themes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SatellitePanel
                  satelliteOn={satelliteOn}
                  satelliteWeight={satelliteWeight}
                  satelliteSplit={satelliteSplit}
                  satelliteTheme={satelliteTheme}
                  satelliteThemeB={satelliteThemeB}
                  onToggle={handleSatelliteToggle}
                  onWeight={handleSatelliteWeight}
                  onSplit={handleSatelliteSplit}
                  onTheme={handleTheme}
                  onThemeB={setSatelliteThemeB}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="flex min-w-0 flex-col lg:col-span-2 lg:h-full">
            <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                {clientName.trim() ? (
                  <>
                    Prepared for{" "}
                    <span className="font-medium text-foreground">{clientName.trim()}</span>
                  </>
                ) : (
                  "Add a client name to save this proposal to your book."
                )}
                {advisorName ? (
                  <span className="mt-1 block text-xs">
                    Advisor {advisorName}
                  </span>
                ) : null}
              </p>
              <AllocationPanel
                input={input}
                allocation={allocation}
                vision={vision}
                diagnosticsReady={diagnosticsReady}
                onDiagnostics={() => setDiagnosticsOpen(true)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs leading-relaxed text-muted-foreground sm:px-6">
        For advisor use only. Model policy weights are not a recommendation or an
        offer to sell securities. Saved proposals are visible only to the signed-in
        advisor. Core holdings follow the Falcon Core Model as of August 1, 2026.
      </footer>
      <DiagnosticsReport
        open={diagnosticsOpen}
        onClose={closeDiagnostics}
        input={input}
        allocation={allocation}
        vision={vision}
        advisorName={advisorName}
      />
      {shareMode ? (
        <ShareDialog
          open
          mode={shareMode}
          input={input}
          advisorName={advisorName}
          allowPrint
          onClose={() => setShareMode(null)}
        />
      ) : null}
    </AppShell>
  );
}
