import { Router } from "express";

import { router as authRouter } from "../modules/auth/index.js";
import skillRoutes from "../modules/skills/skill.routes.js";
import marketplaceRoutes from "../modules/marketplace/marketplace.routes.js";

const router = Router();

//auth routes
router.use("/auth", authRouter);

//skill routes
router.use("/skills", skillRoutes);

//marketplace routes
router.use("/marketplace", marketplaceRoutes);

export default router;