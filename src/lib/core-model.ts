export const CORE_AS_OF = "August 1, 2026";

export const EQUITY_STEPS = [
  100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0,
] as const;
export type EquityStep = (typeof EQUITY_STEPS)[number];

export type CoreKind = "equity" | "fixed";

export type CorePosition = {
  ticker: string;
  name: string;
  assetClass: string;
  kind: CoreKind;
  /** Gross expense ratio in percent (0.15 = 15 bps). */
  expenseRatio: number;
  /** Weight when that sleeve is 100% of the core (equity @ 100/0, fixed @ 0/100). */
  fullWeight: number;
};

/**
 * Falcon Core Model holdings. Equity full weights are the 100/0 column;
 * fixed-income full weights are the 0/100 column. Intermediate mixes scale
 * each sleeve linearly, matching the 8.1.26 model sheet.
 */
export const CORE_POSITIONS: CorePosition[] = [
  {
    ticker: "VGSH",
    name: "Vanguard Short-Term Treasury ETF",
    assetClass: "Short Government",
    kind: "fixed",
    expenseRatio: 0.03,
    fullWeight: 20,
  },
  {
    ticker: "FBND",
    name: "Fidelity Total Bond ETF",
    assetClass: "Intermediate Core-Plus Bond",
    kind: "fixed",
    expenseRatio: 0.36,
    fullWeight: 25,
  },
  {
    ticker: "PYLD",
    name: "PIMCO Multisector Bond Active ETF",
    assetClass: "Multisector Bond",
    kind: "fixed",
    expenseRatio: 0.7,
    fullWeight: 22.5,
  },
  {
    ticker: "BINC",
    name: "iShares Flexible Income Active ETF",
    assetClass: "Multisector Bond",
    kind: "fixed",
    expenseRatio: 0.4,
    fullWeight: 22.5,
  },
  {
    ticker: "FPE",
    name: "First Trust Preferred Securities & Income ETF",
    assetClass: "Preferred Stock",
    kind: "fixed",
    expenseRatio: 0.83,
    fullWeight: 10,
  },
  {
    ticker: "AVEM",
    name: "Avantis Emerging Markets Equity ETF",
    assetClass: "Diversified Emerging Mkts",
    kind: "equity",
    expenseRatio: 0.33,
    fullWeight: 8.5,
  },
  {
    ticker: "AVDV",
    name: "Avantis International Small Cap Value ETF",
    assetClass: "Foreign Small/Mid Value",
    kind: "equity",
    expenseRatio: 0.36,
    fullWeight: 3.4,
  },
  {
    ticker: "DFIV",
    name: "Dimensional International Value ETF",
    assetClass: "Foreign Large Value",
    kind: "equity",
    expenseRatio: 0.27,
    fullWeight: 9,
  },
  {
    ticker: "IHDG",
    name: "WisdomTree International Hedged Quality Dividend Growth Fund",
    assetClass: "Foreign Large Growth",
    kind: "equity",
    expenseRatio: 0.59,
    fullWeight: 7.1,
  },
  {
    ticker: "VNQ",
    name: "Vanguard Real Estate ETF",
    assetClass: "Real Estate",
    kind: "equity",
    expenseRatio: 0.13,
    fullWeight: 6.1,
  },
  {
    ticker: "QNDX",
    name: "SPDR Portfolio Nasdaq-100 ETF",
    assetClass: "Large Cap Growth",
    kind: "equity",
    expenseRatio: 0.1,
    fullWeight: 8.9,
  },
  {
    ticker: "MGK",
    name: "Vanguard Mega Cap Growth ETF",
    assetClass: "Large Cap Growth",
    kind: "equity",
    expenseRatio: 0.05,
    fullWeight: 15.2,
  },
  {
    ticker: "AVLV",
    name: "Avantis U.S. Large Cap Value ETF",
    assetClass: "Large Cap Value",
    kind: "equity",
    expenseRatio: 0.15,
    fullWeight: 27,
  },
  {
    ticker: "IWP",
    name: "iShares Russell Mid-Cap Growth ETF",
    assetClass: "Mid Cap Growth",
    kind: "equity",
    expenseRatio: 0.23,
    fullWeight: 2.6,
  },
  {
    ticker: "AVMV",
    name: "Avantis U.S. Mid Cap Value ETF",
    assetClass: "Mid Cap Value",
    kind: "equity",
    expenseRatio: 0.2,
    fullWeight: 4.2,
  },
  {
    ticker: "IJT",
    name: "iShares S&P Small-Cap 600 Growth ETF",
    assetClass: "Small Cap Growth",
    kind: "equity",
    expenseRatio: 0.18,
    fullWeight: 3.9,
  },
  {
    ticker: "AVUV",
    name: "Avantis U.S. Small Cap Value ETF",
    assetClass: "Small Cap Value",
    kind: "equity",
    expenseRatio: 0.25,
    fullWeight: 4.1,
  },
];

