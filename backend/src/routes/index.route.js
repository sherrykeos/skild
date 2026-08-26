import { Router } from "express";

import { router as authRouter } from "../modules/auth/index.js";
import skillRoutes from "../modules/skills/skill.routes.js";

const router = Router();

//auth routes
router.use("/auth", authRouter);

//skill routes
router.use("/skills", skillRoutes);

export default router;