/** TrueType embed helper. Carlito (SIL OFL) is a Calibri metric clone; PDFs register it as Calibri. */

export const MAX_TTF_BYTES = 2_000_000;

export type EmbeddedFont = {
  fontName: string;
  ttf: Uint8Array;
  /** Advance widths for WinAnsi 32–126, in 1000-unit glyph space. */
  widths: number[];
  bbox: [number, number, number, number];
  ascent: number;
  descent: number;
  capHeight: number;
  italicAngle: number;
  stemV: number;
};

const FONT_NAME_RE = /^[A-Za-z][A-Za-z0-9-]{0,62}$/;

export function embedTrueType(ttf: Uint8Array, fontName: string): EmbeddedFont {
  if (!FONT_NAME_RE.test(fontName)) throw new Error("Invalid font name.");
  if (ttf.byteLength < 16 || ttf.byteLength > MAX_TTF_BYTES) throw new Error("Invalid font.");
  try {
    return parseTrueType(ttf, fontName);
  } catch (err) {
    if (err instanceof Error && (err.message.startsWith("Font") || err.message.startsWith("Invalid"))) {
      throw err;
    }
    throw new Error("Invalid font.");
  }
}

function parseTrueType(ttf: Uint8Array, fontName: string): EmbeddedFont {
  const view = new DataView(ttf.buffer, ttf.byteOffset, ttf.byteLength);
  const u16 = (o: number) => {
    if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
    return view.getUint16(o);
  };
  const i16 = (o: number) => {
    if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
    return view.getInt16(o);
  };
  const u32 = (o: number) => {
    if (o < 0 || o + 3 >= ttf.byteLength) throw new Error("Invalid font.");
    return view.getUint32(o);
  };
  const i32 = (o: number) => {
    if (o < 0 || o + 3 >= ttf.byteLength) throw new Error("Invalid font.");
    return view.getInt32(o);
  };

  const numTables = u16(4);
  if (numTables < 4 || numTables > 48) throw new Error("Invalid font.");
  const tables = new Map<string, { offset: number; length: number }>();
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    if (o + 15 >= ttf.byteLength) throw new Error("Invalid font.");
    const tag = String.fromCharCode(ttf[o]!, ttf[o + 1]!, ttf[o + 2]!, ttf[o + 3]!);
    const offset = u32(o + 8);
    const length = u32(o + 12);
    if (offset > ttf.byteLength || length > ttf.byteLength - offset) throw new Error("Invalid font.");
    tables.set(tag, { offset, length });
  }

  const need = (tag: string) => {
    const t = tables.get(tag);
    if (!t) throw new Error(`Font is missing the ${tag} table.`);
    return t;
  };

  const head = need("head").offset;
  const upm = u16(head + 18) || 2048;
  const bboxRaw: [number, number, number, number] = [
    i16(head + 36),
    i16(head + 38),
    i16(head + 40),
    i16(head + 42),
  ];

  const hhea = need("hhea").offset;
  const ascentRaw = i16(hhea + 4);
  const descentRaw = i16(hhea + 6);
  const numberOfHMetrics = u16(hhea + 34);

  const maxp = need("maxp").offset;
  const numGlyphs = u16(maxp + 4);
  if (numGlyphs < 1 || numGlyphs > 12_000 || numberOfHMetrics < 1 || numberOfHMetrics > numGlyphs) {
    throw new Error("Invalid font.");
  }

  const hmtx = need("hmtx");
  if (hmtx.length < numberOfHMetrics * 4) throw new Error("Invalid font.");
  const advances: number[] = [];
  for (let i = 0; i < numberOfHMetrics; i++) advances.push(u16(hmtx.offset + i * 4));
  const lastAdv = advances[advances.length - 1] ?? 0;
  while (advances.length < numGlyphs) advances.push(lastAdv);

  const glyphOf = buildCmapLookup(ttf, view, need("cmap").offset);

  const scale = 1000 / upm;
  const widths: number[] = [];
  for (let code = 32; code <= 126; code++) {
    const gid = glyphOf(code);
    const adv = advances[gid] ?? lastAdv;
    widths.push(Math.round(adv * scale));
  }

  let capRaw = Math.round(upm * 0.7);
  const os2 = tables.get("OS/2");
  if (os2 && os2.length >= 90 && u16(os2.offset) >= 2) {
    capRaw = i16(os2.offset + 88) || capRaw;
  }

  let italicAngle = 0;
  const post = tables.get("post");
  if (post && post.length >= 8) italicAngle = i32(post.offset + 4) / 65536;

  const weight = os2 && os2.length >= 6 ? u16(os2.offset + 4) : fontName.toLowerCase().includes("bold") ? 700 : 400;
  const stemV = weight >= 700 ? 140 : 80;

  return {
    fontName,
    ttf,
    widths,
    bbox: bboxRaw.map((v) => Math.round(v * scale)) as [number, number, number, number],
    ascent: Math.round(ascentRaw * scale),
    descent: Math.round(descentRaw * scale),
    capHeight: Math.round(capRaw * scale),
    italicAngle: Math.round(italicAngle * 10) / 10,
    stemV,
  };
}

