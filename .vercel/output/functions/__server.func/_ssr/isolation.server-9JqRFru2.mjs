import { o as getRequest } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/isolation.server-9JqRFru2.js
/**
* Fetch-Metadata sibling isolation — **server-only** (`.server.ts` suffix).
*
* MUST keep the `.server` suffix: this file imports `@tanstack/react-start/server`
* (`getRequest` → Node `AsyncLocalStorage`). If it is imported from a dual
* client/server module under a non-`.server` name, Vite ships it to the browser
* and the app dies with: `AsyncLocalStorage is not a constructor`.
*
* Apps deployed on `*.grok.me` are "same-site" to each other but MUTUALLY
* UNTRUSTED, and a `SameSite=Lax` session cookie IS sent on same-site
* subrequests — so without this, a malicious sibling could make a SCRIPTED
* (fetch/XHR/form-POST) request to this app's server functions and ride this
* app's session cookie.
*
* We allow only: same-origin requests (this app's own client), non-browser
* requests (SSR / server-to-server, which send no `Sec-Fetch-Site`), and
* top-level GET navigations (how the OAuth callback and normal page loads
* arrive). Every cross-site / same-site *scripted* request is rejected.
* Together with `__Host-` cookies and Better Auth's `trustedOrigins`, this
* closes the sibling-tenant attack surface. Enforced at the `authMiddleware`
* chokepoint (see `middleware.ts`).
*
* Browsers that omit Fetch-Metadata still send Origin on mutating requests;
* those POSTs are fail-closed unless Origin/Referer matches Host.
* X-Forwarded-Host is never allowed to override a public Host (CSRF bypass).
*/
var CrossSiteRequestError = class extends Error {
	status = 403;
	constructor() {
		super("Forbidden: cross-site request blocked");
		this.name = "CrossSiteRequestError";
	}
};
var MUTATING = /* @__PURE__ */ new Set([
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
]);
/** Throw `CrossSiteRequestError` for a scripted cross-site/sibling request. */
function assertSameSiteRequest() {
	const request = getRequest();
	if (!request) return;
	assertSameSiteHeaders(request.headers, request.method);
}
/** Pure Fetch-Metadata / Origin policy — unit-tested without a request ALS. */
function assertSameSiteHeaders(headers, method) {
	const site = headers.get("sec-fetch-site");
	const verb = method.toUpperCase();
	if (!site || site === "same-origin" || site === "none") {
		if (!site) {
			const originHost = hostFromUrl(headers.get("origin"));
			if (MUTATING.has(verb) || originHost) assertOriginMatchesHost(headers);
		}
		return;
	}
	const dest = headers.get("sec-fetch-dest");
	if (headers.get("sec-fetch-mode") === "navigate" && verb === "GET" && dest !== "object" && dest !== "embed") return;
	throw new CrossSiteRequestError();
}
function hostName(raw) {
	if (!raw) return null;
	return (raw.trim().toLowerCase().split(":")[0] ?? "") || null;
}
function isLoopbackHost(host) {
	return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}
function hostFromUrl(raw) {
	if (!raw) return null;
	try {
		const url = new URL(raw);
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;
		return url.hostname.toLowerCase() || null;
	} catch {
		return null;
	}
}
/**
* Public hostname of this request. `X-Forwarded-Host` is honored only when
* `Host` is loopback (reverse proxy). A client-supplied forwarded host cannot
* impersonate Origin against a public Host.
*/
function requestHost(headers) {
	const host = hostName(headers.get("host"));
	const forwarded = hostName(headers.get("x-forwarded-host")?.split(",")[0]);
	if (host && isLoopbackHost(host) && forwarded) return forwarded;
	return host;
}
function assertOriginMatchesHost(headers) {
	const host = requestHost(headers);
	const originHost = hostFromUrl(headers.get("origin")) ?? hostFromUrl(headers.get("referer"));
	if (!host || !originHost || originHost !== host) throw new CrossSiteRequestError();
}
//#endregion
export { CrossSiteRequestError, assertSameSiteRequest };
