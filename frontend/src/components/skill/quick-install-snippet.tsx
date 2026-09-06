"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface QuickInstallSnippetProps {
  slug: string;
}

export function QuickInstallSnippet({ slug }: QuickInstallSnippetProps) {
  const [copied, setCopied] = useState(false);
  const command = `npx skillatlas add ${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success("CLI command copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-4 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#707A72]">
        <div className="flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5 text-[#CCD7C5]" />
          <span>Quick Install</span>
        </div>
        <span>CLI</span>
      </div>

      <div className="flex items-center justify-between bg-[#080B0A] border border-[#252D28] rounded-[6px] px-3 py-2 text-xs font-mono text-[#F1F4EF]">
        <span className="truncate selection:bg-[#CCD7C5] selection:text-[#080B0A]">
          {command}
        </span>
        <button
          onClick={handleCopy}
          className="ml-2 p-1 rounded hover:bg-[#141916] text-[#707A72] hover:text-[#CCD7C5] transition-colors shrink-0"
          title="Copy command"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#9FBEA5]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