export type CoreModel = {
  equity: EquityStep;
  fixed: number;
  short: string;
  name: string;
  blurb: string;
};

function mixCopy(equity: EquityStep): { name: string; blurb: string } {
  if (equity === 100) {
    return {
      name: "All Equity",
      blurb: "Fully invested in the core equity sleeve. Highest growth orientation.",
    };
  }
  if (equity >= 90) {
    return {
      name: "Aggressive Growth",
      blurb: "Equity-led with a modest ballast of core fixed income.",
    };
  }
  if (equity >= 75) {
    return {
      name: "Growth",
      blurb: "Long-term growth with a defined fixed-income sleeve.",
    };
  }
  if (equity >= 65) {
    return {
      name: "Growth & Income",
      blurb: "Growth-biased, with a meaningful income component.",
    };
  }
  if (equity >= 60) {
    return {
      name: "Balanced Growth",
      blurb: "The classic balanced policy — growth with ballast.",
    };
  }
  if (equity >= 50) {
    return {
      name: "Balanced",
      blurb: "Even split between the core equity and fixed-income sleeves.",
    };
  }
  if (equity >= 40) {
    return {
      name: "Balanced Income",
      blurb: "Income-led, with a supporting equity sleeve.",
    };
  }
  if (equity >= 30) {
    return {
      name: "Conservative Income",
      blurb: "Fixed-income led, with a measured equity allocation.",
    };
  }
  if (equity >= 20) {
    return {
      name: "Income",
      blurb: "Primarily the core fixed-income sleeve, modest equity.",
    };
  }
  if (equity >= 10) {
    return {
      name: "Conservative",
      blurb: "Capital-stability focus with a thin equity sleeve.",
    };
  }
  if (equity === 5) {
    return {
      name: "Capital Preservation",
      blurb: "Almost entirely the core fixed-income sleeve.",
    };
  }
  return {
    name: "Capital Preservation",
    blurb: "Fully invested in the core fixed-income sleeve.",
  };
}

export const CORE_MODELS: CoreModel[] = EQUITY_STEPS.map((equity) => {
  const { name, blurb } = mixCopy(equity);
  return {
    equity,
    fixed: 100 - equity,
    short: `${equity}/${100 - equity}`,
    name,
    blurb,
  };
});

export function isEquityStep(value: number): value is EquityStep {
  return (EQUITY_STEPS as readonly number[]).includes(value);
}

export function coreByEquity(equity: EquityStep): CoreModel {
  const model = CORE_MODELS.find((m) => m.equity === equity);
  if (!model) throw new Error(`Unknown core mix: ${equity}`);
  return model;
}

export type WeightedPosition = CorePosition & {
  /** Percent of the core model (sums to 100 across holdings). */
  coreWeight: number;
};

export function corePositionsForMix(equity: EquityStep): WeightedPosition[] {
  const eqScale = equity / 100;
  const fiScale = (100 - equity) / 100;
  return CORE_POSITIONS.map((position) => ({
    ...position,
    coreWeight:
      position.kind === "equity"
        ? position.fullWeight * eqScale
        : position.fullWeight * fiScale,
  }))
    .filter((position) => position.coreWeight > 1e-9)
    .sort((a, b) => b.coreWeight - a.coreWeight || a.ticker.localeCompare(b.ticker));
}

export function coreWeightedExpenseRatio(equity: EquityStep): number {
  const rows = corePositionsForMix(equity);
  const total = rows.reduce((sum, row) => sum + row.coreWeight, 0);
  if (total <= 0) return 0;
  return rows.reduce((sum, row) => sum + row.coreWeight * row.expenseRatio, 0) / total;
}

export function positionsByKind(
  equity: EquityStep,
  kind: CoreKind,
): WeightedPosition[] {
  return corePositionsForMix(equity).filter((row) => row.kind === kind);
}
