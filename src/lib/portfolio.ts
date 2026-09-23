import {
  CORE_AS_OF,
  coreByEquity,
  corePositionsForMix,
  coreWeightedExpenseRatio,
  type CoreModel,
  type EquityStep,
} from "./core-model";
import { fundProfile } from "./fund-profiles";

export {
  CORE_AS_OF,
  CORE_MODELS,
  CORE_POSITIONS,
  EQUITY_STEPS,
  coreByEquity,
  corePositionsForMix,
  coreWeightedExpenseRatio,
  isEquityStep,
  positionsByKind,
  type CoreKind,
  type CoreModel,
  type CorePosition,
  type EquityStep,
  type WeightedPosition,
} from "./core-model";

export const SATELLITE_WEIGHTS = [10, 20] as const;
export type SatelliteWeight = (typeof SATELLITE_WEIGHTS)[number];

export const VISION_FUND_MIN = 100_000;
export const VISION_FUND_NAME = "Falcon Vision Fund I";
/** Soft cap so a pasted scientific string cannot blow past formatter / UI. */
export const MAX_ACCOUNT_VALUE = 1_000_000_000_000;
export const MAX_CLIENT_NAME = 80;

export type SatelliteThemeId = "alt-income" | "alt-equity" | "crypto" | "ai" | "buffer";
export type SleeveKind = "equity" | "fixed" | SatelliteThemeId;

export type ThemeHolding = {
  ticker: string;
  name: string;
  share: number;
  group?: string;
};

export type SatelliteTheme = {
  id: SatelliteThemeId;
  name: string;
  summary: string;
  minInvestment: number | null;
  holdings: ThemeHolding[];
};

export const SATELLITE_THEMES: SatelliteTheme[] = [
  {
    id: "alt-income",
    name: "Private Income",
    summary:
      "Three pre-approved income funds, held equal-weight inside the satellite sleeve.",
    minInvestment: null,
    holdings: [
      {
        ticker: "PFLEX",
        name: "PIMCO Flexible Credit Income Fund",
        share: 1 / 3,
      },
      {
        ticker: "REFLX",
        name: "PIMCO Flexible Real Estate Income Fund",
        share: 1 / 3,
      },
      {
        ticker: "TPYTX",
        name: "TCW Private Asset Income Fund Class I",
        share: 1 / 3,
      },
    ],
  },
  {
    id: "alt-equity",
    name: "Private Equity",
    summary: `${VISION_FUND_NAME} — private equity with a separate $100,000 fund minimum.`,
    minInvestment: VISION_FUND_MIN,
    holdings: [
      {
        ticker: "FVF-I",
        name: VISION_FUND_NAME,
        share: 1,
      },
    ],
  },
  {
    id: "crypto",
    name: "Crypto",
    summary:
      "Spot crypto ETPs inside the satellite sleeve: 60% Bitcoin, 30% Ethereum, 10% Solana.",
    minInvestment: null,
    holdings: [
      {
        ticker: "IBIT",
        name: "iShares Bitcoin Trust ETF",
        share: 0.6,
      },
      {
        ticker: "ETHA",
        name: "iShares Ethereum Trust ETF",
        share: 0.3,
      },
      {
        ticker: "BSOL",
        name: "Bitwise Solana Staking ETF",
        share: 0.1,
      },
    ],
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    summary:
      "Equal-weight AI theme: energy and power grid, chips and compute, and AI factory infrastructure.",
    minInvestment: null,
    holdings: [
      {
        ticker: "POW",
        name: "VistaShares Electrification Supercycle ETF",
        share: 0.2,
        group: "Energy & Power Grid",
      },
      {
        ticker: "GRID",
        name: "First Trust NASDAQ Clean Edge Smart Grid Infrastructure ETF",
        share: 0.2,
        group: "Energy & Power Grid",
      },
      {
        ticker: "ARTY",
        name: "iShares Future AI & Tech ETF",
        share: 0.2,
        group: "Chips & Compute",
      },
      {
        ticker: "BAI",
        name: "iShares A.I. Innovation and Tech Active ETF",
        share: 0.2,
        group: "Chips & Compute",
      },
      {
        ticker: "AIS",
        name: "VistaShares Artificial Intelligence Supercycle ETF",
        share: 0.2,
        group: "Infrastructure & AI Factory",
      },
    ],
  },
  {
    id: "buffer",
    name: "Buffered Equity + Income ETFs",
    summary:
      "Equal-weight defined-outcome sleeve: laddered buffer equity and laddered autocallable barrier income.",
    minInvestment: null,
    holdings: [
      {
        ticker: "BUFR",
        name: "FT Vest Laddered Buffer ETF",
        share: 0.5,
      },
      {
        ticker: "ACYN",
        name: "FT Vest Laddered Autocallable Barrier & Income ETF",
        share: 0.5,
      },
    ],
  },
];

