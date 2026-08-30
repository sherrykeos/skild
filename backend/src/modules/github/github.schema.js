import { z } from "zod";

/**
 * Schema for inspect repository endpoint (POST /api/github/inspect).
 */
export const inspectRepositorySchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Repository URL is required."),
});

/**
 * Schema for browse repository tree endpoint (GET /api/github/tree).
 */
export const repositoryTreeSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Repository URL is required."),
  branch: z
    .string()
    .trim()
    .min(1, "Branch name is required."),
});

/**
 * Schema for import selected files endpoint (POST /api/github/import).
 */
export const importRepositorySchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Repository URL is required."),
  branch: z
    .string()
    .trim()
    .min(1, "Branch name is required."),
  files: z
    .array(
      z
        .string()
        .trim()
        .min(1, "File path cannot be empty.")
        .refine(
          (pathStr) => !pathStr.startsWith("/") && !pathStr.startsWith("\\"),
          "Absolute paths are not allowed.",
        )
        .refine(
          (pathStr) => !pathStr.split("/").includes("..") && !pathStr.split("\\").includes(".."),
          "Path traversal (..) is not allowed.",
        ),
    )
    .min(1, "At least one file must be selected.")
    .max(50, "Cannot import more than 50 files.")
    .refine(
      (fileList) => fileList.includes("SKILL.md"),
      "SKILL.md must be included in selected files.",
    )
    .refine(
      (fileList) => new Set(fileList).size === fileList.length,
      "Duplicate selected file paths are not allowed.",
    ),
});
