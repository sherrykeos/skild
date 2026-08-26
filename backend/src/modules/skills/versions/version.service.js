import ApiError from "../../../utils/ApiError.js";
import { getSkillById } from "../skill.service.js";
import * as versionRepository from "./version.repository.js";

/**
 * Normalize path:
 * - Trims whitespaces
 * - Replaces backslashes with forward slashes
 * - Removes leading/trailing slashes
 */
export function normalizePath(p) {
  if (!p) return "";
  let normalized = p.trim().replace(/\\/g, "/");
  if (normalized.startsWith("/")) {
    normalized = normalized.substring(1);
  }
  if (normalized.endsWith("/")) {
    normalized = normalized.substring(0, normalized.length - 1);
  }
  return normalized;
}

/**
 * Validate path format (no traversal, no empty paths).
 */
function validatePathFormat(path) {
  const normalized = normalizePath(path);
  if (!normalized) {
    throw new ApiError(400, "File path cannot be empty.", "INVALID_FILE_PATH");
  }
  if (normalized.includes("..") || normalized.startsWith("/")) {
    throw new ApiError(400, `Invalid file path format: "${path}".`, "INVALID_FILE_PATH");
  }
  return normalized;
}

/**
 * Create a new skill version.
 */
export async function createVersion(userId, skillId, input) {
  const skill = await getSkillById(skillId);

  if (skill.authorId !== userId) {
    throw new ApiError(
      403,
      "You are not allowed to modify this skill.",
      "SKILL_FORBIDDEN"
    );
  }

  const newVersionNumber = input.version.trim();

  // Check version format
  if (!/^\d+\.\d+\.\d+$/.test(newVersionNumber)) {
    throw new ApiError(
      400,
      "Version must follow semantic versioning (e.g., 1.1.0).",
      "INVALID_VERSION_FORMAT"
    );
  }

  // Check for duplicate version number
  const existingVersion = skill.versions?.find((v) => v.version === newVersionNumber);
  if (existingVersion) {
    throw new ApiError(
      400,
      `Version "${newVersionNumber}" already exists for this skill.`,
      "VERSION_ALREADY_EXISTS"
    );
  }

  let finalFiles = [];

  if (input.fromVersionId) {
    const sourceVersion = skill.versions?.find((v) => v.id === input.fromVersionId);
    if (!sourceVersion) {
      throw new ApiError(
        404,
        "Source version not found or does not belong to this skill.",
        "VERSION_NOT_FOUND"
      );
    }

    // Copy source files
    finalFiles = sourceVersion.files.map((f) => ({
      path: f.path,
      content: f.content,
      mimeType: f.mimeType,
    }));

    // Override/add files from input if provided
    if (input.files && input.files.length > 0) {
      for (const overrideFile of input.files) {
        const normalizedPath = validatePathFormat(overrideFile.path);

        if (normalizedPath === "SKILL.md" && !overrideFile.content.trim()) {
          throw new ApiError(400, "SKILL.md cannot be empty.", "SKILL_FILE_EMPTY");
        }

        const existingIndex = finalFiles.findIndex(
          (f) => f.path.toLowerCase() === normalizedPath.toLowerCase()
        );

        const newFileData = {
          path: normalizedPath,
          content: overrideFile.content,
          mimeType: overrideFile.mimeType || null,
        };

        if (existingIndex !== -1) {
          finalFiles[existingIndex] = newFileData;
        } else {
          finalFiles.push(newFileData);
        }
      }
    }
  } else {
    if (!input.files || input.files.length === 0) {
      throw new ApiError(
        400,
        "Files array is required when fromVersionId is not provided.",
        "FILES_REQUIRED"
      );
    }

    const pathSet = new Set();
    for (const file of input.files) {
      const normalizedPath = validatePathFormat(file.path);

      if (pathSet.has(normalizedPath.toLowerCase())) {
        throw new ApiError(
          400,
          `Duplicate file path "${normalizedPath}" in request.`,
          "DUPLICATE_FILE_PATH"
        );
      }
      pathSet.add(normalizedPath.toLowerCase());

      finalFiles.push({
        path: normalizedPath,
        content: file.content,
        mimeType: file.mimeType || null,
      });
    }
  }

  // Validate SKILL.md existence and content
  const skillMd = finalFiles.find((f) => f.path === "SKILL.md");
  if (!skillMd) {
    throw new ApiError(400, "SKILL.md is required.", "SKILL_FILE_REQUIRED");
  }
  if (!skillMd.content.trim()) {
    throw new ApiError(400, "SKILL.md cannot be empty.", "SKILL_FILE_EMPTY");
  }

  return versionRepository.createVersion(
    skillId,
    {
      version: newVersionNumber,
      changelog: input.changelog,
    },
    finalFiles
  );
}

