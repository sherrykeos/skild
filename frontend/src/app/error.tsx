"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SkillAtlas Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080B0A] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md border border-[#C58F8F]/30 rounded-[10px] bg-[#0E1210] p-8 space-y-6 shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C58F8F]/15 border border-[#C58F8F]/40 text-[#C58F8F] mx-auto">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-[#F1F4EF]">Application Error</h1>
          <p className="text-xs text-[#A9B1AA] leading-relaxed">
            An unexpected error occurred in the client application.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-[6px] bg-[#141916] border border-[#252D28] text-xs font-mono text-[#C58F8F] text-left overflow-x-auto">
            {error.message}
          </div>
        )}

        <Button onClick={() => reset()} variant="primary" size="sm" className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>Reload Interface</span>
        </Button>
      </div>
    </div>
  );
}
