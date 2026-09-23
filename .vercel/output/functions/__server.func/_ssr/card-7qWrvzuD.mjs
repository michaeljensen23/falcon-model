import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as redirectToLoginIfRequired, n as isLoginRequired, r as isSafeLoginUrl, t as isConnectorPending } from "./login-BMvIVoys.mjs";
import { C as parseProposalSnapshot, _ as formatUsd, d as authMiddleware, f as buildAllocation } from "./proposal-snapshot-CVHrZq6Z.mjs";
import { a as Printer, f as ClipboardList, s as Mail, t as X, u as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as createSsrRpc, i as cn } from "./router-CvKedwBr.mjs";
import { i as FalconMark, n as Button, o as UserButton } from "./button-lR7jphil.mjs";
import { A as proposalCsv, C as dateLabel, D as isEmailAddress, N as proposalFileStem, O as loadCalibriFonts, T as downloadTextFile, a as INK, b as buildProposalEml, d as PAPER, f as PdfDoc, i as GOLD, j as proposalEmailBody, o as MUTED, p as RULE, r as CREAM, s as NAVY, w as downloadBytes, x as buildProposalPdf, y as assemblePdf } from "./proposal-pdf-CzQs0ZB-.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-7qWrvzuD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MESSAGE_RULES = [
	{
		needles: ["not_connected", "failed_precondition"],
		kind: "not_connected",
		message: "Connect this connector in Grok to load your data."
	},
	{
		needles: ["scope_denied"],
		kind: "scope_denied",
		message: "This view isn't available — the app requested a tool outside its grant."
	},
	{
		needles: ["access_denied"],
		kind: "access_denied",
		message: "You don't have access to this data."
	}
];
function matchMessageRule(raw) {
	return MESSAGE_RULES.find((rule) => rule.needles.some((needle) => raw.includes(needle)));
}
function classifyCallToolError(result) {
	if (result.ok) return null;
	const detail = result.errorMessage || void 0;
	const raw = (result.errorMessage ?? "").toLowerCase();
	if (isConnectorPending(result)) return {
		kind: "pending",
		message: "Connecting to your data…",
		detail
	};
	if (raw.includes("missing_connector_token")) return {
		kind: "error",
		message: "Open this app from Grok to load your data.",
		detail
	};
	if (isLoginRequired(result)) return {
		kind: "login",
		message: "Continue with Grok to load your data.",
		detail
	};
	const rule = matchMessageRule(raw);
	if (rule) return {
		kind: rule.kind,
		message: rule.message,
		detail
	};
	return {
		kind: "error",
		message: detail ?? "Something went wrong. Try again.",
		detail
	};
}
function AppShell({ children, actions, subtitle = "Advisor use · Core–satellite policy" }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? "" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "app-shell relative min-h-dvh bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border/80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FalconMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-medium tracking-tight",
							children: "Falcon Wealth"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: subtitle
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "no-print flex flex-wrap items-center gap-2",
						children: [actions, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "no-print flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavChip, {
						to: "/",
						label: "Dashboard",
						active: pathname === "/"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavChip, {
						to: "/model",
						search: {},
						label: "New proposal",
						active: pathname.startsWith("/model") && !searchStr.includes("proposal=")
					})]
				})]
			})
		}), children]
	});
}
function NavChip({ to, label, active, search }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		"aria-current": active ? "page" : void 0,
		className: cn("inline-flex h-9 min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"),
		children: label
	});
}
var DISCOVERY_SECTIONS = [
	{
		n: 1,
		title: "Household & contact",
		purpose: "Who we are planning for, and how to reach you.",
		fields: [
			{
				kind: "prompt",
				text: "Client 1"
			},
			{
				kind: "pair",
				left: "Legal name",
				right: "Preferred name"
			},
			{
				kind: "triple",
				a: "Date of birth",
				b: "Citizenship",
				c: "Marital status"
			},
			{
				kind: "pair",
				left: "Mobile",
				right: "Email"
			},
			{
				kind: "prompt",
				text: "Client 2 (spouse / partner)"
			},
			{
				kind: "pair",
				left: "Legal name",
				right: "Preferred name"
			},
			{
				kind: "triple",
				a: "Date of birth",
				b: "Citizenship",
				c: "Marital status"
			},
			{
				kind: "pair",
				left: "Mobile",
				right: "Email"
			},
			{
				kind: "line",
				label: "Home address"
			},
			{
				kind: "line",
				label: "Mailing address (if different)"
			},
			{
				kind: "line",
				label: "How did you hear about Falcon?"
			}
		]
	},
	{
		n: 2,
		title: "Family, dependents & key relationships",
		purpose: "The people whose lives sit on this balance sheet.",
		fields: [
			{
				kind: "yesno",
				label: "Do you have children?"
			},
			{
				kind: "prompt",
				text: "Children / dependents (name, date of birth, dependent for tax?, school or city)"
			},
			{
				kind: "note",
				label: "1.",
				lines: 1
			},
			{
				kind: "note",
				label: "2.",
				lines: 1
			},
			{
				kind: "note",
				label: "3.",
				lines: 1
			},
			{
				kind: "note",
				label: "4.",
				lines: 1
			},
			{
				kind: "yesno",
				label: "Parents or others you support financially?"
			},
			{
				kind: "line",
				label: "If yes, who and in what way?"
			},
			{
				kind: "line",
				label: "Anyone else who should be in the planning conversation?"
			}
		]
	},
	{
		n: 3,
		title: "Employment, business & career",
		purpose: "Where income is earned, and how long that is expected to last.",
		fields: [
			{
				kind: "prompt",
				text: "Client 1"
			},
			{
				kind: "pair",
				left: "Employer / business",
				right: "Title"
			},
			{
				kind: "triple",
				a: "W-2 / 1099 / owner",
				b: "Years in role",
				c: "Expected work horizon"
			},
			{
				kind: "prompt",
				text: "Client 2"
			},
			{
				kind: "pair",
				left: "Employer / business",
				right: "Title"
			},
			{
				kind: "triple",
				a: "W-2 / 1099 / owner",
				b: "Years in role",
				c: "Expected work horizon"
			},
			{
				kind: "yesno",
				label: "Business ownership (S-corp, partnership, LLC, C-corp)?"
			},
			{
				kind: "pair",
				left: "Entity name / type",
				right: "Ownership %"
			},
			{
				kind: "checks",
				label: "Deferred compensation on the table",
				options: [
					"RSUs / options",
					"ESPP",
					"NQSOs / ISOs",
					"Deferred bonus",
					"Pension credits",
					"None"
				]
			},
			{
				kind: "line",
				label: "Notes on career change, sale, or succession"
			}
		]
	},
	{
		n: 4,
		title: "Income sources",
		purpose: "What lands each year, before we talk about how it is invested.",
		fields: [
			{
				kind: "pair",
				left: "W-2 wages (household)",
				right: "Bonus / variable (typical)"
			},
			{
				kind: "pair",
				left: "K-1 / business income",
				right: "Rental / royalty"
			},
			{
				kind: "pair",
				left: "Social Security (now or expected)",
				right: "Pension / annuity"
			},
			{
				kind: "pair",
				left: "Investment income (taxable)",
				right: "Other"
			},
			{
				kind: "line",
				label: "Approximate household income (last year)"
			},
			{
				kind: "line",
				label: "Expected change in the next 12-24 months"
			},
			{
				kind: "yesno",
				label: "Any income you would rather not depend on?"
			}
		]
	},
	{
		n: 5,
		title: "Expenses, savings rate & cash flow",
		purpose: "What the household actually spends, and what is left to put to work.",
		fields: [
			{
				kind: "pair",
				left: "Essential monthly living costs",
				right: "Discretionary monthly"
			},
			{
				kind: "pair",
				left: "Housing (PITI or rent)",
				right: "Debt service (ex-mortgage)"
			},
			{
				kind: "pair",
				left: "Current savings rate (approx.)",
				right: "Emergency fund (months)"
			},
			{
				kind: "checks",
				label: "Cash-flow posture today",
				options: [
					"Surplus most months",
					"Break-even",
					"Drawing savings",
					"Uneven / seasonal"
				]
			},
			{
				kind: "line",
				label: "Large known outflows in the next 24 months"
			},
			{
				kind: "note",
				label: "Anything about spending that a statement will not show",
				lines: 2
			}
		]
	},
	{
		n: 6,
		title: "Assets & investment accounts",
		purpose: "The inventory. Approximate values are enough for discovery; statements come later.",
		fields: [
			{
				kind: "pair",
				left: "Bank / cash / money market",
				right: "Taxable brokerage"
			},
			{
				kind: "pair",
				left: "Traditional IRA / rollover",
				right: "Roth IRA"
			},
			{
				kind: "pair",
				left: "401(k) / 403(b) / 457",
				right: "HSA"
			},
			{
				kind: "pair",
				left: "529 / UTMA",
				right: "Annuities (if any)"
			},
			{
				kind: "pair",
				left: "Primary residence (est. equity)",
				right: "Other real estate"
			},
			{
				kind: "pair",
				left: "Business value (est.)",
				right: "Private / alternatives"
			},
			{
				kind: "line",
				label: "Approximate household net worth"
			},
			{
				kind: "pair",
				left: "Primary custodian today",
				right: "Cost basis records in hand?"
			},
			{
				kind: "note",
				label: "Concentrated positions, stock from work, or accounts we should not move",
				lines: 2
			}
		]
	},
	{
		n: 7,
		title: "Liabilities, credit & guarantees",
		purpose: "What is owed, at what rate, and who else is on the hook.",
		fields: [
			{
				kind: "triple",
				a: "Mortgage balance / rate",
				b: "HELOC",
				c: "Years remaining"
			},
			{
				kind: "triple",
				a: "Student loans",
				b: "Auto / other",
				c: "Business debt"
			},
			{
				kind: "pair",
				left: "Margin / securities-backed line",
				right: "Credit cards (if revolving)"
			},
			{
				kind: "yesno",
				label: "Are you a cosigner or guarantor for anyone?"
			},
			{
				kind: "line",
				label: "If yes, for whom and how much?"
			},
			{
				kind: "checks",
				label: "Credit quality (self-assessed)",
				options: [
					"Excellent",
					"Good",
					"Fair",
					"Rebuilding",
					"Unsure"
				]
			},
			{
				kind: "line",
				label: "Any liability you want gone first, and why"
			}
		]
	},
	{
		n: 8,
		title: "Retirement picture",
		purpose: "When work optional becomes the plan, and what that year is supposed to feel like.",
		fields: [
			{
				kind: "pair",
				left: "Target retirement year / age",
				right: "Part-time or full stop?"
			},
			{
				kind: "line",
				label: "What does a good retirement week look like?"
			},
			{
				kind: "pair",
				left: "Income needed in retirement (today's $)",
				right: "Must-have vs nice-to-have"
			},
			{
				kind: "pair",
				left: "Social Security claiming idea",
				right: "Pension start / survivor option"
			},
			{
				kind: "yesno",
				label: "Healthcare bridge needed before Medicare?"
			},
			{
				kind: "line",
				label: "Places you want to live; family you want nearby"
			},
			{
				kind: "note",
				label: "What would make retirement feel like a failure?",
				lines: 2
			}
		]
	},
	{
		n: 9,
		title: "Tax picture",
		purpose: "Falcon plans around tax first. Rough numbers beat perfect ones that never arrive.",
		fields: [
			{
				kind: "triple",
				a: "Filing status",
				b: "State of residence",
				c: "Other state exposure"
			},
			{
				kind: "pair",
				left: "Last-year AGI (approx.)",
				right: "Taxable income (approx.)"
			},
			{
				kind: "checks",
				label: "How tax is paid",
				options: [
					"W-2 withholding",
					"Quarterly estimates",
					"Both",
					"Unsure"
				]
			},
			{
				kind: "checks",
				label: "Returns in the mix",
				options: [
					"1040",
					"1120-S",
					"1065",
					"1120",
					"Estate / trust",
					"Unsure"
				]
			},
			{
				kind: "yesno",
				label: "Carryforwards (capital loss, NOL, charitable, credit)?"
			},
			{
				kind: "checks",
				label: "Items on the table this year",
				options: [
					"Roth conversion",
					"Backdoor Roth",
					"Mega backdoor",
					"Harvesting",
					"Bunching gifts",
					"Opportunity zone / 1031",
					"None / unsure"
				]
			},
			{
				kind: "pair",
				left: "Current CPA / tax preparer",
				right: "May we coordinate?"
			},
			{
				kind: "note",
				label: "Recent surprises, audits, or taxes you want never to repeat",
				lines: 2
			}
		]
	},
	{
		n: 10,
		title: "Insurance & protection",
		purpose: "What is already covering a bad day, and what is missing.",
		fields: [
			{
				kind: "pair",
				left: "Life insurance (type / death benefit)",
				right: "Owner / beneficiary"
			},
			{
				kind: "pair",
				left: "Disability (own-occ? benefit / term)",
				right: "Long-term care"
			},
			{
				kind: "pair",
				left: "Umbrella liability",
				right: "Health / Medicare / supplement"
			},
			{
				kind: "pair",
				left: "Home / auto (adequate?)",
				right: "Business / key-person / buy-sell"
			},
			{
				kind: "yesno",
				label: "Any policy you suspect is misplaced, stale, or too expensive?"
			},
			{
				kind: "line",
				label: "Who is the insurance agent / broker, if any?"
			},
			{
				kind: "note",
				label: "What financial disaster do you most want this plan to survive?",
				lines: 2
			}
		]
	},
	{
		n: 11,
		title: "Estate, beneficiaries & legacy",
		purpose: "Who is in charge if you are not, and what you want left behind.",
		fields: [
			{
				kind: "checks",
				label: "Documents in force",
				options: [
					"Will",
					"Revocable trust",
					"POA (financial)",
					"Healthcare directive",
					"HIPAA release",
					"None / unsure"
				]
			},
			{
				kind: "pair",
				left: "Year last reviewed",
				right: "Attorney (if any)"
			},
			{
				kind: "yesno",
				label: "Are account beneficiaries aligned with the documents?"
			},
			{
				kind: "line",
				label: "Executor / trustee / healthcare agent"
			},
			{
				kind: "yesno",
				label: "Charitable intent (now or at death)?"
			},
			{
				kind: "line",
				label: "If yes, which organizations or what share?"
			},
			{
				kind: "yesno",
				label: "Special-needs, spendthrift, or blended-family issues?"
			},
			{
				kind: "note",
				label: "What do you want your family to say you planned well?",
				lines: 2
			}
		]
	},
	{
		n: 12,
		title: "Education, family support & major goals",
		purpose: "The jobs this money has besides 'be invested.'",
		fields: [
			{
				kind: "prompt",
				text: "Name the three outcomes that would make this engagement a success."
			},
			{
				kind: "note",
				label: "1.",
				lines: 1
			},
			{
				kind: "note",
				label: "2.",
				lines: 1
			},
			{
				kind: "note",
				label: "3.",
				lines: 1
			},
			{
				kind: "pair",
				left: "Education funding (who / when / how)",
				right: "529 or other vehicle"
			},
			{
				kind: "pair",
				left: "Home, second home, or relocate",
				right: "Horizon / budget"
			},
			{
				kind: "pair",
				left: "Gifting to family (annual / lifetime)",
				right: "Other large goal"
			},
			{
				kind: "line",
				label: "A goal you have not told other advisors"
			}
		]
	},
	{
		n: 13,
		title: "Investment experience, risk & values",
		purpose: "How you have lived through markets, and what you will not live with.",
		fields: [
			{
				kind: "checks",
				label: "Experience managing investments",
				options: [
					"None",
					"Some",
					"Comfortable",
					"Hands-on / professional"
				]
			},
			{
				kind: "line",
				label: "Worst decline you have lived through, and what you did"
			},
			{
				kind: "pair",
				left: "Peak-to-trough you could sleep through",
				right: "Cash needed in the next 3 years"
			},
			{
				kind: "checks",
				label: "Satellites / themes of interest",
				options: [
					"None",
					"Private income",
					"Private equity",
					"Crypto",
					"AI",
					"Buffered equity + income"
				]
			},
			{
				kind: "yesno",
				label: "ESG, religious, or other restrictions?"
			},
			{
				kind: "line",
				label: "If yes, spell them out"
			},
			{
				kind: "yesno",
				label: "Concentrated stock you are unwilling (or unable) to sell?"
			},
			{
				kind: "note",
				label: "What does 'too risky' mean in your household?",
				lines: 2
			}
		]
	},
	{
		n: 14,
		title: "Other advisors, documents & next steps",
		purpose: "Who else is on the team, and what to bring so the next meeting is useful.",
		fields: [
			{
				kind: "pair",
				left: "CPA / tax preparer",
				right: "May we speak with them?"
			},
			{
				kind: "pair",
				left: "Estate attorney",
				right: "Insurance agent"
			},
			{
				kind: "pair",
				left: "Other advisor / coach",
				right: "Why this search, why now?"
			},
			{
				kind: "checks",
				label: "Please gather (copies are fine)",
				options: [
					"Last two tax returns",
					"Account statements",
					"Social Security estimates",
					"Pay stubs / K-1s",
					"Insurance illustrations",
					"Estate docs",
					"Entity operating agreement",
					"Stock-plan statements"
				]
			},
			{
				kind: "checks",
				label: "Preferred cadence after onboarding",
				options: [
					"Quarterly",
					"Twice a year",
					"Annual + as needed",
					"Unsure"
				]
			},
			{
				kind: "note",
				label: "Anything else we should know before we design the plan",
				lines: 3
			}
		]
	}
];
function discoveryFileStem(clientName) {
	return `Falcon-PQ-Discovery-Facts-${clientName.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "client"}`.slice(0, 80);
}
var ACCENT = [
	.22,
	.33,
	.27
];
async function buildDiscoveryPdf(input) {
	return buildDiscoveryPdfWithFonts(input, await loadCalibriFonts());
}
function buildDiscoveryPdfWithFonts(input, fonts) {
	const doc = new PdfDoc("FALCON DISCOVERY FACTS  ·  PLANNING QUESTIONNAIRE");
	doc.useCalibri(fonts.regular.widths, fonts.bold.widths);
	const client = input.clientName.trim() || "Client household";
	const advisor = input.advisorName.trim() || "Falcon advisor";
	drawCover(doc, {
		client,
		advisor,
		date: dateLabel(),
		aum: input.accountValue === null ? "To be discussed" : formatUsd(input.accountValue)
	});
	doc.addPage(true);
	drawHowTo(doc);
	for (const section of DISCOVERY_SECTIONS) drawSection(doc, section);
	drawClose(doc, advisor);
	return assemblePdf(doc, {
		title: `Falcon PQ Discovery Facts - ${client}`,
		footerLeft: "Confidential  ·  Falcon Wealth Planning  ·  Planning Questionnaire"
	}, fonts);
}
function C() {
	return "C";
}
function CB() {
	return "CB";
}
function drawCover(doc, meta) {
	doc.fillRect(0, 0, 612, 792, PAPER);
	doc.fillRect(0, 784, 612, 8, NAVY);
	doc.fillRect(0, 782, 612, 2.2, GOLD);
	doc.fillRect(0, 0, 612, 8, NAVY);
	doc.y = 720;
	doc.falconMark(48, doc.y - 28, 36);
	doc.text("FALCON WEALTH", 96, doc.y - 6, 11, CB(), MUTED);
	doc.text("Advisor discovery packet", 96, doc.y - 22, 10, C(), MUTED);
	doc.y -= 64;
	doc.line(48, doc.y, 564, doc.y, INK, 1.1);
	doc.y -= 36;
	doc.text("DISCOVERY FACTS", 48, doc.y, 11, CB(), ACCENT);
	doc.y -= 28;
	for (const line of doc.wrapText("Planning Questionnaire", 28, doc.contentWidth, CB())) {
		doc.text(line, 48, doc.y, 28, CB());
		doc.y -= 32;
	}
	doc.y -= 4;
	doc.text("Fourteen sections. One household. The facts behind the plan.", 48, doc.y, 11, C(), MUTED);
	doc.y -= 28;
	const cardH = 92;
	const y = doc.y - cardH;
	doc.fillRect(48, y, doc.contentWidth, cardH, CREAM);
	doc.fillRect(48, y, 4, cardH, ACCENT);
	metaPair(doc, 64, y + 64, "Prepared for", doc.fitText(meta.client, 13, 240, CB()), 13);
	metaPair(doc, 328, y + 64, "Date", meta.date, 11);
	metaPair(doc, 64, y + 28, "Advisor", doc.fitText(meta.advisor, 11, 240, C()), 11);
	metaPair(doc, 328, y + 28, "Account under discussion", meta.aum, 11);
	doc.y = y - 28;
	doc.text("CONFIDENTIAL  ·  FOR THE ADVISORY RELATIONSHIP", 48, doc.y, 8, CB(), MUTED);
	doc.y -= 16;
	for (const line of doc.wrapText("Complete what you can before we meet. Skip what does not apply. Approximate figures are better than blanks. Bring the documents in section 14 so the next conversation can be about design, not scavenger hunt.", 10, doc.contentWidth, C())) {
		doc.text(line, 48, doc.y, 10, C());
		doc.y -= 13;
	}
	doc.y -= 18;
	doc.text("THE FOURTEEN SECTIONS", 48, doc.y, 8, CB(), MUTED);
	doc.y -= 10;
	doc.line(48, doc.y, 564, doc.y, RULE, .6);
	doc.y -= 16;
	drawToc(doc, false);
	doc.y -= 10;
	const stepH = 58;
	doc.ensure(66);
	const stepY = doc.y - stepH;
	const stepW = (doc.contentWidth - 16) / 3;
	[
		["01", "Complete and return this packet."],
		["02", "We design the core-satellite mix."],
		["03", "Proposal, diagnostics, then implement."]
	].forEach((step, i) => {
		const x = 48 + i * (stepW + 8);
		doc.fillRect(x, stepY, stepW, stepH, CREAM);
		doc.text(step[0], x + 10, stepY + 38, 10, CB(), ACCENT);
		let ty = stepY + 22;
		for (const line of doc.wrapText(step[1], 8, stepW - 20, C()).slice(0, 2)) {
			doc.text(line, x + 10, ty, 8, C());
			ty -= 11;
		}
	});
	doc.y = stepY - 16;
	doc.y = 56;
	doc.text("Falcon Portfolio Model  ·  Core-satellite policy  ·  Advisor use only", 48, doc.y, 8, C(), MUTED);
}
function metaPair(doc, x, y, label, value, size) {
	doc.text(label.toUpperCase(), x, y + 14, 7, CB(), MUTED);
	doc.text(value, x, y, size, size >= 13 ? CB() : C());
}
function drawHowTo(doc) {
	heading(doc, "How to complete this packet", "Read once, then fill");
	for (const point of [
		"Print clearly or type into the PDF. One packet per household; use Client 1 / Client 2 lines.",
		"Circle or tick boxes. If a question is not relevant, strike it and keep moving.",
		"Tax, estate, and account values can be ranges. We will reconcile to statements.",
		"This is a discovery record for Falcon advisors. It is not an account application, IPS, or a solicitation."
	]) {
		doc.ensure(28);
		const lines = doc.wrapText(point, 10, doc.contentWidth - 14, C());
		doc.fillRect(48, doc.y - 2, 3.5, 3.5, ACCENT);
		let y = doc.y;
		for (const line of lines) {
			doc.text(line, 60, y, 10, C());
			y -= 13;
		}
		doc.y = y - 6;
	}
	doc.y -= 8;
}
function drawToc(doc, withHeading) {
	if (withHeading) heading(doc, "The fourteen sections", "Contents");
	const colW = (doc.contentWidth - 16) / 2;
	const mid = DISCOVERY_SECTIONS.length / 2;
	const left = DISCOVERY_SECTIONS.slice(0, mid);
	const right = DISCOVERY_SECTIONS.slice(mid);
	const rowH = 18;
	const rows = Math.max(left.length, right.length);
	doc.ensure(rows * rowH + 8);
	const top = doc.y;
	left.forEach((s, i) => tocRow(doc, 48, top - i * rowH, colW, s));
	right.forEach((s, i) => tocRow(doc, 48 + colW + 16, top - i * rowH, colW, s));
	doc.y = top - rows * rowH - 12;
}
function tocRow(doc, x, y, w, section) {
	const num = String(section.n).padStart(2, "0");
	doc.text(num, x, y, 9, CB(), ACCENT);
	const title = doc.fitText(section.title, 10, w - 24, C());
	doc.text(title, x + 22, y, 10, C());
}
function heading(doc, title, kicker) {
	doc.ensure(36);
	doc.text(kicker.toUpperCase(), 48, doc.y, 8, CB(), MUTED);
	doc.y -= 14;
	doc.text(title, 48, doc.y, 14, CB());
	doc.y -= 8;
	doc.line(48, doc.y, 564, doc.y, INK, .9);
	doc.y -= 14;
}
function drawSection(doc, section) {
	const purposeLines = doc.wrapText(section.purpose, 9, doc.contentWidth - 56, C());
	const headH = 28 + purposeLines.length * 11;
	doc.ensure(headH + 88);
	const barH = 22;
	const barY = doc.y - barH + 6;
	doc.fillRect(48, barY, doc.contentWidth, barH, INK);
	const num = String(section.n).padStart(2, "0");
	doc.text(num, 56, barY + 7, 10, CB(), PAPER);
	doc.text(section.title.toUpperCase(), 84, barY + 7, 10, CB(), PAPER);
	doc.y = barY - 12;
	for (const line of purposeLines) {
		doc.text(line, 48, doc.y, 9, C(), MUTED);
		doc.y -= 11;
	}
	doc.y -= 6;
	for (const field of section.fields) drawField(doc, field);
	doc.y -= 8;
}
function drawField(doc, field) {
	const width = doc.contentWidth;
	switch (field.kind) {
		case "prompt": {
			const lines = doc.wrapText(field.text, 9, width, CB());
			doc.ensure(lines.length * 12 + 6);
			for (const line of lines) {
				doc.text(line, 48, doc.y, 9, CB(), ACCENT);
				doc.y -= 12;
			}
			doc.y -= 2;
			return;
		}
		case "line":
			underline(doc, 48, width, field.label);
			return;
		case "pair": {
			const gap = 14;
			const col = (width - gap) / 2;
			doc.ensure(32);
			const y = doc.y;
			underlineAt(doc, 48, y, col, field.left);
			underlineAt(doc, 48 + col + gap, y, col, field.right);
			doc.y = y - 26;
			return;
		}
		case "triple": {
			const gap = 12;
			const col = (width - 24) / 3;
			doc.ensure(32);
			const y = doc.y;
			underlineAt(doc, 48, y, col, field.a);
			underlineAt(doc, 48 + col + gap, y, col, field.b);
			underlineAt(doc, 48 + (col + gap) * 2, y, col, field.c);
			doc.y = y - 26;
			return;
		}
		case "yesno": {
			doc.ensure(20);
			const boxX = 472;
			doc.text(doc.fitText(field.label, 9, 416, C()), 48, doc.y, 9, C());
			checkbox(doc, boxX, doc.y, "Yes");
			checkbox(doc, 518, doc.y, "No");
			doc.y -= 18;
			return;
		}
		case "checks": {
			const labelLines = doc.wrapText(field.label, 9, width, C());
			const optRows = Math.ceil(field.options.length / 3);
			doc.ensure(labelLines.length * 12 + optRows * 16 + 8);
			for (const line of labelLines) {
				doc.text(line, 48, doc.y, 9, C());
				doc.y -= 12;
			}
			const colW = width / 3;
			field.options.forEach((opt, i) => {
				const col = i % 3;
				const row = Math.floor(i / 3);
				checkbox(doc, 48 + col * colW, doc.y - row * 16, opt);
			});
			doc.y -= optRows * 16 + 4;
			return;
		}
		case "note": {
			const lines = field.lines ?? 2;
			doc.ensure(14 + lines * 16);
			if (field.label) {
				doc.text(field.label, 48, doc.y, 9, C(), MUTED);
				doc.y -= 12;
			}
			for (let i = 0; i < lines; i++) {
				doc.line(48, doc.y, 564, doc.y, RULE, .45);
				doc.y -= 16;
			}
			return;
		}
	}
}
function underline(doc, x, w, label) {
	doc.ensure(32);
	underlineAt(doc, x, doc.y, w, label);
	doc.y -= 26;
}
function underlineAt(doc, x, y, w, label) {
	doc.text(label, x, y, 8, C(), MUTED);
	doc.line(x, y - 14, x + w, y - 14, RULE, .45);
}
function checkbox(doc, x, y, label) {
	doc.strokeRect(x, y - 1, 8, 8, INK, .6);
	const clipped = doc.fitText(label, 8, 110, C());
	doc.text(clipped, x + 12, y, 8, C());
}
function drawClose(doc, advisor) {
	doc.ensure(70);
	doc.line(48, doc.y, 564, doc.y, INK, .8);
	doc.y -= 16;
	doc.text("Acknowledgement", 48, doc.y, 12, CB());
	doc.y -= 14;
	for (const line of doc.wrapText("The information in this packet is given so Falcon can understand the household and prepare advice. It is confidential. Figures are estimates until confirmed. Signing below does not open an account or commit you to a portfolio.", 9, doc.contentWidth, C())) {
		doc.text(line, 48, doc.y, 9, C(), MUTED);
		doc.y -= 12;
	}
	doc.y -= 10;
	const gap = 16;
	const col = (doc.contentWidth - gap) / 2;
	const y = doc.y;
	underlineAt(doc, 48, y, col, "Client 1 signature / date");
	underlineAt(doc, 48 + col + gap, y, col, "Client 2 signature / date");
	doc.y = y - 28;
	underlineAt(doc, 48, doc.y, col, `Advisor (${advisor})`);
	underlineAt(doc, 48 + col + gap, doc.y, col, "Meeting date");
	doc.y -= 24;
}
function PqDownloadButton({ clientName = "", advisorName = "", accountValue = null }) {
	const [building, setBuilding] = (0, import_react.useState)(false);
	async function download() {
		if (building) return;
		setBuilding(true);
		try {
			const bytes = await buildDiscoveryPdf({
				clientName,
				advisorName,
				accountValue
			});
			downloadBytes(`${discoveryFileStem(clientName)}.pdf`, bytes, "application/pdf");
			toast("PQ downloaded");
		} catch {
			toast("Could not build the discovery PDF.");
		} finally {
			setBuilding(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		size: "sm",
		onClick: () => void download(),
		disabled: building,
		title: "Download the 14-section discovery facts questionnaire",
		"aria-label": "PQ Download",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, {}), building ? "Building…" : "PQ Download"]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 text-base text-foreground shadow-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium tracking-wide text-muted-foreground uppercase", className),
	...props
}));
Label.displayName = Root.displayName;
var sendProposalEmail = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((payload) => {
	if (!payload || typeof payload !== "object") throw new Error("Invalid email.");
	const body = payload;
	const to = typeof body.to === "string" ? body.to.trim() : "";
	if (!isEmailAddress(to)) throw new Error("Enter a valid email address.");
	return {
		to,
		input: parseProposalSnapshot(body.input)
	};
}).handler(createSsrRpc("05ae0d40a3cb54bd75b323743f94c2544672af619503c93a786af9f430cfd1da"));
function ShareDialog({ open, mode, onClose, input, advisorName, allowPrint }) {
	const closeRef = (0, import_react.useRef)(null);
	const onCloseRef = (0, import_react.useRef)(onClose);
	const buildingRef = (0, import_react.useRef)(false);
	const [to, setTo] = (0, import_react.useState)("");
	const [building, setBuilding] = (0, import_react.useState)(false);
	onCloseRef.current = onClose;
	buildingRef.current = building;
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const last = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const id = window.requestAnimationFrame(() => closeRef.current?.focus());
		const onKey = (e) => {
			if (e.key === "Escape" && !buildingRef.current) onCloseRef.current();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.cancelAnimationFrame(id);
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
			last?.focus?.();
		};
	}, [open]);
	if (!open) return null;
	const allocation = buildAllocation(input);
	const csv = proposalCsv(input, allocation);
	const stem = proposalFileStem(input.clientName, allocation.policyCode);
	const client = input.clientName.trim() || "the household";
	const pdfName = `${stem}.pdf`;
	const csvName = `${stem}.csv`;
	const mailOk = isEmailAddress(to);
	function downloadCsv() {
		downloadTextFile(csvName, csv, "text/csv");
		toast("Holdings CSV downloaded");
	}
	async function downloadPdf() {
		if (building) return;
		setBuilding(true);
		try {
			const bytes = buildProposalPdf(input, allocation, advisorName);
			downloadBytes(pdfName, bytes, "application/pdf");
			toast("Proposal PDF downloaded");
		} catch {
			toast("Could not build the PDF.");
		} finally {
			setBuilding(false);
		}
	}
	function attachLocally(pdfBytes) {
		const eml = buildProposalEml({
			to: to.trim(),
			clientName: client,
			pdfName,
			csvName,
			pdfBytes,
			csvText: csv
		});
		downloadTextFile(`${stem}.eml`, eml, "message/rfc822");
	}
	async function sendEmail() {
		if (!mailOk || building) return;
		setBuilding(true);
		try {
			const result = await sendProposalEmail({ data: {
				to: to.trim(),
				input
			} });
			if (result.ok) {
				toast("Email sent with the PDF and CSV attached");
				onClose();
				return;
			}
			if (result.loginRequired && isSafeLoginUrl(result.loginUrl)) redirectToLoginIfRequired({
				ok: false,
				data: null,
				loginRequired: true,
				loginUrl: result.loginUrl
			});
			attachLocally(buildProposalPdf(input, allocation, advisorName));
			const classified = classifyCallToolError({
				ok: false,
				data: null,
				loginRequired: result.loginRequired,
				pending: result.pending,
				errorMessage: result.errorMessage
			});
			toast(classified?.kind === "login" || classified?.kind === "pending" ? "Connect Gmail to send from this app. A message with both attachments was downloaded." : "A message with the PDF and CSV attached was downloaded — open it to send.");
		} catch (err) {
			try {
				attachLocally(buildProposalPdf(input, allocation, advisorName));
			} catch {}
			toast(err instanceof Error ? err.message : "Could not email the proposal.");
		} finally {
			setBuilding(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "no-print fixed inset-0 z-[70] overflow-y-auto bg-foreground/40",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "share-title",
		onClick: building ? void 0 : onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex min-h-dvh max-w-lg items-start px-4 py-10 sm:px-6",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full rounded-xl bg-card p-5 shadow-float sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: mode === "email" ? "Email proposal" : "Export proposal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "share-title",
								className: "font-display text-2xl font-medium tracking-tight",
								children: client
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: allocation.policyTitle
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							ref: closeRef,
							variant: "ghost",
							size: "icon",
							onClick: onClose,
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})]
					}),
					mode === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "proposal-to",
									children: "Send to"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "proposal-to",
									type: "email",
									autoComplete: "off",
									placeholder: "client@email.com",
									value: to,
									onChange: (e) => setTo(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap rounded-lg bg-secondary px-3 py-2.5 text-sm text-foreground",
								children: proposalEmailBody()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-muted-foreground",
								children: "The email attaches both the proposal PDF and the holdings CSV."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "Download a print-ready Letter PDF, or the look-through holdings as CSV."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-2",
						children: [
							mode === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								disabled: !mailOk || building,
								onClick: () => void sendEmail(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {}), building ? "Sending…" : "Send email"]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: mode === "email" ? "secondary" : "default",
								disabled: building,
								onClick: () => void downloadPdf(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), building && mode !== "email" ? "Building PDF…" : "Download proposal"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: downloadCsv,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Download holdings CSV"]
							}),
							allowPrint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "no-print",
								onClick: () => {
									onClose();
									window.requestAnimationFrame(() => window.print());
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Print"]
							}) : null
						]
					})
				]
			})
		})
	});
}
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl bg-card text-card-foreground shadow-card min-w-0", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col gap-1 p-5 pb-0", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
	ref,
	className: cn("font-display text-xl font-medium leading-snug tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-5", className),
	...props
}));
CardContent.displayName = "CardContent";
//#endregion
export { CardHeader as a, Label as c, CardDescription as i, PqDownloadButton as l, Card as n, CardTitle as o, CardContent as r, Input as s, AppShell as t, ShareDialog as u };
