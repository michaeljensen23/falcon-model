import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proposal-snapshot-CVHrZq6Z.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
/** Preview bearers are short printable tokens. Ignore anything else so a stuffed header never reaches session lookup. */
function usableBearer(token) {
	if (typeof token !== "string" || token.length < 16 || token.length > 2048) return void 0;
	if (!/^[\x21-\x7e]+$/.test(token)) return void 0;
	return token;
}
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-a1vn1Gjj.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-9JqRFru2.mjs");
	const { requireUserId } = await import("./verify.server-C6xviJG0.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(usableBearer(context.bearerToken)) } });
});
var CORE_AS_OF = "August 1, 2026";
var EQUITY_STEPS = [
	100,
	95,
	90,
	85,
	80,
	75,
	70,
	65,
	60,
	55,
	50,
	45,
	40,
	35,
	30,
	25,
	20,
	15,
	10,
	5,
	0
];
/**
* Falcon Core Model holdings. Equity full weights are the 100/0 column;
* fixed-income full weights are the 0/100 column. Intermediate mixes scale
* each sleeve linearly, matching the 8.1.26 model sheet.
*/
var CORE_POSITIONS = [
	{
		ticker: "VGSH",
		name: "Vanguard Short-Term Treasury ETF",
		assetClass: "Short Government",
		kind: "fixed",
		expenseRatio: .03,
		fullWeight: 20
	},
	{
		ticker: "FBND",
		name: "Fidelity Total Bond ETF",
		assetClass: "Intermediate Core-Plus Bond",
		kind: "fixed",
		expenseRatio: .36,
		fullWeight: 25
	},
	{
		ticker: "PYLD",
		name: "PIMCO Multisector Bond Active ETF",
		assetClass: "Multisector Bond",
		kind: "fixed",
		expenseRatio: .7,
		fullWeight: 22.5
	},
	{
		ticker: "BINC",
		name: "iShares Flexible Income Active ETF",
		assetClass: "Multisector Bond",
		kind: "fixed",
		expenseRatio: .4,
		fullWeight: 22.5
	},
	{
		ticker: "FPE",
		name: "First Trust Preferred Securities & Income ETF",
		assetClass: "Preferred Stock",
		kind: "fixed",
		expenseRatio: .83,
		fullWeight: 10
	},
	{
		ticker: "AVEM",
		name: "Avantis Emerging Markets Equity ETF",
		assetClass: "Diversified Emerging Mkts",
		kind: "equity",
		expenseRatio: .33,
		fullWeight: 8.5
	},
	{
		ticker: "AVDV",
		name: "Avantis International Small Cap Value ETF",
		assetClass: "Foreign Small/Mid Value",
		kind: "equity",
		expenseRatio: .36,
		fullWeight: 3.4
	},
	{
		ticker: "DFIV",
		name: "Dimensional International Value ETF",
		assetClass: "Foreign Large Value",
		kind: "equity",
		expenseRatio: .27,
		fullWeight: 9
	},
	{
		ticker: "IHDG",
		name: "WisdomTree International Hedged Quality Dividend Growth Fund",
		assetClass: "Foreign Large Growth",
		kind: "equity",
		expenseRatio: .59,
		fullWeight: 7.1
	},
	{
		ticker: "VNQ",
		name: "Vanguard Real Estate ETF",
		assetClass: "Real Estate",
		kind: "equity",
		expenseRatio: .13,
		fullWeight: 6.1
	},
	{
		ticker: "QNDX",
		name: "SPDR Portfolio Nasdaq-100 ETF",
		assetClass: "Large Cap Growth",
		kind: "equity",
		expenseRatio: .1,
		fullWeight: 8.9
	},
	{
		ticker: "MGK",
		name: "Vanguard Mega Cap Growth ETF",
		assetClass: "Large Cap Growth",
		kind: "equity",
		expenseRatio: .05,
		fullWeight: 15.2
	},
	{
		ticker: "AVLV",
		name: "Avantis U.S. Large Cap Value ETF",
		assetClass: "Large Cap Value",
		kind: "equity",
		expenseRatio: .15,
		fullWeight: 27
	},
	{
		ticker: "IWP",
		name: "iShares Russell Mid-Cap Growth ETF",
		assetClass: "Mid Cap Growth",
		kind: "equity",
		expenseRatio: .23,
		fullWeight: 2.6
	},
	{
		ticker: "AVMV",
		name: "Avantis U.S. Mid Cap Value ETF",
		assetClass: "Mid Cap Value",
		kind: "equity",
		expenseRatio: .2,
		fullWeight: 4.2
	},
	{
		ticker: "IJT",
		name: "iShares S&P Small-Cap 600 Growth ETF",
		assetClass: "Small Cap Growth",
		kind: "equity",
		expenseRatio: .18,
		fullWeight: 3.9
	},
	{
		ticker: "AVUV",
		name: "Avantis U.S. Small Cap Value ETF",
		assetClass: "Small Cap Value",
		kind: "equity",
		expenseRatio: .25,
		fullWeight: 4.1
	}
];
function mixCopy(equity) {
	if (equity === 100) return {
		name: "All Equity",
		blurb: "Fully invested in the core equity sleeve. Highest growth orientation."
	};
	if (equity >= 90) return {
		name: "Aggressive Growth",
		blurb: "Equity-led with a modest ballast of core fixed income."
	};
	if (equity >= 75) return {
		name: "Growth",
		blurb: "Long-term growth with a defined fixed-income sleeve."
	};
	if (equity >= 65) return {
		name: "Growth & Income",
		blurb: "Growth-biased, with a meaningful income component."
	};
	if (equity >= 60) return {
		name: "Balanced Growth",
		blurb: "The classic balanced policy — growth with ballast."
	};
	if (equity >= 50) return {
		name: "Balanced",
		blurb: "Even split between the core equity and fixed-income sleeves."
	};
	if (equity >= 40) return {
		name: "Balanced Income",
		blurb: "Income-led, with a supporting equity sleeve."
	};
	if (equity >= 30) return {
		name: "Conservative Income",
		blurb: "Fixed-income led, with a measured equity allocation."
	};
	if (equity >= 20) return {
		name: "Income",
		blurb: "Primarily the core fixed-income sleeve, modest equity."
	};
	if (equity >= 10) return {
		name: "Conservative",
		blurb: "Capital-stability focus with a thin equity sleeve."
	};
	if (equity === 5) return {
		name: "Capital Preservation",
		blurb: "Almost entirely the core fixed-income sleeve."
	};
	return {
		name: "Capital Preservation",
		blurb: "Fully invested in the core fixed-income sleeve."
	};
}
var CORE_MODELS = EQUITY_STEPS.map((equity) => {
	const { name, blurb } = mixCopy(equity);
	return {
		equity,
		fixed: 100 - equity,
		short: `${equity}/${100 - equity}`,
		name,
		blurb
	};
});
function isEquityStep(value) {
	return EQUITY_STEPS.includes(value);
}
function coreByEquity(equity) {
	const model = CORE_MODELS.find((m) => m.equity === equity);
	if (!model) throw new Error(`Unknown core mix: ${equity}`);
	return model;
}
function corePositionsForMix(equity) {
	const eqScale = equity / 100;
	const fiScale = (100 - equity) / 100;
	return CORE_POSITIONS.map((position) => ({
		...position,
		coreWeight: position.kind === "equity" ? position.fullWeight * eqScale : position.fullWeight * fiScale
	})).filter((position) => position.coreWeight > 1e-9).sort((a, b) => b.coreWeight - a.coreWeight || a.ticker.localeCompare(b.ticker));
}
function coreWeightedExpenseRatio(equity) {
	const rows = corePositionsForMix(equity);
	const total = rows.reduce((sum, row) => sum + row.coreWeight, 0);
	if (total <= 0) return 0;
	return rows.reduce((sum, row) => sum + row.coreWeight * row.expenseRatio, 0) / total;
}
function positionsByKind(equity, kind) {
	return corePositionsForMix(equity).filter((row) => row.kind === kind);
}
var GICS = [
	"Technology",
	"Health Care",
	"Financials",
	"Consumer",
	"Industrials",
	"Energy",
	"Materials",
	"Utilities",
	"Communication",
	"Real Estate"
];
function eq(ticker, role, geo, size, style, sectors, rest) {
	return {
		ticker,
		role,
		us: geo[0],
		developed: geo[1],
		em: geo[2],
		large: size[0],
		mid: size[1],
		small: size[2],
		value: style[0],
		blend: style[1],
		growth: style[2],
		sectors,
		...rest
	};
}
function fi(ticker, role, rest) {
	return {
		ticker,
		role,
		us: rest.us ?? .85,
		developed: rest.developed ?? .12,
		em: rest.em ?? .03,
		large: 0,
		mid: 0,
		small: 0,
		value: 0,
		blend: 0,
		growth: 0,
		sectors: null,
		yieldPct: rest.yieldPct,
		durationYrs: rest.durationYrs,
		igShare: rest.igShare,
		volPct: rest.volPct,
		betaSpx: rest.betaSpx,
		maxDdPct: rest.maxDdPct,
		expenseRatio: rest.expenseRatio,
		liquidity: rest.liquidity,
		expectedReturn: rest.expectedReturn,
		quality: rest.quality
	};
}
var PROFILES = [
	fi("VGSH", "short-gov", {
		us: 1,
		developed: 0,
		em: 0,
		yieldPct: 4.2,
		durationYrs: 1.9,
		igShare: 1,
		volPct: 2.1,
		betaSpx: .02,
		maxDdPct: 3,
		expenseRatio: .03,
		liquidity: "daily",
		expectedReturn: 4.1,
		quality: .95
	}),
	fi("FBND", "core-bond", {
		yieldPct: 4.8,
		durationYrs: 5.8,
		igShare: .88,
		volPct: 6.2,
		betaSpx: .12,
		maxDdPct: 14,
		expenseRatio: .36,
		liquidity: "daily",
		expectedReturn: 4.7,
		quality: .72
	}),
	fi("PYLD", "credit", {
		yieldPct: 5.9,
		durationYrs: 4.4,
		igShare: .62,
		volPct: 6.8,
		betaSpx: .22,
		maxDdPct: 12,
		expenseRatio: .7,
		liquidity: "daily",
		expectedReturn: 5.6,
		quality: .55
	}),
	fi("BINC", "credit", {
		yieldPct: 5.6,
		durationYrs: 3.6,
		igShare: .7,
		volPct: 5.4,
		betaSpx: .18,
		maxDdPct: 10,
		expenseRatio: .4,
		liquidity: "daily",
		expectedReturn: 5.4,
		quality: .58
	}),
	fi("FPE", "preferred", {
		yieldPct: 6.3,
		durationYrs: 4.8,
		igShare: .45,
		volPct: 9.5,
		betaSpx: .42,
		maxDdPct: 18,
		expenseRatio: .83,
		liquidity: "daily",
		expectedReturn: 5.8,
		quality: .4
	}),
	eq("AVEM", "em-equity", [
		.02,
		.08,
		.9
	], [
		.62,
		.28,
		.1
	], [
		.45,
		.4,
		.15
	], [
		.22,
		.04,
		.22,
		.12,
		.08,
		.08,
		.08,
		.03,
		.1,
		.03
	], {
		yieldPct: 2.5,
		durationYrs: 0,
		igShare: 0,
		volPct: 18.5,
		betaSpx: .78,
		maxDdPct: 38,
		expenseRatio: .33,
		liquidity: "daily",
		expectedReturn: 8.4,
		quality: .48
	}),
	eq("AVDV", "intl-equity", [
		.02,
		.88,
		.1
	], [
		.08,
		.42,
		.5
	], [
		.78,
		.18,
		.04
	], [
		.08,
		.06,
		.18,
		.14,
		.24,
		.08,
		.1,
		.04,
		.04,
		.04
	], {
		yieldPct: 3.3,
		durationYrs: 0,
		igShare: 0,
		volPct: 17.2,
		betaSpx: .82,
		maxDdPct: 36,
		expenseRatio: .36,
		liquidity: "daily",
		expectedReturn: 8.1,
		quality: .52
	}),
	eq("DFIV", "intl-equity", [
		.02,
		.9,
		.08
	], [
		.78,
		.18,
		.04
	], [
		.82,
		.14,
		.04
	], [
		.06,
		.08,
		.28,
		.1,
		.16,
		.12,
		.08,
		.04,
		.04,
		.04
	], {
		yieldPct: 3.6,
		durationYrs: 0,
		igShare: 0,
		volPct: 16.4,
		betaSpx: .8,
		maxDdPct: 34,
		expenseRatio: .27,
		liquidity: "daily",
		expectedReturn: 8,
		quality: .55
	}),
	eq("IHDG", "intl-equity", [
		.04,
		.92,
		.04
	], [
		.82,
		.16,
		.02
	], [
		.08,
		.22,
		.7
	], [
		.16,
		.18,
		.08,
		.18,
		.16,
		.04,
		.06,
		.04,
		.08,
		.02
	], {
		yieldPct: 1.7,
		durationYrs: 0,
		igShare: 0,
		volPct: 13.8,
		betaSpx: .62,
		maxDdPct: 24,
		expenseRatio: .59,
		liquidity: "daily",
		expectedReturn: 7.4,
		quality: .82
	}),
	eq("VNQ", "real-estate", [
		.98,
		.02,
		0
	], [
		.7,
		.25,
		.05
	], [
		.2,
		.7,
		.1
	], [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	], {
		yieldPct: 3.9,
		durationYrs: 0,
		igShare: 0,
		volPct: 18.8,
		betaSpx: .86,
		maxDdPct: 42,
		expenseRatio: .13,
		liquidity: "daily",
		expectedReturn: 7.2,
		quality: .5
	}),
	eq("QNDX", "us-equity", [
		.97,
		.02,
		.01
	], [
		.94,
		.05,
		.01
	], [
		.02,
		.12,
		.86
	], [
		.52,
		.06,
		.04,
		.12,
		.04,
		.01,
		.01,
		.01,
		.18,
		.01
	], {
		yieldPct: .6,
		durationYrs: 0,
		igShare: 0,
		volPct: 20.4,
		betaSpx: 1.12,
		maxDdPct: 33,
		expenseRatio: .1,
		liquidity: "daily",
		expectedReturn: 8.8,
		quality: .7
	}),
	eq("MGK", "us-equity", [
		.98,
		.02,
		0
	], [
		.96,
		.04,
		0
	], [
		.02,
		.1,
		.88
	], [
		.44,
		.1,
		.06,
		.14,
		.04,
		.01,
		.01,
		.01,
		.18,
		.01
	], {
		yieldPct: .5,
		durationYrs: 0,
		igShare: 0,
		volPct: 19.6,
		betaSpx: 1.14,
		maxDdPct: 32,
		expenseRatio: .05,
		liquidity: "daily",
		expectedReturn: 8.7,
		quality: .74
	}),
	eq("AVLV", "us-equity", [
		.99,
		.01,
		0
	], [
		.92,
		.07,
		.01
	], [
		.82,
		.14,
		.04
	], [
		.08,
		.1,
		.22,
		.12,
		.16,
		.12,
		.06,
		.04,
		.06,
		.04
	], {
		yieldPct: 1.9,
		durationYrs: 0,
		igShare: 0,
		volPct: 16.2,
		betaSpx: .98,
		maxDdPct: 30,
		expenseRatio: .15,
		liquidity: "daily",
		expectedReturn: 8.5,
		quality: .62
	}),
	eq("IWP", "us-equity", [
		.98,
		.02,
		0
	], [
		.05,
		.9,
		.05
	], [
		.06,
		.18,
		.76
	], [
		.28,
		.14,
		.08,
		.16,
		.14,
		.04,
		.04,
		.02,
		.08,
		.02
	], {
		yieldPct: .7,
		durationYrs: 0,
		igShare: 0,
		volPct: 20.8,
		betaSpx: 1.08,
		maxDdPct: 36,
		expenseRatio: .23,
		liquidity: "daily",
		expectedReturn: 8.6,
		quality: .58
	}),
	eq("AVMV", "us-equity", [
		.99,
		.01,
		0
	], [
		.04,
		.9,
		.06
	], [
		.78,
		.16,
		.06
	], [
		.08,
		.08,
		.2,
		.14,
		.18,
		.1,
		.08,
		.04,
		.06,
		.04
	], {
		yieldPct: 1.6,
		durationYrs: 0,
		igShare: 0,
		volPct: 18.4,
		betaSpx: 1.02,
		maxDdPct: 34,
		expenseRatio: .2,
		liquidity: "daily",
		expectedReturn: 8.6,
		quality: .56
	}),
	eq("IJT", "us-equity", [
		.99,
		.01,
		0
	], [
		.02,
		.12,
		.86
	], [
		.08,
		.18,
		.74
	], [
		.18,
		.16,
		.1,
		.14,
		.16,
		.06,
		.06,
		.04,
		.06,
		.04
	], {
		yieldPct: .9,
		durationYrs: 0,
		igShare: 0,
		volPct: 21.2,
		betaSpx: 1.06,
		maxDdPct: 38,
		expenseRatio: .18,
		liquidity: "daily",
		expectedReturn: 8.7,
		quality: .54
	}),
	eq("AVUV", "us-equity", [
		.99,
		.01,
		0
	], [
		.02,
		.1,
		.88
	], [
		.84,
		.12,
		.04
	], [
		.08,
		.06,
		.22,
		.12,
		.18,
		.12,
		.08,
		.04,
		.06,
		.04
	], {
		yieldPct: 1.7,
		durationYrs: 0,
		igShare: 0,
		volPct: 22.4,
		betaSpx: 1.1,
		maxDdPct: 42,
		expenseRatio: .25,
		liquidity: "daily",
		expectedReturn: 8.9,
		quality: .5
	}),
	fi("PFLEX", "private-income", {
		us: .7,
		developed: .2,
		em: .1,
		yieldPct: 8.4,
		durationYrs: 2.8,
		igShare: .25,
		volPct: 8.2,
		betaSpx: .28,
		maxDdPct: 16,
		expenseRatio: 2.15,
		liquidity: "interval",
		expectedReturn: 7.8,
		quality: .35
	}),
	fi("REFLX", "private-income", {
		us: .85,
		developed: .12,
		em: .03,
		yieldPct: 7.9,
		durationYrs: 4.2,
		igShare: .4,
		volPct: 10.4,
		betaSpx: .35,
		maxDdPct: 22,
		expenseRatio: 2.05,
		liquidity: "interval",
		expectedReturn: 7.4,
		quality: .38
	}),
	fi("TPYTX", "private-income", {
		us: .78,
		developed: .14,
		em: .08,
		yieldPct: 7.6,
		durationYrs: 2.2,
		igShare: .3,
		volPct: 7.1,
		betaSpx: .22,
		maxDdPct: 14,
		expenseRatio: 1.55,
		liquidity: "interval",
		expectedReturn: 7.2,
		quality: .42
	}),
	eq("FVF-I", "private-equity", [
		.75,
		.2,
		.05
	], [
		.35,
		.45,
		.2
	], [
		.15,
		.35,
		.5
	], [
		.28,
		.12,
		.1,
		.12,
		.16,
		.06,
		.04,
		.02,
		.08,
		.02
	], {
		yieldPct: 0,
		durationYrs: 0,
		igShare: 0,
		volPct: 24,
		betaSpx: .7,
		maxDdPct: 28,
		expenseRatio: 1.75,
		liquidity: "illiquid",
		expectedReturn: 12.5,
		quality: .45
	}),
	eq("IBIT", "crypto", [
		1,
		0,
		0
	], [
		1,
		0,
		0
	], [
		0,
		.3,
		.7
	], null, {
		yieldPct: 0,
		durationYrs: 0,
		igShare: 0,
		volPct: 52,
		betaSpx: 1.35,
		maxDdPct: 72,
		expenseRatio: .25,
		liquidity: "daily",
		expectedReturn: 10,
		quality: .15
	}),
	eq("ETHA", "crypto", [
		1,
		0,
		0
	], [
		1,
		0,
		0
	], [
		0,
		.25,
		.75
	], null, {
		yieldPct: 0,
		durationYrs: 0,
		igShare: 0,
		volPct: 68,
		betaSpx: 1.55,
		maxDdPct: 80,
		expenseRatio: .25,
		liquidity: "daily",
		expectedReturn: 11,
		quality: .12
	}),
	eq("BSOL", "crypto", [
		1,
		0,
		0
	], [
		1,
		0,
		0
	], [
		0,
		.15,
		.85
	], null, {
		yieldPct: 0,
		durationYrs: 0,
		igShare: 0,
		volPct: 88,
		betaSpx: 1.7,
		maxDdPct: 90,
		expenseRatio: .2,
		liquidity: "daily",
		expectedReturn: 12,
		quality: .08
	}),
	eq("POW", "us-equity", [
		.55,
		.4,
		.05
	], [
		.7,
		.25,
		.05
	], [
		.1,
		.35,
		.55
	], [
		.08,
		.02,
		.04,
		.04,
		.48,
		.1,
		.06,
		.16,
		.02,
		0
	], {
		yieldPct: .9,
		durationYrs: 0,
		igShare: 0,
		volPct: 22.5,
		betaSpx: 1.15,
		maxDdPct: 36,
		expenseRatio: .75,
		liquidity: "daily",
		expectedReturn: 9.4,
		quality: .48
	}),
	eq("GRID", "us-equity", [
		.48,
		.46,
		.06
	], [
		.72,
		.24,
		.04
	], [
		.12,
		.4,
		.48
	], [
		.12,
		.02,
		.04,
		.04,
		.5,
		.06,
		.06,
		.14,
		.02,
		0
	], {
		yieldPct: 1.1,
		durationYrs: 0,
		igShare: 0,
		volPct: 20.8,
		betaSpx: 1.08,
		maxDdPct: 34,
		expenseRatio: .57,
		liquidity: "daily",
		expectedReturn: 8.9,
		quality: .52
	}),
	eq("ARTY", "us-equity", [
		.64,
		.22,
		.14
	], [
		.82,
		.14,
		.04
	], [
		.04,
		.12,
		.84
	], [
		.78,
		.02,
		.02,
		.04,
		.08,
		.01,
		.01,
		.02,
		.02,
		0
	], {
		yieldPct: .1,
		durationYrs: 0,
		igShare: 0,
		volPct: 28.4,
		betaSpx: 1.32,
		maxDdPct: 44,
		expenseRatio: .47,
		liquidity: "daily",
		expectedReturn: 10.2,
		quality: .5
	}),
	eq("BAI", "us-equity", [
		.7,
		.2,
		.1
	], [
		.84,
		.12,
		.04
	], [
		.06,
		.16,
		.78
	], [
		.7,
		.04,
		.04,
		.04,
		.1,
		.02,
		.02,
		.02,
		.02,
		0
	], {
		yieldPct: .05,
		durationYrs: 0,
		igShare: 0,
		volPct: 26.8,
		betaSpx: 1.28,
		maxDdPct: 42,
		expenseRatio: .55,
		liquidity: "daily",
		expectedReturn: 10,
		quality: .52
	}),
	eq("AIS", "us-equity", [
		.58,
		.28,
		.14
	], [
		.78,
		.16,
		.06
	], [
		.08,
		.22,
		.7
	], [
		.52,
		.02,
		.04,
		.04,
		.22,
		.04,
		.04,
		.06,
		.02,
		0
	], {
		yieldPct: .2,
		durationYrs: 0,
		igShare: 0,
		volPct: 30.1,
		betaSpx: 1.38,
		maxDdPct: 46,
		expenseRatio: .75,
		liquidity: "daily",
		expectedReturn: 10.6,
		quality: .46
	}),
	eq("BUFR", "defined-outcome", [
		.98,
		.02,
		0
	], [
		.95,
		.04,
		.01
	], [
		.15,
		.7,
		.15
	], [
		.28,
		.12,
		.12,
		.12,
		.1,
		.04,
		.03,
		.03,
		.14,
		.02
	], {
		yieldPct: .4,
		durationYrs: 0,
		igShare: 0,
		volPct: 9.4,
		betaSpx: .48,
		maxDdPct: 12,
		expenseRatio: .95,
		liquidity: "daily",
		expectedReturn: 6.8,
		quality: .6
	}),
	fi("ACYN", "defined-outcome", {
		us: .95,
		developed: .05,
		em: 0,
		yieldPct: 10.4,
		durationYrs: 1.4,
		igShare: .7,
		volPct: 12.6,
		betaSpx: .55,
		maxDdPct: 18,
		expenseRatio: .75,
		liquidity: "daily",
		expectedReturn: 7.6,
		quality: .32
	})
];
var BY_TICKER = new Map(PROFILES.map((p) => [p.ticker, p]));
var FALLBACK = fi("UNKNOWN", "core-bond", {
	yieldPct: 4,
	durationYrs: 4,
	igShare: .8,
	volPct: 8,
	betaSpx: .4,
	maxDdPct: 16,
	expenseRatio: .4,
	liquidity: "daily",
	expectedReturn: 6,
	quality: .5
});
function fundProfile(ticker) {
	return BY_TICKER.get(ticker) ?? {
		...FALLBACK,
		ticker
	};
}
var ROLE_LABEL = {
	"us-equity": "U.S. Equity",
	"intl-equity": "Int'l Developed Equity",
	"em-equity": "Emerging Markets",
	"real-estate": "Real Estate",
	"short-gov": "Short Government",
	"core-bond": "Core / Core-Plus Bond",
	"credit": "Multisector / Credit",
	preferred: "Preferreds",
	"private-income": "Private Income",
	"private-equity": "Private Equity",
	crypto: "Digital Assets",
	"defined-outcome": "Defined Outcome"
};
var ROLE_COLOR = {
	"us-equity": "var(--color-equity)",
	"intl-equity": "var(--color-ok)",
	"em-equity": "var(--color-sat-ai)",
	"real-estate": "var(--color-sat-buffer)",
	"short-gov": "var(--color-fixed)",
	"core-bond": "var(--color-fixed)",
	credit: "var(--color-sat-income)",
	preferred: "var(--color-warn)",
	"private-income": "var(--color-sat-income)",
	"private-equity": "var(--color-sat-equity)",
	crypto: "var(--color-sat-crypto)",
	"defined-outcome": "var(--color-sat-buffer)"
};
var SATELLITE_WEIGHTS = [10, 20];
var VISION_FUND_MIN = 1e5;
var VISION_FUND_NAME = "Falcon Vision Fund I";
var SATELLITE_THEMES = [
	{
		id: "alt-income",
		name: "Private Income",
		summary: "Three pre-approved income funds, held equal-weight inside the satellite sleeve.",
		minInvestment: null,
		holdings: [
			{
				ticker: "PFLEX",
				name: "PIMCO Flexible Credit Income Fund",
				share: 1 / 3
			},
			{
				ticker: "REFLX",
				name: "PIMCO Flexible Real Estate Income Fund",
				share: 1 / 3
			},
			{
				ticker: "TPYTX",
				name: "TCW Private Asset Income Fund Class I",
				share: 1 / 3
			}
		]
	},
	{
		id: "alt-equity",
		name: "Private Equity",
		summary: `${VISION_FUND_NAME} — private equity with a separate $100,000 fund minimum.`,
		minInvestment: VISION_FUND_MIN,
		holdings: [{
			ticker: "FVF-I",
			name: VISION_FUND_NAME,
			share: 1
		}]
	},
	{
		id: "crypto",
		name: "Crypto",
		summary: "Spot crypto ETPs inside the satellite sleeve: 60% Bitcoin, 30% Ethereum, 10% Solana.",
		minInvestment: null,
		holdings: [
			{
				ticker: "IBIT",
				name: "iShares Bitcoin Trust ETF",
				share: .6
			},
			{
				ticker: "ETHA",
				name: "iShares Ethereum Trust ETF",
				share: .3
			},
			{
				ticker: "BSOL",
				name: "Bitwise Solana Staking ETF",
				share: .1
			}
		]
	},
	{
		id: "ai",
		name: "Artificial Intelligence",
		summary: "Equal-weight AI theme: energy and power grid, chips and compute, and AI factory infrastructure.",
		minInvestment: null,
		holdings: [
			{
				ticker: "POW",
				name: "VistaShares Electrification Supercycle ETF",
				share: .2,
				group: "Energy & Power Grid"
			},
			{
				ticker: "GRID",
				name: "First Trust NASDAQ Clean Edge Smart Grid Infrastructure ETF",
				share: .2,
				group: "Energy & Power Grid"
			},
			{
				ticker: "ARTY",
				name: "iShares Future AI & Tech ETF",
				share: .2,
				group: "Chips & Compute"
			},
			{
				ticker: "BAI",
				name: "iShares A.I. Innovation and Tech Active ETF",
				share: .2,
				group: "Chips & Compute"
			},
			{
				ticker: "AIS",
				name: "VistaShares Artificial Intelligence Supercycle ETF",
				share: .2,
				group: "Infrastructure & AI Factory"
			}
		]
	},
	{
		id: "buffer",
		name: "Buffered Equity + Income ETFs",
		summary: "Equal-weight defined-outcome sleeve: laddered buffer equity and laddered autocallable barrier income.",
		minInvestment: null,
		holdings: [{
			ticker: "BUFR",
			name: "FT Vest Laddered Buffer ETF",
			share: .5
		}, {
			ticker: "ACYN",
			name: "FT Vest Laddered Autocallable Barrier & Income ETF",
			share: .5
		}]
	}
];
function themeById(id) {
	const theme = SATELLITE_THEMES.find((t) => t.id === id);
	if (!theme) throw new Error(`Unknown satellite theme: ${id}`);
	return theme;
}
function isSatelliteSplit(input) {
	return input.satelliteWeight === 20 && input.satelliteSplit;
}
function isSatelliteComplete(input) {
	if (!input.satelliteOn || input.satelliteWeight === null) return false;
	if (isSatelliteSplit(input)) return input.satelliteTheme !== null && input.satelliteThemeB !== null && input.satelliteTheme !== input.satelliteThemeB;
	return input.satelliteTheme !== null;
}
function satelliteSleeves(input) {
	if (!input.satelliteOn || input.satelliteWeight === null) return [];
	if (isSatelliteSplit(input)) {
		const sleeves = [];
		if (input.satelliteTheme) sleeves.push({
			theme: themeById(input.satelliteTheme),
			weight: 10
		});
		if (input.satelliteThemeB && input.satelliteThemeB !== input.satelliteTheme) sleeves.push({
			theme: themeById(input.satelliteThemeB),
			weight: 10
		});
		return sleeves;
	}
	if (input.satelliteTheme) return [{
		theme: themeById(input.satelliteTheme),
		weight: input.satelliteWeight
	}];
	return [];
}
function satellitePendingMessage(input) {
	if (!input.satelliteOn || isSatelliteComplete(input)) return null;
	if (input.satelliteWeight === null) return "Select a 10% or 20% satellite overlay.";
	if (isSatelliteSplit(input)) {
		if (input.satelliteTheme === null && input.satelliteThemeB === null) return "Select two different 10% satellite themes.";
		if (input.satelliteTheme === null) return "Select the first 10% satellite theme.";
		if (input.satelliteThemeB === null) return "Select the second 10% satellite theme.";
		return "Choose two different satellite themes.";
	}
	return "Select a pre-approved satellite theme.";
}
var PCT_DECIMALS = 2;
function roundPercents(raw) {
	const factor = 10 ** PCT_DECIMALS;
	const scaled = raw.map((n) => n * factor);
	const floors = scaled.map((n) => Math.floor(n + 1e-9));
	let leftover = Math.round(raw.reduce((a, b) => a + b, 0) * factor) - floors.reduce((a, b) => a + b, 0);
	const order = scaled.map((n, i) => ({
		i,
		frac: n - Math.floor(n + 1e-9)
	})).sort((a, b) => b.frac - a.frac);
	const out = [...floors];
	if (leftover > 0 && order.length > 0) for (let k = 0; leftover > 0; k++) {
		const slot = order[k % order.length];
		if (!slot) break;
		out[slot.i] += 1;
		leftover -= 1;
	}
	else if (leftover < 0) {
		const reverse = [...order].reverse();
		for (let k = 0; leftover < 0 && k < reverse.length; k++) {
			const slot = reverse[k];
			if (slot && out[slot.i] > 0) {
				out[slot.i] -= 1;
				leftover += 1;
			}
		}
	}
	return out.map((n) => n / factor);
}
function buildAllocation(input) {
	const core = coreByEquity(input.coreEquity);
	const satReady = isSatelliteComplete(input);
	const pendingMessage = satellitePendingMessage(input);
	const sleevesActive = satReady ? satelliteSleeves(input) : [];
	const satelliteSleevePct = sleevesActive.reduce((sum, sleeve) => sum + sleeve.weight, 0);
	const coreSleevePct = 100 - satelliteSleevePct;
	const coreScale = coreSleevePct / 100;
	const drafts = [];
	for (const position of corePositionsForMix(core.equity)) drafts.push({
		id: `core-${position.ticker}`,
		sleeve: "Core",
		name: position.name,
		ticker: position.ticker,
		assetClass: position.assetClass,
		group: null,
		kind: position.kind,
		coreWeight: position.coreWeight,
		expenseRatio: position.expenseRatio,
		raw: position.coreWeight * coreScale
	});
	if (satReady) for (const sleeve of sleevesActive) {
		const kind = sleeve.theme.id;
		for (const holding of sleeve.theme.holdings) drafts.push({
			id: `sat-${sleeve.theme.id}-${holding.ticker}`,
			sleeve: "Satellite",
			name: holding.name,
			ticker: holding.ticker,
			assetClass: holding.group ?? sleeve.theme.name,
			group: holding.group ?? null,
			kind,
			coreWeight: null,
			expenseRatio: fundProfile(holding.ticker).expenseRatio,
			raw: sleeve.weight * holding.share
		});
	}
	const rounded = roundPercents(drafts.map((d) => d.raw));
	const lines = drafts.map((d, i) => ({
		id: d.id,
		sleeve: d.sleeve,
		name: d.name,
		ticker: d.ticker,
		assetClass: d.assetClass,
		group: d.group,
		kind: d.kind,
		coreWeight: d.coreWeight,
		expenseRatio: d.expenseRatio,
		weight: rounded[i] ?? 0
	})).filter((l) => l.weight > 0);
	const groups = [
		{
			key: "equity",
			label: "Core Equity",
			kind: "equity",
			coreSleeveWeight: core.equity
		},
		{
			key: "fixed",
			label: "Core Fixed Income",
			kind: "fixed",
			coreSleeveWeight: core.fixed
		},
		{
			key: "alt-income",
			label: "Satellite · Private Income",
			kind: "alt-income",
			coreSleeveWeight: null
		},
		{
			key: "alt-equity",
			label: `Satellite · Private Equity`,
			kind: "alt-equity",
			coreSleeveWeight: null
		},
		{
			key: "crypto",
			label: "Satellite · Crypto",
			kind: "crypto",
			coreSleeveWeight: null
		},
		{
			key: "ai",
			label: "Satellite · Artificial Intelligence",
			kind: "ai",
			coreSleeveWeight: null
		},
		{
			key: "buffer",
			label: "Satellite · Buffered Equity + Income ETFs",
			kind: "buffer",
			coreSleeveWeight: null
		}
	].map((spec) => {
		const glines = lines.filter((line) => line.kind === spec.kind).sort((a, b) => b.weight - a.weight || (b.coreWeight ?? 0) - (a.coreWeight ?? 0) || a.ticker.localeCompare(b.ticker));
		return {
			...spec,
			lines: glines,
			weight: glines.reduce((sum, line) => sum + line.weight, 0)
		};
	}).filter((group) => group.lines.length > 0);
	const sleeveRaw = groups.map((group) => ({
		key: group.key,
		label: sleeveLabel(group.kind),
		weight: group.weight,
		kind: group.kind
	}));
	const policyCode = satReady ? `CS-${core.short.replace("/", "")}-${sleevesActive.map((sleeve) => `S${sleeve.weight}-${themeCode(sleeve.theme.id)}`).join("-")}` : `C-${core.short.replace("/", "")}`;
	const policyTitle = satReady ? `${core.short} ${core.name} · ${sleevesActive.map((sleeve) => `${sleeve.weight}% ${sleeve.theme.name}`).join(" + ")}` : `${core.short} ${core.name}`;
	const weightSum = lines.reduce((sum, line) => sum + line.weight, 0);
	const portfolioWeightedEr = weightSum > 0 ? lines.reduce((sum, line) => sum + line.weight * (line.expenseRatio ?? 0), 0) / weightSum : 0;
	return {
		core,
		satelliteComplete: satReady,
		pendingMessage,
		coreSleevePct,
		satelliteSleevePct,
		lines,
		groups,
		sleeves: sleeveRaw,
		coreWeightedEr: coreWeightedExpenseRatio(core.equity),
		portfolioWeightedEr,
		policyCode,
		policyTitle
	};
}
function visionFundStatus(input) {
	const requiredAt10 = VISION_FUND_MIN / .1;
	const requiredAt20 = VISION_FUND_MIN / .2;
	const peSleeve = satelliteSleeves(input).find((sleeve) => sleeve.theme.id === "alt-equity");
	const applies = peSleeve !== void 0;
	const sleevePct = peSleeve?.weight ?? null;
	if (!applies || sleevePct === null) return {
		applies: false,
		ok: null,
		satelliteDollars: null,
		shortfall: null,
		requiredAccount: null,
		requiredAt10,
		requiredAt20,
		sleevePct: null
	};
	const weight = sleevePct / 100;
	const requiredAccount = VISION_FUND_MIN / weight;
	if (input.accountValue === null) return {
		applies: true,
		ok: null,
		satelliteDollars: null,
		shortfall: null,
		requiredAccount,
		requiredAt10,
		requiredAt20,
		sleevePct
	};
	const satelliteDollars = input.accountValue * weight;
	const ok = satelliteDollars + 1e-6 >= VISION_FUND_MIN;
	return {
		applies: true,
		ok,
		satelliteDollars,
		shortfall: ok ? 0 : VISION_FUND_MIN - satelliteDollars,
		requiredAccount,
		requiredAt10,
		requiredAt20,
		sleevePct
	};
}
function formatUsd(value, digits = 0) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	}).format(value);
}
function formatPct(value) {
	return `${value.toFixed(PCT_DECIMALS)}%`;
}
function formatEr(value) {
	return `${value.toFixed(2)}%`;
}
function parseMoney(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const cleaned = trimmed.replace(/[$,\s]/g, "");
	if (!/^(?:\d+|\d*\.\d+)$/.test(cleaned)) return null;
	const n = Number(cleaned);
	if (!Number.isFinite(n) || n < 0 || n > 0xe8d4a51000) return null;
	return n;
}
function sleeveColor(kind) {
	switch (kind) {
		case "equity": return "var(--color-equity)";
		case "fixed": return "var(--color-fixed)";
		case "alt-income": return "var(--color-sat-income)";
		case "alt-equity": return "var(--color-sat-equity)";
		case "crypto": return "var(--color-sat-crypto)";
		case "ai": return "var(--color-sat-ai)";
		case "buffer": return "var(--color-sat-buffer)";
	}
}
function sleeveLabel(kind) {
	switch (kind) {
		case "equity": return "Core Equity";
		case "fixed": return "Core Fixed Income";
		case "alt-income": return "Private Income";
		case "alt-equity": return "Private Equity";
		case "crypto": return "Crypto";
		case "ai": return "Artificial Intelligence";
		case "buffer": return "Buffered Equity + Income";
	}
}
function themeCode(id) {
	switch (id) {
		case "alt-income": return "PI";
		case "alt-equity": return "AE";
		case "crypto": return "CR";
		case "ai": return "AIA";
		case "buffer": return "BEI";
	}
}
function isSatelliteThemeId(value) {
	return SATELLITE_THEMES.some((theme) => theme.id === value);
}
function allocationCopy(input, allocation) {
	const date = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric"
	}).format(/* @__PURE__ */ new Date());
	const client = input.clientName.trim() || "—";
	const aum = input.accountValue === null ? "—" : formatUsd(input.accountValue);
	const lines = [
		"Falcon Core–Satellite Portfolio Model",
		`Date: ${date}`,
		`Core model as of: ${CORE_AS_OF}`,
		`Client: ${client}`,
		`Account value: ${aum}`,
		"",
		`Policy: ${allocation.policyTitle}`,
		`Code: ${allocation.policyCode}`,
		`Core model: ${allocation.core.short} ${allocation.core.name} (equity/fixed)`,
		`Core weighted expense ratio: ${formatEr(allocation.coreWeightedEr)}`,
		`Account weighted expense ratio: ${formatEr(allocation.portfolioWeightedEr)}`,
		allocation.satelliteComplete ? `Satellite: ${allocation.satelliteSleevePct}% overlay — ${satelliteSleeves(input).map((sleeve) => `${sleeve.weight}% ${sleeve.theme.name}`).join(" + ")}` : "Satellite: none (core only)",
		""
	];
	for (const group of allocation.groups) {
		lines.push(`${group.label}    ${formatPct(group.weight)}${group.coreSleeveWeight !== null ? `    (${group.coreSleeveWeight}% of core)` : ""}`);
		for (const line of group.lines) {
			const dollars = input.accountValue === null ? "" : `    ${formatUsd(line.weight / 100 * input.accountValue)}`;
			const model = line.coreWeight === null ? "" : `    model ${formatPct(line.coreWeight)}`;
			lines.push(`  ${line.ticker.padEnd(8)} ${formatPct(line.weight).padStart(7)}${model}${dollars}    ${line.name}`);
		}
		lines.push("");
	}
	const vision = visionFundStatus(input);
	if (vision.applies) {
		lines.push(`${VISION_FUND_NAME} minimum: ${formatUsd(VISION_FUND_MIN)} in the satellite sleeve.`);
		if (vision.ok === false && vision.shortfall !== null) lines.push(`WARNING: Satellite sleeve is ${formatUsd(vision.satelliteDollars ?? 0)} — shortfall ${formatUsd(vision.shortfall)}. Required account value at this overlay: ${formatUsd(vision.requiredAccount ?? 0)}.`);
		else if (vision.ok === true) lines.push("Minimum is funded at the current account value.");
		lines.push("");
	}
	lines.push("For advisor use only. Model policy weights, not a recommendation or an offer to sell securities.");
	return lines.join("\n");
}
var WEIGHTS = SATELLITE_WEIGHTS;
var MAX_SNAPSHOT_CHARS = 32768;
function isSatelliteWeight(value) {
	return typeof value === "number" && WEIGHTS.includes(value);
}
function parseProposalSnapshot(raw) {
	let data = raw;
	if (typeof raw === "string") {
		if (raw.length > MAX_SNAPSHOT_CHARS) throw new Error("Invalid proposal snapshot.");
		try {
			data = JSON.parse(raw);
		} catch {
			throw new Error("Invalid proposal snapshot.");
		}
	}
	if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid proposal snapshot.");
	try {
		if (JSON.stringify(data).length > MAX_SNAPSHOT_CHARS) throw new Error("Invalid proposal snapshot.");
	} catch (err) {
		if (err instanceof Error && err.message === "Invalid proposal snapshot.") throw err;
		throw new Error("Invalid proposal snapshot.");
	}
	const row = data;
	if (typeof row.clientName !== "string" || row.clientName.length > 144) throw new Error("Invalid client name.");
	const clientName = row.clientName.replace(/[\u0000-\u001f\u007f]/g, "").trim();
	if (clientName.length > 80) throw new Error("Invalid client name.");
	let accountValue = null;
	if (row.accountValue !== null && row.accountValue !== void 0) {
		if (typeof row.accountValue !== "number" || !Number.isFinite(row.accountValue)) throw new Error("Invalid account value.");
		if (row.accountValue < 0 || row.accountValue > 0xe8d4a51000) throw new Error("Invalid account value.");
		accountValue = row.accountValue;
	}
	if (typeof row.coreEquity !== "number" || !isEquityStep(row.coreEquity)) throw new Error("Invalid core mix.");
	if (typeof row.satelliteOn !== "boolean") throw new Error("Invalid satellite flag.");
	const satelliteWeight = row.satelliteWeight;
	if (satelliteWeight !== null && !isSatelliteWeight(satelliteWeight)) throw new Error("Invalid satellite weight.");
	if (typeof row.satelliteSplit !== "boolean") throw new Error("Invalid satellite split.");
	const theme = parseTheme(row.satelliteTheme);
	const themeB = parseTheme(row.satelliteThemeB);
	const satelliteOn = row.satelliteOn;
	const split = satelliteOn && satelliteWeight === 20 && row.satelliteSplit;
	if (split && theme && themeB && theme === themeB) throw new Error("Invalid satellite theme.");
	return {
		clientName,
		accountValue,
		coreEquity: row.coreEquity,
		satelliteOn,
		satelliteWeight: satelliteOn ? satelliteWeight : null,
		satelliteSplit: split,
		satelliteTheme: satelliteOn ? theme : null,
		satelliteThemeB: split ? themeB : null
	};
}
function parseTheme(value) {
	if (value === null || value === void 0) return null;
	if (typeof value !== "string" || !isSatelliteThemeId(value)) throw new Error("Invalid satellite theme.");
	return value;
}
function serializeProposalSnapshot(input) {
	return JSON.stringify({
		clientName: input.clientName,
		accountValue: input.accountValue,
		coreEquity: input.coreEquity,
		satelliteOn: input.satelliteOn,
		satelliteWeight: input.satelliteWeight,
		satelliteSplit: input.satelliteSplit,
		satelliteTheme: input.satelliteTheme,
		satelliteThemeB: input.satelliteThemeB
	});
}
//#endregion
export { parseProposalSnapshot as C, themeById as D, sleeveColor as E, visionFundStatus as O, parseMoney as S, serializeProposalSnapshot as T, formatUsd as _, ROLE_LABEL as a, isSatelliteComplete as b, VISION_FUND_MIN as c, authMiddleware as d, buildAllocation as f, formatPct as g, formatEr as h, ROLE_COLOR as i, VISION_FUND_NAME as l, coreWeightedExpenseRatio as m, CORE_MODELS as n, SATELLITE_THEMES as o, coreByEquity as p, GICS as r, SATELLITE_WEIGHTS as s, CORE_AS_OF as t, allocationCopy as u, fundProfile as v, positionsByKind as w, isSatelliteThemeId as x, isEquityStep as y };
