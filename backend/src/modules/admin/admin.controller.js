import prisma from "../../lib/prisma.js";

/**
 * Real-Time Website Telemetry & Stats
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCreators,
      totalAdmins,
      suspendedUsers,
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
      prisma.user.count({ where: { role: "CREATOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.skill.count(),
      prisma.skill.count({ where: { status: "PUBLISHED" } }),
      prisma.skill.count({ where: { status: "DRAFT" } }),
      prisma.skill.count({ where: { status: "ARCHIVED" } }),
      prisma.download.count(),
      prisma.upvote.count(),
      prisma.review.count(),
      prisma.collection.count(),
      prisma.user.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          role: true,
          isSuspended: true,
          createdAt: true,
          _count: {
            select: {
              skills: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.skill.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
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
        totalCreators,
        totalAdmins,
        suspendedUsers,
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

/**
 * Admin Get Users List (Paginated & Filtered)
 */
export const getAdminUsers = async (req, res, next) => {
  try {
    const { q, role, status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (q && q.trim()) {
      const search = q.trim();
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && ["USER", "CREATOR", "ADMIN"].includes(role)) {
      where.role = role;
    }

    if (status === "suspended") {
      where.isSuspended = true;
    } else if (status === "active") {
      where.isSuspended = false;
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          role: true,
          isSuspended: true,
          isEmailVerified: true,
          createdAt: true,
          _count: {
            select: {
              skills: true,
              reviews: true,
              collections: true,
            },
          },
        },
      }),
    ]);

    return res.json({
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Toggle User Suspension
 */
export const adminToggleSuspendUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body;

    if (req.user.id === id) {
      return res.status(400).json({ message: "You cannot suspend your own account." });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (targetUser.username?.toLowerCase() === "sherry" || targetUser.email?.toLowerCase() === "shaj7492@gmail.com") {
      return res.status(400).json({ message: "Cannot suspend the primary platform administrator." });
    }

    const suspendValue = typeof isSuspended === "boolean" ? isSuspended : !targetUser.isSuspended;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isSuspended: suspendValue },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isSuspended: true,
      },
    });

    // If user is suspended, revoke all active sessions immediately
    if (suspendValue) {
      await prisma.session.deleteMany({ where: { userId: id } });
    }

    return res.json({
      message: suspendValue ? "User account suspended." : "User suspension lifted.",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Delete User
 */
export const adminDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userToDelete.username?.toLowerCase() === "sherry" || userToDelete.email?.toLowerCase() === "shaj7492@gmail.com") {
      return res.status(400).json({ message: "Cannot delete the primary administrator account." });
    }

    await prisma.user.delete({ where: { id } });
    return res.json({ message: "User account deleted by administrator." });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Get All Skills (Paginated & Filtered)
 */
export const getAdminSkills = async (req, res, next) => {
  try {
    const { q, status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (q && q.trim()) {
      const search = q.trim();
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      where.status = status;
    }

    const [total, skills] = await Promise.all([
      prisma.skill.count({ where }),
      prisma.skill.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
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
          _count: {
            select: {
              downloads: true,
              upvotes: true,
              reviews: true,
              versions: true,
            },
          },
        },
      }),
    ]);

    return res.json({
      skills,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Unpublish Skill (Revert to DRAFT)
 */
export const adminUnpublishSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await prisma.skill.findUnique({ where: { id } });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: { status: "DRAFT" },
    });

    return res.json({
      message: "Skill has been unpublished and reverted to Draft.",
      skill: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Force-Delete Skill
 */
export const adminDeleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await prisma.skill.findUnique({ where: { id } });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    await prisma.skill.delete({ where: { id } });
    return res.json({ message: "Skill deleted by administrator." });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Get Reviews (Paginated & Filtered)
 */
export const getAdminReviews = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (q && q.trim()) {
      const search = q.trim();
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { user: { username: { contains: search, mode: "insensitive" } } },
        { skill: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              email: true,
            },
          },
          skill: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    return res.json({
      reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Force-Delete Review
 */
export const adminDeleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    await prisma.review.delete({ where: { id } });
    return res.json({ message: "Review removed by administrator." });
  } catch (error) {
    next(error);
  }
};
