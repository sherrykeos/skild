import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import * as versionService from "./version.service.js";

/**
 * Create a new skill version.
 */
export const createVersion = asyncHandler(async (req, res) => {
  const version = await versionService.createVersion(
    req.user.id,
    req.params.skillId,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(201, version, "Version created successfully.")
  );
});

/**
 * List all versions of a skill.
 */
export const getVersions = asyncHandler(async (req, res) => {
  const userId = req.user?.id || null;
  const versions = await versionService.getVersions(
    userId,
    req.params.skillId
  );

  return res.status(200).json(
    new ApiResponse(200, versions, "Versions fetched successfully.")
  );
});

/**
 * Get details of a specific version.
 */
export const getVersionById = asyncHandler(async (req, res) => {
  const userId = req.user?.id || null;
  const version = await versionService.getVersionById(
    userId,
    req.params.skillId,
    req.params.versionId
  );

  return res.status(200).json(
    new ApiResponse(200, version, "Version fetched successfully.")
  );
});

/**
 * Update a draft version's changelog and files.
 */
export const updateVersion = asyncHandler(async (req, res) => {
  const version = await versionService.updateVersion(
    req.user.id,
    req.params.skillId,
    req.params.versionId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(200, version, "Version updated successfully.")
  );
});

/**
 * Delete a draft version.
 */
export const deleteVersion = asyncHandler(async (req, res) => {
  await versionService.deleteVersion(
    req.user.id,
    req.params.skillId,
    req.params.versionId
  );

  return res.status(200).json(
    new ApiResponse(200, null, "Version deleted successfully.")
  );
});
