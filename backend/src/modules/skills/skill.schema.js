import { z } from "zod";

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Skill name must be at least 3 characters.")
    .max(100, "Skill name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),

  categoryId: z
    .string()
    .cuid("Invalid category ID.")
    .optional(),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty.")
        .max(30, "Tag cannot exceed 30 characters.")
    )
    .max(10, "A skill can have at most 10 tags.")
    .optional()
    .default([]),
});

export const updateSkillSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Skill name must be at least 3 characters.")
      .max(100, "Skill name cannot exceed 100 characters.")
      .optional(),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters.")
      .max(500, "Description cannot exceed 500 characters.")
      .optional(),

    categoryId: z
      .string()
      .cuid("Invalid category ID.")
      .nullable()
      .optional(),

    tags: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Tag cannot be empty.")
          .max(30, "Tag cannot exceed 30 characters.")
      )
      .max(10, "A skill can have at most 10 tags.")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required."
  );

export const skillIdSchema = z.object({
  id: z.cuid("Invalid skill ID."),
});

export const listSkillsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(20),

  status: z
    .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .optional(),

  category: z
    .string()
    .trim()
    .optional(),

  tag: z
    .string()
    .trim()
    .optional(),

  search: z
    .string()
    .trim()
    .max(100)
    .optional(),

  sort: z
    .enum(["latest", "popular", "upvotes"])
    .default("latest"),
});

export const skillSlugSchema = z.object({
  slug: z
      .string()
      .trim()
      .min(1)
      .max(150),
});