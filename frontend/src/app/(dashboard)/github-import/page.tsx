"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCode,
  Folder,
  AlertTriangle,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/constants/categories";
import { githubApi } from "@/lib/api/github";
import { GitHubInspectResult, GitHubTreeItem } from "@/types/engagement";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

export default function GitHubImportPage() {
  const router = useRouter();
  const { isCreator, becomeCreator } = useAuth();
  const [activatingCreator, setActivatingCreator] = useState(false);

  // Wizard Steps (1: Connect, 2: Select Files, 3: Configure, 4: Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Connect State
  const [repoUrl, setRepoUrl] = useState("https://github.com/");
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectData, setInspectData] = useState<GitHubInspectResult | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("main");

  // Step 2: Tree Files State
  const [treeFiles, setTreeFiles] = useState<GitHubTreeItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // Step 3: Configure State
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("development");
  const [tags, setTags] = useState<string[]>(["github-import"]);
  const [tagInput, setTagInput] = useState("");

  // Step 4: Import State
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Inspect Handler
  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!repoUrl.trim() || repoUrl.trim() === "https://github.com/") {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    setIsInspecting(true);
    try {
      const data = await githubApi.inspect(repoUrl.trim());
      setInspectData(data);
      setSelectedBranch(data.repository.defaultBranch || data.branches[0]?.name || "main");
      setSkillName(data.repository.name || "Imported Skill");
      setDescription(data.repository.description || `Imported agent skill from ${data.repository.fullName}`);

      // Fetch Tree
      setIsLoadingTree(true);
      const tree = await githubApi.getTree(
        repoUrl.trim(),
        data.repository.defaultBranch || "main"
      );
      setTreeFiles(tree.files || []);

      // Auto-select SKILL.md and README.md if found
      const defaultSelected = (tree.files || [])
        .map((f) => f.path)
        .filter(
          (p) =>
            p === "SKILL.md" ||
            p === "README.md" ||
            p.startsWith("scripts/") ||
            p.startsWith("references/")
        );
      setSelectedFiles(defaultSelected.length > 0 ? defaultSelected : ["SKILL.md"]);

      setCurrentStep(2);
      toast.success("Repository inspected successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to inspect GitHub repository.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsInspecting(false);
      setIsLoadingTree(false);
    }
  };

  // Branch change reload tree
  const handleBranchChange = async (branch: string) => {
    setSelectedBranch(branch);
    setIsLoadingTree(true);
    try {
      const tree = await githubApi.getTree(repoUrl.trim(), branch);
      setTreeFiles(tree.files || []);
    } catch (err: any) {
      toast.error("Failed to load file tree for branch: " + branch);
    } finally {
      setIsLoadingTree(false);
    }
  };

  // Toggle file selection
  const handleToggleFile = (path: string) => {
    if (selectedFiles.includes(path)) {
      setSelectedFiles(selectedFiles.filter((p) => p !== path));
    } else {
      if (selectedFiles.length >= 50) {
        toast.error("You can select up to 50 files.");
        return;
      }
      setSelectedFiles([...selectedFiles, path]);
    }
  };

  // Step 4: Confirm Import Handler
  const handleImport = async () => {
    if (!selectedFiles.includes("SKILL.md")) {
      toast.error("SKILL.md is required in the selected files list.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const result = await githubApi.importRepo({
        url: repoUrl.trim(),
        branch: selectedBranch,
        files: selectedFiles,
      });

      toast.success(`Imported "${skillName}" as draft! Opening studio...`);
      router.push(`/skills/${result.skill.id}/edit`);
    } catch (err: any) {
      const msg = err.message || "Failed to import GitHub repository.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsImporting(false);
    }
  };

  const hasSkillMd = selectedFiles.includes("SKILL.md");

  const handleActivateCreator = async () => {
    try {
      setActivatingCreator(true);
      await becomeCreator();
      toast.success("Creator access activated!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to activate creator mode.");
    } finally {
      setActivatingCreator(false);
    }
  };

  if (!isCreator) {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-10">
        <div className="rounded-xl border border-[#252D28] bg-[#0E1210] p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#30E87F]/30 bg-[#30E87F]/10 text-[#30E87F]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-[#F1F4EF]">
            Creator Access Required
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs text-[#A9B1AA]">
            Importing agent skills from GitHub requires Creator status. Activation is instant, free, and enables repository syncing.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={handleActivateCreator}
              disabled={activatingCreator}
              className="w-full bg-[#30E87F] font-semibold text-[#080B0A] hover:bg-[#28C76D] sm:w-auto"
            >
              {activatingCreator ? "Activating..." : "Activate Creator Access (Instant)"}
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-[#252D28] bg-transparent text-[#A9B1AA] hover:bg-[#141916] sm:w-auto"
            >
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#252D28] pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#707A72] hover:text-[#CCD7C5] transition-colors font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-mono text-[#CCD7C5]">GitHub Import Wizard</span>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
        {[
          { step: 1, label: "1. Connect" },
          { step: 2, label: "2. Select Files" },
          { step: 3, label: "3. Configure" },
          { step: 4, label: "4. Review" },
        ].map((item) => (
          <div
            key={item.step}
            className={`py-2 px-3 rounded-[6px] border transition-colors ${
              currentStep === item.step
                ? "bg-[#141916] text-[#CCD7C5] border-[#CCD7C5]/40 font-bold"
                : currentStep > item.step
                ? "bg-[#0E1210] text-[#9FBEA5] border-[#9FBEA5]/30"
                : "bg-[#0E1210] text-[#707A72] border-[#252D28]"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-[6px] border border-[#C58F8F]/30 bg-[#C58F8F]/10 text-xs text-[#C58F8F] flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Connect */}
      {currentStep === 1 && (
        <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#F1F4EF] flex items-center gap-2">
              <GithubIcon className="h-5 w-5 text-[#CCD7C5]" />
              <span>Connect Public GitHub Repository</span>
            </h2>
            <p className="text-xs text-[#A9B1AA]">
              Enter the full HTTPS URL of a public repository containing your skill specification.
            </p>
          </div>

          <form onSubmit={handleInspect} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Repository URL</label>
              <Input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/skill-repository"
                required
                className="text-xs font-mono"
              />
              <p className="text-[10px] text-[#707A72]">
                Public repositories only. Private repository tokens are not required.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isInspecting}
                variant="primary"
                size="default"
                className="gap-2 font-semibold"
              >
                {isInspecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Inspecting Repository...</span>
                  </>
                ) : (
                  <>
                    <span>Inspect Repository</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: Select Files */}
      {currentStep === 2 && inspectData && (
        <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#252D28] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#F1F4EF]">
                Select Skill Files ({selectedFiles.length} selected)
              </h2>
              <p className="text-xs text-[#A9B1AA]">
                Choose up to 50 files to import into your SkillAtlas draft.
              </p>
            </div>

            <div className="w-[180px]">
              <Select value={selectedBranch} onValueChange={handleBranchChange}>
                <SelectTrigger className="h-8 bg-[#141916] border-[#252D28] text-xs">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent className="bg-[#0E1210] border-[#252D28]">
                  {inspectData.branches.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!hasSkillMd && (
            <div className="p-3 rounded-[6px] border border-[#C9B98A]/30 bg-[#C9B98A]/10 text-xs text-[#C9B98A] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                <strong>SKILL.md is required.</strong> Please make sure to check SKILL.md in the file tree below.
              </span>
            </div>
          )}

          {/* Tree Files Picker */}
          <div className="border border-[#252D28] rounded-[8px] bg-[#080B0A] max-h-80 overflow-y-auto divide-y divide-[#1A211D]">
            {treeFiles.map((file) => {
              const isChecked = selectedFiles.includes(file.path);
              const isSkillMd = file.path === "SKILL.md";

              return (
                <label
                  key={file.path}
                  className="flex items-center justify-between p-2.5 px-3 hover:bg-[#141916]/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleFile(file.path)}
                    />
                    <span className="text-xs font-mono text-[#F1F4EF]">
                      {file.path}
                    </span>
                    {isSkillMd && (
                      <Badge variant="brand" className="text-[10px]">
                        Required
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#707A72]">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="ghost"
              size="sm"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!hasSkillMd || selectedFiles.length === 0}
              variant="primary"
              size="default"
              className="gap-1.5 font-semibold"
            >
              <span>Next: Configure Metadata</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Configure Metadata */}
      {currentStep === 3 && (
        <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#F1F4EF]">
              Configure Skill Details
            </h2>
            <p className="text-xs text-[#A9B1AA]">
              Review the imported name, description, category, and tags.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Skill Name</label>
              <Input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px] text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#F1F4EF]">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 bg-[#0E1210] border-[#252D28] text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0E1210] border-[#252D28]">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#F1F4EF]">Branch</label>
                <Input
                  type="text"
                  value={selectedBranch}
                  disabled
                  className="text-xs font-mono bg-[#141916]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="ghost"
              size="sm"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              disabled={!skillName.trim()}
              variant="primary"
              size="default"
              className="gap-1.5 font-semibold"
            >
              <span>Next: Review &amp; Import</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Final Import */}
      {currentStep === 4 && (
        <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#F1F4EF]">
              Review &amp; Import Snapshot
            </h2>
            <p className="text-xs text-[#A9B1AA]">
              Verify your snapshot configuration before creating the draft.
            </p>
          </div>

          <div className="border border-[#252D28] rounded-[8px] bg-[#080B0A] p-5 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[#707A72] block">Repository:</span>
                <span className="text-[#F1F4EF] truncate block">{repoUrl}</span>
              </div>
              <div>
                <span className="text-[#707A72] block">Branch:</span>
                <span className="text-[#CCD7C5]">{selectedBranch}</span>
              </div>
              <div>
                <span className="text-[#707A72] block">Skill Name:</span>
                <span className="text-[#F1F4EF]">{skillName}</span>
              </div>
              <div>
                <span className="text-[#707A72] block">Category:</span>
                <span className="text-[#CCD7C5] capitalize">{category}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1A211D]">
              <span className="text-[#707A72] block mb-2">
                Selected Files ({selectedFiles.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded bg-[#141916] border border-[#252D28]">
                {selectedFiles.map((file) => (
                  <span
                    key={file}
                    className="px-2 py-0.5 rounded text-[11px] bg-[#080B0A] border border-[#252D28] text-[#A9B1AA]"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="ghost"
              size="sm"
            >
              Back
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              variant="primary"
              size="default"
              className="gap-2 font-semibold shadow-md"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Importing Snapshot...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Import as Draft</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
