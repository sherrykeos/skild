"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email.trim());
      setIsSubmitted(true);
      toast.success("Password reset instructions sent!");
    } catch (err: any) {
      const msg = err.message || "Failed to process request. Please check your email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9FBEA5]/15 border border-[#9FBEA5]/40 text-[#9FBEA5] mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#F1F4EF]">
            Reset Link Sent
          </h1>
          <p className="text-xs text-[#A9B1AA] leading-relaxed max-w-sm mx-auto">
            If an account exists for <span className="text-[#F1F4EF] font-medium">{email}</span>, you will receive password reset instructions shortly.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="secondary" size="default" className="w-full">
            <Link href="/login">Return to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
          Reset Password
        </h1>
        <p className="text-xs text-[#A9B1AA]">
          Enter your email address and we will send you a reset link.
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
          <label className="text-xs font-medium text-[#F1F4EF]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
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
          {isLoading ? "Sending Link..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-center text-xs text-[#707A72]">
        <Link href="/login" className="inline-flex items-center gap-1 text-[#CCD7C5] hover:underline font-medium">
          <ArrowLeft className="h-3 w-3" />
          <span>Back to Sign In</span>
        </Link>
      </p>
    </div>
  );
}
