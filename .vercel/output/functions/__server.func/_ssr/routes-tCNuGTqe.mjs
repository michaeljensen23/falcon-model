import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as getRouteApi, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as FileDown, o as Plus, r as Trash2, s as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as listProposals, o as deleteProposal, s as getProposal } from "./router-CvKedwBr.mjs";
import { n as Button, s as useCurrentUser, t as AdvisorSessionGate } from "./button-lR7jphil.mjs";
import { l as PqDownloadButton, n as Card, r as CardContent, t as AppShell, u as ShareDialog } from "./card-7qWrvzuD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-tCNuGTqe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var rootRoute = getRouteApi("__root__");
function DashboardPage() {
	const { advisorSession } = rootRoute.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvisorSessionGate, {
		ssrEmail: advisorSession?.email,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {})
	});
}
function Dashboard() {
	const user = useCurrentUser();
	const advisorName = user?.displayName || user?.primaryEmail || "Advisor";
	const [rows, setRows] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [share, setShare] = (0, import_react.useState)(null);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(() => {
		listProposals().then((list) => {
			setRows(list);
			setError(null);
		}).catch((err) => {
			setRows([]);
			setError(err instanceof Error ? err.message : "Could not load proposals.");
		});
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function openShare(id, mode) {
		setBusyId(id);
		try {
			const record = await getProposal({ data: id });
			setShare({
				mode,
				input: record.snapshot,
				advisorName: record.advisorName
			});
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not open proposal.");
		} finally {
			setBusyId(null);
		}
	}
	async function remove(id, clientName) {
		if (!window.confirm(`Delete the proposal for ${clientName}?`)) return;
		setBusyId(id);
		try {
			await deleteProposal({ data: id });
			setRows((prev) => (prev ?? []).filter((row) => row.id !== id));
			toast("Proposal deleted");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not delete.");
		} finally {
			setBusyId(null);
		}
	}
	const countLabel = (0, import_react.useMemo)(() => {
		if (!rows) return "Loading proposals";
		if (rows.length === 1) return "1 saved proposal";
		return `${rows.length} saved proposals`;
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		subtitle: "Saved proposals",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PqDownloadButton, { advisorName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/model",
				search: {},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "New proposal"]
			})
		})] }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium tracking-tight sm:text-4xl",
						children: "Client proposals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [countLabel, user?.displayName || user?.primaryEmail ? ` · signed in as ${advisorName}` : ""]
					})
				] }),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive",
					children: error
				}) : null,
				rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-secondary" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col items-start gap-4 p-6 sm:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl font-medium tracking-tight",
						children: "No proposals yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-sm text-muted-foreground",
						children: "Build a core–satellite mix, save it under the household name, then export or email it from this book."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/model",
							search: {},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Build a proposal"]
						})
					})]
				}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden overflow-hidden rounded-xl bg-card shadow-card md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/80 text-left text-xs tracking-wide text-muted-foreground uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-medium",
									children: "Client"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-medium",
									children: "Advisor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-medium",
									children: "Portfolio"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-medium",
									children: "Updated"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: "Actions"
									})
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/model",
										search: { proposal: row.id },
										className: "font-medium hover:underline",
										children: row.clientName
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3.5 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-foreground",
										children: row.advisorName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: row.advisorEmail
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block",
										children: row.policyTitle
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium tabular-nums text-muted-foreground",
										children: row.policyCode
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 tabular-nums text-muted-foreground",
									children: formatUpdated(row.updatedAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowActions, {
										busy: busyId === row.id,
										onExport: () => void openShare(row.id, "export"),
										onEmail: () => void openShare(row.id, "email"),
										onDelete: () => void remove(row.id, row.clientName)
									})
								})
							]
						}, row.id)) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-3 md:hidden",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/model",
								search: { proposal: row.id },
								className: "font-medium hover:underline",
								children: row.clientName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: ["Advisor ", row.advisorName]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm",
								children: [row.policyTitle, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block font-medium tabular-nums text-muted-foreground",
									children: row.policyCode
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: formatUpdated(row.updatedAt)
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowActions, {
							busy: busyId === row.id,
							onExport: () => void openShare(row.id, "export"),
							onEmail: () => void openShare(row.id, "email"),
							onDelete: () => void remove(row.id, row.clientName)
						})]
					}) }) }, row.id))
				})] })
			]
		}), share ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareDialog, {
			open: true,
			mode: share.mode,
			input: share.input,
			advisorName: share.advisorName,
			onClose: () => setShare(null)
		}) : null]
	});
}
function RowActions({ busy, onExport, onEmail, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				disabled: busy,
				onClick: onExport,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {}), "Export"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				disabled: busy,
				onClick: onEmail,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {}), "Email"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				disabled: busy,
				onClick: onDelete,
				"aria-label": "Delete proposal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
			})
		]
	});
}
function formatUpdated(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	}).format(date);
}
//#endregion
export { DashboardPage as component };
