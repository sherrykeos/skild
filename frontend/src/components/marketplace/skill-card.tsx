"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ThumbsUp, Bookmark, Code2, Sparkles, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skill } from "@/types/skill";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";
import { engagementApi } from "@/lib/api/engagement";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

interface SkillCardProps {
  skill: Skill;
  onSaveToggle?: (skillId: string, isSaved: boolean) => void;
}

export function SkillCard({ skill, onSaveToggle }: SkillCardProps) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(skill.hasSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to save skills to your library.");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await engagementApi.unsaveSkill(skill.id);
        setIsSaved(false);
        onSaveToggle?.(skill.id, false);
        toast.success("Skill removed from saved library.");
      } else {
        await engagementApi.saveSkill(skill.id);
        setIsSaved(true);
        onSaveToggle?.(skill.id, true);
        toast.success("Skill saved to your library.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update saved skill.");
    } finally {
      setIsSaving(false);
    }
  };

  const latestVersion = skill.versions?.[0]?.version || "1.0.0";
  const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
  const upvotes = skill.upvoteCount ?? skill._count?.upvotes ?? 0;
  const reviews = skill.reviewCount ?? skill._count?.reviews ?? 0;

  return (
    <Card className="group relative flex flex-col justify-between border-[#252D28] bg-[#0E1210] hover:border-[#CCD7C5]/40 hover:shadow-lg transition-all duration-200">
      <Link href={`/skills/${skill.slug}`} className="block">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Category Icon Badge */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#252D28] bg-[#141916] text-[#CCD7C5] group-hover:border-[#CCD7C5]/50 group-hover:text-[#DCE5D7] transition-colors">
              <Code2 className="h-5 w-5" />
            </div>

            {/* Save Bookmark Toggle */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              aria-label={isSaved ? "Remove from saved" : "Save skill"}
              className={`p-2 rounded-[6px] border border-[#252D28] transition-colors ${
                isSaved
                  ? "bg-[#CCD7C5]/10 text-[#CCD7C5] border-[#CCD7C5]/30"
                  : "bg-[#141916] text-[#707A72] hover:text-[#F1F4EF] hover:border-[#CCD7C5]/40"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Skill Title & Author */}
          <div className="mt-3 space-y-1">
            <h3 className="text-base font-bold text-[#F1F4EF] group-hover:text-[#CCD7C5] transition-colors line-clamp-1">
              {skill.name}
            </h3>

            {/* Author */}
            <div className="flex items-center gap-1.5 text-xs text-[#A9B1AA]">
              {skill.author ? (
                <>
                  <Avatar className="h-4 w-4 border border-[#252D28]">
                    <AvatarImage src={skill.author.avatar || undefined} alt={skill.author.username} />
                    <AvatarFallback className="text-[8px]">{getInitials(skill.author.username)}</AvatarFallback>
                  </Avatar>
                  <span>by <span className="text-[#F1F4EF] font-medium">{skill.author.username}</span></span>
                </>
              ) : (
                <span>by <span className="text-[#F1F4EF]">SkillAtlas</span></span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 pb-3">
          {/* Description */}
          <p className="text-xs text-[#A9B1AA] line-clamp-2 leading-relaxed mb-3">
            {skill.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {skill.category && (
              <Badge variant="brand" className="text-[10px] px-2 py-0.5">
                {skill.category.name}
              </Badge>
            )}
            {skill.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag.id || tag.name} variant="outline" className="text-[10px] px-2 py-0.5">
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-5 pt-3 border-t border-[#1A211D] flex items-center justify-between text-xs text-[#707A72] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 hover:text-[#A9B1AA] transition-colors" title={`${downloads} downloads`}>
            <Download className="h-3.5 w-3.5 text-[#707A72]" />
            <span>{formatNumber(downloads)}</span>
          </div>

          <div className="flex items-center gap-1 hover:text-[#A9B1AA] transition-colors" title={`${upvotes} upvotes`}>
            <ThumbsUp className="h-3.5 w-3.5 text-[#707A72]" />
            <span>{formatNumber(upvotes)}</span>
          </div>

          {reviews > 0 && (
            <div className="flex items-center gap-1 hover:text-[#A9B1AA] transition-colors" title={`${reviews} reviews`}>
              <MessageSquare className="h-3.5 w-3.5 text-[#707A72]" />
              <span>{reviews}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-[#141916] border border-[#252D28] text-[10px] text-[#A9B1AA]">
            v{latestVersion}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
