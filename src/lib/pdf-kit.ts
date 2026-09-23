import { bytesToLatin1, type EmbeddedFont } from "./ttf-embed";
import { FALCON_SWIRL_PDF_PATH } from "./falcon-swirl";

export const PAGE_W = 612;
export const PAGE_H = 792;
export const MARGIN = 48;
export const FOOTER_Y = 36;

export type RGB = [number, number, number];
export type PdfFont = "T" | "TB" | "H" | "HB" | "C" | "CB";

export const INK: RGB = [0.086, 0.082, 0.059];
export const INK_LIFT: RGB = [0.145, 0.138, 0.11];
export const NAVY: RGB = [24 / 255, 46 / 255, 65 / 255];
export const NAVY_LIFT: RGB = [36 / 255, 62 / 255, 88 / 255];
export const GOLD: RGB = [227 / 255, 202 / 255, 103 / 255];
export const CREAM: RGB = [0.922, 0.906, 0.863];
export const PAPER: RGB = [0.965, 0.953, 0.922];
export const WASH: RGB = [0.976, 0.97, 0.955];
export const MUTED: RGB = [0.431, 0.427, 0.4];
export const RULE: RGB = [0.816, 0.8, 0.753];
export const SAGE: RGB = [0.22, 0.33, 0.27];
export const SOFT: RGB = [0.94, 0.93, 0.91];
export const WARN: RGB = [0.478, 0.306, 0.165];
export const WARN_BG: RGB = [0.96, 0.93, 0.88];
export const OK: RGB = [0.247, 0.361, 0.29];
export const ALERT: RGB = [0.561, 0.239, 0.204];
export const ALERT_BG: RGB = [0.96, 0.91, 0.89];
export const OK_BG: RGB = [0.91, 0.94, 0.91];

const HELV_W = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556,
  556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 611, 975, 667, 667, 722, 722, 667,
  611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667,
  667, 611, 278, 278, 278, 469, 556, 222, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500,
  222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

export function measureAt(text: string, size: number, table: number[]): number {
  let w = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const idx = code >= 32 && code <= 126 ? code - 32 : 3;
    w += table[idx] ?? 500;
  }
  return (w * size) / 1000;
}

export function measure(text: string, size: number, bold = false): number {
  let w = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const idx = code >= 32 && code <= 126 ? code - 32 : 3;
    w += HELV_W[idx] ?? 556;
  }
  return (w * size * (bold ? 1.04 : 1)) / 1000;
}

export function pdfEscape(raw: string): string {
  let out = "";
  for (const ch of raw) {
    const code = ch.charCodeAt(0);
    if (ch === "\\" || ch === "(" || ch === ")") out += `\\${ch}`;
    else if (code === 0x2014 || code === 0x2013) out += "-";
    else if (code === 0x2018 || code === 0x2019) out += "'";
    else if (code === 0x201c || code === 0x201d) out += '"';
    else if (code === 0x00a0) out += " ";
    else if (code === 0x00b7 || code === 0x2022) out += "\\267";
    else if (code < 32 || code > 126) out += " ";
    else out += ch;
  }
  return out;
}

function wrapWith(
  text: string,
  size: number,
  maxWidth: number,
  widthOf: (piece: string) => number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const flush = () => {
    if (current) {
      lines.push(current);
      current = "";
    }
  };

  const take = (piece: string) => {
    const next = current ? `${current} ${piece}` : piece;
    if (widthOf(next) <= maxWidth) {
      current = next;
      return;
    }
    flush();
    if (widthOf(piece) <= maxWidth) {
      current = piece;
      return;
    }
    let chunk = "";
    for (const ch of piece) {
      const trial = chunk + ch;
      if (chunk && widthOf(trial) > maxWidth) {
        lines.push(chunk);
        chunk = ch;
      } else {
        chunk = trial;
      }
    }
    current = chunk;
  };

  for (const word of words) take(word);
  flush();
  return lines.length ? lines : [""];
}

export function wrap(text: string, size: number, maxWidth: number, bold = false): string[] {
  return wrapWith(text, size, maxWidth, (piece) => measure(piece, size, bold));
}

