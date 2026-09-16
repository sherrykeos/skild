"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Layers,
  GitBranch,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Code2,
  Share2,
} from "lucide-react";

export default function BecomeCreatorPage() {
  const { user, isCreator, becomeCreator } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  const handleActivate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await becomeCreator();
      setActivated(true);
    } catch (err: any) {
      setError(err?.message || "Failed to activate Creator status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCreator || activated) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <div className="relative overflow-hidden rounded-xl border border-[#30E87F]/30 bg-gradient-to-b from-[#141A17] to-[#0E1210] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#30E87F]/40 bg-[#30E87F]/10 text-[#30E87F]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <Badge className="mb-3 border-[#30E87F]/30 bg-[#30E87F]/10 text-[#30E87F]">
            Creator Mode Active
          </Badge>
          <h1 className="text-2xl font-bold text-[#F1F4EF] sm:text-3xl">
            You're ready to publish on SkillAtlas!
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#A9B1AA]">
            Your account now has full Creator privileges. Start building and sharing agent skills with the community.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="w-full bg-[#30E87F] font-semibold text-[#080B0A] hover:bg-[#28C76D] sm:w-auto"
            >
              <Link href="/skills/new">
                Create First Skill
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-[#252D28] bg-[#141A17] text-[#F1F4EF] hover:bg-[#1A211D] sm:w-auto"
            >
              <Link href="/github-import">
                <GitBranch className="mr-2 h-4 w-4 text-[#30E87F]" />
                Import from GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#252D28] bg-gradient-to-b from-[#141A17] via-[#0E1210] to-[#080B0A] p-8 sm:p-10">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#30E87F]/5 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30E87F]/30 bg-[#30E87F]/10 px-3 py-1 text-xs font-semibold text-[#30E87F]">
            <Sparkles className="h-3.5 w-3.5" />
            1-Click Creator Activation
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F1F4EF] sm:text-4xl">
            Distribute Your Agent Skills to the World
          </h1>
          <p className="mt-3 text-base text-[#A9B1AA]">
            Turn your prompts, tools, and agent workflows into discoverable, version-controlled skills. Free for all developers.
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-[#C58F8F]/40 bg-[#C58F8F]/10 p-3 text-xs text-[#E8A0A0]">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={handleActivate}
              disabled={isLoading}
              className="bg-[#30E87F] font-bold text-[#080B0A] shadow-lg shadow-[#30E87F]/20 hover:bg-[#28C76D]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  Activate Creator Access Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <span className="text-xs text-[#707A72]">
              Instant activation • No review queue
            </span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#252D28] bg-[#0E1210] p-5 transition-all hover:border-[#30E87F]/30">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#30E87F]/30 bg-[#30E87F]/10 text-[#30E87F]">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#F1F4EF]">Versioned Skill Packaging</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#707A72]">
            Tag semantic versions (v1.0.0), write markdown changelogs, and maintain draft updates before pushing live.
          </p>
        </Card>

        <Card className="border-[#252D28] bg-[#0E1210] p-5 transition-all hover:border-[#30E87F]/30">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#30E87F]/30 bg-[#30E87F]/10 text-[#30E87F]">
            <GitBranch className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#F1F4EF]">GitHub 1-Click Import</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#707A72]">
            Sync tools directly from public GitHub repos. We extract folder trees and descriptions automatically.
          </p>
        </Card>

        <Card className="border-[#252D28] bg-[#0E1210] p-5 transition-all hover:border-[#30E87F]/30">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#30E87F]/30 bg-[#30E87F]/10 text-[#30E87F]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#F1F4EF]">Ecosystem Reach & Stats</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#707A72]">
            Track total installs, agent downloads, upvotes, and community reviews in real time on your creator dashboard.
          </p>
        </Card>
      </div>

      {/* Creator Checklist */}
      <div className="rounded-xl border border-[#252D28] bg-[#0E1210] p-6">
        <h3 className="text-base font-semibold text-[#F1F4EF]">What happens when you activate?</h3>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-3 text-sm text-[#A9B1AA]">
            <CheckCircle2 className="h-4 w-4 text-[#30E87F]" />
            You gain access to the "Create Skill" and "GitHub Import" features immediately.
          </li>
          <li className="flex items-center gap-3 text-sm text-[#A9B1AA]">
            <CheckCircle2 className="h-4 w-4 text-[#30E87F]" />
            Your public author profile shows your published skills and contributions.
          </li>
          <li className="flex items-center gap-3 text-sm text-[#A9B1AA]">
            <CheckCircle2 className="h-4 w-4 text-[#30E87F]" />
            You keep all standard user capabilities (bookmarking, upvoting, reviewing, downloading).
          </li>
        </ul>
      </div>
    </div>
  );
}
