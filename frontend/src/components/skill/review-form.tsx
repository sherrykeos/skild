"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

interface ReviewFormProps {
  skillId: string;
  onSubmit: (content: string) => Promise<void>;
}

export function ReviewForm({ skillId, onSubmit }: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to write a review.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
      toast.success("Review submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-5 text-center">
        <p className="text-xs text-[#A9B1AA] mb-3">
          Sign in to leave a review and share feedback with the developer.
        </p>
        <Button asChild variant="secondary" size="sm">
          <a href={`/login?redirect=/skills/${skillId}`}>Sign In to Review</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-4 space-y-3">
      <div className="text-xs font-semibold text-[#F1F4EF]">Write a Review</div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How well does this skill perform? Share prompt effectiveness, integration caveats, or agent performance..."
        className="min-h-[80px] text-xs"
        required
      />
      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          variant="primary"
          size="sm"
          className="gap-1.5"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
        </Button>
      </div>
    </form>
  );
}
