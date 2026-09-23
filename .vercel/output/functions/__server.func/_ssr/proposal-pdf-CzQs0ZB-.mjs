import { O as visionFundStatus, _ as formatUsd, c as VISION_FUND_MIN, g as formatPct, h as formatEr, l as VISION_FUND_NAME, t as CORE_AS_OF } from "./proposal-snapshot-CVHrZq6Z.mjs";
import { t as FALCON_SWIRL_PDF_PATH } from "./falcon-swirl-Bp04hKtv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proposal-pdf-CzQs0ZB-.js
function proposalFileStem(clientName, policyCode) {
	return `Falcon-${clientName.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "client"}-${policyCode.replace(/[^a-zA-Z0-9-]+/g, "")}`.slice(0, 80);
}
function proposalCsv(input, allocation) {
	const dollars = input.accountValue;
	return [[
		"Sleeve",
		"Group",
		"Ticker",
		"Name",
		"Model %",
		"Account %",
		"Amount"
	], ...allocation.groups.flatMap((group) => group.lines.map((line) => [
		group.label,
		line.group ?? "",
		line.ticker,
		line.name,
		line.coreWeight === null ? "" : formatPct(line.coreWeight),
		formatPct(line.weight),
		dollars === null ? "" : formatUsd(line.weight / 100 * dollars)
	]))].map((cols) => cols.map(escapeCsvCell).join(",")).join("\n") + "\n";
}
function escapeCsvCell(value) {
	let v = value.replace(/\0/g, "");
	if (/^\s*[=+\-@\t\r]/.test(v)) v = `'${v}`;
	if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, "\"\"")}"`;
	return v;
}
function downloadTextFile(filename, contents, mime) {
	downloadBytes(filename, new TextEncoder().encode(contents), `${mime};charset=utf-8`);
}
function downloadBytes(filename, bytes, mime) {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	const blob = new Blob([copy], { type: mime });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function proposalEmailSubject(clientName) {
	return `Falcon portfolio proposal — ${clientName.replace(/[\u0000-\u001f\u007f]/g, "").trim() || "client"}`;
}
function proposalEmailBody() {
	return [
		"Hello,",
		"",
		"Please find attached the portfolio proposal (PDF) and the holdings file (CSV).",
		"",
		"Thank you."
	].join("\n");
}
function bytesToBase64(bytes) {
	const chunk = 32768;
	let binary = "";
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
function foldBase64(value) {
	const lines = [];
	for (let i = 0; i < value.length; i += 76) lines.push(value.slice(i, i + 76));
	return lines.join("\r\n");
}
function headerSafe(value) {
	return value.replace(/[\u0000-\u001f\u007f"\\;]+/g, " ").trim();
}
function buildProposalEml(opts) {
	const boundary = `falcon-${crypto.randomUUID()}`;
	const subject = proposalEmailSubject(opts.clientName);
	const csvBytes = new TextEncoder().encode(opts.csvText);
	return [
		`To: ${headerSafe(opts.to)}`,
		`Subject: ${headerSafe(subject)}`,
		"MIME-Version: 1.0",
		"Content-Type: multipart/mixed; boundary=\"" + boundary + "\"",
		"",
		`--${boundary}`,
		"Content-Type: text/plain; charset=utf-8",
		"Content-Transfer-Encoding: 7bit",
		"",
		proposalEmailBody().replace(/\n/g, "\r\n"),
		"",
		`--${boundary}`,
		"Content-Type: application/pdf",
		`Content-Disposition: attachment; filename="${headerSafe(opts.pdfName)}"`,
		"Content-Transfer-Encoding: base64",
		"",
		foldBase64(bytesToBase64(opts.pdfBytes)),
		"",
		`--${boundary}`,
		"Content-Type: text/csv; charset=utf-8",
		`Content-Disposition: attachment; filename="${headerSafe(opts.csvName)}"`,
		"Content-Transfer-Encoding: base64",
		"",
		foldBase64(bytesToBase64(csvBytes)),
		"",
		`--${boundary}--`,
		""
	].join("\r\n");
}
var EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
function isEmailAddress(value) {
	const trimmed = value.trim();
	if (trimmed.length < 6 || trimmed.length > 120) return false;
	if (trimmed.includes("..") || /[\s<>()[\]\\,;:"]/.test(trimmed)) return false;
	if (!EMAIL_RE.test(trimmed)) return false;
	const at = trimmed.lastIndexOf("@");
	const local = trimmed.slice(0, at);
	const domain = trimmed.slice(at + 1);
	if (!local || local.startsWith(".") || local.endsWith(".")) return false;
	if (!domain || domain.startsWith("-") || domain.endsWith("-") || domain.startsWith(".")) return false;
	return true;
}
var FONT_NAME_RE = /^[A-Za-z][A-Za-z0-9-]{0,62}$/;
function embedTrueType(ttf, fontName) {
	if (!FONT_NAME_RE.test(fontName)) throw new Error("Invalid font name.");
	if (ttf.byteLength < 16 || ttf.byteLength > 2e6) throw new Error("Invalid font.");
	try {
		return parseTrueType(ttf, fontName);
	} catch (err) {
		if (err instanceof Error && (err.message.startsWith("Font") || err.message.startsWith("Invalid"))) throw err;
		throw new Error("Invalid font.");
	}
}
function parseTrueType(ttf, fontName) {
	const view = new DataView(ttf.buffer, ttf.byteOffset, ttf.byteLength);
	const u16 = (o) => {
		if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
		return view.getUint16(o);
	};
	const i16 = (o) => {
		if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
		return view.getInt16(o);
	};
	const u32 = (o) => {
		if (o < 0 || o + 3 >= ttf.byteLength) throw new Error("Invalid font.");
		return view.getUint32(o);
	};
	const i32 = (o) => {
		if (o < 0 || o + 3 >= ttf.byteLength) throw new Error("Invalid font.");
		return view.getInt32(o);
	};
	const numTables = u16(4);
	if (numTables < 4 || numTables > 48) throw new Error("Invalid font.");
	const tables = /* @__PURE__ */ new Map();
	for (let i = 0; i < numTables; i++) {
		const o = 12 + i * 16;
		if (o + 15 >= ttf.byteLength) throw new Error("Invalid font.");
		const tag = String.fromCharCode(ttf[o], ttf[o + 1], ttf[o + 2], ttf[o + 3]);
		const offset = u32(o + 8);
		const length = u32(o + 12);
		if (offset > ttf.byteLength || length > ttf.byteLength - offset) throw new Error("Invalid font.");
		tables.set(tag, {
			offset,
			length
		});
	}
	const need = (tag) => {
		const t = tables.get(tag);
		if (!t) throw new Error(`Font is missing the ${tag} table.`);
		return t;
	};
	const head = need("head").offset;
	const upm = u16(head + 18) || 2048;
	const bboxRaw = [
		i16(head + 36),
		i16(head + 38),
		i16(head + 40),
		i16(head + 42)
	];
	const hhea = need("hhea").offset;
	const ascentRaw = i16(hhea + 4);
	const descentRaw = i16(hhea + 6);
	const numberOfHMetrics = u16(hhea + 34);
	const maxp = need("maxp").offset;
	const numGlyphs = u16(maxp + 4);
	if (numGlyphs < 1 || numGlyphs > 12e3 || numberOfHMetrics < 1 || numberOfHMetrics > numGlyphs) throw new Error("Invalid font.");
	const hmtx = need("hmtx");
	if (hmtx.length < numberOfHMetrics * 4) throw new Error("Invalid font.");
	const advances = [];
	for (let i = 0; i < numberOfHMetrics; i++) advances.push(u16(hmtx.offset + i * 4));
	const lastAdv = advances[advances.length - 1] ?? 0;
	while (advances.length < numGlyphs) advances.push(lastAdv);
	const glyphOf = buildCmapLookup(ttf, view, need("cmap").offset);
	const scale = 1e3 / upm;
	const widths = [];
	for (let code = 32; code <= 126; code++) {
		const adv = advances[glyphOf(code)] ?? lastAdv;
		widths.push(Math.round(adv * scale));
	}
	let capRaw = Math.round(upm * .7);
	const os2 = tables.get("OS/2");
	if (os2 && os2.length >= 90 && u16(os2.offset) >= 2) capRaw = i16(os2.offset + 88) || capRaw;
	let italicAngle = 0;
	const post = tables.get("post");
	if (post && post.length >= 8) italicAngle = i32(post.offset + 4) / 65536;
	const stemV = (os2 && os2.length >= 6 ? u16(os2.offset + 4) : fontName.toLowerCase().includes("bold") ? 700 : 400) >= 700 ? 140 : 80;
	return {
		fontName,
		ttf,
		widths,
		bbox: bboxRaw.map((v) => Math.round(v * scale)),
		ascent: Math.round(ascentRaw * scale),
		descent: Math.round(descentRaw * scale),
		capHeight: Math.round(capRaw * scale),
		italicAngle: Math.round(italicAngle * 10) / 10,
		stemV
	};
}
function buildCmapLookup(ttf, view, cmapOffset) {
	const u16 = (o) => {
		if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
		return view.getUint16(o);
	};
	const i16 = (o) => {
		if (o < 0 || o + 1 >= ttf.byteLength) throw new Error("Invalid font.");
		return view.getInt16(o);
	};
	const u32 = (o) => {
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
	const endCodes = [];
	const startCodes = [];
	const idDelta = [];
	const idRangeOffset = [];
	for (let i = 0; i < segCount; i++) endCodes.push(u16(rec + 14 + 2 * i));
	const startBase = rec + 16 + 2 * segCount;
	const deltaBase = rec + 16 + 4 * segCount;
	const rangeBase = rec + 16 + 6 * segCount;
	for (let i = 0; i < segCount; i++) {
		startCodes.push(u16(startBase + 2 * i));
		idDelta.push(i16(deltaBase + 2 * i));
		idRangeOffset.push(u16(rangeBase + 2 * i));
	}
	return (cp) => {
		for (let i = 0; i < segCount; i++) {
			if (cp > endCodes[i]) continue;
			if (cp < startCodes[i]) return 0;
			const ro = idRangeOffset[i];
			if (ro === 0) return cp + idDelta[i] & 65535;
			const addr = rangeBase + 2 * i + ro + 2 * (cp - startCodes[i]);
			if (addr < 0 || addr + 1 >= ttf.byteLength) return 0;
			const g = u16(addr);
			if (g === 0) return 0;
			return g + idDelta[i] & 65535;
		}
		return 0;
	};
}
function bytesToLatin1(buf) {
	return new TextDecoder("latin1").decode(buf);
}
var cachedFonts = null;
async function loadCalibriFonts() {
	if (!cachedFonts) cachedFonts = Promise.all([readFont("Calibri-Regular.ttf", "Calibri"), readFont("Calibri-Bold.ttf", "Calibri-Bold")]).then(([regular, bold]) => ({
		regular,
		bold
	})).catch((err) => {
		cachedFonts = null;
		throw err;
	});
	return cachedFonts;
}
async function readFont(filename, fontName) {
	return embedTrueType(await readFontBytes(filename), fontName);
}
async function readFontBytes(filename) {
	if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) throw new Error("Invalid font.");
	if (typeof process !== "undefined" && Boolean(process.versions?.node) && typeof window === "undefined") {
		const fs = await import("node:fs/promises");
		const file = (await import("node:path")).join(process.cwd(), "public", "fonts", filename);
		const bytes = new Uint8Array(await fs.readFile(file));
		if (bytes.byteLength > 2e6) throw new Error("Invalid font.");
		return bytes;
	}
	const res = await fetch(`/fonts/${filename}`);
	if (!res.ok) throw new Error("Could not load Calibri.");
	const buf = await res.arrayBuffer();
	if (buf.byteLength > 2e6) throw new Error("Invalid font.");
	return new Uint8Array(buf);
}
var INK = [
	.086,
	.082,
	.059
];
var NAVY = [
	24 / 255,
	46 / 255,
	65 / 255
];
var NAVY_LIFT = [
	36 / 255,
	62 / 255,
	88 / 255
];
var GOLD = [
	227 / 255,
	202 / 255,
	103 / 255
];
var CREAM = [
	.922,
	.906,
	.863
];
var PAPER = [
	.965,
	.953,
	.922
];
var WASH = [
	.976,
	.97,
	.955
];
var MUTED = [
	.431,
	.427,
	.4
];
var RULE = [
	.816,
	.8,
	.753
];
var SAGE = [
	.22,
	.33,
	.27
];
var SOFT = [
	.94,
	.93,
	.91
];
var WARN = [
	.478,
	.306,
	.165
];
var WARN_BG = [
	.96,
	.93,
	.88
];
var OK = [
	.247,
	.361,
	.29
];
var ALERT = [
	.561,
	.239,
	.204
];
var ALERT_BG = [
	.96,
	.91,
	.89
];
var OK_BG = [
	.91,
	.94,
	.91
];
var HELV_W = [
	278,
	278,
	355,
	556,
	556,
	889,
	667,
	191,
	333,
	333,
	389,
	584,
	278,
	333,
	278,
	278,
	556,
	556,
	556,
	556,
	556,
	556,
	556,
	556,
	556,
	556,
	278,
	278,
	584,
	584,
	584,
	611,
	975,
	667,
	667,
	722,
	722,
	667,
	611,
	778,
	722,
	278,
	500,
	667,
	556,
	833,
	722,
	778,
	667,
	778,
	722,
	667,
	611,
	722,
	667,
	944,
	667,
	667,
	611,
	278,
	278,
	278,
	469,
	556,
	222,
	556,
	556,
	500,
	556,
	556,
	278,
	556,
	556,
	222,
	222,
	500,
	222,
	833,
	556,
	556,
	556,
	556,
	333,
	500,
	278,
	556,
	500,
	722,
	500,
	500,
	500,
	334,
	260,
	334,
	584
];
function measureAt(text, size, table) {
	let w = 0;
	for (const ch of text) {
		const code = ch.charCodeAt(0);
		const idx = code >= 32 && code <= 126 ? code - 32 : 3;
		w += table[idx] ?? 500;
	}
	return w * size / 1e3;
}
function measure(text, size, bold = false) {
	let w = 0;
	for (const ch of text) {
		const code = ch.charCodeAt(0);
		const idx = code >= 32 && code <= 126 ? code - 32 : 3;
		w += HELV_W[idx] ?? 556;
	}
	return w * size * (bold ? 1.04 : 1) / 1e3;
}
function pdfEscape(raw) {
	let out = "";
	for (const ch of raw) {
		const code = ch.charCodeAt(0);
		if (ch === "\\" || ch === "(" || ch === ")") out += `\\${ch}`;
		else if (code === 8212 || code === 8211) out += "-";
		else if (code === 8216 || code === 8217) out += "'";
		else if (code === 8220 || code === 8221) out += "\"";
		else if (code === 160) out += " ";
		else if (code === 183 || code === 8226) out += "\\267";
		else if (code < 32 || code > 126) out += " ";
		else out += ch;
	}
	return out;
}
function wrapWith(text, size, maxWidth, widthOf) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines = [];
	let current = "";
	const flush = () => {
		if (current) {
			lines.push(current);
			current = "";
		}
	};
	const take = (piece) => {
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
			} else chunk = trial;
		}
		current = chunk;
	};
	for (const word of words) take(word);
	flush();
	return lines.length ? lines : [""];
}
function wrap(text, size, maxWidth, bold = false) {
	return wrapWith(text, size, maxWidth, (piece) => measure(piece, size, bold));
}
function wrapAt(text, size, maxWidth, table) {
	return wrapWith(text, size, maxWidth, (piece) => measureAt(piece, size, table));
}
/** Truncate to `maxWidth` with an ellipsis so cover titles cannot overflow. */
function fit(text, size, maxWidth, bold = false) {
	if (measure(text, size, bold) <= maxWidth) return text;
	const ellipsis = "...";
	let s = text;
	while (s.length > 0 && measure(s + ellipsis, size, bold) > maxWidth) s = s.slice(0, -1);
	return s ? s + ellipsis : ellipsis;
}
function fitAt(text, size, maxWidth, table) {
	if (measureAt(text, size, table) <= maxWidth) return text;
	const ellipsis = "...";
	let s = text;
	while (s.length > 0 && measureAt(s + ellipsis, size, table) > maxWidth) s = s.slice(0, -1);
	return s ? s + ellipsis : ellipsis;
}
function rgb(c) {
	return `${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(3)}`;
}
function n(value) {
	return (Math.round(value * 100) / 100).toFixed(2);
}
var KAPPA = .5522847498;
function roundPath(x, y, w, h, r) {
	const radius = Math.max(0, Math.min(r, w / 2, h / 2));
	if (radius <= .2) return `${n(x)} ${n(y)} ${n(w)} ${n(h)} re`;
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
		"h"
	].join(" ");
}
function circlePath(cx, cy, r) {
	const radius = Math.max(.2, r);
	const k = radius * KAPPA;
	return [
		`${n(cx + radius)} ${n(cy)} m`,
		`${n(cx + radius)} ${n(cy + k)} ${n(cx + k)} ${n(cy + radius)} ${n(cx)} ${n(cy + radius)} c`,
		`${n(cx - k)} ${n(cy + radius)} ${n(cx - radius)} ${n(cy + k)} ${n(cx - radius)} ${n(cy)} c`,
		`${n(cx - radius)} ${n(cy - k)} ${n(cx - k)} ${n(cy - radius)} ${n(cx)} ${n(cy - radius)} c`,
		`${n(cx + k)} ${n(cy - radius)} ${n(cx + radius)} ${n(cy - k)} ${n(cx + radius)} ${n(cy)} c`,
		"h"
	].join(" ");
}
function fontId(font) {
	switch (font) {
		case "T": return "F1";
		case "TB": return "F2";
		case "H": return "F3";
		case "HB": return "F4";
		case "C": return "F5";
		case "CB": return "F6";
	}
}
var PdfDoc = class {
	pages = [];
	y = 0;
	runningTitle;
	calibri = null;
	pageFill;
	constructor(runningTitle, opts) {
		this.runningTitle = runningTitle;
		this.pageFill = opts?.pageFill ?? null;
		this.addPage(false);
	}
	useCalibri(regular, bold) {
		this.calibri = {
			regular,
			bold
		};
	}
	get pageCount() {
		return this.pages.length;
	}
	get contentWidth() {
		return 516;
	}
	measureText(str, size, font) {
		if ((font === "C" || font === "CB") && this.calibri) return measureAt(str, size, font === "CB" ? this.calibri.bold : this.calibri.regular);
		return measure(str, size, font === "HB" || font === "TB");
	}
	wrapText(text, size, maxWidth, font) {
		if ((font === "C" || font === "CB") && this.calibri) return wrapAt(text, size, maxWidth, font === "CB" ? this.calibri.bold : this.calibri.regular);
		return wrap(text, size, maxWidth, font === "HB" || font === "TB");
	}
	fitText(text, size, maxWidth, font) {
		if ((font === "C" || font === "CB") && this.calibri) return fitAt(text, size, maxWidth, font === "CB" ? this.calibri.bold : this.calibri.regular);
		return fit(text, size, maxWidth, font === "HB" || font === "TB");
	}
	stream() {
		return this.pages[this.pages.length - 1];
	}
	op(command) {
		this.stream().push(command);
	}
	addPage(continuation) {
		this.pages.push([]);
		if (this.pageFill) this.fillRect(0, 0, 612, 792, this.pageFill);
		this.y = 756;
		if (continuation) this.compactHeader();
	}
	ensure(height) {
		if (this.y - height < 60) this.addPage(true);
	}
	save() {
		this.op("q");
	}
	restore() {
		this.op("Q");
	}
	setAlpha(pct) {
		const nearest = [
			6,
			8,
			10,
			12,
			16,
			20,
			28,
			40,
			100
		].reduce((best, n0) => Math.abs(n0 - pct) < Math.abs(best - pct) ? n0 : best);
		this.op(`/A${String(nearest).padStart(2, "0")} gs`);
	}
	fillRect(x, y, w, h, color) {
		this.op(`${rgb(color)} rg ${n(x)} ${n(y)} ${n(w)} ${n(h)} re f`);
	}
	strokeRect(x, y, w, h, color, width = .6) {
		this.op(`${rgb(color)} RG ${width} w ${n(x)} ${n(y)} ${n(w)} ${n(h)} re S`);
	}
	fillRoundRect(x, y, w, h, r, color) {
		this.op(`${rgb(color)} rg ${roundPath(x, y, w, h, r)} f`);
	}
	strokeRoundRect(x, y, w, h, r, color, width = .5) {
		this.op(`${rgb(color)} RG ${width} w ${roundPath(x, y, w, h, r)} S`);
	}
	clipRoundRect(x, y, w, h, r) {
		this.op(`${roundPath(x, y, w, h, r)} W n`);
	}
	fillCircle(cx, cy, r, color) {
		this.op(`${rgb(color)} rg ${circlePath(cx, cy, r)} f`);
	}
	panel(x, y, w, h, opts) {
		const r = opts?.r ?? 8;
		const fill = opts?.fill ?? PAPER;
		if (opts?.shadow !== false) {
			this.save();
			this.setAlpha(8);
			this.fillRoundRect(x + .8, y - 1.6, w, h, r, INK);
			this.restore();
		}
		this.fillRoundRect(x, y, w, h, r, fill);
		if (opts?.stroke !== false) this.strokeRoundRect(x, y, w, h, r, RULE, .4);
	}
	line(x1, y1, x2, y2, color, width = .5) {
		this.op(`${rgb(color)} RG ${width} w ${n(x1)} ${n(y1)} m ${n(x2)} ${n(y2)} l S`);
	}
	text(str, x, baseline, size, font, color = INK) {
		const id = fontId(font);
		this.op(`BT /${id} ${n(size)} Tf ${rgb(color)} rg 1 0 0 1 ${n(x)} ${n(baseline)} Tm (${pdfEscape(str)}) Tj ET`);
	}
	textRight(str, right, baseline, size, font, color = INK) {
		const width = this.measureText(str, size, font);
		this.text(str, right - width, baseline, size, font, color);
	}
	falconMark(x, y, size, _opts) {
		this.save();
		this.op(`${n(size)} 0 0 ${n(size)} ${n(x)} ${n(y)} cm`);
		this.op(`${rgb(GOLD)} rg ${FALCON_SWIRL_PDF_PATH}`);
		this.restore();
	}
	compactHeader() {
		const barH = 24;
		const barY = 768;
		this.fillRect(0, barY, 612, barH, NAVY);
		this.fillRect(0, barY, 612, 2.2, GOLD);
		this.falconMark(48, 772, 16);
		const labelFont = this.calibri ? "CB" : "HB";
		this.text(this.runningTitle, 72, 776, 8, labelFont, PAPER);
		this.y = 750;
	}
};
function dateLabel() {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric"
	}).format(/* @__PURE__ */ new Date());
}
function trueTypeFontDict(font, descriptorId) {
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
		">>"
	].join(" ");
}
function fontDescriptorDict(font, fileId) {
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
		">>"
	].join(" ");
}
function fontFileStream(ttf) {
	return `<< /Length ${ttf.length} /Length1 ${ttf.length} >>\nstream\n${bytesToLatin1(ttf)}\nendstream`;
}
function assemblePdf(doc, meta, embedded) {
	const footerId = fontId(embedded ? "C" : "H");
	const total = doc.pageCount;
	const contents = doc.pages.map((ops, i) => {
		const footer = [];
		footer.push(`${rgb(RULE)} RG 0.5 w ${n(48)} ${n(46)} m ${n(564)} ${n(46)} l S`);
		footer.push(`BT /${footerId} 7 Tf ${rgb(MUTED)} rg 1 0 0 1 ${n(48)} ${n(36)} Tm (${pdfEscape(meta.footerLeft)}) Tj ET`);
		const pageLabel = `Page ${i + 1} of ${total}`;
		const pw = embedded ? measureAt(pageLabel, 7, embedded.regular.widths) : measure(pageLabel, 7);
		footer.push(`BT /${footerId} 7 Tf ${rgb(MUTED)} rg 1 0 0 1 ${n(564 - pw)} ${n(36)} Tm (${pdfEscape(pageLabel)}) Tj ET`);
		return [
			"q",
			...ops,
			...footer,
			"Q"
		].join("\n");
	});
	const objects = [];
	let f1 = 0, f2 = 0, f3 = 0, f4 = 0, f5 = 0, f6 = 0;
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
		objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
		f1 = 1;
		f2 = 2;
		f3 = 3;
		f4 = 4;
	}
	const contentIds = [];
	const pageIds = [];
	for (const stream of contents) {
		objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
		contentIds.push(objects.length);
	}
	const resources = `<< /Font << ${embedded ? `/F5 ${f5} 0 R /F6 ${f6} 0 R` : `/F1 ${f1} 0 R /F2 ${f2} 0 R /F3 ${f3} 0 R /F4 ${f4} 0 R`} >> /ExtGState << ${[
		"/A06 << /ca 0.06 /CA 0.06 >>",
		"/A08 << /ca 0.08 /CA 0.08 >>",
		"/A10 << /ca 0.10 /CA 0.10 >>",
		"/A12 << /ca 0.12 /CA 0.12 >>",
		"/A16 << /ca 0.16 /CA 0.16 >>",
		"/A20 << /ca 0.20 /CA 0.20 >>",
		"/A28 << /ca 0.28 /CA 0.28 >>",
		"/A40 << /ca 0.40 /CA 0.40 >>",
		"/A100 << /ca 1 /CA 1 >>"
	].join(" ")} >> >>`;
	for (const contentId of contentIds) {
		objects.push(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] /Resources ${resources} /Contents ${contentId} 0 R >>`);
		pageIds.push(objects.length);
	}
	const kids = pageIds.map((id) => `${id} 0 R`).join(" ");
	objects.push(`<< /Type /Pages /Kids [ ${kids} ] /Count ${pageIds.length} >>`);
	const pagesId = objects.length;
	objects.push(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
	const catalogId = objects.length;
	objects.push(`<< /Title (${pdfEscape(meta.title)}) /Creator (Falcon Wealth) /Producer (Falcon Portfolio Model) >>`);
	const infoId = objects.length;
	const patched = objects.map((body, idx) => {
		const id = idx + 1;
		if (pageIds.includes(id)) return body.replace("/Parent 0 0 R", `/Parent ${pagesId} 0 R`);
		return body;
	});
	const chunks = [latin1("%PDF-1.4\n%âãÏÓ\n")];
	let offset = 15;
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
	for (let i = 1; i <= patched.length; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
	const trailer = `trailer\n<< /Size ${patched.length + 1} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
	chunks.push(latin1(xref + trailer));
	return concat(chunks);
}
function latin1(text) {
	const out = new Uint8Array(text.length);
	for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 255;
	return out;
}
function concat(parts) {
	const total = parts.reduce((sum, part) => sum + part.length, 0);
	const out = new Uint8Array(total);
	let offset = 0;
	for (const part of parts) {
		out.set(part, offset);
		offset += part.length;
	}
	return out;
}
function sleeveRgb(kind) {
	switch (kind) {
		case "equity": return [
			.302,
			.388,
			.337
		];
		case "fixed": return [
			.29,
			.361,
			.42
		];
		case "alt-income": return [
			.416,
			.384,
			.345
		];
		case "alt-equity": return [
			.243,
			.325,
			.282
		];
		case "crypto": return [
			.42,
			.337,
			.282
		];
		case "ai": return [
			.31,
			.345,
			.329
		];
		case "buffer": return [
			.361,
			.341,
			.282
		];
	}
}
function buildProposalPdf(input, allocation, advisorName) {
	const doc = new PdfDoc("FALCON PORTFOLIO PROPOSAL");
	const client = input.clientName.trim() || "Client proposal";
	drawCover(doc, {
		client,
		advisor: advisorName.trim() || "Falcon advisor",
		aum: input.accountValue === null ? "Not specified" : formatUsd(input.accountValue),
		date: dateLabel(),
		allocation
	});
	drawKpis(doc, allocation);
	drawBar(doc, allocation);
	drawVision(doc, input);
	drawHoldings(doc, input, allocation);
	drawDisclaimer(doc);
	return assemblePdf(doc, {
		title: `Falcon Portfolio Proposal - ${client} - ${allocation.policyCode}`,
		footerLeft: "Confidential  ·  Falcon Core-Satellite Model"
	});
}
function drawCover(doc, meta) {
	const bandH = 92;
	const bandY = doc.y - bandH;
	doc.fillRect(48, bandY, doc.contentWidth, bandH, NAVY);
	doc.fillRect(48, bandY + bandH - 2.2, doc.contentWidth, 2.2, GOLD);
	doc.falconMark(64, bandY + 54, 22);
	doc.text("FALCON WEALTH", 94, bandY + 68, 11, "HB", PAPER);
	doc.text("P O R T F O L I O   P R O P O S A L", 94, bandY + 54, 8, "H", CREAM);
	doc.textRight(meta.date, 548, bandY + 68, 8, "H", CREAM);
	doc.textRight("Advisor use only", 548, bandY + 54, 8, "H", CREAM);
	doc.text("Prepared for", 64, bandY + 28, 8, "H", CREAM);
	const clientSize = meta.client.length > 42 ? 14 : 18;
	doc.text(fit(meta.client, clientSize, doc.contentWidth - 32, true), 64, bandY + 12, clientSize, "TB", PAPER);
	doc.y = bandY - 18;
	for (const line of wrap(meta.allocation.policyTitle, 15, doc.contentWidth, true).slice(0, 3)) {
		doc.text(line, 48, doc.y, 15, "TB");
		doc.y -= 17;
	}
	doc.text(meta.allocation.policyCode, 48, doc.y, 9, "HB", MUTED);
	doc.y -= 18;
	const col = doc.contentWidth / 3;
	metaRow(doc, 48, "Advisor", meta.advisor, col - 10);
	metaRow(doc, 48 + col, "Account value", meta.aum, col - 10);
	metaRow(doc, 48 + col * 2, "Core model as of", CORE_AS_OF, col);
	doc.y -= 28;
	doc.line(48, doc.y, 564, doc.y, RULE, .7);
	doc.y -= 16;
}
function metaRow(doc, x, label, value, max) {
	doc.text(label.toUpperCase(), x, doc.y, 7, "HB", MUTED);
	wrap(value, 10, max, false).slice(0, 2).forEach((line, i) => {
		doc.text(line, x, doc.y - 12 - i * 11, 10, "H");
	});
}
function drawKpis(doc, allocation) {
	doc.ensure(70);
	const gap = 8;
	const boxW = (doc.contentWidth - 24) / 4;
	const boxH = 52;
	const y = doc.y - boxH;
	const equityPct = allocation.groups.find((g) => g.kind === "equity")?.weight ?? 0;
	const fixedPct = allocation.groups.find((g) => g.kind === "fixed")?.weight ?? 0;
	[
		{
			label: "Core equity",
			value: formatPct(equityPct),
			accent: sleeveRgb("equity")
		},
		{
			label: "Core fixed income",
			value: formatPct(fixedPct),
			accent: sleeveRgb("fixed")
		},
		{
			label: "Satellite",
			value: allocation.satelliteSleevePct ? formatPct(allocation.satelliteSleevePct) : "None",
			accent: INK
		},
		{
			label: "Account ER",
			value: formatEr(allocation.portfolioWeightedEr),
			accent: MUTED
		}
	].forEach((tile, i) => {
		const x = 48 + i * (boxW + gap);
		doc.fillRect(x, y, boxW, boxH, PAPER);
		doc.strokeRect(x, y, boxW, boxH, RULE, .6);
		doc.fillRect(x, y, 3, boxH, tile.accent);
		doc.text(tile.label.toUpperCase(), x + 10, y + 36, 7, "HB", MUTED);
		doc.text(tile.value, x + 10, y + 16, 14, "TB");
	});
	doc.y = y - 18;
}
function drawBar(doc, allocation) {
	doc.ensure(56);
	doc.text("STRATEGIC ALLOCATION", 48, doc.y, 8, "HB", MUTED);
	doc.y -= 12;
	const barH = 14;
	const y = doc.y - barH;
	let x = 48;
	for (const sleeve of allocation.sleeves) {
		const w = sleeve.weight / 100 * doc.contentWidth;
		if (w <= .4) continue;
		doc.fillRect(x, y, w, barH, sleeveRgb(sleeve.kind));
		if (w >= 42) doc.text(formatPct(sleeve.weight), x + 4, y + 4, 7, "HB", PAPER);
		x += w;
	}
	doc.y = y - 14;
	let legendX = 48;
	for (const sleeve of allocation.sleeves) {
		doc.fillRect(legendX, doc.y, 6, 6, sleeveRgb(sleeve.kind));
		const label = `${sleeve.label}  ${formatPct(sleeve.weight)}`;
		doc.text(label, legendX + 9, doc.y, 8, "H", MUTED);
		legendX += measure(label, 8) + 22;
		if (legendX > 484) {
			legendX = 48;
			doc.y -= 12;
		}
	}
	doc.y -= 20;
}
function drawVision(doc, input) {
	const vision = visionFundStatus(input);
	if (!vision.applies) return;
	doc.ensure(46);
	const h = 40;
	const y = doc.y - h;
	doc.fillRect(48, y, doc.contentWidth, h, WARN_BG);
	doc.fillRect(48, y, 3, h, WARN);
	const title = vision.ok === false ? `${VISION_FUND_NAME} is below the ${formatUsd(VISION_FUND_MIN)} sleeve minimum.` : `${VISION_FUND_NAME} sleeve meets the ${formatUsd(VISION_FUND_MIN)} minimum.`;
	doc.text(title, 60, y + 24, 9, "HB", WARN);
	const detail = vision.ok === false && vision.shortfall !== null ? `Satellite sleeve ${formatUsd(vision.satelliteDollars ?? 0)}. Shortfall ${formatUsd(vision.shortfall)}.` : "Eligible investors only. Subject to a separate fund subscription.";
	doc.text(detail, 60, y + 10, 8, "H", INK);
	doc.y = y - 16;
}
function drawHoldings(doc, input, allocation) {
	doc.ensure(48);
	doc.text("LOOK-THROUGH HOLDINGS", 48, doc.y, 8, "HB", MUTED);
	doc.y -= 6;
	doc.line(48, doc.y, 564, doc.y, INK, .9);
	doc.y -= 14;
	const showAmt = input.accountValue !== null;
	const right = 564;
	const amtX = right;
	const acctX = showAmt ? 486 : right;
	const modelX = acctX - 62;
	const tickerX = 56;
	const nameX = 106;
	const nameMax = modelX - nameX - 8;
	for (const group of allocation.groups) {
		doc.ensure(36);
		doc.fillRect(48, doc.y - 6, doc.contentWidth, 16, CREAM);
		doc.fillRect(48, doc.y - 6, 3, 16, sleeveRgb(group.kind));
		doc.text(group.label.toUpperCase(), 58, doc.y, 8, "HB");
		doc.textRight(formatPct(group.weight), 560, doc.y, 8, "HB");
		doc.y -= 16;
		doc.text("TICKER", tickerX, doc.y, 6.5, "HB", MUTED);
		doc.text("HOLDING", nameX, doc.y, 6.5, "HB", MUTED);
		doc.textRight("MODEL", modelX, doc.y, 6.5, "HB", MUTED);
		doc.textRight("ACCOUNT", acctX, doc.y, 6.5, "HB", MUTED);
		if (showAmt) doc.textRight("AMOUNT", amtX, doc.y, 6.5, "HB", MUTED);
		doc.y -= 5;
		doc.line(48, doc.y, right, doc.y, RULE, .4);
		doc.y -= 12;
		for (const line of group.lines) {
			if (doc.y - 16 < 58) {
				doc.addPage(true);
				doc.fillRect(48, doc.y - 6, doc.contentWidth, 16, CREAM);
				doc.fillRect(48, doc.y - 6, 3, 16, sleeveRgb(group.kind));
				doc.text(`${group.label.toUpperCase()}  (continued)`, 58, doc.y, 8, "HB");
				doc.y -= 18;
			}
			doc.text(line.ticker, tickerX, doc.y, 8, "HB");
			const name = wrap(line.name, 8, nameMax)[0] ?? line.name;
			doc.text(name, nameX, doc.y, 8, "H");
			doc.textRight(line.coreWeight === null ? "-" : formatPct(line.coreWeight), modelX, doc.y, 8, "H", MUTED);
			doc.textRight(formatPct(line.weight), acctX, doc.y, 8, "H");
			if (showAmt && input.accountValue !== null) doc.textRight(formatUsd(line.weight / 100 * input.accountValue), amtX, doc.y, 8, "H");
			doc.y -= 13;
		}
		doc.y -= 8;
	}
}
function drawDisclaimer(doc) {
	doc.ensure(48);
	doc.line(48, doc.y, 564, doc.y, RULE, .5);
	doc.y -= 12;
	const copy = "For advisor use only. Model policy weights as of " + CORE_AS_OF + ". Not a recommendation or an offer to sell securities. Private investments and Falcon Vision Fund I are available only to eligible investors and are subject to separate subscription documents and minimums. Past performance is not indicative of future results.";
	for (const line of wrap(copy, 7.5, doc.contentWidth)) {
		doc.ensure(12);
		doc.text(line, 48, doc.y, 7.5, "H", MUTED);
		doc.y -= 10;
	}
}
//#endregion
export { proposalCsv as A, dateLabel as C, isEmailAddress as D, fit as E, proposalEmailSubject as M, proposalFileStem as N, loadCalibriFonts as O, wrap as P, bytesToBase64 as S, downloadTextFile as T, WARN_BG as _, INK as a, buildProposalEml as b, NAVY_LIFT as c, PAPER as d, PdfDoc as f, WARN as g, SOFT as h, GOLD as i, proposalEmailBody as j, measure as k, OK as l, SAGE as m, ALERT_BG as n, MUTED as o, RULE as p, CREAM as r, NAVY as s, ALERT as t, OK_BG as u, WASH as v, downloadBytes as w, buildProposalPdf as x, assemblePdf as y };
