import { r as createServerFn } from "./_ssr/ssr.mjs";
import { t as createServerRpc } from "./_ssr/createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/__root-CRQn2urM.js
var fetchAdvisorSession_createServerFn_handler = createServerRpc({
	id: "cff06ee5ed935e1ddc117dca0135eb189c4cec30c2991c916650aae9e8f97c91",
	name: "fetchAdvisorSession",
	filename: "src/routes/__root.tsx"
}, (opts) => fetchAdvisorSession.__executeServer(opts));
var fetchAdvisorSession = createServerFn({ method: "GET" }).handler(fetchAdvisorSession_createServerFn_handler, async () => {
	try {
		const { assertSameSiteRequest } = await import("./_ssr/isolation.server-9JqRFru2.mjs");
		assertSameSiteRequest();
	} catch {
		return null;
	}
	const { getSessionUser } = await import("./_ssr/verify.server-C6xviJG0.mjs");
	const user = await getSessionUser();
	if (!user) return null;
	return {
		id: user.id,
		email: user.email
	};
});
//#endregion
export { fetchAdvisorSession_createServerFn_handler };
