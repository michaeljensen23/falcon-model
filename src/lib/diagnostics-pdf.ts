import {
  ALERT,
  ALERT_BG,
  assemblePdf,
  CREAM,
  dateLabel,
  fit,
  INK,
  MARGIN,
  MUTED,
  NAVY,
  NAVY_LIFT,
  GOLD,
  OK,
  OK_BG,
  PAGE_H,
  PAGE_W,
  PAPER,
  PdfDoc,
  RULE,
  SAGE,
  SOFT,
  WARN,
  WARN_BG,
  WASH,
  FOOTER_Y,
  measure,
  wrap,
  type RGB,
} from "./pdf-kit";
import {
  CORE_AS_OF,
  formatEr,
  formatPct,
  formatUsd,
  type Allocation,
  type ModelInput,
  type SleeveKind,
} from "./portfolio";
import type { Diagnostics, NamedShare, StyleCell } from "./diagnostics";
import { formatExcess, formatReturn } from "./trailing-returns";

const R = 8;
const R_SM = 5;
const GAP = 12;
const INSET = 14;

const KPI_CAPTION: Record<string, string> = {
  risk: "Vol + beta blend",
  yield: "Look-through income",
  er: "Asset-weighted fee",
  vol: "Stylized volatility",
  beta: "Vs 1% S&P move",
  duration: "Rate sensitivity",
  sharpe: "Return per unit risk",
  drawdown: "Severe-path loss",
};

function shareRgb(color: string): RGB {
  switch (color) {
    case "var(--color-equity)":
      return [0.22, 0.33, 0.27];
    case "var(--color-fixed)":
      return [0.22, 0.31, 0.38];
    case "var(--color-ok)":
      return [0.18, 0.32, 0.24];
    case "var(--color-sat-income)":
      return [0.38, 0.34, 0.28];
    case "var(--color-sat-equity)":
      return [0.18, 0.28, 0.23];
    case "var(--color-sat-crypto)":
      return [0.4, 0.28, 0.2];
    case "var(--color-sat-ai)":
      return [0.26, 0.32, 0.3];
    case "var(--color-sat-buffer)":
      return [0.33, 0.3, 0.22];
    case "var(--color-warn)":
      return [0.48, 0.3, 0.14];
    case "var(--color-destructive)":
      return [0.56, 0.22, 0.18];
    default:
      return MUTED;
  }
}

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

function heading(doc: PdfDoc, title: string, kicker?: string, minBody = 72): void {
  doc.ensure(46 + minBody);
  if (kicker) {
    doc.text(kicker.toUpperCase(), MARGIN, doc.y, 7, "HB", SAGE);
    doc.y -= 15;
  }
  doc.text(title, MARGIN, doc.y, 16, "TB");
  doc.y -= 8;
  doc.fillRoundRect(MARGIN, doc.y, 28, 2, 1, SAGE);
  doc.y -= 14;
}

function intro(doc: PdfDoc, copy: string): void {
  for (const line of wrap(copy, 8.5, doc.contentWidth)) {
    doc.text(line, MARGIN, doc.y, 8.5, "H", MUTED);
    doc.y -= 12;
  }
  doc.y -= 8;
}

