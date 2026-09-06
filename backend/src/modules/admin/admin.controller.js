import prisma from "../../lib/prisma.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalSkills,
      publishedSkills,
      draftSkills,
      archivedSkills,
      totalDownloads,
      totalUpvotes,
      totalReviews,
      totalCollections,
      recentUsers,
      recentSkills,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.skill.count(),
      prisma.skill.count({ where: { status: "PUBLISHED" } }),
      prisma.skill.count({ where: { status: "DRAFT" } }),
      prisma.skill.count({ where: { status: "ARCHIVED" } }),
      prisma.download.count(),
      prisma.upvote.count(),
      prisma.review.count(),
      prisma.collection.count(),
      prisma.user.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      }),
      prisma.skill.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              username: true,
              avatar: true,
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
      }),
    ]);

    return res.json({
      stats: {
        totalUsers,
        totalSkills,
        publishedSkills,
        draftSkills,
        archivedSkills,
        totalDownloads,
        totalUpvotes,
        totalReviews,
        totalCollections,
      },
      recentUsers,
      recentSkills,
    });
  } catch (error) {
    next(error);
  }
};
