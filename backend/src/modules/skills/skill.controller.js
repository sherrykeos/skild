import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
    createSkill,
    getSkillById,
    getPublishedSkillBySlug,
    getCreatorSkills,
    updateSkillById,
    publishSkillById,
    archiveSkillById,
    restoreSkillById,
    deleteSkillById,
} from "./skill.service.js";


/**
 * Create a new skill.
 *
 * POST /api/skills
 */
const create = asyncHandler(async (req, res) => {
    const skill = await createSkill(
        req.user.id,
        req.body,
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                skill,
                "Skill created successfully.",
            ),
        );
});


/**
 * Get a skill by ID.
 *
 * GET /api/skills/:id
 *
 * This endpoint is intended for authenticated
 * creator operations.
 */
const getById = asyncHandler(async (req, res) => {
    const skill = await getSkillById(
        req.params.id,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                skill,
                "Skill fetched successfully.",
            ),
        );
});


/**
 * Get a publicly published skill by slug.
 *
 * GET /api/skills/public/:slug
 */
const getPublicBySlug = asyncHandler(async (req, res) => {
    const skill = await getPublishedSkillBySlug(
        req.params.slug,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                skill,
                "Skill fetched successfully.",
            ),
        );
});


/**
 * Get skills created by the authenticated user.
 *
 * GET /api/skills/mine
 */
const getMine = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const result = await getCreatorSkills(
        req.user.id,
        {
            skip,
            take: limit,
        },
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    skills: result.skills,
                    pagination: {
                        page,
                        limit,
                        total: result.total,
                        totalPages: Math.ceil(
                            result.total / limit,
                        ),
                    },
                },
                "Skills fetched successfully.",
            ),
        );
});


/**
 * Update skill metadata.
 *
 * PATCH /api/skills/:id
 */
const update = asyncHandler(async (req, res) => {
    const skill = await updateSkillById(
        req.params.id,
        req.user.id,
        req.body,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                skill,
                "Skill updated successfully.",
            ),
        );
});


/**
 * Publish a skill.
 *
 * POST /api/skills/:id/publish
 */
const publish = asyncHandler(async (req, res) => {
    const skill = await publishSkillById(
        req.params.id,
        req.user.id,
        req.body,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                skill,
                "Skill published successfully.",
            ),
        );
});


/**
 * Archive a skill.
 *
 * POST /api/skills/:id/archive
 */
const archive = asyncHandler(async (req, res) => {
    const skill = await archiveSkillById(
        req.params.id,
        req.user.id,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                skill,
                "Skill archived successfully.",
            ),
        );
});


/**
 * Restore an archived skill.
 *
 * POST /api/skills/:id/restore
 */
const restore = asyncHandler(async (req, res) => {
    const skill = await restoreSkillById(
        req.params.id,
        req.user.id,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                skill,
                "Skill restored successfully.",
            ),
        );
});


/**
 * Delete a draft skill.
 *
 * DELETE /api/skills/:id
 */
const remove = asyncHandler(async (req, res) => {
    await deleteSkillById(
        req.params.id,
        req.user.id,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Skill deleted successfully.",
            ),
        );
});


export {
    create,
    getById,
    getPublicBySlug,
    getMine,
    update,
    publish,
    archive,
    restore,
    remove,
};