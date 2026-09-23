import { FALCON_SWIRL_SVG_PATHS } from "@/lib/falcon-swirl";
import { cn } from "@/lib/utils";

export function FalconMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      {FALCON_SWIRL_SVG_PATHS.map((d) => (
        <path key={d.slice(0, 24)} fill="#E3CA67" d={d} />
      ))}
    </svg>
  );
}

export function FalconLockup({ className }: { className?: string }) {
  return (
    <img
      src="/brand/falcon-lockup.png"
      alt="Falcon Wealth"
      draggable={false}
      className={cn("h-auto w-56 object-contain sm:w-64", className)}
    />
  );
}
