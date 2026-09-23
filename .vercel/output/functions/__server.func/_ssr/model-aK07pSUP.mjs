import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as getRouteApi, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as themeById, E as sleeveColor, O as visionFundStatus, S as parseMoney, _ as formatUsd, a as ROLE_LABEL, c as VISION_FUND_MIN, f as buildAllocation, g as formatPct, h as formatEr, i as ROLE_COLOR, l as VISION_FUND_NAME, m as coreWeightedExpenseRatio, n as CORE_MODELS, o as SATELLITE_THEMES, p as coreByEquity, r as GICS, s as SATELLITE_WEIGHTS, t as CORE_AS_OF, u as allocationCopy, v as fundProfile, w as positionsByKind, x as isSatelliteThemeId, y as isEquityStep } from "./proposal-snapshot-CVHrZq6Z.mjs";
import { a as Printer, c as Info, d as Copy, h as Activity, i as Save, l as FileDown, m as Check, p as ChevronDown, s as Mail, t as X, u as Download } from "../_libs/lucide-react.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, l as saveProposal, n as Route$1, s as getProposal } from "./router-CvKedwBr.mjs";
import { i as FalconMark, n as Button, s as useCurrentUser, t as AdvisorSessionGate } from "./button-lR7jphil.mjs";
import { C as dateLabel, E as fit, N as proposalFileStem, P as wrap, _ as WARN_BG, a as INK, c as NAVY_LIFT, d as PAPER, f as PdfDoc, g as WARN, h as SOFT, i as GOLD, k as measure, l as OK, m as SAGE, n as ALERT_BG, o as MUTED, p as RULE, r as CREAM, s as NAVY, t as ALERT, u as OK_BG, v as WASH, w as downloadBytes, y as assemblePdf } from "./proposal-pdf-CzQs0ZB-.mjs";
import { a as CardHeader, c as Label, i as CardDescription, l as PqDownloadButton, n as Card, o as CardTitle, r as CardContent, s as Input, t as AppShell, u as ShareDialog } from "./card-7qWrvzuD.mjs";
import { a as Bar, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as Pie, r as YAxis, s as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/model-aK07pSUP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountFields({ clientName, accountValue, onClientName, onAccountValue }) {
	const [focused, setFocused] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const display = focused ? draft : accountValue === null ? "" : formatUsd(accountValue);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "client-name",
				children: "Client"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "client-name",
				autoComplete: "off",
				maxLength: 80,
				placeholder: "Household or account name",
				value: clientName,
				onChange: (e) => onClientName(e.target.value.slice(0, 80))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "account-value",
				children: "Account value"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "account-value",
				inputMode: "decimal",
				autoComplete: "off",
				placeholder: "$1,000,000",
				value: display,
				onFocus: () => {
					setDraft(accountValue === null ? "" : String(accountValue));
					setFocused(true);
				},
				onChange: (e) => setDraft(e.target.value),
				onBlur: () => {
					const parsed = parseMoney(draft);
					if (parsed !== null) onAccountValue(parsed);
					else if (!draft.trim()) onAccountValue(null);
					setFocused(false);
				}
			})]
		})]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground",
		muted: "bg-secondary text-muted-foreground",
		outline: "border border-border text-foreground",
		warn: "bg-warn/10 text-warn",
		ok: "bg-ok/10 text-ok"
	} },
	defaultVariants: { variant: "muted" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
	...props
}));
Separator.displayName = Root.displayName;
var TRAILING_AS_OF = "September 16, 2026";
var BNDW_TICKER = "BNDW";
var TRAILING_HORIZONS = [
	1,
	3,
	5
];
/** Published annualized total returns for VT, as of TRAILING_AS_OF. */
var VT_ANN = {
	1: 17.06,
	3: 19.96,
	5: 10.49
};
/** Published annualized total returns for BNDW, as of TRAILING_AS_OF. */
var BNDW_ANN = {
	1: -.89,
	3: 3.82,
	5: -.38
};
/**
* Representative annualized trailing returns by sleeve role, calibrated to the
* same windows as VT / BNDW. Used to reconstruct a look-through policy line —
* not live fund NAVs.
*/
var ROLE_ANN = {
	"us-equity": {
		1: 15.2,
		3: 21.4,
		5: 12.8
	},
	"intl-equity": {
		1: 23.8,
		3: 17.2,
		5: 8.4
	},
	"em-equity": {
		1: 19.5,
		3: 15.1,
		5: 6.2
	},
	"real-estate": {
		1: 7.6,
		3: 8.4,
		5: 4.8
	},
	"short-gov": {
		1: 4.6,
		3: 4.8,
		5: 2.6
	},
	"core-bond": {
		1: -.2,
		3: 4.1,
		5: -.2
	},
	credit: {
		1: 6.4,
		3: 7.6,
		5: 2.8
	},
	preferred: {
		1: 7.1,
		3: 8.4,
		5: 3.1
	},
	"private-income": {
		1: 8.6,
		3: 8.9,
		5: 7.2
	},
	"private-equity": {
		1: 9.4,
		3: 11.2,
		5: 12.4
	},
	crypto: {
		1: 42,
		3: 58,
		5: 22
	},
	"defined-outcome": {
		1: 10.2,
		3: 12.1,
		5: 7.4
	}
};
var WINDOW = {
	1: {
		label: "1-year",
		window: "Sep 2025 – Sep 2026"
	},
	3: {
		label: "3-year",
		window: "Sep 2023 – Sep 2026 · annualized"
	},
	5: {
		label: "5-year",
		window: "Sep 2021 – Sep 2026 · annualized"
	}
};
function benchmarkAnn(equityPct, years) {
	const eq = equityPct / 100;
	return eq * VT_ANN[years] + (1 - eq) * BNDW_ANN[years];
}
function benchmarkLabel(equityPct, fixedPct) {
	if (equityPct >= 100) return "100/0 · 100% VT";
	if (fixedPct >= 100) return "0/100 · 100% BNDW";
	return `${equityPct}/${fixedPct} · ${equityPct}% VT / ${fixedPct}% BNDW`;
}
function buildTrailingReturns(allocation, lines) {
	const equityPct = allocation.core.equity;
	const fixedPct = allocation.core.fixed;
	const sat = allocation.satelliteComplete && allocation.satelliteSleevePct > 0;
	const rows = TRAILING_HORIZONS.map((years) => {
		const portfolio = lookThroughAnn(lines, years);
		const benchmark = benchmarkAnn(equityPct, years);
		const meta = WINDOW[years];
		return {
			years,
			label: meta.label,
			window: meta.window,
			portfolio,
			benchmark,
			excess: portfolio - benchmark
		};
	});
	return {
		asOf: TRAILING_AS_OF,
		equityPct,
		fixedPct,
		benchmarkLabel: benchmarkLabel(equityPct, fixedPct),
		benchmarkDetail: `Constant-weight mix of Vanguard Total World Stock (VT) and Vanguard Total World Bond (${BNDW_TICKER}) at the ${allocation.core.short} core policy.`,
		rows,
		note: sat ? "The benchmark is the core mix only. A satellite overlay is the usual source of tracking difference versus VT/BNDW." : "The benchmark is the same equity/fixed split as this core, implemented as VT and BNDW."
	};
}
function lookThroughAnn(lines, years) {
	let n = 0;
	let d = 0;
	for (const line of lines) {
		const ret = ROLE_ANN[line.profile.role]?.[years] ?? benchmarkAnn(50, years);
		n += line.weight * ret;
		d += line.weight;
	}
	return d > 0 ? n / d : 0;
}
function formatReturn(value) {
	return `${value.toFixed(1)}%`;
}
function formatExcess(value) {
	const rounded = Number(value.toFixed(1));
	if (rounded > 0) return `+${rounded.toFixed(1)}%`;
	if (rounded < 0) return `-${Math.abs(rounded).toFixed(1)}%`;
	return "0.0%";
}
var RF = 4.2;
var ROLE_STRESS = {
	gfc: {
		"us-equity": -37,
		"intl-equity": -40,
		"em-equity": -48,
		"real-estate": -37,
		"short-gov": 6,
		"core-bond": 5,
		credit: -8,
		preferred: -22,
		"private-income": -18,
		"private-equity": -25,
		crypto: -50,
		"defined-outcome": -14
	},
	covid: {
		"us-equity": -34,
		"intl-equity": -33,
		"em-equity": -32,
		"real-estate": -38,
		"short-gov": 2,
		"core-bond": 1,
		credit: -9,
		preferred: -18,
		"private-income": -12,
		"private-equity": -16,
		crypto: -42,
		"defined-outcome": -11
	},
	hike2022: {
		"us-equity": -18,
		"intl-equity": -16,
		"em-equity": -22,
		"real-estate": -26,
		"short-gov": -4,
		"core-bond": -13,
		credit: -11,
		preferred: -17,
		"private-income": -7,
		"private-equity": -9,
		crypto: -64,
		"defined-outcome": -8
	},
	inflation: {
		"us-equity": -6,
		"intl-equity": -8,
		"em-equity": -10,
		"real-estate": 4,
		"short-gov": -2,
		"core-bond": -8,
		credit: -4,
		preferred: -3,
		"private-income": 2,
		"private-equity": 3,
		crypto: 8,
		"defined-outcome": -2
	},
	rally: {
		"us-equity": 22,
		"intl-equity": 18,
		"em-equity": 16,
		"real-estate": 12,
		"short-gov": 1,
		"core-bond": 2,
		credit: 5,
		preferred: 8,
		"private-income": 6,
		"private-equity": 14,
		crypto: 48,
		"defined-outcome": 9
	}
};
function wavg(rows) {
	let n = 0;
	let d = 0;
	for (const row of rows) {
		n += row.w * row.v;
		d += row.w;
	}
	return d > 0 ? n / d : 0;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function riskLabel(score) {
	if (score >= 78) return "Aggressive";
	if (score >= 64) return "Growth";
	if (score >= 50) return "Balanced";
	if (score >= 36) return "Moderate";
	if (score >= 22) return "Conservative";
	return "Capital preservation";
}
function buildDiagnostics(allocation, input, vision) {
	const lines = allocation.lines.map((line) => ({
		...line,
		profile: fundProfile(line.ticker)
	}));
	const rows = lines.map((line) => ({
		line,
		w: line.weight,
		p: line.profile
	}));
	const yieldPct = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.yieldPct
	})));
	const expenseRatio = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.expenseRatio
	})));
	const weightedVol = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.volPct
	})));
	const betaSpx = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.betaSpx
	})));
	const durationYrs = wavg(rows.filter((r) => r.p.durationYrs > 0 || r.p.role === "short-gov" || r.p.role === "core-bond" || r.p.role === "credit" || r.p.role === "preferred" || r.p.role === "private-income").map((r) => ({
		w: r.w,
		v: r.p.durationYrs
	})));
	const portfolioDuration = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.durationYrs
	})));
	const expectedReturn = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.expectedReturn
	})));
	const weightedDd = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.maxDdPct
	})));
	const quality = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.quality
	})));
	const hhi = rows.reduce((sum, r) => sum + (r.w / 100) ** 2, 0);
	const divFactor = .62 + .38 * clamp(hhi / .18, .15, 1);
	const volPct = weightedVol * divFactor;
	const maxDdPct = weightedDd * (.68 + .32 * divFactor);
	const sharpe = volPct > 0 ? (expectedReturn - RF) / volPct : 0;
	const riskScore = Math.round(clamp(volPct * 3.55 + betaSpx * 8, 8, 94));
	const bucketMap = /* @__PURE__ */ new Map();
	for (const r of rows) bucketMap.set(r.p.role, (bucketMap.get(r.p.role) ?? 0) + r.w);
	const buckets = [...bucketMap.entries()].map(([role, weight]) => ({
		key: role,
		label: ROLE_LABEL[role],
		weight,
		color: ROLE_COLOR[role]
	})).sort((a, b) => b.weight - a.weight);
	const geography = [
		{
			key: "us",
			label: "United States",
			weight: wavg(rows.map((r) => ({
				w: r.w,
				v: r.p.us * 100
			}))),
			color: "var(--color-equity)"
		},
		{
			key: "dev",
			label: "Developed ex-U.S.",
			weight: wavg(rows.map((r) => ({
				w: r.w,
				v: r.p.developed * 100
			}))),
			color: "var(--color-fixed)"
		},
		{
			key: "em",
			label: "Emerging markets",
			weight: wavg(rows.map((r) => ({
				w: r.w,
				v: r.p.em * 100
			}))),
			color: "var(--color-sat-income)"
		}
	].filter((g) => g.weight > .05);
	const equityLike = rows.filter((r) => r.p.large + r.p.mid + r.p.small > .5 && r.p.role !== "crypto");
	const equityShare = equityLike.reduce((s, r) => s + r.w, 0);
	const sizes = [
		"Large",
		"Mid",
		"Small"
	];
	const styles = [
		"Value",
		"Blend",
		"Growth"
	];
	const styleBox = [];
	for (const size of sizes) for (const style of styles) {
		const sizeKey = size.toLowerCase();
		const styleKey = style.toLowerCase();
		const weight = equityShare > 0 ? equityLike.reduce((s, r) => s + r.w * r.p[sizeKey] * r.p[styleKey], 0) / equityShare * 100 : 0;
		styleBox.push({
			size,
			style,
			weight
		});
	}
	const sectorTotals = GICS.map((label, i) => {
		const weight = equityLike.reduce((s, r) => {
			const sec = r.p.sectors?.[i] ?? 0;
			return s + r.w * sec;
		}, 0);
		return {
			key: label,
			label,
			weight: equityShare > 0 ? weight / equityShare * 100 : 0,
			color: "var(--color-equity)"
		};
	}).sort((a, b) => b.weight - a.weight);
	const usEq = bucketMap.get("us-equity") ?? 0;
	const intl = (bucketMap.get("intl-equity") ?? 0) + (bucketMap.get("em-equity") ?? 0);
	const cryptoW = bucketMap.get("crypto") ?? 0;
	const illiquid = rows.filter((r) => r.p.liquidity === "illiquid").reduce((s, r) => s + r.w, 0);
	const interval = rows.filter((r) => r.p.liquidity === "interval").reduce((s, r) => s + r.w, 0);
	const daily = 100 - illiquid - interval;
	const smallW = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.small * 100
	})));
	const valueW = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.value * 100
	})));
	const growthW = wavg(rows.map((r) => ({
		w: r.w,
		v: r.p.growth * 100
	})));
	const hyW = rows.reduce((s, r) => s + r.w * (1 - r.p.igShare) * (r.p.durationYrs > 0 ? 1 : 0), 0);
	const factors = [
		{
			key: "market",
			label: "Market (beta)",
			value: clamp((betaSpx - .6) / .8, -1, 1),
			hint: `Beta ${betaSpx.toFixed(2)} vs S&P 500`
		},
		{
			key: "size",
			label: "Size (small)",
			value: clamp((smallW - 12) / 25, -1, 1),
			hint: `${smallW.toFixed(0)}% small-cap mix`
		},
		{
			key: "value",
			label: "Value vs growth",
			value: clamp((valueW - growthW) / 40, -1, 1),
			hint: `Value ${valueW.toFixed(0)}% · Growth ${growthW.toFixed(0)}%`
		},
		{
			key: "quality",
			label: "Quality",
			value: clamp((quality - .5) / .35, -1, 1),
			hint: "Quality tilt from core sleeve construction"
		},
		{
			key: "duration",
			label: "Duration",
			value: clamp((durationYrs - 3) / 5, -1, 1),
			hint: `${durationYrs.toFixed(1)}y bond book · ${portfolioDuration.toFixed(1)}y portfolio`
		},
		{
			key: "credit",
			label: "Credit / HY",
			value: clamp((hyW - 8) / 20, -1, 1),
			hint: `${hyW.toFixed(0)}% below-IG contribution`
		},
		{
			key: "crypto",
			label: "Digital assets",
			value: clamp(cryptoW / 12, 0, 1),
			hint: `${cryptoW.toFixed(1)}% of account`
		},
		{
			key: "illiquid",
			label: "Illiquidity",
			value: clamp((illiquid + interval * .5) / 15, 0, 1),
			hint: `${(illiquid + interval).toFixed(0)}% interval or private`
		}
	];
	function scenario(key, label, period, note) {
		const map = ROLE_STRESS[key];
		return {
			key,
			label,
			period,
			result: rows.reduce((s, r) => s + r.w * (map?.[r.p.role] ?? 0), 0) / 100,
			note
		};
	}
	const scenarios = [
		scenario("gfc", "Global Financial Crisis", "2008–09", "Equity crash with flight-to-quality in Treasuries"),
		scenario("covid", "COVID shock", "Q1 2020", "Fast drawdown, liquidity stress across risk assets"),
		scenario("hike2022", "Inflation / hiking cycle", "2022", "Stocks and bonds down together"),
		scenario("inflation", "Sticky inflation", "Stylized", "Duration hurt; real assets and credit mixed"),
		scenario("rally", "Risk-on year", "Stylized", "Growth, crypto, and private equity lead")
	];
	const top = [...rows].sort((a, b) => b.w - a.w)[0];
	const flags = [];
	if (vision.applies && vision.ok === false) flags.push({
		level: "alert",
		title: "Private equity minimum",
		detail: `Falcon Vision Fund I needs $100,000 in-sleeve. Current sleeve is short.`
	});
	if (cryptoW >= 8) flags.push({
		level: "alert",
		title: "Digital-asset concentration",
		detail: `${formatPct(cryptoW)} in crypto ETPs. Path volatility and drawdowns will dominate tracking error.`
	});
	else if (cryptoW >= 3) flags.push({
		level: "watch",
		title: "Digital-asset sleeve",
		detail: `${formatPct(cryptoW)} in crypto ETPs. Material to risk even as a satellite.`
	});
	if (illiquid >= 8) flags.push({
		level: "watch",
		title: "Illiquid sleeve",
		detail: `${formatPct(illiquid)} is private / non-daily. Gate, capital call, and valuation lag risk apply.`
	});
	if (interval >= 8) flags.push({
		level: "watch",
		title: "Interval-fund liquidity",
		detail: `${formatPct(interval)} in interval vehicles. Redemptions are periodic, not T+1.`
	});
	if ((top?.w ?? 0) >= 18) flags.push({
		level: "watch",
		title: "Single-name weight",
		detail: `${top?.line.ticker} is ${formatPct(top?.w ?? 0)} of the account.`
	});
	const tech = sectorTotals.find((s) => s.key === "Technology")?.weight ?? 0;
	if (tech >= 28 && equityShare >= 40) flags.push({
		level: "watch",
		title: "Technology sector tilt",
		detail: `Look-through technology is ${tech.toFixed(0)}% of equity. Growth and AI sleeves amplify it.`
	});
	if (durationYrs >= 5.5) flags.push({
		level: "watch",
		title: "Rate sensitivity",
		detail: `Average duration ${durationYrs.toFixed(1)} years. A 100 bp rise is roughly −${durationYrs.toFixed(1)}% on the bond book before spread.`
	});
	if (expenseRatio >= .55) flags.push({
		level: "watch",
		title: "Expense ratio",
		detail: `Weighted ER ${formatEr(expenseRatio)}. Satellite interval and defined-outcome funds lift the average above the core.`
	});
	if (flags.length === 0) flags.push({
		level: "ok",
		title: "No material policy flags",
		detail: "Weights, liquidity, and concentration sit inside typical core–satellite bounds for this mix."
	});
	const intlShare = intl;
	const headline = composeHeadline({
		allocation,
		riskLabel: riskLabel(riskScore),
		yieldPct,
		volPct,
		betaSpx,
		cryptoW,
		usEq,
		intlShare,
		durationYrs
	});
	const overview = composeOverview({
		allocation,
		riskLabel: riskLabel(riskScore),
		yieldPct,
		expenseRatio,
		volPct,
		betaSpx,
		maxDdPct,
		durationYrs,
		usEq,
		intlShare,
		cryptoW,
		daily,
		interval,
		illiquid,
		vision,
		topTicker: top?.line.ticker ?? null,
		topWeight: top?.w ?? 0,
		valueW,
		growthW
	});
	const voice = pickVoice({
		equity: allocation.core.equity,
		satellitePct: allocation.satelliteSleevePct,
		cryptoW,
		aiW: sleeveWeight(allocation, "ai"),
		peW: sleeveWeight(allocation, "alt-equity"),
		incomeW: sleeveWeight(allocation, "alt-income"),
		bufferW: sleeveWeight(allocation, "buffer"),
		valueW,
		growthW
	});
	const trailing = buildTrailingReturns(allocation, lines);
	return {
		asOf: CORE_AS_OF,
		headline,
		riskScore,
		riskLabel: riskLabel(riskScore),
		kpis: {
			yieldPct,
			expenseRatio,
			volPct,
			betaSpx,
			durationYrs,
			portfolioDuration,
			sharpe,
			maxDdPct,
			expectedReturn
		},
		buckets,
		geography,
		styleBox,
		equityShare,
		sectors: sectorTotals.filter((s) => s.weight >= .4),
		factors,
		trailing,
		scenarios,
		liquidity: {
			daily,
			interval,
			illiquid
		},
		concentration: {
			hhi,
			topName: top ? `${top.line.ticker}` : "—",
			topWeight: top?.w ?? 0,
			effectiveHoldings: hhi > 0 ? 1 / hhi : 0
		},
		income: {
			grossYield: yieldPct,
			netOfEr: yieldPct - expenseRatio,
			feeDrag: expenseRatio
		},
		flags,
		overview,
		voice,
		lines
	};
}
function composeHeadline(args) {
	const sat = args.allocation.satelliteComplete ? ` Satellite overlay is ${args.allocation.satelliteSleevePct.toFixed(0)}% of the account.` : " Core-only — no satellite overlay.";
	const crypto = args.cryptoW >= 3 ? ` Digital assets (${args.cryptoW.toFixed(0)}%) dominate tracking error.` : "";
	return `${args.allocation.policyTitle} maps to a ${args.riskLabel.toLowerCase()} risk budget. Estimated yield ${args.yieldPct.toFixed(1)}%, volatility ${args.volPct.toFixed(1)}%, beta ${args.betaSpx.toFixed(2)} vs the S&P 500. U.S. equity ${args.usEq.toFixed(0)}% · international ${args.intlShare.toFixed(0)}% · duration ${args.durationYrs.toFixed(1)}y.${sat}${crypto}`;
}
function sleeveWeight(allocation, kind) {
	return allocation.sleeves.find((s) => s.kind === kind)?.weight ?? 0;
}
function composeOverview(args) {
	const { allocation } = args;
	const eq = allocation.core.equity;
	const sat = allocation.satelliteSleevePct;
	const bullets = [];
	bullets.push(sat > 0 ? `This is a ${allocation.core.short} ${allocation.core.name.toLowerCase()} core with a ${sat.toFixed(0)}% satellite overlay. The policy is built for a ${args.riskLabel.toLowerCase()} risk budget — growth is the job of the core; the satellite is a deliberate, sized expression around it.` : `This is a clean ${allocation.core.short} ${allocation.core.name.toLowerCase()} core with no satellite overlay. The household is buying the model as written: a ${args.riskLabel.toLowerCase()} risk budget without extra tracking error from themes.`);
	if (eq >= 90) bullets.push("The core is almost entirely equities. That is a feature, not an accident — this mix is designed to compound business earnings over a long horizon, with only a thin (or zero) bond sleeve as ballast.");
	else if (eq >= 70) bullets.push(`Equities do the heavy lifting at ${eq}% of the core. Fixed income is a shock absorber, not the return engine — useful in a drawdown, not a substitute for staying invested.`);
	else if (eq >= 50) bullets.push(`The ${allocation.core.short} mix is a classic balanced policy: enough equity to grow purchasing power, enough high-quality fixed income to keep a bad equity year from becoming a bad decade.`);
	else if (eq >= 25) bullets.push(`This is an income-led policy. The bond book is the foundation; the ${eq}% equity sleeve is the growth option sized so a weak stock market does not redefine the household's plan.`);
	else bullets.push("Capital preservation is the assignment. The core is built to survive first and grow second — a measured equity remnant, if any, is there so inflation does not quietly win.");
	if (eq > 0 && args.valueW >= args.growthW) bullets.push("Inside the equity sleeve, the book tilts toward profitable value — Avantis large-value (AVLV) is the flagship line — with a defined growth sleeve in mega-cap and Nasdaq so the household is not making a single-style bet.");
	else if (eq > 0) bullets.push("The equity sleeve leans into growth and quality compounders, with a supporting value book so the policy is not a pure momentum trade. That mix is how Falcon keeps a growth orientation without abandoning price discipline.");
	if (args.intlShare >= 6) bullets.push(`International and emerging-market equities are about ${args.intlShare.toFixed(0)}% of the account. That is a second engine — the United States can lead for a long time, and this mix still refuses to make the household a single-country bet.`);
	if (eq <= 80 && args.durationYrs > .4) bullets.push(`The fixed-income book blends short Treasuries, core-plus, and multisector credit at about ${args.durationYrs.toFixed(1)} years of duration. A rise in yields will mark the bonds down roughly in line with that duration; the offset is income and a dry-powder sleeve when equities are on sale.`);
	const satNotes = [];
	const pe = sleeveWeight(allocation, "alt-equity");
	const pi = sleeveWeight(allocation, "alt-income");
	const ai = sleeveWeight(allocation, "ai");
	const crypto = sleeveWeight(allocation, "crypto");
	const buffer = sleeveWeight(allocation, "buffer");
	if (pe > 0) satNotes.push(args.vision.applies && args.vision.ok === false ? `${VISION_FUND_NAME} is the private-equity satellite (${pe.toFixed(0)}% of the account). The $100,000 fund minimum is not yet met at this account size — that is a subscription constraint, not a judgment on the strategy.` : `${VISION_FUND_NAME} is the private-equity satellite (${pe.toFixed(0)}%). It is an illiquid, multi-year commitment with a ${formatUsd(VISION_FUND_MIN)} fund minimum — access and patience are the point, not daily liquidity.`);
	if (pi > 0) satNotes.push(`Private Income (${pi.toFixed(0)}%) equal-weights three pre-approved interval funds. The pitch is a different income stream than public bonds; the honest cost is periodic — not daily — liquidity.`);
	if (ai > 0) satNotes.push(`The Artificial Intelligence sleeve (${ai.toFixed(0)}%) is a themed bet on power, chips, and AI factory infrastructure. It will look brilliant in adoption years and expensive in the dull ones — size is how you stay in the game.`);
	if (crypto > 0) satNotes.push(`Crypto (${crypto.toFixed(0)}%) is a 60/30/10 mix of Bitcoin, Ethereum, and Solana ETPs. Treat it as a convex satellite, not a savings account: path volatility will dominate tracking error, and that is the bargain.`);
	if (buffer > 0) satNotes.push(`Buffered Equity + Income (${buffer.toFixed(0)}%) pairs a laddered buffer ETF with a laddered autocallable. You are selling some upside to put a defined outcome under the bad years — a sleep-well sleeve, not a free lunch.`);
	bullets.push(...satNotes);
	bullets.push(`Look-through yield is about ${args.yieldPct.toFixed(2)}% and the weighted expense ratio is ${formatEr(args.expenseRatio)}. Yield is the cash the holdings are designed to produce, not a guaranteed coupon; the ER is what you pay each year to own the implementation.`);
	bullets.push(`Estimated volatility near ${args.volPct.toFixed(1)}% and a stylized max drawdown around ${args.maxDdPct.toFixed(0)}% are the price of this mix. A sharp year is not a broken policy — it is the tuition for a ${args.riskLabel.toLowerCase()} risk budget. Beta versus the S&P 500 is ${args.betaSpx.toFixed(2)}, so equity markets will still set the weather.`);
	if (args.illiquid + args.interval >= 8) bullets.push(`About ${args.daily.toFixed(0)}% of the account is daily-liquid ETFs; the rest sits in interval or private vehicles. Match spending needs to the liquid sleeve. Gates and notice periods are a feature of the return stream, not a footnote.`);
	else bullets.push("Implementation is almost entirely daily-liquid ETFs, so rebalancing and cash raises are operationally simple. That is an underrated advantage when the household needs to act.");
	if (args.topTicker && args.topWeight >= 12) bullets.push(`${args.topTicker} is the largest line at ${formatPct(args.topWeight)}. Concentration is how active tilts earn their keep — it is also why we watch single-name weight in the policy flags.`);
	const closer = "The case for this mix is time: staying invested through a full market cycle so compounding has a chance to work. It is a policy to own, not a trade to time.";
	return [...bullets.filter((b) => b !== closer).slice(0, 9), closer];
}
function pickVoice(args) {
	if (args.cryptoW >= 8) return {
		name: "Stanley Druckenmiller",
		years: "Quantum, Duquesne",
		school: "Macro · convex bets, sized so you can be wrong",
		why: "A crypto satellite is an asymmetric macro expression — the discipline is in the size, not the slogan.",
		comment: "When the payoff is convex, you don't need to be a zealot — you need a position you can hold through humiliation. A measured Bitcoin-led sleeve is a call option on a monetary regime the bond market still pretends is normal. Size it so a 70% drawdown is a bruise, not a funeral, and let the rest of the book do the boring compounding."
	};
	if (args.peW >= 8) return {
		name: "David Swensen",
		years: "Yale Endowment",
		school: "Endowment · illiquidity premium, patience as an edge",
		why: "Private equity in a satellite is the endowment idea scaled to a household: access and time, not daily marks.",
		comment: "The great institutional portfolios were not built on what traded every afternoon. They were built on what other people could not, or would not, hold. A private-equity satellite is that idea in miniature — you are paying in lockups for a return stream that does not have to mark to the panic. Just do not confuse a capital call with a checking account, and never let the liquid book become an afterthought."
	};
	if (args.aiW >= 8) return {
		name: "Philip Fisher",
		years: "Common Stocks and Uncommon Profits",
		school: "Growth · scuttlebutt, own the future, sit still",
		why: "An AI overlay is a concentrated bet on companies reinvesting in the next decade of compute and power.",
		comment: "The great fortunes were not made by renting last year's winners. They were made by owning businesses that reinvest in a future the income statement has not fully admitted yet. Power, chips, and the factories that feed the models — that is scuttlebutt with a ticker. You will look foolish in the dull years. That is the tuition. Hold a position small enough to survive them and large enough to matter when the world catches up."
	};
	if (args.bufferW >= 8) return {
		name: "Howard Marks",
		years: "Oaktree",
		school: "Credit · asymmetry, second-level thinking",
		why: "A buffer sleeve is an explicit trade: less upside in exchange for a more tolerable bad year.",
		comment: "Asymmetry is the whole game. A laddered buffer does not make you a genius in the melt-up — it makes you a grown-up in the melt-down. You are selling some of the smile to put a floor under the grimace. That is not cowardice. That is second-level thinking: most of the money is made by avoiding the stupid, not by capturing every last tick of the rally."
	};
	if (args.incomeW >= 8 && args.equity <= 65) return {
		name: "Jeffrey Gundlach",
		years: "DoubleLine",
		school: "Credit · bonds as a living, breathing asset class",
		why: "Private income plus a bond-aware core is a credit-and-carry book, not a duration museum.",
		comment: "Bonds are not dead. They are unloved, which is usually the better starting point. An income satellite on top of a real bond book is how a household gets paid to wait without pretending Treasuries are a personality. Credit will have ugly months. Interval funds will remind you that liquidity is a feature you sold. If you needed T+1 on every dollar, you built the wrong portfolio — and if you can live with the gates, you may be buying the one thing public markets are not offering: carry with a lock."
	};
	if (args.equity <= 20) return {
		name: "Benjamin Graham",
		years: "The Intelligent Investor",
		school: "Value · margin of safety first",
		why: "A capital-preservation mix is Graham's temperament: survive, then compound the residual.",
		comment: "The first job of capital is to remain capital. This mix is built so a bad decade in equities is an inconvenience, not a rewrite of the family story. Margin of safety is not a slogan — it is the bond sleeve, the cash-like ballast, and the refusal to need a miracle. The remaining equity is your option on prosperity. Size it so you can be a little greedy later, because you were a little fearful now."
	};
	if (args.equity <= 40) return {
		name: "Bill Gross",
		years: "PIMCO",
		school: "Bond king · income, roll-down, respect for the cycle",
		why: "An income-led core is a total-return bond book with equities as a kicker.",
		comment: "Total return is a team sport: coupon, roll-down, and the occasional equity dividend. This policy lets the bond market do what it does — pay you, scare you, and eventually refinance you. Equities are the kicker, not the identity. If inflation runs hot you will feel the duration. That is the honest contract of an income policy. The investors who last are the ones who collect the coupon and do not confuse a mark-to-market with a verdict."
	};
	if (args.equity >= 88 && args.growthW > args.valueW + 4) return {
		name: "Peter Lynch",
		years: "Fidelity Magellan",
		school: "GARP · know what you own, growth at a reasonable story",
		why: "A near-all-equity growth mix is a Lynch book: own businesses, live with the quotes.",
		comment: "If you can't explain the portfolio to a ten-year-old, you don't own it — it owns you. This one is not that complicated: you are paying for future earnings and you will be quoted a new price every day, most of them rude. The trick is not to become a trader because the ticker turned red. Compounding is boring on purpose. Check in less often than your neighbors, and let the businesses do the work the statements already imply."
	};
	if (args.satellitePct === 0 && args.equity >= 50 && args.equity <= 70) return {
		name: "John C. Bogle",
		years: "Vanguard",
		school: "Indexing · costs, stay the course, own the haystack",
		why: "A core-only balanced mix is Bogle's sermon: keep costs down and do not tinker.",
		comment: "Own the haystack, keep the help from eating it, and stay the course. This policy does the first two well enough — a sensible mix, a published model, no satellite narrative to babysit. The miracle is not in the next clever overlay. It is in the years you did not sell. If you can leave this thing alone, it will do more for the household than a dozen brilliant trades."
	};
	if (args.equity >= 45 && args.equity <= 70 && args.satellitePct > 0) return {
		name: "Ray Dalio",
		years: "Bridgewater",
		school: "All-weather · balance what you cannot predict",
		why: "A balanced core plus a distinct satellite is an all-weather instinct: uncorrelated sleeves, sized.",
		comment: "You cannot predict the next decade with any honesty, so you balance the machines that win in different decades. Stocks, bonds, and a satellite that does not move in lockstep — that is how a household stops needing to be a prophet. Diversification is not owning many tickers. It is owning different economic bets. If this mix feels a little less exciting than a concentrated story, good. Excitement is a cost."
	};
	return {
		name: "Warren Buffett",
		years: "Berkshire Hathaway",
		school: "Owner-earnings · patience, price, and a long runway",
		why: "A value-aware equity core with ballast is Buffett's temperament: buy earning power and sit still.",
		comment: "I like a portfolio that pays me to wait. This one still has a spine of earning-power businesses — value in the engine room, a little growth so you are not a museum, and enough ballast to be greedy when the tape is rude. I would not trade the whole stack for a story that needs a new chapter every quarter. The satellite, if you use one, is seasoning. The core is the meal. Time is the friend of a good business and the enemy of a fidgety shareholder."
	};
}
function diagnosticsCopy(d, allocation, input) {
	const client = input.clientName.trim() || "—";
	return [
		"Falcon Portfolio Diagnostics",
		`Policy: ${allocation.policyTitle}`,
		`Code: ${allocation.policyCode}`,
		`Client: ${client}`,
		`Risk score: ${d.riskScore} (${d.riskLabel})`,
		"",
		d.headline,
		"",
		`Yield ${d.kpis.yieldPct.toFixed(2)}% · ER ${d.kpis.expenseRatio.toFixed(2)}% · Vol ${d.kpis.volPct.toFixed(1)}% · Beta ${d.kpis.betaSpx.toFixed(2)} · Duration ${d.kpis.durationYrs.toFixed(1)}y · Sharpe ${d.kpis.sharpe.toFixed(2)}`,
		"",
		"Underlying holdings",
		`  Core ${formatPct(allocation.coreSleevePct)}${allocation.satelliteSleevePct > 0 ? ` · Satellite ${formatPct(allocation.satelliteSleevePct)}` : ""} · as of ${CORE_AS_OF}`,
		...allocation.groups.flatMap((group) => [`  ${group.label.padEnd(28)} ${formatPct(group.weight)}`, ...group.lines.map((line) => `    ${line.ticker.padEnd(8)} ${formatPct(line.weight).padStart(7)}  ${line.name}`)]),
		"",
		"Asset allocation",
		...d.buckets.map((b) => `  ${b.label.padEnd(28)} ${formatPct(b.weight)}`),
		"",
		`Trailing returns vs ${d.trailing.benchmarkLabel} (as of ${d.trailing.asOf})`,
		...d.trailing.rows.map((row) => `  ${row.label.padEnd(10)} Policy ${formatReturn(row.portfolio).padStart(7)}  Benchmark ${formatReturn(row.benchmark).padStart(7)}  Excess ${formatExcess(row.excess)}`),
		`  ${d.trailing.note}`,
		"",
		"Scenarios (illustrative)",
		...d.scenarios.map((s) => `  ${s.label.padEnd(28)} ${s.result.toFixed(1)}%`),
		"",
		"Flags",
		...d.flags.map((f) => `  [${f.level}] ${f.title} — ${f.detail}`),
		"",
		"Portfolio overview",
		...d.overview.map((b) => `  • ${b}`),
		"",
		`Hypothetical voice: ${d.voice.name} (${d.voice.years})`,
		`  ${d.voice.comment}`,
		`  *Illustrative only — not an actual statement by ${d.voice.name}.`,
		"",
		"Model diagnostics use representative fund characteristics as of the core model date, not live market data. Scenario results are illustrative, not forecasts. For advisor use only."
	].join("\n");
}
var R = 8;
var R_SM = 5;
var GAP = 12;
var INSET = 14;
var KPI_CAPTION = {
	risk: "Vol + beta blend",
	yield: "Look-through income",
	er: "Asset-weighted fee",
	vol: "Stylized volatility",
	beta: "Vs 1% S&P move",
	duration: "Rate sensitivity",
	sharpe: "Return per unit risk",
	drawdown: "Severe-path loss"
};
function shareRgb(color) {
	switch (color) {
		case "var(--color-equity)": return [
			.22,
			.33,
			.27
		];
		case "var(--color-fixed)": return [
			.22,
			.31,
			.38
		];
		case "var(--color-ok)": return [
			.18,
			.32,
			.24
		];
		case "var(--color-sat-income)": return [
			.38,
			.34,
			.28
		];
		case "var(--color-sat-equity)": return [
			.18,
			.28,
			.23
		];
		case "var(--color-sat-crypto)": return [
			.4,
			.28,
			.2
		];
		case "var(--color-sat-ai)": return [
			.26,
			.32,
			.3
		];
		case "var(--color-sat-buffer)": return [
			.33,
			.3,
			.22
		];
		case "var(--color-warn)": return [
			.48,
			.3,
			.14
		];
		case "var(--color-destructive)": return [
			.56,
			.22,
			.18
		];
		default: return MUTED;
	}
}
function sleeveRgb(kind) {
	switch (kind) {
		case "equity": return [
			.302,
			.388,
			.337
		];
		case "fixed": return [
			.29,
			.361,
			.42
		];
		case "alt-income": return [
			.416,
			.384,
			.345
		];
		case "alt-equity": return [
			.243,
			.325,
			.282
		];
		case "crypto": return [
			.42,
			.337,
			.282
		];
		case "ai": return [
			.31,
			.345,
			.329
		];
		case "buffer": return [
			.361,
			.341,
			.282
		];
	}
}
function heading(doc, title, kicker, minBody = 72) {
	doc.ensure(46 + minBody);
	if (kicker) {
		doc.text(kicker.toUpperCase(), 48, doc.y, 7, "HB", SAGE);
		doc.y -= 15;
	}
	doc.text(title, 48, doc.y, 16, "TB");
	doc.y -= 8;
	doc.fillRoundRect(48, doc.y, 28, 2, 1, SAGE);
	doc.y -= 14;
}
function intro(doc, copy) {
	for (const line of wrap(copy, 8.5, doc.contentWidth)) {
		doc.text(line, 48, doc.y, 8.5, "H", MUTED);
		doc.y -= 12;
	}
	doc.y -= 8;
}
function buildDiagnosticsPdf(input, allocation, report, advisorName) {
	const doc = new PdfDoc("FALCON X-RAY  ·  PORTFOLIO DIAGNOSTICS", { pageFill: WASH });
	const client = input.clientName.trim() || "Client proposal";
	drawCover(doc, {
		client,
		advisor: advisorName.trim() || "Falcon advisor",
		aum: input.accountValue === null ? "Not specified" : formatUsd(input.accountValue),
		date: dateLabel(),
		allocation,
		report
	});
	drawKpis(doc, report);
	drawHoldings(doc, input, allocation);
	drawAllocation(doc, report, input.accountValue);
	drawSplit(doc, report);
	drawSectors(doc, report);
	drawFactors(doc, report);
	drawTrailing(doc, report);
	drawScenarios(doc, report);
	drawLiquidityIncome(doc, report, input.accountValue);
	drawFlags(doc, report);
	drawOverview(doc, report);
	drawVoice(doc, report);
	drawDisclaimer(doc);
	return assemblePdf(doc, {
		title: `Falcon X-Ray - ${client} - ${allocation.policyCode}`,
		footerLeft: "Confidential  ·  Falcon X-Ray diagnostics  ·  Advisor use only"
	});
}
function drawCover(doc, meta) {
	const bandH = 240;
	const bandY = 552;
	doc.fillRect(0, bandY, 612, bandH, NAVY);
	doc.fillRect(0, bandY, 612, 3.5, GOLD);
	doc.save();
	doc.setAlpha(16);
	doc.falconMark(424, 660, 148);
	doc.restore();
	doc.falconMark(48, 750, 28);
	doc.text("FALCON WEALTH", 84, 774, 11, "HB", PAPER);
	doc.text("PORTFOLIO X-RAY", 84, 760, 8, "H", CREAM);
	doc.textRight(meta.date, 564, 774, 8, "H", CREAM);
	doc.textRight("Advisor use only", 564, 760, 8, "H", CREAM);
	doc.text("Prepared for", 48, 708, 8, "H", CREAM);
	const clientSize = meta.client.length > 32 ? 18 : 24;
	doc.text(fit(meta.client, clientSize, doc.contentWidth - 8, true), 48, 680, clientSize, "TB", PAPER);
	wrap(meta.allocation.policyTitle, 10, doc.contentWidth - 4).slice(0, 2).forEach((line, i) => {
		doc.text(line, 48, 660 - i * 13, 10, "H", CREAM);
	});
	const code = meta.allocation.policyCode;
	const codeW = measure(code, 7.5, true) + 16;
	doc.fillRoundRect(48, 628, codeW, 16, 8, NAVY_LIFT);
	doc.text(code, 56, 633, 7.5, "HB", CREAM);
	const cardH = 46;
	const cardW = (doc.contentWidth - 24) / 3;
	const y = 566;
	[
		["Advisor", meta.advisor],
		["Account value", meta.aum],
		["Risk budget", `${meta.report.riskScore}  ·  ${meta.report.riskLabel}`]
	].forEach((cell, i) => {
		const x = 48 + i * (cardW + GAP);
		doc.fillRoundRect(x, y, cardW, cardH, R_SM, NAVY_LIFT);
		if (i === 2) {
			doc.save();
			doc.clipRoundRect(x, y, cardW, cardH, R_SM);
			doc.fillRect(x, y, 3, cardH, SAGE);
			doc.restore();
		}
		doc.text(cell[0].toUpperCase(), x + 12, 598, 6.5, "HB", CREAM);
		doc.text(fit(cell[1], 11, cardW - 22), x + 12, 580, 11, "H", PAPER);
	});
	doc.y = 534;
	const headLines = wrap(meta.report.headline, 9.5, doc.contentWidth - 28).slice(0, 3);
	const headH = 22 + headLines.length * 13;
	doc.ensure(headH);
	const hy = doc.y - headH;
	doc.panel(48, hy, doc.contentWidth, headH, {
		fill: CREAM,
		r: R_SM
	});
	doc.save();
	doc.clipRoundRect(48, hy, doc.contentWidth, headH, R_SM);
	doc.fillRect(48, hy + headH - 2.4, doc.contentWidth, 2.4, SAGE);
	doc.restore();
	headLines.forEach((line, i) => {
		doc.text(line, 62, hy + headH - 16 - i * 13, 9.5, "H");
	});
	doc.y = hy - 22;
}
function drawKpis(doc, report) {
	const tiles = [
		{
			label: "Risk score",
			value: String(report.riskScore),
			caption: KPI_CAPTION.risk,
			hero: true
		},
		{
			label: "Est. yield",
			value: `${report.kpis.yieldPct.toFixed(2)}%`,
			caption: KPI_CAPTION.yield
		},
		{
			label: "Weighted ER",
			value: formatEr(report.kpis.expenseRatio),
			caption: KPI_CAPTION.er
		},
		{
			label: "Est. volatility",
			value: `${report.kpis.volPct.toFixed(1)}%`,
			caption: KPI_CAPTION.vol
		},
		{
			label: "Beta vs S&P 500",
			value: report.kpis.betaSpx.toFixed(2),
			caption: KPI_CAPTION.beta
		},
		{
			label: "Bond duration",
			value: `${report.kpis.durationYrs.toFixed(1)}y`,
			caption: KPI_CAPTION.duration
		},
		{
			label: "Sharpe (est.)",
			value: report.kpis.sharpe.toFixed(2),
			caption: KPI_CAPTION.sharpe
		},
		{
			label: "Est. max drawdown",
			value: `${report.kpis.maxDdPct.toFixed(0)}%`,
			caption: KPI_CAPTION.drawdown
		}
	];
	const boxW = (doc.contentWidth - 36) / 4;
	const boxH = 92;
	heading(doc, "Key diagnostics", "01  ·  How to read the numbers", 204);
	doc.ensure(204);
	const startY = doc.y;
	tiles.forEach((tile, i) => {
		const row = Math.floor(i / 4);
		const x = 48 + i % 4 * (boxW + GAP);
		const y = startY - boxH - row * 104;
		if (tile.hero) doc.panel(x, y, boxW, boxH, {
			fill: INK,
			r: R_SM,
			stroke: false
		});
		else doc.panel(x, y, boxW, boxH, { r: R_SM });
		const ink = tile.hero ? PAPER : INK;
		const muted = tile.hero ? CREAM : MUTED;
		doc.text(tile.label.toUpperCase(), x + 12, y + boxH - 16, 6.5, "HB", muted);
		doc.text(tile.value, x + 12, y + 42, 22, "TB", ink);
		doc.text(fit(tile.caption, 7, boxW - 22), x + 12, y + 18, 7, "H", muted);
	});
	doc.y = startY - 184 - GAP - 18;
}
function drawHoldings(doc, input, allocation) {
	heading(doc, "Underlying holdings", allocation.satelliteSleevePct > 0 ? `02  ·  Core ${formatPct(allocation.coreSleevePct)}  ·  Satellite ${formatPct(allocation.satelliteSleevePct)}  ·  as of ${CORE_AS_OF}` : `02  ·  Core ${formatPct(allocation.coreSleevePct)}  ·  as of ${CORE_AS_OF}`, 168);
	intro(doc, "Look-through positions in this policy. Core Equity and Core Fixed Income are sorted greatest to least. Account % is of the whole book after any satellite overlay.");
	const showAmt = input.accountValue !== null;
	const amtX = 550;
	const acctX = showAmt ? 478 : 550;
	const modelX = acctX - 58;
	const tickerX = 64;
	const nameX = 112;
	const nameMax = modelX - nameX - 10;
	const rowH = 18;
	const headH = 42;
	const padB = 12;
	function colHeads(y) {
		doc.text("Ticker", tickerX, y, 6.5, "HB", MUTED);
		doc.text("Holding", nameX, y, 6.5, "HB", MUTED);
		doc.textRight("Model", modelX, y, 6.5, "HB", MUTED);
		doc.textRight("Account", acctX, y, 6.5, "HB", MUTED);
		if (showAmt) doc.textRight("Amount", amtX, y, 6.5, "HB", MUTED);
	}
	for (const group of allocation.groups) {
		let offset = 0;
		let continued = false;
		while (offset < group.lines.length) {
			const remaining = group.lines.length - offset;
			let avail = doc.y - 64;
			let fitRows = Math.floor((avail - headH - padB) / rowH);
			if (fitRows < 3 && remaining > 0) {
				doc.addPage(true);
				avail = doc.y - 64;
				fitRows = Math.floor((avail - headH - padB) / rowH);
			}
			fitRows = Math.max(1, Math.min(Math.max(fitRows, 1), remaining));
			const h = headH + fitRows * rowH + padB;
			const y = doc.y - h;
			doc.panel(48, y, doc.contentWidth, h);
			const top = y + h;
			doc.fillCircle(66, top - 18, 3.4, sleeveRgb(group.kind));
			const title = continued ? `${group.label}  ·  continued` : group.label;
			doc.text(fit(title, 9, doc.contentWidth - 90, true), 76, top - 22, 9, "HB");
			doc.textRight(formatPct(group.weight), 548, top - 22, 9, "HB", MUTED);
			const hy = top - 38;
			colHeads(hy);
			doc.line(62, hy - 5, 550, hy - 5, RULE, .4);
			for (let i = 0; i < fitRows; i++) {
				const line = group.lines[offset + i];
				const ry = hy - 18 - i * rowH;
				if (i > 0) doc.line(62, ry + 11, 550, ry + 11, RULE, .25);
				doc.text(line.ticker, tickerX, ry, 8, "HB");
				doc.text(fit(line.name, 8, nameMax), nameX, ry, 8, "H");
				doc.textRight(line.coreWeight === null ? "—" : formatPct(line.coreWeight), modelX, ry, 8, "H", MUTED);
				doc.textRight(formatPct(line.weight), acctX, ry, 8, "H");
				if (showAmt && input.accountValue !== null) doc.textRight(formatUsd(line.weight / 100 * input.accountValue), amtX, ry, 8, "H", MUTED);
			}
			doc.y = y - 10;
			offset += fitRows;
			continued = true;
		}
	}
}
function drawAllocation(doc, report, dollars) {
	const cols = 2;
	const legendRows = Math.ceil(report.buckets.length / cols);
	const barH = 22;
	const pad = 16;
	const rowH = 18;
	const cardH = 52 + legendRows * rowH + pad;
	heading(doc, "Asset allocation", "03  ·  Look-through roles", cardH + 8);
	doc.ensure(cardH + 8);
	const y = doc.y - cardH;
	doc.panel(48, y, doc.contentWidth, cardH);
	const barY = y + cardH - pad - barH;
	const barX = 64;
	const barW = doc.contentWidth - 32;
	doc.save();
	doc.clipRoundRect(barX, barY, barW, barH, 6);
	let x = barX;
	report.buckets.forEach((item) => {
		const w = item.weight / 100 * barW;
		if (w < .6) return;
		doc.fillRect(x, barY, w, barH, shareRgb(item.color));
		if (w >= 36) doc.text(`${item.weight.toFixed(0)}%`, x + 8, barY + 7, 8, "HB", PAPER);
		x += w;
	});
	doc.restore();
	const colW = (doc.contentWidth - 32 - GAP) / cols;
	const usdCol = dollars !== null ? 64 : 0;
	const pctCol = 52;
	let ly = barY - 16;
	report.buckets.forEach((item, i) => {
		const col = i % cols;
		const x0 = 64 + col * (colW + GAP);
		if (col === 0 && i > 0) ly -= rowH;
		const yy = ly;
		doc.fillCircle(x0 + 4, yy + 3, 3.2, shareRgb(item.color));
		const pctRight = x0 + colW - usdCol;
		const labelMax = Math.max(48, pctRight - pctCol - (x0 + 14) - 6);
		doc.text(fit(item.label, 8, labelMax), x0 + 14, yy, 8, "H");
		doc.textRight(formatPct(item.weight), pctRight, yy, 8, "HB");
		if (dollars !== null) doc.textRight(formatUsd(item.weight / 100 * dollars), x0 + colW, yy, 8, "H", MUTED);
	});
	doc.y = y - 14;
}
function drawSplit(doc, report) {
	const colW = (doc.contentWidth - GAP) / 2;
	const cardH = 156;
	heading(doc, "Geography and equity style", `04  ·  ${report.equityShare.toFixed(0)}% of account is equity-like`, 164);
	doc.ensure(164);
	const y = doc.y - cardH;
	const left = 48;
	const right = 48 + colW + GAP;
	doc.panel(left, y, colW, cardH);
	doc.panel(right, y, colW, cardH);
	doc.text("Domicile mix", left + INSET, y + cardH - 18, 8, "HB", MUTED);
	doc.text("Equity style box", right + INSET, y + cardH - 18, 8, "HB", MUTED);
	const barY = y + cardH - 36;
	const barW = colW - 28;
	doc.save();
	doc.clipRoundRect(left + INSET, barY, barW, 10, 5);
	let gx = left + INSET;
	for (const item of report.geography) {
		const w = item.weight / 100 * barW;
		if (w < .5) continue;
		doc.fillRect(gx, barY, w, 10, shareRgb(item.color));
		gx += w;
	}
	doc.restore();
	let gy = barY - 20;
	for (const item of report.geography) {
		doc.fillCircle(left + INSET + 4, gy + 3, 3.2, shareRgb(item.color));
		doc.text(item.label, left + INSET + 14, gy, 8.5, "H");
		doc.textRight(formatPct(item.weight), left + colW - INSET, gy, 8.5, "HB");
		gy -= 18;
	}
	drawStyleBox(doc, report.styleBox, right + INSET, y + cardH - 32, colW - 28);
	doc.y = y - 14;
}
function drawStyleBox(doc, cells, x, top, width) {
	const styles = [
		"Value",
		"Blend",
		"Growth"
	];
	const sizes = [
		"Large",
		"Mid",
		"Small"
	];
	const gap = 5;
	const labelW = 36;
	const cell = Math.min(34, (width - labelW - 10) / 3);
	const max = Math.max(...cells.map((c) => c.weight), 1);
	styles.forEach((style, i) => {
		const cx = x + labelW + i * (cell + gap) + cell / 2;
		const w = measure(style, 7, true);
		doc.text(style, cx - w / 2, top, 7, "HB", MUTED);
	});
	sizes.forEach((size, r) => {
		const cy = top - 14 - r * (cell + gap);
		doc.text(size, x, cy - cell / 2 + 3, 7.5, "H", MUTED);
		styles.forEach((style, c) => {
			const weight = cells.find((row) => row.size === size && row.style === style)?.weight ?? 0;
			const t = Math.min(1, weight / max);
			const mix = [
				.94 * (1 - t) + .22 * t,
				.93 * (1 - t) + .33 * t,
				.91 * (1 - t) + .27 * t
			];
			const bx = x + labelW + c * (cell + gap);
			const by = cy - cell;
			doc.fillRoundRect(bx, by, cell, cell, 4, mix);
			const ink = t > .45 ? PAPER : INK;
			const label = weight >= .5 ? weight.toFixed(0) : "·";
			const lw = measure(label, 8.5, true);
			doc.text(label, bx + (cell - lw) / 2, by + cell / 2 - 4, 8.5, "HB", ink);
		});
	});
}
function drawSectors(doc, report) {
	const rows = report.sectors.slice(0, 8);
	if (rows.length === 0) return;
	const rowH = 20;
	const pad = 16;
	const cardH = 32 + rows.length * rowH;
	heading(doc, "Equity sectors", "05  ·  GICS look-through of equity-like holdings", cardH + 8);
	doc.ensure(cardH + 8);
	const y = doc.y - cardH;
	doc.panel(48, y, doc.contentWidth, cardH);
	const max = rows[0]?.weight ?? 1;
	const barW = doc.contentWidth - 32 - 124 - 48;
	let ry = y + cardH - pad - 4;
	for (const row of rows) {
		doc.text(fit(row.label, 8.5, 120), 64, ry, 8.5, "H");
		const trackX = 188;
		doc.fillRoundRect(trackX, ry - 2, barW, 9, 4.5, SOFT);
		const w = max > 0 ? row.weight / max * barW : 0;
		if (w > 0) {
			doc.save();
			doc.clipRoundRect(trackX, ry - 2, barW, 9, 4.5);
			doc.fillRect(trackX, ry - 2, Math.max(w, 6), 9, SAGE);
			doc.restore();
		}
		doc.textRight(formatPct(row.weight), 548, ry, 8.5, "HB", MUTED);
		ry -= rowH;
	}
	doc.y = y - 14;
}
function drawFactors(doc, report) {
	const colW = (doc.contentWidth - GAP) / 2;
	const rowH = 48;
	heading(doc, "Factor and risk monitor", "06  ·  Relative to a plain 60/40", 56);
	report.factors.forEach((factor, i) => {
		if (i % 2 === 0) doc.ensure(56);
		const col = i % 2;
		const x = 48 + col * (colW + GAP);
		const y = doc.y - rowH + 6;
		doc.panel(x, y, colW, rowH, { r: R_SM });
		const labelW = measure(factor.label, 8.5, true);
		doc.text(factor.label, x + INSET, y + rowH - 16, 8.5, "HB");
		const hintMax = colW - 28 - labelW - 12;
		if (hintMax > 24) doc.textRight(fit(factor.hint, 7, hintMax), x + colW - INSET, y + rowH - 16, 7, "H", MUTED);
		const barX = x + INSET;
		const barW = colW - 28;
		const barY = y + 12;
		const mid = barX + barW / 2;
		doc.fillRoundRect(barX, barY, barW, 8, 4, SOFT);
		doc.fillRect(mid - .5, barY - 2, 1, 12, RULE);
		const mag = Math.min(1, Math.abs(factor.value));
		const w = barW / 2 * mag;
		doc.save();
		doc.clipRoundRect(barX, barY, barW, 8, 4);
		if (factor.value < 0) doc.fillRect(mid - w, barY, w, 8, [
			.29,
			.361,
			.42
		]);
		else doc.fillRect(mid, barY, Math.max(w, 1), 8, SAGE);
		doc.restore();
		if (col === 1 || i === report.factors.length - 1) doc.y = y - 10;
	});
	doc.y -= 8;
}
var POLICY_BAR = [
	.22,
	.33,
	.27
];
var BENCH_BAR = [
	.29,
	.361,
	.42
];
function drawTrailing(doc, report) {
	const trail = report.trailing;
	const introCopy = "Annualized total return over the trailing 1-, 3-, and 5-year windows. The benchmark is a constant-weight mix of Vanguard Total World Stock (VT) and Vanguard Total World Bond (BNDW) at this policy's core equity/fixed split (" + trail.benchmarkLabel + "). The policy line is a look-through reconstruction from sleeve roles, not live fund NAVs.";
	const introLines = wrap(introCopy, 8.5, doc.contentWidth);
	const boxH = 148;
	heading(doc, "Trailing returns vs benchmark", `07  ·  ${trail.benchmarkLabel}  ·  as of ${trail.asOf}`, introLines.length * 12 + boxH + 36);
	for (const line of introLines) {
		doc.text(line, 48, doc.y, 8.5, "H", MUTED);
		doc.y -= 12;
	}
	doc.y -= 10;
	const boxW = (doc.contentWidth - 24) / 3;
	const maxAbs = Math.max(...trail.rows.flatMap((r) => [Math.abs(r.portfolio), Math.abs(r.benchmark)]), 8);
	doc.ensure(172);
	const startY = doc.y;
	trail.rows.forEach((row, i) => {
		const x = 48 + i * (boxW + GAP);
		const y = startY - boxH;
		const inner = boxW - 28;
		doc.panel(x, y, boxW, boxH, { r: R_SM });
		doc.save();
		doc.clipRoundRect(x, y, boxW, boxH, R_SM);
		doc.fillRect(x, y + boxH - 3, boxW, 3, SAGE);
		doc.restore();
		doc.text(row.label.toUpperCase(), x + 14, y + boxH - 20, 7, "HB", SAGE);
		doc.text(fit(row.window, 7, inner), x + 14, y + boxH - 34, 7, "H", MUTED);
		doc.text(formatReturn(row.portfolio), x + 14, y + boxH - 62, 20, "TB");
		drawTrailBar(doc, x + 14, y + 56, inner, "Policy", row.portfolio, maxAbs, POLICY_BAR);
		drawTrailBar(doc, x + 14, y + 32, inner, "Benchmark", row.benchmark, maxAbs, BENCH_BAR);
		const rounded = Number(row.excess.toFixed(1));
		const excessColor = rounded > 0 ? OK : rounded < 0 ? ALERT : MUTED;
		const chipFill = rounded > 0 ? OK_BG : rounded < 0 ? ALERT_BG : SOFT;
		const chip = `Excess  ${formatExcess(row.excess)}`;
		const chipW = Math.min(inner, measure(chip, 7.5, true) + 14);
		doc.fillRoundRect(x + 14, y + 10, chipW, 14, 7, chipFill);
		doc.text(chip, x + 21, y + 13, 7.5, "HB", excessColor);
	});
	doc.y = startY - boxH - 12;
	for (const line of wrap(trail.note, 7.5, doc.contentWidth)) {
		doc.ensure(12);
		doc.text(line, 48, doc.y, 7.5, "H", MUTED);
		doc.y -= 10;
	}
	doc.y -= 10;
}
function drawTrailBar(doc, x, y, width, label, value, maxAbs, color) {
	doc.text(label, x, y + 11, 6.5, "H", MUTED);
	doc.textRight(formatReturn(value), x + width, y + 11, 6.5, "HB");
	doc.fillRoundRect(x, y, width, 6, 3, SOFT);
	const w = maxAbs > 0 ? Math.abs(value) / maxAbs * width : 0;
	if (w > 0) {
		doc.save();
		doc.clipRoundRect(x, y, width, 6, 3);
		doc.fillRect(x, y, Math.max(w, 4), 6, color);
		doc.restore();
	}
}
function drawScenarios(doc, report) {
	heading(doc, "Scenario analysis", "08  ·  Illustrative, not a forecast", 64);
	const maxAbs = Math.max(...report.scenarios.map((s) => Math.abs(s.result)), 10);
	for (const row of report.scenarios) {
		const h = 58;
		if (doc.y - 66 < 60) {
			doc.addPage(true);
			doc.text("SCENARIO ANALYSIS  ·  CONTINUED", 48, doc.y, 7, "HB", SAGE);
			doc.y -= 14;
		}
		const y = doc.y - h;
		const innerX = 62;
		const innerW = doc.contentWidth - 28;
		doc.panel(48, y, doc.contentWidth, h, { r: R_SM });
		doc.text(fit(row.label, 9.5, innerW - 64, true), innerX, y + h - 16, 9.5, "HB");
		doc.textRight(`${row.result >= 0 ? "+" : ""}${row.result.toFixed(1)}%`, 550, y + h - 16, 11, "TB", row.result >= 0 ? OK : ALERT);
		doc.text(fit(`${row.period}  ·  ${row.note}`, 7.5, innerW), innerX, y + h - 30, 7.5, "H", MUTED);
		const barY = y + 10;
		const mid = innerX + innerW / 2;
		doc.fillRoundRect(innerX, barY, innerW, 8, 4, SOFT);
		doc.fillRect(mid - .5, barY - 2, 1, 12, RULE);
		const w = Math.abs(row.result) / maxAbs * (innerW / 2);
		doc.save();
		doc.clipRoundRect(innerX, barY, innerW, 8, 4);
		if (row.result < 0) doc.fillRect(mid - w, barY, w, 8, ALERT);
		else doc.fillRect(mid, barY, Math.max(w, 1.5), 8, OK);
		doc.restore();
		doc.y = y - 8;
	}
	doc.y -= 6;
}
function drawLiquidityIncome(doc, report, dollars) {
	const colW = (doc.contentWidth - GAP) / 2;
	const items = [
		{
			key: "daily",
			label: "Daily / T+1 ETFs",
			weight: report.liquidity.daily,
			color: "var(--color-ok)"
		},
		{
			key: "interval",
			label: "Interval funds",
			weight: report.liquidity.interval,
			color: "var(--color-warn)"
		},
		{
			key: "illiquid",
			label: "Private / illiquid",
			weight: report.liquidity.illiquid,
			color: "var(--color-destructive)"
		}
	].filter((i) => i.weight > .05);
	const leftH = 40 + items.length * 36;
	const cardH = Math.max(leftH, 140) + 16;
	heading(doc, "Liquidity, income and concentration", "09  ·  Redemption profile and fee drag", cardH + 8);
	doc.ensure(cardH + 8);
	const y = doc.y - cardH;
	const rx = 48 + colW + GAP;
	doc.panel(48, y, colW, cardH);
	doc.panel(rx, y, colW, cardH);
	doc.text("Liquidity ladder", 48 + INSET, y + cardH - 18, 8, "HB", MUTED);
	doc.text("Income and fees", rx + INSET, y + cardH - 18, 8, "HB", MUTED);
	const innerW = colW - 28;
	let ly = y + cardH - 40;
	for (const item of items) {
		doc.fillCircle(48 + INSET + 4, ly + 3, 3.2, shareRgb(item.color));
		doc.text(fit(item.label, 8.5, innerW - 58), 48 + INSET + 14, ly, 8.5, "H");
		doc.textRight(formatPct(item.weight), 48 + colW - INSET, ly, 8.5, "HB");
		const trackY = ly - 12;
		const trackX = 48 + INSET;
		doc.fillRoundRect(trackX, trackY, innerW, 7, 3.5, SOFT);
		const tw = Math.max(6, Math.min(item.weight, 100) / 100 * innerW);
		doc.save();
		doc.clipRoundRect(trackX, trackY, innerW, 7, 3.5);
		doc.fillRect(trackX, trackY, tw, 7, shareRgb(item.color));
		doc.restore();
		if (dollars !== null) doc.textRight(formatUsd(item.weight / 100 * dollars), 48 + colW - INSET, trackY - 10, 7.5, "H", MUTED);
		ly -= 36;
	}
	const stats = [
		["Gross yield", `${report.income.grossYield.toFixed(2)}%`],
		["Expense ratio", formatEr(report.income.feeDrag)],
		["Net of ER", `${report.income.netOfEr.toFixed(2)}%`]
	];
	let ry = y + cardH - 42;
	for (const [label, value] of stats) {
		doc.text(label, rx + INSET, ry, 8, "H", MUTED);
		doc.textRight(value, rx + colW - INSET, ry, 12, "TB");
		ry -= 22;
	}
	wrap(`Top holding ${report.concentration.topName} is ${formatPct(report.concentration.topWeight)}. Effective holdings ${report.concentration.effectiveHoldings.toFixed(1)} (HHI ${report.concentration.hhi.toFixed(3)}).`, 7.5, colW - 28).slice(0, 3).forEach((line) => {
		doc.text(line, rx + INSET, ry, 7.5, "H", MUTED);
		ry -= 10;
	});
	doc.y = y - 14;
}
function drawFlags(doc, report) {
	heading(doc, "Policy flags", "10  ·  Genesis-style monitor", 48);
	for (const flag of report.flags) {
		const details = wrap(flag.detail, 8.5, doc.contentWidth - 32);
		const h = 32 + details.length * 12;
		doc.ensure(h + 8);
		const y = doc.y - h;
		const bg = flag.level === "alert" ? ALERT_BG : flag.level === "ok" ? OK_BG : WARN_BG;
		const accent = flag.level === "alert" ? ALERT : flag.level === "ok" ? OK : WARN;
		doc.panel(48, y, doc.contentWidth, h, {
			fill: bg,
			r: R_SM,
			stroke: false
		});
		doc.save();
		doc.clipRoundRect(48, y, doc.contentWidth, h, R_SM);
		doc.fillRect(48, y, 3.5, h, accent);
		doc.restore();
		const tag = flag.level === "alert" ? "ALERT" : flag.level === "ok" ? "CLEAR" : "WATCH";
		doc.text(tag, 64, y + h - 16, 7, "HB", accent);
		doc.text(flag.title, 110, y + h - 16, 9.5, "HB");
		details.forEach((line, i) => {
			doc.text(line, 64, y + h - 32 - i * 12, 8.5, "H");
		});
		doc.y = y - 8;
	}
	doc.y -= 8;
}
function drawOverview(doc, report) {
	heading(doc, "Portfolio overview", "11  ·  What this mix is built to do", 48);
	report.overview.forEach((point, i) => {
		const lines = wrap(point, 9, doc.contentWidth - 22);
		const need = 16 + lines.length * 12;
		if (doc.y - need < 60) {
			doc.addPage(true);
			if (i > 0) {
				doc.text("PORTFOLIO OVERVIEW  ·  CONTINUED", 48, doc.y, 7, "HB", SAGE);
				doc.y -= 14;
			}
		}
		doc.fillCircle(51, doc.y + 3, 2.6, SAGE);
		lines.forEach((line) => {
			doc.text(line, 64, doc.y, 9, "H");
			doc.y -= 12;
		});
		if (i < report.overview.length - 1) doc.y -= 8;
	});
	doc.y -= 12;
}
function drawVoice(doc, report) {
	const quoteLines = wrap(`"${report.voice.comment}"`, 12, doc.contentWidth - 36, true);
	const whyLines = wrap(report.voice.why, 8.5, doc.contentWidth - 36);
	const disc = wrap(`*Hypothetical commentary written in the style of ${report.voice.name} for illustration and education. It is not a real quote, endorsement, affiliation, or recommendation by ${report.voice.name} or any firm associated with that name.`, 7.5, doc.contentWidth - 36);
	const schoolLines = wrap(`${report.voice.years}  ·  ${report.voice.school}`, 8, doc.contentWidth - 36);
	const boxH = 44 + schoolLines.length * 11 + quoteLines.length * 16 + whyLines.length * 12 + disc.length * 10 + 12;
	heading(doc, "A voice from the archives", `12  ·  In the manner of ${report.voice.name}`, boxH);
	const y = doc.y - boxH;
	doc.panel(48, y, doc.contentWidth, boxH);
	doc.save();
	doc.clipRoundRect(48, y, doc.contentWidth, boxH, R);
	doc.fillRect(48, y, 3.5, boxH, SAGE);
	doc.restore();
	let ty = y + boxH - 20;
	doc.text(report.voice.name, 66, ty, 13, "TB");
	ty -= 14;
	schoolLines.forEach((line) => {
		doc.text(line, 66, ty, 8, "H", MUTED);
		ty -= 11;
	});
	ty -= 6;
	quoteLines.forEach((line) => {
		doc.text(line, 66, ty, 12, "T");
		ty -= 16;
	});
	ty -= 4;
	whyLines.forEach((line) => {
		doc.text(line, 66, ty, 8.5, "H", MUTED);
		ty -= 12;
	});
	ty -= 4;
	disc.forEach((line) => {
		doc.text(line, 66, ty, 7.5, "H", MUTED);
		ty -= 10;
	});
	doc.y = y - 12;
}
function drawDisclaimer(doc) {
	const copy = "Model diagnostics as of the Falcon Core Model dated " + CORE_AS_OF + ". Figures are representative look-through characteristics, not live market data, NAV, or a performance composite. Scenario results are stylized path estimates for advisor discussion - not forecasts, stress-test guarantees, or a recommendation. For advisor use only.";
	const lines = wrap(copy, 7.5, doc.contentWidth - 28);
	const h = 18 + lines.length * 10;
	if (doc.y - h < 50) doc.addPage(true);
	const y = doc.y - h;
	doc.panel(48, y, doc.contentWidth, h, {
		fill: CREAM,
		r: R_SM,
		shadow: false
	});
	lines.forEach((line, i) => {
		doc.text(line, 62, y + h - 14 - i * 10, 7.5, "H", MUTED);
	});
	doc.y = y - 8;
}
function DiagnosticsReport({ open, onClose, input, allocation, vision, advisorName }) {
	const report = open ? buildDiagnostics(allocation, input, vision) : null;
	const closeRef = (0, import_react.useRef)(null);
	const lastFocus = (0, import_react.useRef)(null);
	const onCloseRef = (0, import_react.useRef)(onClose);
	const [building, setBuilding] = (0, import_react.useState)(false);
	onCloseRef.current = onClose;
	(0, import_react.useEffect)(() => {
		if (!open) return;
		lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		document.body.classList.add("diagnostics-open");
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const id = window.requestAnimationFrame(() => closeRef.current?.focus());
		const onKey = (e) => {
			if (e.key === "Escape") onCloseRef.current();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.cancelAnimationFrame(id);
			document.body.classList.remove("diagnostics-open");
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
			lastFocus.current?.focus?.();
		};
	}, [open]);
	if (!open || !report) return null;
	const client = input.clientName.trim();
	const date = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric"
	}).format(/* @__PURE__ */ new Date());
	function copy() {
		navigator.clipboard.writeText(diagnosticsCopy(report, allocation, input)).then(() => toast("Diagnostics copied"), () => toast("Could not copy"));
	}
	async function downloadPdf() {
		if (building || !report) return;
		setBuilding(true);
		try {
			const bytes = buildDiagnosticsPdf(input, allocation, report, advisorName);
			const stem = proposalFileStem(input.clientName, allocation.policyCode);
			downloadBytes(`${stem}-XRay.pdf`, bytes, "application/pdf");
			toast("Diagnostics PDF downloaded");
		} catch {
			toast("Could not build the diagnostics PDF.");
		} finally {
			setBuilding(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "diagnostics-overlay fixed inset-0 z-[80] overflow-y-auto bg-background",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "diagnostics-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sticky top-0 z-10 border-b border-border/80 bg-background/95 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FalconMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: "Portfolio diagnostics"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "diagnostics-title",
							className: "truncate font-medium",
							children: allocation.policyCode
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-print flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: copy,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), "Copy"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => void downloadPdf(),
							disabled: building,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), building ? "Building…" : "Download PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => window.print(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Print"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							ref: closeRef,
							variant: "secondary",
							size: "sm",
							onClick: onClose,
							"aria-label": "Close diagnostics",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}), "Close"]
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "print-break flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: [
								"Falcon X-Ray · ",
								date,
								client ? ` · ${client}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl font-medium tracking-tight sm:text-4xl",
							children: allocation.policyTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-3xl text-sm leading-relaxed text-muted-foreground",
							children: report.headline
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "print-break grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskTile, {
							score: report.riskScore,
							label: report.riskLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Est. yield",
							value: `${report.kpis.yieldPct.toFixed(2)}%`,
							blurb: "The look-through income the holdings are designed to produce over a year, before taxes. Useful for planning — not a guaranteed coupon or a promised distribution."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Weighted ER",
							value: formatEr(report.kpis.expenseRatio),
							blurb: "Expense ratio: the asset-weighted fund fee, blended by how much of the account sits in each line. It is the annual cost of owning this implementation."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Est. volatility",
							value: `${report.kpis.volPct.toFixed(1)}%`,
							blurb: "A stylized annual standard deviation of returns. Roughly two-thirds of years are expected to land inside plus-or-minus this band. It is a weather report, not a ceiling."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Beta vs S&P 500",
							value: report.kpis.betaSpx.toFixed(2),
							blurb: "How much this mix has tended to move when the S&P 500 moves 1%. Near 1.00 tracks the index; below 1.00 is more muted; above 1.00 amplifies equity weather."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Bond duration",
							value: `${report.kpis.durationYrs.toFixed(1)}y`,
							blurb: "Average interest-rate sensitivity of the fixed-income book, in years. A 1% rise in yields is a rough minus-duration percent mark on those bonds, before credit spreads."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Sharpe (est.)",
							value: report.kpis.sharpe.toFixed(2),
							blurb: `Estimated excess return per unit of volatility, versus a 4.2% risk-free rate. Higher means more expected compensation for the ride — still an estimate, not a medal.`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Est. max drawdown",
							value: `${report.kpis.maxDdPct.toFixed(0)}%`,
							blurb: "A stylized peak-to-trough decline in a severe market. It is an illustration for conversation, not a floor, a stop-loss, or a guarantee of how bad a year can get."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Underlying holdings",
					kicker: allocation.satelliteSleevePct > 0 ? `Core ${formatPct(allocation.coreSleevePct)} · Satellite ${formatPct(allocation.satelliteSleevePct)} · as of ${CORE_AS_OF}` : `Core ${formatPct(allocation.coreSleevePct)} · as of ${CORE_AS_OF}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-3xl text-sm leading-relaxed text-muted-foreground",
						children: "Look-through positions in this policy. Core Equity and Core Fixed Income are sorted greatest to least inside each sleeve. Account % is of the whole book after any satellite overlay; the Model column is the core sheet weight."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldingsTable, {
						allocation,
						dollars: input.accountValue
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Asset allocation",
					kicker: "Look-through roles",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllocationMix, {
						items: report.buckets,
						dollars: input.accountValue
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Geography",
						kicker: "Domicile mix",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackedBar, { items: report.geography }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareTable, {
							items: report.geography,
							dollars: null
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Equity style box",
						kicker: `${report.equityShare.toFixed(0)}% of account is equity-like`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleBox, { cells: report.styleBox })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Equity sectors",
					kicker: "GICS look-through of equity-like holdings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: report.sectors.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
							label: s.label,
							weight: s.weight,
							max: report.sectors[0]?.weight ?? 1
						}, s.key))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Factor & risk monitor",
					kicker: "Relative to a plain 60/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: report.factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorRow, { factor: f }, f.key))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Trailing returns vs benchmark",
					kicker: `${report.trailing.benchmarkLabel} · as of ${report.trailing.asOf}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-3xl text-sm leading-relaxed text-muted-foreground",
							children: "Annualized total return over the trailing 1-, 3-, and 5-year windows. The benchmark is a constant-weight mix of Vanguard Total World Stock (VT) and Vanguard Total World Bond (BNDW) at this policy’s core equity/fixed split — so a 60/40 is 60% VT / 40% BNDW. The policy line is a look-through reconstruction from sleeve roles, not live fund NAVs."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: report.trailing.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailingTile, {
								row,
								maxAbs: trailScale(report.trailing.rows)
							}, row.years))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: report.trailing.note
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Scenario analysis",
					kicker: "Illustrative, not a forecast",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: report.scenarios.map((s) => ({
									...s,
									fill: s.result >= 0 ? "var(--color-ok)" : "var(--color-destructive)"
								})),
								layout: "vertical",
								margin: {
									top: 4,
									right: 16,
									left: 8,
									bottom: 4
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										tickFormatter: (v) => `${v}%`,
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "label",
										width: 118,
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (value) => `${Number(value).toFixed(1)}%`,
										contentStyle: {
											background: "var(--color-popover)",
											border: "1px solid var(--color-border)",
											borderRadius: "10px",
											fontSize: "12px"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "result",
										radius: [
											0,
											4,
											4,
											0
										],
										isAnimationActive: false,
										children: report.scenarios.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: s.result >= 0 ? "var(--color-ok)" : "var(--color-destructive)" }, s.key))
									})
								]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-2 text-xs text-muted-foreground",
						children: report.scenarios.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2",
								children: [
									s.period,
									" · ",
									s.note
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("tabular-nums font-medium", s.result >= 0 ? "text-ok" : "text-destructive"),
								children: [
									s.result >= 0 ? "+" : "",
									s.result.toFixed(1),
									"%"
								]
							})]
						}, s.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Liquidity ladder",
						kicker: "Redemption profile",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareTable, {
							items: [
								{
									key: "daily",
									label: "Daily / T+1 ETFs",
									weight: report.liquidity.daily,
									color: "var(--color-ok)"
								},
								{
									key: "interval",
									label: "Interval funds",
									weight: report.liquidity.interval,
									color: "var(--color-warn)"
								},
								{
									key: "illiquid",
									label: "Private / illiquid",
									weight: report.liquidity.illiquid,
									color: "var(--color-destructive)"
								}
							].filter((i) => i.weight > .05),
							dollars: input.accountValue
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Income & fees",
						kicker: "Gross vs net",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-3 gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Gross yield",
									value: `${report.income.grossYield.toFixed(2)}%`,
									blurb: "Look-through income before the fund expense ratio."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Expense ratio",
									value: formatEr(report.income.feeDrag),
									blurb: "Asset-weighted fund fee — the annual cost of this implementation."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Net of ER",
									value: `${report.income.netOfEr.toFixed(2)}%`,
									blurb: "Gross yield minus the weighted expense ratio."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: [
								"Top holding ",
								report.concentration.topName,
								" is ",
								formatPct(report.concentration.topWeight),
								". Effective number of holdings ",
								report.concentration.effectiveHoldings.toFixed(1),
								" (HHI",
								" ",
								report.concentration.hhi.toFixed(3),
								")."
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Policy flags",
					kicker: "Genesis-style monitor",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-2",
						children: report.flags.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-secondary px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: f.level === "alert" ? "warn" : f.level === "ok" ? "ok" : "muted",
									children: f.level === "alert" ? "Alert" : f.level === "ok" ? "Clear" : "Watch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: f.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: f.detail
							})]
						}, f.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Portfolio overview",
					kicker: "What this mix is built to do",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-3",
						children: report.overview.map((point, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: point })]
						}, i))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceSection, { voice: report.voice }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pb-8 text-xs leading-relaxed text-muted-foreground",
					children: [
						"Model diagnostics as of the Falcon Core Model dated ",
						CORE_AS_OF,
						". Figures are representative look-through characteristics, not live market data, NAV, or a performance composite. Scenario results are stylized path estimates for advisor discussion — not forecasts, stress-test guarantees, or a recommendation. For advisor use only."
					]
				})
			]
		})]
	});
}
function Section({ title, kicker, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "print-break flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-medium tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wide text-muted-foreground uppercase",
			children: kicker
		})] }), children]
	});
}
function Kpi({ label, value, blurb }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-lg bg-card px-3 py-3 shadow-card sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-2xl font-medium tabular-nums tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted-foreground",
				children: blurb
			})
		]
	});
}
function RiskTile({ score, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-lg bg-primary px-3 py-3 text-primary-foreground shadow-card sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide uppercase opacity-70",
				children: "Risk score"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-2xl font-medium tabular-nums tracking-tight",
				children: score
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs opacity-80",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-1 overflow-hidden rounded-full bg-primary-foreground/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-primary-foreground",
					style: { width: `${score}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed opacity-70",
				children: "A 0–100 composite of estimated volatility and equity beta. Higher means a more aggressive path and larger swings along the way — a risk budget, not a grade."
			})
		]
	});
}
function trailScale(rows) {
	return Math.max(...rows.flatMap((r) => [Math.abs(r.portfolio), Math.abs(r.benchmark)]), 8);
}
function TrailingTile({ row, maxAbs }) {
	const rounded = Number(row.excess.toFixed(1));
	const ahead = rounded > 0;
	const behind = rounded < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-lg bg-card px-3 py-3 shadow-card sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: row.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[11px] text-muted-foreground",
				children: row.window
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl font-medium tabular-nums tracking-tight",
				children: formatReturn(row.portfolio)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Policy, annualized"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailBar, {
					label: "Policy",
					value: row.portfolio,
					maxAbs,
					tone: "policy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailBar, {
					label: "Benchmark",
					value: row.benchmark,
					maxAbs,
					tone: "bench"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("mt-3 text-sm font-medium tabular-nums", ahead ? "text-ok" : behind ? "text-destructive" : "text-muted-foreground"),
				children: ["Excess ", formatExcess(row.excess)]
			})
		]
	});
}
function TrailBar({ label, value, maxAbs, tone }) {
	const pct = maxAbs > 0 ? Math.min(100, Math.abs(value) / maxAbs * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-baseline justify-between gap-2 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: formatReturn(value)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-secondary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", tone === "policy" ? "bg-equity" : "bg-fixed"),
			style: { width: `${pct}%` }
		})
	})] });
}
function MiniStat({ label, value, blurb }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted-foreground",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-medium tabular-nums",
			children: value
		}),
		blurb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs leading-relaxed text-muted-foreground",
			children: blurb
		}) : null
	] });
}
function StackedBar({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-3 overflow-hidden rounded-full bg-secondary",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full",
			style: {
				flexBasis: `${item.weight}%`,
				background: item.color
			}
		}, item.key))
	});
}
function HoldingsTable({ allocation, dollars }) {
	const showModelCol = allocation.satelliteSleevePct > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-64 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-left text-xs tracking-wide text-muted-foreground uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 font-medium",
							children: "Holding"
						}),
						showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 text-right font-medium",
							children: "Model"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 text-right font-medium",
							children: "Account"
						}),
						dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 text-right font-medium",
							children: "Amount"
						}) : null
					]
				}) }),
				allocation.groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldingsGroup, {
					group,
					dollars,
					showModelCol
				}, group.key)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "pt-2.5 font-medium",
							children: "Total"
						}),
						showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "pt-2.5 text-right font-medium tabular-nums",
							children: "100.00%"
						}),
						dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "pt-2.5 text-right font-medium tabular-nums",
							children: formatUsd(dollars)
						}) : null
					]
				}) })
			]
		})
	});
}
function HoldingsGroup({ group, dollars, showModelCol }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border/70 bg-secondary/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 pr-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2 shrink-0 rounded-full",
						style: { background: sleeveColor(group.kind) }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: group.label
					}), group.coreSleeveWeight !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 block text-xs text-muted-foreground",
						children: [group.coreSleeveWeight, "% of core mix"]
					}) : null] })]
				})
			}),
			showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right text-xs tabular-nums text-muted-foreground",
				children: group.coreSleeveWeight !== null ? formatPct(group.coreSleeveWeight) : "—"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right font-medium tabular-nums",
				children: formatPct(group.weight)
			}),
			dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right font-medium tabular-nums",
				children: formatUsd(group.weight / 100 * dollars)
			}) : null
		]
	}), group.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "py-2 pr-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium tabular-nums",
					children: line.ticker
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-0.5 line-clamp-2 block text-xs text-muted-foreground",
					children: [
						line.group ? `${line.group} · ` : "",
						line.name,
						line.expenseRatio !== null ? ` · ER ${formatEr(line.expenseRatio)}` : ""
					]
				})]
			}),
			showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right tabular-nums text-muted-foreground",
				children: line.coreWeight === null ? "—" : formatPct(line.coreWeight)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right tabular-nums",
				children: formatPct(line.weight)
			}),
			dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right tabular-nums",
				children: formatUsd(line.weight / 100 * dollars)
			}) : null
		]
	}, line.id))] });
}
function AllocationMix({ items, dollars }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-14 overflow-hidden rounded-xl",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex min-w-0 items-center justify-center",
				style: {
					flexGrow: Math.max(item.weight, .01),
					flexBasis: 0,
					background: item.color
				},
				title: `${item.label} ${formatPct(item.weight)}`,
				children: item.weight >= 10 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "px-1 text-[11px] font-medium tabular-nums text-primary-foreground",
					children: [item.weight.toFixed(0), "%"]
				}) : null
			}, item.key))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("grid items-center gap-3 border-t border-border/50 py-2 text-sm", dollars !== null ? "grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)_4.5rem_6.5rem]" : "grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)_4.5rem]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex min-w-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2.5 shrink-0 rounded-sm",
							style: { background: item.color }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: item.label
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden h-2 overflow-hidden rounded-full bg-secondary sm:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full",
							style: {
								width: `${Math.min(100, item.weight)}%`,
								background: item.color
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right tabular-nums",
						children: formatPct(item.weight)
					}),
					dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right tabular-nums text-muted-foreground",
						children: formatUsd(item.weight / 100 * dollars)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden sm:block" })
				]
			}, item.key))
		})]
	});
}
function ShareTable({ items, dollars }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		className: "w-full text-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-t border-border/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
					className: "py-1.5 pr-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-2 inline-block size-2 rounded-full",
						style: { background: item.color }
					}), item.label]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-1.5 text-right tabular-nums",
					children: formatPct(item.weight)
				}),
				dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-1.5 text-right tabular-nums text-muted-foreground",
					children: formatUsd(item.weight / 100 * dollars)
				}) : null
			]
		}, item.key)) })
	});
}
function BarRow({ label, weight, max }) {
	const pct = max > 0 ? weight / max * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-equity",
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-right tabular-nums text-muted-foreground",
				children: formatPct(weight)
			})
		]
	});
}
function StyleBox({ cells }) {
	const max = Math.max(...cells.map((c) => c.weight), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-fit",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1.5 ml-[3.25rem] grid grid-cols-3 gap-1 text-center text-[10px] tracking-wide text-muted-foreground uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Value" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Blend" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Growth" })
				]
			}),
			[
				"Large",
				"Mid",
				"Small"
			].map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-11 shrink-0 text-right text-[11px] text-muted-foreground",
					children: size
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1",
					children: [
						"Value",
						"Blend",
						"Growth"
					].map((style) => {
						const w = cells.find((c) => c.size === size && c.style === style)?.weight ?? 0;
						const intensity = w / max;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-11 items-center justify-center rounded text-[11px] tabular-nums sm:size-12",
							style: {
								background: `color-mix(in srgb, var(--color-equity) ${Math.round(18 + intensity * 72)}%, var(--color-secondary))`,
								color: intensity > .45 ? "var(--color-primary-foreground)" : "var(--color-foreground)"
							},
							children: w >= .5 ? w.toFixed(0) : "·"
						}, style);
					})
				})]
			}, size)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 ml-[3.25rem] text-xs text-muted-foreground",
				children: "Cell = % of equity-like assets."
			})
		]
	});
}
function VoiceSection({ voice }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "A voice from the archives",
		kicker: `In the manner of ${voice.name}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "rounded-xl bg-card px-5 py-5 shadow-card sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-medium tracking-tight",
						children: voice.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: [
							voice.years,
							" · ",
							voice.school
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
					className: "mt-4 font-display text-lg leading-relaxed tracking-tight text-ink-soft",
					children: [
						"“",
						voice.comment,
						"”"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted-foreground",
					children: voice.why
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs leading-relaxed text-muted-foreground",
					children: [
						"*Hypothetical commentary written in the style of ",
						voice.name,
						" for illustration and education. It is not a real quote, endorsement, affiliation, or recommendation by",
						" ",
						voice.name,
						", their estate, or any firm associated with them."
					]
				})
			]
		})
	});
}
function FactorRow({ factor }) {
	const mag = Math.abs(factor.value);
	const left = factor.value < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-baseline justify-between gap-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: factor.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: factor.hint
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-2 rounded-full bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-1/2 w-px bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("absolute top-0 h-2 rounded-full", left ? "bg-fixed right-1/2" : "bg-equity left-1/2"),
			style: { width: `${mag * 50}%` }
		})]
	})] });
}
function DiagnosticsButton({ ready, onClick, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: compact ? "ghost" : "secondary",
		size: compact ? "icon" : "sm",
		onClick,
		disabled: !ready,
		"aria-label": "Portfolio diagnostics",
		title: ready ? "Run portfolio diagnostics" : "Finish the proposal to run diagnostics",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: "Diagnostics"
		})]
	});
}
function AllocationPanel({ input, allocation, vision, diagnosticsReady, onDiagnostics }) {
	const dollars = input.accountValue;
	const showModelCol = allocation.satelliteSleevePct > 0;
	function copy() {
		const text = allocationCopy(input, allocation);
		navigator.clipboard.writeText(text).then(() => toast("Allocation copied"), () => toast("Could not copy"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex flex-1 flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 print-break",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Policy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium tracking-tight",
						children: allocation.policyTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium tabular-nums text-muted-foreground",
						children: allocation.policyCode
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-print flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosticsButton, {
							compact: true,
							ready: diagnosticsReady,
							onClick: onDiagnostics
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: copy,
							"aria-label": "Copy allocation",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => window.print(),
							"aria-label": "Print proposal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {})
						})
					]
				})]
			}),
			allocation.pendingMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground",
				children: allocation.pendingMessage
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SleeveChart, { allocation }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-2.5 overflow-hidden rounded-full bg-secondary",
				children: allocation.sleeves.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full",
					style: {
						flexBasis: `${s.weight}%`,
						background: sleeveColor(s.kind)
					}
				}, s.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
				children: allocation.sleeves.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2 rounded-full",
							style: { background: sleeveColor(s.kind) }
						}),
						s.label,
						" ",
						formatPct(s.weight)
					]
				}, s.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Core ER",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground tabular-nums",
							children: formatEr(allocation.coreWeightedEr)
						})
					] }),
					allocation.satelliteSleevePct > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Account ER",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground tabular-nums",
							children: formatEr(allocation.portfolioWeightedEr)
						})
					] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Model as of ", CORE_AS_OF] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Look-through holdings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							"Core ",
							formatPct(allocation.coreSleevePct),
							allocation.satelliteSleevePct > 0 ? ` · Satellite ${formatPct(allocation.satelliteSleevePct)}` : ""
						]
					})]
				}),
				showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-xs text-muted-foreground",
					children: [
						"Model column is the core sheet weight. Account column is after the",
						" ",
						allocation.satelliteSleevePct,
						"% satellite overlay."
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-64 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-left text-xs tracking-wide text-muted-foreground uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 font-medium",
										children: "Holding"
									}),
									showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 text-right font-medium",
										children: "Model"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 text-right font-medium",
										children: "Account"
									}),
									dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 text-right font-medium",
										children: "Amount"
									}) : null
								]
							}) }),
							allocation.groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupBody, {
								group,
								dollars,
								showModelCol
							}, group.key)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "pt-2.5 font-medium",
										children: "Total"
									}),
									showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "pt-2.5 text-right font-medium tabular-nums",
										children: "100.00%"
									}),
									dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "pt-2.5 text-right font-medium tabular-nums",
										children: formatUsd(dollars)
									}) : null
								]
							}) })
						]
					})
				})
			] }),
			vision.applies ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisionCallout, { vision }) : null
		]
	});
}
function GroupBody({ group, dollars, showModelCol }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border/70 bg-secondary/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 pr-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2 shrink-0 rounded-full",
						style: { background: sleeveColor(group.kind) }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: group.label
					}), group.coreSleeveWeight !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 block text-xs text-muted-foreground",
						children: [group.coreSleeveWeight, "% of core mix"]
					}) : null] })]
				})
			}),
			showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right text-xs tabular-nums text-muted-foreground",
				children: group.coreSleeveWeight !== null ? formatPct(group.coreSleeveWeight) : "—"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right font-medium tabular-nums",
				children: formatPct(group.weight)
			}),
			dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right font-medium tabular-nums",
				children: formatUsd(group.weight / 100 * dollars)
			}) : null
		]
	}), group.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "py-2 pr-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium tabular-nums",
					children: line.ticker
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-0.5 line-clamp-2 block text-xs text-muted-foreground",
					children: [
						line.group ? `${line.group} · ` : "",
						line.name,
						line.expenseRatio !== null ? ` · ER ${formatEr(line.expenseRatio)}` : ""
					]
				})]
			}),
			showModelCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right tabular-nums text-muted-foreground",
				children: line.coreWeight === null ? "—" : formatPct(line.coreWeight)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right tabular-nums",
				children: formatPct(line.weight)
			}),
			dollars !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 text-right tabular-nums",
				children: formatUsd(line.weight / 100 * dollars)
			}) : null
		]
	}, line.id))] });
}
function SleeveChart({ allocation }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	const data = allocation.sleeves.map((s) => ({
		...s,
		fill: sleeveColor(s.kind)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto h-44 w-full max-w-xs print-break",
		children: [ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data,
				dataKey: "weight",
				nameKey: "label",
				cx: "50%",
				cy: "50%",
				innerRadius: 56,
				outerRadius: 78,
				startAngle: 90,
				endAngle: -270,
				paddingAngle: data.length > 1 ? 2 : 0,
				stroke: "none",
				isAnimationActive: false,
				children: data.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.fill }, entry.key))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
				formatter: (value) => formatPct(Number(value)),
				contentStyle: {
					background: "var(--color-popover)",
					border: "1px solid var(--color-border)",
					borderRadius: "10px",
					fontSize: "12px"
				}
			})] })
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Core sleeve"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-2xl font-medium tabular-nums tracking-tight",
				children: allocation.core.short
			})]
		})]
	});
}
function VisionCallout({ vision }) {
	if (vision.ok === false) {
		const twentyStillShort = vision.sleevePct === 10 && vision.requiredAt20 > 0 && (vision.satelliteDollars ?? 0) * 2 + 1e-6 < 1e5;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg bg-warn/10 px-4 py-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "warn",
						children: "Minimum not met"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-foreground",
					children: [
						VISION_FUND_NAME,
						" requires ",
						formatUsd(VISION_FUND_MIN),
						" in the satellite sleeve. At this overlay the sleeve is",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tabular-nums",
							children: formatUsd(vision.satelliteDollars ?? 0)
						}),
						", a shortfall of",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tabular-nums",
							children: formatUsd(vision.shortfall ?? 0)
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-muted-foreground",
					children: [
						"Required account value at this overlay:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground tabular-nums",
							children: formatUsd(vision.requiredAccount ?? 0)
						}),
						".",
						twentyStillShort ? ` Even at 20%, the account would need ${formatUsd(vision.requiredAt20)}.` : vision.sleevePct === 10 ? " Making Private Equity the full 20% satellite would fund the minimum at this account size." : "",
						" ",
						"Increase the account, or switch to Private Income."
					]
				})
			]
		});
	}
	if (vision.ok === true) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-ok/10 px-4 py-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "ok",
			children: "Minimum funded"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-muted-foreground",
			children: [
				"Satellite sleeve",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground tabular-nums",
					children: formatUsd(vision.satelliteDollars ?? 0)
				}),
				" ",
				"meets the ",
				formatUsd(VISION_FUND_MIN),
				" ",
				VISION_FUND_NAME,
				" minimum."
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			VISION_FUND_NAME,
			" requires ",
			formatUsd(VISION_FUND_MIN),
			" in the satellite sleeve. Enter an account value to test the minimum — ",
			formatUsd(vision.requiredAt10),
			" ",
			"at a 10% overlay, or ",
			formatUsd(vision.requiredAt20),
			" at 20%."
		] })
	});
}
function CoreHoldings({ equity, weightedEr }) {
	const equityRows = positionsByKind(equity, "equity");
	const fixedRows = positionsByKind(equity, "fixed");
	const equityPct = equity;
	const fixedPct = 100 - equity;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Underlying positions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-muted-foreground",
					children: ["Core ER ", formatEr(weightedEr)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SleeveList, {
					title: "Equity",
					sleevePct: equityPct,
					kind: "equity",
					rows: equityRows,
					empty: "No equity sleeve at 0/100."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SleeveList, {
					title: "Fixed income",
					sleevePct: fixedPct,
					kind: "fixed",
					rows: fixedRows,
					empty: "No fixed-income sleeve at 100/0."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Falcon Core Model weights as of ",
					CORE_AS_OF,
					". Position weights are percent of the core sleeve and move with the mix."
				]
			})
		]
	});
}
function SleeveList({ title, sleevePct, kind, rows, empty }) {
	const scale = Math.max(...rows.map((row) => row.coreWeight), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-1.5 text-sm font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", kind === "equity" ? "bg-equity" : "bg-fixed") }), title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tabular-nums text-muted-foreground",
				children: [sleevePct, "% of core"]
			})]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-lg bg-secondary px-3 py-4 text-xs text-muted-foreground",
			children: empty
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col",
			children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border-t border-border/70 py-2 first:border-t-0 first:pt-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tabular-nums",
							children: row.ticker
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block truncate text-xs text-muted-foreground",
							children: row.assetClass
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-sm tabular-nums",
						children: formatPct(row.coreWeight)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 h-1 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("h-full rounded-full transition-[width] duration-200 ease-out", kind === "equity" ? "bg-equity" : "bg-fixed"),
						style: { width: `${Math.min(100, row.coreWeight / scale * 100)}%` }
					})
				})]
			}, row.ticker))
		})]
	});
}
function CorePicker({ equity, onSelect }) {
	const selected = coreByEquity(equity);
	const weightedEr = coreWeightedExpenseRatio(selected.equity);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3 text-xs tracking-wide text-muted-foreground uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Equity-led" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Income-led" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Core equity allocation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 100,
					step: 5,
					value: 100 - equity,
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": equity,
					"aria-valuetext": `${equity} percent equity, ${100 - equity} percent fixed income`,
					onChange: (event) => {
						const next = 100 - Number(event.target.value);
						if (isEquityStep(next)) onSelect(next);
					},
					className: "mix-slider w-full"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 gap-1.5",
				children: CORE_MODELS.map((model) => {
					const active = model.equity === equity;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSelect(model.equity),
						"aria-pressed": active,
						"aria-label": `${model.short} ${model.name}`,
						className: cn("flex h-11 items-center justify-center rounded-lg px-0.5 text-xs font-medium whitespace-nowrap tabular-nums transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.96]", active ? "bg-primary text-primary-foreground shadow-card" : "bg-secondary text-foreground hover:bg-accent"),
						children: model.short
					}, model.short);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixBar, {
				equity: selected.equity,
				fixed: selected.fixed
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-lg font-medium tracking-tight",
				children: [
					selected.short,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: selected.name
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: selected.blurb
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoreHoldings, {
				equity: selected.equity,
				weightedEr
			})
		]
	});
}
function MixBar({ equity, fixed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-3 overflow-hidden rounded-full bg-secondary",
			children: [equity > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-equity transition-[flex-basis] duration-200 ease-out",
				style: { flexBasis: `${equity}%` }
			}) : null, fixed > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-fixed transition-[flex-basis] duration-200 ease-out",
				style: { flexBasis: `${fixed}%` }
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between text-xs tabular-nums text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1.5 inline-block size-2 rounded-full bg-equity align-middle" }),
				equity,
				"% Equity"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1.5 inline-block size-2 rounded-full bg-fixed align-middle" }),
				fixed,
				"% Fixed income"
			] })]
		})]
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-11 min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-left text-sm text-foreground transition-[box-shadow,border-color] duration-150 focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-muted-foreground" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-96 min-w-32 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-float data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
		className: cn("p-1", position === "popper" && "w-(--radix-select-trigger-width)"),
		children
	})
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-pointer select-none items-start gap-2 rounded-md py-2.5 pr-8 pl-2 text-sm outline-none focus:bg-secondary data-disabled:pointer-events-none data-disabled:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex size-4 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex min-w-0 flex-1 flex-col",
			children
		})
	})]
}));
SelectItem.displayName = SelectItem$1.displayName;
function SatellitePanel({ satelliteOn, satelliteWeight, satelliteSplit, satelliteTheme, satelliteThemeB, onToggle, onWeight, onSplit, onTheme, onThemeB }) {
	const split = satelliteWeight === 20 && satelliteSplit;
	const themeA = satelliteTheme ? themeById(satelliteTheme) : null;
	const themeB = satelliteThemeB ? themeById(satelliteThemeB) : null;
	const sleevePct = split ? 10 : satelliteWeight ?? 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Optional overlay, held separate from the core model. Funded from the whole account — the core mix still applies only inside the remaining sleeve."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					label: "No satellite",
					hint: "Core is 100% of the account",
					active: !satelliteOn,
					onClick: () => onToggle(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					label: "Add satellite",
					hint: "10% or 20% overlay",
					active: satelliteOn,
					onClick: () => onToggle(true)
				})]
			}),
			satelliteOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: "Overlay weight"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: SATELLITE_WEIGHTS.map((weight) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								label: `${weight}% satellite`,
								hint: `Core sleeve ${100 - weight}%`,
								active: satelliteWeight === weight,
								onClick: () => onWeight(weight)
							}, weight))
						})]
					}),
					satelliteWeight === 20 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: "20% structure"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								label: "One 20% theme",
								hint: "Single satellite sleeve",
								active: !satelliteSplit,
								onClick: () => onSplit(false)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								label: "Two 10% themes",
								hint: "Split the overlay equally",
								active: satelliteSplit,
								onClick: () => onSplit(true)
							})]
						})]
					}) : null,
					satelliteWeight === 10 || satelliteWeight === 20 && !satelliteSplit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: "Pre-approved theme"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSelect, {
							value: satelliteTheme,
							onChange: onTheme,
							label: "Satellite theme",
							placeholder: "Select a satellite theme"
						})]
					}) : null,
					split ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSlot, {
							label: "First 10% sleeve",
							value: satelliteTheme,
							exclude: satelliteThemeB,
							onChange: onTheme,
							ariaLabel: "First 10% satellite theme",
							placeholder: "Select first theme"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSlot, {
							label: "Second 10% sleeve",
							value: satelliteThemeB,
							exclude: satelliteTheme,
							onChange: onThemeB,
							ariaLabel: "Second 10% satellite theme",
							placeholder: "Select second theme"
						})]
					}) : null,
					themeA ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemePreview, {
						theme: themeA,
						sleevePct
					}) : null,
					split && themeB ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemePreview, {
						theme: themeB,
						sleevePct: 10
					}) : null
				]
			}) : null
		]
	});
}
function ThemeSlot({ label, value, exclude, onChange, ariaLabel, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSelect, {
			value,
			exclude,
			onChange,
			label: ariaLabel,
			placeholder
		})]
	});
}
function ThemeSelect({ value, exclude, onChange, label, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: value ?? void 0,
		onValueChange: (v) => {
			if (isSatelliteThemeId(v)) onChange(v);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			"aria-label": label,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SATELLITE_THEMES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: item.id,
			textValue: item.name,
			disabled: item.id === exclude,
			children: item.name
		}, item.id)) })]
	});
}
function ThemePreview({ theme, sleevePct }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-secondary p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: theme.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: theme.summary
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col items-end gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [sleevePct, "% sleeve"] }), theme.minInvestment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "warn",
						children: [formatUsd(theme.minInvestment), " min"]
					}) : equalWeight(theme.holdings) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Equal weight" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: sleeveMixLabel(theme.holdings) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-col gap-3",
				children: clusterHoldings(theme.holdings).map((cluster) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [cluster.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: cluster.label
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: cluster.holdings.map((holding) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tabular-nums",
							children: holding.ticker
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-muted-foreground",
							children: holding.name
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 tabular-nums text-muted-foreground",
							children: [formatSleeveShare(holding.share), " of sleeve"]
						})]
					}, holding.ticker))
				})] }, cluster.label ?? "holdings"))
			}),
			theme.id === "alt-equity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-start gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 size-3.5 shrink-0" }),
					theme.holdings[0]?.name,
					" is not commingled with the core equity sleeve. The $100,000 minimum applies to this holding, not the whole account."
				]
			}) : null,
			theme.id === "crypto" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-start gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 size-3.5 shrink-0" }), "Crypto ETPs are held only in the satellite sleeve, separate from the Falcon Core equity mix."]
			}) : null,
			theme.id === "ai" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-start gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 size-3.5 shrink-0" }), "AI theme ETPs are held only in the satellite sleeve, separate from the Falcon Core equity mix."]
			}) : null,
			theme.id === "buffer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-start gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 size-3.5 shrink-0" }), "Defined-outcome ETFs are held only in the satellite sleeve, separate from the Falcon Core equity mix."]
			}) : null
		]
	});
}
function formatSleeveShare(share) {
	const pct = share * 100;
	if (Math.abs(pct - Math.round(pct)) < 1e-6) return `${Math.round(pct)}%`;
	return `${pct.toFixed(2)}%`;
}
function equalWeight(holdings) {
	if (holdings.length === 0) return false;
	const target = 1 / holdings.length;
	return holdings.every((holding) => Math.abs(holding.share - target) < 1e-6);
}
function sleeveMixLabel(holdings) {
	return holdings.map((holding) => formatSleeveShare(holding.share).replace("%", "")).join(" / ") + "%";
}
function clusterHoldings(holdings) {
	const clusters = [];
	for (const holding of holdings) {
		const label = holding.group ?? null;
		const last = clusters[clusters.length - 1];
		if (last && last.label === label) last.holdings.push(holding);
		else clusters.push({
			label,
			holdings: [holding]
		});
	}
	return clusters;
}
function Choice({ label, hint, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-pressed": active,
		className: cn("flex min-h-16 flex-col items-start justify-center rounded-lg px-4 py-3 text-left transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98]", active ? "bg-primary text-primary-foreground shadow-card" : "bg-secondary text-foreground hover:bg-accent"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("text-xs", active ? "text-primary-foreground/70" : "text-muted-foreground"),
			children: hint
		})]
	});
}
var rootRoute = getRouteApi("__root__");
function ModelPage() {
	const { advisorSession } = rootRoute.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvisorSessionGate, {
		ssrEmail: advisorSession?.email,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelApp, {})
	});
}
function emptyInput() {
	return {
		clientName: "",
		accountValue: 1e6,
		coreEquity: 60,
		satelliteOn: false,
		satelliteWeight: null,
		satelliteSplit: false,
		satelliteTheme: null,
		satelliteThemeB: null
	};
}
function ModelApp() {
	const { proposal: proposalId } = Route$1.useSearch();
	const navigate = useNavigate({ from: "/model" });
	const user = useCurrentUser();
	const advisorName = user?.displayName || user?.primaryEmail || "Advisor";
	const [clientName, setClientName] = (0, import_react.useState)("");
	const [accountValue, setAccountValue] = (0, import_react.useState)(1e6);
	const [coreEquity, setCoreEquity] = (0, import_react.useState)(60);
	const [satelliteOn, setSatelliteOn] = (0, import_react.useState)(false);
	const [satelliteWeight, setSatelliteWeight] = (0, import_react.useState)(null);
	const [satelliteSplit, setSatelliteSplit] = (0, import_react.useState)(false);
	const [satelliteTheme, setSatelliteTheme] = (0, import_react.useState)(null);
	const [satelliteThemeB, setSatelliteThemeB] = (0, import_react.useState)(null);
	const [diagnosticsOpen, setDiagnosticsOpen] = (0, import_react.useState)(false);
	const [savedId, setSavedId] = (0, import_react.useState)(proposalId ?? null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [shareMode, setShareMode] = (0, import_react.useState)(null);
	const [loaded, setLoaded] = (0, import_react.useState)(!proposalId);
	const loadedId = (0, import_react.useRef)(proposalId ?? null);
	const input = (0, import_react.useMemo)(() => ({
		clientName,
		accountValue,
		coreEquity,
		satelliteOn,
		satelliteWeight,
		satelliteSplit,
		satelliteTheme,
		satelliteThemeB
	}), [
		clientName,
		accountValue,
		coreEquity,
		satelliteOn,
		satelliteWeight,
		satelliteSplit,
		satelliteTheme,
		satelliteThemeB
	]);
	const allocation = (0, import_react.useMemo)(() => buildAllocation(input), [input]);
	const vision = (0, import_react.useMemo)(() => visionFundStatus(input), [input]);
	const diagnosticsReady = allocation.pendingMessage === null;
	const canSave = Boolean(clientName.trim()) && diagnosticsReady;
	(0, import_react.useEffect)(() => {
		if (!proposalId) {
			if (loadedId.current) {
				applyInput(emptyInput());
				setDiagnosticsOpen(false);
				setSavedId(null);
			}
			loadedId.current = null;
			setLoaded(true);
			return;
		}
		let cancelled = false;
		setLoaded(false);
		loadedId.current = proposalId;
		getProposal({ data: proposalId }).then((record) => {
			if (cancelled) return;
			applyInput(record.snapshot);
			setSavedId(record.id);
			setLoaded(true);
		}).catch(() => {
			if (cancelled) return;
			toast("That proposal could not be opened.");
			loadedId.current = null;
			setSavedId(null);
			setLoaded(true);
			navigate({
				search: {},
				replace: true
			});
		});
		return () => {
			cancelled = true;
		};
	}, [proposalId, navigate]);
	function applyInput(next) {
		setClientName(next.clientName);
		setAccountValue(next.accountValue);
		setCoreEquity(next.coreEquity);
		setSatelliteOn(next.satelliteOn);
		setSatelliteWeight(next.satelliteWeight);
		setSatelliteSplit(next.satelliteSplit);
		setSatelliteTheme(next.satelliteTheme);
		setSatelliteThemeB(next.satelliteThemeB);
	}
	function reset() {
		applyInput(emptyInput());
		setDiagnosticsOpen(false);
		setSavedId(null);
		navigate({ search: {} });
	}
	const closeDiagnostics = (0, import_react.useCallback)(() => setDiagnosticsOpen(false), []);
	function handleSatelliteToggle(on) {
		setSatelliteOn(on);
		if (!on) {
			setSatelliteWeight(null);
			setSatelliteSplit(false);
			setSatelliteTheme(null);
			setSatelliteThemeB(null);
		}
	}
	function handleSatelliteWeight(weight) {
		setSatelliteWeight(weight);
		if (weight === 10) {
			setSatelliteSplit(false);
			setSatelliteThemeB(null);
		}
	}
	function handleSatelliteSplit(split) {
		setSatelliteSplit(split);
		if (!split) setSatelliteThemeB(null);
	}
	function handleTheme(theme) {
		setSatelliteTheme(theme);
		if (theme && theme === satelliteThemeB) setSatelliteThemeB(null);
	}
	async function save() {
		if (saving) return;
		if (!canSave) {
			toast(clientName.trim() ? allocation.pendingMessage ?? "Finish the model first." : "Add a client name to save.");
			return;
		}
		setSaving(true);
		try {
			const row = await saveProposal({ data: {
				id: savedId,
				input
			} });
			loadedId.current = row.id;
			setSavedId(row.id);
			toast(`Saved under ${row.clientName}`);
			navigate({ search: { proposal: row.id } });
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		subtitle: savedId ? "Editing saved proposal" : "New proposal",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: reset,
				disabled: !loaded,
				children: "Reset"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PqDownloadButton, {
				clientName,
				advisorName,
				accountValue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				disabled: !diagnosticsReady || !loaded,
				title: diagnosticsReady ? "Export proposal" : allocation.pendingMessage ?? "Finish the model first.",
				onClick: () => setShareMode("export"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {}), "Export"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				disabled: !diagnosticsReady || !loaded,
				title: diagnosticsReady ? "Email proposal" : allocation.pendingMessage ?? "Finish the model first.",
				onClick: () => setShareMode("email"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {}), "Email"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosticsButton, {
				ready: diagnosticsReady && loaded,
				onClick: () => setDiagnosticsOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				disabled: !canSave || saving || !loaded,
				title: !clientName.trim() ? "Add a client name to save." : !diagnosticsReady ? allocation.pendingMessage ?? "Finish the model first." : void 0,
				onClick: () => void save(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), saving ? "Saving…" : savedId ? "Save changes" : "Save proposal"]
			})
		] }),
		children: [
			!loaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid min-w-0 max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-5 lg:items-stretch lg:py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "model-form flex min-w-0 flex-col gap-5 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Step 01"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Account" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Client name is required to save. Account value is used for dollar weights and the Falcon Vision Fund I minimum test." })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountFields, {
							clientName,
							accountValue,
							onClientName: setClientName,
							onAccountValue: setAccountValue
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Step 02 · Core model"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Select the core mix" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Strategic equity / fixed-income policy, in 5% steps from 100/0 to 0/100. Underlying fund weights are the Falcon Core Model." })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorePicker, {
							equity: coreEquity,
							onSelect: setCoreEquity
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Step 03 · Satellite"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Elect a satellite overlay" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "A separate sleeve, distinct from the core. If elected, choose 10% or 20%. A 20% overlay can be one theme or two 10% themes." })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SatellitePanel, {
							satelliteOn,
							satelliteWeight,
							satelliteSplit,
							satelliteTheme,
							satelliteThemeB,
							onToggle: handleSatelliteToggle,
							onWeight: handleSatelliteWeight,
							onSplit: handleSatelliteSplit,
							onTheme: handleTheme,
							onThemeB: setSatelliteThemeB
						}) })] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "flex min-w-0 flex-col lg:col-span-2 lg:h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-1 flex-col p-5 sm:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-4 text-sm text-muted-foreground",
							children: [clientName.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Prepared for",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: clientName.trim()
								})
							] }) : "Add a client name to save this proposal to your book.", advisorName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-xs",
								children: ["Advisor ", advisorName]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllocationPanel, {
							input,
							allocation,
							vision,
							diagnosticsReady,
							onDiagnostics: () => setDiagnosticsOpen(true)
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto max-w-6xl px-4 pb-10 text-xs leading-relaxed text-muted-foreground sm:px-6",
				children: "For advisor use only. Model policy weights are not a recommendation or an offer to sell securities. Saved proposals are visible only to the signed-in advisor. Core holdings follow the Falcon Core Model as of August 1, 2026."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosticsReport, {
				open: diagnosticsOpen,
				onClose: closeDiagnostics,
				input,
				allocation,
				vision,
				advisorName
			}),
			shareMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareDialog, {
				open: true,
				mode: shareMode,
				input,
				advisorName,
				allowPrint: true,
				onClose: () => setShareMode(null)
			}) : null
		]
	});
}
//#endregion
export { ModelPage as component };
