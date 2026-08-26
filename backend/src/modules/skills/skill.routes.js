import { Router } from "express";

import authenticate from "../auth/src/auth.middleware.js";

import validate from "../../middlewares/validate.js";

import {
    createSkillSchema,
    updateSkillSchema,
    skillIdSchema,
    skillSlugSchema,
} from "./skill.schema.js";

import {
    create,
    getById,
    getPublicBySlug,
    getMine,
    update,
    publish,
    archive,
    restore,
    remove,
} from "./skill.controller.js";


const router = Router();


// ============================================================
// Public routes
// ============================================================

/**
 * GET /api/skills/public/:slug
 *
 * Get a published skill.
 */
router.get(
    "/public/:slug",
    validate(skillSlugSchema, "params"),
    getPublicBySlug,
);


// ============================================================
// Authenticated creator routes
// ============================================================

/**
 * GET /api/skills/mine
 *
 * Get skills belonging to the authenticated creator.
 */
router.get(
    "/mine",
    authenticate,
    getMine,
);


/**
 * GET /api/skills/:id
 *
 * Get a skill by ID.
 */
router.get(
    "/:id",
    authenticate,
    validate(skillIdSchema, "params"),
    getById,
);


/**
 * POST /api/skills
 *
 * Create a new draft skill.
 */
router.post(
    "/",
    authenticate,
    validate(createSkillSchema),
    create,
);


/**
 * PATCH /api/skills/:id
 *
 * Update skill metadata.
 */
router.patch(
    "/:id",
    authenticate,
    validate(skillIdSchema, "params"),
    validate(updateSkillSchema),
    update,
);


/**
 * POST /api/skills/:id/publish
 *
 * Publish a draft skill.
 */
router.post(
    "/:id/publish",
    authenticate,
    validate(skillIdSchema, "params"),
    publish,
);


/**
 * POST /api/skills/:id/archive
 *
 * Archive a published skill.
 */
router.post(
    "/:id/archive",
    authenticate,
    validate(skillIdSchema, "params"),
    archive,
);


/**
 * POST /api/skills/:id/restore
 *
 * Restore an archived skill to draft.
 */
router.post(
    "/:id/restore",
    authenticate,
    validate(skillIdSchema, "params"),
    restore,
);


/**
 * DELETE /api/skills/:id
 *
 * Delete a draft skill.
 */
router.delete(
    "/:id",
    authenticate,
    validate(skillIdSchema, "params"),
    remove,
);


export default router;