export function themeById(id: SatelliteThemeId): SatelliteTheme {
  const theme = SATELLITE_THEMES.find((t) => t.id === id);
  if (!theme) throw new Error(`Unknown satellite theme: ${id}`);
  return theme;
}

export type ModelInput = {
  clientName: string;
  accountValue: number | null;
  coreEquity: EquityStep;
  satelliteOn: boolean;
  satelliteWeight: SatelliteWeight | null;
  satelliteSplit: boolean;
  satelliteTheme: SatelliteThemeId | null;
  satelliteThemeB: SatelliteThemeId | null;
};

export type SatelliteSleeve = {
  theme: SatelliteTheme;
  weight: SatelliteWeight;
};

export function isSatelliteSplit(input: Pick<ModelInput, "satelliteWeight" | "satelliteSplit">): boolean {
  return input.satelliteWeight === 20 && input.satelliteSplit;
}

export function isSatelliteComplete(input: ModelInput): boolean {
  if (!input.satelliteOn || input.satelliteWeight === null) return false;
  if (isSatelliteSplit(input)) {
    return (
      input.satelliteTheme !== null &&
      input.satelliteThemeB !== null &&
      input.satelliteTheme !== input.satelliteThemeB
    );
  }
  return input.satelliteTheme !== null;
}

export function satelliteSleeves(input: ModelInput): SatelliteSleeve[] {
  if (!input.satelliteOn || input.satelliteWeight === null) return [];
  if (isSatelliteSplit(input)) {
    const sleeves: SatelliteSleeve[] = [];
    if (input.satelliteTheme) {
      sleeves.push({ theme: themeById(input.satelliteTheme), weight: 10 });
    }
    if (input.satelliteThemeB && input.satelliteThemeB !== input.satelliteTheme) {
      sleeves.push({ theme: themeById(input.satelliteThemeB), weight: 10 });
    }
    return sleeves;
  }
  if (input.satelliteTheme) {
    return [{ theme: themeById(input.satelliteTheme), weight: input.satelliteWeight }];
  }
  return [];
}

export function satellitePendingMessage(input: ModelInput): string | null {
  if (!input.satelliteOn || isSatelliteComplete(input)) return null;
  if (input.satelliteWeight === null) return "Select a 10% or 20% satellite overlay.";
  if (isSatelliteSplit(input)) {
    if (input.satelliteTheme === null && input.satelliteThemeB === null) {
      return "Select two different 10% satellite themes.";
    }
    if (input.satelliteTheme === null) return "Select the first 10% satellite theme.";
    if (input.satelliteThemeB === null) return "Select the second 10% satellite theme.";
    return "Choose two different satellite themes.";
  }
  return "Select a pre-approved satellite theme.";
}

export type HoldingLine = {
  id: string;
  sleeve: "Core" | "Satellite";
  name: string;
  ticker: string;
  assetClass: string;
  group: string | null;
  weight: number;
  coreWeight: number | null;
  expenseRatio: number | null;
  kind: SleeveKind;
};

export type HoldingGroup = {
  key: string;
  label: string;
  kind: SleeveKind;
  weight: number;
  coreSleeveWeight: number | null;
  lines: HoldingLine[];
};

export type SleeveSlice = {
  key: string;
  label: string;
  weight: number;
  kind: SleeveKind;
};

export type Allocation = {
  core: CoreModel;
  satelliteComplete: boolean;
  pendingMessage: string | null;
  coreSleevePct: number;
  satelliteSleevePct: number;
  lines: HoldingLine[];
  groups: HoldingGroup[];
  sleeves: SleeveSlice[];
  coreWeightedEr: number;
  portfolioWeightedEr: number;
  policyCode: string;
  policyTitle: string;
};

