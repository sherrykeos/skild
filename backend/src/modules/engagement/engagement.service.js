import AdmZip from "adm-zip";
import ApiError from "../../utils/ApiError.js";
import {
  findSkillById,
  findUpvote,
  createUpvote as createUpvoteRepo,
  deleteUpvote as deleteUpvoteRepo,
  countUpvotes,
  findReviewById,
  findUserReviewForSkill,
  createReview as createReviewRepo,
  updateReview as updateReviewRepo,
  deleteReview as deleteReviewRepo,
  findSkillReviews,
  countSkillReviews,
  createSave as createSaveRepo,
  deleteSave as deleteSaveRepo,
  findUserSavedSkills,
  countUserSavedSkills,
  createCollection as createCollectionRepo,
  findCollectionById,
  updateCollection as updateCollectionRepo,
  deleteCollection as deleteCollectionRepo,
  findUserCollections,
  findCollectionSkill,
  addSkillToCollection as addSkillToCollectionRepo,
  removeSkillFromCollection as removeSkillFromCollectionRepo,
  createDownloadRecord,
  findPublishedSkillForDownload,
} from "./engagement.repository.js";

/**
 * Verify skill exists and is in PUBLISHED status.
 */
async function ensurePublishedSkill(skillId) {
  const skill = await findSkillById(skillId);

  if (!skill) {
    throw new ApiError(404, "Skill not found.", "SKILL_NOT_FOUND");
  }

  if (skill.status !== "PUBLISHED") {
    throw new ApiError(404, "Skill not found.", "SKILL_NOT_FOUND");
  }

  return skill;
}

/**
 * Format tag array helper.
 */
function formatTags(tagsRelation) {
  if (!Array.isArray(tagsRelation)) return [];
  return tagsRelation.map((item) => item.tag || item);
}

/**
 * Format single skill record.
 */
function formatSkillRecord(skill) {
  if (!skill) return null;

  const { tags, _count, ...rest } = skill;

  return {
    ...rest,
    tags: formatTags(tags),
    downloadCount: _count?.downloads ?? 0,
    upvoteCount: _count?.upvotes ?? 0,
    reviewCount: _count?.reviews ?? 0,
    _count: _count || { downloads: 0, upvotes: 0, reviews: 0 },
  };
}

/**
 * Format collection skills output cleanly.
 */
function formatCollection(collection) {
  if (!collection) return null;

  const formattedSkills = (collection.skills || []).map((cs) => ({
    addedAt: cs.addedAt,
    skill: formatSkillRecord(cs.skill),
  }));

  return {
    ...collection,
    skills: formattedSkills,
  };
}

// ============================================================
// UPVOTE SERVICE
// ============================================================

export async function upvoteSkill(userId, skillId) {
  await ensurePublishedSkill(skillId);

  await createUpvoteRepo(userId, skillId);

  const totalUpvotes = await countUpvotes(skillId);

  return {
    upvoted: true,
    upvoteCount: totalUpvotes,
  };
}

export async function removeUpvote(userId, skillId) {
  await ensurePublishedSkill(skillId);

  await deleteUpvoteRepo(userId, skillId);

  const totalUpvotes = await countUpvotes(skillId);

  return {
    upvoted: false,
    upvoteCount: totalUpvotes,
  };
}

// ============================================================
// REVIEW SERVICE
// ============================================================

export async function getSkillReviews(skillId, { page = 1, limit = 20 }) {
  await ensurePublishedSkill(skillId);

  const numericPage = Number(page) || 1;
  const numericLimit = Number(limit) || 20;

  const skip = (numericPage - 1) * numericLimit;
  const take = numericLimit;

  const [reviews, total] = await Promise.all([
    findSkillReviews(skillId, { skip, take }),
    countSkillReviews(skillId),
  ]);

  const totalPages = Math.ceil(total / numericLimit);

  return {
    reviews,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages,
    },
  };
}

export async function createReview(userId, skillId, content) {
  await ensurePublishedSkill(skillId);

  const existingReview = await findUserReviewForSkill(userId, skillId);
  if (existingReview) {
    throw new ApiError(
      400,
      "You have already reviewed this skill.",
      "REVIEW_ALREADY_EXISTS"
    );
  }

  return createReviewRepo(userId, skillId, content);
}

export async function updateReview(userId, reviewId, content) {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found.", "REVIEW_NOT_FOUND");
  }

  if (review.userId !== userId) {
    throw new ApiError(
      403,
      "You can only edit your own review.",
      "NOT_REVIEW_OWNER"
    );
  }

  return updateReviewRepo(reviewId, content);
}

export async function deleteReview(userId, reviewId) {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found.", "REVIEW_NOT_FOUND");
  }

  if (review.userId !== userId) {
    throw new ApiError(
      403,
      "You can only delete your own review.",
      "NOT_REVIEW_OWNER"
    );
  }

  await deleteReviewRepo(reviewId);
  return null;
}

