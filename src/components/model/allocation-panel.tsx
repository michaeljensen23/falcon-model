import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DiagnosticsButton } from "@/components/model/diagnostics-report";
import {
  CORE_AS_OF,
  VISION_FUND_MIN,
  VISION_FUND_NAME,
  allocationCopy,
  formatEr,
  formatPct,
  formatUsd,
  sleeveColor,
  type Allocation,
  type HoldingGroup,
  type ModelInput,
  type VisionStatus,
} from "@/lib/portfolio";

type Props = {
  input: ModelInput;
  allocation: Allocation;
  vision: VisionStatus;
  diagnosticsReady: boolean;
  onDiagnostics: () => void;
};

export function AllocationPanel({
  input,
  allocation,
  vision,
  diagnosticsReady,
  onDiagnostics,
}: Props) {
  const dollars = input.accountValue;
  const showModelCol = allocation.satelliteSleevePct > 0;

  function copy() {
    const text = allocationCopy(input, allocation);
    void navigator.clipboard.writeText(text).then(
      () => toast("Allocation copied"),
      () => toast("Could not copy"),
    );
  }

  return (
    <aside className="flex flex-1 flex-col gap-5">
      <div className="flex items-start justify-between gap-3 print-break">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Policy
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight">
            {allocation.policyTitle}
          </h2>
          <p className="mt-1 font-medium tabular-nums text-muted-foreground">
            {allocation.policyCode}
          </p>
        </div>
        <div className="no-print flex gap-1">
          <DiagnosticsButton compact ready={diagnosticsReady} onClick={onDiagnostics} />
          <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy allocation">
            <Copy />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.print()}
            aria-label="Print proposal"
          >
            <Printer />
          </Button>
        </div>
      </div>

      {allocation.pendingMessage ? (
        <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
          {allocation.pendingMessage}
        </p>
      ) : null}

      <SleeveChart allocation={allocation} />

      <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
        {allocation.sleeves.map((s) => (
          <div
            key={s.key}
            className="h-full"
            style={{
              flexBasis: `${s.weight}%`,
              background: sleeveColor(s.kind),
            }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {allocation.sleeves.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ background: sleeveColor(s.kind) }}
            />
            {s.label} {formatPct(s.weight)}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Core ER{" "}
          <span className="font-medium text-foreground tabular-nums">
            {formatEr(allocation.coreWeightedEr)}
          </span>
        </span>
        {allocation.satelliteSleevePct > 0 ? (
          <span>
            Account ER{" "}
            <span className="font-medium text-foreground tabular-nums">
              {formatEr(allocation.portfolioWeightedEr)}
            </span>
          </span>
        ) : null}
        <span>Model as of {CORE_AS_OF}</span>
      </div>

      <Separator />

      <div>
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Look-through holdings
          </h3>
          <span className="text-xs text-muted-foreground">
            Core {formatPct(allocation.coreSleevePct)}
            {allocation.satelliteSleevePct > 0
              ? ` · Satellite ${formatPct(allocation.satelliteSleevePct)}`
              : ""}
          </span>
        </div>
        {showModelCol ? (
          <p className="mb-3 text-xs text-muted-foreground">
            Model column is the core sheet weight. Account column is after the{" "}
            {allocation.satelliteSleevePct}% satellite overlay.
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-64 text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="pb-2 font-medium">Holding</th>
                {showModelCol ? (
                  <th className="pb-2 text-right font-medium">Model</th>
                ) : null}
                <th className="pb-2 text-right font-medium">Account</th>
                {dollars !== null ? (
                  <th className="pb-2 text-right font-medium">Amount</th>
                ) : null}
              </tr>
            </thead>
            {allocation.groups.map((group) => (
              <GroupBody
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
                  <td className="pt-2.5 text-right font-medium tabular-nums">
                    {formatUsd(dollars)}
                  </td>
                ) : null}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {vision.applies ? (
        <VisionCallout vision={vision} />
      ) : null}
    </aside>
  );
}

function GroupBody({
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
        <td className="py-2 text-right font-medium tabular-nums">
          {formatPct(group.weight)}
        </td>
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

function SleeveChart({ allocation }: { allocation: Allocation }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const data = allocation.sleeves.map((s) => ({
    ...s,
    fill: sleeveColor(s.kind),
  }));

  return (
    <div className="relative mx-auto h-44 w-full max-w-xs print-break">
      {ready ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="weight"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={78}
              startAngle={90}
              endAngle={-270}
              paddingAngle={data.length > 1 ? 2 : 0}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatPct(Number(value))}
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : null}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          Core sleeve
        </span>
        <span className="font-display text-2xl font-medium tabular-nums tracking-tight">
          {allocation.core.short}
        </span>
      </div>
    </div>
  );
}

function VisionCallout({ vision }: { vision: VisionStatus }) {
  if (vision.ok === false) {
    const twentyStillShort =
      vision.sleevePct === 10 &&
      vision.requiredAt20 > 0 &&
      (vision.satelliteDollars ?? 0) * 2 + 1e-6 < VISION_FUND_MIN;

    return (
      <div className="rounded-lg bg-warn/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="warn">Minimum not met</Badge>
        </div>
        <p className="mt-2 text-foreground">
          {VISION_FUND_NAME} requires {formatUsd(VISION_FUND_MIN)} in the satellite
          sleeve. At this overlay the sleeve is{" "}
          <span className="font-medium tabular-nums">
            {formatUsd(vision.satelliteDollars ?? 0)}
          </span>
          , a shortfall of{" "}
          <span className="font-medium tabular-nums">
            {formatUsd(vision.shortfall ?? 0)}
          </span>
          .
        </p>
        <p className="mt-2 text-muted-foreground">
          Required account value at this overlay:{" "}
          <span className="font-medium text-foreground tabular-nums">
            {formatUsd(vision.requiredAccount ?? 0)}
          </span>
          .
          {twentyStillShort
            ? ` Even at 20%, the account would need ${formatUsd(vision.requiredAt20)}.`
            : vision.sleevePct === 10
              ? " Making Private Equity the full 20% satellite would fund the minimum at this account size."
              : ""}{" "}
          Increase the account, or switch to Private Income.
        </p>
      </div>
    );
  }

  if (vision.ok === true) {
    return (
      <div className="rounded-lg bg-ok/10 px-4 py-3 text-sm">
        <Badge variant="ok">Minimum funded</Badge>
        <p className="mt-2 text-muted-foreground">
          Satellite sleeve{" "}
          <span className="font-medium text-foreground tabular-nums">
            {formatUsd(vision.satelliteDollars ?? 0)}
          </span>{" "}
          meets the {formatUsd(VISION_FUND_MIN)} {VISION_FUND_NAME} minimum.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
      <p>
        {VISION_FUND_NAME} requires {formatUsd(VISION_FUND_MIN)} in the satellite
        sleeve. Enter an account value to test the minimum — {formatUsd(vision.requiredAt10)}{" "}
        at a 10% overlay, or {formatUsd(vision.requiredAt20)} at 20%.
      </p>
    </div>
  );
}
