import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

interface SkillMarkdownViewProps {
  content: string;
}

export function SkillMarkdownView({ content }: SkillMarkdownViewProps) {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#0E1210] prose-pre:border prose-pre:border-[#252D28] prose-headings:text-[#F1F4EF] prose-a:text-[#CCD7C5] prose-strong:text-[#F1F4EF] prose-code:text-[#CCD7C5] prose-code:bg-[#141916] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none leading-relaxed text-sm text-[#A9B1AA]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF] border-b border-[#252D28] pb-2 mt-6 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#F1F4EF] border-b border-[#1A211D] pb-1.5 mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-[#F1F4EF] mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-3 text-sm text-[#A9B1AA] leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="my-3 pl-5 list-disc space-y-1 text-sm text-[#A9B1AA]">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 pl-5 list-decimal space-y-1 text-sm text-[#A9B1AA]">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#CCD7C5] bg-[#141916]/40 pl-4 py-1 my-3 text-sm italic text-[#A9B1AA]">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-[#252D28] rounded-[6px]">
              <table className="w-full text-left text-xs border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#141916] border-b border-[#252D28] text-[#F1F4EF]">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-[#1A211D]">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-[#141916]/40 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="p-3 font-semibold">{children}</th>,
          td: ({ children }) => <td className="p-3 text-[#A9B1AA]">{children}</td>,
          pre: ({ children }) => (
            <pre className="p-4 rounded-[8px] bg-[#0E1210] border border-[#252D28] font-mono text-xs overflow-x-auto my-4 text-[#F1F4EF]">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
