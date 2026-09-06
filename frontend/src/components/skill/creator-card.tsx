import React from "react";
import Link from "next/link";
import { User, Globe, ExternalLink, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SkillAuthor } from "@/types/skill";
import { getInitials } from "@/lib/utils";

interface CreatorCardProps {
  author?: SkillAuthor;
  sourceUrl?: string | null;
  sourceType?: string;
}

export function CreatorCard({ author, sourceUrl, sourceType }: CreatorCardProps) {
  if (!author) return null;

  return (
    <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-5 space-y-4">
      <div className="text-xs font-mono uppercase tracking-wider text-[#707A72]">
        Created By
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 border border-[#252D28]">
          <AvatarImage src={author.avatar || undefined} alt={author.username} />
          <AvatarFallback className="text-xs">{getInitials(author.username)}</AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-[#F1F4EF] truncate">
            @{author.username}
          </h4>
          <p className="text-xs text-[#A9B1AA]">Verified Creator</p>
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-2">
        <Button asChild variant="secondary" size="sm" className="w-full text-xs">
          <Link href={`/users/${author.username}`}>
            <User className="h-3.5 w-3.5 mr-1.5 text-[#CCD7C5]" />
            View Creator Profile
          </Link>
        </Button>

        {sourceUrl && (
          <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5">
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-3.5 w-3.5 text-[#CCD7C5]" />
              <span>Source Repository</span>
              <ExternalLink className="h-3 w-3 ml-auto text-[#707A72]" />
            </a>
          </Button>
        )}
      </div>

      {/* Metadata / Trust indicators */}
      <div className="pt-3 border-t border-[#1A211D] space-y-2 text-xs text-[#707A72] font-mono">
        <div className="flex items-center justify-between">
          <span>License</span>
          <span className="text-[#A9B1AA]">MIT Open Source</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Type</span>
          <span className="text-[#CCD7C5]">{sourceType === "GITHUB" ? "GitHub Snapshot" : "Native Skill"}</span>
        </div>
      </div>
    </div>
  );
}
