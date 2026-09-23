import {
  CORE_AS_OF,
  formatEr,
  formatPct,
  positionsByKind,
  type EquityStep,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

type Props = {
  equity: EquityStep;
  weightedEr: number;
};

export function CoreHoldings({ equity, weightedEr }: Props) {
  const equityRows = positionsByKind(equity, "equity");
  const fixedRows = positionsByKind(equity, "fixed");
  const equityPct = equity;
  const fixedPct = 100 - equity;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Underlying positions
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          Core ER {formatEr(weightedEr)}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SleeveList
          title="Equity"
          sleevePct={equityPct}
          kind="equity"
          rows={equityRows}
          empty="No equity sleeve at 0/100."
        />
        <SleeveList
          title="Fixed income"
          sleevePct={fixedPct}
          kind="fixed"
          rows={fixedRows}
          empty="No fixed-income sleeve at 100/0."
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Falcon Core Model weights as of {CORE_AS_OF}. Position weights are percent
        of the core sleeve and move with the mix.
      </p>
    </div>
  );
}

function SleeveList({
  title,
  sleevePct,
  kind,
  rows,
  empty,
}: {
  title: string;
  sleevePct: number;
  kind: "equity" | "fixed";
  rows: ReturnType<typeof positionsByKind>;
  empty: string;
}) {
  const scale = Math.max(...rows.map((row) => row.coreWeight), 1);
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <span
            className={cn(
              "size-2 rounded-full",
              kind === "equity" ? "bg-equity" : "bg-fixed",
            )}
          />
          {title}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {sleevePct}% of core
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-lg bg-secondary px-3 py-4 text-xs text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="flex flex-col">
          {rows.map((row) => (
            <li
              key={row.ticker}
              className="border-t border-border/70 py-2 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0">
                  <span className="font-medium tabular-nums">{row.ticker}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {row.assetClass}
                  </span>
                </span>
                <span className="shrink-0 text-sm tabular-nums">
                  {formatPct(row.coreWeight)}
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-200 ease-out",
                    kind === "equity" ? "bg-equity" : "bg-fixed",
                  )}
                  style={{
                    width: `${Math.min(100, (row.coreWeight / scale) * 100)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
