import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCD7C5] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#CCD7C5] text-[#080B0A] hover:bg-[#DCE5D7] shadow-sm font-semibold tracking-tight",
        secondary:
          "bg-[#141916] text-[#F1F4EF] hover:bg-[#1A211D] border border-[#252D28] hover:border-[#CCD7C5]/40",
        outline:
          "border border-[#252D28] bg-transparent text-[#F1F4EF] hover:bg-[#0E1210] hover:border-[#AAB8A3]/50",
        ghost:
          "text-[#A9B1AA] hover:text-[#F1F4EF] hover:bg-[#141916]",
        danger:
          "bg-[#C58F8F]/15 text-[#C58F8F] border border-[#C58F8F]/30 hover:bg-[#C58F8F]/25 hover:border-[#C58F8F]/50",
        brandGhost:
          "text-[#CCD7C5] hover:bg-[#CCD7C5]/10 hover:text-[#DCE5D7]",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-xs gap-1.5",
        default: "h-9 px-4 py-2 gap-2",
        lg: "h-11 px-6 text-base gap-2.5",
        icon: "h-9 w-9 p-0",
        iconSm: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
