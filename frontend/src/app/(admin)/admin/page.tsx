"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FileCode,
  Download,
  ThumbsUp,
  MessageSquare,
  FolderHeart,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminApi, AdminStatsResponse } from "@/lib/api/admin";
import { LoadingState } from "@/components/common/loading-state";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      const res = await adminApi.getStats();
      setData(res);
      if (isManual) toast.success("Telemetry refreshed from database.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch platform telemetry.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingState message="Connecting to database telemetry..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-[#C58F8F]">Failed to load admin statistics.</p>
        <Button onClick={() => fetchStats(true)} className="mt-4 bg-[#30E87F] text-[#080B0A]">
          Retry Connection
        </Button>
      </div>
    );
  }

  const { stats, recentUsers, recentSkills } = data;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#252D28] pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F1F4EF]">
              Platform Telemetry &amp; System Overview
            </h1>
            <Badge className="border-[#30E87F]/40 bg-[#30E87F]/10 text-[#30E87F]">
              Live Postgres DB
            </Badge>
          </div>
          <p className="mt-1 text-xs text-[#A9B1AA]">
            Real-time aggregate platform metrics, engagement counters, and moderation queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-[#252D28] bg-[#0E1210] text-xs text-[#F1F4EF] hover:bg-[#141916]"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#30E87F]" : "text-[#707A72]"}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="border-[#252D28] bg-[#0E1210] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#707A72]">
              User Accounts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30E87F]/20 bg-[#30E87F]/10 text-[#30E87F]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#F1F4EF]">{stats.totalUsers}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1A211D] pt-2 text-[11px] text-[#A9B1AA]">
            <span className="text-[#30E87F] font-semibold">{stats.totalCreators} creators</span>
            <span>•</span>
            <span className="text-[#707A72]">{stats.totalAdmins} admins</span>
            {stats.suspendedUsers > 0 && (
              <>
                <span>•</span>
                <span className="text-[#C58F8F] font-semibold">{stats.suspendedUsers} suspended</span>
              </>
            )}
          </div>
        </Card>

        {/* Total Skills */}
        <Card className="border-[#252D28] bg-[#0E1210] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#707A72]">
              Agent Skills
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30E87F]/20 bg-[#30E87F]/10 text-[#30E87F]">
              <FileCode className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#F1F4EF]">{stats.totalSkills}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1A211D] pt-2 text-[11px] text-[#A9B1AA]">
            <span className="text-[#30E87F] font-semibold">{stats.publishedSkills} published</span>
            <span>•</span>
            <span className="text-[#707A72]">{stats.draftSkills} drafts</span>
            <span>•</span>
            <span className="text-[#707A72]">{stats.archivedSkills} archived</span>
          </div>
        </Card>

        {/* Total Installs & Downloads */}
        <Card className="border-[#252D28] bg-[#0E1210] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#707A72]">
              Skill Downloads
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30E87F]/20 bg-[#30E87F]/10 text-[#30E87F]">
              <Download className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#F1F4EF]">{stats.totalDownloads}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1A211D] pt-2 text-[11px] text-[#A9B1AA]">
            <span className="text-[#CCD7C5]">Active agent executions</span>
          </div>
        </Card>

        {/* Engagement Summary */}
        <Card className="border-[#252D28] bg-[#0E1210] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#707A72]">
              Community Engagement
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30E87F]/20 bg-[#30E87F]/10 text-[#30E87F]">
              <ThumbsUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#F1F4EF]">
              {stats.totalUpvotes + stats.totalReviews}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1A211D] pt-2 text-[11px] text-[#A9B1AA]">
            <span className="text-[#30E87F] font-semibold">{stats.totalUpvotes} upvotes</span>
            <span>•</span>
            <span className="text-[#707A72]">{stats.totalReviews} reviews</span>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/users"
          className="flex items-center justify-between rounded-xl border border-[#252D28] bg-[#0E1210] p-4 transition-all hover:border-[#30E87F]/40 hover:bg-[#141916]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#30E87F]/10 text-[#30E87F]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F1F4EF]">Users Moderation</p>
              <p className="text-xs text-[#707A72]">Manage roles, suspend, or remove users</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#707A72]" />
        </Link>

        <Link
          href="/admin/skills"
          className="flex items-center justify-between rounded-xl border border-[#252D28] bg-[#0E1210] p-4 transition-all hover:border-[#30E87F]/40 hover:bg-[#141916]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#30E87F]/10 text-[#30E87F]">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F1F4EF]">Skills Moderation</p>
              <p className="text-xs text-[#707A72]">Inspect, unpublish, or delete skills</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#707A72]" />
        </Link>

        <Link
          href="/admin/reviews"
          className="flex items-center justify-between rounded-xl border border-[#252D28] bg-[#0E1210] p-4 transition-all hover:border-[#30E87F]/40 hover:bg-[#141916]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#30E87F]/10 text-[#30E87F]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F1F4EF]">Reviews Moderation</p>
              <p className="text-xs text-[#707A72]">Clean up feedback &amp; spam ratings</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#707A72]" />
        </Link>
      </div>

      {/* Activity Streams Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="space-y-3 rounded-xl border border-[#252D28] bg-[#0E1210] p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1A211D] pb-3">
            <h2 className="text-sm font-bold text-[#F1F4EF] flex items-center gap-2">
              <Users className="h-4 w-4 text-[#30E87F]" />
              <span>Recent Registrations</span>
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-[#30E87F] hover:underline"
            >
              View all users
            </Link>
          </div>

          <div className="divide-y divide-[#1A211D]">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7 border border-[#252D28]">
                    <AvatarImage src={u.avatar || undefined} alt={u.username} />
                    <AvatarFallback className="text-[10px]">{getInitials(u.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-[#F1F4EF]">{u.username}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1 py-0.2 ${
                          u.role === "ADMIN"
                            ? "bg-[#30E87F]/20 text-[#30E87F] border-[#30E87F]/30"
                            : u.role === "CREATOR"
                            ? "bg-[#9FB8B2]/20 text-[#9FB8B2]"
                            : "bg-[#141916] text-[#707A72]"
                        }`}
                      >
                        {u.role}
                      </Badge>
                      {u.isSuspended && (
                        <span className="rounded bg-[#C58F8F]/20 px-1 text-[9px] font-bold text-[#C58F8F]">
                          SUSPENDED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#707A72]">{u.email}</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#707A72]">
                  <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                  <div className="text-[9px] text-[#A9B1AA]">
                    {u._count?.skills || 0} skills • {u._count?.reviews || 0} reviews
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Skills */}
        <div className="space-y-3 rounded-xl border border-[#252D28] bg-[#0E1210] p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1A211D] pb-3">
            <h2 className="text-sm font-bold text-[#F1F4EF] flex items-center gap-2">
              <FileCode className="h-4 w-4 text-[#30E87F]" />
              <span>Recent Skills Created</span>
            </h2>
            <Link
              href="/admin/skills"
              className="text-xs text-[#30E87F] hover:underline"
            >
              View all skills
            </Link>
          </div>

          <div className="divide-y divide-[#1A211D]">
            {recentSkills.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-[#F1F4EF]">{s.name}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1 py-0.2 ${
                          s.status === "PUBLISHED"
                            ? "bg-[#30E87F]/20 text-[#30E87F]"
                            : s.status === "DRAFT"
                            ? "bg-[#E5C07B]/20 text-[#E5C07B]"
                            : "bg-[#707A72]/20 text-[#707A72]"
                        }`}
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-[#707A72]">
                      by @{s.author.username} • {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#707A72]">
                  <span className="text-[#CCD7C5] font-semibold">{s._count?.downloads || 0}</span> installs
                  <span className="mx-1">•</span>
                  <span className="text-[#30E87F] font-semibold">{s._count?.upvotes || 0}</span> upvotes
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
