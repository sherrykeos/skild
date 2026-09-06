"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing or invalid. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({ token, password });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to reset password. Link may have expired.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9FBEA5]/15 border border-[#9FBEA5]/40 text-[#9FBEA5] mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#F1F4EF]">
            Password Updated
          </h1>
          <p className="text-xs text-[#A9B1AA]">
            Your password has been successfully reset. You can now log in with your new credentials.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="primary" size="default" className="w-full">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
          Set New Password
        </h1>
        <p className="text-xs text-[#A9B1AA]">
          Create a secure password for your SkillAtlas account.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[6px] border border-[#C58F8F]/30 bg-[#C58F8F]/10 text-xs text-[#C58F8F]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="pl-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="pl-9 text-xs"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          size="default"
          className="w-full font-semibold"
        >
          {isLoading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-xs text-[#707A72] text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
