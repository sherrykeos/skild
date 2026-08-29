import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getPublicUserProfile,
} from "./user.service.js";

/**
 * Get profile of the currently authenticated user.
 *
 * GET /api/users/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUserProfile(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      { user },
      "Profile fetched successfully.",
    ),
  );
});

/**
 * Update profile of the currently authenticated user.
 *
 * PATCH /api/users/me
 */
export const updateMe = asyncHandler(async (req, res) => {
  const user = await updateCurrentUserProfile(req.user.id, req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      { user },
      "Profile updated successfully.",
    ),
  );
});

/**
 * Get public profile and published skills of a user by username.
 *
 * GET /api/users/:username
 */
export const getPublicProfile = asyncHandler(async (req, res) => {
  const profile = await getPublicUserProfile(req.params.username, req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      { user: profile },
      "User profile fetched successfully.",
    ),
  );
});
