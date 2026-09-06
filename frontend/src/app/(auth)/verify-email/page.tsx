"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">(
    token ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    authApi
      .verifyEmail(token)
      .then(() => {
        if (isMounted) setStatus("success");
      })
      .catch((err: any) => {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err.message || "Invalid or expired verification token.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail.trim());
      toast.success("Verification link resent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl text-center">
      {status === "loading" && (
        <div className="space-y-4 py-6">
          <Loader2 className="h-8 w-8 text-[#CCD7C5] animate-spin mx-auto" />
          <h1 className="text-xl font-bold text-[#F1F4EF]">Verifying Email...</h1>
          <p className="text-xs text-[#A9B1AA]">Connecting to token verification service.</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9FBEA5]/15 border border-[#9FBEA5]/40 text-[#9FBEA5] mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F1F4EF]">
              Email Verified Successfully
            </h1>
            <p className="text-xs text-[#A9B1AA]">
              Your account is fully verified. You can now publish skills and participate in the community.
            </p>
          </div>
          <div className="pt-2">
            <Button asChild variant="primary" size="default" className="w-full">
              <Link href="/login">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>
      )}

      {(status === "error" || status === "idle") && (
        <div className="space-y-4">
          {status === "error" && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C58F8F]/15 border border-[#C58F8F]/40 text-[#C58F8F] mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F1F4EF]">
              {status === "error" ? "Verification Failed" : "Verify Your Email"}
            </h1>
            <p className="text-xs text-[#A9B1AA] leading-relaxed">
              {status === "error"
                ? errorMessage
                : "Enter your email address below to receive a new verification link."}
            </p>
          </div>

          <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Your Email</label>
              <Input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="developer@example.com"
                required
                className="text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={isResending}
              variant="primary"
              size="default"
              className="w-full"
            >
              {isResending ? "Resending Link..." : "Resend Verification Link"}
            </Button>
          </form>

          <p className="text-xs text-[#707A72] pt-2">
            <Link href="/login" className="text-[#CCD7C5] hover:underline font-medium">
              Back to Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-xs text-[#707A72] text-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
