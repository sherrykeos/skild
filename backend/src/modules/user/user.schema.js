import { z } from "zod";

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username cannot exceed 20 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      )
      .optional(),

    avatar: z
      .string()
      .trim()
      .url("Invalid avatar URL.")
      .max(500, "Avatar URL cannot exceed 500 characters.")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required for profile update.",
  );

export const usernameParamSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .max(50, "Username cannot exceed 50 characters."),
});
