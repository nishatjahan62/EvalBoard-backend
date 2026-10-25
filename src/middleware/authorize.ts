
import type { RequestHandler } from "express";
import type { UserRole } from "./authenticate.js";
import { AppError } from "../utils/app-error.js";

export function authorize(
  ...roles: UserRole[]
): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError(401, "Authentication required."),
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          "You do not have permission to perform this action.",
        ),
      );
    }

    next();
  };
}
