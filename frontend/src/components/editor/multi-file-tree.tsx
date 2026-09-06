"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, FileCode, FileText, FileJson, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkillFile } from "@/types/skill";

interface MultiFileTreeProps {
  files: SkillFile[];
  selectedPath: string;
  onSelectFile: (path: string) => void;
  onAddFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onDeleteFile: (path: string) => void;
}

function getFileIcon(filename: string) {
  if (filename === "SKILL.md") return <FileCode className="h-4 w-4 text-[#CCD7C5]" />;
  if (filename.endsWith(".md") || filename.endsWith(".txt")) return <FileText className="h-4 w-4 text-[#9FB8B2]" />;
  if (filename.endsWith(".json") || filename.endsWith(".yaml") || filename.endsWith(".yml")) return <FileJson className="h-4 w-4 text-[#C9B98A]" />;
  return <FileCode className="h-4 w-4 text-[#AAB8A3]" />;
}

export function MultiFileTree({
  files,
  selectedPath,
  onSelectFile,
  onAddFile,
  onRenameFile,
  onDeleteFile,
}: MultiFileTreeProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFilePath, setNewFilePath] = useState("");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editFilePath, setEditFilePath] = useState("");

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFilePath.trim();
    if (!trimmed) return;
    if (files.some((f) => f.path.toLowerCase() === trimmed.toLowerCase())) {
      alert("A file with this path already exists.");
      return;
    }
    onAddFile(trimmed);
    setNewFilePath("");
    setIsAdding(false);
  };

  const handleStartRename = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (path === "SKILL.md") return;
    setEditingPath(path);
    setEditFilePath(path);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPath) return;
    const trimmed = editFilePath.trim();
    if (!trimmed || trimmed === editingPath) {
      setEditingPath(null);
      return;
    }
    onRenameFile(editingPath, trimmed);
    setEditingPath(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#080B0A]/60 border-r border-[#252D28] w-full lg:w-60 shrink-0">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-[#252D28] flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-[#707A72]">
          Files ({files.length})
        </span>
        <Button
          onClick={() => setIsAdding(true)}
          variant="ghost"
          size="xs"
          className="h-6 px-1.5 text-xs text-[#CCD7C5] gap-1 hover:bg-[#141916]"
          title="Create New File"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </Button>
      </div>

      {/* New File Inline Form */}
      {isAdding && (
        <form onSubmit={handleCreateFile} className="p-2 border-b border-[#252D28] space-y-1.5 bg-[#141916]">
          <Input
            type="text"
            placeholder="scripts/parser.py"
            value={newFilePath}
            onChange={(e) => setNewFilePath(e.target.value)}
            autoFocus
            className="h-7 text-xs font-mono"
          />
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              onClick={() => setIsAdding(false)}
              variant="ghost"
              size="xs"
              className="h-6 px-2 text-[10px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="xs"
              className="h-6 px-2 text-[10px]"
            >
              Add
            </Button>
          </div>
        </form>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.map((file) => {
          const isSelected = selectedPath === file.path;
          const isSkillMd = file.path === "SKILL.md";
          const isEditingThis = editingPath === file.path;

          if (isEditingThis) {
            return (
              <form key={file.path} onSubmit={handleSaveRename} className="flex items-center gap-1 p-1">
                <Input
                  type="text"
                  value={editFilePath}
                  onChange={(e) => setEditFilePath(e.target.value)}
                  autoFocus
                  className="h-7 text-xs font-mono"
                />
                <button type="submit" className="p-1 text-[#9FBEA5] hover:bg-[#141916] rounded">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPath(null)}
                  className="p-1 text-[#707A72] hover:bg-[#141916] rounded"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            );
          }

          return (
            <div
              key={file.path}
              onClick={() => onSelectFile(file.path)}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-xs font-mono cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[#141916] text-[#CCD7C5] border border-[#252D28] font-semibold"
                  : "text-[#A9B1AA] hover:bg-[#141916]/60 hover:text-[#F1F4EF]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(file.path)}
                <span className="truncate">{file.path}</span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isSkillMd && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(file.path, e)}
                      className="p-1 text-[#707A72] hover:text-[#CCD7C5] rounded"
                      title="Rename file"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete file "${file.path}"?`)) {
                          onDeleteFile(file.path);
                        }
                      }}
                      className="p-1 text-[#707A72] hover:text-[#C58F8F] rounded"
                      title="Delete file"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
