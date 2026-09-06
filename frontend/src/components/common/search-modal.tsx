"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, BookOpen, Boxes, Tag, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CATEGORIES } from "@/constants/categories";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      onOpenChange(false);
      router.push(`/explore?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  const navigateTo = (href: string) => {
    onOpenChange(false);
    router.push(href);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 border-[#252D28] bg-[#0E1210] overflow-hidden">
        <div className="flex items-center border-b border-[#252D28] px-4 py-3">
          <Search className="h-4 w-4 text-[#707A72] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search skills, categories, documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-[#F1F4EF] placeholder:text-[#707A72] focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-[#252D28] bg-[#141916] text-[10px] font-mono text-[#707A72]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[350px] overflow-y-auto p-2 space-y-4">
          {query.trim() ? (
            <div>
              <div className="px-2 py-1 text-[11px] font-mono text-[#707A72] uppercase tracking-wider">
                Search Query
              </div>
              <button
                onClick={() => navigateTo(`/explore?search=${encodeURIComponent(query.trim())}`)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-[#141916] text-left text-sm text-[#F1F4EF] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#CCD7C5]" />
                  <span>Search marketplace for &quot;<span className="text-[#CCD7C5] font-medium">{query}</span>&quot;</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#707A72] group-hover:text-[#F1F4EF] transition-colors" />
              </button>
            </div>
          ) : (
            <>
              <div>
                <div className="px-2 py-1 text-[11px] font-mono text-[#707A72] uppercase tracking-wider">
                  Quick Navigation
                </div>
                <div className="space-y-0.5 mt-1">
                  <button
                    onClick={() => navigateTo("/explore")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#141916] text-left text-sm text-[#A9B1AA] hover:text-[#F1F4EF] transition-colors"
                  >
                    <Compass className="h-4 w-4 text-[#CCD7C5]" />
                    <span>Explore All Skills</span>
                  </button>
                  <button
                    onClick={() => navigateTo("/categories")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#141916] text-left text-sm text-[#A9B1AA] hover:text-[#F1F4EF] transition-colors"
                  >
                    <Boxes className="h-4 w-4 text-[#9FB8B2]" />
                    <span>Browse Categories</span>
                  </button>
                  <button
                    onClick={() => navigateTo("/docs")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#141916] text-left text-sm text-[#A9B1AA] hover:text-[#F1F4EF] transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-[#AAB8A3]" />
                    <span>Developer Documentation</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="px-2 py-1 text-[11px] font-mono text-[#707A72] uppercase tracking-wider">
                  Popular Categories
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {CATEGORIES.slice(0, 6).map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => navigateTo(`/categories/${cat.slug}`)}
                      className="flex items-center gap-2 px-3 py-2 rounded-[6px] hover:bg-[#141916] text-left text-xs text-[#A9B1AA] hover:text-[#CCD7C5] transition-colors"
                    >
                      <Tag className="h-3 w-3 text-[#707A72]" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-[#252D28] px-4 py-2 bg-[#080B0A] flex items-center justify-between text-[11px] text-[#707A72]">
          <span>Navigate with ↵ Enter</span>
          <span>SkillAtlas Developer Marketplace</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
