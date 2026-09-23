/** Google Workspace domain allowed to use the advisor model. */
export const ADVISOR_EMAIL_DOMAIN = "falconwp.com";

/** Broker provider id for Google — the only sign-in method this app offers. */
export const GOOGLE_PROVIDER_ID = "grok-google";

const LOCAL_RE = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?$/;

/**
 * True when `email` is a real mailbox at @falconwp.com (case-insensitive).
 * Rejects missing local parts, extra @, internal whitespace, control characters,
 * and subdomains like @mail.falconwp.com.
 */
export function isFalconAdvisorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at <= 0) return false;
  if (trimmed.includes("@", at + 1)) return false;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (!LOCAL_RE.test(local) || local.includes("..")) return false;
  return domain === ADVISOR_EMAIL_DOMAIN;
}

export function advisorEmailHint(): string {
  return `@${ADVISOR_EMAIL_DOMAIN}`;
}
