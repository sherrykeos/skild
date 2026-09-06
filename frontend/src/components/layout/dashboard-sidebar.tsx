"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  Bookmark,
  FolderHeart,
  User,
  Settings,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";
import { getInitials } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  Github: GithubIcon,
  Bookmark,
  FolderHeart,
  User,
  Settings,
  ShieldCheck,
  BookOpen,
  HelpCircle,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const mainItems = [
    { title: "Dashboard", href: "/dashboard", iconName: "LayoutDashboard" },
    { title: "Admin Console", href: "/admin", iconName: "ShieldCheck" },
    { title: "My Skills", href: "/skills", iconName: "Boxes" },
    { title: "Create Skill", href: "/skills/new", iconName: "PlusCircle" },
    { title: "Import from GitHub", href: "/github-import", iconName: "Github" },
    { title: "Saved", href: "/saved", iconName: "Bookmark" },
    { title: "Collections", href: "/collections", iconName: "FolderHeart" },
    { title: "Profile", href: user?.username ? `/users/${user.username}` : "/settings/profile", iconName: "User" },
    { title: "Settings", href: "/settings", iconName: "Settings" },
  ];

  const footerItems = [
    { title: "Documentation", href: "/docs", iconName: "BookOpen" },
    { title: "Help & Community", href: "https://github.com", isExternal: true, iconName: "HelpCircle" },
  ];

  return (
    <aside className="w-64 border-r border-[#252D28] bg-[#0E1210] flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-14 px-6 border-b border-[#252D28] flex items-center justify-between">
        <Logo size="sm" />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#707A72]">
          Creator Studio
        </div>
        {mainItems.map((item) => {
          const Icon = ICONS[item.iconName] || Boxes;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#141916] text-[#CCD7C5] border border-[#252D28] shadow-sm font-semibold"
                  : "text-[#A9B1AA] hover:bg-[#141916]/60 hover:text-[#F1F4EF]"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? "text-[#CCD7C5]" : "text-[#707A72]"
                }`}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#707A72]">
          Resources
        </div>
        {footerItems.map((item) => {
          const Icon = ICONS[item.iconName] || BookOpen;

          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium text-[#A9B1AA] hover:bg-[#141916]/60 hover:text-[#F1F4EF] transition-all"
            >
              <Icon className="h-4 w-4 shrink-0 text-[#707A72]" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile Card */}
      {user && (
        <div className="p-3 border-t border-[#252D28] bg-[#080B0A]/40">
          <div className="flex items-center justify-between gap-2 p-2 rounded-[8px] bg-[#141916] border border-[#252D28]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Avatar className="h-7 w-7 border border-[#252D28]">
                <AvatarImage src={user.avatar || undefined} alt={user.username} />
                <AvatarFallback className="text-[10px]">{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden text-left">
                <p className="text-xs font-medium text-[#F1F4EF] truncate">{user.username}</p>
                <p className="text-[10px] text-[#707A72] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1 text-[#707A72] hover:text-[#C58F8F] transition-colors rounded hover:bg-[#C58F8F]/10"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
