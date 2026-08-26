import { z } from "zod";

export const createVersionSchema = z
  .object({
    version: z
      .string()
      .trim()
      .regex(/^\d+\.\d+\.\d+$/, "Version must follow semantic versioning (e.g. 1.1.0)."),

    changelog: z
      .string()
      .trim()
      .max(1000, "Changelog cannot exceed 1000 characters.")
      .optional()
      .nullable(),

    fromVersionId: z
      .string()
      .cuid("Invalid source version ID.")
      .optional()
      .nullable(),

    files: z
      .array(
        z.object({
          path: z
            .string()
            .trim()
            .min(1, "Path cannot be empty.")
            .max(255, "Path cannot exceed 255 characters."),
          content: z.string(),
          mimeType: z
            .string()
            .trim()
            .max(100)
            .optional()
            .nullable(),
        })
      )
      .optional()
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (!data.fromVersionId) {
      if (!data.files || data.files.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Files are required when fromVersionId is not provided.",
          path: ["files"],
        });
        return;
      }
      const hasSkillMd = data.files.some((f) => f.path.trim() === "SKILL.md");
      if (!hasSkillMd) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SKILL.md is required when creating a version without a source version.",
          path: ["files"],
        });
      }
    }
  });

export const updateVersionSchema = z
  .object({
    changelog: z
      .string()
      .trim()
      .max(1000, "Changelog cannot exceed 1000 characters.")
      .optional()
      .nullable(),

    files: z
      .array(
        z.object({
          path: z
            .string()
            .trim()
            .min(1, "Path cannot be empty.")
            .max(255, "Path cannot exceed 255 characters."),
          content: z.string(),
          mimeType: z
            .string()
            .trim()
            .max(100)
            .optional()
            .nullable(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => data.changelog !== undefined || data.files !== undefined,
    "At least one field (changelog or files) is required to update."
  );

export const versionParamsSchema = z.object({
  skillId: z.string().cuid("Invalid skill ID."),
  versionId: z.string().cuid("Invalid version ID.").optional(),
});
