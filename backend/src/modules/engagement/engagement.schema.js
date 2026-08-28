import { z } from "zod";

/**
 * Parameter validation schemas.
 */
export const skillIdParamSchema = z.object({
  skillId: z.string().trim().min(1, "Skill ID is required."),
});

export const reviewIdParamSchema = z.object({
  reviewId: z.string().trim().min(1, "Review ID is required."),
});

export const collectionIdParamSchema = z.object({
  collectionId: z.string().trim().min(1, "Collection ID is required."),
});

export const collectionSkillParamSchema = z.object({
  collectionId: z.string().trim().min(1, "Collection ID is required."),
  skillId: z.string().trim().min(1, "Skill ID is required."),
});

/**
 * Review validation schemas.
 */
export const createReviewSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Review content cannot be empty.")
    .max(2000, "Review content cannot exceed 2000 characters."),
});

export const updateReviewSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Review content cannot be empty.")
    .max(2000, "Review content cannot exceed 2000 characters."),
});

/**
 * Collection validation schemas.
 */
export const createCollectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Collection name is required.")
    .max(100, "Collection name cannot exceed 100 characters."),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
});

export const updateCollectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Collection name cannot be empty.")
    .max(100, "Collection name cannot exceed 100 characters.")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
});

/**
 * Pagination query validation schema.
 */
export const paginationQuerySchema = z.object({
  page: z
    .preprocess(
      (val) => (val !== undefined && val !== "" ? Number(val) : 1),
      z.number().int("Page must be an integer.").min(1, "Page must be at least 1")
    )
    .default(1),

  limit: z
    .preprocess(
      (val) => (val !== undefined && val !== "" ? Number(val) : 20),
      z
        .number()
        .int("Limit must be an integer.")
        .min(1, "Limit must be at least 1")
        .max(50, "Limit cannot exceed 50")
    )
    .default(20),
});
