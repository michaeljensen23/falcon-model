import type { FundRole } from "./fund-profiles";
import type { Allocation, HoldingLine } from "./portfolio";

export const TRAILING_AS_OF = "September 16, 2026";
export const VT_TICKER = "VT";
export const BNDW_TICKER = "BNDW";

export const TRAILING_HORIZONS = [1, 3, 5] as const;
export type TrailingHorizon = (typeof TRAILING_HORIZONS)[number];

/** Published annualized total returns for VT, as of TRAILING_AS_OF. */
export const VT_ANN: Record<TrailingHorizon, number> = {
  1: 17.06,
  3: 19.96,
  5: 10.49,
};

/** Published annualized total returns for BNDW, as of TRAILING_AS_OF. */
export const BNDW_ANN: Record<TrailingHorizon, number> = {
  1: -0.89,
  3: 3.82,
  5: -0.38,
};

/**
 * Representative annualized trailing returns by sleeve role, calibrated to the
 * same windows as VT / BNDW. Used to reconstruct a look-through policy line —
 * not live fund NAVs.
 */
const ROLE_ANN: Record<FundRole, Record<TrailingHorizon, number>> = {
  "us-equity": { 1: 15.2, 3: 21.4, 5: 12.8 },
  "intl-equity": { 1: 23.8, 3: 17.2, 5: 8.4 },
  "em-equity": { 1: 19.5, 3: 15.1, 5: 6.2 },
  "real-estate": { 1: 7.6, 3: 8.4, 5: 4.8 },
  "short-gov": { 1: 4.6, 3: 4.8, 5: 2.6 },
  "core-bond": { 1: -0.2, 3: 4.1, 5: -0.2 },
  credit: { 1: 6.4, 3: 7.6, 5: 2.8 },
  preferred: { 1: 7.1, 3: 8.4, 5: 3.1 },
  "private-income": { 1: 8.6, 3: 8.9, 5: 7.2 },
  "private-equity": { 1: 9.4, 3: 11.2, 5: 12.4 },
  crypto: { 1: 42.0, 3: 58.0, 5: 22.0 },
  "defined-outcome": { 1: 10.2, 3: 12.1, 5: 7.4 },
};

const WINDOW: Record<TrailingHorizon, { label: string; window: string }> = {
  1: { label: "1-year", window: "Sep 2025 – Sep 2026" },
  3: { label: "3-year", window: "Sep 2023 – Sep 2026 · annualized" },
  5: { label: "5-year", window: "Sep 2021 – Sep 2026 · annualized" },
};

export type TrailingRow = {
  years: TrailingHorizon;
  label: string;
  window: string;
  portfolio: number;
  benchmark: number;
  excess: number;
};

export type TrailingReport = {
  asOf: string;
  equityPct: number;
  fixedPct: number;
  benchmarkLabel: string;
  benchmarkDetail: string;
  rows: TrailingRow[];
  note: string;
};

export function benchmarkAnn(equityPct: number, years: TrailingHorizon): number {
  const eq = equityPct / 100;
  return eq * VT_ANN[years] + (1 - eq) * BNDW_ANN[years];
}

export function benchmarkLabel(equityPct: number, fixedPct: number): string {
  if (equityPct >= 100) return "100/0 · 100% VT";
  if (fixedPct >= 100) return "0/100 · 100% BNDW";
  return `${equityPct}/${fixedPct} · ${equityPct}% VT / ${fixedPct}% BNDW`;
}

export function buildTrailingReturns(
  allocation: Allocation,
  lines: Array<HoldingLine & { profile: { role: FundRole } }>,
): TrailingReport {
  const equityPct = allocation.core.equity;
  const fixedPct = allocation.core.fixed;
  const sat = allocation.satelliteComplete && allocation.satelliteSleevePct > 0;
  const rows: TrailingRow[] = TRAILING_HORIZONS.map((years) => {
    const portfolio = lookThroughAnn(lines, years);
    const benchmark = benchmarkAnn(equityPct, years);
    const meta = WINDOW[years];
    return {
      years,
      label: meta.label,
      window: meta.window,
      portfolio,
      benchmark,
      excess: portfolio - benchmark,
    };
  });

  return {
    asOf: TRAILING_AS_OF,
    equityPct,
    fixedPct,
    benchmarkLabel: benchmarkLabel(equityPct, fixedPct),
    benchmarkDetail: `Constant-weight mix of Vanguard Total World Stock (${VT_TICKER}) and Vanguard Total World Bond (${BNDW_TICKER}) at the ${allocation.core.short} core policy.`,
    rows,
    note: sat
      ? "The benchmark is the core mix only. A satellite overlay is the usual source of tracking difference versus VT/BNDW."
      : "The benchmark is the same equity/fixed split as this core, implemented as VT and BNDW.",
  };
}

function lookThroughAnn(
  lines: Array<HoldingLine & { profile: { role: FundRole } }>,
  years: TrailingHorizon,
): number {
  let n = 0;
  let d = 0;
  for (const line of lines) {
    const ret = ROLE_ANN[line.profile.role]?.[years] ?? benchmarkAnn(50, years);
    n += line.weight * ret;
    d += line.weight;
  }
  return d > 0 ? n / d : 0;
}

export function formatReturn(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatExcess(value: number): string {
  const rounded = Number(value.toFixed(1));
  if (rounded > 0) return `+${rounded.toFixed(1)}%`;
  if (rounded < 0) return `-${Math.abs(rounded).toFixed(1)}%`;
  return "0.0%";
}
