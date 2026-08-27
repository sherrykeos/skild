import ApiError from "../../utils/ApiError.js";
import {
  findPublishedSkills,
  countPublishedSkills,
  findPublishedSkillBySlug,
} from "./marketplace.repository.js";

/**
 * Format tag relations for client consumption.
 * Transforms `[{ tag: { id, name, slug } }]` to `[{ id, name, slug }]`.
 */
function formatTags(tagsRelation) {
  if (!Array.isArray(tagsRelation)) return [];
  return tagsRelation.map((item) => item.tag || item);
}

/**
 * Format single skill record with flattened tags and count metrics.
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
 * Browse and search published skills on the marketplace.
 */
export async function getMarketplaceSkills({
  page = 1,
  limit = 20,
  search,
  category,
  tags = [],
  sort = "latest",
}) {
  const numericPage = Number(page) || 1;
  const numericLimit = Number(limit) || 20;
  const skip = (numericPage - 1) * numericLimit;
  const take = numericLimit;

  const tagList = Array.isArray(tags)
    ? tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
    : typeof tags === "string" && tags.trim().length > 0
    ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const [rawSkills, total] = await Promise.all([
    findPublishedSkills({
      skip,
      take,
      search,
      category,
      tags: tagList,
      sort,
    }),
    countPublishedSkills({
      search,
      category,
      tags: tagList,
    }),
  ]);

  const skills = rawSkills.map(formatSkillRecord);
  const totalPages = Math.ceil(total / numericLimit);

  return {
    skills,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages,
    },
  };
}

/**
 * Get public skill details by slug.
 * Exposes only published version information and safe public author fields.
 */
export async function getMarketplaceSkillBySlug(slug) {
  const rawSkill = await findPublishedSkillBySlug(slug);

  if (!rawSkill) {
    throw new ApiError(404, "Skill not found.", "SKILL_NOT_FOUND");
  }

  return formatSkillRecord(rawSkill);
}