// ============================================================
// SAVE SERVICE
// ============================================================

export async function saveSkill(userId, skillId) {
  await ensurePublishedSkill(skillId);

  await createSaveRepo(userId, skillId);

  return { saved: true };
}

export async function unsaveSkill(userId, skillId) {
  await ensurePublishedSkill(skillId);

  await deleteSaveRepo(userId, skillId);

  return { saved: false };
}

export async function getUserSavedSkills(userId, { page = 1, limit = 20 }) {
  const numericPage = Number(page) || 1;
  const numericLimit = Number(limit) || 20;

  const skip = (numericPage - 1) * numericLimit;
  const take = numericLimit;

  const [rawSaved, total] = await Promise.all([
    findUserSavedSkills(userId, { skip, take }),
    countUserSavedSkills(userId),
  ]);

  const savedSkills = rawSaved.map((item) => ({
    savedAt: item.createdAt,
    skill: formatSkillRecord(item.skill),
  }));

  const totalPages = Math.ceil(total / numericLimit);

  return {
    savedSkills,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages,
    },
  };
}

// ============================================================
// COLLECTION SERVICE
// ============================================================

export async function getUserCollections(userId) {
  const rawCollections = await findUserCollections(userId);
  return rawCollections.map(formatCollection);
}

export async function createCollection(userId, { name, description }) {
  const rawCollection = await createCollectionRepo(userId, name, description);
  return formatCollection(rawCollection);
}

export async function updateCollection(userId, collectionId, { name, description }) {
  const collection = await findCollectionById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.", "COLLECTION_NOT_FOUND");
  }

  if (collection.userId !== userId) {
    throw new ApiError(
      403,
      "You can only modify your own collection.",
      "NOT_COLLECTION_OWNER"
    );
  }

  const updated = await updateCollectionRepo(collectionId, name, description);
  return formatCollection(updated);
}

export async function deleteCollection(userId, collectionId) {
  const collection = await findCollectionById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.", "COLLECTION_NOT_FOUND");
  }

  if (collection.userId !== userId) {
    throw new ApiError(
      403,
      "You can only delete your own collection.",
      "NOT_COLLECTION_OWNER"
    );
  }

  await deleteCollectionRepo(collectionId);
  return null;
}

export async function addSkillToCollection(userId, collectionId, skillId) {
  const collection = await findCollectionById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.", "COLLECTION_NOT_FOUND");
  }

  if (collection.userId !== userId) {
    throw new ApiError(
      403,
      "You can only modify your own collection.",
      "NOT_COLLECTION_OWNER"
    );
  }

  await ensurePublishedSkill(skillId);

  const existingLink = await findCollectionSkill(collectionId, skillId);
  if (existingLink) {
    throw new ApiError(
      400,
      "Skill is already in this collection.",
      "SKILL_ALREADY_IN_COLLECTION"
    );
  }

  const updatedCollection = await addSkillToCollectionRepo(collectionId, skillId);
  return formatCollection(updatedCollection);
}

export async function removeSkillFromCollection(userId, collectionId, skillId) {
  const collection = await findCollectionById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.", "COLLECTION_NOT_FOUND");
  }

  if (collection.userId !== userId) {
    throw new ApiError(
      403,
      "You can only modify your own collection.",
      "NOT_COLLECTION_OWNER"
    );
  }

  const updatedCollection = await removeSkillFromCollectionRepo(collectionId, skillId);
  return formatCollection(updatedCollection);
}

// ============================================================
// DOWNLOAD SERVICE
// ============================================================

export async function downloadSkill(userIdOrNull, skillId) {
  const skill = await findPublishedSkillForDownload(skillId);

  if (!skill || !skill.versions || skill.versions.length === 0) {
    throw new ApiError(
      404,
      "Skill not found or has no published version.",
      "SKILL_NOT_FOUND"
    );
  }

  const latestPublishedVersion = skill.versions[0];

  if (!latestPublishedVersion.files || latestPublishedVersion.files.length === 0) {
    throw new ApiError(
      404,
      "Published version contains no files to download.",
      "FILES_NOT_FOUND"
    );
  }

  // Create database download record
  await createDownloadRecord({
    skillId: skill.id,
    userId: userIdOrNull,
    version: latestPublishedVersion.version,
  });

  // Create ZIP Archive
  const zip = new AdmZip();
  for (const file of latestPublishedVersion.files) {
    zip.addFile(file.path, Buffer.from(file.content || "", "utf-8"));
  }

  const zipBuffer = zip.toBuffer();
  const filename = `${skill.slug}-v${latestPublishedVersion.version}.zip`;

  return {
    zipBuffer,
    filename,
  };
}
