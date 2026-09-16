import prisma from "../lib/prisma.js";

/**
 * Ensures initial roles are synchronized on startup:
 * - @sherry (or shaj7492@gmail.com) is designated as platform ADMIN.
 * - Any user who has authored skills is assigned CREATOR so they keep access.
 */
export async function bootstrapRoles() {
  try {
    // 1. Promote admin
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: "sherry" },
          { email: "shaj7492@gmail.com" },
        ],
      },
    });

    if (adminUser && adminUser.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { role: "ADMIN" },
      });
      console.log(`[Bootstrap] Designated @${adminUser.username} as platform ADMIN.`);
    }

    // 2. Promote any user who has authored skills to CREATOR
    const authors = await prisma.skill.findMany({
      select: { authorId: true },
      distinct: ["authorId"],
    });

    for (const { authorId } of authors) {
      if (authorId && authorId !== adminUser?.id) {
        const author = await prisma.user.findUnique({ where: { id: authorId } });
        if (author && author.role === "USER") {
          await prisma.user.update({
            where: { id: authorId },
            data: { role: "CREATOR" },
          });
          console.log(`[Bootstrap] Promoted existing skill author @${author.username} to CREATOR.`);
        }
      }
    }
  } catch (error) {
    console.error("[Bootstrap] Failed to synchronize roles:", error);
  }
}
