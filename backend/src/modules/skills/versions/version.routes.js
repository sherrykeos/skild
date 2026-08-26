import { Router } from "express";
import authenticate from "../../auth/src/auth.middleware.js";
import validate from "../../../middlewares/validate.js";
import { verifyAccessToken } from "../../auth/services/jwt.service.js";
import { findUserById } from "../../auth/src/auth.repository.js";
import {
  createVersionSchema,
  updateVersionSchema,
  versionParamsSchema,
} from "./version.schema.js";
import {
  createVersion,
  getVersions,
  getVersionById,
  updateVersion,
  deleteVersion,
} from "./version.controller.js";

const router = Router({ mergeParams: true });

// Optional auth helper to decode token if present, but not enforce it
async function optionalAuthenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1];
      const payload = verifyAccessToken(token);
      const user = await findUserById(payload.userId);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Proceed as unauthenticated if token verification fails
  }
  next();
}

router.post(
  "/",
  authenticate,
  validate(versionParamsSchema, "params"),
  validate(createVersionSchema),
  createVersion
);

router.get(
  "/",
  optionalAuthenticate,
  validate(versionParamsSchema, "params"),
  getVersions
);

router.get(
  "/:versionId",
  optionalAuthenticate,
  validate(versionParamsSchema, "params"),
  getVersionById
);

router.patch(
  "/:versionId",
  authenticate,
  validate(versionParamsSchema, "params"),
  validate(updateVersionSchema),
  updateVersion
);

router.delete(
  "/:versionId",
  authenticate,
  validate(versionParamsSchema, "params"),
  deleteVersion
);

export default router;
