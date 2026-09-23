import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SATELLITE_THEMES,
  SATELLITE_WEIGHTS,
  formatUsd,
  isSatelliteThemeId,
  themeById,
  type SatelliteTheme,
  type SatelliteThemeId,
  type SatelliteWeight,
  type ThemeHolding,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

type Props = {
  satelliteOn: boolean;
  satelliteWeight: SatelliteWeight | null;
  satelliteSplit: boolean;
  satelliteTheme: SatelliteThemeId | null;
  satelliteThemeB: SatelliteThemeId | null;
  onToggle: (on: boolean) => void;
  onWeight: (weight: SatelliteWeight) => void;
  onSplit: (split: boolean) => void;
  onTheme: (theme: SatelliteThemeId | null) => void;
  onThemeB: (theme: SatelliteThemeId | null) => void;
};

export function SatellitePanel({
  satelliteOn,
  satelliteWeight,
  satelliteSplit,
  satelliteTheme,
  satelliteThemeB,
  onToggle,
  onWeight,
  onSplit,
  onTheme,
  onThemeB,
}: Props) {
  const split = satelliteWeight === 20 && satelliteSplit;
  const themeA = satelliteTheme ? themeById(satelliteTheme) : null;
  const themeB = satelliteThemeB ? themeById(satelliteThemeB) : null;
  const sleevePct: SatelliteWeight = split ? 10 : (satelliteWeight ?? 10);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Optional overlay, held separate from the core model. Funded from the
        whole account — the core mix still applies only inside the remaining
        sleeve.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <Choice
          label="No satellite"
          hint="Core is 100% of the account"
          active={!satelliteOn}
          onClick={() => onToggle(false)}
        />
        <Choice
          label="Add satellite"
          hint="10% or 20% overlay"
          active={satelliteOn}
          onClick={() => onToggle(true)}
        />
      </div>

      {satelliteOn ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Overlay weight
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SATELLITE_WEIGHTS.map((weight) => (
                <Choice
                  key={weight}
                  label={`${weight}% satellite`}
                  hint={`Core sleeve ${100 - weight}%`}
                  active={satelliteWeight === weight}
                  onClick={() => onWeight(weight)}
                />
              ))}
            </div>
          </div>

          {satelliteWeight === 20 ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                20% structure
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Choice
                  label="One 20% theme"
                  hint="Single satellite sleeve"
                  active={!satelliteSplit}
                  onClick={() => onSplit(false)}
                />
                <Choice
                  label="Two 10% themes"
                  hint="Split the overlay equally"
                  active={satelliteSplit}
                  onClick={() => onSplit(true)}
                />
              </div>
            </div>
          ) : null}

          {satelliteWeight === 10 || (satelliteWeight === 20 && !satelliteSplit) ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Pre-approved theme
              </p>
              <ThemeSelect
                value={satelliteTheme}
                onChange={onTheme}
                label="Satellite theme"
                placeholder="Select a satellite theme"
              />
            </div>
          ) : null}

          {split ? (
            <div className="flex flex-col gap-4">
              <ThemeSlot
                label="First 10% sleeve"
                value={satelliteTheme}
                exclude={satelliteThemeB}
                onChange={onTheme}
                ariaLabel="First 10% satellite theme"
                placeholder="Select first theme"
              />
              <ThemeSlot
                label="Second 10% sleeve"
                value={satelliteThemeB}
                exclude={satelliteTheme}
                onChange={onThemeB}
                ariaLabel="Second 10% satellite theme"
                placeholder="Select second theme"
              />
            </div>
          ) : null}

          {themeA ? <ThemePreview theme={themeA} sleevePct={sleevePct} /> : null}
          {split && themeB ? <ThemePreview theme={themeB} sleevePct={10} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function ThemeSlot({
  label,
  value,
  exclude,
  onChange,
  ariaLabel,
  placeholder,
}: {
  label: string;
  value: SatelliteThemeId | null;
  exclude: SatelliteThemeId | null;
  onChange: (theme: SatelliteThemeId | null) => void;
  ariaLabel: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <ThemeSelect
        value={value}
        exclude={exclude}
        onChange={onChange}
        label={ariaLabel}
        placeholder={placeholder}
      />
    </div>
  );
}

function ThemeSelect({
  value,
  exclude,
  onChange,
  label,
  placeholder,
}: {
  value: SatelliteThemeId | null;
  exclude?: SatelliteThemeId | null;
  onChange: (theme: SatelliteThemeId | null) => void;
  label: string;
  placeholder: string;
}) {
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(v) => {
        if (isSatelliteThemeId(v)) onChange(v);
      }}
    >
      <SelectTrigger aria-label={label}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {SATELLITE_THEMES.map((item) => (
          <SelectItem
            key={item.id}
            value={item.id}
            textValue={item.name}
            disabled={item.id === exclude}
          >
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ThemePreview({
  theme,
  sleevePct,
}: {
  theme: SatelliteTheme;
  sleevePct: number;
}) {
  return (
    <div className="rounded-lg bg-secondary p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{theme.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{theme.summary}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge>{sleevePct}% sleeve</Badge>
          {theme.minInvestment ? (
            <Badge variant="warn">{formatUsd(theme.minInvestment)} min</Badge>
          ) : equalWeight(theme.holdings) ? (
            <Badge>Equal weight</Badge>
          ) : (
            <Badge>{sleeveMixLabel(theme.holdings)}</Badge>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {clusterHoldings(theme.holdings).map((cluster) => (
          <div key={cluster.label ?? "holdings"}>
            {cluster.label ? (
              <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {cluster.label}
              </p>
            ) : null}
            <ul className="flex flex-col gap-2">
              {cluster.holdings.map((holding) => (
                <li
                  key={holding.ticker}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span>
                    <span className="font-medium tabular-nums">{holding.ticker}</span>
                    <span className="ml-2 text-muted-foreground">{holding.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatSleeveShare(holding.share)} of sleeve
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {theme.id === "alt-equity" ? (
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {theme.holdings[0]?.name} is not commingled with the core equity sleeve.
          The $100,000 minimum applies to this holding, not the whole account.
        </p>
      ) : null}
      {theme.id === "crypto" ? (
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Crypto ETPs are held only in the satellite sleeve, separate from the
          Falcon Core equity mix.
        </p>
      ) : null}
      {theme.id === "ai" ? (
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          AI theme ETPs are held only in the satellite sleeve, separate from the
          Falcon Core equity mix.
        </p>
      ) : null}
      {theme.id === "buffer" ? (
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Defined-outcome ETFs are held only in the satellite sleeve, separate
          from the Falcon Core equity mix.
        </p>
      ) : null}
    </div>
  );
}

function formatSleeveShare(share: number): string {
  const pct = share * 100;
  if (Math.abs(pct - Math.round(pct)) < 1e-6) return `${Math.round(pct)}%`;
  return `${pct.toFixed(2)}%`;
}

function equalWeight(holdings: { share: number }[]): boolean {
  if (holdings.length === 0) return false;
  const target = 1 / holdings.length;
  return holdings.every((holding) => Math.abs(holding.share - target) < 1e-6);
}

function sleeveMixLabel(holdings: { share: number }[]): string {
  return holdings.map((holding) => formatSleeveShare(holding.share).replace("%", "")).join(" / ") + "%";
}

function clusterHoldings(holdings: ThemeHolding[]): { label: string | null; holdings: ThemeHolding[] }[] {
  const clusters: { label: string | null; holdings: ThemeHolding[] }[] = [];
  for (const holding of holdings) {
    const label = holding.group ?? null;
    const last = clusters[clusters.length - 1];
    if (last && last.label === label) {
      last.holdings.push(holding);
    } else {
      clusters.push({ label, holdings: [holding] });
    }
  }
  return clusters;
}

function Choice({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-16 flex-col items-start justify-center rounded-lg px-4 py-3 text-left transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98]",
        active
          ? "bg-primary text-primary-foreground shadow-card"
          : "bg-secondary text-foreground hover:bg-accent",
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "text-xs",
          active ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {hint}
      </span>
    </button>
  );
}
