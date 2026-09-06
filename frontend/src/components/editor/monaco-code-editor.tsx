"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[480px]" />,
});

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export function MonacoCodeEditor({
  value,
  onChange,
  language = "markdown",
  readOnly = false,
}: MonacoCodeEditorProps) {
  return (
    <div className="w-full h-full min-h-[480px] bg-[#0E1210]">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "var(--font-mono)",
          lineNumbers: "on",
          renderLineHighlight: "all",
          padding: { top: 12, bottom: 12 },
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
