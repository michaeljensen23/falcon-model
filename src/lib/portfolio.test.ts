import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { corePositionsForMix } from "./core-model.ts";
import { buildAllocation, type ModelInput } from "./portfolio.ts";

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

describe("core and look-through holdings sort", () => {
  it("orders core equity and fixed income greatest to least", () => {
    const equity = corePositionsForMix(60).filter((row) => row.kind === "equity");
    const fixed = corePositionsForMix(60).filter((row) => row.kind === "fixed");
    for (let i = 1; i < equity.length; i++) {
      assert.ok(equity[i - 1]!.coreWeight >= equity[i]!.coreWeight);
    }
    for (let i = 1; i < fixed.length; i++) {
      assert.ok(fixed[i - 1]!.coreWeight >= fixed[i]!.coreWeight);
    }
    assert.equal(equity[0]?.ticker, "AVLV");
  });

  it("keeps look-through lines greatest to least inside each group", () => {
    const allocation = buildAllocation({
      ...base,
      satelliteOn: true,
      satelliteWeight: 20,
      satelliteSplit: true,
      satelliteTheme: "crypto",
      satelliteThemeB: "ai",
    });
    assert.ok(allocation.groups.length > 0);
    for (const group of allocation.groups) {
      for (let i = 1; i < group.lines.length; i++) {
        assert.ok(group.lines[i - 1]!.weight >= group.lines[i]!.weight);
      }
    }
    const total = allocation.lines.reduce((sum, line) => sum + line.weight, 0);
    assert.ok(Math.abs(total - 100) < 0.001);
  });
});
