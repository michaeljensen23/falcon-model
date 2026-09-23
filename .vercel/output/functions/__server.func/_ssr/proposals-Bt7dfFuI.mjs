import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as isFalconAdvisorEmail } from "./advisor-access-B_u2Nc31.mjs";
import { C as parseProposalSnapshot, T as serializeProposalSnapshot, b as isSatelliteComplete, d as authMiddleware, f as buildAllocation } from "./proposal-snapshot-CVHrZq6Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proposals-Bt7dfFuI.js
var PROPOSAL_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var MAX_PROPOSALS_PER_ADVISOR = 200;
var PUBLIC_PROPOSAL_ERRORS = /* @__PURE__ */ new Set([
	"Invalid proposal.",
	"Client name is required to save a proposal.",
	"Client name is too long.",
	"Finish the satellite overlay before saving.",
	"Proposal not found.",
	"Too many saved proposals. Delete one first.",
	"Could not save proposal.",
	"Advisor profile not found.",
	"Invalid client name.",
	"Invalid account value.",
	"Invalid core mix.",
	"Invalid satellite flag.",
	"Invalid satellite weight.",
	"Invalid satellite split.",
	"Invalid satellite theme.",
	"Invalid proposal snapshot."
]);
function rethrowPublic(err, fallback) {
	if (err instanceof Error && PUBLIC_PROPOSAL_ERRORS.has(err.message)) throw err;
	throw new Error(fallback);
}
function advisorLockKey(userId) {
	let hash = 0n;
	for (let i = 0; i < userId.length; i++) hash = (hash * 131n + BigInt(userId.charCodeAt(i))) % 9223372036854775807n;
	return (hash === 0n ? 1n : hash).toString();
}
function isProposalId(id) {
	return typeof id === "string" && PROPOSAL_ID_RE.test(id);
}
function parseProposalId(id) {
	if (!isProposalId(id)) throw new Error("Invalid proposal.");
	return id;
}
function iso(value) {
	return value instanceof Date ? value.toISOString() : String(value);
}
function toListItem(row) {
	return {
		id: row.id,
		clientName: row.client_name,
		advisorName: row.advisor_name,
		advisorEmail: row.advisor_email,
		policyCode: row.policy_code,
		policyTitle: row.policy_title,
		updatedAt: iso(row.updated_at)
	};
}
async function advisorProfile(userId) {
	const { getSql } = await import("./db-6DJQwbDe.mjs").then((n) => n.t).then((n) => n.t);
	const row = (await (await getSql())`
    select name, email from "user" where id = ${userId} limit 1
  `)[0];
	if (!row?.email || !isFalconAdvisorEmail(row.email)) throw new Error("Advisor profile not found.");
	return {
		name: row.name?.trim() || row.email,
		email: row.email
	};
}
function cleanInput(input) {
	const clientName = input.clientName.trim();
	if (!clientName) throw new Error("Client name is required to save a proposal.");
	if (clientName.length > 80) throw new Error("Client name is too long.");
	if (input.satelliteOn && !isSatelliteComplete(input)) throw new Error("Finish the satellite overlay before saving.");
	return {
		...input,
		clientName
	};
}
var listProposals_createServerFn_handler = createServerRpc({
	id: "4b57b759a4641d076ea49d8e5784b723fdf9c402c5947ece008fd3f220954b5a",
	name: "listProposals",
	filename: "src/lib/proposals.ts"
}, (opts) => listProposals.__executeServer(opts));
var listProposals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listProposals_createServerFn_handler, async ({ context }) => {
	try {
		const { getSql } = await import("./db-6DJQwbDe.mjs").then((n) => n.t).then((n) => n.t);
		return (await (await getSql())`
        select id, client_name, advisor_name, advisor_email, policy_code, policy_title, created_at, updated_at
        from proposals
        where user_id = ${context.userId}
        order by updated_at desc
        limit 200
      `).map(toListItem);
	} catch (err) {
		rethrowPublic(err, "Could not load proposals.");
	}
});
var getProposal_createServerFn_handler = createServerRpc({
	id: "1eded42adfab784c4924a34d0ff5c82dfe5e38615830b2b79d8f3db65b1b8c7b",
	name: "getProposal",
	filename: "src/lib/proposals.ts"
}, (opts) => getProposal.__executeServer(opts));
var getProposal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => parseProposalId(id)).handler(getProposal_createServerFn_handler, async ({ context, data: id }) => {
	try {
		const { getSql } = await import("./db-6DJQwbDe.mjs").then((n) => n.t).then((n) => n.t);
		const row = (await (await getSql())`
        select id, client_name, advisor_name, advisor_email, policy_code, policy_title, snapshot, created_at, updated_at
        from proposals
        where id = ${id} and user_id = ${context.userId}
        limit 1
      `)[0];
		if (!row) throw new Error("Proposal not found.");
		return {
			...toListItem(row),
			snapshot: parseProposalSnapshot(row.snapshot),
			createdAt: iso(row.created_at)
		};
	} catch (err) {
		rethrowPublic(err, "Could not open that proposal.");
	}
});
var saveProposal_createServerFn_handler = createServerRpc({
	id: "7d631ed7f384f316ac6b037f45fcbb5f87aac5f29af854d251280e1adbf97ab1",
	name: "saveProposal",
	filename: "src/lib/proposals.ts"
}, (opts) => saveProposal.__executeServer(opts));
var saveProposal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((payload) => {
	if (!payload || typeof payload !== "object") throw new Error("Invalid proposal.");
	const body = payload;
	return {
		id: typeof body.id === "string" && body.id ? parseProposalId(body.id) : null,
		input: cleanInput(parseProposalSnapshot(body.input))
	};
}).handler(saveProposal_createServerFn_handler, async ({ context, data }) => {
	try {
		const advisor = await advisorProfile(context.userId);
		const allocation = buildAllocation(data.input);
		const snapshot = serializeProposalSnapshot(data.input);
		const { getSql } = await import("./db-6DJQwbDe.mjs").then((n) => n.t).then((n) => n.t);
		const sql = await getSql();
		const id = data.id ?? crypto.randomUUID();
		if (data.id) {
			const row = (await sql`
          update proposals
          set
            client_name = ${data.input.clientName},
            advisor_name = ${advisor.name},
            advisor_email = ${advisor.email},
            policy_code = ${allocation.policyCode},
            policy_title = ${allocation.policyTitle},
            snapshot = ${snapshot},
            updated_at = now()
          where id = ${id} and user_id = ${context.userId}
          returning id, client_name, advisor_name, advisor_email, policy_code, policy_title, updated_at
        `)[0];
			if (!row) throw new Error("Proposal not found.");
			return toListItem(row);
		}
		const row = (await sql`
        with locked as materialized (
          select pg_advisory_xact_lock(${advisorLockKey(context.userId)}::bigint) as ok
        )
        insert into proposals (
          id, user_id, client_name, advisor_name, advisor_email, policy_code, policy_title, snapshot
        )
        select
          ${id}, ${context.userId}, ${data.input.clientName}, ${advisor.name}, ${advisor.email},
          ${allocation.policyCode}, ${allocation.policyTitle}, ${snapshot}
        from (
          select count(*)::int as n
          from proposals
          cross join locked
          where proposals.user_id = ${context.userId}
        ) as room
        where room.n < ${MAX_PROPOSALS_PER_ADVISOR}
        returning id, client_name, advisor_name, advisor_email, policy_code, policy_title, updated_at
      `)[0];
		if (!row) throw new Error("Too many saved proposals. Delete one first.");
		return toListItem(row);
	} catch (err) {
		rethrowPublic(err, "Could not save proposal.");
	}
});
var deleteProposal_createServerFn_handler = createServerRpc({
	id: "f1fb99c63e98af54e7e2066ae009d14a0c0d91d6955c350f66559f6967e3c96f",
	name: "deleteProposal",
	filename: "src/lib/proposals.ts"
}, (opts) => deleteProposal.__executeServer(opts));
var deleteProposal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => parseProposalId(id)).handler(deleteProposal_createServerFn_handler, async ({ context, data: id }) => {
	try {
		const { getSql } = await import("./db-6DJQwbDe.mjs").then((n) => n.t).then((n) => n.t);
		if (!(await (await getSql())`
        delete from proposals
        where id = ${id} and user_id = ${context.userId}
        returning id
      `)[0]) throw new Error("Proposal not found.");
		return { ok: true };
	} catch (err) {
		rethrowPublic(err, "Could not delete that proposal.");
	}
});
//#endregion
export { deleteProposal_createServerFn_handler, getProposal_createServerFn_handler, listProposals_createServerFn_handler, saveProposal_createServerFn_handler };
