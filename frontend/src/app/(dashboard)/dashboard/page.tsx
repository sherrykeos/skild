"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Boxes, Download, ThumbsUp, ArrowRight, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreatorStatsGrid } from "@/components/dashboard/creator-stats-grid";
import { DownloadsChart } from "@/components/dashboard/downloads-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { LoadingState } from "@/components/common/loading-state";
import { useAuth } from "@/lib/auth/auth-context";
import { skillsApi } from "@/lib/api/skills";
import { formatNumber, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-skills"],
    queryFn: () => skillsApi.getMine(),
  });

  const skills = data?.skills || [];
  const publishedSkills = skills.filter((s) => s.status === "PUBLISHED");
  const draftSkills = skills.filter((s) => s.status === "DRAFT");

  const totalDownloads = skills.reduce(
    (acc, s) => acc + (s.downloadCount ?? s._count?.downloads ?? 0),
    0
  );
  const totalUpvotes = skills.reduce(
    (acc, s) => acc + (s.upvoteCount ?? s._count?.upvotes ?? 0),
    0
  );

  if (isLoading) {
    return <LoadingState message="Loading your creator dashboard metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#252D28] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
              Welcome back{user?.username ? `, ${user.username}` : ""}{" "}
              <span className="inline-block animate-wave">⚡</span>
            </h1>
          </div>
          <p className="text-xs text-[#A9B1AA]">
            Here&apos;s a summary of your published skills and community usage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Link href="/github-import">
              <GithubIcon className="h-3.5 w-3.5 text-[#CCD7C5]" />
              <span>Import GitHub</span>
            </Link>
          </Button>

          <Button asChild variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
            <Link href="/skills/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Create Skill</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <CreatorStatsGrid
        publishedCount={publishedSkills.length}
        totalDownloads={totalDownloads}
        totalUpvotes={totalUpvotes}
        growthRate="+18%"
      />

      {/* Chart & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <DownloadsChart />
        </div>
        <div className="lg:col-span-5">
          <ActivityFeed skills={skills} />
        </div>
      </div>

      {/* Recent Skills Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F1F4EF] flex items-center gap-2">
              <Boxes className="h-4 w-4 text-[#CCD7C5]" />
              <span>My Skills ({skills.length})</span>
            </h2>
            <p className="text-xs text-[#707A72]">
              {publishedSkills.length} published • {draftSkills.length} drafts
            </p>
          </div>

          <Button asChild variant="ghost" size="sm" className="text-xs text-[#CCD7C5]">
            <Link href="/skills">Manage all skills →</Link>
          </Button>
        </div>

        {skills.length === 0 ? (
          <Card className="p-8 text-center border-[#252D28] bg-[#0E1210] space-y-3">
            <p className="text-xs text-[#A9B1AA]">
              You haven&apos;t created any skills yet. Build your first reusable AI capability now!
            </p>
            <Button asChild variant="primary" size="sm">
              <Link href="/skills/new">Create Your First Skill</Link>
            </Button>
          </Card>
        ) : (
          <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141916] border-b border-[#252D28] text-[#707A72] font-mono">
                <tr>
                  <th className="p-3.5 pl-4">Skill</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Version</th>
                  <th className="p-3.5">Downloads</th>
                  <th className="p-3.5">Upvotes</th>
                  <th className="p-3.5">Updated</th>
                  <th className="p-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A211D]">
                {skills.slice(0, 5).map((skill) => {
                  const latestVersion = skill.versions?.[0]?.version || "1.0.0";
                  const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
                  const upvotes = skill.upvoteCount ?? skill._count?.upvotes ?? 0;

                  return (
                    <tr key={skill.id} className="hover:bg-[#141916]/40 transition-colors">
                      <td className="p-3.5 pl-4 font-semibold text-[#F1F4EF]">
                        <Link
                          href={`/skills/${skill.slug}`}
                          className="hover:text-[#CCD7C5] transition-colors"
                        >
                          {skill.name}
                        </Link>
                      </td>
                      <td className="p-3.5">
                        {skill.status === "PUBLISHED" && (
                          <Badge variant="success" className="text-[10px]">
                            Published
                          </Badge>
                        )}
                        {skill.status === "DRAFT" && (
                          <Badge variant="warning" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                        {skill.status === "ARCHIVED" && (
                          <Badge variant="outline" className="text-[10px]">
                            Archived
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[#A9B1AA]">v{latestVersion}</td>
                      <td className="p-3.5 font-mono text-[#A9B1AA]">{formatNumber(downloads)}</td>
                      <td className="p-3.5 font-mono text-[#A9B1AA]">{formatNumber(upvotes)}</td>
                      <td className="p-3.5 font-mono text-[#707A72]">{formatDate(skill.updatedAt)}</td>
                      <td className="p-3.5 pr-4 text-right">
                        <Button asChild variant="ghost" size="xs">
                          <Link href={`/skills/${skill.id}/edit`}>Edit Studio</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
