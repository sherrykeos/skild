import { verifyAccessToken } from "../services/jwt.service.js";
import { findUserById } from "./auth.repository.js";

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authorization.split(" ")[1];

    const payload = verifyAccessToken(token);

    const user = await findUserById(payload.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_SUSPENDED",
        message: "Your account has been suspended by an administrator.",
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }
}

export default authenticate;