/**
 * List all versions of a skill.
 * If not the owner, draft versions are excluded.
 */
export async function getVersions(userId, skillId) {
  const skill = await getSkillById(skillId);

  let versions = skill.versions || [];

  if (skill.authorId !== userId) {
    if (skill.status !== "PUBLISHED") {
      throw new ApiError(
        403,
        "You are not allowed to view versions of this skill.",
        "SKILL_FORBIDDEN"
      );
    }
    versions = versions.filter((v) => v.publishedAt !== null);
  }

  return versions.map((v) => ({
    id: v.id,
    version: v.version,
    changelog: v.changelog,
    createdAt: v.createdAt,
    publishedAt: v.publishedAt,
  }));
}

/**
 * Get details of a specific version.
 */
export async function getVersionById(userId, skillId, versionId) {
  const skill = await getSkillById(skillId);

  const version = await versionRepository.findVersionById(versionId);
  if (!version || version.skillId !== skillId) {
    throw new ApiError(404, "Version not found.", "VERSION_NOT_FOUND");
  }

  if (skill.authorId !== userId) {
    if (skill.status !== "PUBLISHED" || version.publishedAt === null) {
      throw new ApiError(
        403,
        "You are not allowed to view this version.",
        "SKILL_FORBIDDEN"
      );
    }
  }

  return version;
}

/**
 * Update draft version changelog and files.
 */
export async function updateVersion(userId, skillId, versionId, input) {
  const skill = await getSkillById(skillId);

  if (skill.authorId !== userId) {
    throw new ApiError(
      403,
      "You are not allowed to modify this skill.",
      "SKILL_FORBIDDEN"
    );
  }

  const version = await versionRepository.findVersionById(versionId);
  if (!version || version.skillId !== skillId) {
    throw new ApiError(404, "Version not found.", "VERSION_NOT_FOUND");
  }

  // Published versions are immutable
  if (version.publishedAt !== null) {
    throw new ApiError(
      400,
      "Published versions are immutable and cannot be modified.",
      "VERSION_PUBLISHED"
    );
  }

  let filesToUpsert = [];

  if (input.files && input.files.length > 0) {
    const pathSet = new Set();

    for (const file of input.files) {
      const normalizedPath = validatePathFormat(file.path);

      if (pathSet.has(normalizedPath.toLowerCase())) {
        throw new ApiError(
          400,
          `Duplicate file path "${normalizedPath}" in request.`,
          "DUPLICATE_FILE_PATH"
        );
      }
      pathSet.add(normalizedPath.toLowerCase());

      // Validate SKILL.md rules
      if (normalizedPath === "SKILL.md" && !file.content.trim()) {
        throw new ApiError(
          400,
          "SKILL.md cannot be updated to be empty.",
          "SKILL_FILE_EMPTY"
        );
      }

      filesToUpsert.push({
        path: normalizedPath,
        content: file.content,
        mimeType: file.mimeType || null,
      });
    }
  }

  return versionRepository.updateVersion(
    versionId,
    { changelog: input.changelog },
    filesToUpsert
  );
}

/**
 * Delete a draft version of a skill.
 */
export async function deleteVersion(userId, skillId, versionId) {
  const skill = await getSkillById(skillId);

  if (skill.authorId !== userId) {
    throw new ApiError(
      403,
      "You are not allowed to modify this skill.",
      "SKILL_FORBIDDEN"
    );
  }

  const version = await versionRepository.findVersionById(versionId);
  if (!version || version.skillId !== skillId) {
    throw new ApiError(404, "Version not found.", "VERSION_NOT_FOUND");
  }

  // Published versions cannot be deleted
  if (version.publishedAt !== null) {
    throw new ApiError(
      400,
      "Published versions cannot be deleted.",
      "VERSION_PUBLISHED"
    );
  }

  // Do not allow deleting the only version of a skill
  if (skill.versions?.length <= 1) {
    throw new ApiError(
      400,
      "Cannot delete the only version of a skill.",
      "DELETE_VERSION_FORBIDDEN"
    );
  }

  await versionRepository.deleteVersion(versionId);
  return null;
}
