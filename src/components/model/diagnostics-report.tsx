import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Copy, Download, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FalconMark } from "@/components/brand/falcon-mark";
import {
  buildDiagnostics,
  diagnosticsCopy,
  type Diagnostics,
  type FactorBar,
  type InvestorVoice,
  type NamedShare,
  type StyleCell,
} from "@/lib/diagnostics";
import {
  formatExcess,
  formatReturn,
  type TrailingRow,
} from "@/lib/trailing-returns";
import {
  CORE_AS_OF,
  formatEr,
  formatPct,
  formatUsd,
  sleeveColor,
  type Allocation,
  type HoldingGroup,
  type ModelInput,
  type VisionStatus,
} from "@/lib/portfolio";
import { buildDiagnosticsPdf } from "@/lib/diagnostics-pdf";
import { downloadBytes, proposalFileStem } from "@/lib/proposal-export";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  input: ModelInput;
  allocation: Allocation;
  vision: VisionStatus;
  advisorName: string;
};

export function DiagnosticsReport({ open, onClose, input, allocation, vision, advisorName }: Props) {
  const report = open ? buildDiagnostics(allocation, input, vision) : null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const [building, setBuilding] = useState(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("diagnostics-open");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(id);
      document.body.classList.remove("diagnostics-open");
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open]);

  if (!open || !report) return null;

  const client = input.clientName.trim();
  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  function copy() {
    void navigator.clipboard.writeText(diagnosticsCopy(report as Diagnostics, allocation, input)).then(
      () => toast("Diagnostics copied"),
      () => toast("Could not copy"),
    );
  }

  async function downloadPdf() {
    if (building || !report) return;
    setBuilding(true);
    try {
      const bytes = buildDiagnosticsPdf(input, allocation, report, advisorName);
      const stem = proposalFileStem(input.clientName, allocation.policyCode);
      downloadBytes(`${stem}-XRay.pdf`, bytes, "application/pdf");
      toast("Diagnostics PDF downloaded");
    } catch {
      toast("Could not build the diagnostics PDF.");
    } finally {
      setBuilding(false);
    }
  }

  return (
    <div
      className="diagnostics-overlay fixed inset-0 z-[80] overflow-y-auto bg-background"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostics-title"
    >
      <div className="sticky top-0 z-10 border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <FalconMark />
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Portfolio diagnostics
              </p>
              <p id="diagnostics-title" className="truncate font-medium">
                {allocation.policyCode}
              </p>
            </div>
          </div>
          <div className="no-print flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={copy}>
              <Copy />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void downloadPdf()} disabled={building}>
              <Download />
              {building ? "Building…" : "Download PDF"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer />
              Print
            </Button>
            <Button
              ref={closeRef}
              variant="secondary"
              size="sm"
              onClick={onClose}
              aria-label="Close diagnostics"
            >
              <X />
              Close
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <header className="print-break flex flex-col gap-3">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Falcon X-Ray · {date}
            {client ? ` · ${client}` : ""}
          </p>
          <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {allocation.policyTitle}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{report.headline}</p>
        </header>

        <section className="print-break grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RiskTile score={report.riskScore} label={report.riskLabel} />
          <Kpi
            label="Est. yield"
            value={`${report.kpis.yieldPct.toFixed(2)}%`}
            blurb="The look-through income the holdings are designed to produce over a year, before taxes. Useful for planning — not a guaranteed coupon or a promised distribution."
          />
          <Kpi
            label="Weighted ER"
            value={formatEr(report.kpis.expenseRatio)}
            blurb="Expense ratio: the asset-weighted fund fee, blended by how much of the account sits in each line. It is the annual cost of owning this implementation."
          />
          <Kpi
            label="Est. volatility"
            value={`${report.kpis.volPct.toFixed(1)}%`}
            blurb="A stylized annual standard deviation of returns. Roughly two-thirds of years are expected to land inside plus-or-minus this band. It is a weather report, not a ceiling."
          />
          <Kpi
            label="Beta vs S&P 500"
            value={report.kpis.betaSpx.toFixed(2)}
            blurb="How much this mix has tended to move when the S&P 500 moves 1%. Near 1.00 tracks the index; below 1.00 is more muted; above 1.00 amplifies equity weather."
          />
          <Kpi
            label="Bond duration"
            value={`${report.kpis.durationYrs.toFixed(1)}y`}
            blurb="Average interest-rate sensitivity of the fixed-income book, in years. A 1% rise in yields is a rough minus-duration percent mark on those bonds, before credit spreads."
          />
          <Kpi
            label="Sharpe (est.)"
            value={report.kpis.sharpe.toFixed(2)}
            blurb={`Estimated excess return per unit of volatility, versus a ${4.2}% risk-free rate. Higher means more expected compensation for the ride — still an estimate, not a medal.`}
          />
          <Kpi
            label="Est. max drawdown"
            value={`${report.kpis.maxDdPct.toFixed(0)}%`}
            blurb="A stylized peak-to-trough decline in a severe market. It is an illustration for conversation, not a floor, a stop-loss, or a guarantee of how bad a year can get."
          />
        </section>

        <Section
          title="Underlying holdings"
          kicker={
            allocation.satelliteSleevePct > 0
              ? `Core ${formatPct(allocation.coreSleevePct)} · Satellite ${formatPct(allocation.satelliteSleevePct)} · as of ${CORE_AS_OF}`
              : `Core ${formatPct(allocation.coreSleevePct)} · as of ${CORE_AS_OF}`
          }
        >
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Look-through positions in this policy. Core Equity and Core Fixed Income are sorted
            greatest to least inside each sleeve. Account % is of the whole book after any
            satellite overlay; the Model column is the core sheet weight.
          </p>
          <HoldingsTable allocation={allocation} dollars={input.accountValue} />
        </Section>

        <Section title="Asset allocation" kicker="Look-through roles">
          <AllocationMix items={report.buckets} dollars={input.accountValue} />
        </Section>

        <div className="grid gap-8 lg:grid-cols-2">
          <Section title="Geography" kicker="Domicile mix">
            <StackedBar items={report.geography} />
            <ShareTable items={report.geography} dollars={null} />
          </Section>
          <Section title="Equity style box" kicker={`${report.equityShare.toFixed(0)}% of account is equity-like`}>
            <StyleBox cells={report.styleBox} />
          </Section>
        </div>

        <Section title="Equity sectors" kicker="GICS look-through of equity-like holdings">
          <div className="flex flex-col gap-2">
            {report.sectors.slice(0, 8).map((s) => (
              <BarRow key={s.key} label={s.label} weight={s.weight} max={report.sectors[0]?.weight ?? 1} />
            ))}
          </div>
        </Section>

        <Section title="Factor & risk monitor" kicker="Relative to a plain 60/40">
          <div className="grid gap-3 sm:grid-cols-2">
            {report.factors.map((f) => (
              <FactorRow key={f.key} factor={f} />
            ))}
          </div>
        </Section>

        <Section
          title="Trailing returns vs benchmark"
          kicker={`${report.trailing.benchmarkLabel} · as of ${report.trailing.asOf}`}
        >
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Annualized total return over the trailing 1-, 3-, and 5-year windows. The benchmark is
            a constant-weight mix of Vanguard Total World Stock (VT) and Vanguard Total World Bond
            (BNDW) at this policy’s core equity/fixed split — so a 60/40 is 60% VT / 40% BNDW. The
            policy line is a look-through reconstruction from sleeve roles, not live fund NAVs.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {report.trailing.rows.map((row) => (
              <TrailingTile key={row.years} row={row} maxAbs={trailScale(report.trailing.rows)} />
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{report.trailing.note}</p>
        </Section>

        <Section title="Scenario analysis" kicker="Illustrative, not a forecast">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report.scenarios.map((s) => ({ ...s, fill: s.result >= 0 ? "var(--color-ok)" : "var(--color-destructive)" }))}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" width={118} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="result" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                  {report.scenarios.map((s) => (
                    <Cell
                      key={s.key}
                      fill={s.result >= 0 ? "var(--color-ok)" : "var(--color-destructive)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
            {report.scenarios.map((s) => (
              <li key={s.key} className="flex justify-between gap-3">
                <span>
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="ml-2">{s.period} · {s.note}</span>
                </span>
                <span
                  className={cn(
                    "tabular-nums font-medium",
                    s.result >= 0 ? "text-ok" : "text-destructive",
                  )}
                >
                  {s.result >= 0 ? "+" : ""}
                  {s.result.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid gap-8 lg:grid-cols-2">
          <Section title="Liquidity ladder" kicker="Redemption profile">
            <ShareTable
              items={[
                { key: "daily", label: "Daily / T+1 ETFs", weight: report.liquidity.daily, color: "var(--color-ok)" },
                {
                  key: "interval",
                  label: "Interval funds",
                  weight: report.liquidity.interval,
                  color: "var(--color-warn)",
                },
                {
                  key: "illiquid",
                  label: "Private / illiquid",
                  weight: report.liquidity.illiquid,
                  color: "var(--color-destructive)",
                },
              ].filter((i) => i.weight > 0.05)}
              dollars={input.accountValue}
            />
          </Section>
          <Section title="Income & fees" kicker="Gross vs net">
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <MiniStat
                label="Gross yield"
                value={`${report.income.grossYield.toFixed(2)}%`}
                blurb="Look-through income before the fund expense ratio."
              />
              <MiniStat
                label="Expense ratio"
                value={formatEr(report.income.feeDrag)}
                blurb="Asset-weighted fund fee — the annual cost of this implementation."
              />
              <MiniStat
                label="Net of ER"
                value={`${report.income.netOfEr.toFixed(2)}%`}
                blurb="Gross yield minus the weighted expense ratio."
              />
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Top holding {report.concentration.topName} is {formatPct(report.concentration.topWeight)}.
              Effective number of holdings {report.concentration.effectiveHoldings.toFixed(1)} (HHI{" "}
              {report.concentration.hhi.toFixed(3)}).
            </p>
          </Section>
        </div>

        <Section title="Policy flags" kicker="Genesis-style monitor">
          <ul className="flex flex-col gap-2">
            {report.flags.map((f) => (
              <li
                key={f.title}
                className="rounded-lg bg-secondary px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={f.level === "alert" ? "warn" : f.level === "ok" ? "ok" : "muted"}>
                    {f.level === "alert" ? "Alert" : f.level === "ok" ? "Clear" : "Watch"}
                  </Badge>
                  <span className="font-medium">{f.title}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{f.detail}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Portfolio overview" kicker="What this mix is built to do">
          <ul className="flex flex-col gap-3">
            {report.overview.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Section>

        <VoiceSection voice={report.voice} />

        <p className="pb-8 text-xs leading-relaxed text-muted-foreground">
          Model diagnostics as of the Falcon Core Model dated {CORE_AS_OF}. Figures are
          representative look-through characteristics, not live market data, NAV, or
          a performance composite. Scenario results are stylized path estimates for
          advisor discussion — not forecasts, stress-test guarantees, or a
          recommendation. For advisor use only.
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <section className="print-break flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
        <p className="text-xs tracking-wide text-muted-foreground uppercase">{kicker}</p>
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, blurb }: { label: string; value: string; blurb: string }) {
  return (
    <div className="flex flex-col rounded-lg bg-card px-3 py-3 shadow-card sm:px-4">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums tracking-tight">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{blurb}</p>
    </div>
  );
}

function RiskTile({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex flex-col rounded-lg bg-primary px-3 py-3 text-primary-foreground shadow-card sm:px-4">
      <p className="text-xs tracking-wide uppercase opacity-70">Risk score</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums tracking-tight">{score}</p>
      <p className="text-xs opacity-80">{label}</p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-primary-foreground/20">
        <div className="h-full bg-primary-foreground" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-2 text-xs leading-relaxed opacity-70">
        A 0–100 composite of estimated volatility and equity beta. Higher means a more aggressive
        path and larger swings along the way — a risk budget, not a grade.
      </p>
    </div>
  );
}

function trailScale(rows: TrailingRow[]): number {
  return Math.max(...rows.flatMap((r) => [Math.abs(r.portfolio), Math.abs(r.benchmark)]), 8);
}

function TrailingTile({ row, maxAbs }: { row: TrailingRow; maxAbs: number }) {
  const rounded = Number(row.excess.toFixed(1));
  const ahead = rounded > 0;
  const behind = rounded < 0;
  return (
    <div className="flex flex-col rounded-lg bg-card px-3 py-3 shadow-card sm:px-4">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{row.label}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{row.window}</p>
      <p className="mt-2 font-display text-2xl font-medium tabular-nums tracking-tight">
        {formatReturn(row.portfolio)}
      </p>
      <p className="text-xs text-muted-foreground">Policy, annualized</p>
      <div className="mt-3 flex flex-col gap-2">
        <TrailBar label="Policy" value={row.portfolio} maxAbs={maxAbs} tone="policy" />
        <TrailBar label="Benchmark" value={row.benchmark} maxAbs={maxAbs} tone="bench" />
      </div>
      <p
        className={cn(
          "mt-3 text-sm font-medium tabular-nums",
          ahead ? "text-ok" : behind ? "text-destructive" : "text-muted-foreground",
        )}
      >
        Excess {formatExcess(row.excess)}
      </p>
    </div>
  );
}

function TrailBar({
  label,
  value,
  maxAbs,
  tone,
}: {
  label: string;
  value: number;
  maxAbs: number;
  tone: "policy" | "bench";
}) {
  const pct = maxAbs > 0 ? Math.min(100, (Math.abs(value) / maxAbs) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{formatReturn(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", tone === "policy" ? "bg-equity" : "bg-fixed")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value, blurb }: { label: string; value: string; blurb?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
      {blurb ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{blurb}</p> : null}
    </div>
  );
}

function StackedBar({ items }: { items: NamedShare[] }) {
  return (
    <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
      {items.map((item) => (
        <div
          key={item.key}
          className="h-full"
          style={{ flexBasis: `${item.weight}%`, background: item.color }}
        />
      ))}
    </div>
  );
}

function HoldingsTable({
  allocation,
  dollars,
}: {
  allocation: Allocation;
  dollars: number | null;
}) {
  const showModelCol = allocation.satelliteSleevePct > 0;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-64 text-sm">
        <thead>
          <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
            <th className="pb-2 font-medium">Holding</th>
            {showModelCol ? <th className="pb-2 text-right font-medium">Model</th> : null}
            <th className="pb-2 text-right font-medium">Account</th>
            {dollars !== null ? <th className="pb-2 text-right font-medium">Amount</th> : null}
          </tr>
        </thead>
        {allocation.groups.map((group) => (
          <HoldingsGroup
            key={group.key}
            group={group}
            dollars={dollars}
            showModelCol={showModelCol}
          />
        ))}
        <tfoot>
          <tr className="border-t border-border">
            <td className="pt-2.5 font-medium">Total</td>
            {showModelCol ? <td /> : null}
            <td className="pt-2.5 text-right font-medium tabular-nums">100.00%</td>
            {dollars !== null ? (
              <td className="pt-2.5 text-right font-medium tabular-nums">{formatUsd(dollars)}</td>
            ) : null}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function HoldingsGroup({
  group,
  dollars,
  showModelCol,
}: {
  group: HoldingGroup;
  dollars: number | null;
  showModelCol: boolean;
}) {
  return (
    <tbody>
      <tr className="border-t border-border/70 bg-secondary/60">
        <td className="py-2 pr-3">
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: sleeveColor(group.kind) }}
            />
            <span>
              <span className="font-medium">{group.label}</span>
              {group.coreSleeveWeight !== null ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {group.coreSleeveWeight}% of core mix
                </span>
              ) : null}
            </span>
          </div>
        </td>
        {showModelCol ? (
          <td className="py-2 text-right text-xs tabular-nums text-muted-foreground">
            {group.coreSleeveWeight !== null ? formatPct(group.coreSleeveWeight) : "—"}
          </td>
        ) : null}
        <td className="py-2 text-right font-medium tabular-nums">{formatPct(group.weight)}</td>
        {dollars !== null ? (
          <td className="py-2 text-right font-medium tabular-nums">
            {formatUsd((group.weight / 100) * dollars)}
          </td>
        ) : null}
      </tr>
      {group.lines.map((line) => (
        <tr key={line.id} className="border-t border-border/50">
          <td className="py-2 pr-3">
            <span className="font-medium tabular-nums">{line.ticker}</span>
            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
              {line.group ? `${line.group} · ` : ""}
              {line.name}
              {line.expenseRatio !== null ? ` · ER ${formatEr(line.expenseRatio)}` : ""}
            </span>
          </td>
          {showModelCol ? (
            <td className="py-2 text-right tabular-nums text-muted-foreground">
              {line.coreWeight === null ? "—" : formatPct(line.coreWeight)}
            </td>
          ) : null}
          <td className="py-2 text-right tabular-nums">{formatPct(line.weight)}</td>
          {dollars !== null ? (
            <td className="py-2 text-right tabular-nums">
              {formatUsd((line.weight / 100) * dollars)}
            </td>
          ) : null}
        </tr>
      ))}
    </tbody>
  );
}

function AllocationMix({
  items,
  dollars,
}: {
  items: NamedShare[];
  dollars: number | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-14 overflow-hidden rounded-xl">
        {items.map((item) => (
          <div
            key={item.key}
            className="relative flex min-w-0 items-center justify-center"
            style={{ flexGrow: Math.max(item.weight, 0.01), flexBasis: 0, background: item.color }}
            title={`${item.label} ${formatPct(item.weight)}`}
          >
            {item.weight >= 10 ? (
              <span className="px-1 text-[11px] font-medium tabular-nums text-primary-foreground">
                {item.weight.toFixed(0)}%
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            key={item.key}
            className={cn(
              "grid items-center gap-3 border-t border-border/50 py-2 text-sm",
              dollars !== null
                ? "grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)_4.5rem_6.5rem]"
                : "grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)_4.5rem]",
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: item.color }} />
              <span className="truncate">{item.label}</span>
            </span>
            <div className="hidden h-2 overflow-hidden rounded-full bg-secondary sm:block">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, item.weight)}%`, background: item.color }} />
            </div>
            <span className="text-right tabular-nums">{formatPct(item.weight)}</span>
            {dollars !== null ? (
              <span className="text-right tabular-nums text-muted-foreground">
                {formatUsd((item.weight / 100) * dollars)}
              </span>
            ) : (
              <span className="hidden sm:block" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShareTable({
  items,
  dollars,
}: {
  items: NamedShare[];
  dollars: number | null;
}) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {items.map((item) => (
          <tr key={item.key} className="border-t border-border/50">
            <td className="py-1.5 pr-3">
              <span className="mr-2 inline-block size-2 rounded-full" style={{ background: item.color }} />
              {item.label}
            </td>
            <td className="py-1.5 text-right tabular-nums">{formatPct(item.weight)}</td>
            {dollars !== null ? (
              <td className="py-1.5 text-right tabular-nums text-muted-foreground">
                {formatUsd((item.weight / 100) * dollars)}
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BarRow({ label, weight, max }: { label: string; weight: number; max: number }) {
  const pct = max > 0 ? (weight / max) * 100 : 0;
  return (
    <div className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-2 text-sm">
      <span className="truncate">{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-equity" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-right tabular-nums text-muted-foreground">{formatPct(weight)}</span>
    </div>
  );
}

function StyleBox({ cells }: { cells: StyleCell[] }) {
  const max = Math.max(...cells.map((c) => c.weight), 1);
  return (
    <div className="w-fit">
      <div className="mb-1.5 ml-[3.25rem] grid grid-cols-3 gap-1 text-center text-[10px] tracking-wide text-muted-foreground uppercase">
        <span>Value</span>
        <span>Blend</span>
        <span>Growth</span>
      </div>
      {(["Large", "Mid", "Small"] as const).map((size) => (
        <div key={size} className="mb-1 flex items-center gap-1.5">
          <span className="w-11 shrink-0 text-right text-[11px] text-muted-foreground">{size}</span>
          <div className="grid grid-cols-3 gap-1">
            {(["Value", "Blend", "Growth"] as const).map((style) => {
              const cell = cells.find((c) => c.size === size && c.style === style);
              const w = cell?.weight ?? 0;
              const intensity = w / max;
              return (
                <div
                  key={style}
                  className="flex size-11 items-center justify-center rounded text-[11px] tabular-nums sm:size-12"
                  style={{
                    background: `color-mix(in srgb, var(--color-equity) ${Math.round(18 + intensity * 72)}%, var(--color-secondary))`,
                    color: intensity > 0.45 ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                  }}
                >
                  {w >= 0.5 ? w.toFixed(0) : "·"}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="mt-2 ml-[3.25rem] text-xs text-muted-foreground">Cell = % of equity-like assets.</p>
    </div>
  );
}

function VoiceSection({ voice }: { voice: InvestorVoice }) {
  return (
    <Section title="A voice from the archives" kicker={`In the manner of ${voice.name}`}>
      <figure className="rounded-xl bg-card px-5 py-5 shadow-card sm:px-6">
        <figcaption className="flex flex-col gap-1">
          <p className="font-display text-xl font-medium tracking-tight">{voice.name}</p>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {voice.years} · {voice.school}
          </p>
        </figcaption>
        <blockquote className="mt-4 font-display text-lg leading-relaxed tracking-tight text-ink-soft">
          “{voice.comment}”
        </blockquote>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{voice.why}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          *Hypothetical commentary written in the style of {voice.name} for illustration and
          education. It is not a real quote, endorsement, affiliation, or recommendation by{" "}
          {voice.name}, their estate, or any firm associated with them.
        </p>
      </figure>
    </Section>
  );
}

function FactorRow({ factor }: { factor: FactorBar }) {
  const mag = Math.abs(factor.value);
  const left = factor.value < 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
        <span>{factor.label}</span>
        <span className="text-xs text-muted-foreground">{factor.hint}</span>
      </div>
      <div className="relative h-2 rounded-full bg-secondary">
        <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <div
          className={cn("absolute top-0 h-2 rounded-full", left ? "bg-fixed right-1/2" : "bg-equity left-1/2")}
          style={{ width: `${mag * 50}%` }}
        />
      </div>
    </div>
  );
}

export function DiagnosticsButton({
  ready,
  onClick,
  compact,
}: {
  ready: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <Button
      variant={compact ? "ghost" : "secondary"}
      size={compact ? "icon" : "sm"}
      onClick={onClick}
      disabled={!ready}
      aria-label="Portfolio diagnostics"
      title={ready ? "Run portfolio diagnostics" : "Finish the proposal to run diagnostics"}
    >
      <Activity />
      {compact ? null : <span className="hidden sm:inline">Diagnostics</span>}
    </Button>
  );
}
