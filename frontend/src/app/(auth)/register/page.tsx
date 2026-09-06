"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await register(username.trim(), email.trim(), password);
      setRegisteredSuccess(true);
      toast.success("Account created successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to create account. Please check your details.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredSuccess) {
    return (
      <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9FBEA5]/15 border border-[#9FBEA5]/40 text-[#9FBEA5] mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
            Check Your Email
          </h1>
          <p className="text-xs text-[#A9B1AA] leading-relaxed max-w-sm mx-auto">
            We sent a verification link to <span className="text-[#F1F4EF] font-medium">{email}</span>. Click the link to verify your account and unlock publishing.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="primary" size="default" className="w-full">
            <Link href="/login">Proceed to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
          Create Developer Account
        </h1>
        <p className="text-xs text-[#A9B1AA]">
          Publish, version, and share agentic skills with the community.
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
          <label className="text-xs font-medium text-[#F1F4EF]">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="developer_handle"
              required
              className="pl-9 text-xs font-mono"
            />
          </div>
          <p className="text-[10px] text-[#707A72]">Letters, numbers, and underscores only.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sharad@example.com"
              required
              className="pl-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Password</label>
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

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          size="default"
          className="w-full font-semibold"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-xs text-[#707A72]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#CCD7C5] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
