import { CoreHoldings } from "@/components/model/core-holdings";
import { Separator } from "@/components/ui/separator";
import {
  CORE_MODELS,
  coreByEquity,
  coreWeightedExpenseRatio,
  isEquityStep,
  type EquityStep,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

type Props = {
  equity: EquityStep;
  onSelect: (equity: EquityStep) => void;
};

export function CorePicker({ equity, onSelect }: Props) {
  const selected = coreByEquity(equity);
  const weightedEr = coreWeightedExpenseRatio(selected.equity);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-end justify-between gap-3 text-xs tracking-wide text-muted-foreground uppercase">
        <span>Equity-led</span>
        <span>Income-led</span>
      </div>
      <label className="flex flex-col gap-2">
        <span className="sr-only">Core equity allocation</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={100 - equity}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={equity}
          aria-valuetext={`${equity} percent equity, ${100 - equity} percent fixed income`}
          onChange={(event) => {
            const next = 100 - Number(event.target.value);
            if (isEquityStep(next)) onSelect(next);
          }}
          className="mix-slider w-full"
        />
      </label>
      <div className="grid grid-cols-7 gap-1.5">
        {CORE_MODELS.map((model) => {
          const active = model.equity === equity;
          return (
            <button
              key={model.short}
              type="button"
              onClick={() => onSelect(model.equity)}
              aria-pressed={active}
              aria-label={`${model.short} ${model.name}`}
              className={cn(
                "flex h-11 items-center justify-center rounded-lg px-0.5 text-xs font-medium whitespace-nowrap tabular-nums transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.96]",
                active
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-secondary text-foreground hover:bg-accent",
              )}
            >
              {model.short}
            </button>
          );
        })}
      </div>
      <MixBar equity={selected.equity} fixed={selected.fixed} />
      <div>
        <p className="font-display text-lg font-medium tracking-tight">
          {selected.short}{" "}
          <span className="text-muted-foreground">{selected.name}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{selected.blurb}</p>
      </div>
      <Separator />
      <CoreHoldings equity={selected.equity} weightedEr={weightedEr} />
    </div>
  );
}

function MixBar({ equity, fixed }: { equity: number; fixed: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
        {equity > 0 ? (
          <div
            className="h-full bg-equity transition-[flex-basis] duration-200 ease-out"
            style={{ flexBasis: `${equity}%` }}
          />
        ) : null}
        {fixed > 0 ? (
          <div
            className="h-full bg-fixed transition-[flex-basis] duration-200 ease-out"
            style={{ flexBasis: `${fixed}%` }}
          />
        ) : null}
      </div>
      <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
        <span>
          <span className="mr-1.5 inline-block size-2 rounded-full bg-equity align-middle" />
          {equity}% Equity
        </span>
        <span>
          <span className="mr-1.5 inline-block size-2 rounded-full bg-fixed align-middle" />
          {fixed}% Fixed income
        </span>
      </div>
    </div>
  );
}
