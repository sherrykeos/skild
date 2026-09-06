"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, PlusCircle, LayoutDashboard, Bookmark, Settings, LogOut, User as UserIcon } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PUBLIC_NAV_ITEMS } from "@/constants/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getInitials } from "@/lib/utils";
import { SearchModal } from "@/components/common/search-modal";

export function PublicNavbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#252D28] bg-[#080B0A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Logo size="md" />

            <nav className="hidden md:flex items-center gap-6 text-sm">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-colors py-1 font-medium ${
                      isActive
                        ? "text-[#CCD7C5] border-b-2 border-[#CCD7C5]"
                        : "text-[#A9B1AA] hover:text-[#F1F4EF]"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-[8px] bg-[#0E1210] border border-[#252D28] hover:border-[#CCD7C5]/40 text-xs text-[#707A72] transition-colors w-40 sm:w-64"
            >
              <Search className="h-3.5 w-3.5 text-[#707A72]" />
              <span className="truncate text-[#707A72]">Search skills...</span>
              <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 rounded border border-[#252D28] bg-[#141916] text-[10px] font-mono text-[#707A72]">
                ⌘K
              </kbd>
            </button>

            {/* User Auth Buttons or Menu */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-xs gap-1.5">
                  <Link href="/skills/new">
                    <PlusCircle className="h-3.5 w-3.5 text-[#CCD7C5]" />
                    <span>Create</span>
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center rounded-full p-0.5 focus:outline-none focus:ring-1 focus:ring-[#CCD7C5]">
                      <Avatar className="h-7 w-7 border border-[#252D28]">
                        <AvatarImage src={user.avatar || undefined} alt={user.username} />
                        <AvatarFallback className="text-[11px]">{getInitials(user.username)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-2.5 py-2 border-b border-[#252D28]">
                      <p className="text-xs font-semibold text-[#F1F4EF]">{user.username}</p>
                      <p className="text-[11px] text-[#707A72] truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="gap-2">
                        <LayoutDashboard className="h-4 w-4 text-[#CCD7C5]" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/skills" className="gap-2">
                        <PlusCircle className="h-4 w-4 text-[#9FB8B2]" />
                        <span>My Skills</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved" className="gap-2">
                        <Bookmark className="h-4 w-4 text-[#AAB8A3]" />
                        <span>Saved Skills</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/users/${user.username}`} className="gap-2">
                        <UserIcon className="h-4 w-4 text-[#A9B1AA]" />
                        <span>Public Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="gap-2">
                        <Settings className="h-4 w-4 text-[#A9B1AA]" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem danger onClick={() => logout()} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-xs text-[#F1F4EF]">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="primary" size="sm" className="text-xs">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#A9B1AA] hover:text-[#F1F4EF] rounded-[6px] hover:bg-[#141916]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#252D28] bg-[#0E1210] px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-[6px] text-sm font-medium text-[#A9B1AA] hover:bg-[#141916] hover:text-[#F1F4EF]"
              >
                {item.title}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-[#252D28] space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-[6px] text-sm text-[#CCD7C5] hover:bg-[#141916]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/skills"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-[6px] text-sm text-[#A9B1AA] hover:bg-[#141916]"
                >
                  My Skills
                </Link>
                <Link
                  href="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-[6px] text-sm text-[#A9B1AA] hover:bg-[#141916]"
                >
                  Saved Skills
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-[6px] text-sm text-[#C58F8F] hover:bg-[#C58F8F]/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#252D28] flex gap-2">
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="primary" size="sm" className="w-full">
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
