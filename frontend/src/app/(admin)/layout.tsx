"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  FileCode,
  MessageSquare,
  ArrowLeft,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LoadingState } from "@/components/common/loading-state";
import { Logo } from "@/components/layout/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B0A]">
        <LoadingState message="Verifying administrative credentials..." />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const navItems = [
    { title: "Platform Overview", href: "/admin", icon: ShieldCheck },
    { title: "Users Moderation", href: "/admin/users", icon: Users },
    { title: "Skills Moderation", href: "/admin/skills", icon: FileCode },
    { title: "Reviews Moderation", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-[#080B0A]">
      {/* Admin Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#252D28] bg-[#0E1210] md:flex">
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#252D28] px-6">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="rounded border border-[#30E87F]/30 bg-[#30E87F]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#30E87F]">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#707A72]">
            Moderation &amp; Control
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-[8px] px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "border border-[#30E87F]/30 bg-[#1A2520] font-semibold text-[#30E87F] shadow-sm"
                    : "text-[#A9B1AA] hover:bg-[#141916]/60 hover:text-[#F1F4EF]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-[#30E87F]" : "text-[#707A72]"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="px-3 pb-2 pt-6 text-[10px] font-mono uppercase tracking-wider text-[#707A72]">
            Navigation
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2 text-xs font-medium text-[#A9B1AA] transition-all hover:bg-[#141916]/60 hover:text-[#F1F4EF]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-[#707A72]" />
            <span>Back to SkillAtlas</span>
          </Link>
        </div>

        {/* Admin User Footer */}
        {user && (
          <div className="border-t border-[#252D28] bg-[#080B0A]/40 p-3">
            <div className="flex items-center justify-between gap-2 rounded-[8px] border border-[#252D28] bg-[#141916] p-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar className="h-7 w-7 border border-[#30E87F]/40">
                  <AvatarImage src={user.avatar || undefined} alt={user.username} />
                  <AvatarFallback className="text-[10px] text-[#30E87F]">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-semibold text-[#F1F4EF]">
                      {user.username}
                    </p>
                    <span className="rounded bg-[#30E87F]/20 px-1 py-0.2 text-[9px] font-bold text-[#30E87F]">
                      SUPERADMIN
                    </span>
                  </div>
                  <p className="truncate text-[10px] text-[#707A72]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="rounded p-1 text-[#707A72] transition-colors hover:bg-[#C58F8F]/10 hover:text-[#C58F8F]"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Admin Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#252D28] bg-[#0E1210] px-4 md:hidden">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="rounded border border-[#30E87F]/30 bg-[#30E87F]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#30E87F]">
              Admin
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs text-[#A9B1AA] hover:text-[#F1F4EF]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Exit</span>
          </Link>
        </div>

        {/* Mobile Sub-Nav */}
        <div className="flex gap-2 overflow-x-auto border-b border-[#252D28] bg-[#080B0A] p-2 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? "border border-[#30E87F]/30 bg-[#1A2520] text-[#30E87F]"
                    : "text-[#707A72]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.title.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 pb-20 sm:p-6 md:pb-8 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
