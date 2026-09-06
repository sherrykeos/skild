"use client";

import React, { useState } from "react";
import { GitBranch, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latestVersion?: string;
  onConfirm: (version: string, changelog: string) => Promise<void>;
}

export function NewVersionDialog({
  open,
  onOpenChange,
  latestVersion = "1.0.0",
  onConfirm,
}: NewVersionDialogProps) {
  // Suggest next minor semver (e.g. 1.0.0 -> 1.1.0)
  const parts = latestVersion.split(".").map(Number);
  const suggestedVersion = `${parts[0] || 1}.${(parts[1] || 0) + 1}.0`;

  const [version, setVersion] = useState(suggestedVersion);
  const [changelog, setChangelog] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(version.trim())) {
      setError("Version must follow semantic versioning (e.g., 1.1.0 or 2.0.0).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(version.trim(), changelog.trim());
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to create new version.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0E1210] border-[#252D28]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#CCD7C5] mb-1">
            <GitBranch className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-[#F1F4EF]">
              Create New Version Release
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#A9B1AA]">
            Create a new semantic release draft copying all files from the current version.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-2.5 rounded-[6px] bg-[#C58F8F]/10 border border-[#C58F8F]/30 text-xs text-[#C58F8F]">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F1F4EF]">Semantic Version</label>
            <Input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.1.0"
              required
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-[#707A72]">Current active version: v{latestVersion}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F1F4EF]">Release Changelog</label>
            <Textarea
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              placeholder="Document improvements, prompt changes, or bug fixes..."
              className="min-h-[80px] text-xs font-mono"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="sm"
              className="text-xs gap-1.5 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Creating..." : "Create Version Draft"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
