import { Router } from "express";
import authenticate from "../auth/src/auth.middleware.js";
import { verifyAccessToken } from "../auth/services/jwt.service.js";
import { findUserById } from "../auth/src/auth.repository.js";
import validate from "../../middlewares/validate.js";
import {
  skillIdParamSchema,
  reviewIdParamSchema,
  collectionIdParamSchema,
  collectionSkillParamSchema,
  createReviewSchema,
  updateReviewSchema,
  createCollectionSchema,
  updateCollectionSchema,
  paginationQuerySchema,
} from "./engagement.schema.js";
import {
  handleUpvoteSkill,
  handleRemoveUpvote,
  handleGetSkillReviews,
  handleCreateReview,
  handleUpdateReview,
  handleDeleteReview,
  handleSaveSkill,
  handleUnsaveSkill,
  handleGetUserSavedSkills,
  handleGetUserCollections,
  handleCreateCollection,
  handleUpdateCollection,
  handleDeleteCollection,
  handleAddSkillToCollection,
  handleRemoveSkillFromCollection,
  handleDownloadSkill,
} from "./engagement.controller.js";

/**
 * Optional authentication middleware for endpoints like download,
 * allowing anonymous access while capturing authenticated identity if present.
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1];
      const payload = verifyAccessToken(token);
      const user = await findUserById(payload.userId);
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Ignore invalid token for optional authentication
  }
  next();
}

const router = Router();

// ============================================================
// UPVOTE ROUTES
// ============================================================

router.post(
  "/skills/:skillId/upvote",
  authenticate,
  validate(skillIdParamSchema, "params"),
  handleUpvoteSkill
);

router.delete(
  "/skills/:skillId/upvote",
  authenticate,
  validate(skillIdParamSchema, "params"),
  handleRemoveUpvote
);

// ============================================================
// REVIEW ROUTES
// ============================================================

router.get(
  "/skills/:skillId/reviews",
  validate(skillIdParamSchema, "params"),
  validate(paginationQuerySchema, "query"),
  handleGetSkillReviews
);

router.post(
  "/skills/:skillId/reviews",
  authenticate,
  validate(skillIdParamSchema, "params"),
  validate(createReviewSchema, "body"),
  handleCreateReview
);

router.patch(
  "/reviews/:reviewId",
  authenticate,
  validate(reviewIdParamSchema, "params"),
  validate(updateReviewSchema, "body"),
  handleUpdateReview
);

router.delete(
  "/reviews/:reviewId",
  authenticate,
  validate(reviewIdParamSchema, "params"),
  handleDeleteReview
);

// ============================================================
// SAVE ROUTES
// ============================================================

router.post(
  "/skills/:skillId/save",
  authenticate,
  validate(skillIdParamSchema, "params"),
  handleSaveSkill
);

router.delete(
  "/skills/:skillId/save",
  authenticate,
  validate(skillIdParamSchema, "params"),
  handleUnsaveSkill
);

router.get(
  "/users/me/saved",
  authenticate,
  validate(paginationQuerySchema, "query"),
  handleGetUserSavedSkills
);

// ============================================================
// COLLECTION ROUTES
// ============================================================

router.get(
  "/users/me/collections",
  authenticate,
  handleGetUserCollections
);

router.post(
  "/users/me/collections",
  authenticate,
  validate(createCollectionSchema, "body"),
  handleCreateCollection
);

router.patch(
  "/collections/:collectionId",
  authenticate,
  validate(collectionIdParamSchema, "params"),
  validate(updateCollectionSchema, "body"),
  handleUpdateCollection
);

router.delete(
  "/collections/:collectionId",
  authenticate,
  validate(collectionIdParamSchema, "params"),
  handleDeleteCollection
);

router.post(
  "/collections/:collectionId/skills/:skillId",
  authenticate,
  validate(collectionSkillParamSchema, "params"),
  handleAddSkillToCollection
);

router.delete(
  "/collections/:collectionId/skills/:skillId",
  authenticate,
  validate(collectionSkillParamSchema, "params"),
  handleRemoveSkillFromCollection
);

// ============================================================
// DOWNLOAD ROUTES
// ============================================================

router.get(
  "/skills/:skillId/download",
  optionalAuthenticate,
  validate(skillIdParamSchema, "params"),
  handleDownloadSkill
);

export default router;
