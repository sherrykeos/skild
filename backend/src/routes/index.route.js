import { Router } from "express";

import { router as authRouter } from "../modules/auth/index.js";
import skillRoutes from "../modules/skills/skill.routes.js";
import marketplaceRoutes from "../modules/marketplace/marketplace.routes.js";
import engagementRoutes from "../modules/engagement/engagement.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import githubRoutes from "../modules/github/github.routes.js";

const router = Router();

//auth routes
router.use("/auth", authRouter);

//user routes
router.use("/users", userRoutes);

//github routes
router.use("/github", githubRoutes);

//skill routes
router.use("/skills", skillRoutes);

//marketplace routes
router.use("/marketplace", marketplaceRoutes);

//engagement routes
router.use("/", engagementRoutes);

export default router;