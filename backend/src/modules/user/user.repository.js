import prisma from "../../lib/prisma.js";

/**
 * Find user by ID returning safe user fields including role and suspension status.
 */
export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      avatar: true,
      role: true,
      isSuspended: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Find user by username returning safe public profile fields.
 */
export async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Update current user's profile fields.
 */
export async function updateUserProfile(id, data) {
  const updateData = {};
  if (data.username !== undefined) updateData.username = data.username;
  if (data.avatar !== undefined) updateData.avatar = data.avatar;

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      avatar: true,
      role: true,
      isSuspended: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Promote user to CREATOR if not already ADMIN.
 */
export async function becomeCreatorUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isSuspended: true },
  });

  if (!user) return null;

  if (user.role === "ADMIN") {
    return findUserById(userId);
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: "CREATOR" },
    select: {
      id: true,
      username: true,
      avatar: true,
      role: true,
      isSuspended: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Find published skills authored by a user.
 */
export async function findPublishedSkillsByAuthor(
  authorId,
  { skip = 0, take = 20 } = {}, //pagination skip means start from and take means how many to fetch per page
) {
  return prisma.skill.findMany({
    where: {
      authorId,
      status: "PUBLISHED",
    },
    skip,
    take,
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
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
 * Count published skills authored by a user.
 */
export async function countPublishedSkillsByAuthor(authorId) {
  return prisma.skill.count({
    where: {
      authorId,
      status: "PUBLISHED",
    },
  });
}
