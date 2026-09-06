"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusCircle, Bookmark, LayoutDashboard } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Explore", href: "/explore", icon: Compass },
    { title: "Create", href: "/skills/new", icon: PlusCircle },
    { title: "Saved", href: "/saved", icon: Bookmark },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 border-t border-[#252D28] bg-[#0E1210]/95 backdrop-blur-md flex items-center justify-around px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-[6px] transition-colors ${
              isActive ? "text-[#CCD7C5]" : "text-[#707A72] hover:text-[#A9B1AA]"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] mt-1 font-medium">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
