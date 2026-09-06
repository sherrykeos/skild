import { Router } from "express";
import { getAdminStats } from "./admin.controller.js";

const router = Router();

/**
 * GET /api/admin/stats
 * Get overall website statistics, user metrics, and recent activity
 */
router.get("/stats", getAdminStats);

export default router;