const PCT_DECIMALS = 2;

function roundPercents(raw: number[]): number[] {
  const factor = 10 ** PCT_DECIMALS;
  const scaled = raw.map((n) => n * factor);
  const floors = scaled.map((n) => Math.floor(n + 1e-9));
  const target = Math.round(raw.reduce((a, b) => a + b, 0) * factor);
  let leftover = target - floors.reduce((a, b) => a + b, 0);
  const order = scaled
    .map((n, i) => ({ i, frac: n - Math.floor(n + 1e-9) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  if (leftover > 0 && order.length > 0) {
    for (let k = 0; leftover > 0; k++) {
      const slot = order[k % order.length];
      if (!slot) break;
      out[slot.i] += 1;
      leftover -= 1;
    }
  } else if (leftover < 0) {
    const reverse = [...order].reverse();
    for (let k = 0; leftover < 0 && k < reverse.length; k++) {
      const slot = reverse[k];
      if (slot && out[slot.i] > 0) {
        out[slot.i] -= 1;
        leftover += 1;
      }
    }
  }
  return out.map((n) => n / factor);
}

export function buildAllocation(input: ModelInput): Allocation {
  const core = coreByEquity(input.coreEquity);
  const satReady = isSatelliteComplete(input);
  const pendingMessage = satellitePendingMessage(input);
  const sleevesActive = satReady ? satelliteSleeves(input) : [];
  const satelliteSleevePct = sleevesActive.reduce((sum, sleeve) => sum + sleeve.weight, 0);
  const coreSleevePct = 100 - satelliteSleevePct;
  const coreScale = coreSleevePct / 100;

  type Draft = {
    id: string;
    sleeve: "Core" | "Satellite";
    name: string;
    ticker: string;
    assetClass: string;
    group: string | null;
    kind: SleeveKind;
    coreWeight: number | null;
    expenseRatio: number | null;
    raw: number;
  };

  const drafts: Draft[] = [];
  for (const position of corePositionsForMix(core.equity)) {
    drafts.push({
      id: `core-${position.ticker}`,
      sleeve: "Core",
      name: position.name,
      ticker: position.ticker,
      assetClass: position.assetClass,
      group: null,
      kind: position.kind,
      coreWeight: position.coreWeight,
      expenseRatio: position.expenseRatio,
      raw: position.coreWeight * coreScale,
    });
  }

  if (satReady) {
    for (const sleeve of sleevesActive) {
      const kind: SleeveKind = sleeve.theme.id;
      for (const holding of sleeve.theme.holdings) {
        drafts.push({
          id: `sat-${sleeve.theme.id}-${holding.ticker}`,
          sleeve: "Satellite",
          name: holding.name,
          ticker: holding.ticker,
          assetClass: holding.group ?? sleeve.theme.name,
          group: holding.group ?? null,
          kind,
          coreWeight: null,
          expenseRatio: fundProfile(holding.ticker).expenseRatio,
          raw: sleeve.weight * holding.share,
        });
      }
    }
  }

  const rounded = roundPercents(drafts.map((d) => d.raw));
  const lines: HoldingLine[] = drafts
    .map((d, i) => ({
      id: d.id,
      sleeve: d.sleeve,
      name: d.name,
      ticker: d.ticker,
      assetClass: d.assetClass,
      group: d.group,
      kind: d.kind,
      coreWeight: d.coreWeight,
      expenseRatio: d.expenseRatio,
      weight: rounded[i] ?? 0,
    }))
    .filter((l) => l.weight > 0);

  const groupSpecs: Omit<HoldingGroup, "lines" | "weight">[] = [
    {
      key: "equity",
      label: "Core Equity",
      kind: "equity",
      coreSleeveWeight: core.equity,
    },
    {
      key: "fixed",
      label: "Core Fixed Income",
      kind: "fixed",
      coreSleeveWeight: core.fixed,
    },
    {
      key: "alt-income",
      label: "Satellite · Private Income",
      kind: "alt-income",
      coreSleeveWeight: null,
    },
    {
      key: "alt-equity",
      label: `Satellite · Private Equity`,
      kind: "alt-equity",
      coreSleeveWeight: null,
    },
    {
      key: "crypto",
      label: "Satellite · Crypto",
      kind: "crypto",
      coreSleeveWeight: null,
    },
    {
      key: "ai",
      label: "Satellite · Artificial Intelligence",
      kind: "ai",
      coreSleeveWeight: null,
    },
    {
      key: "buffer",
      label: "Satellite · Buffered Equity + Income ETFs",
      kind: "buffer",
      coreSleeveWeight: null,
    },
  ];

  const groups: HoldingGroup[] = groupSpecs
    .map((spec) => {
      const glines = lines
        .filter((line) => line.kind === spec.kind)
        .sort(
          (a, b) =>
            b.weight - a.weight ||
            (b.coreWeight ?? 0) - (a.coreWeight ?? 0) ||
            a.ticker.localeCompare(b.ticker),
        );
      return {
        ...spec,
        lines: glines,
        weight: glines.reduce((sum, line) => sum + line.weight, 0),
      };
    })
    .filter((group) => group.lines.length > 0);

  const sleeveRaw: SleeveSlice[] = groups.map((group) => ({
    key: group.key,
    label: sleeveLabel(group.kind),
    weight: group.weight,
    kind: group.kind,
  }));

  const policyCode = satReady
    ? `CS-${core.short.replace("/", "")}-${sleevesActive
        .map((sleeve) => `S${sleeve.weight}-${themeCode(sleeve.theme.id)}`)
        .join("-")}`
    : `C-${core.short.replace("/", "")}`;
  const policyTitle = satReady
    ? `${core.short} ${core.name} · ${sleevesActive
        .map((sleeve) => `${sleeve.weight}% ${sleeve.theme.name}`)
        .join(" + ")}`
    : `${core.short} ${core.name}`;

  const weightSum = lines.reduce((sum, line) => sum + line.weight, 0);
  const portfolioWeightedEr =
    weightSum > 0
      ? lines.reduce((sum, line) => sum + line.weight * (line.expenseRatio ?? 0), 0) /
        weightSum
      : 0;

  return {
    core,
    satelliteComplete: satReady,
    pendingMessage,
    coreSleevePct,
    satelliteSleevePct,
    lines,
    groups,
    sleeves: sleeveRaw,
    coreWeightedEr: coreWeightedExpenseRatio(core.equity),
    portfolioWeightedEr,
    policyCode,
    policyTitle,
  };
}

export type VisionStatus = {
  applies: boolean;
  ok: boolean | null;
  satelliteDollars: number | null;
  shortfall: number | null;
  requiredAccount: number | null;
  requiredAt10: number;
  requiredAt20: number;
  sleevePct: number | null;
};

export function visionFundStatus(input: ModelInput): VisionStatus {
  const requiredAt10 = VISION_FUND_MIN / 0.1;
  const requiredAt20 = VISION_FUND_MIN / 0.2;
  const peSleeve = satelliteSleeves(input).find((sleeve) => sleeve.theme.id === "alt-equity");
  const applies = peSleeve !== undefined;
  const sleevePct = peSleeve?.weight ?? null;

  if (!applies || sleevePct === null) {
    return {
      applies: false,
      ok: null,
      satelliteDollars: null,
      shortfall: null,
      requiredAccount: null,
      requiredAt10,
      requiredAt20,
      sleevePct: null,
    };
  }

  const weight = sleevePct / 100;
  const requiredAccount = VISION_FUND_MIN / weight;
  if (input.accountValue === null) {
    return {
      applies: true,
      ok: null,
      satelliteDollars: null,
      shortfall: null,
      requiredAccount,
      requiredAt10,
      requiredAt20,
      sleevePct,
    };
  }

  const satelliteDollars = input.accountValue * weight;
  const ok = satelliteDollars + 1e-6 >= VISION_FUND_MIN;
  return {
    applies: true,
    ok,
    satelliteDollars,
    shortfall: ok ? 0 : VISION_FUND_MIN - satelliteDollars,
    requiredAccount,
    requiredAt10,
    requiredAt20,
    sleevePct,
  };
}

export function formatUsd(value: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatPct(value: number): string {
  return `${value.toFixed(PCT_DECIMALS)}%`;
}

export function formatEr(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function parseMoney(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.replace(/[$,\s]/g, "");
  if (!/^(?:\d+|\d*\.\d+)$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0 || n > MAX_ACCOUNT_VALUE) return null;
  return n;
}

export function sleeveColor(kind: SleeveKind): string {
  switch (kind) {
    case "equity":
      return "var(--color-equity)";
    case "fixed":
      return "var(--color-fixed)";
    case "alt-income":
      return "var(--color-sat-income)";
    case "alt-equity":
      return "var(--color-sat-equity)";
    case "crypto":
      return "var(--color-sat-crypto)";
    case "ai":
      return "var(--color-sat-ai)";
    case "buffer":
      return "var(--color-sat-buffer)";
  }
}

export function sleeveLabel(kind: SleeveKind): string {
  switch (kind) {
    case "equity":
      return "Core Equity";
    case "fixed":
      return "Core Fixed Income";
    case "alt-income":
      return "Private Income";
    case "alt-equity":
      return "Private Equity";
    case "crypto":
      return "Crypto";
    case "ai":
      return "Artificial Intelligence";
    case "buffer":
      return "Buffered Equity + Income";
  }
}

export function themeCode(id: SatelliteThemeId): string {
  switch (id) {
    case "alt-income":
      return "PI";
    case "alt-equity":
      return "AE";
    case "crypto":
      return "CR";
    case "ai":
      return "AIA";
    case "buffer":
      return "BEI";
  }
}

export function isSatelliteThemeId(value: string): value is SatelliteThemeId {
  return SATELLITE_THEMES.some((theme) => theme.id === value);
}

export function allocationCopy(input: ModelInput, allocation: Allocation): string {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const client = input.clientName.trim() || "—";
  const aum = input.accountValue === null ? "—" : formatUsd(input.accountValue);
  const lines = [
    "Falcon Core–Satellite Portfolio Model",
    `Date: ${date}`,
    `Core model as of: ${CORE_AS_OF}`,
    `Client: ${client}`,
    `Account value: ${aum}`,
    "",
    `Policy: ${allocation.policyTitle}`,
    `Code: ${allocation.policyCode}`,
    `Core model: ${allocation.core.short} ${allocation.core.name} (equity/fixed)`,
    `Core weighted expense ratio: ${formatEr(allocation.coreWeightedEr)}`,
    `Account weighted expense ratio: ${formatEr(allocation.portfolioWeightedEr)}`,
    allocation.satelliteComplete
      ? `Satellite: ${allocation.satelliteSleevePct}% overlay — ${satelliteSleeves(input)
          .map((sleeve) => `${sleeve.weight}% ${sleeve.theme.name}`)
          .join(" + ")}`
      : "Satellite: none (core only)",
    "",
  ];

  for (const group of allocation.groups) {
    lines.push(
      `${group.label}    ${formatPct(group.weight)}${
        group.coreSleeveWeight !== null ? `    (${group.coreSleeveWeight}% of core)` : ""
      }`,
    );
    for (const line of group.lines) {
      const dollars =
        input.accountValue === null
          ? ""
          : `    ${formatUsd((line.weight / 100) * input.accountValue)}`;
      const model =
        line.coreWeight === null ? "" : `    model ${formatPct(line.coreWeight)}`;
      lines.push(
        `  ${line.ticker.padEnd(8)} ${formatPct(line.weight).padStart(7)}${model}${dollars}    ${line.name}`,
      );
    }
    lines.push("");
  }

  const vision = visionFundStatus(input);
  if (vision.applies) {
    lines.push(
      `${VISION_FUND_NAME} minimum: ${formatUsd(VISION_FUND_MIN)} in the satellite sleeve.`,
    );
    if (vision.ok === false && vision.shortfall !== null) {
      lines.push(
        `WARNING: Satellite sleeve is ${formatUsd(vision.satelliteDollars ?? 0)} — shortfall ${formatUsd(vision.shortfall)}. Required account value at this overlay: ${formatUsd(vision.requiredAccount ?? 0)}.`,
      );
    } else if (vision.ok === true) {
      lines.push("Minimum is funded at the current account value.");
    }
    lines.push("");
  }
  lines.push(
    "For advisor use only. Model policy weights, not a recommendation or an offer to sell securities.",
  );
  return lines.join("\n");
}