export function wrapAt(text: string, size: number, maxWidth: number, table: number[]): string[] {
  return wrapWith(text, size, maxWidth, (piece) => measureAt(piece, size, table));
}

/** Truncate to `maxWidth` with an ellipsis so cover titles cannot overflow. */
export function fit(text: string, size: number, maxWidth: number, bold = false): string {
  if (measure(text, size, bold) <= maxWidth) return text;
  const ellipsis = "...";
  let s = text;
  while (s.length > 0 && measure(s + ellipsis, size, bold) > maxWidth) s = s.slice(0, -1);
  return s ? s + ellipsis : ellipsis;
}

export function fitAt(text: string, size: number, maxWidth: number, table: number[]): string {
  if (measureAt(text, size, table) <= maxWidth) return text;
  const ellipsis = "...";
  let s = text;
  while (s.length > 0 && measureAt(s + ellipsis, size, table) > maxWidth) s = s.slice(0, -1);
  return s ? s + ellipsis : ellipsis;
}

export function rgb(c: RGB): string {
  return `${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(3)}`;
}

export function n(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

const KAPPA = 0.5522847498;

function roundPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  if (radius <= 0.2) return `${n(x)} ${n(y)} ${n(w)} ${n(h)} re`;
  const k = radius * KAPPA;
  return [
    `${n(x + radius)} ${n(y)} m`,
    `${n(x + w - radius)} ${n(y)} l`,
    `${n(x + w - radius + k)} ${n(y)} ${n(x + w)} ${n(y + radius - k)} ${n(x + w)} ${n(y + radius)} c`,
    `${n(x + w)} ${n(y + h - radius)} l`,
    `${n(x + w)} ${n(y + h - radius + k)} ${n(x + w - radius + k)} ${n(y + h)} ${n(x + w - radius)} ${n(y + h)} c`,
    `${n(x + radius)} ${n(y + h)} l`,
    `${n(x + radius - k)} ${n(y + h)} ${n(x)} ${n(y + h - radius + k)} ${n(x)} ${n(y + h - radius)} c`,
    `${n(x)} ${n(y + radius)} l`,
    `${n(x)} ${n(y + radius - k)} ${n(x + radius - k)} ${n(y)} ${n(x + radius)} ${n(y)} c`,
    "h",
  ].join(" ");
}

function circlePath(cx: number, cy: number, r: number): string {
  const radius = Math.max(0.2, r);
  const k = radius * KAPPA;
  return [
    `${n(cx + radius)} ${n(cy)} m`,
    `${n(cx + radius)} ${n(cy + k)} ${n(cx + k)} ${n(cy + radius)} ${n(cx)} ${n(cy + radius)} c`,
    `${n(cx - k)} ${n(cy + radius)} ${n(cx - radius)} ${n(cy + k)} ${n(cx - radius)} ${n(cy)} c`,
    `${n(cx - radius)} ${n(cy - k)} ${n(cx - k)} ${n(cy - radius)} ${n(cx)} ${n(cy - radius)} c`,
    `${n(cx + k)} ${n(cy - radius)} ${n(cx + radius)} ${n(cy - k)} ${n(cx + radius)} ${n(cy)} c`,
    "h",
  ].join(" ");
}

function fontId(font: PdfFont): string {
  switch (font) {
    case "T":
      return "F1";
    case "TB":
      return "F2";
    case "H":
      return "F3";
    case "HB":
      return "F4";
    case "C":
      return "F5";
    case "CB":
      return "F6";
  }
}

export class PdfDoc {
  pages: string[][] = [];
  y = 0;
  runningTitle: string;
  calibri: { regular: number[]; bold: number[] } | null = null;
  pageFill: RGB | null;

  constructor(runningTitle: string, opts?: { pageFill?: RGB }) {
    this.runningTitle = runningTitle;
    this.pageFill = opts?.pageFill ?? null;
    this.addPage(false);
  }

  useCalibri(regular: number[], bold: number[]): void {
    this.calibri = { regular, bold };
  }

  get pageCount(): number {
    return this.pages.length;
  }

