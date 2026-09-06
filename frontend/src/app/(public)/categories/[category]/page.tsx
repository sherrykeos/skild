"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ArrowLeft, Boxes, Filter } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/categories";
import { marketplaceApi } from "@/lib/api/marketplace";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const categorySlug = decodeURIComponent(resolvedParams.category).toLowerCase();

  const categoryMeta = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === categorySlug
  );

  const { data, isLoading } = useQuery({
    queryKey: ["category-skills", categorySlug],
    queryFn: () => marketplaceApi.getSkills({ category: categorySlug, limit: 20 }),
  });

  const skills = data?.skills || [];
  const total = data?.pagination?.total || skills.length;

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#707A72] mb-6">
        <Link href="/explore" className="hover:text-[#CCD7C5] transition-colors">
          Explore
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/categories" className="hover:text-[#CCD7C5] transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#F1F4EF] font-medium capitalize">
          {categoryMeta?.name || categorySlug}
        </span>
      </nav>

      <PageHeader
        title={categoryMeta ? `${categoryMeta.name} Skills` : `${categorySlug} Skills`}
        description={
          categoryMeta?.description ||
          `Browse all public agentic skills tagged under ${categorySlug}.`
        }
        badge={`${total} Skills`}
        action={
          <Button asChild variant="secondary" size="sm">
            <Link href={`/explore?category=${encodeURIComponent(categorySlug)}`}>
              <Filter className="h-3.5 w-3.5 mr-1.5 text-[#CCD7C5]" />
              Filter in Marketplace
            </Link>
          </Button>
        }
      />

      <SkillGrid
        skills={skills}
        isLoading={isLoading}
        emptyTitle={`No ${categoryMeta?.name || categorySlug} skills yet`}
        emptyDescription="Be the first developer to publish a skill in this category!"
        actionLabel="Publish a Skill"
        onAction={() => router.push("/skills/new")}
      />
    </PageContainer>
  );
}
