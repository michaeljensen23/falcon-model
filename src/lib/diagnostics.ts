import {
  GICS,
  ROLE_COLOR,
  ROLE_LABEL,
  fundProfile,
  type FundProfile,
  type FundRole,
} from "./fund-profiles";
import {
  formatEr,
  formatPct,
  formatUsd,
  CORE_AS_OF,
  VISION_FUND_MIN,
  VISION_FUND_NAME,
  type Allocation,
  type HoldingLine,
  type ModelInput,
  type SleeveKind,
  type VisionStatus,
} from "./portfolio";
import {
  buildTrailingReturns,
  formatExcess,
  formatReturn,
  type TrailingReport,
} from "./trailing-returns";

export type NamedShare = {
  key: string;
  label: string;
  weight: number;
  color: string;
};

export type StyleCell = {
  size: "Large" | "Mid" | "Small";
  style: "Value" | "Blend" | "Growth";
  weight: number;
};

export type FactorBar = {
  key: string;
  label: string;
  value: number;
  hint: string;
};

export type ScenarioRow = {
  key: string;
  label: string;
  period: string;
  result: number;
  note: string;
};

export type DiagFlag = {
  level: "ok" | "watch" | "alert";
  title: string;
  detail: string;
};

export type InvestorVoice = {
  name: string;
  years: string;
  school: string;
  why: string;
  comment: string;
};

export type Diagnostics = {
  asOf: string;
  headline: string;
  riskScore: number;
  riskLabel: string;
  kpis: {
    yieldPct: number;
    expenseRatio: number;
    volPct: number;
    betaSpx: number;
    durationYrs: number;
    portfolioDuration: number;
    sharpe: number;
    maxDdPct: number;
    expectedReturn: number;
  };
  buckets: NamedShare[];
  geography: NamedShare[];
  styleBox: StyleCell[];
  equityShare: number;
  sectors: NamedShare[];
  factors: FactorBar[];
  trailing: TrailingReport;
  scenarios: ScenarioRow[];
  liquidity: { daily: number; interval: number; illiquid: number };
  concentration: {
    hhi: number;
    topName: string;
    topWeight: number;
    effectiveHoldings: number;
  };
  income: { grossYield: number; netOfEr: number; feeDrag: number };
  flags: DiagFlag[];
  overview: string[];
  voice: InvestorVoice;
  lines: Array<HoldingLine & { profile: FundProfile }>;
};

const RF = 4.2;

const ROLE_STRESS: Record<string, Record<FundRole, number>> = {
  gfc: {
    "us-equity": -37,
    "intl-equity": -40,
    "em-equity": -48,
    "real-estate": -37,
    "short-gov": 6,
    "core-bond": 5,
    credit: -8,
    preferred: -22,
    "private-income": -18,
    "private-equity": -25,
    crypto: -50,
    "defined-outcome": -14,
  },
  covid: {
    "us-equity": -34,
    "intl-equity": -33,
    "em-equity": -32,
    "real-estate": -38,
    "short-gov": 2,
    "core-bond": 1,
    credit: -9,
    preferred: -18,
    "private-income": -12,
    "private-equity": -16,
    crypto: -42,
    "defined-outcome": -11,
  },
  hike2022: {
    "us-equity": -18,
    "intl-equity": -16,
    "em-equity": -22,
    "real-estate": -26,
    "short-gov": -4,
    "core-bond": -13,
    credit: -11,
    preferred: -17,
    "private-income": -7,
    "private-equity": -9,
    crypto: -64,
    "defined-outcome": -8,
  },
  inflation: {
    "us-equity": -6,
    "intl-equity": -8,
    "em-equity": -10,
    "real-estate": 4,
    "short-gov": -2,
    "core-bond": -8,
    credit: -4,
    preferred: -3,
    "private-income": 2,
    "private-equity": 3,
    crypto: 8,
    "defined-outcome": -2,
  },
  rally: {
    "us-equity": 22,
    "intl-equity": 18,
    "em-equity": 16,
    "real-estate": 12,
    "short-gov": 1,
    "core-bond": 2,
    credit: 5,
    preferred: 8,
    "private-income": 6,
    "private-equity": 14,
    crypto: 48,
    "defined-outcome": 9,
  },
};

