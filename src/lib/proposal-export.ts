import {
  allocationCopy,
  formatPct,
  formatUsd,
  type Allocation,
  type ModelInput,
} from "./portfolio";

export function proposalFileStem(clientName: string, policyCode: string): string {
  const client = clientName.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "client";
  const code = policyCode.replace(/[^a-zA-Z0-9-]+/g, "");
  return `Falcon-${client}-${code}`.slice(0, 80);
}

export function proposalCsv(input: ModelInput, allocation: Allocation): string {
  const dollars = input.accountValue;
  const header = ["Sleeve", "Group", "Ticker", "Name", "Model %", "Account %", "Amount"];
  const rows = allocation.groups.flatMap((group) =>
    group.lines.map((line) => [
      group.label,
      line.group ?? "",
      line.ticker,
      line.name,
      line.coreWeight === null ? "" : formatPct(line.coreWeight),
      formatPct(line.weight),
      dollars === null ? "" : formatUsd((line.weight / 100) * dollars),
    ]),
  );
  return [header, ...rows].map((cols) => cols.map(escapeCsvCell).join(",")).join("\n") + "\n";
}

export function escapeCsvCell(value: string): string {
  let v = value.replace(/\0/g, "");
  if (/^\s*[=+\-@\t\r]/.test(v)) v = `'${v}`;
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function proposalPlaintext(
  input: ModelInput,
  allocation: Allocation,
  advisorName?: string,
): string {
  const extra = advisorName?.trim()
    ? [`Advisor: ${advisorName.trim()}`, ""]
    : [];
  const body = allocationCopy(input, allocation);
  if (extra.length === 0) return body;
  const lines = body.split("\n");
  const insertAt = lines.findIndex((line) => line.startsWith("Client:"));
  if (insertAt === -1) return `${extra[0]}\n${body}`;
  lines.splice(insertAt, 0, extra[0]);
  return lines.join("\n");
}

export function downloadTextFile(filename: string, contents: string, mime: string): void {
  downloadBytes(filename, new TextEncoder().encode(contents), `${mime};charset=utf-8`);
}

export function downloadBytes(filename: string, bytes: Uint8Array, mime: string): void {
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
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function proposalEmailSubject(clientName: string): string {
  const client = clientName.replace(/[\u0000-\u001f\u007f]/g, "").trim() || "client";
  return `Falcon portfolio proposal — ${client}`;
}

export function proposalEmailBody(): string {
  return [
    "Hello,",
    "",
    "Please find attached the portfolio proposal (PDF) and the holdings file (CSV).",
    "",
    "Thank you.",
  ].join("\n");
}

export function bytesToBase64(bytes: Uint8Array): string {
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function foldBase64(value: string): string {
  const lines: string[] = [];
  for (let i = 0; i < value.length; i += 76) lines.push(value.slice(i, i + 76));
  return lines.join("\r\n");
}

function headerSafe(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f"\\;]+/g, " ").trim();
}

export function buildProposalEml(opts: {
  to: string;
  clientName: string;
  pdfName: string;
  csvName: string;
  pdfBytes: Uint8Array;
  csvText: string;
}): string {
  const boundary = `falcon-${crypto.randomUUID()}`;
  const subject = proposalEmailSubject(opts.clientName);
  const csvBytes = new TextEncoder().encode(opts.csvText);
  const parts = [
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
    "",
  ];
  return parts.join("\r\n");
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isEmailAddress(value: string): boolean {
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
