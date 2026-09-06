import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred while communicating with the server.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-[#C58F8F]/30 bg-[#C58F8F]/5 rounded-[8px] my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C58F8F]/15 border border-[#C58F8F]/40 text-[#C58F8F] mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F1F4EF] mb-1">{title}</h3>
      <p className="text-sm text-[#A9B1AA] max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
