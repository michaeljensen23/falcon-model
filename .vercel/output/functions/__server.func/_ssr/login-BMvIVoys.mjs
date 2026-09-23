//#region node_modules/.nitro/vite/services/ssr/assets/login-BMvIVoys.js
function isLoginRequired(result) {
	return result.ok === false && result.loginRequired === true;
}
function isConnectorPending(result) {
	return result.ok === false && result.pending === true;
}
function isFramed() {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
function isLoopbackHost(host) {
	return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}
/** Connector gate hosts only — no `gate.*.grok.me` sibling wildcards. */
var GATE_HOSTS = /* @__PURE__ */ new Set([
	"gate.grok.me",
	"gate.grok.com",
	"gate.app-builder-testing.com"
]);
/**
* Connector sign-in URLs only. Rejects javascript:, data:, and arbitrary https
* hosts so a poisoned `loginUrl` cannot bounce the advisor off-app.
*/
function isSafeLoginUrl(url) {
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
function redirectToLoginIfRequired(result) {
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
//#endregion
export { redirectToLoginIfRequired as i, isLoginRequired as n, isSafeLoginUrl as r, isConnectorPending as t };