function wavg(rows: Array<{ w: number; v: number }>): number {
  let n = 0;
  let d = 0;
  for (const row of rows) {
    n += row.w * row.v;
    d += row.w;
  }
  return d > 0 ? n / d : 0;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function riskLabel(score: number): string {
  if (score >= 78) return "Aggressive";
  if (score >= 64) return "Growth";
  if (score >= 50) return "Balanced";
  if (score >= 36) return "Moderate";
  if (score >= 22) return "Conservative";
  return "Capital preservation";
}

export function buildDiagnostics(
  allocation: Allocation,
  input: ModelInput,
  vision: VisionStatus,
): Diagnostics {
  const lines = allocation.lines.map((line) => ({
    ...line,
    profile: fundProfile(line.ticker),
  }));
  const rows = lines.map((line) => ({ line, w: line.weight, p: line.profile }));

  const yieldPct = wavg(rows.map((r) => ({ w: r.w, v: r.p.yieldPct })));
  const expenseRatio = wavg(rows.map((r) => ({ w: r.w, v: r.p.expenseRatio })));
  const weightedVol = wavg(rows.map((r) => ({ w: r.w, v: r.p.volPct })));
  const betaSpx = wavg(rows.map((r) => ({ w: r.w, v: r.p.betaSpx })));
  const fiRows = rows.filter(
    (r) =>
      r.p.durationYrs > 0 ||
      r.p.role === "short-gov" ||
      r.p.role === "core-bond" ||
      r.p.role === "credit" ||
      r.p.role === "preferred" ||
      r.p.role === "private-income",
  );
  const durationYrs = wavg(fiRows.map((r) => ({ w: r.w, v: r.p.durationYrs })));
  const portfolioDuration = wavg(rows.map((r) => ({ w: r.w, v: r.p.durationYrs })));
  const expectedReturn = wavg(rows.map((r) => ({ w: r.w, v: r.p.expectedReturn })));
  const weightedDd = wavg(rows.map((r) => ({ w: r.w, v: r.p.maxDdPct })));
  const quality = wavg(rows.map((r) => ({ w: r.w, v: r.p.quality })));

  const hhi = rows.reduce((sum, r) => sum + (r.w / 100) ** 2, 0);
  const divFactor = 0.62 + 0.38 * clamp(hhi / 0.18, 0.15, 1);
  const volPct = weightedVol * divFactor;
  const maxDdPct = weightedDd * (0.68 + 0.32 * divFactor);
  const sharpe = volPct > 0 ? (expectedReturn - RF) / volPct : 0;

  const riskScore = Math.round(clamp(volPct * 3.55 + betaSpx * 8, 8, 94));

  const bucketMap = new Map<FundRole, number>();
  for (const r of rows) {
    bucketMap.set(r.p.role, (bucketMap.get(r.p.role) ?? 0) + r.w);
  }
  const buckets: NamedShare[] = [...bucketMap.entries()]
    .map(([role, weight]) => ({
      key: role,
      label: ROLE_LABEL[role],
      weight,
      color: ROLE_COLOR[role],
    }))
    .sort((a, b) => b.weight - a.weight);

  const geography: NamedShare[] = [
    {
      key: "us",
      label: "United States",
      weight: wavg(rows.map((r) => ({ w: r.w, v: r.p.us * 100 }))),
      color: "var(--color-equity)",
    },
    {
      key: "dev",
      label: "Developed ex-U.S.",
      weight: wavg(rows.map((r) => ({ w: r.w, v: r.p.developed * 100 }))),
      color: "var(--color-fixed)",
    },
    {
      key: "em",
      label: "Emerging markets",
      weight: wavg(rows.map((r) => ({ w: r.w, v: r.p.em * 100 }))),
      color: "var(--color-sat-income)",
    },
  ].filter((g) => g.weight > 0.05);

  const equityLike = rows.filter(
    (r) => r.p.large + r.p.mid + r.p.small > 0.5 && r.p.role !== "crypto",
  );
  const equityShare = equityLike.reduce((s, r) => s + r.w, 0);
  const sizes = ["Large", "Mid", "Small"] as const;
  const styles = ["Value", "Blend", "Growth"] as const;
  const styleBox: StyleCell[] = [];
  for (const size of sizes) {
    for (const style of styles) {
      const sizeKey = size.toLowerCase() as "large" | "mid" | "small";
      const styleKey = style.toLowerCase() as "value" | "blend" | "growth";
      const weight =
        equityShare > 0
          ? (equityLike.reduce((s, r) => s + r.w * r.p[sizeKey] * r.p[styleKey], 0) /
              equityShare) *
            100
          : 0;
      styleBox.push({ size, style, weight });
    }
  }

  const sectorTotals = GICS.map((label, i) => {
    const weight = equityLike.reduce((s, r) => {
      const sec = r.p.sectors?.[i] ?? 0;
      return s + r.w * sec;
    }, 0);
    return {
      key: label,
      label,
      weight: equityShare > 0 ? (weight / equityShare) * 100 : 0,
      color: "var(--color-equity)",
    };
  }).sort((a, b) => b.weight - a.weight);

  const usEq = bucketMap.get("us-equity") ?? 0;
  const intl = (bucketMap.get("intl-equity") ?? 0) + (bucketMap.get("em-equity") ?? 0);
  const cryptoW = bucketMap.get("crypto") ?? 0;
  const illiquid = rows
    .filter((r) => r.p.liquidity === "illiquid")
    .reduce((s, r) => s + r.w, 0);
  const interval = rows
    .filter((r) => r.p.liquidity === "interval")
    .reduce((s, r) => s + r.w, 0);
  const daily = 100 - illiquid - interval;
  const smallW = wavg(rows.map((r) => ({ w: r.w, v: r.p.small * 100 })));
  const valueW = wavg(rows.map((r) => ({ w: r.w, v: r.p.value * 100 })));
  const growthW = wavg(rows.map((r) => ({ w: r.w, v: r.p.growth * 100 })));
  const hyW = rows.reduce((s, r) => s + r.w * (1 - r.p.igShare) * (r.p.durationYrs > 0 ? 1 : 0), 0);

  const factors: FactorBar[] = [
    {
      key: "market",
      label: "Market (beta)",
      value: clamp((betaSpx - 0.6) / 0.8, -1, 1),
      hint: `Beta ${betaSpx.toFixed(2)} vs S&P 500`,
    },
    {
      key: "size",
      label: "Size (small)",
      value: clamp((smallW - 12) / 25, -1, 1),
      hint: `${smallW.toFixed(0)}% small-cap mix`,
    },
    {
      key: "value",
      label: "Value vs growth",
      value: clamp((valueW - growthW) / 40, -1, 1),
      hint: `Value ${valueW.toFixed(0)}% · Growth ${growthW.toFixed(0)}%`,
    },
    {
      key: "quality",
      label: "Quality",
      value: clamp((quality - 0.5) / 0.35, -1, 1),
      hint: "Quality tilt from core sleeve construction",
    },
    {
      key: "duration",
      label: "Duration",
      value: clamp((durationYrs - 3) / 5, -1, 1),
      hint: `${durationYrs.toFixed(1)}y bond book · ${portfolioDuration.toFixed(1)}y portfolio`,
    },
    {
      key: "credit",
      label: "Credit / HY",
      value: clamp((hyW - 8) / 20, -1, 1),
      hint: `${hyW.toFixed(0)}% below-IG contribution`,
    },
    {
      key: "crypto",
      label: "Digital assets",
      value: clamp(cryptoW / 12, 0, 1),
      hint: `${cryptoW.toFixed(1)}% of account`,
    },
    {
      key: "illiquid",
      label: "Illiquidity",
      value: clamp((illiquid + interval * 0.5) / 15, 0, 1),
      hint: `${(illiquid + interval).toFixed(0)}% interval or private`,
    },
  ];

  function scenario(key: string, label: string, period: string, note: string): ScenarioRow {
    const map = ROLE_STRESS[key];
    const result = rows.reduce((s, r) => s + r.w * (map?.[r.p.role] ?? 0), 0) / 100;
    return { key, label, period, result, note };
  }

  const scenarios: ScenarioRow[] = [
    scenario("gfc", "Global Financial Crisis", "2008–09", "Equity crash with flight-to-quality in Treasuries"),
    scenario("covid", "COVID shock", "Q1 2020", "Fast drawdown, liquidity stress across risk assets"),
    scenario("hike2022", "Inflation / hiking cycle", "2022", "Stocks and bonds down together"),
    scenario("inflation", "Sticky inflation", "Stylized", "Duration hurt; real assets and credit mixed"),
    scenario("rally", "Risk-on year", "Stylized", "Growth, crypto, and private equity lead"),
  ];

  const top = [...rows].sort((a, b) => b.w - a.w)[0];
  const flags: DiagFlag[] = [];

  if (vision.applies && vision.ok === false) {
    flags.push({
      level: "alert",
      title: "Private equity minimum",
      detail: `Falcon Vision Fund I needs $100,000 in-sleeve. Current sleeve is short.`,
    });
  }
  if (cryptoW >= 8) {
    flags.push({
      level: "alert",
      title: "Digital-asset concentration",
      detail: `${formatPct(cryptoW)} in crypto ETPs. Path volatility and drawdowns will dominate tracking error.`,
    });
  } else if (cryptoW >= 3) {
    flags.push({
      level: "watch",
      title: "Digital-asset sleeve",
      detail: `${formatPct(cryptoW)} in crypto ETPs. Material to risk even as a satellite.`,
    });
  }
  if (illiquid >= 8) {
    flags.push({
      level: "watch",
      title: "Illiquid sleeve",
      detail: `${formatPct(illiquid)} is private / non-daily. Gate, capital call, and valuation lag risk apply.`,
    });
  }
  if (interval >= 8) {
    flags.push({
      level: "watch",
      title: "Interval-fund liquidity",
      detail: `${formatPct(interval)} in interval vehicles. Redemptions are periodic, not T+1.`,
    });
  }
  if ((top?.w ?? 0) >= 18) {
    flags.push({
      level: "watch",
      title: "Single-name weight",
      detail: `${top?.line.ticker} is ${formatPct(top?.w ?? 0)} of the account.`,
    });
  }
  const tech = sectorTotals.find((s) => s.key === "Technology")?.weight ?? 0;
  if (tech >= 28 && equityShare >= 40) {
    flags.push({
      level: "watch",
      title: "Technology sector tilt",
      detail: `Look-through technology is ${tech.toFixed(0)}% of equity. Growth and AI sleeves amplify it.`,
    });
  }
  if (durationYrs >= 5.5) {
    flags.push({
      level: "watch",
      title: "Rate sensitivity",
      detail: `Average duration ${durationYrs.toFixed(1)} years. A 100 bp rise is roughly −${durationYrs.toFixed(1)}% on the bond book before spread.`,
    });
  }
  if (expenseRatio >= 0.55) {
    flags.push({
      level: "watch",
      title: "Expense ratio",
      detail: `Weighted ER ${formatEr(expenseRatio)}. Satellite interval and defined-outcome funds lift the average above the core.`,
    });
  }
  if (flags.length === 0) {
    flags.push({
      level: "ok",
      title: "No material policy flags",
      detail: "Weights, liquidity, and concentration sit inside typical core–satellite bounds for this mix.",
    });
  }

  const intlShare = intl;
  const headline = composeHeadline({
    allocation,
    riskLabel: riskLabel(riskScore),
    yieldPct,
    volPct,
    betaSpx,
    cryptoW,
    usEq,
    intlShare,
    durationYrs,
  });

  const overview = composeOverview({
    allocation,
    riskLabel: riskLabel(riskScore),
    yieldPct,
    expenseRatio,
    volPct,
    betaSpx,
    maxDdPct,
    durationYrs,
    usEq,
    intlShare,
    cryptoW,
    daily,
    interval,
    illiquid,
    vision,
    topTicker: top?.line.ticker ?? null,
    topWeight: top?.w ?? 0,
    valueW,
    growthW,
  });
  const voice = pickVoice({
    equity: allocation.core.equity,
    satellitePct: allocation.satelliteSleevePct,
    cryptoW,
    aiW: sleeveWeight(allocation, "ai"),
    peW: sleeveWeight(allocation, "alt-equity"),
    incomeW: sleeveWeight(allocation, "alt-income"),
    bufferW: sleeveWeight(allocation, "buffer"),
    valueW,
    growthW,
  });
  const trailing = buildTrailingReturns(allocation, lines);

  return {
    asOf: CORE_AS_OF,
    headline,
    riskScore,
    riskLabel: riskLabel(riskScore),
    kpis: {
      yieldPct,
      expenseRatio,
      volPct,
      betaSpx,
      durationYrs,
      portfolioDuration,
      sharpe,
      maxDdPct,
      expectedReturn,
    },
    buckets,
    geography,
    styleBox,
    equityShare,
    sectors: sectorTotals.filter((s) => s.weight >= 0.4),
    factors,
    trailing,
    scenarios,
    liquidity: { daily, interval, illiquid },
    concentration: {
      hhi,
      topName: top ? `${top.line.ticker}` : "—",
      topWeight: top?.w ?? 0,
      effectiveHoldings: hhi > 0 ? 1 / hhi : 0,
    },
    income: {
      grossYield: yieldPct,
      netOfEr: yieldPct - expenseRatio,
      feeDrag: expenseRatio,
    },
    flags,
    overview,
    voice,
    lines,
  };
}

function composeHeadline(args: {
  allocation: Allocation;
  riskLabel: string;
  yieldPct: number;
  volPct: number;
  betaSpx: number;
  cryptoW: number;
  usEq: number;
  intlShare: number;
  durationYrs: number;
}): string {
  const sat = args.allocation.satelliteComplete
    ? ` Satellite overlay is ${args.allocation.satelliteSleevePct.toFixed(0)}% of the account.`
    : " Core-only — no satellite overlay.";
  const crypto =
    args.cryptoW >= 3
      ? ` Digital assets (${args.cryptoW.toFixed(0)}%) dominate tracking error.`
      : "";
  return `${args.allocation.policyTitle} maps to a ${args.riskLabel.toLowerCase()} risk budget. Estimated yield ${args.yieldPct.toFixed(1)}%, volatility ${args.volPct.toFixed(1)}%, beta ${args.betaSpx.toFixed(2)} vs the S&P 500. U.S. equity ${args.usEq.toFixed(0)}% · international ${args.intlShare.toFixed(0)}% · duration ${args.durationYrs.toFixed(1)}y.${sat}${crypto}`;
}

function sleeveWeight(allocation: Allocation, kind: SleeveKind): number {
  return allocation.sleeves.find((s) => s.kind === kind)?.weight ?? 0;
}

function composeOverview(args: {
  allocation: Allocation;
  riskLabel: string;
  yieldPct: number;
  expenseRatio: number;
  volPct: number;
  betaSpx: number;
  maxDdPct: number;
  durationYrs: number;
  usEq: number;
  intlShare: number;
  cryptoW: number;
  daily: number;
  interval: number;
  illiquid: number;
  vision: VisionStatus;
  topTicker: string | null;
  topWeight: number;
  valueW: number;
  growthW: number;
}): string[] {
  const { allocation } = args;
  const eq = allocation.core.equity;
  const sat = allocation.satelliteSleevePct;
  const bullets: string[] = [];

  bullets.push(
    sat > 0
      ? `This is a ${allocation.core.short} ${allocation.core.name.toLowerCase()} core with a ${sat.toFixed(0)}% satellite overlay. The policy is built for a ${args.riskLabel.toLowerCase()} risk budget — growth is the job of the core; the satellite is a deliberate, sized expression around it.`
      : `This is a clean ${allocation.core.short} ${allocation.core.name.toLowerCase()} core with no satellite overlay. The household is buying the model as written: a ${args.riskLabel.toLowerCase()} risk budget without extra tracking error from themes.`,
  );

  if (eq >= 90) {
    bullets.push(
      "The core is almost entirely equities. That is a feature, not an accident — this mix is designed to compound business earnings over a long horizon, with only a thin (or zero) bond sleeve as ballast.",
    );
  } else if (eq >= 70) {
    bullets.push(
      `Equities do the heavy lifting at ${eq}% of the core. Fixed income is a shock absorber, not the return engine — useful in a drawdown, not a substitute for staying invested.`,
    );
  } else if (eq >= 50) {
    bullets.push(
      `The ${allocation.core.short} mix is a classic balanced policy: enough equity to grow purchasing power, enough high-quality fixed income to keep a bad equity year from becoming a bad decade.`,
    );
  } else if (eq >= 25) {
    bullets.push(
      `This is an income-led policy. The bond book is the foundation; the ${eq}% equity sleeve is the growth option sized so a weak stock market does not redefine the household's plan.`,
    );
  } else {
    bullets.push(
      "Capital preservation is the assignment. The core is built to survive first and grow second — a measured equity remnant, if any, is there so inflation does not quietly win.",
    );
  }

  if (eq > 0 && args.valueW >= args.growthW) {
    bullets.push(
      "Inside the equity sleeve, the book tilts toward profitable value — Avantis large-value (AVLV) is the flagship line — with a defined growth sleeve in mega-cap and Nasdaq so the household is not making a single-style bet.",
    );
  } else if (eq > 0) {
    bullets.push(
      "The equity sleeve leans into growth and quality compounders, with a supporting value book so the policy is not a pure momentum trade. That mix is how Falcon keeps a growth orientation without abandoning price discipline.",
    );
  }

  if (args.intlShare >= 6) {
    bullets.push(
      `International and emerging-market equities are about ${args.intlShare.toFixed(0)}% of the account. That is a second engine — the United States can lead for a long time, and this mix still refuses to make the household a single-country bet.`,
    );
  }

  if (eq <= 80 && args.durationYrs > 0.4) {
    bullets.push(
      `The fixed-income book blends short Treasuries, core-plus, and multisector credit at about ${args.durationYrs.toFixed(1)} years of duration. A rise in yields will mark the bonds down roughly in line with that duration; the offset is income and a dry-powder sleeve when equities are on sale.`,
    );
  }

  const satNotes: string[] = [];
  const pe = sleeveWeight(allocation, "alt-equity");
  const pi = sleeveWeight(allocation, "alt-income");
  const ai = sleeveWeight(allocation, "ai");
  const crypto = sleeveWeight(allocation, "crypto");
  const buffer = sleeveWeight(allocation, "buffer");
  if (pe > 0) {
    satNotes.push(
      args.vision.applies && args.vision.ok === false
        ? `${VISION_FUND_NAME} is the private-equity satellite (${pe.toFixed(0)}% of the account). The $100,000 fund minimum is not yet met at this account size — that is a subscription constraint, not a judgment on the strategy.`
        : `${VISION_FUND_NAME} is the private-equity satellite (${pe.toFixed(0)}%). It is an illiquid, multi-year commitment with a ${formatUsd(VISION_FUND_MIN)} fund minimum — access and patience are the point, not daily liquidity.`,
    );
  }
  if (pi > 0) {
    satNotes.push(
      `Private Income (${pi.toFixed(0)}%) equal-weights three pre-approved interval funds. The pitch is a different income stream than public bonds; the honest cost is periodic — not daily — liquidity.`,
    );
  }
  if (ai > 0) {
    satNotes.push(
      `The Artificial Intelligence sleeve (${ai.toFixed(0)}%) is a themed bet on power, chips, and AI factory infrastructure. It will look brilliant in adoption years and expensive in the dull ones — size is how you stay in the game.`,
    );
  }
  if (crypto > 0) {
    satNotes.push(
      `Crypto (${crypto.toFixed(0)}%) is a 60/30/10 mix of Bitcoin, Ethereum, and Solana ETPs. Treat it as a convex satellite, not a savings account: path volatility will dominate tracking error, and that is the bargain.`,
    );
  }
  if (buffer > 0) {
    satNotes.push(
      `Buffered Equity + Income (${buffer.toFixed(0)}%) pairs a laddered buffer ETF with a laddered autocallable. You are selling some upside to put a defined outcome under the bad years — a sleep-well sleeve, not a free lunch.`,
    );
  }
  bullets.push(...satNotes);

  bullets.push(
    `Look-through yield is about ${args.yieldPct.toFixed(2)}% and the weighted expense ratio is ${formatEr(args.expenseRatio)}. Yield is the cash the holdings are designed to produce, not a guaranteed coupon; the ER is what you pay each year to own the implementation.`,
  );

  bullets.push(
    `Estimated volatility near ${args.volPct.toFixed(1)}% and a stylized max drawdown around ${args.maxDdPct.toFixed(0)}% are the price of this mix. A sharp year is not a broken policy — it is the tuition for a ${args.riskLabel.toLowerCase()} risk budget. Beta versus the S&P 500 is ${args.betaSpx.toFixed(2)}, so equity markets will still set the weather.`,
  );

  if (args.illiquid + args.interval >= 8) {
    bullets.push(
      `About ${args.daily.toFixed(0)}% of the account is daily-liquid ETFs; the rest sits in interval or private vehicles. Match spending needs to the liquid sleeve. Gates and notice periods are a feature of the return stream, not a footnote.`,
    );
  } else {
    bullets.push(
      "Implementation is almost entirely daily-liquid ETFs, so rebalancing and cash raises are operationally simple. That is an underrated advantage when the household needs to act.",
    );
  }

  if (args.topTicker && args.topWeight >= 12) {
    bullets.push(
      `${args.topTicker} is the largest line at ${formatPct(args.topWeight)}. Concentration is how active tilts earn their keep — it is also why we watch single-name weight in the policy flags.`,
    );
  }

  const closer =
    "The case for this mix is time: staying invested through a full market cycle so compounding has a chance to work. It is a policy to own, not a trade to time.";
  const rest = bullets.filter((b) => b !== closer);
  return [...rest.slice(0, 9), closer];
}

function pickVoice(args: {
  equity: number;
  satellitePct: number;
  cryptoW: number;
  aiW: number;
  peW: number;
  incomeW: number;
  bufferW: number;
  valueW: number;
  growthW: number;
}): InvestorVoice {
  if (args.cryptoW >= 8) {
    return {
      name: "Stanley Druckenmiller",
      years: "Quantum, Duquesne",
      school: "Macro · convex bets, sized so you can be wrong",
      why: "A crypto satellite is an asymmetric macro expression — the discipline is in the size, not the slogan.",
      comment:
        "When the payoff is convex, you don't need to be a zealot — you need a position you can hold through humiliation. A measured Bitcoin-led sleeve is a call option on a monetary regime the bond market still pretends is normal. Size it so a 70% drawdown is a bruise, not a funeral, and let the rest of the book do the boring compounding.",
    };
  }
  if (args.peW >= 8) {
    return {
      name: "David Swensen",
      years: "Yale Endowment",
      school: "Endowment · illiquidity premium, patience as an edge",
      why: "Private equity in a satellite is the endowment idea scaled to a household: access and time, not daily marks.",
      comment:
        "The great institutional portfolios were not built on what traded every afternoon. They were built on what other people could not, or would not, hold. A private-equity satellite is that idea in miniature — you are paying in lockups for a return stream that does not have to mark to the panic. Just do not confuse a capital call with a checking account, and never let the liquid book become an afterthought.",
    };
  }
  if (args.aiW >= 8) {
    return {
      name: "Philip Fisher",
      years: "Common Stocks and Uncommon Profits",
      school: "Growth · scuttlebutt, own the future, sit still",
      why: "An AI overlay is a concentrated bet on companies reinvesting in the next decade of compute and power.",
      comment:
        "The great fortunes were not made by renting last year's winners. They were made by owning businesses that reinvest in a future the income statement has not fully admitted yet. Power, chips, and the factories that feed the models — that is scuttlebutt with a ticker. You will look foolish in the dull years. That is the tuition. Hold a position small enough to survive them and large enough to matter when the world catches up.",
    };
  }
  if (args.bufferW >= 8) {
    return {
      name: "Howard Marks",
      years: "Oaktree",
      school: "Credit · asymmetry, second-level thinking",
      why: "A buffer sleeve is an explicit trade: less upside in exchange for a more tolerable bad year.",
      comment:
        "Asymmetry is the whole game. A laddered buffer does not make you a genius in the melt-up — it makes you a grown-up in the melt-down. You are selling some of the smile to put a floor under the grimace. That is not cowardice. That is second-level thinking: most of the money is made by avoiding the stupid, not by capturing every last tick of the rally.",
    };
  }
  if (args.incomeW >= 8 && args.equity <= 65) {
    return {
      name: "Jeffrey Gundlach",
      years: "DoubleLine",
      school: "Credit · bonds as a living, breathing asset class",
      why: "Private income plus a bond-aware core is a credit-and-carry book, not a duration museum.",
      comment:
        "Bonds are not dead. They are unloved, which is usually the better starting point. An income satellite on top of a real bond book is how a household gets paid to wait without pretending Treasuries are a personality. Credit will have ugly months. Interval funds will remind you that liquidity is a feature you sold. If you needed T+1 on every dollar, you built the wrong portfolio — and if you can live with the gates, you may be buying the one thing public markets are not offering: carry with a lock.",
    };
  }
  if (args.equity <= 20) {
    return {
      name: "Benjamin Graham",
      years: "The Intelligent Investor",
      school: "Value · margin of safety first",
      why: "A capital-preservation mix is Graham's temperament: survive, then compound the residual.",
      comment:
        "The first job of capital is to remain capital. This mix is built so a bad decade in equities is an inconvenience, not a rewrite of the family story. Margin of safety is not a slogan — it is the bond sleeve, the cash-like ballast, and the refusal to need a miracle. The remaining equity is your option on prosperity. Size it so you can be a little greedy later, because you were a little fearful now.",
    };
  }
  if (args.equity <= 40) {
    return {
      name: "Bill Gross",
      years: "PIMCO",
      school: "Bond king · income, roll-down, respect for the cycle",
      why: "An income-led core is a total-return bond book with equities as a kicker.",
      comment:
        "Total return is a team sport: coupon, roll-down, and the occasional equity dividend. This policy lets the bond market do what it does — pay you, scare you, and eventually refinance you. Equities are the kicker, not the identity. If inflation runs hot you will feel the duration. That is the honest contract of an income policy. The investors who last are the ones who collect the coupon and do not confuse a mark-to-market with a verdict.",
    };
  }
  if (args.equity >= 88 && args.growthW > args.valueW + 4) {
    return {
      name: "Peter Lynch",
      years: "Fidelity Magellan",
      school: "GARP · know what you own, growth at a reasonable story",
      why: "A near-all-equity growth mix is a Lynch book: own businesses, live with the quotes.",
      comment:
        "If you can't explain the portfolio to a ten-year-old, you don't own it — it owns you. This one is not that complicated: you are paying for future earnings and you will be quoted a new price every day, most of them rude. The trick is not to become a trader because the ticker turned red. Compounding is boring on purpose. Check in less often than your neighbors, and let the businesses do the work the statements already imply.",
    };
  }
  if (args.satellitePct === 0 && args.equity >= 50 && args.equity <= 70) {
    return {
      name: "John C. Bogle",
      years: "Vanguard",
      school: "Indexing · costs, stay the course, own the haystack",
      why: "A core-only balanced mix is Bogle's sermon: keep costs down and do not tinker.",
      comment:
        "Own the haystack, keep the help from eating it, and stay the course. This policy does the first two well enough — a sensible mix, a published model, no satellite narrative to babysit. The miracle is not in the next clever overlay. It is in the years you did not sell. If you can leave this thing alone, it will do more for the household than a dozen brilliant trades.",
    };
  }
  if (args.equity >= 45 && args.equity <= 70 && args.satellitePct > 0) {
    return {
      name: "Ray Dalio",
      years: "Bridgewater",
      school: "All-weather · balance what you cannot predict",
      why: "A balanced core plus a distinct satellite is an all-weather instinct: uncorrelated sleeves, sized.",
      comment:
        "You cannot predict the next decade with any honesty, so you balance the machines that win in different decades. Stocks, bonds, and a satellite that does not move in lockstep — that is how a household stops needing to be a prophet. Diversification is not owning many tickers. It is owning different economic bets. If this mix feels a little less exciting than a concentrated story, good. Excitement is a cost.",
    };
  }
  return {
    name: "Warren Buffett",
    years: "Berkshire Hathaway",
    school: "Owner-earnings · patience, price, and a long runway",
    why: "A value-aware equity core with ballast is Buffett's temperament: buy earning power and sit still.",
    comment:
      "I like a portfolio that pays me to wait. This one still has a spine of earning-power businesses — value in the engine room, a little growth so you are not a museum, and enough ballast to be greedy when the tape is rude. I would not trade the whole stack for a story that needs a new chapter every quarter. The satellite, if you use one, is seasoning. The core is the meal. Time is the friend of a good business and the enemy of a fidgety shareholder.",
  };
}

export function diagnosticsCopy(d: Diagnostics, allocation: Allocation, input: ModelInput): string {
  const client = input.clientName.trim() || "—";
  const lines = [
    "Falcon Portfolio Diagnostics",
    `Policy: ${allocation.policyTitle}`,
    `Code: ${allocation.policyCode}`,
    `Client: ${client}`,
    `Risk score: ${d.riskScore} (${d.riskLabel})`,
    "",
    d.headline,
    "",
    `Yield ${d.kpis.yieldPct.toFixed(2)}% · ER ${d.kpis.expenseRatio.toFixed(2)}% · Vol ${d.kpis.volPct.toFixed(1)}% · Beta ${d.kpis.betaSpx.toFixed(2)} · Duration ${d.kpis.durationYrs.toFixed(1)}y · Sharpe ${d.kpis.sharpe.toFixed(2)}`,
    "",
    "Underlying holdings",
    `  Core ${formatPct(allocation.coreSleevePct)}${
      allocation.satelliteSleevePct > 0
        ? ` · Satellite ${formatPct(allocation.satelliteSleevePct)}`
        : ""
    } · as of ${CORE_AS_OF}`,
    ...allocation.groups.flatMap((group) => [
      `  ${group.label.padEnd(28)} ${formatPct(group.weight)}`,
      ...group.lines.map(
        (line) =>
          `    ${line.ticker.padEnd(8)} ${formatPct(line.weight).padStart(7)}  ${line.name}`,
      ),
    ]),
    "",
    "Asset allocation",
    ...d.buckets.map((b) => `  ${b.label.padEnd(28)} ${formatPct(b.weight)}`),
    "",
    `Trailing returns vs ${d.trailing.benchmarkLabel} (as of ${d.trailing.asOf})`,
    ...d.trailing.rows.map(
      (row) =>
        `  ${row.label.padEnd(10)} Policy ${formatReturn(row.portfolio).padStart(7)}  Benchmark ${formatReturn(row.benchmark).padStart(7)}  Excess ${formatExcess(row.excess)}`,
    ),
    `  ${d.trailing.note}`,
    "",
    "Scenarios (illustrative)",
    ...d.scenarios.map((s) => `  ${s.label.padEnd(28)} ${s.result.toFixed(1)}%`),
    "",
    "Flags",
    ...d.flags.map((f) => `  [${f.level}] ${f.title} — ${f.detail}`),
    "",
    "Portfolio overview",
    ...d.overview.map((b) => `  • ${b}`),
    "",
    `Hypothetical voice: ${d.voice.name} (${d.voice.years})`,
    `  ${d.voice.comment}`,
    `  *Illustrative only — not an actual statement by ${d.voice.name}.`,
    "",
    "Model diagnostics use representative fund characteristics as of the core model date, not live market data. Scenario results are illustrative, not forecasts. For advisor use only.",
  ];
  return lines.join("\n");
}
