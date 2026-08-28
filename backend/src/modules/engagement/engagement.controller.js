import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  upvoteSkill,
  removeUpvote,
  getSkillReviews,
  createReview,
  updateReview,
  deleteReview,
  saveSkill,
  unsaveSkill,
  getUserSavedSkills,
  getUserCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  addSkillToCollection,
  removeSkillFromCollection,
  downloadSkill,
} from "./engagement.service.js";

// ============================================================
// UPVOTE CONTROLLERS
// ============================================================

export const handleUpvoteSkill = asyncHandler(async (req, res) => {
  const result = await upvoteSkill(req.user.id, req.params.skillId);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Skill upvoted successfully."));
});

export const handleRemoveUpvote = asyncHandler(async (req, res) => {
  const result = await removeUpvote(req.user.id, req.params.skillId);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Upvote removed successfully."));
});

// ============================================================
// REVIEW CONTROLLERS
// ============================================================

export const handleGetSkillReviews = asyncHandler(async (req, res) => {
  const result = await getSkillReviews(req.params.skillId, req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Reviews fetched successfully."));
});

export const handleCreateReview = asyncHandler(async (req, res) => {
  const review = await createReview(
    req.user.id,
    req.params.skillId,
    req.body.content
  );
  return res
    .status(201)
    .json(new ApiResponse(201, { review }, "Review created successfully."));
});

export const handleUpdateReview = asyncHandler(async (req, res) => {
  const review = await updateReview(
    req.user.id,
    req.params.reviewId,
    req.body.content
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { review }, "Review updated successfully."));
});

export const handleDeleteReview = asyncHandler(async (req, res) => {
  await deleteReview(req.user.id, req.params.reviewId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully."));
});

// ============================================================
// SAVE CONTROLLERS
// ============================================================

export const handleSaveSkill = asyncHandler(async (req, res) => {
  const result = await saveSkill(req.user.id, req.params.skillId);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Skill saved successfully."));
});

export const handleUnsaveSkill = asyncHandler(async (req, res) => {
  const result = await unsaveSkill(req.user.id, req.params.skillId);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Skill unsaved successfully."));
});

export const handleGetUserSavedSkills = asyncHandler(async (req, res) => {
  const result = await getUserSavedSkills(req.user.id, req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Saved skills fetched successfully."));
});

// ============================================================
// COLLECTION CONTROLLERS
// ============================================================

export const handleGetUserCollections = asyncHandler(async (req, res) => {
  const collections = await getUserCollections(req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, { collections }, "Collections fetched successfully."));
});

export const handleCreateCollection = asyncHandler(async (req, res) => {
  const collection = await createCollection(req.user.id, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, { collection }, "Collection created successfully."));
});

export const handleUpdateCollection = asyncHandler(async (req, res) => {
  const collection = await updateCollection(
    req.user.id,
    req.params.collectionId,
    req.body
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { collection }, "Collection updated successfully."));
});

export const handleDeleteCollection = asyncHandler(async (req, res) => {
  await deleteCollection(req.user.id, req.params.collectionId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Collection deleted successfully."));
});

export const handleAddSkillToCollection = asyncHandler(async (req, res) => {
  const collection = await addSkillToCollection(
    req.user.id,
    req.params.collectionId,
    req.params.skillId
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { collection }, "Skill added to collection successfully."));
});

export const handleRemoveSkillFromCollection = asyncHandler(async (req, res) => {
  const collection = await removeSkillFromCollection(
    req.user.id,
    req.params.collectionId,
    req.params.skillId
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { collection }, "Skill removed from collection successfully."));
});

// ============================================================
// DOWNLOAD CONTROLLER
// ============================================================

export const handleDownloadSkill = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { zipBuffer, filename } = await downloadSkill(userId, req.params.skillId);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.status(200).send(zipBuffer);
});
