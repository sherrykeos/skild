import React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080B0A] flex flex-col justify-between">
      {/* Auth Top Header */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-[#1A211D]">
        <Logo size="md" />
        <Link
          href="/"
          className="text-xs text-[#A9B1AA] hover:text-[#CCD7C5] transition-colors"
        >
          ← Back to Marketplace
        </Link>
      </header>

      {/* Auth Main Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Auth Footer */}
      <footer className="h-14 border-t border-[#1A211D] px-6 flex items-center justify-center text-xs text-[#707A72]">
        <p>© {new Date().getFullYear()} SkillAtlas. Protected by JWT auth.</p>
      </footer>
    </div>
  );
}
