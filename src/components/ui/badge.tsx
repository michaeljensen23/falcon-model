import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        muted: "bg-secondary text-muted-foreground",
        outline: "border border-border text-foreground",
        warn: "bg-warn/10 text-warn",
        ok: "bg-ok/10 text-ok",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
