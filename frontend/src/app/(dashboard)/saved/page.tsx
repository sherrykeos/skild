"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, FolderHeart, Plus, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { engagementApi } from "@/lib/api/engagement";
import { toast } from "sonner";

export default function SavedPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("saved");

  const { data: savedData, isLoading: isLoadingSaved } = useQuery({
    queryKey: ["user-saved-skills"],
    queryFn: () => engagementApi.getSavedSkills(),
  });

  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["user-collections"],
    queryFn: () => engagementApi.getCollections(),
  });

  const savedSkills = savedData?.savedSkills?.map((item) => ({
    ...item.skill,
    hasSaved: true,
  })) || [];

  const collections = collectionsData?.collections || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#252D28] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
            My Library
          </h1>
          <p className="text-xs text-[#A9B1AA] mt-1">
            Bookmarked skills and custom collections for your autonomous agents.
          </p>
        </div>

        <Button asChild variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
          <Link href="/explore">
            <Compass className="h-3.5 w-3.5" />
            <span>Discover More Skills</span>
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0E1210] border-[#252D28]">
          <TabsTrigger value="saved" className="text-xs gap-1.5">
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Skills ({savedSkills.length})</span>
          </TabsTrigger>
          <TabsTrigger value="collections" className="text-xs gap-1.5">
            <FolderHeart className="h-3.5 w-3.5" />
            <span>Collections ({collections.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-6">
          {isLoadingSaved ? (
            <LoadingState message="Loading your saved skills..." />
          ) : (
            <SkillGrid
              skills={savedSkills}
              emptyTitle="You haven't saved any skills yet"
              emptyDescription="Explore the marketplace and bookmark skills to easily access and install them later."
              actionLabel="Explore Skills"
              actionHref="/explore"
              onSaveToggle={() => {
                queryClient.invalidateQueries({ queryKey: ["user-saved-skills"] });
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          {isLoadingCollections ? (
            <LoadingState message="Loading your collections..." />
          ) : collections.length === 0 ? (
            <EmptyState
              icon={FolderHeart}
              title="No collections created yet"
              description="Group skills into specialized agent toolkits like 'Frontend Agents' or 'Research Toolkit'."
              actionLabel="Create Collection"
              actionHref="/collections"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="group p-5 rounded-[8px] border border-[#252D28] bg-[#0E1210] hover:border-[#CCD7C5]/40 hover:bg-[#141916] transition-all space-y-3 shadow-sm block"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-[6px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#CCD7C5]">
                      <FolderHeart className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-mono text-[#CCD7C5] bg-[#CCD7C5]/10 px-2 py-0.5 rounded">
                      {col._count?.skills ?? col.skills?.length ?? 0} skills
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#F1F4EF] group-hover:text-[#CCD7C5] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#A9B1AA] mt-1 line-clamp-2">
                      {col.description || "Custom skill collection"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
