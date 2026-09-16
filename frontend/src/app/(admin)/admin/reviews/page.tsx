"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Trash2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ExternalLink,
  MessageCircle,
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
import { adminApi, AdminReviewsResponse } from "@/lib/api/admin";
import { LoadingState } from "@/components/common/loading-state";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [data, setData] = useState<AdminReviewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [reviewToDelete, setReviewToDelete] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getReviews({
        q: searchQuery,
        page: currentPage,
        limit: 20,
      });
      setData(res);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load community reviews.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      setActionLoading(true);
      await adminApi.deleteReview(reviewToDelete.id);
      toast.success("Review removed by administrator.");
      setReviewToDelete(null);
      fetchReviews();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete review.");
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
            <MessageSquare className="h-6 w-6 text-[#30E87F]" />
            <span>Reviews &amp; Feedback Moderation</span>
          </h1>
          <p className="mt-1 text-xs text-[#A9B1AA]">
            Inspect feedback, remove spam or inappropriate comments, and maintain community quality.
          </p>
        </div>

        <Button
          onClick={() => fetchReviews()}
          variant="outline"
          size="sm"
          className="border-[#252D28] bg-[#0E1210] text-xs text-[#F1F4EF] hover:bg-[#141916]"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5 text-[#707A72]" />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-[#252D28] bg-[#0E1210] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#707A72]" />
          <Input
            type="text"
            placeholder="Search reviews by content, reviewer username, or skill title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border-[#252D28] bg-[#141916] pl-9 text-xs text-[#F1F4EF] placeholder:text-[#707A72]"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <Card className="overflow-hidden border-[#252D28] bg-[#0E1210] shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingState message="Loading community reviews..." />
          </div>
        ) : !data || data.reviews.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#707A72]">
            No reviews match the current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#252D28] bg-[#141916] font-mono uppercase text-[#707A72]">
                <tr>
                  <th className="px-4 py-3">Skill Target</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Review Content</th>
                  <th className="px-4 py-3">Posted</th>
                  <th className="px-4 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A211D]">
                {data.reviews.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-[#141916]/50">
                    {/* Skill Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Link
                          href={`/skills/${r.skill.slug}`}
                          target="_blank"
                          className="text-[#F1F4EF] hover:text-[#30E87F] hover:underline"
                        >
                          {r.skill.name}
                        </Link>
                        <ExternalLink className="h-3 w-3 text-[#707A72]" />
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-[#252D28]">
                          <AvatarImage src={r.user.avatar || undefined} alt={r.user.username} />
                          <AvatarFallback className="text-[9px]">{getInitials(r.user.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/users/${r.user.username}`}
                            target="_blank"
                            className="text-xs text-[#CCD7C5] hover:underline block"
                          >
                            @{r.user.username}
                          </Link>
                          <span className="text-[10px] text-[#707A72]">{r.user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Review Content */}
                    <td className="px-4 py-3">
                      <div className="max-w-md rounded bg-[#141916] border border-[#252D28] p-2 text-[11px] text-[#F1F4EF] leading-relaxed">
                        "{r.content}"
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-[11px] text-[#707A72]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <Button
                        onClick={() => setReviewToDelete(r)}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-[#707A72] hover:bg-[#C58F8F]/10 hover:text-[#C58F8F]"
                        title="Delete review"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span>Remove</span>
                      </Button>
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
              Showing Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} reviews)
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!reviewToDelete} onOpenChange={(open) => !open && setReviewToDelete(null)}>
        <DialogContent className="border-[#C58F8F]/40 bg-[#0E1210] p-6 text-[#F1F4EF] sm:max-w-md">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C58F8F]/60 bg-[#C58F8F]/15 text-[#C58F8F]">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-[#E8A0A0]">
              Permanently Remove Review?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A9B1AA]">
              This will permanently delete this review by @{reviewToDelete?.user.username} from the skill page. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {reviewToDelete && (
            <div className="my-2 rounded bg-[#141916] border border-[#252D28] p-3 text-xs text-[#A9B1AA] italic">
              "{reviewToDelete.content}"
            </div>
          )}

          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setReviewToDelete(null)}
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
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
