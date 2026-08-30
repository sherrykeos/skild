import prisma from "../../lib/prisma.js";

/**
 * Check if the user has already imported this GitHub repository and branch.
 */
export async function findExistingGithubImport(authorId, sourceUrl, sourceBranch) {
  return prisma.skill.findFirst({
    where: {
      authorId,
      sourceType: "GITHUB",
      sourceUrl,
      versions: {
        some: {
          sourceBranch,
        },
      },
    },
  });
}

/**
 * Find skill by slug (for unique slug generation).
 */
export async function findSkillBySlug(slug) {
  return prisma.skill.findUnique({
    where: { slug },
  });
}

/**
 * Atomic creation of imported Skill, SkillVersion, and SkillFiles.
 */
export async function createImportedSkill({
  name,
  slug,
  description,
  authorId,
  sourceUrl,
  sourceBranch,
  files,
}) {
  return prisma.$transaction(async (tx) => {
    const skill = await tx.skill.create({
      data: {
        name,
        slug,
        description,
        status: "DRAFT",
        sourceType: "GITHUB",
        sourceUrl,
        authorId,
        versions: {
          create: {
            version: "1.0.0",
            sourceBranch,
            files: {
              create: files.map((file) => ({
                path: file.path,
                content: file.content,
                mimeType: file.mimeType,
              })),
            },
          },
        },
      },
      include: {
        versions: {
          include: {
            files: {
              select: {
                id: true,
                path: true,
                mimeType: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return skill;
  });
}
