"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/categories";

interface MarketplaceFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSort: "latest" | "popular" | "upvotes";
  onSortChange: (sort: "latest" | "popular" | "upvotes") => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  totalCount?: number;
}

export function MarketplaceFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  onReset,
  hasActiveFilters,
  totalCount,
}: MarketplaceFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search skills, workflows, agents, keywords..."
            className="w-full h-10 rounded-[8px] border border-[#252D28] bg-[#0E1210] pl-9 pr-10 text-sm text-[#F1F4EF] placeholder:text-[#707A72] focus:outline-none focus:ring-1 focus:ring-[#CCD7C5] focus:border-[#CCD7C5]/60 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707A72] hover:text-[#F1F4EF] p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Select */}
          <div className="w-[160px] sm:w-[180px]">
            <Select
              value={selectedCategory}
              onValueChange={(val) => onCategoryChange(val === "all" ? "" : val)}
            >
              <SelectTrigger className="h-10 bg-[#0E1210] border-[#252D28] text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-[#0E1210] border-[#252D28]">
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Select */}
          <div className="w-[140px] sm:w-[150px]">
            <Select
              value={selectedSort}
              onValueChange={(val) => onSortChange(val as "latest" | "popular" | "upvotes")}
            >
              <SelectTrigger className="h-10 bg-[#0E1210] border-[#252D28] text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#0E1210] border-[#252D28]">
                <SelectItem value="latest">Latest Releases</SelectItem>
                <SelectItem value="popular">Most Downloads</SelectItem>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="h-10 text-xs text-[#A9B1AA] hover:text-[#C58F8F]"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Result Count and Active Badges */}
      <div className="flex items-center justify-between text-xs text-[#707A72] px-1 font-mono">
        <div>
          {typeof totalCount === "number" && (
            <span>Showing <span className="text-[#F1F4EF] font-semibold">{totalCount}</span> skills</span>
          )}
        </div>
      </div>
    </div>
  );
}
