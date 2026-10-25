
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { AppError } from "@/utils/app-error.js";

export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate: RequestHandler = (
  req,
  _res,
  next,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(
      new AppError(401, "Authentication required."),
    );
  }

  try {
    const token = authorization.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !["STUDENT", "MENTOR", "ADMIN"].includes(
        String(payload.role),
      )
    ) {
      return next(
        new AppError(401, "Invalid authentication token."),
      );
    }

    req.user = {
      id: payload.sub,
      role: payload.role as UserRole,
    };

    next();
  } catch {
    next(
      new AppError(
        401,
        "Invalid or expired authentication token.",
      ),
    );
  }
};
