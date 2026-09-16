"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { Sparkles, GitBranch, Layers, BarChart3, Loader2, ArrowRight } from "lucide-react";

interface BecomeCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  redirectTo?: string;
}

export function BecomeCreatorDialog({
  open,
  onOpenChange,
  onSuccess,
  redirectTo = "/skills/new",
}: BecomeCreatorDialogProps) {
  const { becomeCreator } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await becomeCreator();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to activate Creator mode. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#252D28] bg-[#0E1210] p-6 text-[#F1F4EF] shadow-2xl sm:max-w-lg">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#30E87F]/30 bg-[#30E87F]/10 text-[#30E87F]">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-[#F1F4EF]">
            Become a SkillAtlas Creator
          </DialogTitle>
          <DialogDescription className="text-sm text-[#A9B1AA]">
            Publish reusable agent skills, distribute AI tooling, and connect with developers across the ecosystem. Instant & free.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-[#C58F8F]/40 bg-[#C58F8F]/10 p-3 text-xs text-[#E8A0A0]">
            {error}
          </div>
        )}

        <div className="space-y-3 py-2">
          <div className="flex items-start gap-3 rounded-lg border border-[#1A211D] bg-[#141A17]/70 p-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#30E87F]/10 text-[#30E87F]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F1F4EF]">Publish & Version Skills</p>
              <p className="text-xs text-[#707A72]">
                Create drafts, manage versioned skill packages, and maintain changelogs effortlessly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-[#1A211D] bg-[#141A17]/70 p-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#30E87F]/10 text-[#30E87F]">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F1F4EF]">GitHub 1-Click Import</p>
              <p className="text-xs text-[#707A72]">
                Import repositories directly with automated file tree extraction and markdown conversion.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-[#1A211D] bg-[#141A17]/70 p-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#30E87F]/10 text-[#30E87F]">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F1F4EF]">Creator Telemetry & Feedback</p>
              <p className="text-xs text-[#707A72]">
                Monitor downloads, upvotes, and reviews as developers install your skills.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-start">
          <Button
            onClick={handleActivate}
            disabled={isLoading}
            className="w-full bg-[#30E87F] font-semibold text-[#080B0A] hover:bg-[#28C76D] sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                Activate Creator Mode
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-[#252D28] bg-transparent text-[#A9B1AA] hover:bg-[#1A211D] hover:text-[#F1F4EF]"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
