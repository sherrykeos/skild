"use client";

import React, { useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Review } from "@/types/engagement";
import { formatDate, getInitials } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";

interface ReviewCardProps {
  review: Review;
  onUpdate: (reviewId: string, content: string) => Promise<void>;
  onDelete: (reviewId: string) => Promise<void>;
}

export function ReviewCard({ review, onUpdate, onDelete }: ReviewCardProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(review.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.id && review.userId === user.id;

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    try {
      await onUpdate(review.id, content);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    setIsDeleting(true);
    try {
      await onDelete(review.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 border border-[#252D28]">
            <AvatarImage src={review.user?.avatar || undefined} alt={review.user?.username || "User"} />
            <AvatarFallback className="text-[10px]">
              {getInitials(review.user?.username || "User")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-semibold text-[#F1F4EF]">
              @{review.user?.username || "developer"}
            </p>
            <p className="text-[10px] text-[#707A72] font-mono">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {isAuthor && !isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded text-[#707A72] hover:text-[#CCD7C5] hover:bg-[#141916] transition-colors"
              title="Edit review"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded text-[#707A72] hover:text-[#C58F8F] hover:bg-[#C58F8F]/10 transition-colors"
              title="Delete review"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2 pt-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-xs min-h-[60px]"
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => {
                setContent(review.content);
                setIsEditing(false);
              }}
              variant="ghost"
              size="xs"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              variant="primary"
              size="xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#A9B1AA] leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
      )}
    </div>
  );
}
