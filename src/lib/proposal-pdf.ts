import {
  assemblePdf,
  dateLabel,
  fit,
  INK,
  CREAM,
  PAPER,
  MUTED,
  RULE,
  WARN,
  WARN_BG,
  NAVY,
  GOLD,
  MARGIN,
  PAGE_W,
  FOOTER_Y,
  PdfDoc,
  measure,
  wrap,
  type RGB,
} from "./pdf-kit";
import {
  CORE_AS_OF,
  formatEr,
  formatPct,
  formatUsd,
  visionFundStatus,
  VISION_FUND_MIN,
  VISION_FUND_NAME,
  type Allocation,
  type ModelInput,
  type SleeveKind,
} from "./portfolio";

function sleeveRgb(kind: SleeveKind): RGB {
  switch (kind) {
    case "equity":
      return [0.302, 0.388, 0.337];
    case "fixed":
      return [0.29, 0.361, 0.42];
    case "alt-income":
      return [0.416, 0.384, 0.345];
    case "alt-equity":
      return [0.243, 0.325, 0.282];
    case "crypto":
      return [0.42, 0.337, 0.282];
    case "ai":
      return [0.31, 0.345, 0.329];
    case "buffer":
      return [0.361, 0.341, 0.282];
  }
}

export function buildProposalPdf(
  input: ModelInput,
  allocation: Allocation,
  advisorName: string,
): Uint8Array {
  const doc = new PdfDoc("FALCON PORTFOLIO PROPOSAL");
  const client = input.clientName.trim() || "Client proposal";
  const advisor = advisorName.trim() || "Falcon advisor";
  const aum = input.accountValue === null ? "Not specified" : formatUsd(input.accountValue);
  const date = dateLabel();

  drawCover(doc, {
    client,
    advisor,
    aum,
    date,
    allocation,
  });
  drawKpis(doc, allocation);
  drawBar(doc, allocation);
  drawVision(doc, input);
  drawHoldings(doc, input, allocation);
  drawDisclaimer(doc);

  return assemblePdf(doc, {
    title: `Falcon Portfolio Proposal - ${client} - ${allocation.policyCode}`,
    footerLeft: "Confidential  ·  Falcon Core-Satellite Model",
  });
}

function drawCover(
  doc: PdfDoc,
  meta: {
    client: string;
    advisor: string;
    aum: string;
    date: string;
    allocation: Allocation;
  },
): void {
  const bandH = 92;
  const bandY = doc.y - bandH;
  doc.fillRect(MARGIN, bandY, doc.contentWidth, bandH, NAVY);
  doc.fillRect(MARGIN, bandY + bandH - 2.2, doc.contentWidth, 2.2, GOLD);
  doc.falconMark(MARGIN + 16, bandY + 54, 22);
  doc.text("FALCON WEALTH", MARGIN + 46, bandY + 68, 11, "HB", PAPER);
  doc.text("P O R T F O L I O   P R O P O S A L", MARGIN + 46, bandY + 54, 8, "H", CREAM);
  doc.textRight(meta.date, PAGE_W - MARGIN - 16, bandY + 68, 8, "H", CREAM);
  doc.textRight("Advisor use only", PAGE_W - MARGIN - 16, bandY + 54, 8, "H", CREAM);
  doc.text("Prepared for", MARGIN + 16, bandY + 28, 8, "H", CREAM);
  const clientSize = meta.client.length > 42 ? 14 : 18;
  doc.text(fit(meta.client, clientSize, doc.contentWidth - 32, true), MARGIN + 16, bandY + 12, clientSize, "TB", PAPER);
  doc.y = bandY - 18;

  for (const line of wrap(meta.allocation.policyTitle, 15, doc.contentWidth, true).slice(0, 3)) {
    doc.text(line, MARGIN, doc.y, 15, "TB");
    doc.y -= 17;
  }
  doc.text(meta.allocation.policyCode, MARGIN, doc.y, 9, "HB", MUTED);
  doc.y -= 18;

  const col = doc.contentWidth / 3;
  metaRow(doc, MARGIN, "Advisor", meta.advisor, col - 10);
  metaRow(doc, MARGIN + col, "Account value", meta.aum, col - 10);
  metaRow(doc, MARGIN + col * 2, "Core model as of", CORE_AS_OF, col);
  doc.y -= 28;
  doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, RULE, 0.7);
  doc.y -= 16;
}

