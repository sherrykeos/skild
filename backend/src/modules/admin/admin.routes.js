import { Router } from "express";
import authenticate from "../auth/src/auth.middleware.js";
import { getAdminStats } from "./admin.controller.js";

const router = Router();

/**
 * GET /api/admin/stats
 * Protected admin telemetry endpoint
 */
router.get("/stats", authenticate, getAdminStats);

export default router;
