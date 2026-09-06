import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  action,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#252D28] mb-8",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-[#CCD7C5]/30 bg-[#CCD7C5]/10 text-[#CCD7C5]">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-[#A9B1AA] max-w-2xl">{description}</p>
        )}
      </div>

      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
      {children}
    </div>
  );
}
