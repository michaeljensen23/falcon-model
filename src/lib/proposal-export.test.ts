import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildProposalEml,
  escapeCsvCell,
  isEmailAddress,
  proposalCsv,
  proposalEmailBody,
  proposalEmailSubject,
} from "./proposal-export.ts";
import { buildAllocation, type ModelInput } from "./portfolio.ts";

describe("proposal email helpers", () => {
  it("accepts ordinary addresses and rejects header-injection shapes", () => {
    assert.equal(isEmailAddress("client@family.com"), true);
    assert.equal(isEmailAddress("not-an-email"), false);
    assert.equal(isEmailAddress("a@b"), false);
    assert.equal(isEmailAddress("client@family.com\nBcc:evil@x.com"), false);
    assert.equal(isEmailAddress("client@family..com"), false);
    assert.equal(isEmailAddress("client@family.com,bcc:evil@x.com"), false);
    assert.equal(isEmailAddress(".client@family.com"), false);
  });

  it("keeps the body generic and strips controls from the subject", () => {
    const body = proposalEmailBody();
    assert.match(body, /Please find attached/);
    assert.equal(body.includes("AVLV"), false);
    assert.equal(proposalEmailSubject("Avery\nChen").includes("\n"), false);
  });

  it("builds a multipart .eml with both attachments", () => {
    const eml = buildProposalEml({
      to: "client@family.com",
      clientName: "Avery Chen",
      pdfName: "proposal.pdf",
      csvName: "holdings.csv",
      pdfBytes: new TextEncoder().encode("%PDF-1.4 test"),
      csvText: "Sleeve,Ticker\nCore,AVLV\n",
    });
    assert.match(eml, /Content-Type: application\/pdf/);
    assert.match(eml, /Content-Type: text\/csv/);
    assert.match(eml, /filename="proposal.pdf"/);
    assert.match(eml, /filename="holdings.csv"/);
    assert.match(eml, /Please find attached/);
  });

  it("neutralizes spreadsheet formula cells in CSV", () => {
    const input: ModelInput = {
      clientName: "Test",
      accountValue: 1_000_000,
      coreEquity: 60,
      satelliteOn: false,
      satelliteWeight: null,
      satelliteSplit: false,
      satelliteTheme: null,
      satelliteThemeB: null,
    };
    const csv = proposalCsv(input, buildAllocation(input));
    for (const line of csv.split("\n")) {
      for (const cell of line.split(",")) {
        assert.equal(/^\s*[=+\-@]/.test(cell), false, cell);
      }
    }
  });

  it("prefixes formula cells that start with whitespace", () => {
    assert.equal(escapeCsvCell("=1+1"), "'=1+1");
    assert.equal(escapeCsvCell(" =1+1"), "' =1+1");
    assert.equal(escapeCsvCell("AVLV"), "AVLV");
    assert.equal(escapeCsvCell('=HYPERLINK("http://evil")').startsWith("\"'="), true);
    assert.equal(escapeCsvCell("line\r=1+1"), "\"line\r=1+1\"");
  });
});
