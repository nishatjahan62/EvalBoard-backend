import { Router } from "express";
import * as controller from "./projects.controller.js";
import { createProjectSchema } from "./projects.validation.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("STUDENT"),
  validate(createProjectSchema),
  asyncHandler(controller.createProject),
);

router.get(
  "/me",
  authorize("STUDENT"),
  asyncHandler(controller.getMyProject),
);

export default router;