function metaRow(doc: PdfDoc, x: number, label: string, value: string, max: number): void {
  doc.text(label.toUpperCase(), x, doc.y, 7, "HB", MUTED);
  const lines = wrap(value, 10, max, false);
  lines.slice(0, 2).forEach((line, i) => {
    doc.text(line, x, doc.y - 12 - i * 11, 10, "H");
  });
}

function drawKpis(doc: PdfDoc, allocation: Allocation): void {
  doc.ensure(70);
  const gap = 8;
  const boxW = (doc.contentWidth - gap * 3) / 4;
  const boxH = 52;
  const y = doc.y - boxH;
  const equityPct = allocation.groups.find((g) => g.kind === "equity")?.weight ?? 0;
  const fixedPct = allocation.groups.find((g) => g.kind === "fixed")?.weight ?? 0;
  const tiles: { label: string; value: string; accent: RGB }[] = [
    { label: "Core equity", value: formatPct(equityPct), accent: sleeveRgb("equity") },
    { label: "Core fixed income", value: formatPct(fixedPct), accent: sleeveRgb("fixed") },
    {
      label: "Satellite",
      value: allocation.satelliteSleevePct ? formatPct(allocation.satelliteSleevePct) : "None",
      accent: INK,
    },
    { label: "Account ER", value: formatEr(allocation.portfolioWeightedEr), accent: MUTED },
  ];
  tiles.forEach((tile, i) => {
    const x = MARGIN + i * (boxW + gap);
    doc.fillRect(x, y, boxW, boxH, PAPER);
    doc.strokeRect(x, y, boxW, boxH, RULE, 0.6);
    doc.fillRect(x, y, 3, boxH, tile.accent);
    doc.text(tile.label.toUpperCase(), x + 10, y + 36, 7, "HB", MUTED);
    doc.text(tile.value, x + 10, y + 16, 14, "TB");
  });
  doc.y = y - 18;
}

function drawBar(doc: PdfDoc, allocation: Allocation): void {
  doc.ensure(56);
  doc.text("STRATEGIC ALLOCATION", MARGIN, doc.y, 8, "HB", MUTED);
  doc.y -= 12;
  const barH = 14;
  const y = doc.y - barH;
  let x = MARGIN;
  for (const sleeve of allocation.sleeves) {
    const w = (sleeve.weight / 100) * doc.contentWidth;
    if (w <= 0.4) continue;
    doc.fillRect(x, y, w, barH, sleeveRgb(sleeve.kind));
    if (w >= 42) {
      doc.text(formatPct(sleeve.weight), x + 4, y + 4, 7, "HB", PAPER);
    }
    x += w;
  }
  doc.y = y - 14;
  let legendX = MARGIN;
  for (const sleeve of allocation.sleeves) {
    doc.fillRect(legendX, doc.y, 6, 6, sleeveRgb(sleeve.kind));
    const label = `${sleeve.label}  ${formatPct(sleeve.weight)}`;
    doc.text(label, legendX + 9, doc.y, 8, "H", MUTED);
    legendX += measure(label, 8) + 22;
    if (legendX > PAGE_W - MARGIN - 80) {
      legendX = MARGIN;
      doc.y -= 12;
    }
  }
  doc.y -= 20;
}

function drawVision(doc: PdfDoc, input: ModelInput): void {
  const vision = visionFundStatus(input);
  if (!vision.applies) return;
  doc.ensure(46);
  const h = 40;
  const y = doc.y - h;
  doc.fillRect(MARGIN, y, doc.contentWidth, h, WARN_BG);
  doc.fillRect(MARGIN, y, 3, h, WARN);
  const title =
    vision.ok === false
      ? `${VISION_FUND_NAME} is below the ${formatUsd(VISION_FUND_MIN)} sleeve minimum.`
      : `${VISION_FUND_NAME} sleeve meets the ${formatUsd(VISION_FUND_MIN)} minimum.`;
  doc.text(title, MARGIN + 12, y + 24, 9, "HB", WARN);
  const detail =
    vision.ok === false && vision.shortfall !== null
      ? `Satellite sleeve ${formatUsd(vision.satelliteDollars ?? 0)}. Shortfall ${formatUsd(vision.shortfall)}.`
      : "Eligible investors only. Subject to a separate fund subscription.";
  doc.text(detail, MARGIN + 12, y + 10, 8, "H", INK);
  doc.y = y - 16;
}

