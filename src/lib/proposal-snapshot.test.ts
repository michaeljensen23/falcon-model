import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseProposalSnapshot } from "./proposal-snapshot.ts";

const valid = {
  clientName: "Avery Chen",
  accountValue: 1_000_000,
  coreEquity: 60,
  satelliteOn: false,
  satelliteWeight: null,
  satelliteSplit: false,
  satelliteTheme: null,
  satelliteThemeB: null,
};

describe("parseProposalSnapshot", () => {
  it("accepts a well-formed core-only mix", () => {
    const parsed = parseProposalSnapshot(valid);
    assert.equal(parsed.clientName, "Avery Chen");
    assert.equal(parsed.coreEquity, 60);
    assert.equal(parsed.satelliteOn, false);
  });

  it("rejects junk JSON, arrays, and oversized payloads", () => {
    assert.throws(() => parseProposalSnapshot("{"), /Invalid proposal snapshot/);
    assert.throws(() => parseProposalSnapshot("x".repeat(40_000)), /Invalid proposal snapshot/);
    assert.throws(() => parseProposalSnapshot([]), /Invalid proposal snapshot/);
    assert.throws(
      () => parseProposalSnapshot({ ...valid, clientName: "A".repeat(200) }),
      /Invalid client name/,
    );
    assert.throws(
      () => parseProposalSnapshot({ ...valid, padding: "x".repeat(40_000) }),
      /Invalid proposal snapshot/,
    );
  });

  it("rejects negative and oversized account values", () => {
    assert.throws(() => parseProposalSnapshot({ ...valid, accountValue: -1 }), /Invalid account value/);
    assert.throws(
      () => parseProposalSnapshot({ ...valid, accountValue: 1e15 }),
      /Invalid account value/,
    );
  });

  it("clears split state unless the overlay is 20%", () => {
    const parsed = parseProposalSnapshot({
      ...valid,
      satelliteOn: true,
      satelliteWeight: 10,
      satelliteSplit: true,
      satelliteTheme: "crypto",
      satelliteThemeB: "ai",
    });
    assert.equal(parsed.satelliteSplit, false);
    assert.equal(parsed.satelliteThemeB, null);
    assert.equal(parsed.satelliteTheme, "crypto");
  });

  it("rejects a 20% split that repeats the same theme", () => {
    assert.throws(
      () =>
        parseProposalSnapshot({
          ...valid,
          satelliteOn: true,
          satelliteWeight: 20,
          satelliteSplit: true,
          satelliteTheme: "crypto",
          satelliteThemeB: "crypto",
        }),
      /Invalid satellite theme/,
    );
  });

  it("allows an empty client name on the draft snapshot", () => {
    const parsed = parseProposalSnapshot({ ...valid, clientName: "   " });
    assert.equal(parsed.clientName, "");
  });

  it("strips control characters from the client name", () => {
    const parsed = parseProposalSnapshot({
      ...valid,
      clientName: "Avery\nChen\r",
    });
    assert.equal(parsed.clientName, "AveryChen");
  });
});
