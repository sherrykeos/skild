"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ThumbsUp, Bookmark, Code2, ChevronRight, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skill } from "@/types/skill";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";
import { engagementApi } from "@/lib/api/engagement";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

interface SkillHeaderProps {
  skill: Skill;
}

export function SkillHeader({ skill }: SkillHeaderProps) {
  const { isAuthenticated } = useAuth();
  const [upvotes, setUpvotes] = useState(skill.upvoteCount ?? skill._count?.upvotes ?? 0);
  const [hasUpvoted, setHasUpvoted] = useState(skill.hasUpvoted || false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const [isSaved, setIsSaved] = useState(skill.hasSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
  const reviews = skill.reviewCount ?? skill._count?.reviews ?? 0;
  const latestVersion = skill.versions?.[0]?.version || "1.0.0";

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to upvote skills.");
      return;
    }
    setIsUpvoting(true);
    try {
      if (hasUpvoted) {
        await engagementApi.removeUpvote(skill.id);
        setHasUpvoted(false);
        setUpvotes((prev) => Math.max(0, prev - 1));
        toast.success("Upvote removed.");
      } else {
        await engagementApi.upvote(skill.id);
        setHasUpvoted(true);
        setUpvotes((prev) => prev + 1);
        toast.success("Skill upvoted!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upvote skill.");
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark skills.");
      return;
    }
    setIsSaving(true);
    try {
      if (isSaved) {
        await engagementApi.unsaveSkill(skill.id);
        setIsSaved(false);
        toast.success("Skill removed from library.");
      } else {
        await engagementApi.saveSkill(skill.id);
        setIsSaved(true);
        toast.success("Skill saved to your library.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save skill.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await engagementApi.downloadSkill(skill.id, `${skill.slug}-v${latestVersion}.zip`);
      toast.success("Package download started!");
    } catch (err: any) {
      toast.error(err.message || "Failed to download skill package.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-8 border-b border-[#252D28]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#707A72]">
        <Link href="/explore" className="hover:text-[#CCD7C5] transition-colors">
          Explore
        </Link>
        <ChevronRight className="h-3 w-3" />
        {skill.category ? (
          <>
            <Link
              href={`/categories/${skill.category.slug}`}
              className="hover:text-[#CCD7C5] transition-colors"
            >
              {skill.category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
          </>
        ) : null}
        <span className="text-[#F1F4EF] font-medium truncate max-w-xs">{skill.name}</span>
      </nav>

      {/* Main Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Skill Icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] border border-[#252D28] bg-[#141916] text-[#CCD7C5] shadow-sm">
            <Code2 className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F4EF]">
                {skill.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-[#CCD7C5]/30 bg-[#CCD7C5]/10 text-[#CCD7C5]">
                v{latestVersion}
              </span>
            </div>

            {/* Author Attribution */}
            <div className="flex items-center gap-2 text-xs text-[#A9B1AA]">
              {skill.author && (
                <Link
                  href={`/users/${skill.author.username}`}
                  className="flex items-center gap-1.5 hover:text-[#CCD7C5] transition-colors"
                >
                  <Avatar className="h-4 w-4 border border-[#252D28]">
                    <AvatarImage src={skill.author.avatar || undefined} alt={skill.author.username} />
                    <AvatarFallback className="text-[8px]">{getInitials(skill.author.username)}</AvatarFallback>
                  </Avatar>
                  <span>by <span className="text-[#F1F4EF] font-medium">@{skill.author.username}</span></span>
                </Link>
              )}
              <span>•</span>
              <span>Updated {formatDate(skill.updatedAt || skill.publishedAt)}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#A9B1AA] max-w-3xl leading-relaxed pt-1">
              {skill.description}
            </p>

            {/* Tags Strip */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {skill.category && (
                <Badge variant="brand" className="text-xs">
                  {skill.category.name}
                </Badge>
              )}
              {skill.tags?.map((tag) => (
                <Badge key={tag.id || tag.name} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            variant="primary"
            size="default"
            className="gap-2 shadow-sm font-semibold"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? "Downloading..." : "Download ZIP"}</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="secondary"
            size="default"
            className={`gap-2 ${isSaved ? "border-[#CCD7C5]/40 text-[#CCD7C5]" : ""}`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </Button>

          <Button
            onClick={handleUpvote}
            disabled={isUpvoting}
            variant="secondary"
            size="default"
            className={`gap-2 ${hasUpvoted ? "border-[#CCD7C5]/40 text-[#CCD7C5]" : ""}`}
          >
            <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? "fill-current" : ""}`} />
            <span>{formatNumber(upvotes)}</span>
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            size="icon"
            aria-label="Share skill"
            title="Share skill"
          >
            {copied ? <Check className="h-4 w-4 text-[#9FBEA5]" /> : <Share2 className="h-4 w-4 text-[#A9B1AA]" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
