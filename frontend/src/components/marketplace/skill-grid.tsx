import React from "react";
import { SkillCard } from "./skill-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Skill } from "@/types/skill";

interface SkillGridProps {
  skills: Skill[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  onSaveToggle?: (skillId: string, isSaved: boolean) => void;
}

export function SkillGrid({
  skills,
  isLoading = false,
  emptyTitle = "No skills found",
  emptyDescription = "Try adjusting your search query, clearing filters, or exploring other categories.",
  actionLabel,
  actionHref,
  onAction,
  onSaveToggle,
}: SkillGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-[8px] border border-[#252D28] bg-[#0E1210] p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="h-10 w-10 rounded-[8px]" />
              <Skeleton className="h-8 w-8 rounded-[6px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="pt-2 border-t border-[#1A211D] flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={actionLabel}
        actionHref={actionHref}
        onAction={onAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id || skill.slug}
          skill={skill}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  );
}
