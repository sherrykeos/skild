"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Archive,
  RotateCcw,
  CheckCircle2,
  Boxes,
  MoreVertical,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { skillsApi } from "@/lib/api/skills";
import { formatNumber, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { SkillStatus } from "@/types/skill";

export default function MySkillsPage() {
  const queryClient = useQueryClient();
  const [filterTab, setFilterTab] = useState<"ALL" | SkillStatus>("ALL");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-skills"],
    queryFn: () => skillsApi.getMine(),
  });

  const skills = data?.skills || [];

  // Filter skills by tab
  const filteredSkills = skills.filter((s) => {
    if (filterTab === "ALL") return true;
    return s.status === filterTab;
  });

  // Action Mutations
  const archiveMutation = useMutation({
    mutationFn: (id: string) => skillsApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-skills"] });
      toast.success("Skill archived.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to archive skill."),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => skillsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-skills"] });
      toast.success("Skill restored to draft.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to restore skill."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-skills"] });
      toast.success("Draft skill deleted.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete skill."),
  });

  if (isLoading) {
    return <LoadingState message="Loading your skills..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#252D28] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
            My Skills
          </h1>
          <p className="text-xs text-[#A9B1AA] mt-1">
            Manage your draft, published, and archived agentic skills.
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

      {/* Tabs Filter */}
      <div className="flex items-center justify-between">
        <Tabs
          value={filterTab}
          onValueChange={(val) => setFilterTab(val as "ALL" | SkillStatus)}
        >
          <TabsList className="bg-[#0E1210] border-[#252D28]">
            <TabsTrigger value="ALL" className="text-xs">
              All ({skills.length})
            </TabsTrigger>
            <TabsTrigger value="DRAFT" className="text-xs">
              Drafts ({skills.filter((s) => s.status === "DRAFT").length})
            </TabsTrigger>
            <TabsTrigger value="PUBLISHED" className="text-xs">
              Published ({skills.filter((s) => s.status === "PUBLISHED").length})
            </TabsTrigger>
            <TabsTrigger value="ARCHIVED" className="text-xs">
              Archived ({skills.filter((s) => s.status === "ARCHIVED").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Skills Table */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          title={`No ${filterTab === "ALL" ? "" : filterTab.toLowerCase()} skills`}
          description={
            filterTab === "DRAFT"
              ? "You don't have any unpublished drafts right now."
              : filterTab === "PUBLISHED"
              ? "You haven't published any skills to the marketplace yet."
              : "Create a new skill in the studio or import a repository from GitHub."
          }
          actionLabel="Create Skill"
          actionHref="/skills/new"
        />
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
                <th className="p-3.5">Last Updated</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A211D]">
              {filteredSkills.map((skill) => {
                const latestVersion = skill.versions?.[0]?.version || "1.0.0";
                const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
                const upvotes = skill.upvoteCount ?? skill._count?.upvotes ?? 0;

                return (
                  <tr key={skill.id} className="hover:bg-[#141916]/40 transition-colors">
                    <td className="p-3.5 pl-4 font-semibold text-[#F1F4EF]">
                      <div className="flex flex-col">
                        <Link
                          href={skill.status === "PUBLISHED" ? `/skills/${skill.slug}` : `/skills/${skill.id}/edit`}
                          className="hover:text-[#CCD7C5] transition-colors"
                        >
                          {skill.name}
                        </Link>
                        <span className="text-[11px] font-mono text-[#707A72] truncate max-w-xs">
                          {skill.slug}
                        </span>
                      </div>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <Button asChild variant="secondary" size="xs">
                          <Link href={`/skills/${skill.id}/edit`}>
                            <Edit2 className="h-3 w-3 mr-1" />
                            Studio
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="iconSm">
                              <MoreVertical className="h-3.5 w-3.5 text-[#707A72]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-[#0E1210]">
                            {skill.status === "PUBLISHED" && (
                              <DropdownMenuItem asChild>
                                <Link href={`/skills/${skill.slug}`} className="gap-2">
                                  <Eye className="h-3.5 w-3.5 text-[#CCD7C5]" />
                                  <span>View Public</span>
                                </Link>
                              </DropdownMenuItem>
                            )}

                            {skill.status === "PUBLISHED" && (
                              <DropdownMenuItem
                                onClick={() => archiveMutation.mutate(skill.id)}
                                className="gap-2"
                              >
                                <Archive className="h-3.5 w-3.5 text-[#AAB8A3]" />
                                <span>Archive</span>
                              </DropdownMenuItem>
                            )}

                            {skill.status === "ARCHIVED" && (
                              <DropdownMenuItem
                                onClick={() => restoreMutation.mutate(skill.id)}
                                className="gap-2"
                              >
                                <RotateCcw className="h-3.5 w-3.5 text-[#9FBEA5]" />
                                <span>Restore to Draft</span>
                              </DropdownMenuItem>
                            )}

                            {skill.status === "DRAFT" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  danger
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete draft "${skill.name}"?`)) {
                                      deleteMutation.mutate(skill.id);
                                    }
                                  }}
                                  className="gap-2"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete Draft</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
