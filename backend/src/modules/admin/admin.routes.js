import { Router } from "express";
import authenticate from "../auth/src/auth.middleware.js";
import { requireAdmin } from "../../middlewares/auth.role.middleware.js";
import {
  getAdminStats,
  getAdminUsers,
  adminToggleSuspendUser,
  adminDeleteUser,
  getAdminSkills,
  adminUnpublishSkill,
  adminDeleteSkill,
  getAdminReviews,
  adminDeleteReview,
} from "./admin.controller.js";

const router = Router();

// Protect all admin endpoints with JWT auth + requireAdmin role check
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/stats
 * Real-time website telemetry
 */
router.get("/stats", getAdminStats);

/**
 * Users Moderation
 */
router.get("/users", getAdminUsers);
router.patch("/users/:id/suspend", adminToggleSuspendUser);
router.delete("/users/:id", adminDeleteUser);

/**
 * Skills Moderation
 */
router.get("/skills", getAdminSkills);
router.post("/skills/:id/unpublish", adminUnpublishSkill);
router.delete("/skills/:id", adminDeleteSkill);

/**
 * Reviews Moderation
 */
router.get("/reviews", getAdminReviews);
router.delete("/reviews/:id", adminDeleteReview);

export default router;
