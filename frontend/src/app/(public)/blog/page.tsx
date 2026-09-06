import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export const BLOG_POSTS = [
  {
    slug: "designing-effective-agentic-skills",
    title: "Designing Effective Agentic Skills: A Practical Guide",
    description: "How to structure prompts, tool schemas, and multi-file instructions so autonomous AI agents execute tasks reliably.",
    author: "Sharad & SkillAtlas Team",
    date: "Sep 2026",
    readingTime: "6 min read",
    tag: "Architecture",
  },
  {
    slug: "immutability-in-agent-marketplaces",
    title: "Why Immutability Matters in Agent Marketplaces",
    description: "Understanding prompt drifts and why immutable version releases are critical for deterministic AI workflows.",
    author: "SkillAtlas Engineering",
    date: "Aug 2026",
    readingTime: "4 min read",
    tag: "Reliability",
  },
  {
    slug: "multi-file-skills-vs-single-prompts",
    title: "Multi-File Skills vs. Monolithic System Prompts",
    description: "Moving beyond single markdown files to structured skill directories with Python scripts, JSON schemas, and golden evals.",
    author: "SkillAtlas Engineering",
    date: "Jul 2026",
    readingTime: "5 min read",
    tag: "Engineering",
  },
];

export const metadata = {
  title: "Engineering Blog",
  description: "Technical articles on agentic skill design, prompt architecture, and agent runtimes.",
};

export default function BlogPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Engineering Blog"
        description="Deep dives into agentic systems, skill orchestration, prompt engineering, and deterministic agent workflows."
        badge="Technical Articles"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between p-6 rounded-[8px] border border-[#252D28] bg-[#0E1210] hover:border-[#CCD7C5]/40 hover:bg-[#141916] transition-all space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" className="text-[10px]">
                  {post.tag}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-[#707A72] font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#F1F4EF] group-hover:text-[#CCD7C5] transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-[#A9B1AA] leading-relaxed line-clamp-3">
                {post.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1A211D] flex items-center justify-between text-xs text-[#707A72] font-mono">
              <span>{post.date}</span>
              <span className="flex items-center gap-1 text-[#CCD7C5] group-hover:translate-x-1 transition-transform">
                <span>Read</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
