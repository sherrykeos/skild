"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Copy, Check, FileCode } from "lucide-react";
import { SkillFileTree } from "./skill-file-tree";
import { SkillFile } from "@/types/skill";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[450px]" />,
});

interface SkillFileViewerProps {
  files: SkillFile[];
}

function getMonacoLanguage(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".md")) return "markdown";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".js") || lower.endsWith(".jsx")) return "javascript";
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript";
  if (lower.endsWith(".py")) return "python";
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "yaml";
  if (lower.endsWith(".html")) return "html";
  if (lower.endsWith(".css")) return "css";
  return "plaintext";
}

export function SkillFileViewer({ files }: SkillFileViewerProps) {
  const defaultFile = files.find((f) => f.path === "SKILL.md") || files[0];
  const [selectedFile, setSelectedFile] = useState<SkillFile | null>(defaultFile || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedFile && files.length > 0) {
      setSelectedFile(files.find((f) => f.path === "SKILL.md") || files[0]);
    }
  }, [files, selectedFile]);

  const handleCopy = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      toast.success("File content copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="p-8 text-center border border-[#252D28] rounded-[8px] bg-[#0E1210] text-[#A9B1AA] text-sm">
        No files attached to this version.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row border border-[#252D28] rounded-[8px] bg-[#0E1210] overflow-hidden min-h-[500px]">
      {/* Left Sidebar: File Tree */}
      <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-[#252D28] bg-[#080B0A]/50 flex flex-col">
        <div className="px-4 py-2.5 border-b border-[#252D28] flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#707A72]">
            Files ({files.length})
          </span>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[220px] lg:max-h-[550px]">
          <SkillFileTree
            files={files}
            selectedPath={selectedFile?.path || ""}
            onSelectFile={setSelectedFile}
          />
        </div>
      </div>

      {/* Right Pane: Code / Monaco Viewer */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0E1210]">
        {selectedFile ? (
          <>
            {/* File Path Header & Actions */}
            <div className="h-10 px-4 border-b border-[#252D28] bg-[#141916]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#F1F4EF] truncate">
                <FileCode className="h-3.5 w-3.5 text-[#CCD7C5]" />
                <span className="truncate">{selectedFile.path}</span>
                <span className="text-[#707A72] text-[10px]">
                  ({selectedFile.content.split("\n").length} lines)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#141916] border border-[#252D28] text-[10px] font-mono text-[#A9B1AA] uppercase">
                  {getMonacoLanguage(selectedFile.path)}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#141916] text-xs text-[#A9B1AA] hover:text-[#F1F4EF] transition-colors"
                  title="Copy file content"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-[#9FBEA5]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="text-[11px] font-mono">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Monaco Read-only View */}
            <div className="flex-1 min-h-[460px]">
              <Editor
                height="100%"
                language={getMonacoLanguage(selectedFile.path)}
                value={selectedFile.content}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  lineNumbers: "on",
                  renderLineHighlight: "none",
                  padding: { top: 12, bottom: 12 },
                  folding: true,
                  automaticLayout: true,
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-xs text-[#707A72]">
            Select a file from the tree to view its content.
          </div>
        )}
      </div>
    </div>
  );
}
