import {
  assemblePdf,
  CREAM,
  dateLabel,
  GOLD,
  INK,
  MARGIN,
  MUTED,
  NAVY,
  PAGE_W,
  PAPER,
  PdfDoc,
  RULE,
  type PdfFont,
  type RGB,
} from "./pdf-kit";
import { formatUsd } from "./portfolio";
import {
  DISCOVERY_SECTIONS,
  type DiscoveryField,
  type DiscoverySection,
} from "./discovery-pq";
import { loadCalibriFonts, type EmbeddedFont } from "./ttf-embed";

const ACCENT: RGB = [0.22, 0.33, 0.27];

export type DiscoveryPdfInput = {
  clientName: string;
  advisorName: string;
  accountValue: number | null;
};

export async function buildDiscoveryPdf(input: DiscoveryPdfInput): Promise<Uint8Array> {
  const fonts = await loadCalibriFonts();
  return buildDiscoveryPdfWithFonts(input, fonts);
}

export function buildDiscoveryPdfWithFonts(
  input: DiscoveryPdfInput,
  fonts: { regular: EmbeddedFont; bold: EmbeddedFont },
): Uint8Array {
  const doc = new PdfDoc("FALCON DISCOVERY FACTS  ·  PLANNING QUESTIONNAIRE");
  doc.useCalibri(fonts.regular.widths, fonts.bold.widths);

  const client = input.clientName.trim() || "Client household";
  const advisor = input.advisorName.trim() || "Falcon advisor";
  const date = dateLabel();
  const aum = input.accountValue === null ? "To be discussed" : formatUsd(input.accountValue);

  drawCover(doc, { client, advisor, date, aum });
  doc.addPage(true);
  drawHowTo(doc);
  for (const section of DISCOVERY_SECTIONS) drawSection(doc, section);

  drawClose(doc, advisor);

  return assemblePdf(
    doc,
    {
      title: `Falcon PQ Discovery Facts - ${client}`,
      footerLeft: "Confidential  ·  Falcon Wealth Planning  ·  Planning Questionnaire",
    },
    fonts,
  );
}

function C(): PdfFont {
  return "C";
}
function CB(): PdfFont {
  return "CB";
}

function drawCover(
  doc: PdfDoc,
  meta: { client: string; advisor: string; date: string; aum: string },
): void {
  doc.fillRect(0, 0, PAGE_W, 792, PAPER);
  doc.fillRect(0, 792 - 8, PAGE_W, 8, NAVY);
  doc.fillRect(0, 792 - 10, PAGE_W, 2.2, GOLD);
  doc.fillRect(0, 0, PAGE_W, 8, NAVY);

  doc.y = 720;
  doc.falconMark(MARGIN, doc.y - 28, 36);
  doc.text("FALCON WEALTH", MARGIN + 48, doc.y - 6, 11, CB(), MUTED);
  doc.text("Advisor discovery packet", MARGIN + 48, doc.y - 22, 10, C(), MUTED);
  doc.y -= 64;
  doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, INK, 1.1);
  doc.y -= 36;

  doc.text("DISCOVERY FACTS", MARGIN, doc.y, 11, CB(), ACCENT);
  doc.y -= 28;
  for (const line of doc.wrapText("Planning Questionnaire", 28, doc.contentWidth, CB())) {
    doc.text(line, MARGIN, doc.y, 28, CB());
    doc.y -= 32;
  }
  doc.y -= 4;
  doc.text("Fourteen sections. One household. The facts behind the plan.", MARGIN, doc.y, 11, C(), MUTED);
  doc.y -= 28;

  const cardH = 92;
  const y = doc.y - cardH;
  doc.fillRect(MARGIN, y, doc.contentWidth, cardH, CREAM);
  doc.fillRect(MARGIN, y, 4, cardH, ACCENT);
  metaPair(doc, MARGIN + 16, y + 64, "Prepared for", doc.fitText(meta.client, 13, 240, CB()), 13);
  metaPair(doc, MARGIN + 280, y + 64, "Date", meta.date, 11);
  metaPair(doc, MARGIN + 16, y + 28, "Advisor", doc.fitText(meta.advisor, 11, 240, C()), 11);
  metaPair(doc, MARGIN + 280, y + 28, "Account under discussion", meta.aum, 11);
  doc.y = y - 28;

  doc.text("CONFIDENTIAL  ·  FOR THE ADVISORY RELATIONSHIP", MARGIN, doc.y, 8, CB(), MUTED);
  doc.y -= 16;
  const blurb =
    "Complete what you can before we meet. Skip what does not apply. Approximate figures are better than blanks. Bring the documents in section 14 so the next conversation can be about design, not scavenger hunt.";
  for (const line of doc.wrapText(blurb, 10, doc.contentWidth, C())) {
    doc.text(line, MARGIN, doc.y, 10, C());
    doc.y -= 13;
  }

  doc.y -= 18;
  doc.text("THE FOURTEEN SECTIONS", MARGIN, doc.y, 8, CB(), MUTED);
  doc.y -= 10;
  doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, RULE, 0.6);
  doc.y -= 16;
  drawToc(doc, false);

  doc.y -= 10;
  const stepH = 58;
  doc.ensure(stepH + 8);
  const stepY = doc.y - stepH;
  const stepW = (doc.contentWidth - 16) / 3;
  const steps: [string, string][] = [
    ["01", "Complete and return this packet."],
    ["02", "We design the core-satellite mix."],
    ["03", "Proposal, diagnostics, then implement."],
  ];
  steps.forEach((step, i) => {
    const x = MARGIN + i * (stepW + 8);
    doc.fillRect(x, stepY, stepW, stepH, CREAM);
    doc.text(step[0], x + 10, stepY + 38, 10, CB(), ACCENT);
    let ty = stepY + 22;
    for (const line of doc.wrapText(step[1], 8, stepW - 20, C()).slice(0, 2)) {
      doc.text(line, x + 10, ty, 8, C());
      ty -= 11;
    }
  });
  doc.y = stepY - 16;

  doc.y = 56;
  doc.text("Falcon Portfolio Model  ·  Core-satellite policy  ·  Advisor use only", MARGIN, doc.y, 8, C(), MUTED);
}

