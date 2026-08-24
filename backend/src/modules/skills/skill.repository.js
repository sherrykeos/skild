import prisma from "../../lib/prisma.js";

/**
 * Create a new skill with its initial version and SKILL.md file.
 */
export async function createSkill({
  name,
  slug,
  description,
  authorId,
  categoryId,
  tags = [],
  initialContent = "",
}) {
  return prisma.skill.create({
    data: {
      name,
      slug,
      description,
      authorId,
      categoryId,

      versions: {
        create: {
          version: "1.0.0",
          files: {
            create: {
              path: "SKILL.md",
              content: initialContent,
              mimeType: "text/markdown",
            },
          },
        },
      },

      tags: {
        create: tags.map((tagId) => ({
          tag: {
            connect: {
              id: tagId,
            },
          },
        })),
      },
    },

    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },

      category: true,

      tags: {
        include: {
          tag: true,
        },
      },

      versions: {
        include: {
          files: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}


/**
 * Find a skill by ID.
 */
export async function findSkillById(id) {
  return prisma.skill.findUnique({
    where: {
      id,
    },

    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },

      category: true,

      tags: {
        include: {
          tag: true,
        },
      },

      versions: {
        include: {
          files: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      _count: {
        select: {
          downloads: true,
          upvotes: true,
          reviews: true,
          savedBy: true,
        },
      },
    },
  });
}


/**
 * Find a skill by slug.
 */
export async function findSkillBySlug(slug) {
  return prisma.skill.findUnique({
    where: {
      slug,
    },

    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },

      category: true,

      tags: {
        include: {
          tag: true,
        },
      },

      versions: {
        include: {
          files: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      _count: {
        select: {
          downloads: true,
          upvotes: true,
          reviews: true,
          savedBy: true,
        },
      },
    },
  });
}


/**
 * Find all skills created by a user.
 */
export async function findSkillsByAuthor(authorId, {
  skip = 0,
  take = 20,
} = {}) {
  return prisma.skill.findMany({
    where: {
      authorId,
    },

    skip,
    take,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      category: true,

      tags: {
        include: {
          tag: true,
        },
      },

      _count: {
        select: {
          downloads: true,
          upvotes: true,
          reviews: true,
          savedBy: true,
        },
      },
    },
  });
}


/**
 * Count skills created by a user.
 */
export async function countSkillsByAuthor(authorId) {
  return prisma.skill.count({
    where: {
      authorId,
    },
  });
}


/**
 * Update skill metadata.
 */
export async function updateSkill(
  id,
  {
    name,
    slug,
    description,
    categoryId,
  }
) {
  return prisma.skill.update({
    where: {
      id,
    },

    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
    },

    include: {
      category: true,

      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}


/**
 * Replace all tags associated with a skill.
 */
export async function replaceSkillTags(skillId, tagIds) {
  return prisma.$transaction(async (tx) => {
    await tx.skillTag.deleteMany({
      where: {
        skillId,
      },
    });

    if (tagIds.length > 0) {
      await tx.skillTag.createMany({
        data: tagIds.map((tagId) => ({
          skillId,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    return tx.skill.findUnique({
      where: {
        id: skillId,
      },

      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  });
}


/**
 * Delete a skill.
 */
export async function deleteSkill(id) {
  return prisma.skill.delete({
    where: {
      id,
    },
  });
}


/**
 * Publish a skill.
 */
export async function publishSkill(id) {
  return prisma.skill.update({
    where: {
      id,
    },

    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
}


/**
 * Archive a skill.
 */
export async function archiveSkill(id) {
  return prisma.skill.update({
    where: {
      id,
    },

    data: {
      status: "ARCHIVED",
    },
  });
}


/**
 * Restore an archived skill to draft.
 */
export async function restoreSkill(id) {
  return prisma.skill.update({
    where: {
      id,
    },

    data: {
      status: "DRAFT",
      publishedAt: null,
    },
  });
}