  get contentWidth(): number {
    return PAGE_W - MARGIN * 2;
  }

  measureText(str: string, size: number, font: PdfFont): number {
    if ((font === "C" || font === "CB") && this.calibri) {
      return measureAt(str, size, font === "CB" ? this.calibri.bold : this.calibri.regular);
    }
    return measure(str, size, font === "HB" || font === "TB");
  }

  wrapText(text: string, size: number, maxWidth: number, font: PdfFont): string[] {
    if ((font === "C" || font === "CB") && this.calibri) {
      return wrapAt(text, size, maxWidth, font === "CB" ? this.calibri.bold : this.calibri.regular);
    }
    return wrap(text, size, maxWidth, font === "HB" || font === "TB");
  }

  fitText(text: string, size: number, maxWidth: number, font: PdfFont): string {
    if ((font === "C" || font === "CB") && this.calibri) {
      return fitAt(text, size, maxWidth, font === "CB" ? this.calibri.bold : this.calibri.regular);
    }
    return fit(text, size, maxWidth, font === "HB" || font === "TB");
  }

  private stream(): string[] {
    return this.pages[this.pages.length - 1]!;
  }

  op(command: string): void {
    this.stream().push(command);
  }

  addPage(continuation: boolean): void {
    this.pages.push([]);
    if (this.pageFill) this.fillRect(0, 0, PAGE_W, PAGE_H, this.pageFill);
    this.y = PAGE_H - 36;
    if (continuation) this.compactHeader();
  }

  ensure(height: number): void {
    if (this.y - height < FOOTER_Y + 24) this.addPage(true);
  }

  save(): void {
    this.op("q");
  }

  restore(): void {
    this.op("Q");
  }

  setAlpha(pct: number): void {
    const allowed = [6, 8, 10, 12, 16, 20, 28, 40, 100];
    const nearest = allowed.reduce((best, n0) => (Math.abs(n0 - pct) < Math.abs(best - pct) ? n0 : best));
    this.op(`/A${String(nearest).padStart(2, "0")} gs`);
  }

  fillRect(x: number, y: number, w: number, h: number, color: RGB): void {
    this.op(`${rgb(color)} rg ${n(x)} ${n(y)} ${n(w)} ${n(h)} re f`);
  }

  strokeRect(x: number, y: number, w: number, h: number, color: RGB, width = 0.6): void {
    this.op(`${rgb(color)} RG ${width} w ${n(x)} ${n(y)} ${n(w)} ${n(h)} re S`);
  }

  fillRoundRect(x: number, y: number, w: number, h: number, r: number, color: RGB): void {
    this.op(`${rgb(color)} rg ${roundPath(x, y, w, h, r)} f`);
  }

  strokeRoundRect(x: number, y: number, w: number, h: number, r: number, color: RGB, width = 0.5): void {
    this.op(`${rgb(color)} RG ${width} w ${roundPath(x, y, w, h, r)} S`);
  }

  clipRoundRect(x: number, y: number, w: number, h: number, r: number): void {
    this.op(`${roundPath(x, y, w, h, r)} W n`);
  }

  fillCircle(cx: number, cy: number, r: number, color: RGB): void {
    this.op(`${rgb(color)} rg ${circlePath(cx, cy, r)} f`);
  }

  panel(
    x: number,
    y: number,
    w: number,
    h: number,
    opts?: { r?: number; fill?: RGB; shadow?: boolean; stroke?: boolean },
  ): void {
    const r = opts?.r ?? 8;
    const fill = opts?.fill ?? PAPER;
    if (opts?.shadow !== false) {
      this.save();
      this.setAlpha(8);
      this.fillRoundRect(x + 0.8, y - 1.6, w, h, r, INK);
      this.restore();
    }
    this.fillRoundRect(x, y, w, h, r, fill);
    if (opts?.stroke !== false) this.strokeRoundRect(x, y, w, h, r, RULE, 0.4);
  }

  line(x1: number, y1: number, x2: number, y2: number, color: RGB, width = 0.5): void {
    this.op(`${rgb(color)} RG ${width} w ${n(x1)} ${n(y1)} m ${n(x2)} ${n(y2)} l S`);
  }

