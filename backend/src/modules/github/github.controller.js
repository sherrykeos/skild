import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  inspectRepository,
  getTree,
  importSkill,
} from "./github.service.js";

/**
 * Inspect public repository metadata & available branches.
 *
 * POST /api/github/inspect
 */
export const inspect = asyncHandler(async (req, res) => {
  const result = await inspectRepository(req.body.url);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Repository inspected successfully.",
    ),
  );
});

/**
 * Browse repository git tree for file selection.
 *
 * GET /api/github/tree
 */
export const getRepositoryTree = asyncHandler(async (req, res) => {
  const { url, branch } = req.query;
  const result = await getTree(url, branch);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Repository tree fetched successfully.",
    ),
  );
});

/**
 * Import selected repository files as a DRAFT Skill.
 *
 * POST /api/github/import
 */
export const importRepo = asyncHandler(async (req, res) => {
  const result = await importSkill(req.user.id, req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "Skill imported successfully.",
    ),
  );
});