function metaPair(
  doc: PdfDoc,
  x: number,
  y: number,
  label: string,
  value: string,
  size: number,
): void {
  doc.text(label.toUpperCase(), x, y + 14, 7, CB(), MUTED);
  doc.text(value, x, y, size, size >= 13 ? CB() : C());
}

function drawHowTo(doc: PdfDoc): void {
  heading(doc, "How to complete this packet", "Read once, then fill");
  const points = [
    "Print clearly or type into the PDF. One packet per household; use Client 1 / Client 2 lines.",
    "Circle or tick boxes. If a question is not relevant, strike it and keep moving.",
    "Tax, estate, and account values can be ranges. We will reconcile to statements.",
    "This is a discovery record for Falcon advisors. It is not an account application, IPS, or a solicitation.",
  ];
  for (const point of points) {
    doc.ensure(28);
    const lines = doc.wrapText(point, 10, doc.contentWidth - 14, C());
    doc.fillRect(MARGIN, doc.y - 2, 3.5, 3.5, ACCENT);
    let y = doc.y;
    for (const line of lines) {
      doc.text(line, MARGIN + 12, y, 10, C());
      y -= 13;
    }
    doc.y = y - 6;
  }
  doc.y -= 8;
}

function drawToc(doc: PdfDoc, withHeading: boolean): void {
  if (withHeading) heading(doc, "The fourteen sections", "Contents");
  const colW = (doc.contentWidth - 16) / 2;
  const mid = DISCOVERY_SECTIONS.length / 2;
  const left = DISCOVERY_SECTIONS.slice(0, mid);
  const right = DISCOVERY_SECTIONS.slice(mid);
  const rowH = 18;
  const rows = Math.max(left.length, right.length);
  doc.ensure(rows * rowH + 8);
  const top = doc.y;
  left.forEach((s, i) => tocRow(doc, MARGIN, top - i * rowH, colW, s));
  right.forEach((s, i) => tocRow(doc, MARGIN + colW + 16, top - i * rowH, colW, s));
  doc.y = top - rows * rowH - 12;
}

function tocRow(doc: PdfDoc, x: number, y: number, w: number, section: DiscoverySection): void {
  const num = String(section.n).padStart(2, "0");
  doc.text(num, x, y, 9, CB(), ACCENT);
  const title = doc.fitText(section.title, 10, w - 24, C());
  doc.text(title, x + 22, y, 10, C());
}

function heading(doc: PdfDoc, title: string, kicker: string): void {
  doc.ensure(36);
  doc.text(kicker.toUpperCase(), MARGIN, doc.y, 8, CB(), MUTED);
  doc.y -= 14;
  doc.text(title, MARGIN, doc.y, 14, CB());
  doc.y -= 8;
  doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, INK, 0.9);
  doc.y -= 14;
}

function drawSection(doc: PdfDoc, section: DiscoverySection): void {
  const purposeLines = doc.wrapText(section.purpose, 9, doc.contentWidth - 56, C());
  const headH = 28 + purposeLines.length * 11;
  doc.ensure(headH + 88);
  const barH = 22;
  const barY = doc.y - barH + 6;
  doc.fillRect(MARGIN, barY, doc.contentWidth, barH, INK);
  const num = String(section.n).padStart(2, "0");
  doc.text(num, MARGIN + 8, barY + 7, 10, CB(), PAPER);
  doc.text(section.title.toUpperCase(), MARGIN + 36, barY + 7, 10, CB(), PAPER);
  doc.y = barY - 12;
  for (const line of purposeLines) {
    doc.text(line, MARGIN, doc.y, 9, C(), MUTED);
    doc.y -= 11;
  }
  doc.y -= 6;

  for (const field of section.fields) drawField(doc, field);
  doc.y -= 8;
}

