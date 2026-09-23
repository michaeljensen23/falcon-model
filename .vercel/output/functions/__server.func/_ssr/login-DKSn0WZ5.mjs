import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as signOut, r as signIn } from "./client-a1vn1Gjj.mjs";
import { n as advisorEmailHint, r as isFalconAdvisorEmail, t as GOOGLE_PROVIDER_ID } from "./advisor-access-B_u2Nc31.mjs";
import { r as Route$2 } from "./router-CvKedwBr.mjs";
import { a as SessionSkeleton, c as useCurrentUserState, n as Button, r as FalconLockup } from "./button-lR7jphil.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DKSn0WZ5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoogleSignInButton({ callbackURL = "/" }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			className: "w-full",
			disabled: busy,
			onClick: () => {
				setBusy(true);
				setError(null);
				signIn(GOOGLE_PROVIDER_ID, {
					callbackURL,
					errorCallbackURL: "/login?denied=1"
				}).catch(() => {
					setError("Sign-in was cancelled or blocked. Allow pop-ups and try again.");
				}).finally(() => {
					setBusy(false);
				});
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMark, {}), busy ? "Opening Google…" : "Continue with Google"]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: error
		}) : null]
	});
}
function GoogleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				opacity: "0.85",
				d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				opacity: "0.7",
				d: "M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.73.13-1.43.36-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.39l3.66-3.3Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				opacity: "0.55",
				d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
			})
		]
	});
}
function Login() {
	const { denied } = Route$2.useSearch();
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionSkeleton, {});
	if (user?.isDevFallback || user && isFalconAdvisorEmail(user.primaryEmail)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	const wrongAccount = Boolean(user) && !isFalconAdvisorEmail(user?.primaryEmail);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeniedScreen, {
		showDenied: denied || wrongAccount,
		wrongAccount
	});
}
function DeniedScreen({ showDenied, wrongAccount }) {
	(0, import_react.useEffect)(() => {
		if (!wrongAccount) return;
		signOut("/login?denied=1").catch(() => {});
	}, [wrongAccount]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-dvh flex-col bg-navy text-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FalconLockup, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "sr-only",
						children: "Falcon advisors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-card/75",
						children: [
							"The portfolio model is limited to Google accounts on",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-card",
								children: advisorEmailHint()
							}),
							"."
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card p-6 text-card-foreground shadow-card",
				children: [
					showDenied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: [
							"That Google account is not on the Falcon allowlist. Use your",
							" ",
							advisorEmailHint(),
							" Workspace login."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleSignInButton, { callbackURL: "/" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs leading-relaxed text-muted-foreground",
						children: [
							"Personal Gmail, X, and other domains cannot open this model. After Google confirms the account, only ",
							advisorEmailHint(),
							" mailboxes are admitted."
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { Login as component };
