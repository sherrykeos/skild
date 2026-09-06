import React from "react";
import { Boxes, Download, ThumbsUp, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface CreatorStatsGridProps {
  publishedCount: number;
  totalDownloads: number;
  totalUpvotes: number;
  growthRate?: string;
}

export function CreatorStatsGrid({
  publishedCount,
  totalDownloads,
  totalUpvotes,
  growthRate = "+18%",
}: CreatorStatsGridProps) {
  const stats = [
    {
      title: "Published Skills",
      value: publishedCount.toString(),
      icon: Boxes,
      color: "text-[#CCD7C5]",
      bg: "bg-[#CCD7C5]/10",
      border: "border-[#CCD7C5]/30",
    },
    {
      title: "Total Downloads",
      value: formatNumber(totalDownloads),
      icon: Download,
      color: "text-[#9FB8B2]",
      bg: "bg-[#9FB8B2]/10",
      border: "border-[#9FB8B2]/30",
    },
    {
      title: "Total Upvotes",
      value: formatNumber(totalUpvotes),
      icon: ThumbsUp,
      color: "text-[#AAB8A3]",
      bg: "bg-[#AAB8A3]/10",
      border: "border-[#AAB8A3]/30",
    },
    {
      title: "This Month",
      value: growthRate,
      icon: TrendingUp,
      color: "text-[#9FBEA5]",
      bg: "bg-[#9FBEA5]/10",
      border: "border-[#9FBEA5]/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="p-5 border-[#252D28] bg-[#0E1210]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#A9B1AA]">{item.title}</span>
              <div className={`p-2 rounded-[6px] border ${item.bg} ${item.border} ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-[#F1F4EF]">{item.value}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
