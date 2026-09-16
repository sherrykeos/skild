import { Router } from "express";

import authenticate from "../auth/src/auth.middleware.js";
import validate from "../../middlewares/validate.js";

import {
  updateProfileSchema,
  usernameParamSchema,
} from "./user.schema.js";

import {
  getMe,
  updateMe,
  getPublicProfile,
  becomeCreatorHandler,
} from "./user.controller.js";

const router = Router();

/**
 * GET /api/users/me
 * Get current authenticated user profile.
 */
router.get(
  "/me",
  authenticate,
  getMe,
);

/**
 * POST /api/users/me/become-creator
 * Activate Creator access for the authenticated user.
 */
router.post(
  "/me/become-creator",
  authenticate,
  becomeCreatorHandler,
);

/**
 * PATCH /api/users/me
 * Update current authenticated user profile.
 */
router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateMe,
);

/**
 * GET /api/users/:username
 * Get public profile and published skills by username.
 */
router.get(
  "/:username",
  validate(usernameParamSchema, "params"),
  getPublicProfile,
);

export default router;
