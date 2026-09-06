"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderHeart, ArrowLeft, Trash2, Plus, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { engagementApi } from "@/lib/api/engagement";
import { toast } from "sonner";

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const collectionId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-collections"],
    queryFn: () => engagementApi.getCollections(),
  });

  const collections = data?.collections || [];
  const collection = collections.find((c) => c.id === collectionId);

  const skills = collection?.skills?.map((s) => s.skill).filter(Boolean) || [];

  const deleteCollectionMutation = useMutation({
    mutationFn: () => engagementApi.deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-collections"] });
      toast.success("Collection deleted.");
      router.push("/collections");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete collection."),
  });

  if (isLoading) {
    return <LoadingState message="Loading collection details..." />;
  }

  if (isError || !collection) {
    return (
      <ErrorState
        title="Collection Not Found"
        message="The requested collection could not be found."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#252D28] pb-6">
        <div className="space-y-1">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs text-[#707A72] hover:text-[#CCD7C5] transition-colors font-mono mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Collections</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
              {collection.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-[#CCD7C5]/30 bg-[#CCD7C5]/10 text-[#CCD7C5]">
              {skills.length} Skills
            </span>
          </div>
          {collection.description && (
            <p className="text-xs text-[#A9B1AA] max-w-xl leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Link href="/explore">
              <Compass className="h-3.5 w-3.5 text-[#CCD7C5]" />
              <span>Browse to Add Skills</span>
            </Link>
          </Button>

          <Button
            onClick={() => {
              if (confirm(`Delete collection "${collection.name}"?`)) {
                deleteCollectionMutation.mutate();
              }
            }}
            variant="danger"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Collection</span>
          </Button>
        </div>
      </div>

      {/* Skills in Collection */}
      <SkillGrid
        skills={skills}
        emptyTitle="This collection is empty"
        emptyDescription="Explore skills in the marketplace and add them to this collection."
        actionLabel="Explore Skills"
        actionHref="/explore"
      />
    </div>
  );
}
