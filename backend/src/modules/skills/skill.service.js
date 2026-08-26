import ApiError from "../../utils/ApiError.js";

import {
    createSkill as createSkillRepo,
    findSkillById,
    findSkillBySlug,
    findSkillsByAuthor,
    countSkillsByAuthor,
    updateSkill,
    replaceSkillTags,
    deleteSkill,
    publishSkill,
    archiveSkill,
    restoreSkill,
    findCategoryById,
    findTagsByNames,
} from "./skill.repository.js";

/**
 * Generate a URL-friendly slug from a skill name.
 */
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}


/**
 * Generate a unique slug.
 *
 * Example:
 * React Code Reviewer
 *      ↓
 * react-code-reviewer
 *
 * If that already exists:
 *
 * react-code-reviewer-2
 */
async function generateUniqueSlug(name, currentSkillId = null) {
    const baseSlug = generateSlug(name);

    if (!baseSlug) {
        throw new ApiError(
            400,
            "Skill name cannot generate a valid slug.",
            "INVALID_SKILL_NAME",
        );
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existingSkill = await findSkillBySlug(slug);

        if (!existingSkill || existingSkill.id === currentSkillId) {
            return slug;
        }

        counter += 1;
        slug = `${baseSlug}-${counter}`;
    }
}


/**
 * Validate category if provided.
 */
async function validateCategory(categoryId) {
    if (!categoryId) {
        return;
    }

    const category = await findCategoryById(categoryId);

    if (!category) {
        throw new ApiError(
            404,
            "Category not found.",
            "CATEGORY_NOT_FOUND",
        );
    }
}


/**
 * Resolve tag names into existing Tag IDs.
 *
 * Skill creation receives:
 *
 * ["react", "coding", "review"]
 *
 * Repository receives:
 *
 * ["tag-id-1", "tag-id-2", "tag-id-3"]
 *
 * We intentionally do not automatically create tags here.
 * Tags should be controlled by the system.
 */
async function resolveTagIds(tags = []) {
    if (!tags.length) {
        return [];
    }

    const normalizedTags = [
        ...new Set(
            tags.map((tag) =>
                tag.trim().toLowerCase()
            ),
        ),
    ];

    const foundTags = await findTagsByNames(normalizedTags);

    const foundTagNames = new Set(
        foundTags.map((tag) => tag.name),
    );

    const missingTags = normalizedTags.filter(
        (tag) => !foundTagNames.has(tag),
    );

    if (missingTags.length > 0) {
        throw new ApiError(
            400,
            `Unknown tags: ${missingTags.join(", ")}`,
            "INVALID_TAGS",
            missingTags.map((tag) => ({
                field: "tags",
                value: tag,
                message: `Tag "${tag}" does not exist.`,
            })),
        );
    }

    return foundTags.map((tag) => tag.id);
}


/**
 * Create a new Skill.
 *
 * New skills always start as DRAFT.
 * The first version and SKILL.md are created
 * by the repository.
 */
export async function createSkill(userId, input) {
    const {
        name,
        description,
        categoryId,
        tags = [],
    } = input;

    await validateCategory(categoryId);

    const tagIds = await resolveTagIds(tags);

    const slug = await generateUniqueSlug(name);

    const initialContent = `# ${name}\n\n${description}\n`;

    const skill = await createSkillRepo({
        name,
        slug,
        description,
        authorId: userId,
        categoryId: categoryId ?? null,
        tags: tagIds,
        initialContent,
    });

    return skill;
}


/**
 * Get a skill by ID.
 *
 * Used internally and for authenticated creator operations.
 */
export async function getSkillById(id) {
    const skill = await findSkillById(id);

    if (!skill) {
        throw new ApiError(
            404,
            "Skill not found.",
            "SKILL_NOT_FOUND",
        );
    }

    return skill;
}


/**
 * Get a public skill by slug.
 *
 * Only published skills are publicly accessible.
 */
export async function getPublishedSkillBySlug(slug) {
    const skill = await findSkillBySlug(slug);

    if (!skill) {
        throw new ApiError(
            404,
            "Skill not found.",
            "SKILL_NOT_FOUND",
        );
    }

    if (skill.status !== "PUBLISHED") {
        throw new ApiError(
            404,
            "Skill not found.",
            "SKILL_NOT_FOUND",
        );
    }

    return skill;
}


/**
 * Get skills belonging to a creator.
 */
