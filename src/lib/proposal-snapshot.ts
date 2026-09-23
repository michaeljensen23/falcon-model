import {
  isEquityStep,
  isSatelliteThemeId,
  MAX_ACCOUNT_VALUE,
  MAX_CLIENT_NAME,
  SATELLITE_WEIGHTS,
  type ModelInput,
  type SatelliteThemeId,
  type SatelliteWeight,
} from "./portfolio";

const WEIGHTS: readonly number[] = SATELLITE_WEIGHTS;
const MAX_SNAPSHOT_CHARS = 32_768;

function isSatelliteWeight(value: unknown): value is SatelliteWeight {
  return typeof value === "number" && WEIGHTS.includes(value);
}

export function parseProposalSnapshot(raw: unknown): ModelInput {
  let data: unknown = raw;
  if (typeof raw === "string") {
    if (raw.length > MAX_SNAPSHOT_CHARS) throw new Error("Invalid proposal snapshot.");
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      throw new Error("Invalid proposal snapshot.");
    }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid proposal snapshot.");
  try {
    if (JSON.stringify(data).length > MAX_SNAPSHOT_CHARS) {
      throw new Error("Invalid proposal snapshot.");
    }
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid proposal snapshot.") throw err;
    throw new Error("Invalid proposal snapshot.");
  }
  const row = data as Record<string, unknown>;
  if (typeof row.clientName !== "string" || row.clientName.length > MAX_CLIENT_NAME + 64) {
    throw new Error("Invalid client name.");
  }
  const clientName = row.clientName.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  if (clientName.length > MAX_CLIENT_NAME) throw new Error("Invalid client name.");

  let accountValue: number | null = null;
  if (row.accountValue !== null && row.accountValue !== undefined) {
    if (typeof row.accountValue !== "number" || !Number.isFinite(row.accountValue)) {
      throw new Error("Invalid account value.");
    }
    if (row.accountValue < 0 || row.accountValue > MAX_ACCOUNT_VALUE) {
      throw new Error("Invalid account value.");
    }
    accountValue = row.accountValue;
  }
  if (typeof row.coreEquity !== "number" || !isEquityStep(row.coreEquity)) {
    throw new Error("Invalid core mix.");
  }
  if (typeof row.satelliteOn !== "boolean") throw new Error("Invalid satellite flag.");
  const satelliteWeight = row.satelliteWeight;
  if (satelliteWeight !== null && !isSatelliteWeight(satelliteWeight)) {
    throw new Error("Invalid satellite weight.");
  }
  if (typeof row.satelliteSplit !== "boolean") throw new Error("Invalid satellite split.");
  const theme = parseTheme(row.satelliteTheme);
  const themeB = parseTheme(row.satelliteThemeB);

  const satelliteOn = row.satelliteOn;
  const split = satelliteOn && satelliteWeight === 20 && row.satelliteSplit;
  if (split && theme && themeB && theme === themeB) {
    throw new Error("Invalid satellite theme.");
  }
  return {
    clientName,
    accountValue,
    coreEquity: row.coreEquity,
    satelliteOn,
    satelliteWeight: satelliteOn ? satelliteWeight : null,
    satelliteSplit: split,
    satelliteTheme: satelliteOn ? theme : null,
    satelliteThemeB: split ? themeB : null,
  };
}

function parseTheme(value: unknown): SatelliteThemeId | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string" || !isSatelliteThemeId(value)) {
    throw new Error("Invalid satellite theme.");
  }
  return value;
}

export function serializeProposalSnapshot(input: ModelInput): string {
  return JSON.stringify({
    clientName: input.clientName,
    accountValue: input.accountValue,
    coreEquity: input.coreEquity,
    satelliteOn: input.satelliteOn,
    satelliteWeight: input.satelliteWeight,
    satelliteSplit: input.satelliteSplit,
    satelliteTheme: input.satelliteTheme,
    satelliteThemeB: input.satelliteThemeB,
  } satisfies ModelInput);
}
