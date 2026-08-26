import prisma from "../../../lib/prisma.js";

/**
 * Find a version by its ID.
 */
export async function findVersionById(id) {
  return prisma.skillVersion.findUnique({
    where: {
      id,
    },
    include: {
      files: true,
    },
  });
}

/**
 * Find a version by number inside a specific skill.
 */
export async function findVersionByNumber(skillId, versionNumber) {
  return prisma.skillVersion.findUnique({
    where: {
      skillId_version: {
        skillId,
        version: versionNumber,
      },
    },
  });
}

/**
 * Create a new version and insert its files.
 */
export async function createVersion(skillId, { version, changelog }, filesToCreate = []) {
  return prisma.skillVersion.create({
    data: {
      skillId,
      version,
      changelog: changelog || null,
      files: {
        create: filesToCreate.map((f) => ({
          path: f.path,
          content: f.content,
          mimeType: f.mimeType || null,
        })),
      },
    },
    include: {
      files: true,
    },
  });
}

/**
 * Update version changelog and upsert (update or insert) files.
 */
export async function updateVersion(versionId, { changelog }, filesToUpsert = []) {
  return prisma.$transaction(async (tx) => {
    if (changelog !== undefined) {
      await tx.skillVersion.update({
        where: { id: versionId },
        data: { changelog: changelog || null },
      });
    }

    for (const file of filesToUpsert) {
      await tx.skillFile.upsert({
        where: {
          versionId_path: {
            versionId,
            path: file.path,
          },
        },
        create: {
          versionId,
          path: file.path,
          content: file.content,
          mimeType: file.mimeType || null,
        },
        update: {
          content: file.content,
          mimeType: file.mimeType || null,
        },
      });
    }

    return tx.skillVersion.findUnique({
      where: { id: versionId },
      include: { files: true },
    });
  });
}

/**
 * Delete a version (and its files via database cascade).
 */
export async function deleteVersion(id) {
  return prisma.skillVersion.delete({
    where: {
      id,
    },
  });
}

/**
 * List all versions for a skill, newest first.
 */
export async function listVersions(skillId) {
  return prisma.skillVersion.findMany({
    where: {
      skillId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      files: true,
    },
  });
}