export async function getCreatorSkills(
    userId,
    options = {},
) {
    const [skills, total] = await Promise.all([
        findSkillsByAuthor(userId, options),
        countSkillsByAuthor(userId),
    ]);

    return {
        skills,
        total,
    };
}


/**
 * Update skill metadata.
 *
 * Only the owner can update the skill.
 *
 * Published skills can still have their metadata edited,
 * but changing the actual skill files will eventually
 * create a new version.
 */
export async function updateSkillById(
    skillId,
    userId,
    input,
) {
    const skill = await getSkillById(skillId);

    if (skill.authorId !== userId) {
        throw new ApiError(
            403,
            "You are not allowed to modify this skill.",
            "SKILL_FORBIDDEN",
        );
    }

    if (skill.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Archived skills cannot be edited.",
            "SKILL_ARCHIVED",
        );
    }

    let slug;

    if (input.name !== undefined) {
        slug = await generateUniqueSlug(
            input.name,
            skillId,
        );
    }

    if (input.categoryId !== undefined) {
        await validateCategory(input.categoryId);
    }

    const updatedSkill = await updateSkill(
        skillId,
        {
            name: input.name,
            slug,
            description: input.description,
            categoryId: input.categoryId,
        },
    );

    if (input.tags !== undefined) {
        const tagIds = await resolveTagIds(input.tags);

        return replaceSkillTags(
            skillId,
            tagIds,
        );
    }

    return updatedSkill;
}


/**
 * Publish a skill.
 *
 * Publishing rules:
 *
 * 1. User must own the skill.
 * 2. Skill cannot be archived.
 * 3. SKILL.md must exist.
 * 4. SKILL.md cannot be empty.
 */
export async function publishSkillById(
    skillId,
    userId,
) {
    const skill = await getSkillById(skillId);

    if (skill.authorId !== userId) {
        throw new ApiError(
            403,
            "You are not allowed to publish this skill.",
            "SKILL_FORBIDDEN",
        );
    }

    if (skill.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Archived skills cannot be published.",
            "SKILL_ARCHIVED",
        );
    }

    const currentVersion = skill.versions?.[0];

    if (!currentVersion) {
        throw new ApiError(
            400,
            "Skill does not have a version.",
            "SKILL_VERSION_MISSING",
        );
    }

    const skillFile = currentVersion.files?.find(
        (file) => file.path === "SKILL.md",
    );

    if (!skillFile) {
        throw new ApiError(
            400,
            "SKILL.md is required before publishing.",
            "SKILL_FILE_MISSING",
        );
    }

    if (!skillFile.content.trim()) {
        throw new ApiError(
            400,
            "SKILL.md cannot be empty.",
            "SKILL_FILE_EMPTY",
        );
    }

    return publishSkill(skillId);
}


/**
 * Archive a skill.
 */
export async function archiveSkillById(
    skillId,
    userId,
) {
    const skill = await getSkillById(skillId);

    if (skill.authorId !== userId) {
        throw new ApiError(
            403,
            "You are not allowed to archive this skill.",
            "SKILL_FORBIDDEN",
        );
    }

    if (skill.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Skill is already archived.",
            "SKILL_ALREADY_ARCHIVED",
        );
    }

    return archiveSkill(skillId);
}


/**
 * Restore an archived skill back to draft.
 */
export async function restoreSkillById(
    skillId,
    userId,
) {
    const skill = await getSkillById(skillId);

    if (skill.authorId !== userId) {
        throw new ApiError(
            403,
            "You are not allowed to restore this skill.",
            "SKILL_FORBIDDEN",
        );
    }

    if (skill.status !== "ARCHIVED") {
        throw new ApiError(
            400,
            "Only archived skills can be restored.",
            "SKILL_NOT_ARCHIVED",
        );
    }

    return restoreSkill(skillId);
}


/**
 * Delete a skill.
 *
 * We allow deletion only while the skill is a draft.
 * Once published, the creator should archive it instead.
 */
export async function deleteSkillById(
    skillId,
    userId,
) {
    const skill = await getSkillById(skillId);

    if (skill.authorId !== userId) {
        throw new ApiError(
            403,
            "You are not allowed to delete this skill.",
            "SKILL_FORBIDDEN",
        );
    }

    if (skill.status !== "DRAFT") {
        throw new ApiError(
            400,
            "Only draft skills can be deleted. Published skills must be archived.",
            "SKILL_DELETE_FORBIDDEN",
        );
    }

    await deleteSkill(skillId);

    return null;
}