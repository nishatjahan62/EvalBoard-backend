
import { Router } from "express";
import * as controller from "./reviews.controller.js";
import {
  listReviewsSchema,
  reviewDecisionSchema,
  reviewParamsSchema,
} from "./reviews.validation.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.use(authenticate);
router.use(authorize("MENTOR", "ADMIN"));

router.get(
  "/",
  validate(listReviewsSchema, "query"),
  asyncHandler(controller.listReviews),
);

router.get(
  "/stats",
  asyncHandler(controller.getStats),
);

router.patch(
  "/:projectId",
  validate(reviewParamsSchema, "params"),
  validate(reviewDecisionSchema),
  asyncHandler(controller.decideProject),
);

export default router;
