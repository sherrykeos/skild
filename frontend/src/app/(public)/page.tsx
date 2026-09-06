"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Boxes,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/constants/categories";
import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "@/lib/api/marketplace";
import { SkillGrid } from "@/components/marketplace/skill-grid";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch featured marketplace skills
  const { data, isLoading } = useQuery({
    queryKey: ["featured-skills"],
    queryFn: () => marketplaceApi.getSkills({ limit: 6, sort: "popular" }),
  });

  const featuredSkills = data?.skills || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#252D28] py-16 lg:py-24 bg-[#080B0A]">
        {/* Subtle grid background effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A211D_1px,transparent_1px),linear-gradient(to_bottom,#1A211D_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#CCD7C5]/30 bg-[#CCD7C5]/10 text-[#CCD7C5] text-xs font-mono tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Agentic Skills Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F1F4EF] leading-[1.1]">
                Build smarter agents <br />
                <span className="text-[#CCD7C5]">with reusable skills.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#A9B1AA] max-w-xl leading-relaxed">
                Discover, publish, and share agentic skills to supercharge your AI agents.
                From automation to research, everything your agent needs, in one place.
              </p>

              {/* Technical Hero Search Box */}
              <form onSubmit={handleSearch} className="max-w-xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-[#707A72]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skills, workflows, agents, tags..."
                    className="w-full h-13 rounded-[8px] border border-[#252D28] bg-[#0E1210] pl-12 pr-14 text-sm text-[#F1F4EF] placeholder:text-[#707A72] focus:outline-none focus:ring-2 focus:ring-[#CCD7C5] focus:border-transparent transition-all shadow-xl"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-2 p-2.5 rounded-[6px] bg-[#CCD7C5] text-[#080B0A] hover:bg-[#DCE5D7] transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild variant="primary" size="lg" className="shadow-md">
                  <Link href="/explore">
                    <span>Explore Skills</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>

                <Button asChild variant="secondary" size="lg">
                  <Link href="/skills/new">
                    <PlusCircle className="h-4 w-4 mr-2 text-[#CCD7C5]" />
                    <span>Publish a Skill</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Technical Atmosphere & Terminal Card */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-md rounded-[10px] border border-[#252D28] bg-[#0E1210] p-6 shadow-2xl space-y-4 relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#CCD7C5]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-[#252D28] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#C58F8F]/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#C9B98A]/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#9FBEA5]/80" />
                    <span className="text-[11px] font-mono text-[#707A72] ml-2">SKILL.md</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#CCD7C5] bg-[#CCD7C5]/10 px-2 py-0.5 rounded">
                    agentic-v1
                  </span>
                </div>

                <div className="font-mono text-xs text-[#A9B1AA] space-y-2 leading-relaxed">
                  <p className="text-[#CCD7C5] font-semibold"># React Code Reviewer</p>
                  <p className="text-[#707A72]">// Skills for a more capable AI future.</p>
                  <p>
                    <span className="text-[#9FB8B2]">---</span>
                    <br />
                    <span className="text-[#AAB8A3]">name:</span> &quot;react-reviewer&quot;
                    <br />
                    <span className="text-[#AAB8A3]">tools:</span> [&quot;ast-parser&quot;, &quot;lint-checker&quot;]
                    <br />
                    <span className="text-[#9FB8B2]">---</span>
                  </p>
                  <p className="text-[#F1F4EF]">
                    Analyze component tree, detect unnecessary re-renders, and suggest accessible patterns with zero hallucination.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1A211D] flex items-center justify-between text-[11px] font-mono text-[#707A72]">
                  <span>Files: 4</span>
                  <span>License: MIT</span>
                  <span className="text-[#9FBEA5]">✓ Validated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-b border-[#252D28] bg-[#0E1210]/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#CCD7C5]">250K+</div>
              <div className="text-xs text-[#707A72] uppercase tracking-wider font-mono">Skills Available</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F1F4EF]">8.4K+</div>
              <div className="text-xs text-[#707A72] uppercase tracking-wider font-mono">Developers</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#9FB8B2]">1.2M+</div>
              <div className="text-xs text-[#707A72] uppercase tracking-wider font-mono">Downloads</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#9FBEA5]">Daily</div>
              <div className="text-xs text-[#707A72] uppercase tracking-wider font-mono">Growing Ecosystem</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Why SkillAtlas */}
      <section className="py-16 border-b border-[#252D28] bg-[#080B0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F4EF]">
              Serious developer tooling for agentic AI.
            </h2>
            <p className="text-sm text-[#A9B1AA]">
              Standardized, verifiable, and executable skills designed to plug into any autonomous agent runtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-[8px] border border-[#252D28] bg-[#0E1210] space-y-3 hover:border-[#CCD7C5]/40 transition-colors">
              <div className="h-10 w-10 rounded-[6px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#CCD7C5]">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F1F4EF]">Open Source Friendly</h3>
              <p className="text-xs text-[#A9B1AA] leading-relaxed">
                Build together with transparent community-driven skills. Inspect, fork, and verify before running in your agents.
              </p>
            </div>

            <div className="p-6 rounded-[8px] border border-[#252D28] bg-[#0E1210] space-y-3 hover:border-[#CCD7C5]/40 transition-colors">
              <div className="h-10 w-10 rounded-[6px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#9FB8B2]">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F1F4EF]">Developer First</h3>
              <p className="text-xs text-[#A9B1AA] leading-relaxed">
                Built for builders. Manage skills like code with semantic versioning, file trees, and instant CLI installation.
              </p>
            </div>

            <div className="p-6 rounded-[8px] border border-[#252D28] bg-[#0E1210] space-y-3 hover:border-[#CCD7C5]/40 transition-colors">
              <div className="h-10 w-10 rounded-[6px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#AAB8A3]">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F1F4EF]">Real World Use</h3>
              <p className="text-xs text-[#A9B1AA] leading-relaxed">
                Production-ready skills engineered for autonomous reasoning, browser manipulation, research synthesis, and coding.
              </p>
            </div>

            <div className="p-6 rounded-[8px] border border-[#252D28] bg-[#0E1210] space-y-3 hover:border-[#CCD7C5]/40 transition-colors">
              <div className="h-10 w-10 rounded-[6px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#9FBEA5]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F1F4EF]">Standardized Format</h3>
              <p className="text-xs text-[#A9B1AA] leading-relaxed">
                Adheres strictly to the SKILL.md specification with support for scripts, references, prompt assets, and examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-16 border-b border-[#252D28] bg-[#0E1210]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#F1F4EF]">
                Popular Agentic Skills
              </h2>
              <p className="text-xs text-[#A9B1AA] mt-1">
                Top downloaded and upvoted skills by the builder community.
              </p>
            </div>

            <Button asChild variant="secondary" size="sm">
              <Link href="/explore">
                <span>View All Skills</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <SkillGrid
            skills={featuredSkills}
            isLoading={isLoading}
            emptyTitle="Marketplace is ready"
            emptyDescription="Explore skills or publish your first skill to seed the marketplace."
            actionLabel="Explore Skills"
            onAction={() => router.push("/explore")}
          />
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="py-16 border-b border-[#252D28] bg-[#080B0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#F1F4EF]">
                Browse by Category
              </h2>
              <p className="text-xs text-[#A9B1AA] mt-1">
                Find specialized skills categorized for your agent&apos;s objective.
              </p>
            </div>

            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/categories">All Categories →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-4 rounded-[8px] border border-[#252D28] bg-[#0E1210] hover:border-[#CCD7C5]/40 hover:bg-[#141916] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-[6px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#CCD7C5] group-hover:text-[#DCE5D7] group-hover:border-[#CCD7C5]/40 transition-colors">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#707A72] group-hover:text-[#F1F4EF] group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-semibold text-[#F1F4EF] group-hover:text-[#CCD7C5] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#707A72] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-b border-[#252D28] bg-[#0E1210]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F4EF]">
              How SkillAtlas Works
            </h2>
            <p className="text-sm text-[#A9B1AA]">
              A three-step developer pipeline to extend your agents with reusable capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-6 space-y-4 relative">
              <div className="font-mono text-2xl font-bold text-[#CCD7C5]">01</div>
              <h3 className="text-base font-bold text-[#F1F4EF]">Discover &amp; Inspect</h3>
              <p className="text-xs text-[#A9B1AA] leading-relaxed">
                Browse verified agentic skills, inspect the full directory tree, review the raw SKILL.md prompt instructions, and verify community reviews.
              </p>
            </div>

            <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-6 space-y-4 relative">
              <div className="font-mono text-2xl font-bold text-[#9FB8B2]">02</div>
              <h3 className="text-base font-bold text-[#F1F4EF]">Install &amp; Integrate</h3>
              <p className="text-xs text-[#A9B1AA] leading-relaxed">
                Download the standardized ZIP package or pull directly via the SkillAtlas CLI into your agent runtime or skills directory.
              </p>
            </div>

            <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-6 space-y-4 relative">
              <div className="font-mono text-2xl font-bold text-[#9FBEA5]">03</div>
              <h3 className="text-base font-bold text-[#F1F4EF]">Build, Version &amp; Share</h3>
              <p className="text-xs text-[#A9B1AA] leading-relaxed">
                Create new skills in our Monaco-powered creator studio or snapshot public GitHub repositories into immutable semantic versions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-16 bg-[#080B0A] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F1F4EF]">
            Ready to give your agents superpower skills?
          </h2>
          <p className="text-sm sm:text-base text-[#A9B1AA] max-w-xl mx-auto leading-relaxed">
            Join thousands of developers publishing and discovering reusable agent skills.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild variant="primary" size="lg">
              <Link href="/explore">Explore the Marketplace</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
