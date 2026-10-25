
import { Router } from "express";
import * as controller from "./auth.controller.js";
import {
  signupSchema,
  loginSchema,
} from "./auth.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(controller.signup),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(controller.login),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(controller.me),
);

export default router;
