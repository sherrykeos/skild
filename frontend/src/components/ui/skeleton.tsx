import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[8px] bg-[#141916] border border-[#252D28]/40", className)}
      {...props}
    />
  );
}

export { Skeleton };
