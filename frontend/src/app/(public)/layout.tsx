import React from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#080B0A]">
      <PublicNavbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