export function buildDiagnosticsPdf(
  input: ModelInput,
  allocation: Allocation,
  report: Diagnostics,
  advisorName: string,
): Uint8Array {
  const doc = new PdfDoc("FALCON X-RAY  ·  PORTFOLIO DIAGNOSTICS", { pageFill: WASH });
  const client = input.clientName.trim() || "Client proposal";
  const advisor = advisorName.trim() || "Falcon advisor";
  const aum = input.accountValue === null ? "Not specified" : formatUsd(input.accountValue);
  const date = dateLabel();

  drawCover(doc, { client, advisor, aum, date, allocation, report });
  drawKpis(doc, report);
  drawHoldings(doc, input, allocation);
  drawAllocation(doc, report, input.accountValue);
  drawSplit(doc, report);
  drawSectors(doc, report);
  drawFactors(doc, report);
  drawTrailing(doc, report);
  drawScenarios(doc, report);
  drawLiquidityIncome(doc, report, input.accountValue);
  drawFlags(doc, report);
  drawOverview(doc, report);
  drawVoice(doc, report);
  drawDisclaimer(doc);

  return assemblePdf(doc, {
    title: `Falcon X-Ray - ${client} - ${allocation.policyCode}`,
    footerLeft: "Confidential  ·  Falcon X-Ray diagnostics  ·  Advisor use only",
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
    report: Diagnostics;
  },
): void {
  const bandH = 240;
  const bandY = PAGE_H - bandH;
  doc.fillRect(0, bandY, PAGE_W, bandH, NAVY);
  doc.fillRect(0, bandY, PAGE_W, 3.5, GOLD);

  doc.save();
  doc.setAlpha(16);
  doc.falconMark(PAGE_W - 188, bandY + 108, 148);
  doc.restore();

  doc.falconMark(MARGIN, bandY + bandH - 42, 28);
  doc.text("FALCON WEALTH", MARGIN + 36, bandY + bandH - 18, 11, "HB", PAPER);
  doc.text("PORTFOLIO X-RAY", MARGIN + 36, bandY + bandH - 32, 8, "H", CREAM);
  doc.textRight(meta.date, PAGE_W - MARGIN, bandY + bandH - 18, 8, "H", CREAM);
  doc.textRight("Advisor use only", PAGE_W - MARGIN, bandY + bandH - 32, 8, "H", CREAM);

  doc.text("Prepared for", MARGIN, bandY + 156, 8, "H", CREAM);
  const clientSize = meta.client.length > 32 ? 18 : 24;
  doc.text(
    fit(meta.client, clientSize, doc.contentWidth - 8, true),
    MARGIN,
    bandY + 128,
    clientSize,
    "TB",
    PAPER,
  );

  const policy = wrap(meta.allocation.policyTitle, 10, doc.contentWidth - 4).slice(0, 2);
  policy.forEach((line, i) => {
    doc.text(line, MARGIN, bandY + 108 - i * 13, 10, "H", CREAM);
  });

  const code = meta.allocation.policyCode;
  const codeW = measure(code, 7.5, true) + 16;
  const codeY = bandY + 76;
  doc.fillRoundRect(MARGIN, codeY, codeW, 16, 8, NAVY_LIFT);
  doc.text(code, MARGIN + 8, codeY + 5, 7.5, "HB", CREAM);

  const cardH = 46;
  const cardW = (doc.contentWidth - GAP * 2) / 3;
  const y = bandY + 14;
  const cells: [string, string][] = [
    ["Advisor", meta.advisor],
    ["Account value", meta.aum],
    ["Risk budget", `${meta.report.riskScore}  ·  ${meta.report.riskLabel}`],
  ];
  cells.forEach((cell, i) => {
    const x = MARGIN + i * (cardW + GAP);
    doc.fillRoundRect(x, y, cardW, cardH, R_SM, NAVY_LIFT);
    if (i === 2) {
      doc.save();
      doc.clipRoundRect(x, y, cardW, cardH, R_SM);
      doc.fillRect(x, y, 3, cardH, SAGE);
      doc.restore();
    }
    doc.text(cell[0].toUpperCase(), x + 12, y + 32, 6.5, "HB", CREAM);
    doc.text(fit(cell[1], 11, cardW - 22), x + 12, y + 14, 11, "H", PAPER);
  });

  doc.y = bandY - 18;

  const headLines = wrap(meta.report.headline, 9.5, doc.contentWidth - 28).slice(0, 3);
  const headH = 22 + headLines.length * 13;
  doc.ensure(headH);
  const hy = doc.y - headH;
  doc.panel(MARGIN, hy, doc.contentWidth, headH, { fill: CREAM, r: R_SM });
  doc.save();
  doc.clipRoundRect(MARGIN, hy, doc.contentWidth, headH, R_SM);
  doc.fillRect(MARGIN, hy + headH - 2.4, doc.contentWidth, 2.4, SAGE);
  doc.restore();
  headLines.forEach((line, i) => {
    doc.text(line, MARGIN + 14, hy + headH - 16 - i * 13, 9.5, "H");
  });
  doc.y = hy - 22;
}

function drawKpis(doc: PdfDoc, report: Diagnostics): void {
  const tiles: { label: string; value: string; caption: string; hero?: boolean }[] = [
    { label: "Risk score", value: String(report.riskScore), caption: KPI_CAPTION.risk!, hero: true },
    { label: "Est. yield", value: `${report.kpis.yieldPct.toFixed(2)}%`, caption: KPI_CAPTION.yield! },
    { label: "Weighted ER", value: formatEr(report.kpis.expenseRatio), caption: KPI_CAPTION.er! },
    { label: "Est. volatility", value: `${report.kpis.volPct.toFixed(1)}%`, caption: KPI_CAPTION.vol! },
    { label: "Beta vs S&P 500", value: report.kpis.betaSpx.toFixed(2), caption: KPI_CAPTION.beta! },
    { label: "Bond duration", value: `${report.kpis.durationYrs.toFixed(1)}y`, caption: KPI_CAPTION.duration! },
    { label: "Sharpe (est.)", value: report.kpis.sharpe.toFixed(2), caption: KPI_CAPTION.sharpe! },
    { label: "Est. max drawdown", value: `${report.kpis.maxDdPct.toFixed(0)}%`, caption: KPI_CAPTION.drawdown! },
  ];
  const boxW = (doc.contentWidth - GAP * 3) / 4;
  const boxH = 92;
  heading(doc, "Key diagnostics", "01  ·  How to read the numbers", boxH * 2 + GAP + 8);
  doc.ensure(boxH * 2 + GAP + 8);
  const startY = doc.y;
  tiles.forEach((tile, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const x = MARGIN + col * (boxW + GAP);
    const y = startY - boxH - row * (boxH + GAP);
    if (tile.hero) {
      doc.panel(x, y, boxW, boxH, { fill: INK, r: R_SM, stroke: false });
    } else {
      doc.panel(x, y, boxW, boxH, { r: R_SM });
    }
    const ink = tile.hero ? PAPER : INK;
    const muted = tile.hero ? CREAM : MUTED;
    doc.text(tile.label.toUpperCase(), x + 12, y + boxH - 16, 6.5, "HB", muted);
    doc.text(tile.value, x + 12, y + 42, 22, "TB", ink);
    doc.text(fit(tile.caption, 7, boxW - 22), x + 12, y + 18, 7, "H", muted);
  });
  doc.y = startY - boxH * 2 - GAP - 18;
}

function drawHoldings(doc: PdfDoc, input: ModelInput, allocation: Allocation): void {
  const sat = allocation.satelliteSleevePct > 0;
  const kicker = sat
    ? `02  ·  Core ${formatPct(allocation.coreSleevePct)}  ·  Satellite ${formatPct(allocation.satelliteSleevePct)}  ·  as of ${CORE_AS_OF}`
    : `02  ·  Core ${formatPct(allocation.coreSleevePct)}  ·  as of ${CORE_AS_OF}`;
  heading(doc, "Underlying holdings", kicker, 168);
  intro(
    doc,
    "Look-through positions in this policy. Core Equity and Core Fixed Income are sorted greatest to least. Account % is of the whole book after any satellite overlay.",
  );

  const showAmt = input.accountValue !== null;
  const right = PAGE_W - MARGIN;
  const amtX = right - 14;
  const acctX = showAmt ? right - 86 : right - 14;
  const modelX = acctX - 58;
  const tickerX = MARGIN + 16;
  const nameX = MARGIN + 64;
  const nameMax = modelX - nameX - 10;
  const rowH = 18;
  const headH = 42;
  const padB = 12;

  function colHeads(y: number): void {
    doc.text("Ticker", tickerX, y, 6.5, "HB", MUTED);
    doc.text("Holding", nameX, y, 6.5, "HB", MUTED);
    doc.textRight("Model", modelX, y, 6.5, "HB", MUTED);
    doc.textRight("Account", acctX, y, 6.5, "HB", MUTED);
    if (showAmt) doc.textRight("Amount", amtX, y, 6.5, "HB", MUTED);
  }

  for (const group of allocation.groups) {
    let offset = 0;
    let continued = false;
    while (offset < group.lines.length) {
      const remaining = group.lines.length - offset;
      let avail = doc.y - (FOOTER_Y + 28);
      let fitRows = Math.floor((avail - headH - padB) / rowH);
      if (fitRows < 3 && remaining > 0) {
        doc.addPage(true);
        avail = doc.y - (FOOTER_Y + 28);
        fitRows = Math.floor((avail - headH - padB) / rowH);
      }
      fitRows = Math.max(1, Math.min(Math.max(fitRows, 1), remaining));
      const h = headH + fitRows * rowH + padB;
      const y = doc.y - h;
      doc.panel(MARGIN, y, doc.contentWidth, h);
      const top = y + h;
      doc.fillCircle(MARGIN + 18, top - 18, 3.4, sleeveRgb(group.kind));
      const title = continued ? `${group.label}  ·  continued` : group.label;
      doc.text(fit(title, 9, doc.contentWidth - 90, true), MARGIN + 28, top - 22, 9, "HB");
      doc.textRight(formatPct(group.weight), right - 16, top - 22, 9, "HB", MUTED);
      const hy = top - 38;
      colHeads(hy);
      doc.line(MARGIN + 14, hy - 5, right - 14, hy - 5, RULE, 0.4);

      for (let i = 0; i < fitRows; i++) {
        const line = group.lines[offset + i]!;
        const ry = hy - 18 - i * rowH;
        if (i > 0) doc.line(MARGIN + 14, ry + 11, right - 14, ry + 11, RULE, 0.25);
        doc.text(line.ticker, tickerX, ry, 8, "HB");
        doc.text(fit(line.name, 8, nameMax), nameX, ry, 8, "H");
        doc.textRight(line.coreWeight === null ? "—" : formatPct(line.coreWeight), modelX, ry, 8, "H", MUTED);
        doc.textRight(formatPct(line.weight), acctX, ry, 8, "H");
        if (showAmt && input.accountValue !== null) {
          doc.textRight(formatUsd((line.weight / 100) * input.accountValue), amtX, ry, 8, "H", MUTED);
        }
      }
      doc.y = y - 10;
      offset += fitRows;
      continued = true;
    }
  }
}

function drawAllocation(doc: PdfDoc, report: Diagnostics, dollars: number | null): void {
  const cols = 2;
  const legendRows = Math.ceil(report.buckets.length / cols);
  const barH = 22;
  const pad = 16;
  const rowH = 18;
  const cardH = pad + barH + 14 + legendRows * rowH + pad;
  heading(doc, "Asset allocation", "03  ·  Look-through roles", cardH + 8);
  doc.ensure(cardH + 8);
  const y = doc.y - cardH;
  doc.panel(MARGIN, y, doc.contentWidth, cardH);
  const barY = y + cardH - pad - barH;
  const barX = MARGIN + pad;
  const barW = doc.contentWidth - pad * 2;
  doc.save();
  doc.clipRoundRect(barX, barY, barW, barH, 6);
  let x = barX;
  report.buckets.forEach((item) => {
    const w = (item.weight / 100) * barW;
    if (w < 0.6) return;
    doc.fillRect(x, barY, w, barH, shareRgb(item.color));
    if (w >= 36) doc.text(`${item.weight.toFixed(0)}%`, x + 8, barY + 7, 8, "HB", PAPER);
    x += w;
  });
  doc.restore();

  const colW = (doc.contentWidth - pad * 2 - GAP) / cols;
  const usdCol = dollars !== null ? 64 : 0;
  const pctCol = 52;
  let ly = barY - 16;
  report.buckets.forEach((item, i) => {
    const col = i % cols;
    const x0 = MARGIN + pad + col * (colW + GAP);
    if (col === 0 && i > 0) ly -= rowH;
    const yy = ly;
    doc.fillCircle(x0 + 4, yy + 3, 3.2, shareRgb(item.color));
    const pctRight = x0 + colW - usdCol;
    const labelMax = Math.max(48, pctRight - pctCol - (x0 + 14) - 6);
    doc.text(fit(item.label, 8, labelMax), x0 + 14, yy, 8, "H");
    doc.textRight(formatPct(item.weight), pctRight, yy, 8, "HB");
    if (dollars !== null) {
      doc.textRight(formatUsd((item.weight / 100) * dollars), x0 + colW, yy, 8, "H", MUTED);
    }
  });
  doc.y = y - 14;
}

function drawSplit(doc: PdfDoc, report: Diagnostics): void {
  const colW = (doc.contentWidth - GAP) / 2;
  const cardH = 156;
  heading(doc, "Geography and equity style", `04  ·  ${report.equityShare.toFixed(0)}% of account is equity-like`, cardH + 8);
  doc.ensure(cardH + 8);
  const y = doc.y - cardH;
  const left = MARGIN;
  const right = MARGIN + colW + GAP;

  doc.panel(left, y, colW, cardH);
  doc.panel(right, y, colW, cardH);
  doc.text("Domicile mix", left + INSET, y + cardH - 18, 8, "HB", MUTED);
  doc.text("Equity style box", right + INSET, y + cardH - 18, 8, "HB", MUTED);

  const barY = y + cardH - 36;
  const barW = colW - INSET * 2;
  doc.save();
  doc.clipRoundRect(left + INSET, barY, barW, 10, 5);
  let gx = left + INSET;
  for (const item of report.geography) {
    const w = (item.weight / 100) * barW;
    if (w < 0.5) continue;
    doc.fillRect(gx, barY, w, 10, shareRgb(item.color));
    gx += w;
  }
  doc.restore();

  let gy = barY - 20;
  for (const item of report.geography) {
    doc.fillCircle(left + INSET + 4, gy + 3, 3.2, shareRgb(item.color));
    doc.text(item.label, left + INSET + 14, gy, 8.5, "H");
    doc.textRight(formatPct(item.weight), left + colW - INSET, gy, 8.5, "HB");
    gy -= 18;
  }

  drawStyleBox(doc, report.styleBox, right + INSET, y + cardH - 32, colW - INSET * 2);
  doc.y = y - 14;
}

function drawStyleBox(doc: PdfDoc, cells: StyleCell[], x: number, top: number, width: number): void {
  const styles = ["Value", "Blend", "Growth"] as const;
  const sizes = ["Large", "Mid", "Small"] as const;
  const gap = 5;
  const labelW = 36;
  const cell = Math.min(34, (width - labelW - gap * 2) / 3);
  const max = Math.max(...cells.map((c) => c.weight), 1);
  styles.forEach((style, i) => {
    const cx = x + labelW + i * (cell + gap) + cell / 2;
    const w = measure(style, 7, true);
    doc.text(style, cx - w / 2, top, 7, "HB", MUTED);
  });
  sizes.forEach((size, r) => {
    const cy = top - 14 - r * (cell + gap);
    doc.text(size, x, cy - cell / 2 + 3, 7.5, "H", MUTED);
    styles.forEach((style, c) => {
      const found = cells.find((row) => row.size === size && row.style === style);
      const weight = found?.weight ?? 0;
      const t = Math.min(1, weight / max);
      const mix: RGB = [
        0.94 * (1 - t) + 0.22 * t,
        0.93 * (1 - t) + 0.33 * t,
        0.91 * (1 - t) + 0.27 * t,
      ];
      const bx = x + labelW + c * (cell + gap);
      const by = cy - cell;
      doc.fillRoundRect(bx, by, cell, cell, 4, mix);
      const ink: RGB = t > 0.45 ? PAPER : INK;
      const label = weight >= 0.5 ? weight.toFixed(0) : "·";
      const lw = measure(label, 8.5, true);
      doc.text(label, bx + (cell - lw) / 2, by + cell / 2 - 4, 8.5, "HB", ink);
    });
  });
}

function drawSectors(doc: PdfDoc, report: Diagnostics): void {
  const rows = report.sectors.slice(0, 8);
  if (rows.length === 0) return;
  const rowH = 20;
  const pad = 16;
  const cardH = pad * 2 + rows.length * rowH;
  heading(doc, "Equity sectors", "05  ·  GICS look-through of equity-like holdings", cardH + 8);
  doc.ensure(cardH + 8);
  const y = doc.y - cardH;
  doc.panel(MARGIN, y, doc.contentWidth, cardH);
  const max = rows[0]?.weight ?? 1;
  const labelW = 124;
  const pctW = 48;
  const barW = doc.contentWidth - pad * 2 - labelW - pctW;
  let ry = y + cardH - pad - 4;
  for (const row of rows) {
    doc.text(fit(row.label, 8.5, labelW - 4), MARGIN + pad, ry, 8.5, "H");
    const trackX = MARGIN + pad + labelW;
    doc.fillRoundRect(trackX, ry - 2, barW, 9, 4.5, SOFT);
    const w = max > 0 ? (row.weight / max) * barW : 0;
    if (w > 0) {
      doc.save();
      doc.clipRoundRect(trackX, ry - 2, barW, 9, 4.5);
      doc.fillRect(trackX, ry - 2, Math.max(w, 6), 9, SAGE);
      doc.restore();
    }
    doc.textRight(formatPct(row.weight), PAGE_W - MARGIN - pad, ry, 8.5, "HB", MUTED);
    ry -= rowH;
  }
  doc.y = y - 14;
}

function drawFactors(doc: PdfDoc, report: Diagnostics): void {
  const colW = (doc.contentWidth - GAP) / 2;
  const rowH = 48;
  heading(doc, "Factor and risk monitor", "06  ·  Relative to a plain 60/40", rowH + 8);
  report.factors.forEach((factor, i) => {
    if (i % 2 === 0) doc.ensure(rowH + 8);
    const col = i % 2;
    const x = MARGIN + col * (colW + GAP);
    const y = doc.y - rowH + 6;
    doc.panel(x, y, colW, rowH, { r: R_SM });
    const labelW = measure(factor.label, 8.5, true);
    doc.text(factor.label, x + INSET, y + rowH - 16, 8.5, "HB");
    const hintMax = colW - INSET * 2 - labelW - 12;
    if (hintMax > 24) {
      doc.textRight(fit(factor.hint, 7, hintMax), x + colW - INSET, y + rowH - 16, 7, "H", MUTED);
    }
    const barX = x + INSET;
    const barW = colW - INSET * 2;
    const barY = y + 12;
    const mid = barX + barW / 2;
    doc.fillRoundRect(barX, barY, barW, 8, 4, SOFT);
    doc.fillRect(mid - 0.5, barY - 2, 1, 12, RULE);
    const mag = Math.min(1, Math.abs(factor.value));
    const w = (barW / 2) * mag;
    doc.save();
    doc.clipRoundRect(barX, barY, barW, 8, 4);
    if (factor.value < 0) doc.fillRect(mid - w, barY, w, 8, [0.29, 0.361, 0.42]);
    else doc.fillRect(mid, barY, Math.max(w, 1), 8, SAGE);
    doc.restore();
    if (col === 1 || i === report.factors.length - 1) doc.y = y - 10;
  });
  doc.y -= 8;
}

const POLICY_BAR: RGB = [0.22, 0.33, 0.27];
const BENCH_BAR: RGB = [0.29, 0.361, 0.42];

function drawTrailing(doc: PdfDoc, report: Diagnostics): void {
  const trail = report.trailing;
  const introCopy =
    "Annualized total return over the trailing 1-, 3-, and 5-year windows. The benchmark is a constant-weight mix of Vanguard Total World Stock (VT) and Vanguard Total World Bond (BNDW) at this policy's core equity/fixed split (" +
    trail.benchmarkLabel +
    "). The policy line is a look-through reconstruction from sleeve roles, not live fund NAVs.";
  const introLines = wrap(introCopy, 8.5, doc.contentWidth);
  const boxH = 148;
  heading(
    doc,
    "Trailing returns vs benchmark",
    `07  ·  ${trail.benchmarkLabel}  ·  as of ${trail.asOf}`,
    introLines.length * 12 + boxH + 36,
  );
  for (const line of introLines) {
    doc.text(line, MARGIN, doc.y, 8.5, "H", MUTED);
    doc.y -= 12;
  }
  doc.y -= 10;

  const boxW = (doc.contentWidth - GAP * 2) / 3;
  const maxAbs = Math.max(
    ...trail.rows.flatMap((r) => [Math.abs(r.portfolio), Math.abs(r.benchmark)]),
    8,
  );
  doc.ensure(boxH + 24);
  const startY = doc.y;

  trail.rows.forEach((row, i) => {
    const x = MARGIN + i * (boxW + GAP);
    const y = startY - boxH;
    const inner = boxW - 28;
    doc.panel(x, y, boxW, boxH, { r: R_SM });
    doc.save();
    doc.clipRoundRect(x, y, boxW, boxH, R_SM);
    doc.fillRect(x, y + boxH - 3, boxW, 3, SAGE);
    doc.restore();
    doc.text(row.label.toUpperCase(), x + 14, y + boxH - 20, 7, "HB", SAGE);
    doc.text(fit(row.window, 7, inner), x + 14, y + boxH - 34, 7, "H", MUTED);
    doc.text(formatReturn(row.portfolio), x + 14, y + boxH - 62, 20, "TB");

    drawTrailBar(doc, x + 14, y + 56, inner, "Policy", row.portfolio, maxAbs, POLICY_BAR);
    drawTrailBar(doc, x + 14, y + 32, inner, "Benchmark", row.benchmark, maxAbs, BENCH_BAR);

    const rounded = Number(row.excess.toFixed(1));
    const excessColor = rounded > 0 ? OK : rounded < 0 ? ALERT : MUTED;
    const chipFill = rounded > 0 ? OK_BG : rounded < 0 ? ALERT_BG : SOFT;
    const chip = `Excess  ${formatExcess(row.excess)}`;
    const chipW = Math.min(inner, measure(chip, 7.5, true) + 14);
    doc.fillRoundRect(x + 14, y + 10, chipW, 14, 7, chipFill);
    doc.text(chip, x + 21, y + 13, 7.5, "HB", excessColor);
  });

  doc.y = startY - boxH - 12;
  for (const line of wrap(trail.note, 7.5, doc.contentWidth)) {
    doc.ensure(12);
    doc.text(line, MARGIN, doc.y, 7.5, "H", MUTED);
    doc.y -= 10;
  }
  doc.y -= 10;
}

function drawTrailBar(
  doc: PdfDoc,
  x: number,
  y: number,
  width: number,
  label: string,
  value: number,
  maxAbs: number,
  color: RGB,
): void {
  doc.text(label, x, y + 11, 6.5, "H", MUTED);
  doc.textRight(formatReturn(value), x + width, y + 11, 6.5, "HB");
  doc.fillRoundRect(x, y, width, 6, 3, SOFT);
  const w = maxAbs > 0 ? (Math.abs(value) / maxAbs) * width : 0;
  if (w > 0) {
    doc.save();
    doc.clipRoundRect(x, y, width, 6, 3);
    doc.fillRect(x, y, Math.max(w, 4), 6, color);
    doc.restore();
  }
}

function drawScenarios(doc: PdfDoc, report: Diagnostics): void {
  heading(doc, "Scenario analysis", "08  ·  Illustrative, not a forecast", 64);
  const maxAbs = Math.max(...report.scenarios.map((s) => Math.abs(s.result)), 10);
  for (const row of report.scenarios) {
    const h = 58;
    if (doc.y - (h + 8) < FOOTER_Y + 24) {
      doc.addPage(true);
      doc.text("SCENARIO ANALYSIS  ·  CONTINUED", MARGIN, doc.y, 7, "HB", SAGE);
      doc.y -= 14;
    }
    const y = doc.y - h;
    const innerX = MARGIN + 14;
    const innerW = doc.contentWidth - 28;
    doc.panel(MARGIN, y, doc.contentWidth, h, { r: R_SM });
    doc.text(fit(row.label, 9.5, innerW - 64, true), innerX, y + h - 16, 9.5, "HB");
    doc.textRight(
      `${row.result >= 0 ? "+" : ""}${row.result.toFixed(1)}%`,
      PAGE_W - MARGIN - 14,
      y + h - 16,
      11,
      "TB",
      row.result >= 0 ? OK : ALERT,
    );
    doc.text(
      fit(`${row.period}  ·  ${row.note}`, 7.5, innerW),
      innerX,
      y + h - 30,
      7.5,
      "H",
      MUTED,
    );
    const barY = y + 10;
    const mid = innerX + innerW / 2;
    doc.fillRoundRect(innerX, barY, innerW, 8, 4, SOFT);
    doc.fillRect(mid - 0.5, barY - 2, 1, 12, RULE);
    const w = (Math.abs(row.result) / maxAbs) * (innerW / 2);
    doc.save();
    doc.clipRoundRect(innerX, barY, innerW, 8, 4);
    if (row.result < 0) doc.fillRect(mid - w, barY, w, 8, ALERT);
    else doc.fillRect(mid, barY, Math.max(w, 1.5), 8, OK);
    doc.restore();
    doc.y = y - 8;
  }
  doc.y -= 6;
}

function drawLiquidityIncome(doc: PdfDoc, report: Diagnostics, dollars: number | null): void {
  const colW = (doc.contentWidth - GAP) / 2;
  const items: NamedShare[] = [
    { key: "daily", label: "Daily / T+1 ETFs", weight: report.liquidity.daily, color: "var(--color-ok)" },
    { key: "interval", label: "Interval funds", weight: report.liquidity.interval, color: "var(--color-warn)" },
    { key: "illiquid", label: "Private / illiquid", weight: report.liquidity.illiquid, color: "var(--color-destructive)" },
  ].filter((i) => i.weight > 0.05);
  const leftH = 40 + items.length * 36;
  const rightH = 40 + 3 * 22 + 34;
  const cardH = Math.max(leftH, rightH) + 16;
  heading(doc, "Liquidity, income and concentration", "09  ·  Redemption profile and fee drag", cardH + 8);
  doc.ensure(cardH + 8);
  const y = doc.y - cardH;
  const rx = MARGIN + colW + GAP;
  doc.panel(MARGIN, y, colW, cardH);
  doc.panel(rx, y, colW, cardH);
  doc.text("Liquidity ladder", MARGIN + INSET, y + cardH - 18, 8, "HB", MUTED);
  doc.text("Income and fees", rx + INSET, y + cardH - 18, 8, "HB", MUTED);

  const innerW = colW - INSET * 2;
  let ly = y + cardH - 40;
  for (const item of items) {
    doc.fillCircle(MARGIN + INSET + 4, ly + 3, 3.2, shareRgb(item.color));
    doc.text(fit(item.label, 8.5, innerW - 58), MARGIN + INSET + 14, ly, 8.5, "H");
    doc.textRight(formatPct(item.weight), MARGIN + colW - INSET, ly, 8.5, "HB");
    const trackY = ly - 12;
    const trackX = MARGIN + INSET;
    doc.fillRoundRect(trackX, trackY, innerW, 7, 3.5, SOFT);
    const tw = Math.max(6, (Math.min(item.weight, 100) / 100) * innerW);
    doc.save();
    doc.clipRoundRect(trackX, trackY, innerW, 7, 3.5);
    doc.fillRect(trackX, trackY, tw, 7, shareRgb(item.color));
    doc.restore();
    if (dollars !== null) {
      doc.textRight(formatUsd((item.weight / 100) * dollars), MARGIN + colW - INSET, trackY - 10, 7.5, "H", MUTED);
    }
    ly -= 36;
  }

  const stats: [string, string][] = [
    ["Gross yield", `${report.income.grossYield.toFixed(2)}%`],
    ["Expense ratio", formatEr(report.income.feeDrag)],
    ["Net of ER", `${report.income.netOfEr.toFixed(2)}%`],
  ];
  let ry = y + cardH - 42;
  for (const [label, value] of stats) {
    doc.text(label, rx + INSET, ry, 8, "H", MUTED);
    doc.textRight(value, rx + colW - INSET, ry, 12, "TB");
    ry -= 22;
  }
  const conc = wrap(
    `Top holding ${report.concentration.topName} is ${formatPct(report.concentration.topWeight)}. Effective holdings ${report.concentration.effectiveHoldings.toFixed(1)} (HHI ${report.concentration.hhi.toFixed(3)}).`,
    7.5,
    colW - INSET * 2,
  );
  conc.slice(0, 3).forEach((line) => {
    doc.text(line, rx + INSET, ry, 7.5, "H", MUTED);
    ry -= 10;
  });
  doc.y = y - 14;
}

function drawFlags(doc: PdfDoc, report: Diagnostics): void {
  heading(doc, "Policy flags", "10  ·  Genesis-style monitor", 48);
  for (const flag of report.flags) {
    const details = wrap(flag.detail, 8.5, doc.contentWidth - 32);
    const h = 32 + details.length * 12;
    doc.ensure(h + 8);
    const y = doc.y - h;
    const bg = flag.level === "alert" ? ALERT_BG : flag.level === "ok" ? OK_BG : WARN_BG;
    const accent = flag.level === "alert" ? ALERT : flag.level === "ok" ? OK : WARN;
    doc.panel(MARGIN, y, doc.contentWidth, h, { fill: bg, r: R_SM, stroke: false });
    doc.save();
    doc.clipRoundRect(MARGIN, y, doc.contentWidth, h, R_SM);
    doc.fillRect(MARGIN, y, 3.5, h, accent);
    doc.restore();
    const tag = flag.level === "alert" ? "ALERT" : flag.level === "ok" ? "CLEAR" : "WATCH";
    doc.text(tag, MARGIN + 16, y + h - 16, 7, "HB", accent);
    doc.text(flag.title, MARGIN + 62, y + h - 16, 9.5, "HB");
    details.forEach((line, i) => {
      doc.text(line, MARGIN + 16, y + h - 32 - i * 12, 8.5, "H");
    });
    doc.y = y - 8;
  }
  doc.y -= 8;
}

function drawOverview(doc: PdfDoc, report: Diagnostics): void {
  heading(doc, "Portfolio overview", "11  ·  What this mix is built to do", 48);
  report.overview.forEach((point, i) => {
    const lines = wrap(point, 9, doc.contentWidth - 22);
    const need = 16 + lines.length * 12;
    if (doc.y - need < FOOTER_Y + 24) {
      doc.addPage(true);
      if (i > 0) {
        doc.text("PORTFOLIO OVERVIEW  ·  CONTINUED", MARGIN, doc.y, 7, "HB", SAGE);
        doc.y -= 14;
      }
    }
    doc.fillCircle(MARGIN + 3, doc.y + 3, 2.6, SAGE);
    lines.forEach((line) => {
      doc.text(line, MARGIN + 16, doc.y, 9, "H");
      doc.y -= 12;
    });
    if (i < report.overview.length - 1) doc.y -= 8;
  });
  doc.y -= 12;
}

function drawVoice(doc: PdfDoc, report: Diagnostics): void {
  const quoteLines = wrap(`"${report.voice.comment}"`, 12, doc.contentWidth - 36, true);
  const whyLines = wrap(report.voice.why, 8.5, doc.contentWidth - 36);
  const disc = wrap(
    `*Hypothetical commentary written in the style of ${report.voice.name} for illustration and education. It is not a real quote, endorsement, affiliation, or recommendation by ${report.voice.name} or any firm associated with that name.`,
    7.5,
    doc.contentWidth - 36,
  );
  const schoolLines = wrap(`${report.voice.years}  ·  ${report.voice.school}`, 8, doc.contentWidth - 36);
  const boxH = 44 + schoolLines.length * 11 + quoteLines.length * 16 + whyLines.length * 12 + disc.length * 10 + 12;
  heading(doc, "A voice from the archives", `12  ·  In the manner of ${report.voice.name}`, boxH);
  const y = doc.y - boxH;
  doc.panel(MARGIN, y, doc.contentWidth, boxH);
  doc.save();
  doc.clipRoundRect(MARGIN, y, doc.contentWidth, boxH, R);
  doc.fillRect(MARGIN, y, 3.5, boxH, SAGE);
  doc.restore();
  let ty = y + boxH - 20;
  doc.text(report.voice.name, MARGIN + 18, ty, 13, "TB");
  ty -= 14;
  schoolLines.forEach((line) => {
    doc.text(line, MARGIN + 18, ty, 8, "H", MUTED);
    ty -= 11;
  });
  ty -= 6;
  quoteLines.forEach((line) => {
    doc.text(line, MARGIN + 18, ty, 12, "T");
    ty -= 16;
  });
  ty -= 4;
  whyLines.forEach((line) => {
    doc.text(line, MARGIN + 18, ty, 8.5, "H", MUTED);
    ty -= 12;
  });
  ty -= 4;
  disc.forEach((line) => {
    doc.text(line, MARGIN + 18, ty, 7.5, "H", MUTED);
    ty -= 10;
  });
  doc.y = y - 12;
}

function drawDisclaimer(doc: PdfDoc): void {
  const copy =
    "Model diagnostics as of the Falcon Core Model dated " +
    CORE_AS_OF +
    ". Figures are representative look-through characteristics, not live market data, NAV, or a performance composite. Scenario results are stylized path estimates for advisor discussion - not forecasts, stress-test guarantees, or a recommendation. For advisor use only.";
  const lines = wrap(copy, 7.5, doc.contentWidth - 28);
  const h = 18 + lines.length * 10;
  if (doc.y - h < FOOTER_Y + 14) doc.addPage(true);
  const y = doc.y - h;
  doc.panel(MARGIN, y, doc.contentWidth, h, { fill: CREAM, r: R_SM, shadow: false });
  lines.forEach((line, i) => {
    doc.text(line, MARGIN + 14, y + h - 14 - i * 10, 7.5, "H", MUTED);
  });
  doc.y = y - 8;
}
