import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as isSafeLoginUrl } from "./login-BMvIVoys.mjs";
import { i as GmailTools, r as ConnectorType } from "./types-BKjm7_U5.mjs";
import { r as isFalconAdvisorEmail } from "./advisor-access-B_u2Nc31.mjs";
import { C as parseProposalSnapshot, d as authMiddleware, f as buildAllocation } from "./proposal-snapshot-CVHrZq6Z.mjs";
import { A as proposalCsv, D as isEmailAddress, M as proposalEmailSubject, N as proposalFileStem, S as bytesToBase64, j as proposalEmailBody, x as buildProposalPdf } from "./proposal-pdf-CzQs0ZB-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proposal-email-DtGY_qwA.js
var WINDOW_MS = 6e5;
var MAX_PER_WINDOW = 20;
var MIN_GAP_MS = 2500;
var MAX_TRACKED_USERS = 500;
var emailHits = /* @__PURE__ */ new Map();
function pruneHits(now, keepId) {
	for (const [id, times] of emailHits) {
		const fresh = times.filter((t) => now - t < WINDOW_MS);
		if (fresh.length === 0) emailHits.delete(id);
		else if (fresh.length !== times.length) emailHits.set(id, fresh);
	}
	while (emailHits.size > MAX_TRACKED_USERS) {
		let oldestId;
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
function rateLimit(userId) {
	const now = Date.now();
	pruneHits(now, userId);
	const hits = emailHits.get(userId) ?? [];
	if (hits.some((t) => now - t < MIN_GAP_MS)) throw new Error("Email is already sending. Wait a moment.");
	if (hits.length >= MAX_PER_WINDOW) throw new Error("Too many emails. Wait a few minutes and try again.");
	const next = [...hits, now];
	emailHits.delete(userId);
	emailHits.set(userId, next);
	pruneHits(now, userId);
}
function withExt(name, ext) {
	return name.toLowerCase().endsWith(`.${ext}`) ? name : `${name}.${ext}`;
}
var PUBLIC_EMAIL_ERRORS = /* @__PURE__ */ new Set([
	"Enter a valid email address.",
	"Invalid email.",
	"Email is already sending. Wait a moment.",
	"Too many emails. Wait a few minutes and try again.",
	"Advisor profile not found.",
	"Could not build the proposal PDF.",
	"Could not send email."
]);
function rethrowPublic(err) {
	if (err instanceof Error && PUBLIC_EMAIL_ERRORS.has(err.message)) throw err;
	throw new Error("Could not send email.");
}
function safeEmailFailure(result) {
	const pending = Boolean(result.pending);
	const loginRequired = Boolean(result.loginRequired);
	let errorMessage = "Could not send email.";
	if (pending || loginRequired) errorMessage = "Connect Gmail to send from this app.";
	else {
		const raw = (result.errorMessage ?? "").toLowerCase();
		if (raw.includes("missing_connector_token") || raw.includes("connector_token_pending")) errorMessage = "Connect Gmail from Grok, then try again.";
	}
	return {
		ok: false,
		loginRequired,
		loginUrl: isSafeLoginUrl(result.loginUrl) ? result.loginUrl : void 0,
		pending,
		errorMessage
	};
}
var sendProposalEmail_createServerFn_handler = createServerRpc({
	id: "05ae0d40a3cb54bd75b323743f94c2544672af619503c93a786af9f430cfd1da",
	name: "sendProposalEmail",
	filename: "src/lib/proposal-email.ts"
}, (opts) => sendProposalEmail.__executeServer(opts));
var sendProposalEmail = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((payload) => {
	if (!payload || typeof payload !== "object") throw new Error("Invalid email.");
	const body = payload;
	const to = typeof body.to === "string" ? body.to.trim() : "";
	if (!isEmailAddress(to)) throw new Error("Enter a valid email address.");
	return {
		to,
		input: parseProposalSnapshot(body.input)
	};
}).handler(sendProposalEmail_createServerFn_handler, async ({ context, data }) => {
	try {
		rateLimit(context.userId);
		const { getSql } = await import("./db-6DJQwbDe.mjs").then((n) => n.t).then((n) => n.t);
		const advisor = (await (await getSql())`
        select name, email from "user" where id = ${context.userId} limit 1
      `)[0];
		if (!advisor?.email || !isFalconAdvisorEmail(advisor.email)) throw new Error("Advisor profile not found.");
		const advisorName = advisor.name?.trim() || advisor.email;
		const allocation = buildAllocation(data.input);
		const pdfBytes = buildProposalPdf(data.input, allocation, advisorName);
		if (pdfBytes.length < 8 || String.fromCharCode(...pdfBytes.subarray(0, 4)) !== "%PDF") throw new Error("Could not build the proposal PDF.");
		const csvText = proposalCsv(data.input, allocation);
		const stem = proposalFileStem(data.input.clientName, allocation.policyCode);
		const pdfFilename = withExt(stem, "pdf");
		const csvFilename = withExt(`${stem}`, "csv");
		const csvBytes = new TextEncoder().encode(csvText);
		const { callTool } = await import("./client.server-C7mQ-3Ug.mjs");
		const attachments = [{
			filename: pdfFilename,
			mimeType: "application/pdf",
			data: bytesToBase64(pdfBytes)
		}, {
			filename: csvFilename,
			mimeType: "text/csv",
			data: bytesToBase64(csvBytes)
		}];
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
				content: file.data
			}))
		};
		const send = await callTool(GmailTools.sendEmail, args, { connectorType: ConnectorType.Gmail });
		if (send.ok) return {
			ok: true,
			via: "gmail"
		};
		if (send.loginRequired || send.pending) return safeEmailFailure(send);
		const draft = await callTool(GmailTools.createDraft, args, { connectorType: ConnectorType.Gmail });
		if (draft.ok) return {
			ok: true,
			via: "gmail"
		};
		return safeEmailFailure({
			loginRequired: draft.loginRequired,
			pending: draft.pending,
			loginUrl: draft.loginUrl,
			errorMessage: draft.errorMessage ?? send.errorMessage
		});
	} catch (err) {
		rethrowPublic(err);
	}
});
//#endregion
export { sendProposalEmail_createServerFn_handler };
