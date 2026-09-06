import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div className={cn("relative flex items-center justify-center shrink-0", iconSizes[size])}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#CCD7C5] transition-transform group-hover:scale-105 duration-200"
        >
          {/* SkillAtlas geometric delta glyph */}
          <path
            d="M16 3L3 27H29L16 3Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 11L9 24H23L16 11Z"
            fill="currentColor"
            fillOpacity="0.25"
          />
          <circle cx="16" cy="18" r="2" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight text-[#F1F4EF] transition-colors group-hover:text-[#CCD7C5]", textSizes[size])}>
          Skill<span className="text-[#CCD7C5]">Atlas</span>
        </span>
      )}
    </Link>
  );
}
