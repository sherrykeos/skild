"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  Users,
  Boxes,
  Download,
  ThumbsUp,
  MessageSquare,
  FolderHeart,
  Activity,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Server,
  Database,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { adminApi } from "@/lib/api/admin";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats(),
    staleTime: 1000 * 60, // 1 minute
  });

  if (isLoading) {
    return <LoadingState message="Loading administrative website analytics..." />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to Load Admin Console"
        message="Failed to connect to backend telemetry endpoints."
        onRetry={() => refetch()}
      />
    );
  }

  const { stats, recentUsers, recentSkills } = data;

  const statCards = [
    {
      title: "Total Registered Users",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "text-[#CCD7C5]",
      bgColor: "bg-[#141A17]",
      sub: "Active Developers",
    },
    {
      title: "Published Skills",
      value: formatNumber(stats.publishedSkills),
      icon: Boxes,
      color: "text-[#9FBEA5]",
      bgColor: "bg-[#141916]",
      sub: `${stats.draftSkills} Drafts / ${stats.archivedSkills} Archived`,
    },
    {
      title: "Total Community Downloads",
      value: formatNumber(stats.totalDownloads),
      icon: Download,
      color: "text-[#9FB8B2]",
      bgColor: "bg-[#141A17]",
      sub: "Skill Installs Across CLI & Web",
    },
    {
      title: "Community Upvotes",
      value: formatNumber(stats.totalUpvotes),
      icon: ThumbsUp,
      color: "text-[#CCD7C5]",
      bgColor: "bg-[#141A17]",
      sub: `${stats.totalReviews} Verified Reviews`,
    },
    {
      title: "Active Collections",
      value: formatNumber(stats.totalCollections),
      icon: FolderHeart,
      color: "text-[#AAB8A3]",
      bgColor: "bg-[#141916]",
      sub: "User Curated Bundles",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252D28] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
              Admin Control Panel
            </h1>
            <Badge variant="brand" className="text-xs gap-1 font-mono uppercase">
              <ShieldCheck className="h-3 w-3" />
              <span>Platform Admin</span>
            </Badge>
          </div>
          <p className="text-xs text-[#A9B1AA] mt-1">
            Real-time telemetry, platform usage metrics, user activity, and skill catalog analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            disabled={isRefetching}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-mono"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            <span>{isRefetching ? "Refreshing..." : "Refresh Stats"}</span>
          </Button>
        </div>
      </div>

      {/* System Operational Status Banner */}
      <div className="p-4 border border-[#252D28] bg-[#0E1210] rounded-[8px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[#F1F4EF]">All Systems Operational</p>
            <p className="text-[11px] text-[#707A72] font-mono">
              Next.js Frontend (v16) • Express API (v1.0) • PostgreSQL DB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#A9B1AA]">
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-[#CCD7C5]" />
            <span>API Proxy 200 OK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-[#9FBEA5]" />
            <span>PostgreSQL Connected</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-5 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#707A72]">
                  {card.title}
                </span>
                <div className={`p-2 rounded-[6px] border border-[#252D28] ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-[#F1F4EF] tracking-tight font-mono">
                  {card.value}
                </div>
                <p className="text-[11px] text-[#A9B1AA] mt-1 font-mono">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Tables Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registered Developers */}
        <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#252D28] pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#CCD7C5]" />
              <h3 className="text-sm font-bold text-[#F1F4EF]">Recent User Registrations</h3>
            </div>
            <span className="text-[11px] font-mono text-[#707A72]">Latest 6</span>
          </div>

          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-xs text-[#707A72] py-4 text-center">No registered users yet.</p>
            ) : (
              recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-[6px] border border-[#1A211D] bg-[#141A17]/40 hover:bg-[#141A17] transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-8 w-8 border border-[#252D28]">
                      <AvatarImage src={u.avatar || undefined} alt={u.username} />
                      <AvatarFallback className="text-xs">{getInitials(u.username)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-[#F1F4EF] truncate">@{u.username}</p>
                      <p className="text-[11px] text-[#707A72] truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Link
                      href={`/users/${u.username}`}
                      className="text-[11px] font-mono text-[#CCD7C5] hover:underline flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <p className="text-[10px] text-[#707A72] font-mono mt-0.5">
                      {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Published Skills */}
        <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#252D28] pb-3">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-[#CCD7C5]" />
              <h3 className="text-sm font-bold text-[#F1F4EF]">Recent Skill Creations</h3>
            </div>
            <span className="text-[11px] font-mono text-[#707A72]">Latest 6</span>
          </div>

          <div className="space-y-3">
            {recentSkills.length === 0 ? (
              <p className="text-xs text-[#707A72] py-4 text-center">No skills created yet.</p>
            ) : (
              recentSkills.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-[6px] border border-[#1A211D] bg-[#141A17]/40 hover:bg-[#141A17] transition-colors"
                >
                  <div className="overflow-hidden space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/skills/${s.slug}`}
                        className="text-xs font-bold text-[#F1F4EF] hover:text-[#CCD7C5] transition-colors truncate"
                      >
                        {s.name}
                      </Link>
                      <Badge
                        variant={s.status === "PUBLISHED" ? "brand" : "outline"}
                        className="text-[9px] py-0 px-1.5"
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#707A72]">by @{s.author.username}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#A9B1AA] shrink-0">
                    <div className="flex items-center gap-1" title="Downloads">
                      <Download className="h-3 w-3 text-[#707A72]" />
                      <span>{s._count.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Upvotes">
                      <ThumbsUp className="h-3 w-3 text-[#707A72]" />
                      <span>{s._count.upvotes}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
