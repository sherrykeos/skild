"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Boxes,
  Globe,
  Calendar,
  Share2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { LoadingState } from "@/components/common/loading-state";
import { usersApi } from "@/lib/api/users";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const username = decodeURIComponent(resolvedParams.username);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => usersApi.getPublicProfile(username),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <PageContainer className="py-12">
        <LoadingState message="Loading developer profile..." />
      </PageContainer>
    );
  }

  if (isError || !profile) {
    notFound();
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const skills = profile.skills || [];
  const publishedCount = profile._count?.skills ?? skills.length;
  const totalDownloads = profile._count?.downloads ?? 0;
  const totalUpvotes = profile._count?.upvotes ?? 0;

  return (
    <PageContainer className="py-10 max-w-6xl space-y-10">
      {/* Profile Header Card */}
      <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-start justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Avatar className="h-24 w-24 border-2 border-[#252D28]">
              <AvatarImage src={profile.avatar || undefined} alt={profile.username} />
              <AvatarFallback className="text-xl font-bold bg-[#141A17] text-[#CCD7C5]">
                {getInitials(profile.username)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl font-bold text-[#F1F4EF]">
                  @{profile.username}
                </h1>
                <Badge variant="outline" className="text-xs">
                  Verified Creator
                </Badge>
              </div>

              {profile.bio && (
                <p className="text-sm text-[#A9B1AA] max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Links & metadata */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-mono text-[#707A72]">
                {profile.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Joined {formatDate(profile.createdAt)}</span>
                  </div>
                )}
                {profile.github && (
                  <a
                    href={profile.github.startsWith("http") ? profile.github : `https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#CCD7C5] transition-colors"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#CCD7C5] transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <Button onClick={handleShare} variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Profile</span>
          </Button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#1A211D] text-center font-mono">
          <div className="space-y-1">
            <div className="text-lg sm:text-2xl font-bold text-[#F1F4EF]">{publishedCount}</div>
            <div className="text-[11px] text-[#707A72] uppercase tracking-wider">Published Skills</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg sm:text-2xl font-bold text-[#CCD7C5]">{formatNumber(totalDownloads)}</div>
            <div className="text-[11px] text-[#707A72] uppercase tracking-wider">Total Downloads</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg sm:text-2xl font-bold text-[#9FB8B2]">{formatNumber(totalUpvotes)}</div>
            <div className="text-[11px] text-[#707A72] uppercase tracking-wider">Total Upvotes</div>
          </div>
        </div>
      </div>

      {/* Creator Skills Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#252D28] pb-4">
          <h2 className="text-lg font-bold text-[#F1F4EF] flex items-center gap-2">
            <Boxes className="h-4 w-4 text-[#CCD7C5]" />
            <span>Published Skills ({skills.length})</span>
          </h2>
        </div>

        <SkillGrid
          skills={skills}
          isLoading={isLoading}
          emptyTitle="No published skills"
          emptyDescription={`@${username} has not published any public agentic skills yet.`}
        />
      </div>
    </PageContainer>
  );
}
