import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildDiscoveryPdf } from "./discovery-pdf.ts";
import { DISCOVERY_SECTIONS, discoveryFileStem } from "./discovery-pq.ts";
import { embedTrueType, loadCalibriFonts } from "./ttf-embed.ts";

function latin1(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("latin1");
}

describe("discovery PQ", () => {
  it("names the download after the household", () => {
    assert.equal(discoveryFileStem("The Chen Family"), "Falcon-PQ-Discovery-Facts-The-Chen-Family");
    assert.equal(discoveryFileStem("  "), "Falcon-PQ-Discovery-Facts-client");
  });

  it("has fourteen titled sections", () => {
    assert.equal(DISCOVERY_SECTIONS.length, 14);
    const titles = DISCOVERY_SECTIONS.map((s) => s.title);
    assert.deepEqual(titles, [
      "Household & contact",
      "Family, dependents & key relationships",
      "Employment, business & career",
      "Income sources",
      "Expenses, savings rate & cash flow",
      "Assets & investment accounts",
      "Liabilities, credit & guarantees",
      "Retirement picture",
      "Tax picture",
      "Insurance & protection",
      "Estate, beneficiaries & legacy",
      "Education, family support & major goals",
      "Investment experience, risk & values",
      "Other advisors, documents & next steps",
    ]);
  });

  it("embeds Calibri and prints every section for the named client", async () => {
    const fonts = await loadCalibriFonts();
    assert.equal(fonts.regular.fontName, "Calibri");
    assert.equal(fonts.bold.fontName, "Calibri-Bold");
    assert.equal(fonts.regular.widths.length, 95);
    assert.ok(fonts.regular.widths[0]! > 100 && fonts.regular.widths[0]! < 400);

    const bytes = await buildDiscoveryPdf({
      clientName: "Ava Chen",
      advisorName: "Jordan Blake",
      accountValue: 2_400_000,
    });
    const copy = latin1(bytes);
    assert.match(copy, /%PDF-1.4/);
    assert.ok(copy.includes("/BaseFont /Calibri "));
    assert.ok(copy.includes("/BaseFont /Calibri-Bold"));
    assert.equal(copy.includes("/BaseFont /Helvetica"), false);
    assert.match(copy, /\/Subtype \/TrueType/);
    assert.match(copy, /Ava Chen/);
    assert.match(copy, /Jordan Blake/);
    assert.match(copy, /DISCOVERY FACTS/);
    assert.match(copy, /Planning Questionnaire/);
    for (const section of DISCOVERY_SECTIONS) {
      assert.match(copy, new RegExp(section.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    }
    assert.match(copy, /TAX PICTURE/);
    assert.match(copy, /Acknowledgement/);
    assert.ok(bytes.byteLength > 200_000, `PDF too small to hold embedded Calibri (${bytes.byteLength})`);
  });

  it("rejects truncated or named-hostile font bytes", () => {
    assert.throws(() => embedTrueType(new Uint8Array(8), "Calibri"), /Invalid font/);
    assert.throws(() => embedTrueType(new Uint8Array(64), "Calibri/Helvetica"), /Invalid font name/);
  });
});
