"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Globe, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";
import { usersApi } from "@/lib/api/users";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await usersApi.updateMe({
        username: username.trim() || undefined,
        avatar: avatar.trim() || null,
      });
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-[#252D28] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
          Profile Settings
        </h1>
        <p className="text-xs text-[#A9B1AA] mt-1">
          Manage your public creator identity and profile attributes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 space-y-5">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#1A211D]">
          <Avatar className="h-14 w-14 border border-[#252D28]">
            <AvatarImage src={avatar || undefined} alt={username} />
            <AvatarFallback className="text-sm font-semibold">{getInitials(username)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-[#F1F4EF]">Avatar Preview</h3>
            <p className="text-[11px] text-[#707A72]">
              Set an image URL below to update your public avatar.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Username</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-xs font-mono"
          />
          <p className="text-[10px] text-[#707A72]">
            Your public URL handle: skillatlas.dev/users/{username || "username"}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Avatar Image URL</label>
          <Input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.png"
            className="text-xs font-mono"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            variant="primary"
            size="sm"
            className="gap-1.5 font-semibold"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : "Save Profile"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
