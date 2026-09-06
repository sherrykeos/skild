"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Terminal, Code2, GitBranch, Layers, FileCode, CheckCircle2, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
}

const SECTIONS: DocSection[] = [
  { id: "intro", title: "Introduction", icon: BookOpen },
  { id: "getting-started", title: "Getting Started", icon: Terminal },
  { id: "skill-format", title: "SKILL.md Specification", icon: FileCode },
  { id: "multi-file", title: "Multi-File Structure", icon: Layers },
  { id: "publishing", title: "Publishing Workflow", icon: CheckCircle2 },
  { id: "github-import", title: "GitHub Snapshot Import", icon: GithubIcon },
  { id: "versioning", title: "Semantic Versioning", icon: GitBranch },
  { id: "cli", title: "SkillAtlas CLI", icon: Code2 },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  return (
    <PageContainer>
      <PageHeader
        title="Developer Documentation"
        description="Official guide to building, formatting, versioning, and deploying agentic skills on SkillAtlas."
        badge="v1.0 Docs"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 border border-[#252D28] rounded-[8px] bg-[#0E1210] p-3 space-y-1 sticky top-20">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[#707A72]">
            Table of Contents
          </div>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors text-left ${
                  isActive
                    ? "bg-[#141916] text-[#CCD7C5] border border-[#252D28] font-semibold"
                    : "text-[#A9B1AA] hover:bg-[#141916]/50 hover:text-[#F1F4EF]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#CCD7C5]" : "text-[#707A72]"}`} />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Doc Content */}
        <div className="lg:col-span-9 border border-[#252D28] rounded-[8px] bg-[#0E1210] p-6 sm:p-8 space-y-8 text-sm text-[#A9B1AA] leading-relaxed">
          {activeSection === "intro" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                Introduction to SkillAtlas
              </h2>
              <p>
                <strong className="text-[#F1F4EF]">SkillAtlas</strong> is an open agentic skill registry and marketplace.
                It provides standard interfaces for autonomous agents to discover, pull, and execute packaged capabilities across coding, research, automation, data engineering, and productivity.
              </p>
              <div className="p-4 rounded-[6px] bg-[#141916] border border-[#252D28] text-xs font-mono text-[#CCD7C5]">
                // What is an Agentic Skill?
                <br />
                A modular directory containing instructions (SKILL.md), reference documents, scripts, and examples that give AI agents targeted domain expertise.
              </div>
            </section>
          )}

          {activeSection === "getting-started" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                Getting Started
              </h2>
              <p>
                You can install and use any public SkillAtlas skill with your favorite agent framework or CLI tool.
              </p>
              <h3 className="text-base font-semibold text-[#F1F4EF] pt-2">1. Install via CLI</h3>
              <pre className="p-4 rounded-[6px] bg-[#080B0A] border border-[#252D28] text-xs font-mono text-[#CCD7C5] overflow-x-auto">
                npx skillatlas add react-code-reviewer
              </pre>
              <h3 className="text-base font-semibold text-[#F1F4EF] pt-2">2. Direct Download</h3>
              <p className="text-xs">
                Every skill page provides a one-click ZIP download containing the full verified file tree.
              </p>
            </section>
          )}

          {activeSection === "skill-format" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                SKILL.md Specification
              </h2>
              <p>
                The core of every skill is the <code className="text-[#CCD7C5] bg-[#141916] px-1.5 py-0.5 rounded font-mono">SKILL.md</code> file.
                It acts as the primary system prompt and operational guide for agents executing the skill.
              </p>
              <pre className="p-4 rounded-[6px] bg-[#080B0A] border border-[#252D28] text-xs font-mono text-[#F1F4EF] overflow-x-auto leading-relaxed">
{`# Skill Name

Brief description of what this skill enables the agent to do.

## Capabilities
- AST analysis
- TypeScript error diagnosis
- Performance bottleneck detection

## Instructions
1. Inspect the target source directory.
2. Run analysis scripts located in \`scripts/\`.
3. Synthesize recommendations against reference guidelines.`}
              </pre>
            </section>
          )}

          {activeSection === "multi-file" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                Multi-File Directory Structure
              </h2>
              <p>
                A skill is <strong className="text-[#F1F4EF]">not limited to a single file</strong>. Complex skills can include supporting scripts, configuration files, prompt templates, and reference documentation:
              </p>
              <pre className="p-4 rounded-[6px] bg-[#080B0A] border border-[#252D28] text-xs font-mono text-[#AAB8A3] overflow-x-auto">
{`my-skill/
├── SKILL.md               # Primary instruction document (Required)
├── README.md              # Human-facing documentation
├── references/
│   ├── rules.md           # Domain constraints
│   └── api-spec.json      # OpenAPI definition
├── scripts/
│   ├── analyze.py         # Python helper tool
│   └── transform.ts       # TypeScript parser
└── examples/
    └── prompt_sample.txt  # Golden evaluation samples`}
              </pre>
            </section>
          )}

          {activeSection === "publishing" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                Publishing Workflow
              </h2>
              <p>
                Publishing on SkillAtlas is deliberate and secure.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong className="text-[#F1F4EF]">Draft Stage:</strong> While in draft, files and metadata can be freely edited and iterated upon.</li>
                <li><strong className="text-[#F1F4EF]">Validation Guard:</strong> A non-empty <code className="text-[#CCD7C5]">SKILL.md</code> is strictly required.</li>
                <li><strong className="text-[#F1F4EF]">Immutable Releases:</strong> Once published, a version cannot be edited or overwritten, guaranteeing reproducible behavior for agents in production.</li>
              </ul>
            </section>
          )}

          {activeSection === "github-import" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                GitHub Snapshot Import
              </h2>
              <p>
                Importing from GitHub creates a <strong className="text-[#F1F4EF]">one-time static snapshot</strong> of a public repository.
              </p>
              <p className="text-xs">
                Our 4-step wizard connects to the public GitHub API, allows you to select up to 50 files (requiring <code className="text-[#CCD7C5]">SKILL.md</code>), configures metadata, and provisions a new editable draft.
              </p>
            </section>
          )}

          {activeSection === "versioning" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                Semantic Versioning
              </h2>
              <p>
                All skills follow strict semantic versioning (<code className="text-[#CCD7C5]">MAJOR.MINOR.PATCH</code>).
              </p>
              <p className="text-xs">
                When creating a new release, creators provide changelog notes and can copy files from prior versions to make targeted iterations.
              </p>
            </section>
          )}

          {activeSection === "cli" && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight border-b border-[#252D28] pb-3">
                SkillAtlas CLI
              </h2>
              <p>
                The SkillAtlas CLI enables programmatic downloading and installation of skills directly into project directories:
              </p>
              <pre className="p-4 rounded-[6px] bg-[#080B0A] border border-[#252D28] text-xs font-mono text-[#CCD7C5] overflow-x-auto">
                npx skillatlas add &lt;skill-slug&gt; [--version &lt;version&gt;] [--out &lt;dir&gt;]
              </pre>
            </section>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
