import type { CallToolResult } from "./types.ts";

export function isLoginRequired(result: CallToolResult): boolean {
  return result.ok === false && result.loginRequired === true;
}

export function isConnectorPending(result: CallToolResult): boolean {
  return result.ok === false && result.pending === true;
}

export function isFramed(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function isLoopbackHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/** Connector gate hosts only — no `gate.*.grok.me` sibling wildcards. */
const GATE_HOSTS = new Set([
  "gate.grok.me",
  "gate.grok.com",
  "gate.app-builder-testing.com",
]);

/**
 * Connector sign-in URLs only. Rejects javascript:, data:, and arbitrary https
 * hosts so a poisoned `loginUrl` cannot bounce the advisor off-app.
 */
export function isSafeLoginUrl(url: string | undefined): url is string {
  if (!url || url.length > 2048) return false;
  try {
    const parsed = new URL(url);
    if (parsed.username || parsed.password) return false;
    const host = parsed.hostname.toLowerCase();
    if (parsed.protocol === "http:") return isLoopbackHost(host);
    if (parsed.protocol !== "https:") return false;
    return GATE_HOSTS.has(host);
  } catch {
    return false;
  }
}

export function redirectToLoginIfRequired(result: CallToolResult): boolean {
  if (!isLoginRequired(result)) return false;
  const url = result.loginUrl;
  if (!isSafeLoginUrl(url)) return false;
  if (typeof window === "undefined") return false;
  if (isFramed()) {
    const opened = window.open(url, "_blank");
    if (opened) {
      opened.opener = null;
      return true;
    }
  }
  window.location.assign(url);
  return true;
}
