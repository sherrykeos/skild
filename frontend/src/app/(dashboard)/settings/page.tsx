"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, AlertTriangle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password. Verify current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b border-[#252D28] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
          Account &amp; Security Settings
        </h1>
        <p className="text-xs text-[#A9B1AA] mt-1">
          Manage your login credentials, security preferences, and account controls.
        </p>
      </div>

      {/* Email Overview */}
      <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-[#F1F4EF]">Account Email</h3>
            <p className="text-xs text-[#A9B1AA]">Primary email for notifications and login.</p>
          </div>
          <Badge variant="success" className="text-[10px] gap-1">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </Badge>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
          <Input
            type="email"
            value={user?.email || ""}
            disabled
            className="pl-9 text-xs bg-[#141916] text-[#A9B1AA]"
          />
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 space-y-5">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-[#F1F4EF] flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#CCD7C5]" />
            <span>Change Password</span>
          </h3>
          <p className="text-xs text-[#A9B1AA]">
            Update your password to keep your creator studio secure.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F1F4EF]">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F1F4EF]">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F1F4EF]">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isChangingPassword}
            variant="primary"
            size="sm"
            className="font-semibold"
          >
            {isChangingPassword ? "Updating Password..." : "Update Password"}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="border border-[#C58F8F]/30 rounded-[10px] bg-[#C58F8F]/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#C58F8F]">
          <AlertTriangle className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Danger Zone</h3>
        </div>
        <p className="text-xs text-[#A9B1AA] leading-relaxed">
          Deleting your account will permanently remove all unpublished drafts and personal collections. Published skills will be archived.
        </p>
        <div className="pt-2">
          <Button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to request account deletion?")) {
                toast.info("Account deletion request logged.");
              }
            }}
            variant="danger"
            size="sm"
            className="text-xs"
          >
            Request Account Deletion
          </Button>
        </div>
      </div>
    </div>
  );
}
