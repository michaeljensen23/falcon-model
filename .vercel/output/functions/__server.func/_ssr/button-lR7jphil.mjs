import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as signOut, t as authClient } from "./client-a1vn1Gjj.mjs";
import { r as isFalconAdvisorEmail } from "./advisor-access-B_u2Nc31.mjs";
import { i as hasGateSessionMarker } from "./server-BMf7BEVC.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./router-CvKedwBr.mjs";
import { n as FALCON_SWIRL_SVG_PATHS } from "./falcon-swirl-Bp04hKtv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-lR7jphil.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FalconMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 512 512",
		className: cn("size-8 shrink-0", className),
		"aria-hidden": "true",
		focusable: "false",
		children: FALCON_SWIRL_SVG_PATHS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#E3CA67",
			d
		}, d.slice(0, 24)))
	});
}
function FalconLockup({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/brand/falcon-lockup.png",
		alt: "Falcon Wealth",
		draggable: false,
		className: cn("h-auto w-56 object-contain sm:w-64", className)
	});
}
function httpsImageUrl(url) {
	if (!url) return null;
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:") return null;
		if (parsed.username || parsed.password) return null;
		const host = parsed.hostname.toLowerCase();
		return host === "googleusercontent.com" || host.endsWith(".googleusercontent.com") || host === "gravatar.com" || host.endsWith(".gravatar.com") ? parsed.href : null;
	} catch {
		return null;
	}
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: httpsImageUrl(user.image),
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AdvisorSessionGate({ children, ssrEmail }) {
	const { user, isPending } = useCurrentUserState();
	const ssrAllowed = isFalconAdvisorEmail(ssrEmail);
	const clientAllowed = Boolean(user?.isDevFallback) || isFalconAdvisorEmail(user?.primaryEmail);
	if (isPending) return ssrAllowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionSkeleton, {});
	if (clientAllowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { denied: true }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: SIGN_IN_PATH });
}
function SessionSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-dvh flex-col bg-navy text-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FalconLockup, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "sr-only",
						children: "Falcon advisors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-card/75",
						children: "Confirming advisor access for @falconwp.com."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-xl bg-navy-lift" })]
		})
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-ink-soft",
			secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
			outline: "bg-transparent shadow-card hover:shadow-card-hover hover:bg-card",
			ghost: "hover:bg-secondary",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 min-h-11 px-4",
			sm: "h-9 min-h-9 px-3 text-sm",
			lg: "h-12 min-h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { SessionSkeleton as a, useCurrentUserState as c, FalconMark as i, Button as n, UserButton as o, FalconLockup as r, useCurrentUser as s, AdvisorSessionGate as t };
