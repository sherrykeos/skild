"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PublishConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName: string;
  versionNumber: string;
  onConfirm: () => Promise<void>;
}

export function PublishConfirmDialog({
  open,
  onOpenChange,
  skillName,
  versionNumber,
  onConfirm,
}: PublishConfirmDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setError(null);
    setIsPublishing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to publish skill.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0E1210] border-[#252D28]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#CCD7C5] mb-1">
            <CheckCircle2 className="h-5 w-5 text-[#9FBEA5]" />
            <DialogTitle className="text-base font-bold text-[#F1F4EF]">
              Publish Skill &amp; Version v{versionNumber}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#A9B1AA]">
            Publishing makes <strong className="text-[#F1F4EF]">{skillName}</strong> publicly discoverable on the marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-[#A9B1AA]">
          <div className="p-3 rounded-[6px] bg-[#C9B98A]/10 border border-[#C9B98A]/30 text-[#C9B98A] flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Immutable Release Guarantee</span>
              <p className="text-[11px] leading-relaxed">
                Once published, this version’s files and prompts cannot be modified or overwritten. Any future revisions must be published under a new semantic version (e.g. v1.1.0).
              </p>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-[6px] bg-[#C58F8F]/10 border border-[#C58F8F]/30 text-xs text-[#C58F8F]">
              {error}
            </div>
          )}
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
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            variant="primary"
            size="sm"
            className="text-xs gap-1.5 font-semibold"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isPublishing ? "Publishing..." : "Confirm & Publish"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
