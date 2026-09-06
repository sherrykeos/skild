import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[8px] border border-[#252D28] bg-[#0E1210] px-3 py-2 text-sm text-[#F1F4EF] placeholder:text-[#707A72] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCD7C5] focus-visible:border-[#CCD7C5]/60 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