function buildCmapLookup(
  ttf: Uint8Array,
  view: DataView,
  cmapOffset: number,
): (cp: number) => number {
  const u16 = (o: number) => {
    if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
    return view.getUint16(o);
  };
  const i16 = (o: number) => {
    if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
    return view.getInt16(o);
  };
  const u32 = (o: number) => {
    if (o < 0 || o + 3 >= ttf.byteLength) throw new Error("Invalid font.");
    return view.getUint32(o);
  };
  const num = u16(cmapOffset + 2);
  if (num > 32) throw new Error("Invalid font.");
  let rec = -1;
  for (let i = 0; i < num; i++) {
    const plat = u16(cmapOffset + 4 + i * 8);
    const enc = u16(cmapOffset + 6 + i * 8);
    const off = u32(cmapOffset + 8 + i * 8);
    if (off > ttf.byteLength) continue;
    if (plat === 3 && (enc === 1 || enc === 0)) rec = cmapOffset + off;
    else if (rec < 0 && plat === 0) rec = cmapOffset + off;
  }
  if (rec < 0) throw new Error("Font has no Unicode cmap.");
  if (u16(rec) !== 4) throw new Error("Font cmap is not format 4.");

  const segCount = u16(rec + 6) / 2;
  if (!Number.isInteger(segCount) || segCount < 1 || segCount > 1024) throw new Error("Invalid font.");
  const endCodes: number[] = [];
  const startCodes: number[] = [];
  const idDelta: number[] = [];
  const idRangeOffset: number[] = [];
  for (let i = 0; i < segCount; i++) endCodes.push(u16(rec + 14 + 2 * i));
  const startBase = rec + 16 + 2 * segCount;
  const deltaBase = rec + 16 + 4 * segCount;
  const rangeBase = rec + 16 + 6 * segCount;
  for (let i = 0; i < segCount; i++) {
    startCodes.push(u16(startBase + 2 * i));
    idDelta.push(i16(deltaBase + 2 * i));
    idRangeOffset.push(u16(rangeBase + 2 * i));
  }

  return (cp: number) => {
    for (let i = 0; i < segCount; i++) {
      if (cp > endCodes[i]!) continue;
      if (cp < startCodes[i]!) return 0;
      const ro = idRangeOffset[i]!;
      if (ro === 0) return (cp + idDelta[i]!) & 0xffff;
      const addr = rangeBase + 2 * i + ro + 2 * (cp - startCodes[i]!);
      if (addr < 0 || addr + 1 >= ttf.byteLength) return 0;
      const g = u16(addr);
      if (g === 0) return 0;
      return (g + idDelta[i]!) & 0xffff;
    }
    return 0;
  };
}

export function bytesToLatin1(buf: Uint8Array): string {
  return new TextDecoder("latin1").decode(buf);
}

let cachedFonts: Promise<{ regular: EmbeddedFont; bold: EmbeddedFont }> | null = null;

export async function loadCalibriFonts(): Promise<{ regular: EmbeddedFont; bold: EmbeddedFont }> {
  if (!cachedFonts) {
    cachedFonts = Promise.all([
      readFont("Calibri-Regular.ttf", "Calibri"),
      readFont("Calibri-Bold.ttf", "Calibri-Bold"),
    ])
      .then(([regular, bold]) => ({ regular, bold }))
      .catch((err) => {
        cachedFonts = null;
        throw err;
      });
  }
  return cachedFonts;
}

async function readFont(filename: string, fontName: string): Promise<EmbeddedFont> {
  const bytes = await readFontBytes(filename);
  return embedTrueType(bytes, fontName);
}

async function readFontBytes(filename: string): Promise<Uint8Array> {
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    throw new Error("Invalid font.");
  }
  const inNode = typeof process !== "undefined" && Boolean(process.versions?.node) && typeof window === "undefined";
  if (inNode) {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.join(process.cwd(), "public", "fonts", filename);
    const bytes = new Uint8Array(await fs.readFile(file));
    if (bytes.byteLength > MAX_TTF_BYTES) throw new Error("Invalid font.");
    return bytes;
  }
  const res = await fetch(`/fonts/${filename}`);
  if (!res.ok) throw new Error("Could not load Calibri.");
  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_TTF_BYTES) throw new Error("Invalid font.");
  return new Uint8Array(buf);
}
