export type DiscoveryField =
  | { kind: "prompt"; text: string }
  | { kind: "line"; label: string }
  | { kind: "pair"; left: string; right: string }
  | { kind: "triple"; a: string; b: string; c: string }
  | { kind: "yesno"; label: string }
  | { kind: "checks"; label: string; options: string[] }
  | { kind: "note"; label: string; lines?: number };

export type DiscoverySection = {
  n: number;
  title: string;
  purpose: string;
  fields: DiscoveryField[];
};

export const DISCOVERY_SECTIONS: DiscoverySection[] = [
  {
    n: 1,
    title: "Household & contact",
    purpose: "Who we are planning for, and how to reach you.",
    fields: [
      { kind: "prompt", text: "Client 1" },
      { kind: "pair", left: "Legal name", right: "Preferred name" },
      { kind: "triple", a: "Date of birth", b: "Citizenship", c: "Marital status" },
      { kind: "pair", left: "Mobile", right: "Email" },
      { kind: "prompt", text: "Client 2 (spouse / partner)" },
      { kind: "pair", left: "Legal name", right: "Preferred name" },
      { kind: "triple", a: "Date of birth", b: "Citizenship", c: "Marital status" },
      { kind: "pair", left: "Mobile", right: "Email" },
      { kind: "line", label: "Home address" },
      { kind: "line", label: "Mailing address (if different)" },
      { kind: "line", label: "How did you hear about Falcon?" },
    ],
  },
  {
    n: 2,
    title: "Family, dependents & key relationships",
    purpose: "The people whose lives sit on this balance sheet.",
    fields: [
      { kind: "yesno", label: "Do you have children?" },
      { kind: "prompt", text: "Children / dependents (name, date of birth, dependent for tax?, school or city)" },
      { kind: "note", label: "1.", lines: 1 },
      { kind: "note", label: "2.", lines: 1 },
      { kind: "note", label: "3.", lines: 1 },
      { kind: "note", label: "4.", lines: 1 },
      { kind: "yesno", label: "Parents or others you support financially?" },
      { kind: "line", label: "If yes, who and in what way?" },
      { kind: "line", label: "Anyone else who should be in the planning conversation?" },
    ],
  },
  {
    n: 3,
    title: "Employment, business & career",
    purpose: "Where income is earned, and how long that is expected to last.",
    fields: [
      { kind: "prompt", text: "Client 1" },
      { kind: "pair", left: "Employer / business", right: "Title" },
      { kind: "triple", a: "W-2 / 1099 / owner", b: "Years in role", c: "Expected work horizon" },
      { kind: "prompt", text: "Client 2" },
      { kind: "pair", left: "Employer / business", right: "Title" },
      { kind: "triple", a: "W-2 / 1099 / owner", b: "Years in role", c: "Expected work horizon" },
      { kind: "yesno", label: "Business ownership (S-corp, partnership, LLC, C-corp)?" },
      { kind: "pair", left: "Entity name / type", right: "Ownership %" },
      { kind: "checks", label: "Deferred compensation on the table", options: ["RSUs / options", "ESPP", "NQSOs / ISOs", "Deferred bonus", "Pension credits", "None"] },
      { kind: "line", label: "Notes on career change, sale, or succession" },
    ],
  },
  {
    n: 4,
    title: "Income sources",
    purpose: "What lands each year, before we talk about how it is invested.",
    fields: [
      { kind: "pair", left: "W-2 wages (household)", right: "Bonus / variable (typical)" },
      { kind: "pair", left: "K-1 / business income", right: "Rental / royalty" },
      { kind: "pair", left: "Social Security (now or expected)", right: "Pension / annuity" },
      { kind: "pair", left: "Investment income (taxable)", right: "Other" },
      { kind: "line", label: "Approximate household income (last year)" },
      { kind: "line", label: "Expected change in the next 12-24 months" },
      { kind: "yesno", label: "Any income you would rather not depend on?" },
    ],
  },
  {
    n: 5,
    title: "Expenses, savings rate & cash flow",
    purpose: "What the household actually spends, and what is left to put to work.",
    fields: [
      { kind: "pair", left: "Essential monthly living costs", right: "Discretionary monthly" },
      { kind: "pair", left: "Housing (PITI or rent)", right: "Debt service (ex-mortgage)" },
      { kind: "pair", left: "Current savings rate (approx.)", right: "Emergency fund (months)" },
      { kind: "checks", label: "Cash-flow posture today", options: ["Surplus most months", "Break-even", "Drawing savings", "Uneven / seasonal"] },
      { kind: "line", label: "Large known outflows in the next 24 months" },
      { kind: "note", label: "Anything about spending that a statement will not show", lines: 2 },
    ],
  },
  {
    n: 6,
    title: "Assets & investment accounts",
    purpose: "The inventory. Approximate values are enough for discovery; statements come later.",
    fields: [
      { kind: "pair", left: "Bank / cash / money market", right: "Taxable brokerage" },
      { kind: "pair", left: "Traditional IRA / rollover", right: "Roth IRA" },
      { kind: "pair", left: "401(k) / 403(b) / 457", right: "HSA" },
      { kind: "pair", left: "529 / UTMA", right: "Annuities (if any)" },
      { kind: "pair", left: "Primary residence (est. equity)", right: "Other real estate" },
      { kind: "pair", left: "Business value (est.)", right: "Private / alternatives" },
      { kind: "line", label: "Approximate household net worth" },
      { kind: "pair", left: "Primary custodian today", right: "Cost basis records in hand?" },
      { kind: "note", label: "Concentrated positions, stock from work, or accounts we should not move", lines: 2 },
    ],
  },
  {
    n: 7,
    title: "Liabilities, credit & guarantees",
    purpose: "What is owed, at what rate, and who else is on the hook.",
    fields: [
      { kind: "triple", a: "Mortgage balance / rate", b: "HELOC", c: "Years remaining" },
      { kind: "triple", a: "Student loans", b: "Auto / other", c: "Business debt" },
      { kind: "pair", left: "Margin / securities-backed line", right: "Credit cards (if revolving)" },
      { kind: "yesno", label: "Are you a cosigner or guarantor for anyone?" },
      { kind: "line", label: "If yes, for whom and how much?" },
      { kind: "checks", label: "Credit quality (self-assessed)", options: ["Excellent", "Good", "Fair", "Rebuilding", "Unsure"] },
      { kind: "line", label: "Any liability you want gone first, and why" },
    ],
  },
  {
    n: 8,
    title: "Retirement picture",
    purpose: "When work optional becomes the plan, and what that year is supposed to feel like.",
    fields: [
      { kind: "pair", left: "Target retirement year / age", right: "Part-time or full stop?" },
      { kind: "line", label: "What does a good retirement week look like?" },
      { kind: "pair", left: "Income needed in retirement (today's $)", right: "Must-have vs nice-to-have" },
      { kind: "pair", left: "Social Security claiming idea", right: "Pension start / survivor option" },
      { kind: "yesno", label: "Healthcare bridge needed before Medicare?" },
      { kind: "line", label: "Places you want to live; family you want nearby" },
      { kind: "note", label: "What would make retirement feel like a failure?", lines: 2 },
    ],
  },
  {
    n: 9,
    title: "Tax picture",
    purpose: "Falcon plans around tax first. Rough numbers beat perfect ones that never arrive.",
    fields: [
      { kind: "triple", a: "Filing status", b: "State of residence", c: "Other state exposure" },
      { kind: "pair", left: "Last-year AGI (approx.)", right: "Taxable income (approx.)" },
      { kind: "checks", label: "How tax is paid", options: ["W-2 withholding", "Quarterly estimates", "Both", "Unsure"] },
      { kind: "checks", label: "Returns in the mix", options: ["1040", "1120-S", "1065", "1120", "Estate / trust", "Unsure"] },
      { kind: "yesno", label: "Carryforwards (capital loss, NOL, charitable, credit)?" },
      { kind: "checks", label: "Items on the table this year", options: ["Roth conversion", "Backdoor Roth", "Mega backdoor", "Harvesting", "Bunching gifts", "Opportunity zone / 1031", "None / unsure"] },
      { kind: "pair", left: "Current CPA / tax preparer", right: "May we coordinate?" },
      { kind: "note", label: "Recent surprises, audits, or taxes you want never to repeat", lines: 2 },
    ],
  },
  {
    n: 10,
    title: "Insurance & protection",
    purpose: "What is already covering a bad day, and what is missing.",
    fields: [
      { kind: "pair", left: "Life insurance (type / death benefit)", right: "Owner / beneficiary" },
      { kind: "pair", left: "Disability (own-occ? benefit / term)", right: "Long-term care" },
      { kind: "pair", left: "Umbrella liability", right: "Health / Medicare / supplement" },
      { kind: "pair", left: "Home / auto (adequate?)", right: "Business / key-person / buy-sell" },
      { kind: "yesno", label: "Any policy you suspect is misplaced, stale, or too expensive?" },
      { kind: "line", label: "Who is the insurance agent / broker, if any?" },
      { kind: "note", label: "What financial disaster do you most want this plan to survive?", lines: 2 },
    ],
  },
  {
    n: 11,
    title: "Estate, beneficiaries & legacy",
    purpose: "Who is in charge if you are not, and what you want left behind.",
    fields: [
      { kind: "checks", label: "Documents in force", options: ["Will", "Revocable trust", "POA (financial)", "Healthcare directive", "HIPAA release", "None / unsure"] },
      { kind: "pair", left: "Year last reviewed", right: "Attorney (if any)" },
      { kind: "yesno", label: "Are account beneficiaries aligned with the documents?" },
      { kind: "line", label: "Executor / trustee / healthcare agent" },
      { kind: "yesno", label: "Charitable intent (now or at death)?" },
      { kind: "line", label: "If yes, which organizations or what share?" },
      { kind: "yesno", label: "Special-needs, spendthrift, or blended-family issues?" },
      { kind: "note", label: "What do you want your family to say you planned well?", lines: 2 },
    ],
  },
  {
    n: 12,
    title: "Education, family support & major goals",
    purpose: "The jobs this money has besides 'be invested.'",
    fields: [
      { kind: "prompt", text: "Name the three outcomes that would make this engagement a success." },
      { kind: "note", label: "1.", lines: 1 },
      { kind: "note", label: "2.", lines: 1 },
      { kind: "note", label: "3.", lines: 1 },
      { kind: "pair", left: "Education funding (who / when / how)", right: "529 or other vehicle" },
      { kind: "pair", left: "Home, second home, or relocate", right: "Horizon / budget" },
      { kind: "pair", left: "Gifting to family (annual / lifetime)", right: "Other large goal" },
      { kind: "line", label: "A goal you have not told other advisors" },
    ],
  },
  {
    n: 13,
    title: "Investment experience, risk & values",
    purpose: "How you have lived through markets, and what you will not live with.",
    fields: [
      { kind: "checks", label: "Experience managing investments", options: ["None", "Some", "Comfortable", "Hands-on / professional"] },
      { kind: "line", label: "Worst decline you have lived through, and what you did" },
      { kind: "pair", left: "Peak-to-trough you could sleep through", right: "Cash needed in the next 3 years" },
      { kind: "checks", label: "Satellites / themes of interest", options: ["None", "Private income", "Private equity", "Crypto", "AI", "Buffered equity + income"] },
      { kind: "yesno", label: "ESG, religious, or other restrictions?" },
      { kind: "line", label: "If yes, spell them out" },
      { kind: "yesno", label: "Concentrated stock you are unwilling (or unable) to sell?" },
      { kind: "note", label: "What does 'too risky' mean in your household?", lines: 2 },
    ],
  },
  {
    n: 14,
    title: "Other advisors, documents & next steps",
    purpose: "Who else is on the team, and what to bring so the next meeting is useful.",
    fields: [
      { kind: "pair", left: "CPA / tax preparer", right: "May we speak with them?" },
      { kind: "pair", left: "Estate attorney", right: "Insurance agent" },
      { kind: "pair", left: "Other advisor / coach", right: "Why this search, why now?" },
      { kind: "checks", label: "Please gather (copies are fine)", options: ["Last two tax returns", "Account statements", "Social Security estimates", "Pay stubs / K-1s", "Insurance illustrations", "Estate docs", "Entity operating agreement", "Stock-plan statements"] },
      { kind: "checks", label: "Preferred cadence after onboarding", options: ["Quarterly", "Twice a year", "Annual + as needed", "Unsure"] },
      { kind: "note", label: "Anything else we should know before we design the plan", lines: 3 },
    ],
  },
];

export function discoveryFileStem(clientName: string): string {
  const client = clientName.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "client";
  return `Falcon-PQ-Discovery-Facts-${client}`.slice(0, 80);
}
