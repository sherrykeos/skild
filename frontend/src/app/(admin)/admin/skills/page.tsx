"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileCode,
  Search,
  Filter,
  Eye,
  Trash2,
  Undo2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Layers,
  Download,
  ThumbsUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi, AdminSkillsResponse } from "@/lib/api/admin";
import { LoadingState } from "@/components/common/loading-state";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminSkillsPage() {
  const [data, setData] = useState<AdminSkillsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal actions
  const [skillToUnpublish, setSkillToUnpublish] = useState<any | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getSkills({
        q: searchQuery,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: currentPage,
        limit: 20,
      });
      setData(res);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load skills list.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, currentPage]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleUnpublish = async () => {
    if (!skillToUnpublish) return;
    try {
      setActionLoading(true);
      await adminApi.unpublishSkill(skillToUnpublish.id);
      toast.success(`Skill "${skillToUnpublish.name}" reverted to Draft.`);
      setSkillToUnpublish(null);
      fetchSkills();
    } catch (err: any) {
      toast.error(err?.message || "Failed to unpublish skill.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    try {
      setActionLoading(true);
      await adminApi.deleteSkill(skillToDelete.id);
      toast.success(`Skill "${skillToDelete.name}" deleted.`);
      setSkillToDelete(null);
      fetchSkills();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete skill.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#252D28] pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F1F4EF] flex items-center gap-2">
            <FileCode className="h-6 w-6 text-[#30E87F]" />
            <span>Skills Moderation &amp; Content Control</span>
          </h1>
          <p className="mt-1 text-xs text-[#A9B1AA]">
            Review all skills across drafts, published, and archived states. Unpublish or delete non-compliant submissions.
          </p>
        </div>

        <Button
          onClick={() => fetchSkills()}
          variant="outline"
          size="sm"
          className="border-[#252D28] bg-[#0E1210] text-xs text-[#F1F4EF] hover:bg-[#141916]"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5 text-[#707A72]" />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#252D28] bg-[#0E1210] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#707A72]" />
          <Input
            type="text"
            placeholder="Search by skill name, slug, or keywords..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border-[#252D28] bg-[#141916] pl-9 text-xs text-[#F1F4EF] placeholder:text-[#707A72]"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] border-[#252D28] bg-[#141916] text-xs text-[#F1F4EF]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-[#252D28] bg-[#0E1210] text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-[#252D28] bg-[#0E1210] shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingState message="Loading skills repository..." />
          </div>
        ) : !data || data.skills.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#707A72]">
            No skills match the selected query or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#252D28] bg-[#141916] font-mono uppercase text-[#707A72]">
                <tr>
                  <th className="px-4 py-3">Skill</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Telemetry</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A211D]">
                {data.skills.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-[#141916]/50">
                    {/* Skill Info */}
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/skills/${s.slug}`}
                            target="_blank"
                            className="font-semibold text-[#F1F4EF] hover:text-[#30E87F] hover:underline"
                          >
                            {s.name}
                          </Link>
                          <ExternalLink className="h-3 w-3 text-[#707A72]" />
                        </div>
                        <p className="max-w-xs truncate text-[11px] text-[#707A72]">
                          {s.description}
                        </p>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-[#252D28]">
                          <AvatarImage src={s.author.avatar || undefined} alt={s.author.username} />
                          <AvatarFallback className="text-[9px]">{getInitials(s.author.username)}</AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/users/${s.author.username}`}
                          target="_blank"
                          className="text-xs text-[#CCD7C5] hover:underline"
                        >
                          @{s.author.username}
                        </Link>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold ${
                          s.status === "PUBLISHED"
                            ? "border border-[#30E87F]/40 bg-[#30E87F]/10 text-[#30E87F]"
                            : s.status === "DRAFT"
                            ? "border border-[#E5C07B]/40 bg-[#E5C07B]/10 text-[#E5C07B]"
                            : "border border-[#252D28] bg-[#141916] text-[#707A72]"
                        }`}
                      >
                        {s.status}
                      </Badge>
                    </td>

                    {/* Telemetry */}
                    <td className="px-4 py-3 text-[#A9B1AA]">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span title="Downloads">
                          <Download className="mr-1 inline h-3 w-3 text-[#707A72]" />
                          {s._count.downloads}
                        </span>
                        <span>•</span>
                        <span title="Upvotes">
                          <ThumbsUp className="mr-1 inline h-3 w-3 text-[#30E87F]" />
                          {s._count.upvotes}
                        </span>
                        <span>•</span>
                        <span title="Versions">
                          <Layers className="mr-1 inline h-3 w-3 text-[#707A72]" />
                          {s._count.versions}v
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-[11px] text-[#707A72]">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === "PUBLISHED" && (
                          <Button
                            onClick={() => setSkillToUnpublish(s)}
                            variant="outline"
                            size="sm"
                            className="h-7 border-[#E5C07B]/40 px-2 text-[11px] text-[#E5C07B] hover:bg-[#E5C07B]/10"
                            title="Revert skill to draft status"
                          >
                            <Undo2 className="mr-1 h-3 w-3" />
                            Unpublish
                          </Button>
                        )}

                        <Button
                          onClick={() => setSkillToDelete(s)}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] text-[#707A72] hover:bg-[#C58F8F]/10 hover:text-[#C58F8F]"
                          title="Force delete skill"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#252D28] px-4 py-3 text-xs text-[#707A72]">
            <span>
              Showing Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} skills)
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={data.pagination.page <= 1}
                variant="outline"
                size="sm"
                className="h-7 border-[#252D28] bg-[#141916] text-xs text-[#F1F4EF]"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={data.pagination.page >= data.pagination.totalPages}
                variant="outline"
                size="sm"
                className="h-7 border-[#252D28] bg-[#141916] text-xs text-[#F1F4EF]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Unpublish Confirmation Modal */}
      <Dialog open={!!skillToUnpublish} onOpenChange={(open) => !open && setSkillToUnpublish(null)}>
        <DialogContent className="border-[#252D28] bg-[#0E1210] p-6 text-[#F1F4EF] sm:max-w-md">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E5C07B]/40 bg-[#E5C07B]/10 text-[#E5C07B]">
              <Undo2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Unpublish Skill "{skillToUnpublish?.name}"?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A9B1AA]">
              This will unpublish the skill and revert its status to <strong>DRAFT</strong>. It will no longer appear on the public marketplace until republished by the author.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSkillToUnpublish(null)}
              disabled={actionLoading}
              className="border-[#252D28] bg-transparent text-xs text-[#A9B1AA]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnpublish}
              disabled={actionLoading}
              className="bg-[#E5C07B] text-xs font-semibold text-[#080B0A] hover:bg-[#D4AD68]"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Delete Confirmation Modal */}
      <Dialog open={!!skillToDelete} onOpenChange={(open) => !open && setSkillToDelete(null)}>
        <DialogContent className="border-[#C58F8F]/40 bg-[#0E1210] p-6 text-[#F1F4EF] sm:max-w-md">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C58F8F]/60 bg-[#C58F8F]/15 text-[#C58F8F]">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-[#E8A0A0]">
              Permanently Delete Skill "{skillToDelete?.name}"?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A9B1AA]">
              This will permanently delete this skill and all associated versions, files, and ratings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSkillToDelete(null)}
              disabled={actionLoading}
              className="border-[#252D28] bg-transparent text-xs text-[#A9B1AA]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-[#C58F8F] text-xs font-semibold text-[#080B0A] hover:bg-[#B37878]"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
