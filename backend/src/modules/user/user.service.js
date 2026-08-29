import ApiError from "../../utils/ApiError.js";
import {
  findUserById,
  findUserByUsername,
  updateUserProfile,
  findPublishedSkillsByAuthor,
  countPublishedSkillsByAuthor,
} from "./user.repository.js";

/**
 * Format tag relations for client consumption.
 */
function formatTags(tagsRelation) {
  if (!Array.isArray(tagsRelation)) return [];
  return tagsRelation.map((item) => item.tag || item);
}

/**
 * Format skill record with flattened tags and count metrics.
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
 * Get profile of the currently authenticated user.
 */
export async function getCurrentUserProfile(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.", "USER_NOT_FOUND");
  }

  return user;
}

/**
 * Update profile of the currently authenticated user.
 */
export async function updateCurrentUserProfile(userId, updateData) {
  if (updateData.username) {
    const existingUser = await findUserByUsername(updateData.username);
    if (existingUser && existingUser.id !== userId) {
      throw new ApiError(409, "Username is already taken.", "USERNAME_ALREADY_TAKEN");
    }
  }

  try {
    const updatedUser = await updateUserProfile(userId, updateData);
    return updatedUser;
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(409, "Username is already taken.", "USERNAME_ALREADY_TAKEN");
    }
    throw error;
  }
}

/**
 * Get public user profile by username along with their published skills.
 */
export async function getPublicUserProfile(username, { page = 1, limit = 20 } = {}) {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new ApiError(404, "User not found.", "USER_NOT_FOUND");
  }

  const numericPage = Number(page) || 1;
  const numericLimit = Math.min(Number(limit) || 20, 50);
  const skip = (numericPage - 1) * numericLimit;
  const take = numericLimit;

  const rawSkills = await findPublishedSkillsByAuthor(user.id, { skip, take });
  const skills = rawSkills.map(formatSkillRecord);

  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    createdAt: user.createdAt,
    skills,
  };
}
