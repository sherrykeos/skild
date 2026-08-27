import prisma from "../../lib/prisma.js";

/**
 * Normalize tags input into a clean string array.
 */
function normalizeTagsInput(tags) {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  }
  if (typeof tags === "string" && tags.trim().length > 0) {
    return tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

/**
 * Build Prisma where clause for published marketplace skills.
 * Enforces status = PUBLISHED.
 */
function buildMarketplaceWhereClause({ search, category, tags = [] }) {
  const where = {
    status: "PUBLISHED",
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = {
      slug: {
        equals: category,
        mode: "insensitive",
      },
    };
  }

  const tagList = normalizeTagsInput(tags);

  if (tagList.length > 0) {
    where.tags = {
      some: {
        tag: {
          OR: [
            { slug: { in: tagList, mode: "insensitive" } },
            { name: { in: tagList, mode: "insensitive" } },
          ],
        },
      },
    };
  }

  return where;
}

/**
 * Determine Prisma orderBy structure based on sort parameter.
 */
function getMarketplaceOrderBy(sort) {
  switch (sort) {
    case "popular":
      return [
        { downloads: { _count: "desc" } },
        { publishedAt: "desc" },
      ];
    case "upvotes":
      return [
        { upvotes: { _count: "desc" } },
        { publishedAt: "desc" },
      ];
    case "latest":
    default:
      return [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ];
  }
}

/**
 * Find published skills for marketplace listing.
 */
export async function findPublishedSkills({
  skip = 0,
  take = 20,
  search,
  category,
  tags = [],
  sort = "latest",
}) {
  const where = buildMarketplaceWhereClause({ search, category, tags });
  const orderBy = getMarketplaceOrderBy(sort);

  return prisma.skill.findMany({
    where,
    skip,
    take,
    orderBy,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      versions: {
        where: {
          publishedAt: {
            not: null,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          version: true,
          changelog: true,
          publishedAt: true,
        },
      },
      _count: {
        select: {
          downloads: true,
          upvotes: true,
          reviews: true,
        },
      },
    },
  });
}

/**
 * Count total published skills matching marketplace criteria.
 */
export async function countPublishedSkills({ search, category, tags = [] }) {
  const where = buildMarketplaceWhereClause({ search, category, tags });
  return prisma.skill.count({ where });
}

/**
 * Find a single published skill by slug for public detail view.
 * Includes only published versions and their files.
 */
export async function findPublishedSkillBySlug(slug) {
  return prisma.skill.findFirst({
    where: {
      slug: {
        equals: slug,
        mode: "insensitive",
      },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      versions: {
        where: {
          publishedAt: {
            not: null,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          version: true,
          changelog: true,
          createdAt: true,
          publishedAt: true,
          files: {
            select: {
              id: true,
              path: true,
              content: true,
              mimeType: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      _count: {
        select: {
          downloads: true,
          upvotes: true,
          reviews: true,
        },
      },
    },
  });
}
