"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, PlusCircle, LayoutDashboard, Bookmark, Settings, LogOut } from "lucide-react";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";
import { getInitials } from "@/lib/utils";
import { SearchModal } from "@/components/common/search-modal";

export function MobileHeader() {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 h-14 border-b border-[#252D28] bg-[#080B0A]/95 backdrop-blur-md px-4 flex items-center justify-between">
        <Logo size="sm" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-[#A9B1AA] hover:text-[#F1F4EF] rounded-[6px] hover:bg-[#141916]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 text-[#A9B1AA] hover:text-[#F1F4EF] rounded-[6px] hover:bg-[#141916]"
            aria-label="Menu"
          >
            {drawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {drawerOpen && (
          <div className="absolute top-14 left-0 right-0 border-b border-[#252D28] bg-[#0E1210] p-4 space-y-2 animate-in slide-in-from-top-2">
            <Link
              href="/dashboard"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F1F4EF] hover:bg-[#141916]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#CCD7C5]" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/skills"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F1F4EF] hover:bg-[#141916]"
            >
              <PlusCircle className="h-4 w-4 text-[#9FB8B2]" />
              <span>My Skills</span>
            </Link>
            <Link
              href="/saved"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F1F4EF] hover:bg-[#141916]"
            >
              <Bookmark className="h-4 w-4 text-[#AAB8A3]" />
              <span>Saved Skills</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F1F4EF] hover:bg-[#141916]"
            >
              <Settings className="h-4 w-4 text-[#A9B1AA]" />
              <span>Settings</span>
            </Link>
            {user && (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#C58F8F] hover:bg-[#C58F8F]/10 pt-2 border-t border-[#252D28]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out ({user.username})</span>
              </button>
            )}
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