function drawField(doc: PdfDoc, field: DiscoveryField): void {
  const width = doc.contentWidth;
  switch (field.kind) {
    case "prompt": {
      const lines = doc.wrapText(field.text, 9, width, CB());
      doc.ensure(lines.length * 12 + 6);
      for (const line of lines) {
        doc.text(line, MARGIN, doc.y, 9, CB(), ACCENT);
        doc.y -= 12;
      }
      doc.y -= 2;
      return;
    }
    case "line":
      underline(doc, MARGIN, width, field.label);
      return;
    case "pair": {
      const gap = 14;
      const col = (width - gap) / 2;
      doc.ensure(32);
      const y = doc.y;
      underlineAt(doc, MARGIN, y, col, field.left);
      underlineAt(doc, MARGIN + col + gap, y, col, field.right);
      doc.y = y - 26;
      return;
    }
    case "triple": {
      const gap = 12;
      const col = (width - gap * 2) / 3;
      doc.ensure(32);
      const y = doc.y;
      underlineAt(doc, MARGIN, y, col, field.a);
      underlineAt(doc, MARGIN + col + gap, y, col, field.b);
      underlineAt(doc, MARGIN + (col + gap) * 2, y, col, field.c);
      doc.y = y - 26;
      return;
    }
    case "yesno": {
      doc.ensure(20);
      const boxX = PAGE_W - MARGIN - 92;
      const maxLabel = boxX - MARGIN - 8;
      doc.text(doc.fitText(field.label, 9, maxLabel, C()), MARGIN, doc.y, 9, C());
      checkbox(doc, boxX, doc.y, "Yes");
      checkbox(doc, boxX + 46, doc.y, "No");
      doc.y -= 18;
      return;
    }
    case "checks": {
      const labelLines = doc.wrapText(field.label, 9, width, C());
      const optRows = Math.ceil(field.options.length / 3);
      doc.ensure(labelLines.length * 12 + optRows * 16 + 8);
      for (const line of labelLines) {
        doc.text(line, MARGIN, doc.y, 9, C());
        doc.y -= 12;
      }
      const colW = width / 3;
      field.options.forEach((opt, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = MARGIN + col * colW;
        const y = doc.y - row * 16;
        checkbox(doc, x, y, opt);
      });
      doc.y -= optRows * 16 + 4;
      return;
    }
    case "note": {
      const lines = field.lines ?? 2;
      doc.ensure(14 + lines * 16);
      if (field.label) {
        doc.text(field.label, MARGIN, doc.y, 9, C(), MUTED);
        doc.y -= 12;
      }
      for (let i = 0; i < lines; i++) {
        doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, RULE, 0.45);
        doc.y -= 16;
      }
      return;
    }
  }
}

function underline(doc: PdfDoc, x: number, w: number, label: string): void {
  doc.ensure(32);
  underlineAt(doc, x, doc.y, w, label);
  doc.y -= 26;
}

function underlineAt(doc: PdfDoc, x: number, y: number, w: number, label: string): void {
  doc.text(label, x, y, 8, C(), MUTED);
  doc.line(x, y - 14, x + w, y - 14, RULE, 0.45);
}

function checkbox(doc: PdfDoc, x: number, y: number, label: string): void {
  doc.strokeRect(x, y - 1, 8, 8, INK, 0.6);
  const clipped = doc.fitText(label, 8, 110, C());
  doc.text(clipped, x + 12, y, 8, C());
}

function drawClose(doc: PdfDoc, advisor: string): void {
  doc.ensure(70);
  doc.line(MARGIN, doc.y, PAGE_W - MARGIN, doc.y, INK, 0.8);
  doc.y -= 16;
  doc.text("Acknowledgement", MARGIN, doc.y, 12, CB());
  doc.y -= 14;
  const note =
    "The information in this packet is given so Falcon can understand the household and prepare advice. It is confidential. Figures are estimates until confirmed. Signing below does not open an account or commit you to a portfolio.";
  for (const line of doc.wrapText(note, 9, doc.contentWidth, C())) {
    doc.text(line, MARGIN, doc.y, 9, C(), MUTED);
    doc.y -= 12;
  }
  doc.y -= 10;
  const gap = 16;
  const col = (doc.contentWidth - gap) / 2;
  const y = doc.y;
  underlineAt(doc, MARGIN, y, col, "Client 1 signature / date");
  underlineAt(doc, MARGIN + col + gap, y, col, "Client 2 signature / date");
  doc.y = y - 28;
  underlineAt(doc, MARGIN, doc.y, col, `Advisor (${advisor})`);
  underlineAt(doc, MARGIN + col + gap, doc.y, col, "Meeting date");
  doc.y -= 24;
}