  text(str: string, x: number, baseline: number, size: number, font: PdfFont, color: RGB = INK): void {
    const id = fontId(font);
    this.op(
      `BT /${id} ${n(size)} Tf ${rgb(color)} rg 1 0 0 1 ${n(x)} ${n(baseline)} Tm (${pdfEscape(str)}) Tj ET`,
    );
  }

  textRight(
    str: string,
    right: number,
    baseline: number,
    size: number,
    font: PdfFont,
    color: RGB = INK,
  ): void {
    const width = this.measureText(str, size, font);
    this.text(str, right - width, baseline, size, font, color);
  }

  falconMark(x: number, y: number, size: number, _opts?: { plate?: RGB | null; bird?: RGB }): void {
    this.save();
    this.op(`${n(size)} 0 0 ${n(size)} ${n(x)} ${n(y)} cm`);
    this.op(`${rgb(GOLD)} rg ${FALCON_SWIRL_PDF_PATH}`);
    this.restore();
  }

  compactHeader(): void {
    const barH = 24;
    const barY = PAGE_H - barH;
    this.fillRect(0, barY, PAGE_W, barH, NAVY);
    this.fillRect(0, barY, PAGE_W, 2.2, GOLD);
    this.falconMark(MARGIN, barY + 4, 16);
    const labelFont: PdfFont = this.calibri ? "CB" : "HB";
    this.text(this.runningTitle, MARGIN + 24, barY + 8, 8, labelFont, PAPER);
    this.y = barY - 18;
  }
}

export function dateLabel(): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function trueTypeFontDict(font: EmbeddedFont, descriptorId: number): string {
  const name = font.fontName.replace(/[^A-Za-z0-9-]/g, "");
  if (!name) throw new Error("Invalid font name.");
  const widths = font.widths.join(" ");
  return [
    "<< /Type /Font /Subtype /TrueType",
    `/BaseFont /${name}`,
    "/Encoding /WinAnsiEncoding",
    "/FirstChar 32 /LastChar 126",
    `/Widths [ ${widths} ]`,
    `/FontDescriptor ${descriptorId} 0 R`,
    ">>",
  ].join(" ");
}

function fontDescriptorDict(font: EmbeddedFont, fileId: number): string {
  const name = font.fontName.replace(/[^A-Za-z0-9-]/g, "");
  if (!name) throw new Error("Invalid font name.");
  const [x1, y1, x2, y2] = font.bbox;
  return [
    "<< /Type /FontDescriptor",
    `/FontName /${name}`,
    "/Flags 32",
    `/FontBBox [ ${x1} ${y1} ${x2} ${y2} ]`,
    `/ItalicAngle ${font.italicAngle}`,
    `/Ascent ${font.ascent}`,
    `/Descent ${font.descent}`,
    `/CapHeight ${font.capHeight}`,
    `/StemV ${font.stemV}`,
    `/FontFile2 ${fileId} 0 R`,
    ">>",
  ].join(" ");
}

function fontFileStream(ttf: Uint8Array): string {
  return `<< /Length ${ttf.length} /Length1 ${ttf.length} >>\nstream\n${bytesToLatin1(ttf)}\nendstream`;
}

