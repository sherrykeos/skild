"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  FileCode,
  FolderTree,
  GitBranch,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { SkillHeader } from "@/components/skill/skill-header";
import { SkillMarkdownView } from "@/components/skill/skill-markdown-view";
import { SkillFileViewer } from "@/components/skill/skill-file-viewer";
import { SkillVersionList } from "@/components/skill/skill-version-list";
import { ReviewCard } from "@/components/skill/review-card";
import { ReviewForm } from "@/components/skill/review-form";
import { CreatorCard } from "@/components/skill/creator-card";
import { QuickInstallSnippet } from "@/components/skill/quick-install-snippet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { marketplaceApi } from "@/lib/api/marketplace";
import { engagementApi } from "@/lib/api/engagement";
import { toast } from "sonner";

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const queryClient = useQueryClient();
  const [copiedSkillMd, setCopiedSkillMd] = useState(false);

  // Fetch skill details
  const {
    data: skill,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["skill-detail", slug],
    queryFn: () => marketplaceApi.getSkillBySlug(slug),
  });

  // Fetch reviews
  const { data: reviewsData } = useQuery({
    queryKey: ["skill-reviews", skill?.id],
    queryFn: () => engagementApi.getReviews(skill!.id),
    enabled: Boolean(skill?.id),
  });

  const reviews = reviewsData?.reviews || [];

  // Review Mutations
  const createReviewMutation = useMutation({
    mutationFn: (content: string) => engagementApi.createReview(skill!.id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill-reviews", skill?.id] });
      queryClient.invalidateQueries({ queryKey: ["skill-detail", slug] });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      engagementApi.updateReview(reviewId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill-reviews", skill?.id] });
      toast.success("Review updated successfully!");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => engagementApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill-reviews", skill?.id] });
      queryClient.invalidateQueries({ queryKey: ["skill-detail", slug] });
      toast.success("Review deleted.");
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading skill specification and files..." />
      </PageContainer>
    );
  }

  if (isError || !skill) {
    return (
      <PageContainer>
        <ErrorState
          title="Skill Not Found"
          message="The requested skill could not be found or may have been unpublished."
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  // Get active version files and SKILL.md
  const latestVersion = skill.versions?.[0];
  const files = latestVersion?.files || [];
  const skillMdFile = files.find((f) => f.path === "SKILL.md") || files[0];
  const skillMdContent = skillMdFile?.content || `# ${skill.name}\n\n${skill.description}`;

  const handleCopySkillMd = () => {
    navigator.clipboard.writeText(skillMdContent);
    setCopiedSkillMd(true);
    toast.success("SKILL.md content copied!");
    setTimeout(() => setCopiedSkillMd(false), 2000);
  };

  return (
    <PageContainer>
      {/* Skill Header */}
      <SkillHeader skill={skill} />

      {/* Main Content Layout (Tabs on left, Sidebar on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        {/* Main Tabs Area */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto h-10 p-1 border border-[#252D28] bg-[#0E1210]">
              <TabsTrigger value="overview" className="gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="skillmd" className="gap-1.5 text-xs font-mono">
                <FileCode className="h-3.5 w-3.5" />
                <span>SKILL.md</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="gap-1.5 text-xs">
                <FolderTree className="h-3.5 w-3.5" />
                <span>Files ({files.length})</span>
              </TabsTrigger>
              <TabsTrigger value="versions" className="gap-1.5 text-xs">
                <GitBranch className="h-3.5 w-3.5" />
                <span>Versions ({skill.versions?.length || 1})</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-1.5 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Reviews ({reviews.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-6">
                <SkillMarkdownView content={skillMdContent} />
              </div>
            </TabsContent>

            {/* SKILL.md Raw Code Tab */}
            <TabsContent value="skillmd" className="mt-6 space-y-4">
              <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] overflow-hidden">
                <div className="h-10 px-4 border-b border-[#252D28] bg-[#141916]/40 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#CCD7C5]">SKILL.md</span>
                  <button
                    onClick={handleCopySkillMd}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#141916] text-xs text-[#A9B1AA] hover:text-[#F1F4EF] transition-colors"
                  >
                    {copiedSkillMd ? (
                      <Check className="h-3.5 w-3.5 text-[#9FBEA5]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="text-[11px] font-mono">{copiedSkillMd ? "Copied" : "Copy Raw"}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-[#F1F4EF] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {skillMdContent}
                </pre>
              </div>
            </TabsContent>

            {/* Multi-File Viewer Tab */}
            <TabsContent value="files" className="mt-6">
              <SkillFileViewer files={files} />
            </TabsContent>

            {/* Versions History Tab */}
            <TabsContent value="versions" className="mt-6">
              <SkillVersionList versions={skill.versions || []} />
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6 space-y-6">
              <ReviewForm
                skillId={skill.id}
                onSubmit={async (content) => {
                  await createReviewMutation.mutateAsync(content);
                }}
              />

              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#707A72]">
                  Community Reviews ({reviews.length})
                </div>

                {reviews.length === 0 ? (
                  <div className="p-8 text-center border border-[#252D28] rounded-[8px] bg-[#0E1210] text-[#A9B1AA] text-xs">
                    No reviews yet. Be the first to share your experience with this skill!
                  </div>
                ) : (
                  reviews.map((r) => (
                    <ReviewCard
                      key={r.id}
                      review={r}
                      onUpdate={async (reviewId, content) => {
                        await updateReviewMutation.mutateAsync({ reviewId, content });
                      }}
                      onDelete={async (reviewId) => {
                        await deleteReviewMutation.mutateAsync(reviewId);
                      }}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick CLI snippet */}
          <QuickInstallSnippet slug={skill.slug} />

          {/* Creator Profile Card */}
          <CreatorCard
            author={skill.author}
            sourceUrl={skill.sourceUrl}
            sourceType={skill.sourceType}
          />

          {/* Category & Tags Card */}
          <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#707A72]">
              Categorization
            </div>
            {skill.category && (
              <div>
                <span className="text-[11px] text-[#707A72] block mb-1">Primary Category</span>
                <Link
                  href={`/categories/${skill.category.slug}`}
                  className="text-xs font-medium text-[#CCD7C5] hover:underline"
                >
                  {skill.category.name}
                </Link>
              </div>
            )}
            {skill.tags && skill.tags.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] text-[#707A72] block mb-1.5">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map((tag) => (
                    <Link
                      key={tag.id || tag.name}
                      href={`/explore?tag=${encodeURIComponent(tag.slug || tag.name)}`}
                    >
                      <Badge variant="outline" className="text-[11px] hover:border-[#CCD7C5]/40 transition-colors">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
