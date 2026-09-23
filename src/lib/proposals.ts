import { createServerFn } from "@tanstack/react-start";
import { isFalconAdvisorEmail } from "@/lib/advisor-access";
import { authMiddleware } from "@/lib/auth/middleware";
import { MAX_CLIENT_NAME, buildAllocation, isSatelliteComplete } from "@/lib/portfolio";
import { parseProposalSnapshot, serializeProposalSnapshot } from "@/lib/proposal-snapshot";
import type { ModelInput } from "@/lib/portfolio";

export type ProposalListItem = {
  id: string;
  clientName: string;
  advisorName: string;
  advisorEmail: string;
  policyCode: string;
  policyTitle: string;
  updatedAt: string;
};

export type ProposalRecord = ProposalListItem & {
  snapshot: ModelInput;
  createdAt: string;
};

type AdvisorRow = { name: string; email: string };
type ProposalRow = {
  id: string;
  client_name: string;
  advisor_name: string;
  advisor_email: string;
  policy_code: string;
  policy_title: string;
  snapshot?: string;
  created_at: string | Date;
  updated_at: string | Date;
};

const PROPOSAL_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MAX_PROPOSALS_PER_ADVISOR = 200;

const PUBLIC_PROPOSAL_ERRORS = new Set([
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
  "Invalid proposal snapshot.",
]);

function rethrowPublic(err: unknown, fallback: string): never {
  if (err instanceof Error && PUBLIC_PROPOSAL_ERRORS.has(err.message)) throw err;
  throw new Error(fallback);
}

function advisorLockKey(userId: string): string {
  let hash = 0n;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 131n + BigInt(userId.charCodeAt(i))) % 0x7fffffffffffffffn;
  }
  return (hash === 0n ? 1n : hash).toString();
}

export function isProposalId(id: unknown): id is string {
  return typeof id === "string" && PROPOSAL_ID_RE.test(id);
}

function parseProposalId(id: unknown): string {
  if (!isProposalId(id)) {
    throw new Error("Invalid proposal.");
  }
  return id;
}

function iso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

function toListItem(row: ProposalRow): ProposalListItem {
  return {
    id: row.id,
    clientName: row.client_name,
    advisorName: row.advisor_name,
    advisorEmail: row.advisor_email,
    policyCode: row.policy_code,
    policyTitle: row.policy_title,
    updatedAt: iso(row.updated_at),
  };
}

async function advisorProfile(userId: string): Promise<AdvisorRow> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<AdvisorRow>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  const row = rows[0];
  if (!row?.email || !isFalconAdvisorEmail(row.email)) throw new Error("Advisor profile not found.");
  return {
    name: row.name?.trim() || row.email,
    email: row.email,
  };
}

function cleanInput(input: ModelInput): ModelInput {
  const clientName = input.clientName.trim();
  if (!clientName) throw new Error("Client name is required to save a proposal.");
  if (clientName.length > MAX_CLIENT_NAME) throw new Error("Client name is too long.");
  if (input.satelliteOn && !isSatelliteComplete(input)) {
    throw new Error("Finish the satellite overlay before saving.");
  }
  return { ...input, clientName };
}

export const listProposals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ProposalListItem[]> => {
    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<ProposalRow>`
        select id, client_name, advisor_name, advisor_email, policy_code, policy_title, created_at, updated_at
        from proposals
        where user_id = ${context.userId}
        order by updated_at desc
        limit 200
      `;
      return rows.map(toListItem);
    } catch (err) {
      rethrowPublic(err, "Could not load proposals.");
    }
  });

export const getProposal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => parseProposalId(id))
  .handler(async ({ context, data: id }): Promise<ProposalRecord> => {
    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<ProposalRow>`
        select id, client_name, advisor_name, advisor_email, policy_code, policy_title, snapshot, created_at, updated_at
        from proposals
        where id = ${id} and user_id = ${context.userId}
        limit 1
      `;
      const row = rows[0];
      if (!row) throw new Error("Proposal not found.");
      return {
        ...toListItem(row),
        snapshot: parseProposalSnapshot(row.snapshot),
        createdAt: iso(row.created_at),
      };
    } catch (err) {
      rethrowPublic(err, "Could not open that proposal.");
    }
  });

export const saveProposal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((payload: unknown) => {
    if (!payload || typeof payload !== "object") throw new Error("Invalid proposal.");
    const body = payload as { id?: unknown; input?: unknown };
    const id = typeof body.id === "string" && body.id ? parseProposalId(body.id) : null;
    const input = cleanInput(parseProposalSnapshot(body.input));
    return { id, input };
  })
  .handler(async ({ context, data }): Promise<ProposalListItem> => {
    try {
      const advisor = await advisorProfile(context.userId);
      const allocation = buildAllocation(data.input);
      const snapshot = serializeProposalSnapshot(data.input);
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const id = data.id ?? crypto.randomUUID();

      if (data.id) {
        const updated = await sql<ProposalRow>`
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
        `;
        const row = updated[0];
        if (!row) throw new Error("Proposal not found.");
        return toListItem(row);
      }

      const lockKey = advisorLockKey(context.userId);
      // The count must not run until the advisory lock is held. An uncorrelated
      // count is planned as an InitPlan and can execute before the lock, so two
      // saves can both observe room under the cap. MATERIALIZED plus a reference
      // from the count forces lock-then-count in this one autocommit statement.
      const inserted = await sql<ProposalRow>`
        with locked as materialized (
          select pg_advisory_xact_lock(${lockKey}::bigint) as ok
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
      `;
      const row = inserted[0];
      if (!row) throw new Error("Too many saved proposals. Delete one first.");
      return toListItem(row);
    } catch (err) {
      rethrowPublic(err, "Could not save proposal.");
    }
  });

export const deleteProposal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => parseProposalId(id))
  .handler(async ({ context, data: id }): Promise<{ ok: true }> => {
    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<{ id: string }>`
        delete from proposals
        where id = ${id} and user_id = ${context.userId}
        returning id
      `;
      if (!rows[0]) throw new Error("Proposal not found.");
      return { ok: true };
    } catch (err) {
      rethrowPublic(err, "Could not delete that proposal.");
    }
  });
