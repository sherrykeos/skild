/**
 * Middleware ensuring authenticated user has CREATOR or ADMIN role.
 */
export const requireCreator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.isSuspended) {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_SUSPENDED",
      message: "Your account has been suspended by an administrator.",
    });
  }

  if (req.user.role !== "CREATOR" && req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      code: "CREATOR_REQUIRED",
      message: "Creator privileges required. Please activate Creator access to publish skills.",
    });
  }

  next();
};

/**
 * Middleware ensuring authenticated user has ADMIN role.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.isSuspended) {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_SUSPENDED",
      message: "Your account has been suspended by an administrator.",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      code: "FORBIDDEN_ADMIN_ONLY",
      message: "Access denied. Administrator privileges required.",
    });
  }

  next();
};
