import { Router } from "express";
import validate from "../../middlewares/validate.js";
import {
  marketplaceQuerySchema,
  marketplaceSlugSchema,
} from "./marketplace.schema.js";
import {
  getSkills,
  getSkillBySlug,
} from "./marketplace.controller.js";

const router = Router();

/**
 * GET /api/marketplace/skills
 * Public discovery endpoint (browse, search, category filter, tag filter, sort, paginate)
 */
router.get(
  "/skills",
  validate(marketplaceQuerySchema, "query"),
  getSkills
);

/**
 * GET /api/marketplace/skills/:slug
 * Public skill detail view endpoint
 */
router.get(
  "/skills/:slug",
  validate(marketplaceSlugSchema, "params"),
  getSkillBySlug
);

export default router;
