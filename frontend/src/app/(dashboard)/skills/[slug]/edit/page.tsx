"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  CheckCircle2,
  GitBranch,
  ArrowLeft,
  FileCode,
  Layers,
  Settings as SettingsIcon,
  Eye,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MultiFileTree } from "@/components/editor/multi-file-tree";
import { MonacoCodeEditor } from "@/components/editor/monaco-code-editor";
import { MarkdownLivePreview } from "@/components/editor/markdown-live-preview";
import { NewVersionDialog } from "@/components/editor/new-version-dialog";
import { PublishConfirmDialog } from "@/components/editor/publish-confirm-dialog";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { skillsApi } from "@/lib/api/skills";
import { SkillFile } from "@/types/skill";
import { toast } from "sonner";

export default function SkillEditStudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const skillId = resolvedParams.slug;
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch skill
  const {
    data: skill,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["creator-skill", skillId],
    queryFn: () => skillsApi.getById(skillId),
  });

  // Local editing state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<SkillFile[]>([]);
  const [selectedPath, setSelectedPath] = useState("SKILL.md");
  const [showPreview, setShowPreview] = useState(true);

  // Dialogs
  const [newVersionOpen, setNewVersionOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const activeVersion = skill?.versions?.[0];
  const activeVersionNumber = activeVersion?.version || "1.0.0";
  const isPublished = skill?.status === "PUBLISHED";

  // Synchronize state when skill data loads
  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setDescription(skill.description);
      const initialFiles =
        skill.versions?.[0]?.files && skill.versions[0].files.length > 0
          ? skill.versions[0].files
          : [
              {
                path: "SKILL.md",
                content: `# ${skill.name}\n\n${skill.description}\n`,
                mimeType: "text/markdown",
              },
            ];
      setFiles(initialFiles);
      if (!initialFiles.some((f) => f.path === selectedPath)) {
        setSelectedPath(initialFiles[0]?.path || "SKILL.md");
      }
    }
  }, [skill]);

  // Selected file object
  const selectedFile = files.find((f) => f.path === selectedPath) || files[0];

  // File Handlers
  const handleContentChange = (newContent: string) => {
    if (!selectedFile) return;
    setFiles((prev) =>
      prev.map((f) => (f.path === selectedPath ? { ...f, content: newContent } : f))
    );
  };

  const handleAddFile = (newPath: string) => {
    const newFile: SkillFile = {
      path: newPath,
      content: newPath.endsWith(".md") ? `# ${newPath}\n` : "",
      mimeType: newPath.endsWith(".md") ? "text/markdown" : "text/plain",
    };
    setFiles((prev) => [...prev, newFile]);
    setSelectedPath(newPath);
    toast.success(`Created file "${newPath}"`);
  };

  const handleRenameFile = (oldPath: string, newPath: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === oldPath ? { ...f, path: newPath } : f))
    );
    if (selectedPath === oldPath) setSelectedPath(newPath);
    toast.success(`Renamed file to "${newPath}"`);
  };

  const handleDeleteFile = (path: string) => {
    if (path === "SKILL.md") {
      toast.error("SKILL.md is required and cannot be deleted.");
      return;
    }
    const remaining = files.filter((f) => f.path !== path);
    setFiles(remaining);
    if (selectedPath === path) {
      setSelectedPath(remaining[0]?.path || "SKILL.md");
    }
    toast.success(`Deleted file "${path}"`);
  };

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      // 1. Update metadata
      await skillsApi.update(skillId, {
        name: name.trim(),
        description: description.trim(),
      });

      // 2. Update files in active version draft
      if (activeVersion?.id) {
        await skillsApi.updateVersion(skillId, activeVersion.id, {
          files,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-skill", skillId] });
      queryClient.invalidateQueries({ queryKey: ["my-skills"] });
      toast.success("Skill draft & files saved successfully!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to save draft."),
  });

  // Create Version Mutation
  const handleCreateVersion = async (version: string, changelog: string) => {
    await skillsApi.createVersion(skillId, {
      version,
      changelog,
      files,
    });
    queryClient.invalidateQueries({ queryKey: ["creator-skill", skillId] });
    toast.success(`New version v${version} created!`);
  };

  // Publish Mutation
  const handlePublish = async () => {
    const skillMd = files.find((f) => f.path === "SKILL.md");
    if (!skillMd || !skillMd.content.trim()) {
      toast.error("SKILL.md is required and cannot be empty before publishing.");
      return;
    }

    // Save current changes first
    await saveDraftMutation.mutateAsync();
    // Call publish endpoint
    await skillsApi.publish(skillId, activeVersion?.id);

    queryClient.invalidateQueries({ queryKey: ["creator-skill", skillId] });
    queryClient.invalidateQueries({ queryKey: ["my-skills"] });
    toast.success(`Skill "${name}" published successfully!`);
    router.push(`/skills/${skill?.slug}`);
  };

  if (isLoading) {
    return <LoadingState message="Loading skill editor studio..." />;
  }

  if (isError || !skill) {
    return (
      <ErrorState
        title="Unable to load skill"
        message="This skill could not be found or you do not have permission to edit it."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#252D28] pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="iconSm" title="Back to My Skills">
            <Link href="/skills">
              <ArrowLeft className="h-4 w-4 text-[#707A72]" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#F1F4EF] truncate max-w-sm sm:max-w-md">
                {name || skill.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-[#CCD7C5]/30 bg-[#CCD7C5]/10 text-[#CCD7C5]">
                v{activeVersionNumber}
              </span>
              {skill.status === "PUBLISHED" ? (
                <Badge variant="success" className="text-[10px]">
                  Published
                </Badge>
              ) : (
                <Badge variant="warning" className="text-[10px]">
                  Draft
                </Badge>
              )}
            </div>
            <p className="text-[11px] font-mono text-[#707A72]">
              Slug: {skill.slug} • {files.length} files
            </p>
          </div>
        </div>

        {/* Studio Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isPublished && (
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href={`/skills/${skill.slug}`}>
                <Eye className="h-3.5 w-3.5 text-[#CCD7C5]" />
                <span>View Public</span>
              </Link>
            </Button>
          )}

          <Button
            onClick={() => saveDraftMutation.mutate()}
            disabled={saveDraftMutation.isPending}
            variant="secondary"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saveDraftMutation.isPending ? "Saving..." : "Save Draft"}</span>
          </Button>

          <Button
            onClick={() => setNewVersionOpen(true)}
            variant="secondary"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <GitBranch className="h-3.5 w-3.5 text-[#CCD7C5]" />
            <span>Create Version</span>
          </Button>

          <Button
            onClick={() => setPublishOpen(true)}
            variant="primary"
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Publish</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Tabs */}
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="bg-[#0E1210] border-[#252D28] mb-4">
          <TabsTrigger value="files" className="text-xs gap-1.5">
            <FileCode className="h-3.5 w-3.5" />
            <span>Files &amp; Code Editor</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="text-xs gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="text-xs gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            <span>Version Releases ({skill.versions?.length || 1})</span>
          </TabsTrigger>
        </TabsList>

        {/* 3-Pane Code Editor Tab */}
        <TabsContent value="files" className="mt-0">
          <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] flex flex-col lg:flex-row h-[600px] overflow-hidden">
            {/* Left: Multi-File Tree */}
            <MultiFileTree
              files={files}
              selectedPath={selectedPath}
              onSelectFile={setSelectedPath}
              onAddFile={handleAddFile}
              onRenameFile={handleRenameFile}
              onDeleteFile={handleDeleteFile}
            />

            {/* Center: Monaco Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0E1210]">
              <div className="h-10 px-4 border-b border-[#252D28] bg-[#141916]/40 flex items-center justify-between">
                <span className="text-xs font-mono text-[#CCD7C5]">
                  Editing: {selectedPath}
                </span>

                {selectedPath.endsWith(".md") && (
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="ghost"
                    size="xs"
                    className="text-[11px] text-[#A9B1AA] hover:text-[#F1F4EF]"
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                )}
              </div>

              <div className="flex-1 min-h-0">
                <MonacoCodeEditor
                  value={selectedFile?.content || ""}
                  onChange={handleContentChange}
                  language={
                    selectedPath.endsWith(".md")
                      ? "markdown"
                      : selectedPath.endsWith(".py")
                      ? "python"
                      : selectedPath.endsWith(".json")
                      ? "json"
                      : selectedPath.endsWith(".ts") || selectedPath.endsWith(".tsx")
                      ? "typescript"
                      : selectedPath.endsWith(".js") || selectedPath.endsWith(".jsx")
                      ? "javascript"
                      : "plaintext"
                  }
                />
              </div>
            </div>

            {/* Right: Live Markdown Preview (Collapsible) */}
            {showPreview && selectedPath.endsWith(".md") && (
              <div className="hidden lg:block w-80 shrink-0">
                <MarkdownLivePreview content={selectedFile?.content || ""} />
              </div>
            )}
          </div>
        </TabsContent>

        {/* Basic Info Tab */}
        <TabsContent value="info" className="mt-0 space-y-4">
          <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] p-6 max-w-2xl space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Skill Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] text-xs"
              />
            </div>

            <Button
              onClick={() => saveDraftMutation.mutate()}
              disabled={saveDraftMutation.isPending}
              variant="primary"
              size="sm"
            >
              {saveDraftMutation.isPending ? "Saving..." : "Save Metadata"}
            </Button>
          </div>
        </TabsContent>

        {/* Version Releases Tab */}
        <TabsContent value="versions" className="mt-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A9B1AA]">
              Published versions are locked and immutable. Create a new release to publish updates.
            </span>
            <Button
              onClick={() => setNewVersionOpen(true)}
              variant="secondary"
              size="sm"
              className="text-xs gap-1.5"
            >
              <GitBranch className="h-3.5 w-3.5 text-[#CCD7C5]" />
              <span>New Version</span>
            </Button>
          </div>

          <div className="border border-[#252D28] rounded-[8px] bg-[#0E1210] divide-y divide-[#1A211D]">
            {skill.versions?.map((v) => (
              <div key={v.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#F1F4EF]">
                      v{v.version}
                    </span>
                    {v.publishedAt ? (
                      <Badge variant="success" className="text-[10px]">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">
                        Draft
                      </Badge>
                    )}
                  </div>
                  {v.changelog && (
                    <p className="text-xs text-[#A9B1AA] mt-1 font-mono">{v.changelog}</p>
                  )}
                </div>
                <div className="text-xs font-mono text-[#707A72]">
                  {v.files?.length || 0} files
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Version & Publish Dialogs */}
      <NewVersionDialog
        open={newVersionOpen}
        onOpenChange={setNewVersionOpen}
        latestVersion={activeVersionNumber}
        onConfirm={handleCreateVersion}
      />

      <PublishConfirmDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        skillName={name}
        versionNumber={activeVersionNumber}
        onConfirm={handlePublish}
      />
    </div>
  );
}
