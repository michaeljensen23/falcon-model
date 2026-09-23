export const GICS = [
  "Technology",
  "Health Care",
  "Financials",
  "Consumer",
  "Industrials",
  "Energy",
  "Materials",
  "Utilities",
  "Communication",
  "Real Estate",
] as const;
export type GicsSector = (typeof GICS)[number];

export type FundRole =
  | "us-equity"
  | "intl-equity"
  | "em-equity"
  | "real-estate"
  | "short-gov"
  | "core-bond"
  | "credit"
  | "preferred"
  | "private-income"
  | "private-equity"
  | "crypto"
  | "defined-outcome";

export type Liquidity = "daily" | "interval" | "illiquid";

export type FundProfile = {
  ticker: string;
  role: FundRole;
  /** US / developed ex-US / emerging. Sums to 1. */
  us: number;
  developed: number;
  em: number;
  /** Equity size mix. Sums to 1 for equity-like; 0 for pure FI. */
  large: number;
  mid: number;
  small: number;
  value: number;
  blend: number;
  growth: number;
  /** GICS weights, equity-like only. Length 10, sums to ~1. */
  sectors: number[] | null;
  yieldPct: number;
  durationYrs: number;
  igShare: number;
  volPct: number;
  betaSpx: number;
  maxDdPct: number;
  expenseRatio: number;
  liquidity: Liquidity;
  expectedReturn: number;
  quality: number;
};

function eq(
  ticker: string,
  role: FundRole,
  geo: [number, number, number],
  size: [number, number, number],
  style: [number, number, number],
  sectors: number[] | null,
  rest: Omit<
    FundProfile,
    | "ticker"
    | "role"
    | "us"
    | "developed"
    | "em"
    | "large"
    | "mid"
    | "small"
    | "value"
    | "blend"
    | "growth"
    | "sectors"
  >,
): FundProfile {
  return {
    ticker,
    role,
    us: geo[0],
    developed: geo[1],
    em: geo[2],
    large: size[0],
    mid: size[1],
    small: size[2],
    value: style[0],
    blend: style[1],
    growth: style[2],
    sectors,
    ...rest,
  };
}

function fi(
  ticker: string,
  role: FundRole,
  rest: Pick<
    FundProfile,
    | "yieldPct"
    | "durationYrs"
    | "igShare"
    | "volPct"
    | "betaSpx"
    | "maxDdPct"
    | "expenseRatio"
    | "liquidity"
    | "expectedReturn"
    | "quality"
  > & { us?: number; developed?: number; em?: number },
): FundProfile {
  return {
    ticker,
    role,
    us: rest.us ?? 0.85,
    developed: rest.developed ?? 0.12,
    em: rest.em ?? 0.03,
    large: 0,
    mid: 0,
    small: 0,
    value: 0,
    blend: 0,
    growth: 0,
    sectors: null,
    yieldPct: rest.yieldPct,
    durationYrs: rest.durationYrs,
    igShare: rest.igShare,
    volPct: rest.volPct,
    betaSpx: rest.betaSpx,
    maxDdPct: rest.maxDdPct,
    expenseRatio: rest.expenseRatio,
    liquidity: rest.liquidity,
    expectedReturn: rest.expectedReturn,
    quality: rest.quality,
  };
}

