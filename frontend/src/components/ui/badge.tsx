import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-[#252D28] bg-[#141916] text-[#A9B1AA]",
        brand:
          "border border-[#CCD7C5]/30 bg-[#CCD7C5]/10 text-[#CCD7C5]",
        outline:
          "border border-[#252D28] text-[#A9B1AA] bg-transparent",
        success:
          "border border-[#9FBEA5]/30 bg-[#9FBEA5]/10 text-[#9FBEA5]",
        warning:
          "border border-[#C9B98A]/30 bg-[#C9B98A]/10 text-[#C9B98A]",
        danger:
          "border border-[#C58F8F]/30 bg-[#C58F8F]/10 text-[#C58F8F]",
        secondary:
          "border border-[#9FB8B2]/30 bg-[#9FB8B2]/10 text-[#9FB8B2]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
