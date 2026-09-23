import { createServerFn } from "@tanstack/react-start";
import { isFalconAdvisorEmail } from "@/lib/advisor-access";
import { ConnectorType, GmailTools, isSafeLoginUrl } from "@/lib/app-data";
import { authMiddleware } from "@/lib/auth/middleware";
import { buildAllocation } from "@/lib/portfolio";
import { isEmailAddress, proposalCsv, proposalEmailBody, proposalEmailSubject, proposalFileStem, bytesToBase64 } from "@/lib/proposal-export";
import { buildProposalPdf } from "@/lib/proposal-pdf";
import { parseProposalSnapshot } from "@/lib/proposal-snapshot";

export type SendProposalEmailResult = {
  ok: boolean;
  via?: "gmail";
  loginRequired?: boolean;
  loginUrl?: string;
  pending?: boolean;
  errorMessage?: string;
};

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 20;
const MIN_GAP_MS = 2_500;
const MAX_TRACKED_USERS = 500;
const emailHits = new Map<string, number[]>();

function pruneHits(now: number, keepId?: string): void {
  for (const [id, times] of emailHits) {
    const fresh = times.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) emailHits.delete(id);
    else if (fresh.length !== times.length) emailHits.set(id, fresh);
  }
  while (emailHits.size > MAX_TRACKED_USERS) {
    let oldestId: string | undefined;
    let oldestAt = Infinity;
    for (const [id, times] of emailHits) {
      if (id === keepId) continue;
      const last = times[times.length - 1] ?? 0;
      if (last < oldestAt) {
        oldestAt = last;
        oldestId = id;
      }
    }
    if (!oldestId) break;
    emailHits.delete(oldestId);
  }
}

function rateLimit(userId: string): void {
  const now = Date.now();
  pruneHits(now, userId);
  const hits = emailHits.get(userId) ?? [];
  if (hits.some((t) => now - t < MIN_GAP_MS)) {
    throw new Error("Email is already sending. Wait a moment.");
  }
  if (hits.length >= MAX_PER_WINDOW) {
    throw new Error("Too many emails. Wait a few minutes and try again.");
  }
  const next = [...hits, now];
  emailHits.delete(userId);
  emailHits.set(userId, next);
  pruneHits(now, userId);
}

function withExt(name: string, ext: string): string {
  return name.toLowerCase().endsWith(`.${ext}`) ? name : `${name}.${ext}`;
}

const PUBLIC_EMAIL_ERRORS = new Set([
  "Enter a valid email address.",
  "Invalid email.",
  "Email is already sending. Wait a moment.",
  "Too many emails. Wait a few minutes and try again.",
  "Advisor profile not found.",
  "Could not build the proposal PDF.",
  "Could not send email.",
]);

function rethrowPublic(err: unknown): never {
  if (err instanceof Error && PUBLIC_EMAIL_ERRORS.has(err.message)) throw err;
  throw new Error("Could not send email.");
}

function safeEmailFailure(result: {
  loginRequired?: boolean;
  pending?: boolean;
  loginUrl?: string;
  errorMessage?: string;
}): SendProposalEmailResult {
  const pending = Boolean(result.pending);
  const loginRequired = Boolean(result.loginRequired);
  let errorMessage = "Could not send email.";
  if (pending || loginRequired) errorMessage = "Connect Gmail to send from this app.";
  else {
    const raw = (result.errorMessage ?? "").toLowerCase();
    if (raw.includes("missing_connector_token") || raw.includes("connector_token_pending")) {
      errorMessage = "Connect Gmail from Grok, then try again.";
    }
  }
  return {
    ok: false,
    loginRequired,
    loginUrl: isSafeLoginUrl(result.loginUrl) ? result.loginUrl : undefined,
    pending,
    errorMessage,
  };
}

export const sendProposalEmail = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((payload: unknown) => {
    if (!payload || typeof payload !== "object") throw new Error("Invalid email.");
    const body = payload as Record<string, unknown>;
    const to = typeof body.to === "string" ? body.to.trim() : "";
    if (!isEmailAddress(to)) throw new Error("Enter a valid email address.");
    const input = parseProposalSnapshot(body.input);
    return { to, input };
  })
  .handler(async ({ context, data }): Promise<SendProposalEmailResult> => {
    try {
      rateLimit(context.userId);
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<{ name: string; email: string }>`
        select name, email from "user" where id = ${context.userId} limit 1
      `;
      const advisor = rows[0];
      if (!advisor?.email || !isFalconAdvisorEmail(advisor.email)) {
        throw new Error("Advisor profile not found.");
      }
      const advisorName = advisor.name?.trim() || advisor.email;
      const allocation = buildAllocation(data.input);
      const pdfBytes = buildProposalPdf(data.input, allocation, advisorName);
      if (pdfBytes.length < 8 || String.fromCharCode(...pdfBytes.subarray(0, 4)) !== "%PDF") {
        throw new Error("Could not build the proposal PDF.");
      }
      const csvText = proposalCsv(data.input, allocation);
      const stem = proposalFileStem(data.input.clientName, allocation.policyCode);
      const pdfFilename = withExt(stem, "pdf");
      const csvFilename = withExt(`${stem}`, "csv");
      const csvBytes = new TextEncoder().encode(csvText);

      const { callTool } = await import("@/lib/app-data/client.server");
      const attachments = [
        {
          filename: pdfFilename,
          mimeType: "application/pdf",
          data: bytesToBase64(pdfBytes),
        },
        {
          filename: csvFilename,
          mimeType: "text/csv",
          data: bytesToBase64(csvBytes),
        },
      ];
      const args = {
        to: data.to,
        subject: proposalEmailSubject(data.input.clientName),
        body: proposalEmailBody(),
        attachments: attachments.map((file) => ({
          filename: file.filename,
          name: file.filename,
          mime_type: file.mimeType,
          mimeType: file.mimeType,
          contentType: file.mimeType,
          data: file.data,
          content: file.data,
        })),
      };

      const send = await callTool(GmailTools.sendEmail, args, {
        connectorType: ConnectorType.Gmail,
      });
      if (send.ok) return { ok: true, via: "gmail" };
      if (send.loginRequired || send.pending) return safeEmailFailure(send);

      const draft = await callTool(GmailTools.createDraft, args, {
        connectorType: ConnectorType.Gmail,
      });
      if (draft.ok) return { ok: true, via: "gmail" };
      return safeEmailFailure({
        loginRequired: draft.loginRequired,
        pending: draft.pending,
        loginUrl: draft.loginUrl,
        errorMessage: draft.errorMessage ?? send.errorMessage,
      });
    } catch (err) {
      rethrowPublic(err);
    }
  });