const PROFILES: FundProfile[] = [
  fi("VGSH", "short-gov", {
    us: 1,
    developed: 0,
    em: 0,
    yieldPct: 4.2,
    durationYrs: 1.9,
    igShare: 1,
    volPct: 2.1,
    betaSpx: 0.02,
    maxDdPct: 3,
    expenseRatio: 0.03,
    liquidity: "daily",
    expectedReturn: 4.1,
    quality: 0.95,
  }),
  fi("FBND", "core-bond", {
    yieldPct: 4.8,
    durationYrs: 5.8,
    igShare: 0.88,
    volPct: 6.2,
    betaSpx: 0.12,
    maxDdPct: 14,
    expenseRatio: 0.36,
    liquidity: "daily",
    expectedReturn: 4.7,
    quality: 0.72,
  }),
  fi("PYLD", "credit", {
    yieldPct: 5.9,
    durationYrs: 4.4,
    igShare: 0.62,
    volPct: 6.8,
    betaSpx: 0.22,
    maxDdPct: 12,
    expenseRatio: 0.7,
    liquidity: "daily",
    expectedReturn: 5.6,
    quality: 0.55,
  }),
  fi("BINC", "credit", {
    yieldPct: 5.6,
    durationYrs: 3.6,
    igShare: 0.7,
    volPct: 5.4,
    betaSpx: 0.18,
    maxDdPct: 10,
    expenseRatio: 0.4,
    liquidity: "daily",
    expectedReturn: 5.4,
    quality: 0.58,
  }),
  fi("FPE", "preferred", {
    yieldPct: 6.3,
    durationYrs: 4.8,
    igShare: 0.45,
    volPct: 9.5,
    betaSpx: 0.42,
    maxDdPct: 18,
    expenseRatio: 0.83,
    liquidity: "daily",
    expectedReturn: 5.8,
    quality: 0.4,
  }),
  eq(
    "AVEM",
    "em-equity",
    [0.02, 0.08, 0.9],
    [0.62, 0.28, 0.1],
    [0.45, 0.4, 0.15],
    [0.22, 0.04, 0.22, 0.12, 0.08, 0.08, 0.08, 0.03, 0.1, 0.03],
    {
      yieldPct: 2.5,
      durationYrs: 0,
      igShare: 0,
      volPct: 18.5,
      betaSpx: 0.78,
      maxDdPct: 38,
      expenseRatio: 0.33,
      liquidity: "daily",
      expectedReturn: 8.4,
      quality: 0.48,
    },
  ),
  eq(
    "AVDV",
    "intl-equity",
    [0.02, 0.88, 0.1],
    [0.08, 0.42, 0.5],
    [0.78, 0.18, 0.04],
    [0.08, 0.06, 0.18, 0.14, 0.24, 0.08, 0.1, 0.04, 0.04, 0.04],
    {
      yieldPct: 3.3,
      durationYrs: 0,
      igShare: 0,
      volPct: 17.2,
      betaSpx: 0.82,
      maxDdPct: 36,
      expenseRatio: 0.36,
      liquidity: "daily",
      expectedReturn: 8.1,
      quality: 0.52,
    },
  ),
  eq(
    "DFIV",
    "intl-equity",
    [0.02, 0.9, 0.08],
    [0.78, 0.18, 0.04],
    [0.82, 0.14, 0.04],
    [0.06, 0.08, 0.28, 0.1, 0.16, 0.12, 0.08, 0.04, 0.04, 0.04],
    {
      yieldPct: 3.6,
      durationYrs: 0,
      igShare: 0,
      volPct: 16.4,
      betaSpx: 0.8,
      maxDdPct: 34,
      expenseRatio: 0.27,
      liquidity: "daily",
      expectedReturn: 8.0,
      quality: 0.55,
    },
  ),
  eq(
    "IHDG",
    "intl-equity",
    [0.04, 0.92, 0.04],
    [0.82, 0.16, 0.02],
    [0.08, 0.22, 0.7],
    [0.16, 0.18, 0.08, 0.18, 0.16, 0.04, 0.06, 0.04, 0.08, 0.02],
    {
      yieldPct: 1.7,
      durationYrs: 0,
      igShare: 0,
      volPct: 13.8,
      betaSpx: 0.62,
      maxDdPct: 24,
      expenseRatio: 0.59,
      liquidity: "daily",
      expectedReturn: 7.4,
      quality: 0.82,
    },
  ),
  eq(
    "VNQ",
    "real-estate",
    [0.98, 0.02, 0],
    [0.7, 0.25, 0.05],
    [0.2, 0.7, 0.1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    {
      yieldPct: 3.9,
      durationYrs: 0,
      igShare: 0,
      volPct: 18.8,
      betaSpx: 0.86,
      maxDdPct: 42,
      expenseRatio: 0.13,
      liquidity: "daily",
      expectedReturn: 7.2,
      quality: 0.5,
    },
  ),
  eq(
    "QNDX",
    "us-equity",
    [0.97, 0.02, 0.01],
    [0.94, 0.05, 0.01],
    [0.02, 0.12, 0.86],
    [0.52, 0.06, 0.04, 0.12, 0.04, 0.01, 0.01, 0.01, 0.18, 0.01],
    {
      yieldPct: 0.6,
      durationYrs: 0,
      igShare: 0,
      volPct: 20.4,
      betaSpx: 1.12,
      maxDdPct: 33,
      expenseRatio: 0.1,
      liquidity: "daily",
      expectedReturn: 8.8,
      quality: 0.7,
    },
  ),
  eq(
    "MGK",
    "us-equity",
    [0.98, 0.02, 0],
    [0.96, 0.04, 0],
    [0.02, 0.1, 0.88],
    [0.44, 0.1, 0.06, 0.14, 0.04, 0.01, 0.01, 0.01, 0.18, 0.01],
    {
      yieldPct: 0.5,
      durationYrs: 0,
      igShare: 0,
      volPct: 19.6,
      betaSpx: 1.14,
      maxDdPct: 32,
      expenseRatio: 0.05,
      liquidity: "daily",
      expectedReturn: 8.7,
      quality: 0.74,
    },
  ),
  eq(
    "AVLV",
    "us-equity",
    [0.99, 0.01, 0],
    [0.92, 0.07, 0.01],
    [0.82, 0.14, 0.04],
    [0.08, 0.1, 0.22, 0.12, 0.16, 0.12, 0.06, 0.04, 0.06, 0.04],
    {
      yieldPct: 1.9,
      durationYrs: 0,
      igShare: 0,
      volPct: 16.2,
      betaSpx: 0.98,
      maxDdPct: 30,
      expenseRatio: 0.15,
      liquidity: "daily",
      expectedReturn: 8.5,
      quality: 0.62,
    },
  ),
  eq(
    "IWP",
    "us-equity",
    [0.98, 0.02, 0],
    [0.05, 0.9, 0.05],
    [0.06, 0.18, 0.76],
    [0.28, 0.14, 0.08, 0.16, 0.14, 0.04, 0.04, 0.02, 0.08, 0.02],
    {
      yieldPct: 0.7,
      durationYrs: 0,
      igShare: 0,
      volPct: 20.8,
      betaSpx: 1.08,
      maxDdPct: 36,
      expenseRatio: 0.23,
      liquidity: "daily",
      expectedReturn: 8.6,
      quality: 0.58,
    },
  ),
  eq(
    "AVMV",
    "us-equity",
    [0.99, 0.01, 0],
    [0.04, 0.9, 0.06],
    [0.78, 0.16, 0.06],
    [0.08, 0.08, 0.2, 0.14, 0.18, 0.1, 0.08, 0.04, 0.06, 0.04],
    {
      yieldPct: 1.6,
      durationYrs: 0,
      igShare: 0,
      volPct: 18.4,
      betaSpx: 1.02,
      maxDdPct: 34,
      expenseRatio: 0.2,
      liquidity: "daily",
      expectedReturn: 8.6,
      quality: 0.56,
    },
  ),
  eq(
    "IJT",
    "us-equity",
    [0.99, 0.01, 0],
    [0.02, 0.12, 0.86],
    [0.08, 0.18, 0.74],
    [0.18, 0.16, 0.1, 0.14, 0.16, 0.06, 0.06, 0.04, 0.06, 0.04],
    {
      yieldPct: 0.9,
      durationYrs: 0,
      igShare: 0,
      volPct: 21.2,
      betaSpx: 1.06,
      maxDdPct: 38,
      expenseRatio: 0.18,
      liquidity: "daily",
      expectedReturn: 8.7,
      quality: 0.54,
    },
  ),
  eq(
    "AVUV",
    "us-equity",
    [0.99, 0.01, 0],
    [0.02, 0.1, 0.88],
    [0.84, 0.12, 0.04],
    [0.08, 0.06, 0.22, 0.12, 0.18, 0.12, 0.08, 0.04, 0.06, 0.04],
    {
      yieldPct: 1.7,
      durationYrs: 0,
      igShare: 0,
      volPct: 22.4,
      betaSpx: 1.1,
      maxDdPct: 42,
      expenseRatio: 0.25,
      liquidity: "daily",
      expectedReturn: 8.9,
      quality: 0.5,
    },
  ),
  fi("PFLEX", "private-income", {
    us: 0.7,
    developed: 0.2,
    em: 0.1,
    yieldPct: 8.4,
    durationYrs: 2.8,
    igShare: 0.25,
    volPct: 8.2,
    betaSpx: 0.28,
    maxDdPct: 16,
    expenseRatio: 2.15,
    liquidity: "interval",
    expectedReturn: 7.8,
    quality: 0.35,
  }),
  fi("REFLX", "private-income", {
    us: 0.85,
    developed: 0.12,
    em: 0.03,
    yieldPct: 7.9,
    durationYrs: 4.2,
    igShare: 0.4,
    volPct: 10.4,
    betaSpx: 0.35,
    maxDdPct: 22,
    expenseRatio: 2.05,
    liquidity: "interval",
    expectedReturn: 7.4,
    quality: 0.38,
  }),
  fi("TPYTX", "private-income", {
    us: 0.78,
    developed: 0.14,
    em: 0.08,
    yieldPct: 7.6,
    durationYrs: 2.2,
    igShare: 0.3,
    volPct: 7.1,
    betaSpx: 0.22,
    maxDdPct: 14,
    expenseRatio: 1.55,
    liquidity: "interval",
    expectedReturn: 7.2,
    quality: 0.42,
  }),
  eq(
    "FVF-I",
    "private-equity",
    [0.75, 0.2, 0.05],
    [0.35, 0.45, 0.2],
    [0.15, 0.35, 0.5],
    [0.28, 0.12, 0.1, 0.12, 0.16, 0.06, 0.04, 0.02, 0.08, 0.02],
    {
      yieldPct: 0,
      durationYrs: 0,
      igShare: 0,
      volPct: 24,
      betaSpx: 0.7,
      maxDdPct: 28,
      expenseRatio: 1.75,
      liquidity: "illiquid",
      expectedReturn: 12.5,
      quality: 0.45,
    },
  ),
  eq(
    "IBIT",
    "crypto",
    [1, 0, 0],
    [1, 0, 0],
    [0, 0.3, 0.7],
    null,
    {
      yieldPct: 0,
      durationYrs: 0,
      igShare: 0,
      volPct: 52,
      betaSpx: 1.35,
      maxDdPct: 72,
      expenseRatio: 0.25,
      liquidity: "daily",
      expectedReturn: 10,
      quality: 0.15,
    },
  ),
  eq(
    "ETHA",
    "crypto",
    [1, 0, 0],
    [1, 0, 0],
    [0, 0.25, 0.75],
    null,
    {
      yieldPct: 0,
      durationYrs: 0,
      igShare: 0,
      volPct: 68,
      betaSpx: 1.55,
      maxDdPct: 80,
      expenseRatio: 0.25,
      liquidity: "daily",
      expectedReturn: 11,
      quality: 0.12,
    },
  ),
  eq(
    "BSOL",
    "crypto",
    [1, 0, 0],
    [1, 0, 0],
    [0, 0.15, 0.85],
    null,
    {
      yieldPct: 0,
      durationYrs: 0,
      igShare: 0,
      volPct: 88,
      betaSpx: 1.7,
      maxDdPct: 90,
      expenseRatio: 0.2,
      liquidity: "daily",
      expectedReturn: 12,
      quality: 0.08,
    },
  ),
  eq(
    "POW",
    "us-equity",
    [0.55, 0.4, 0.05],
    [0.7, 0.25, 0.05],
    [0.1, 0.35, 0.55],
    [0.08, 0.02, 0.04, 0.04, 0.48, 0.1, 0.06, 0.16, 0.02, 0],
    {
      yieldPct: 0.9,
      durationYrs: 0,
      igShare: 0,
      volPct: 22.5,
      betaSpx: 1.15,
      maxDdPct: 36,
      expenseRatio: 0.75,
      liquidity: "daily",
      expectedReturn: 9.4,
      quality: 0.48,
    },
  ),
  eq(
    "GRID",
    "us-equity",
    [0.48, 0.46, 0.06],
    [0.72, 0.24, 0.04],
    [0.12, 0.4, 0.48],
    [0.12, 0.02, 0.04, 0.04, 0.5, 0.06, 0.06, 0.14, 0.02, 0],
    {
      yieldPct: 1.1,
      durationYrs: 0,
      igShare: 0,
      volPct: 20.8,
      betaSpx: 1.08,
      maxDdPct: 34,
      expenseRatio: 0.57,
      liquidity: "daily",
      expectedReturn: 8.9,
      quality: 0.52,
    },
  ),
  eq(
    "ARTY",
    "us-equity",
    [0.64, 0.22, 0.14],
    [0.82, 0.14, 0.04],
    [0.04, 0.12, 0.84],
    [0.78, 0.02, 0.02, 0.04, 0.08, 0.01, 0.01, 0.02, 0.02, 0],
    {
      yieldPct: 0.1,
      durationYrs: 0,
      igShare: 0,
      volPct: 28.4,
      betaSpx: 1.32,
      maxDdPct: 44,
      expenseRatio: 0.47,
      liquidity: "daily",
      expectedReturn: 10.2,
      quality: 0.5,
    },
  ),
  eq(
    "BAI",
    "us-equity",
    [0.7, 0.2, 0.1],
    [0.84, 0.12, 0.04],
    [0.06, 0.16, 0.78],
    [0.7, 0.04, 0.04, 0.04, 0.1, 0.02, 0.02, 0.02, 0.02, 0],
    {
      yieldPct: 0.05,
      durationYrs: 0,
      igShare: 0,
      volPct: 26.8,
      betaSpx: 1.28,
      maxDdPct: 42,
      expenseRatio: 0.55,
      liquidity: "daily",
      expectedReturn: 10.0,
      quality: 0.52,
    },
  ),
  eq(
    "AIS",
    "us-equity",
    [0.58, 0.28, 0.14],
    [0.78, 0.16, 0.06],
    [0.08, 0.22, 0.7],
    [0.52, 0.02, 0.04, 0.04, 0.22, 0.04, 0.04, 0.06, 0.02, 0],
    {
      yieldPct: 0.2,
      durationYrs: 0,
      igShare: 0,
      volPct: 30.1,
      betaSpx: 1.38,
      maxDdPct: 46,
      expenseRatio: 0.75,
      liquidity: "daily",
      expectedReturn: 10.6,
      quality: 0.46,
    },
  ),
  eq(
    "BUFR",
    "defined-outcome",
    [0.98, 0.02, 0],
    [0.95, 0.04, 0.01],
    [0.15, 0.7, 0.15],
    [0.28, 0.12, 0.12, 0.12, 0.1, 0.04, 0.03, 0.03, 0.14, 0.02],
    {
      yieldPct: 0.4,
      durationYrs: 0,
      igShare: 0,
      volPct: 9.4,
      betaSpx: 0.48,
      maxDdPct: 12,
      expenseRatio: 0.95,
      liquidity: "daily",
      expectedReturn: 6.8,
      quality: 0.6,
    },
  ),
  fi("ACYN", "defined-outcome", {
    us: 0.95,
    developed: 0.05,
    em: 0,
    yieldPct: 10.4,
    durationYrs: 1.4,
    igShare: 0.7,
    volPct: 12.6,
    betaSpx: 0.55,
    maxDdPct: 18,
    expenseRatio: 0.75,
    liquidity: "daily",
    expectedReturn: 7.6,
    quality: 0.32,
  }),
];

const BY_TICKER = new Map(PROFILES.map((p) => [p.ticker, p]));

const FALLBACK: FundProfile = fi("UNKNOWN", "core-bond", {
  yieldPct: 4,
  durationYrs: 4,
  igShare: 0.8,
  volPct: 8,
  betaSpx: 0.4,
  maxDdPct: 16,
  expenseRatio: 0.4,
  liquidity: "daily",
  expectedReturn: 6,
  quality: 0.5,
});

export function fundProfile(ticker: string): FundProfile {
  return BY_TICKER.get(ticker) ?? { ...FALLBACK, ticker };
}

export const ROLE_LABEL: Record<FundRole, string> = {
  "us-equity": "U.S. Equity",
  "intl-equity": "Int'l Developed Equity",
  "em-equity": "Emerging Markets",
  "real-estate": "Real Estate",
  "short-gov": "Short Government",
  "core-bond": "Core / Core-Plus Bond",
  "credit": "Multisector / Credit",
  preferred: "Preferreds",
  "private-income": "Private Income",
  "private-equity": "Private Equity",
  crypto: "Digital Assets",
  "defined-outcome": "Defined Outcome",
};

export const ROLE_COLOR: Record<FundRole, string> = {
  "us-equity": "var(--color-equity)",
  "intl-equity": "var(--color-ok)",
  "em-equity": "var(--color-sat-ai)",
  "real-estate": "var(--color-sat-buffer)",
  "short-gov": "var(--color-fixed)",
  "core-bond": "var(--color-fixed)",
  credit: "var(--color-sat-income)",
  preferred: "var(--color-warn)",
  "private-income": "var(--color-sat-income)",
  "private-equity": "var(--color-sat-equity)",
  crypto: "var(--color-sat-crypto)",
  "defined-outcome": "var(--color-sat-buffer)",
};
