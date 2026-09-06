import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080B0A] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md border border-[#252D28] rounded-[10px] bg-[#0E1210] p-8 space-y-6 shadow-2xl">
        <div className="font-mono text-5xl font-extrabold text-[#CCD7C5]">404</div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-[#F1F4EF]">Page or Skill Not Found</h1>
          <p className="text-xs text-[#A9B1AA] leading-relaxed">
            The page, skill specification, or user handle you requested does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild variant="primary" size="sm" className="w-full sm:w-auto">
            <Link href="/explore">
              <Compass className="h-4 w-4 mr-1.5" />
              <span>Explore Marketplace</span>
            </Link>
          </Button>

          <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
