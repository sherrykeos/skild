import prisma from "../../lib/prisma.js";

/**
 * Find skill by ID (including status and basic details).
 */
export async function findSkillById(skillId) {
  return prisma.skill.findUnique({
    where: { id: skillId },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      authorId: true,
    },
  });
}

// ============================================================
// UPVOTE REPOSITORY
// ============================================================

export async function findUpvote(userId, skillId) {
  return prisma.upvote.findUnique({
    where: {
      userId_skillId: { userId, skillId },
    },
  });
}

export async function createUpvote(userId, skillId) {
  try {
    return await prisma.upvote.create({
      data: { userId, skillId },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return prisma.upvote.findUnique({
        where: { userId_skillId: { userId, skillId } },
      });
    }
    throw error;
  }
}

export async function deleteUpvote(userId, skillId) {
  try {
    return await prisma.upvote.delete({
      where: {
        userId_skillId: { userId, skillId },
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

export async function countUpvotes(skillId) {
  return prisma.upvote.count({
    where: { skillId },
  });
}

// ============================================================
// REVIEW REPOSITORY
// ============================================================

export async function findReviewById(reviewId) {
  return prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      content: true,
      userId: true,
      skillId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function findUserReviewForSkill(userId, skillId) {
  return prisma.review.findUnique({
    where: {
      userId_skillId: { userId, skillId },
    },
  });
}

export async function createReview(userId, skillId, content) {
  return prisma.review.create({
    data: {
      userId,
      skillId,
      content,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function updateReview(reviewId, content) {
  return prisma.review.update({
    where: { id: reviewId },
    data: { content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function deleteReview(reviewId) {
  return prisma.review.delete({
    where: { id: reviewId },
  });
}

export async function findSkillReviews(skillId, { skip = 0, take = 20 } = {}) {
  return prisma.review.findMany({
    where: { skillId },
    skip,
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function countSkillReviews(skillId) {
  return prisma.review.count({
    where: { skillId },
  });
}

// ============================================================
// SAVE REPOSITORY
// ============================================================

export async function findSavedSkill(userId, skillId) {
  return prisma.savedSkill.findUnique({
    where: {
      userId_skillId: { userId, skillId },
    },
  });
}

export async function createSave(userId, skillId) {
  try {
    return await prisma.savedSkill.create({
      data: { userId, skillId },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return prisma.savedSkill.findUnique({
        where: { userId_skillId: { userId, skillId } },
      });
    }
    throw error;
  }
}

export async function deleteSave(userId, skillId) {
  try {
    return await prisma.savedSkill.delete({
      where: {
        userId_skillId: { userId, skillId },
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

export async function findUserSavedSkills(userId, { skip = 0, take = 20 } = {}) {
  return prisma.savedSkill.findMany({
    where: {
      userId,
      skill: {
        status: "PUBLISHED",
      },
    },
    skip,
    take,
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      skill: {
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
          _count: {
            select: {
              downloads: true,
              upvotes: true,
              reviews: true,
            },
          },
        },
      },
    },
  });
}

export async function countUserSavedSkills(userId) {
  return prisma.savedSkill.count({
    where: {
      userId,
      skill: {
        status: "PUBLISHED",
      },
    },
  });
}

// ============================================================
// COLLECTION REPOSITORY
// ============================================================

const collectionIncludeSelect = {
  id: true,
  name: true,
  description: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  skills: {
    where: {
      skill: {
        status: "PUBLISHED",
      },
    },
    select: {
      addedAt: true,
      skill: {
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
          _count: {
            select: {
              downloads: true,
              upvotes: true,
              reviews: true,
            },
          },
        },
      },
    },
  },
};

export async function createCollection(userId, name, description) {
  return prisma.collection.create({
    data: {
      userId,
      name,
      description: description || null,
    },
    select: collectionIncludeSelect,
  });
}

export async function findCollectionById(collectionId) {
  return prisma.collection.findUnique({
    where: { id: collectionId },
    select: collectionIncludeSelect,
  });
}

export async function updateCollection(collectionId, name, description) {
  return prisma.collection.update({
    where: { id: collectionId },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
    },
    select: collectionIncludeSelect,
  });
}

export async function deleteCollection(collectionId) {
  return prisma.collection.delete({
    where: { id: collectionId },
  });
}

export async function findUserCollections(userId) {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: collectionIncludeSelect,
  });
}

export async function findCollectionSkill(collectionId, skillId) {
  return prisma.collectionSkill.findUnique({
    where: {
      collectionId_skillId: { collectionId, skillId },
    },
  });
}

export async function addSkillToCollection(collectionId, skillId) {
  try {
    await prisma.collectionSkill.create({
      data: { collectionId, skillId },
    });
  } catch (error) {
    if (error.code !== "P2002") {
      throw error;
    }
  }
  return findCollectionById(collectionId);
}

export async function removeSkillFromCollection(collectionId, skillId) {
  try {
    await prisma.collectionSkill.delete({
      where: {
        collectionId_skillId: { collectionId, skillId },
      },
    });
  } catch (error) {
    if (error.code !== "P2025") {
      throw error;
    }
  }
  return findCollectionById(collectionId);
}

// ============================================================
// DOWNLOAD REPOSITORY
// ============================================================

export async function createDownloadRecord({ skillId, userId = null, version = null }) {
  return prisma.download.create({
    data: {
      skillId,
      userId: userId || null,
      version: version || null,
    },
  });
}

export async function findPublishedSkillForDownload(skillId) {
  return prisma.skill.findFirst({
    where: {
      id: skillId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
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
          publishedAt: true,
          files: {
            select: {
              id: true,
              path: true,
              content: true,
              mimeType: true,
            },
          },
        },
      },
    },
  });
}
