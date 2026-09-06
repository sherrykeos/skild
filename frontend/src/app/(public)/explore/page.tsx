"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Boxes,
  Code2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag as TagIcon,
  X,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/categories";
import { marketplaceApi } from "@/lib/api/marketplace";
import { LoadingState } from "@/components/common/loading-state";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = (searchParams.get("sort") as "latest" | "popular" | "upvotes") || "latest";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<"latest" | "popular" | "upvotes">(initialSort);
  const [page, setPage] = useState(initialPage);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort !== "latest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));

    const newQuery = params.toString();
    const newUrl = newQuery ? `/explore?${newQuery}` : "/explore";
    router.replace(newUrl, { scroll: false });
  }, [search, category, sort, page, router]);

  // Query marketplace
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace-skills", { page, limit: 12, search, category, sort }],
    queryFn: () =>
      marketplaceApi.getSkills({
        page,
        limit: 12,
        search: search || undefined,
        category: category || undefined,
        sort,
      }),
  });

  const skills = data?.skills || [];
  const pagination = data?.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSort("latest");
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || category || sort !== "latest");

  return (
    <PageContainer>
      <PageHeader
        title="Explore Skills"
        description="Discover and integrate reusable agentic capabilities built by the developer community."
        badge={`${pagination.total || 0} Skills`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Category Filter (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 border border-[#252D28] rounded-[8px] bg-[#0E1210] p-4 space-y-3 sticky top-20">
          <div className="flex items-center justify-between border-b border-[#252D28] pb-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#707A72]">
              Categories
            </span>
            {category && (
              <button
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
                className="text-[11px] text-[#CCD7C5] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setCategory("");
                setPage(1);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs transition-colors text-left ${
                category === ""
                  ? "bg-[#141916] text-[#CCD7C5] font-semibold border border-[#252D28]"
                  : "text-[#A9B1AA] hover:bg-[#141916]/60 hover:text-[#F1F4EF]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Boxes className="h-3.5 w-3.5" />
                <span>All Categories</span>
              </div>
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setCategory(cat.slug);
                    setPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs transition-colors text-left ${
                    isSelected
                      ? "bg-[#141916] text-[#CCD7C5] font-semibold border border-[#252D28]"
                      : "text-[#A9B1AA] hover:bg-[#141916]/60 hover:text-[#F1F4EF]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <TagIcon className="h-3.5 w-3.5 text-[#707A72]" />
                    <span className="truncate">{cat.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Marketplace Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Filter Bar */}
          <MarketplaceFilters
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            selectedCategory={category}
            onCategoryChange={(val) => {
              setCategory(val);
              setPage(1);
            }}
            selectedSort={sort}
            onSortChange={(val) => {
              setSort(val);
              setPage(1);
            }}
            onReset={handleReset}
            hasActiveFilters={hasActiveFilters}
            totalCount={pagination.total}
          />

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {search && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#141916] border border-[#252D28] text-[#F1F4EF]">
                  <span>Query: &quot;{search}&quot;</span>
                  <button onClick={() => setSearch("")} className="text-[#707A72] hover:text-[#F1F4EF]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#CCD7C5]/10 border border-[#CCD7C5]/30 text-[#CCD7C5]">
                  <span>Category: {CATEGORIES.find((c) => c.slug === category)?.name || category}</span>
                  <button onClick={() => setCategory("")} className="text-[#CCD7C5] hover:text-[#F1F4EF]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Skills Grid */}
          <SkillGrid
            skills={skills}
            isLoading={isLoading}
            emptyTitle="No matching skills found"
            emptyDescription="No skills matched your filter criteria. Try adjusting your query or resetting filters."
            actionLabel="Reset Filters"
            onAction={handleReset}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#252D28]">
              <div className="text-xs text-[#707A72] font-mono">
                Page <span className="text-[#F1F4EF] font-medium">{pagination.page}</span> of{" "}
                <span className="text-[#F1F4EF] font-medium">{pagination.totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  variant="secondary"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages || isLoading}
                  variant="secondary"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingState message="Loading marketplace..." />}>
      <ExploreContent />
    </Suspense>
  );
}
