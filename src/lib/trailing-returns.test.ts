import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildDiagnostics, diagnosticsCopy } from "./diagnostics.ts";
import { buildDiagnosticsPdf } from "./diagnostics-pdf.ts";
import { fundProfile } from "./fund-profiles.ts";
import { buildAllocation, visionFundStatus, type ModelInput } from "./portfolio.ts";
import {
  BNDW_ANN,
  VT_ANN,
  benchmarkAnn,
  benchmarkLabel,
  buildTrailingReturns,
  formatExcess,
  formatReturn,
} from "./trailing-returns.ts";

const base: ModelInput = {
  clientName: "Test Household",
  accountValue: 1_000_000,
  coreEquity: 60,
  satelliteOn: false,
  satelliteWeight: null,
  satelliteSplit: false,
  satelliteTheme: null,
  satelliteThemeB: null,
};

function reportFor(input: ModelInput) {
  const allocation = buildAllocation(input);
  const lines = allocation.lines.map((line) => ({
    ...line,
    profile: fundProfile(line.ticker),
  }));
  return { allocation, trailing: buildTrailingReturns(allocation, lines) };
}

describe("equivalent-weighted VT/BNDW benchmark", () => {
  it("mixes 60/40 as 60% VT and 40% BNDW", () => {
    assert.equal(benchmarkAnn(60, 1), 0.6 * VT_ANN[1] + 0.4 * BNDW_ANN[1]);
    assert.equal(benchmarkAnn(60, 3), 0.6 * VT_ANN[3] + 0.4 * BNDW_ANN[3]);
    assert.equal(benchmarkAnn(60, 5), 0.6 * VT_ANN[5] + 0.4 * BNDW_ANN[5]);
    assert.equal(benchmarkLabel(60, 40), "60/40 · 60% VT / 40% BNDW");
  });

  it("mixes 80/20 as 80% VT and 20% BNDW", () => {
    assert.equal(benchmarkAnn(80, 1), 0.8 * VT_ANN[1] + 0.2 * BNDW_ANN[1]);
    assert.equal(benchmarkLabel(80, 20), "80/20 · 80% VT / 20% BNDW");
  });

  it("uses 100% VT for an all-equity core", () => {
    assert.equal(benchmarkAnn(100, 1), VT_ANN[1]);
    assert.equal(benchmarkAnn(100, 3), VT_ANN[3]);
    assert.equal(benchmarkAnn(100, 5), VT_ANN[5]);
    assert.equal(benchmarkLabel(100, 0), "100/0 · 100% VT");
  });

  it("uses 100% BNDW for an all-fixed core", () => {
    assert.equal(benchmarkAnn(0, 1), BNDW_ANN[1]);
    assert.equal(benchmarkAnn(0, 3), BNDW_ANN[3]);
    assert.equal(benchmarkAnn(0, 5), BNDW_ANN[5]);
    assert.equal(benchmarkLabel(0, 100), "0/100 · 100% BNDW");
  });
});

describe("buildTrailingReturns", () => {
  it("compares a 60/40 policy to the 60/40 VT/BNDW mix on 1/3/5 year windows", () => {
    const { trailing } = reportFor(base);
    assert.equal(trailing.rows.length, 3);
    assert.deepEqual(
      trailing.rows.map((r) => r.years),
      [1, 3, 5],
    );
    assert.equal(trailing.benchmarkLabel, "60/40 · 60% VT / 40% BNDW");
    assert.equal(trailing.rows[0]!.benchmark, benchmarkAnn(60, 1));
    assert.equal(trailing.rows[1]!.benchmark, benchmarkAnn(60, 3));
    assert.equal(trailing.rows[2]!.benchmark, benchmarkAnn(60, 5));
    for (const row of trailing.rows) {
      assert.equal(row.excess, row.portfolio - row.benchmark);
    }
    assert.match(trailing.note, /same equity\/fixed split/);
  });

  it("keeps the core mix as the benchmark when a crypto satellite is on", () => {
    const core = reportFor({ ...base, coreEquity: 80 });
    const sat = reportFor({
      ...base,
      coreEquity: 80,
      satelliteOn: true,
      satelliteWeight: 20,
      satelliteSplit: false,
      satelliteTheme: "crypto",
    });
    assert.equal(sat.trailing.benchmarkLabel, "80/20 · 80% VT / 20% BNDW");
    assert.equal(sat.trailing.rows[0]!.benchmark, core.trailing.rows[0]!.benchmark);
    assert.ok(sat.trailing.rows[0]!.portfolio > core.trailing.rows[0]!.portfolio);
    assert.match(sat.trailing.note, /satellite overlay/);
  });
});

describe("return formatters", () => {
  it("formats signed excess after rounding to one decimal", () => {
    assert.equal(formatReturn(9.88), "9.9%");
    assert.equal(formatReturn(-0.89), "-0.9%");
    assert.equal(formatExcess(1.34), "+1.3%");
    assert.equal(formatExcess(-2.21), "-2.2%");
    assert.equal(formatExcess(0.04), "0.0%");
    assert.equal(formatExcess(-0.04), "0.0%");
  });
});

describe("diagnostics surfaces", () => {
  it("embeds trailing returns above scenarios in copy and the PDF", () => {
    const allocation = buildAllocation(base);
    const report = buildDiagnostics(allocation, base, visionFundStatus(base));
    const copy = diagnosticsCopy(report, allocation, base);
    const trailAt = copy.indexOf("Trailing returns vs 60/40");
    const sceneAt = copy.indexOf("Scenarios (illustrative)");
    assert.ok(trailAt >= 0);
    assert.ok(sceneAt > trailAt);
    assert.match(copy, /1-year/);
    assert.match(copy, /3-year/);
    assert.match(copy, /5-year/);

    const pdf = buildDiagnosticsPdf(base, allocation, report, "Jordan Hale");
    const text = Buffer.from(pdf).toString("latin1");
    const pdfTrail = text.indexOf("Trailing returns vs benchmark");
    const pdfScene = text.indexOf("Scenario analysis");
    assert.ok(pdfTrail >= 0);
    assert.ok(pdfScene > pdfTrail);
    assert.match(text, /60% VT \/ 40% BNDW/);
    assert.match(text, /1-YEAR/);
    assert.match(text, /3-YEAR/);
    assert.match(text, /5-YEAR/);
    assert.match(text, /FALCON WEALTH/);
    assert.match(text, /0\.08842 0\.98665 m/);
    assert.match(text, /0\.890 0\.792 0\.404 rg/);
    assert.equal(text.includes("/ImSwirl"), false);
    assert.equal(text.includes("DCTDecode"), false);
  });

  it("lists underlying holdings above asset allocation in copy and the PDF", () => {
    const allocation = buildAllocation(base);
    const report = buildDiagnostics(allocation, base, visionFundStatus(base));
    const copy = diagnosticsCopy(report, allocation, base);
    const holdAt = copy.indexOf("Underlying holdings");
    const allocAt = copy.indexOf("Asset allocation");
    assert.ok(holdAt >= 0);
    assert.ok(allocAt > holdAt);
    assert.match(copy, /AVLV/);
    assert.match(copy, /Core Equity/);

    const pdf = buildDiagnosticsPdf(base, allocation, report, "Jordan Hale");
    const text = Buffer.from(pdf).toString("latin1");
    const pdfHold = text.indexOf("Underlying holdings");
    const pdfAlloc = text.indexOf("Asset allocation");
    assert.ok(pdfHold >= 0);
    assert.ok(pdfAlloc > pdfHold);
    assert.match(text, /AVLV/);
    assert.match(text, /Core Equity/);
  });
});
