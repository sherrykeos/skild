"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderHeart, Plus, Trash2, Edit2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { engagementApi } from "@/lib/api/engagement";
import { toast } from "sonner";

export default function CollectionsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["user-collections"],
    queryFn: () => engagementApi.getCollections(),
  });

  const collections = data?.collections || [];

  const createMutation = useMutation({
    mutationFn: async () => {
      await engagementApi.createCollection({
        name: name.trim(),
        description: description.trim() || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-collections"] });
      setCreateOpen(false);
      setName("");
      setDescription("");
      toast.success("Collection created!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to create collection."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => engagementApi.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-collections"] });
      toast.success("Collection deleted.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete collection."),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate();
  };

  if (isLoading) {
    return <LoadingState message="Loading your collections..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#252D28] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
            Skill Collections
          </h1>
          <p className="text-xs text-[#A9B1AA] mt-1">
            Group skills into curated bundles for specific agent objectives.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          variant="primary"
          size="sm"
          className="gap-1.5 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Collection</span>
        </Button>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="No collections created yet"
          description="Create your first collection like 'Frontend Agents' or 'Research Toolkit' to organize your skills."
          actionLabel="Create Collection"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col) => (
            <div
              key={col.id}
              className="p-5 rounded-[8px] border border-[#252D28] bg-[#0E1210] hover:border-[#CCD7C5]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-[6px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#CCD7C5]">
                    <FolderHeart className="h-4 w-4" />
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete collection "${col.name}"?`)) {
                        deleteMutation.mutate(col.id);
                      }
                    }}
                    className="p-1.5 text-[#707A72] hover:text-[#C58F8F] rounded hover:bg-[#C58F8F]/10 transition-colors"
                    title="Delete collection"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#F1F4EF]">{col.name}</h3>
                  <p className="text-xs text-[#A9B1AA] mt-1 line-clamp-2">
                    {col.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A211D] flex items-center justify-between">
                <span className="text-xs font-mono text-[#707A72]">
                  {col._count?.skills ?? col.skills?.length ?? 0} skills
                </span>
                <Button asChild variant="ghost" size="xs" className="text-xs text-[#CCD7C5] gap-1">
                  <Link href={`/collections/${col.id}`}>
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md bg-[#0E1210] border-[#252D28]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#F1F4EF]">
              Create New Collection
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A9B1AA]">
              Bundle multiple agentic skills into a themed toolkit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Collection Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Autonomous Research Toolkit"
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Description (Optional)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what these skills accomplish together..."
                className="min-h-[80px] text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                onClick={() => setCreateOpen(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !name.trim()}
                variant="primary"
                size="sm"
                className="font-semibold"
              >
                {createMutation.isPending ? "Creating..." : "Create Collection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
