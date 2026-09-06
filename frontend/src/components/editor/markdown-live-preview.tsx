import React from "react";
import { SkillMarkdownView } from "@/components/skill/skill-markdown-view";

interface MarkdownLivePreviewProps {
  content: string;
}

export function MarkdownLivePreview({ content }: MarkdownLivePreviewProps) {
  return (
    <div className="h-full overflow-y-auto p-5 bg-[#0E1210] border-l border-[#252D28]">
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#707A72] border-b border-[#252D28] pb-2 mb-4">
        Live Markdown Preview
      </div>
      <SkillMarkdownView content={content || "*No content written yet.*"} />
    </div>
  );
}
