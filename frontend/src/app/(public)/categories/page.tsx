import React from "react";
import Link from "next/link";
import { ArrowRight, Boxes, Code2, Compass, Zap, BarChart3, Palette, Cpu, Briefcase, GraduationCap, ShieldCheck, PenTool, Terminal, Megaphone, Layers } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { CATEGORIES } from "@/constants/categories";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Compass,
  Zap,
  BarChart3,
  Palette,
  Cpu,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  PenTool,
  Terminal,
  Megaphone,
  Layers,
};

export const metadata = {
  title: "Categories",
  description: "Browse AI agent skills organized by functional domain and capability.",
};

export default function CategoriesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Skill Categories"
        description="Browse agentic skills organized by domain, capability, and execution layer."
        badge="13 Categories"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Boxes;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group p-6 rounded-[8px] border border-[#252D28] bg-[#0E1210] hover:border-[#CCD7C5]/40 hover:bg-[#141916] transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-[8px] border border-[#252D28] bg-[#141916] flex items-center justify-center text-[#CCD7C5] group-hover:border-[#CCD7C5]/50 group-hover:text-[#DCE5D7] transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-[#707A72] group-hover:text-[#CCD7C5] flex items-center gap-1 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#F1F4EF] group-hover:text-[#CCD7C5] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#A9B1AA] mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A211D] flex items-center justify-between text-[11px] font-mono text-[#707A72]">
                <span>Category: {cat.slug}</span>
                <span className="text-[#CCD7C5]">Verified Standard</span>
              </div>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
