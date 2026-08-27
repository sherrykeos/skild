import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getMarketplaceSkills,
  getMarketplaceSkillBySlug,
} from "./marketplace.service.js";

/**
 * Get published skills for public discovery (browse/search/filter/sort/pagination).
 *
 * GET /api/marketplace/skills
 */
export const getSkills = asyncHandler(async (req, res) => {
  const result = await getMarketplaceSkills(req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Skills fetched successfully."
      )
    );
});

/**
 * Get public detail view of a published skill by slug.
 *
 * GET /api/marketplace/skills/:slug
 */
export const getSkillBySlug = asyncHandler(async (req, res) => {
  const skill = await getMarketplaceSkillBySlug(req.params.slug);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { skill },
        "Skill fetched successfully."
      )
    );
});