function drawHoldings(doc: PdfDoc, input: ModelInput, allocation: Allocation): void {
  doc.ensure(48);
  doc.text("LOOK-THROUGH HOLDINGS", MARGIN, doc.y, 8, "HB", MUTED);
  doc.y -= 6;
  doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, INK, 0.9);
  doc.y -= 14;

  const showAmt = input.accountValue !== null;
  const right = PAGE_W - MARGIN;
  const amtX = right;
  const acctX = showAmt ? right - 78 : right;
  const modelX = acctX - 62;
  const tickerX = MARGIN + 8;
  const nameX = MARGIN + 58;
  const nameMax = modelX - nameX - 8;

  for (const group of allocation.groups) {
    doc.ensure(36);
    doc.fillRect(MARGIN, doc.y - 6, doc.contentWidth, 16, CREAM);
    doc.fillRect(MARGIN, doc.y - 6, 3, 16, sleeveRgb(group.kind));
    doc.text(group.label.toUpperCase(), MARGIN + 10, doc.y, 8, "HB");
    doc.textRight(formatPct(group.weight), right - 4, doc.y, 8, "HB");
    doc.y -= 16;
    doc.text("TICKER", tickerX, doc.y, 6.5, "HB", MUTED);
    doc.text("HOLDING", nameX, doc.y, 6.5, "HB", MUTED);
    doc.textRight("MODEL", modelX, doc.y, 6.5, "HB", MUTED);
    doc.textRight("ACCOUNT", acctX, doc.y, 6.5, "HB", MUTED);
    if (showAmt) doc.textRight("AMOUNT", amtX, doc.y, 6.5, "HB", MUTED);
    doc.y -= 5;
    doc.line(MARGIN, doc.y, right, doc.y, RULE, 0.4);
    doc.y -= 12;

    for (const line of group.lines) {
      if (doc.y - 16 < FOOTER_Y + 22) {
        doc.addPage(true);
        doc.fillRect(MARGIN, doc.y - 6, doc.contentWidth, 16, CREAM);
        doc.fillRect(MARGIN, doc.y - 6, 3, 16, sleeveRgb(group.kind));
        doc.text(`${group.label.toUpperCase()}  (continued)`, MARGIN + 10, doc.y, 8, "HB");
        doc.y -= 18;
      }
      doc.text(line.ticker, tickerX, doc.y, 8, "HB");
      const name = wrap(line.name, 8, nameMax)[0] ?? line.name;
      doc.text(name, nameX, doc.y, 8, "H");
      doc.textRight(line.coreWeight === null ? "-" : formatPct(line.coreWeight), modelX, doc.y, 8, "H", MUTED);
      doc.textRight(formatPct(line.weight), acctX, doc.y, 8, "H");
      if (showAmt && input.accountValue !== null) {
        doc.textRight(formatUsd((line.weight / 100) * input.accountValue), amtX, doc.y, 8, "H");
      }
      doc.y -= 13;
    }
    doc.y -= 8;
  }
}

function drawDisclaimer(doc: PdfDoc): void {
  doc.ensure(48);
  doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, RULE, 0.5);
  doc.y -= 12;
  const copy =
    "For advisor use only. Model policy weights as of " +
    CORE_AS_OF +
    ". Not a recommendation or an offer to sell securities. Private investments and Falcon Vision Fund I are available only to eligible investors and are subject to separate subscription documents and minimums. Past performance is not indicative of future results.";
  for (const line of wrap(copy, 7.5, doc.contentWidth)) {
    doc.ensure(12);
    doc.text(line, MARGIN, doc.y, 7.5, "H", MUTED);
    doc.y -= 10;
  }
}