export function assemblePdf(
  doc: PdfDoc,
  meta: { title: string; footerLeft: string },
  embedded?: { regular: EmbeddedFont; bold: EmbeddedFont },
): Uint8Array {
  const footerFont: PdfFont = embedded ? "C" : "H";
  const footerId = fontId(footerFont);
  const total = doc.pageCount;
  const contents: string[] = doc.pages.map((ops, i) => {
    const footer: string[] = [];
    footer.push(
      `${rgb(RULE)} RG 0.5 w ${n(MARGIN)} ${n(FOOTER_Y + 10)} m ${n(PAGE_W - MARGIN)} ${n(FOOTER_Y + 10)} l S`,
    );
    footer.push(
      `BT /${footerId} 7 Tf ${rgb(MUTED)} rg 1 0 0 1 ${n(MARGIN)} ${n(FOOTER_Y)} Tm (${pdfEscape(meta.footerLeft)}) Tj ET`,
    );
    const pageLabel = `Page ${i + 1} of ${total}`;
    const pw = embedded
      ? measureAt(pageLabel, 7, embedded.regular.widths)
      : measure(pageLabel, 7);
    footer.push(
      `BT /${footerId} 7 Tf ${rgb(MUTED)} rg 1 0 0 1 ${n(PAGE_W - MARGIN - pw)} ${n(FOOTER_Y)} Tm (${pdfEscape(pageLabel)}) Tj ET`,
    );
    return ["q", ...ops, ...footer, "Q"].join("\n");
  });

  const objects: string[] = [];
  let f1 = 0,
    f2 = 0,
    f3 = 0,
    f4 = 0,
    f5 = 0,
    f6 = 0;

  if (embedded) {
    objects.push(fontFileStream(embedded.regular.ttf));
    const fileReg = objects.length;
    objects.push(fontFileStream(embedded.bold.ttf));
    const fileBold = objects.length;
    objects.push(fontDescriptorDict(embedded.regular, fileReg));
    const descReg = objects.length;
    objects.push(fontDescriptorDict(embedded.bold, fileBold));
    const descBold = objects.length;
    objects.push(trueTypeFontDict(embedded.regular, descReg));
    f5 = objects.length;
    objects.push(trueTypeFontDict(embedded.bold, descBold));
    f6 = objects.length;
  } else {
    objects.push(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    );
    f1 = 1;
    f2 = 2;
    f3 = 3;
    f4 = 4;
  }

  const contentIds: number[] = [];
  const pageIds: number[] = [];
  for (const stream of contents) {
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    contentIds.push(objects.length);
  }
  const fontRes = embedded
    ? `/F5 ${f5} 0 R /F6 ${f6} 0 R`
    : `/F1 ${f1} 0 R /F2 ${f2} 0 R /F3 ${f3} 0 R /F4 ${f4} 0 R`;
  const gs = [
    "/A06 << /ca 0.06 /CA 0.06 >>",
    "/A08 << /ca 0.08 /CA 0.08 >>",
    "/A10 << /ca 0.10 /CA 0.10 >>",
    "/A12 << /ca 0.12 /CA 0.12 >>",
    "/A16 << /ca 0.16 /CA 0.16 >>",
    "/A20 << /ca 0.20 /CA 0.20 >>",
    "/A28 << /ca 0.28 /CA 0.28 >>",
    "/A40 << /ca 0.40 /CA 0.40 >>",
    "/A100 << /ca 1 /CA 1 >>",
  ].join(" ");
  const resources = `<< /Font << ${fontRes} >> /ExtGState << ${gs} >> >>`;
  for (const contentId of contentIds) {
    objects.push(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources ${resources} /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(objects.length);
  }
  const kids = pageIds.map((id) => `${id} 0 R`).join(" ");
  objects.push(`<< /Type /Pages /Kids [ ${kids} ] /Count ${pageIds.length} >>`);
  const pagesId = objects.length;
  objects.push(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  const catalogId = objects.length;
  objects.push(
    `<< /Title (${pdfEscape(meta.title)}) /Creator (Falcon Wealth) /Producer (Falcon Portfolio Model) >>`,
  );
  const infoId = objects.length;

  const patched = objects.map((body, idx) => {
    const id = idx + 1;
    if (pageIds.includes(id)) return body.replace("/Parent 0 0 R", `/Parent ${pagesId} 0 R`);
    return body;
  });

  const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const chunks: Uint8Array[] = [latin1(header)];
  let offset = header.length;
  const offsets = [0];
  for (let i = 0; i < patched.length; i++) {
    const body = `${i + 1} 0 obj\n${patched[i]}\nendobj\n`;
    offsets.push(offset);
    const bytes = latin1(body);
    chunks.push(bytes);
    offset += bytes.length;
  }
  const xrefStart = offset;
  let xref = `xref\n0 ${patched.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= patched.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${patched.length + 1} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  chunks.push(latin1(xref + trailer));
  return concat(chunks);
}

function latin1(text: string): Uint8Array {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 0xff;
  return out;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
