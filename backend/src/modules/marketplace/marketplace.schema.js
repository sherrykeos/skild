import { z } from "zod";

/**
 * Schema for marketplace search/browse query parameters.
 *
 * GET /api/marketplace/skills
 */
export const marketplaceQuerySchema = z.object({
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

  search: z.string().trim().optional(),

  category: z.string().trim().optional(),

  tags: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      return val
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);
    }),

  sort: z.enum(["latest", "popular", "upvotes"]).default("latest"),
});

/**
 * Schema for marketplace skill slug route parameter.
 *
 * GET /api/marketplace/skills/:slug
 */
export const marketplaceSlugSchema = z.object({
  slug: z.string().trim().min(1, "Skill slug is required."),
});
