import React from "react";
import { FolderSearch, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#252D28] rounded-[8px] bg-[#0E1210]/50 my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#141916] border border-[#252D28] text-[#CCD7C5] mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F1F4EF] mb-1">{title}</h3>
      <p className="text-sm text-[#A9B1AA] max-w-sm mb-6">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Button asChild variant="primary" size="sm">
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        ) : (
          <Button onClick={onAction} variant="primary" size="sm">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
