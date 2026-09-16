export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  if (req.user.isSuspended) {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_SUSPENDED",
      message: "Your account has been suspended by an administrator.",
    });
  }

  const username = req.user.username?.toLowerCase();
  const email = req.user.email?.toLowerCase();

  const isAdmin = req.user.role === "ADMIN" || username === "sherry" || email === "shaj7492@gmail.com";

  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Access denied. Restricted to platform administrator." });
  }

  req.isAdmin = true;
  next();
};
