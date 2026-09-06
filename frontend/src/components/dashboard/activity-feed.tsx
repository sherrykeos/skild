import React from "react";
import Link from "next/link";
import { ArrowUpRight, Download, ThumbsUp, GitCommit, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skill } from "@/types/skill";
import { formatDate } from "@/lib/utils";

interface ActivityFeedProps {
  skills: Skill[];
}

export function ActivityFeed({ skills }: ActivityFeedProps) {
  const recentSkills = skills.slice(0, 5);

  return (
    <Card className="border-[#252D28] bg-[#0E1210]">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-[#F1F4EF] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#CCD7C5]" />
          <span>Recent Activity</span>
        </CardTitle>
        <Link
          href="/skills"
          className="text-xs text-[#CCD7C5] hover:underline flex items-center gap-1"
        >
          <span>View all</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {recentSkills.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#707A72]">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#1A211D]">
            {recentSkills.map((skill) => {
              const latestVersion = skill.versions?.[0]?.version || "1.0.0";
              const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
              const upvotes = skill.upvoteCount ?? skill._count?.upvotes ?? 0;

              return (
                <div key={skill.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 overflow-hidden">
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="text-xs font-semibold text-[#F1F4EF] hover:text-[#CCD7C5] transition-colors truncate block"
                    >
                      {skill.name}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-[#707A72] font-mono">
                      <span>v{latestVersion}</span>
                      <span>•</span>
                      <span>{formatDate(skill.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#A9B1AA] shrink-0">
                    <div className="flex items-center gap-1" title="Downloads">
                      <Download className="h-3 w-3 text-[#707A72]" />
                      <span>{downloads}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Upvotes">
                      <ThumbsUp className="h-3 w-3 text-[#707A72]" />
                      <span>{upvotes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
